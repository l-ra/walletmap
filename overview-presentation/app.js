import { slides, deckMeta } from './slides.mjs';
import { enhanceContent } from './enhance.mjs';
import { initInteractiveDemos } from './interactive.mjs';

const params = new URLSearchParams(location.search);
const projectionMode = params.get('projection') === '1';
const embeddedMode = params.get('embedded') === '1';
const syncEnabled = !embeddedMode;
const CHANNEL_NAME = 'eudiw-presenter';
const STORAGE_KEY = 'eudiw-presenter-state';
const syncChannel = syncEnabled && 'BroadcastChannel' in window
  ? new BroadcastChannel(CHANNEL_NAME)
  : null;

document.body.classList.toggle('projection-mode', projectionMode);
document.body.classList.toggle('embedded-mode', embeddedMode);

const deck = document.querySelector('#deck');
const progress = document.querySelector('#progress');
const speakerPanel = document.querySelector('#speaker-panel');
const overviewDialog = document.querySelector('#overview-dialog');
const overviewList = document.querySelector('#overview-list');
const overviewDuration = document.querySelector('#overview-duration');
const depthButton = document.querySelector('#depth');
const notesButton = document.querySelector('#notes');
const fullscreenButton = document.querySelector('#fullscreen-view');
const projectionFullscreenButton = document.querySelector('#projection-fullscreen');

let index = 0;
let coreOnly = params.get('depth') === 'core';
let notesVisible = params.get('notes') === '1' && !embeddedMode && !projectionMode;

function visibleSlides() {
  return slides.filter((slide) => !coreOnly || slide.level === 'core');
}

function currentSlide() {
  return visibleSlides()[index] ?? visibleSlides()[0];
}

function totalMinutes(list = visibleSlides()) {
  return list.reduce((sum, slide) => sum + slide.minutes, 0);
}

function sourceList(slide) {
  if (!slide.sources?.length) return '';
  return `<div class="note-sources"><strong>Zdroje k tomuto slidu</strong><ul>${slide.sources.map((source) => `<li><a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a></li>`).join('')}</ul></div>`;
}

function publishDeckState() {
  if (!syncEnabled) return;
  const state = {
    type: 'state',
    absoluteIndex: slides.indexOf(currentSlide()),
    coreOnly,
    sentAt: Date.now()
  };
  syncChannel?.postMessage(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyRemoteState(state) {
  if (!syncEnabled || state?.type !== 'state' || !Number.isInteger(state.absoluteIndex)) return;
  const target = slides[state.absoluteIndex];
  if (!target) return;
  const depthChanged = coreOnly !== Boolean(state.coreOnly);
  coreOnly = Boolean(state.coreOnly);
  const found = visibleSlides().findIndex((slide) => slide.id === target.id);
  if (found < 0) return;
  if (depthChanged) renderOverview();
  if (found !== index || currentSlide().id !== target.id || depthChanged) {
    index = found;
    render();
  }
}

function navigateFromFragment() {
  const match = location.hash.match(/^#?slide-(\d+)$/);
  if (!match) return;
  const target = slides[Number(match[1]) - 1];
  if (!target) return;

  const previousId = currentSlide()?.id;
  const previousDepth = coreOnly;
  if (coreOnly && target.level !== 'core') coreOnly = false;
  const found = visibleSlides().findIndex((slide) => slide.id === target.id);
  if (found < 0) return;
  index = found;
  if (previousDepth !== coreOnly) renderOverview();
  if (previousId !== target.id || previousDepth !== coreOnly) render();
}

function render() {
  const list = visibleSlides();
  if (index >= list.length) index = list.length - 1;
  const slide = currentSlide();
  document.title = `${slide.title} · ${deckMeta.shortTitle}`;
  deck.innerHTML = `
    <article class="slide slide-${slide.kind ?? 'standard'}" data-slide-id="${slide.id}" data-level="${slide.level}" data-part="${slide.part}">
      <div class="slide-body">
        <h1>${slide.title}</h1>
        ${slide.subtitle ? `<p class="subtitle">${slide.subtitle}</p>` : ''}
        <div class="content">${slide.html}</div>
      </div>
    </article>`;

  progress.textContent = `${list.indexOf(slide) + 1} / ${list.length} · ${totalMinutes()} min`;
  speakerPanel.innerHTML = `
    <div class="note-head">
      <div><strong>${slide.title}</strong><span>${slide.minutes} min · ${slide.level === 'core' ? 'jádro' : 'prohloubení'}</span></div>
      <button id="close-notes" type="button" aria-label="Zavřít poznámky">×</button>
    </div>
    <div class="note-copy">${slide.notes}</div>
    ${sourceList(slide)}`;
  enhanceContent(deck);
  initInteractiveDemos(deck);
  enhanceContent(speakerPanel);
  speakerPanel.setAttribute('aria-hidden', String(!notesVisible));
  document.body.classList.toggle('notes-open', notesVisible);
  notesButton.classList.toggle('active', notesVisible);
  depthButton.textContent = coreOnly ? 'Jen jádro' : 'Plná hloubka';
  depthButton.classList.toggle('active', coreOnly);
  document.querySelector('#close-notes')?.addEventListener('click', toggleNotes);
  location.hash = `slide-${slides.indexOf(slide) + 1}`;
  publishDeckState();
}

function go(delta) {
  const list = visibleSlides();
  index = Math.max(0, Math.min(list.length - 1, index + delta));
  render();
}

function toggleNotes() {
  notesVisible = !notesVisible;
  render();
}

function toggleDepth() {
  const id = currentSlide().id;
  coreOnly = !coreOnly;
  const list = visibleSlides();
  const sameSlide = list.findIndex((slide) => slide.id === id);
  index = sameSlide >= 0
    ? sameSlide
    : Math.min(slides.findIndex((slide) => slide.id === id), list.length - 1);
  index = Math.max(0, index);
  renderOverview();
  render();
}

function renderOverview() {
  const list = visibleSlides();
  overviewList.innerHTML = list.map((slide, i) => `
    <li>
      <button type="button" data-index="${i}">
        <span>${String(i + 1).padStart(2, '0')}</span>
        <strong>${slide.title}</strong>
        <small>${slide.minutes} min · ${slide.level === 'core' ? 'jádro' : 'prohloubení'}</small>
      </button>
    </li>`).join('');
  enhanceContent(overviewList);
  overviewDuration.textContent = `${list.length} slidů · přibližně ${totalMinutes(list)} minut výkladu`;
  overviewList.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
    index = Number(button.dataset.index);
    overviewDialog.close();
    render();
  }));
}

function showOverview() {
  renderOverview();
  overviewDialog.showModal();
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    projectionFullscreenButton.textContent = 'Celou obrazovku povolte v prohlížeči';
  }
}

function updateFullscreenControls() {
  const active = Boolean(document.fullscreenElement);
  fullscreenButton.textContent = active ? 'Ukončit celou obrazovku' : 'Celá obrazovka';
  projectionFullscreenButton.hidden = active;
}

document.querySelector('#prev').addEventListener('click', () => go(-1));
document.querySelector('#next').addEventListener('click', () => go(1));
document.querySelector('#notes').addEventListener('click', toggleNotes);
document.querySelector('#depth').addEventListener('click', toggleDepth);
document.querySelector('#overview').addEventListener('click', showOverview);
document.querySelector('#close-overview').addEventListener('click', () => overviewDialog.close());
fullscreenButton.addEventListener('click', toggleFullscreen);
projectionFullscreenButton.addEventListener('click', toggleFullscreen);
document.querySelector('#presenter-view').addEventListener('click', () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    type: 'state',
    absoluteIndex: slides.indexOf(currentSlide()),
    coreOnly,
    sentAt: Date.now()
  }));
  const depth = coreOnly ? '?depth=core' : '';
  window.open(`presenter.html${depth}`, 'eudiw-presenter', 'popup=yes,width=1500,height=950');
});

syncChannel?.addEventListener('message', (event) => applyRemoteState(event.data));
if (syncEnabled) {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && event.newValue) applyRemoteState(JSON.parse(event.newValue));
  });
}
window.addEventListener('hashchange', navigateFromFragment);

document.addEventListener('keydown', (event) => {
  if (event.target instanceof Element && event.target.closest('input, textarea, select, button, a, [contenteditable="true"]')) return;
  if (overviewDialog.open && event.key !== 'Escape') return;
  if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); go(1); }
  if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); go(-1); }
  if (event.key.toLowerCase() === 'n') toggleNotes();
  if (event.key.toLowerCase() === 'd') toggleDepth();
  if (event.key.toLowerCase() === 'o') showOverview();
  if (event.key.toLowerCase() === 'f') toggleFullscreen();
  if (event.key === 'Home') { index = 0; render(); }
  if (event.key === 'End') { index = visibleSlides().length - 1; render(); }
});
document.addEventListener('fullscreenchange', updateFullscreenControls);

const hashMatch = location.hash.match(/^#?slide-(\d+)$/);
if (hashMatch) {
  const absolute = slides[Number(hashMatch[1]) - 1];
  if (absolute && coreOnly && absolute.level !== 'core') coreOnly = false;
  const found = visibleSlides().findIndex((slide) => slide.id === absolute?.id);
  if (found >= 0) index = found;
}

renderOverview();
render();
updateFullscreenControls();
