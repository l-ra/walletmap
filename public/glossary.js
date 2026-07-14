(function () {
  'use strict';

  const dataEl = document.getElementById('glossary-data');
  const modal = document.getElementById('glossary-modal');
  const modalContent = document.getElementById('glossary-modal-content');

  if (!dataEl || !modal || !modalContent) return;

  /** @type {Record<string, any>} */
  let glossary;
  try {
    glossary = JSON.parse(dataEl.textContent || '{}');
  } catch {
    return;
  }

  const isTouch =
    window.matchMedia('(hover: none), (pointer: coarse)').matches ||
    'ontouchstart' in window;

  /** @type {HTMLElement | null} */
  let openTooltipWrap = null;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function paragraphs(text) {
    return String(text)
      .split(/\n\n+/)
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => `<p>${escapeHtml(part)}</p>`)
      .join('');
  }

  function closeTooltip() {
    if (openTooltipWrap) {
      openTooltipWrap.classList.remove('is-tooltip-open');
      openTooltipWrap = null;
    }
  }

  function openModal(termId) {
    const entry = glossary[termId];
    if (!entry) return;

    closeTooltip();

    const related = (entry.related || [])
      .filter((id) => glossary[id])
      .map(
        (id) =>
          `<li><button type="button" data-glossary-open="${escapeHtml(id)}">${escapeHtml(glossary[id].abbr)}</button></li>`,
      )
      .join('');

    const sources = (entry.sources || [])
      .map(
        (source) =>
          `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)}</a></li>`,
      )
      .join('');

    modalContent.innerHTML = [
      `<span class="glossary-modal__abbr">${escapeHtml(entry.abbr)}</span>`,
      `<h2 class="glossary-modal__title" id="glossary-modal-title">${escapeHtml(entry.fullName.cs)}</h2>`,
      `<p class="glossary-modal__short">${escapeHtml(entry.shortDescription)}</p>`,
      entry.longDescription
        ? `<div class="glossary-modal__long">${paragraphs(entry.longDescription)}</div>`
        : '',
      related
        ? `<h3 class="glossary-modal__section-title">Související zkratky</h3><ul class="glossary-modal__related">${related}</ul>`
        : '',
      sources
        ? `<h3 class="glossary-modal__section-title">Zdroje</h3><ul class="glossary-modal__sources">${sources}</ul>`
        : '',
    ].join('');

    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
  }

  function closeModal() {
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
  }

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const openBtn = target.closest('[data-glossary-open]');
    if (openBtn) {
      event.preventDefault();
      event.stopPropagation();
      const termId = openBtn.getAttribute('data-glossary-open');
      if (termId) openModal(termId);
      return;
    }

    const closeBtn = target.closest('[data-glossary-close]');
    if (closeBtn) {
      event.preventDefault();
      closeModal();
      return;
    }

    const abbr = target.closest('.glossary-abbr');
    if (abbr && isTouch) {
      event.preventDefault();
      const wrap = abbr.closest('.glossary-term-wrap');
      if (!wrap) return;

      if (openTooltipWrap === wrap) {
        closeTooltip();
        return;
      }

      closeTooltip();
      wrap.classList.add('is-tooltip-open');
      openTooltipWrap = wrap;
      return;
    }

    if (!target.closest('.glossary-term-wrap')) {
      closeTooltip();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeTooltip();
      if (modal.hasAttribute('open')) closeModal();
    }
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  modal.addEventListener('close', () => {
    modalContent.innerHTML = '';
  });

  document.querySelectorAll('[data-glossary-open-index]').forEach((button) => {
    button.addEventListener('click', () => {
      const termId = button.getAttribute('data-glossary-open-index');
      if (termId) openModal(termId);
    });
  });
})();
