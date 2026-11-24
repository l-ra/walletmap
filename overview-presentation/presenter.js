import { slides } from './slides.mjs';
import { enhanceContent } from './enhance.mjs';

const CHANNEL_NAME = 'eudiw-presenter';
const STORAGE_KEY = 'eudiw-presenter-state';
const TIMER_KEY = 'eudiw-presenter-end-time';
const channel = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL_NAME) : null;

const currentTitle = document.querySelector('#current-title');
const progress = document.querySelector('#presenter-progress');
const currentFrame = document.querySelector('#current-frame');
const slideCountdown = document.querySelector('#slide-countdown');
const nextTitle = document.querySelector('#next-title');
const nextFrame = document.querySelector('#next-frame');
const endCard = document.querySelector('#end-card');
const noteTitle = document.querySelector('#notes-title');
const noteCopy = document.querySelector('#presenter-note-copy');
const sources = document.querySelector('#presenter-sources');
const remaining = document.querySelector('#content-remaining');
const depthButton = document.querySelector('#presenter-depth');
const status = document.querySelector('#presenter-status');
const countdown = document.querySelector('#countdown');
const endTimeInput = document.querySelector('#end-time');

let index = 0;
let coreOnly = new URLSearchParams(location.search).get('depth') === 'core';
let projectionWindow = null;
let endTimestamp = Number(localStorage.getItem(TIMER_KEY)) || null;
let timedSlideId = null;
let slideStartedAt = Date.now();
let slideDurationMs = 0;

function visibleSlides() {
  return slides.filter((slide) => !coreOnly || slide.level === 'core');
}

function currentSlide() {
  return visibleSlides()[index] ?? visibleSlides()[0];
}

function absoluteIndex(slide) {
  return slides.indexOf(slide);
}

function remainingMinutes() {
  return visibleSlides().slice(index + 1).reduce((sum, slide) => sum + slide.minutes, 0);
}

function sourceMarkup(slide) {
  if (!slide.sources?.length) return '';
  return `<strong>Zdroje</strong><ul>${slide.sources.map((source) => `<li><a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a></li>`).join('')}</ul>`;
}

function announce(message) {
  status.textContent = message;
  clearTimeout(announce.timer);
  announce.timer = setTimeout(() => { status.textContent = ''; }, 3500);
}

function sendState() {
  const state = { type: 'state', absoluteIndex: absoluteIndex(currentSlide()), coreOnly, sentAt: Date.now() };
  channel?.postMessage(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function frameUrl(slide) {
  const depth = coreOnly ? '&depth=core' : '';
  return `index.html?embedded=1${depth}#slide-${absoluteIndex(slide) + 1}`;
}

function setFrame(frame, slide) {
  const url = frameUrl(slide);
  const absoluteUrl = new URL(url, location.href).href;
  if (frame.src !== absoluteUrl) frame.src = url;
}

function fitPreviewFrames() {
  for (const frame of [currentFrame, nextFrame]) {
    if (frame.hidden) continue;
    const shell = frame.parentElement;
    if (!shell?.clientWidth || !shell?.clientHeight) continue;
    const scale = Math.min(shell.clientWidth / 1600, shell.clientHeight / 900);
    frame.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }
}

function absoluteIndexFromFragment() {
  const match = location.hash.match(/^#?slide-(\d+)$/);
  if (!match) return -1;
  const absolute = Number(match[1]) - 1;
  return absolute >= 0 && absolute < slides.length ? absolute : -1;
}

function selectAbsoluteSlide(absolute, requestedCoreOnly = coreOnly) {
  const target = slides[absolute];
  if (!target) return false;

  coreOnly = Boolean(requestedCoreOnly);
  let found = visibleSlides().findIndex((slide) => slide.id === target.id);
  if (found < 0 && coreOnly) {
    coreOnly = false;
    found = visibleSlides().findIndex((slide) => slide.id === target.id);
  }
  if (found < 0) return false;
  index = found;
  return true;
}

function render() {
  const list = visibleSlides();
  index = Math.max(0, Math.min(index, list.length - 1));
  const current = currentSlide();
  const next = list[index + 1];

  if (timedSlideId !== current.id) resetSlideTimer(current);
  setFrame(currentFrame, current);
  currentTitle.textContent = current.title;
  progress.textContent = `${index + 1} / ${list.length} · ${current.section} · ${current.level === 'core' ? 'jádro' : 'prohloubení'} · plán ${current.minutes} min`;
  noteTitle.textContent = current.title;
  noteCopy.innerHTML = current.notes;
  sources.innerHTML = sourceMarkup(current);
  enhanceContent(noteCopy);
  enhanceContent(sources);
  depthButton.textContent = coreOnly ? 'Jen jádro' : 'Plná hloubka';
  depthButton.classList.toggle('active', coreOnly);
  remaining.textContent = `Odhad obsahu po aktuálním slidu: ${remainingMinutes()} min`;

  if (next) {
    nextTitle.textContent = next.title;
    nextFrame.hidden = false;
    endCard.hidden = true;
    setFrame(nextFrame, next);
  } else {
    nextTitle.textContent = 'Konec prezentace';
    nextFrame.hidden = true;
    endCard.hidden = false;
  }

  enhanceContent(currentTitle);
  enhanceContent(noteTitle);
  enhanceContent(nextTitle);

  requestAnimationFrame(() => requestAnimationFrame(fitPreviewFrames));

  const fragment = `#slide-${absoluteIndex(current) + 1}`;
  if (location.hash !== fragment) location.hash = fragment;

  sendState();
}

function go(delta) {
  index = Math.max(0, Math.min(visibleSlides().length - 1, index + delta));
  render();
}

function setDepth() {
  const id = currentSlide().id;
  coreOnly = !coreOnly;
  const found = visibleSlides().findIndex((slide) => slide.id === id);
  index = found >= 0 ? found : Math.min(index, visibleSlides().length - 1);
  render();
}

function openProjection() {
  const current = currentSlide();
  const depth = coreOnly ? '&depth=core' : '';
  projectionWindow = window.open(
    `index.html?projection=1${depth}#slide-${absoluteIndex(current) + 1}`,
    'eudiw-projection',
    'popup=yes,width=1600,height=900'
  );
  if (!projectionWindow) {
    announce('Prohlížeč zablokoval projekční okno. Povolte vyskakovací okna pro tuto adresu.');
    return;
  }
  announce('Projekční okno otevřeno. Přesuňte je na projektor a v něm stiskněte F nebo tlačítko pro celou obrazovku.');
  setTimeout(sendState, 500);
}

function acceptRemoteState(state) {
  if (state?.type !== 'state' || !Number.isInteger(state.absoluteIndex)) return;
  const previousId = currentSlide()?.id;
  const previousDepth = coreOnly;
  if (!selectAbsoluteSlide(state.absoluteIndex, state.coreOnly)) return;
  if (previousId !== currentSlide()?.id || previousDepth !== coreOnly) render();
}

function navigateFromFragment() {
  const absolute = absoluteIndexFromFragment();
  if (absolute < 0) return;
  const previousId = currentSlide()?.id;
  const previousDepth = coreOnly;
  if (!selectAbsoluteSlide(absolute, coreOnly)) return;
  if (previousId !== currentSlide()?.id || previousDepth !== coreOnly) render();
}

channel?.addEventListener('message', (event) => acceptRemoteState(event.data));
window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY && event.newValue) acceptRemoteState(JSON.parse(event.newValue));
});
window.addEventListener('hashchange', navigateFromFragment);
window.addEventListener('resize', fitPreviewFrames);

function setEndTimestamp(value) {
  endTimestamp = value;
  if (value) localStorage.setItem(TIMER_KEY, String(value));
  else localStorage.removeItem(TIMER_KEY);
  updateCountdown();
}

function setEndFromInput() {
  if (!endTimeInput.value) {
    announce('Nejprve zadejte čas konce.');
    return;
  }
  const [hours, minutes] = endTimeInput.value.split(':').map(Number);
  const end = new Date();
  end.setHours(hours, minutes, 0, 0);
  if (end.getTime() <= Date.now()) end.setDate(end.getDate() + 1);
  setEndTimestamp(end.getTime());
}

function formatDuration(milliseconds) {
  const negative = milliseconds < 0;
  const seconds = Math.floor(Math.abs(milliseconds) / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return `${negative ? '−' : ''}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

function formatSlideDuration(milliseconds) {
  const seconds = Math.floor(Math.abs(milliseconds) / 1000);
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

function resetSlideTimer(slide = currentSlide()) {
  timedSlideId = slide.id;
  slideStartedAt = Date.now();
  slideDurationMs = slide.minutes * 60 * 1000;
  updateSlideCountdown();
}

function updateSlideCountdown() {
  const difference = slideDurationMs - (Date.now() - slideStartedAt);
  slideCountdown.classList.remove('warning', 'overtime');
  slideCountdown.textContent = difference >= 0
    ? `Tento slide ${formatSlideDuration(difference)}`
    : `Přes čas ${formatSlideDuration(difference)}`;
  if (difference < 0) slideCountdown.classList.add('overtime');
  else if (difference <= 30 * 1000) slideCountdown.classList.add('warning');
}

function updateCountdown() {
  countdown.classList.remove('warning', 'overtime');
  if (!endTimestamp) {
    countdown.textContent = 'Čas není nastaven';
    return;
  }
  const difference = endTimestamp - Date.now();
  countdown.textContent = difference >= 0
    ? `Do konce ${formatDuration(difference)}`
    : `Přes čas ${formatDuration(difference)}`;
  if (difference < 0) countdown.classList.add('overtime');
  else if (difference <= 10 * 60 * 1000) countdown.classList.add('warning');
}

document.querySelector('#presenter-prev').addEventListener('click', () => go(-1));
document.querySelector('#presenter-next').addEventListener('click', () => go(1));
document.querySelector('#presenter-depth').addEventListener('click', setDepth);
document.querySelector('#open-projection').addEventListener('click', openProjection);
document.querySelector('#start-90').addEventListener('click', () => setEndTimestamp(Date.now() + 90 * 60 * 1000));
document.querySelector('#set-end').addEventListener('click', setEndFromInput);
document.querySelector('#clear-timer').addEventListener('click', () => setEndTimestamp(null));
slideCountdown.addEventListener('click', () => resetSlideTimer());
endTimeInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') setEndFromInput(); });

document.addEventListener('keydown', (event) => {
  if (event.target instanceof HTMLInputElement) return;
  if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); go(1); }
  if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); go(-1); }
  if (event.key === 'Home') { index = 0; render(); }
  if (event.key === 'End') { index = visibleSlides().length - 1; render(); }
});

const initialFragment = absoluteIndexFromFragment();
if (initialFragment >= 0) {
  selectAbsoluteSlide(initialFragment, coreOnly);
} else {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored && Date.now() - stored.sentAt < 12 * 60 * 60 * 1000) {
      selectAbsoluteSlide(stored.absoluteIndex, stored.coreOnly);
    }
  } catch {}
}

updateCountdown();
updateSlideCountdown();
setInterval(() => {
  updateCountdown();
  updateSlideCountdown();
}, 1000);
render();
