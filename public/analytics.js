(function () {
  'use strict';

  var CONSENT_COOKIE = 'wm_consent';
  var CONSENT_KEY = 'wm_consent';
  var COLLECT_URL = '/api/collect.php';
  var CONSENT_URL = '/api/consent.php';
  var CONSENT_MAX_AGE = 183 * 24 * 3600;

  var dialog = document.getElementById('wm-consent-dialog');
  if (!dialog) return;

  function privacyRejected() {
    return navigator.globalPrivacyControl === true || navigator.doNotTrack === '1';
  }

  function readCookie(name) {
    var parts = document.cookie.split(';');
    for (var i = 0; i < parts.length; i += 1) {
      var part = parts[i].trim();
      if (part.indexOf(name + '=') === 0) {
        return decodeURIComponent(part.slice(name.length + 1));
      }
    }
    return '';
  }

  function writeConsentCookie(value) {
    var secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie =
      CONSENT_COOKIE +
      '=' +
      encodeURIComponent(value) +
      '; Path=/; Max-Age=' +
      CONSENT_MAX_AGE +
      '; SameSite=Lax' +
      secure;
  }

  function storedConsent() {
    try {
      var local = localStorage.getItem(CONSENT_KEY);
      if (local === 'granted' || local === 'denied') return local;
    } catch (e) {
      /* ignore */
    }
    var cookie = readCookie(CONSENT_COOKIE);
    if (cookie === 'granted' || cookie === 'denied') return cookie;
    return '';
  }

  function persistConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch (e) {
      /* ignore */
    }
    writeConsentCookie(value);
  }

  function postJson(url, payload) {
    var body = JSON.stringify(payload);
    var blob = new Blob([body], { type: 'application/json' });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, blob);
      return;
    }
    fetch(url, {
      method: 'POST',
      body: body,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      keepalive: true,
    }).catch(function () {});
  }

  function collectPageview() {
    if (privacyRejected() || storedConsent() !== 'granted') return;
    postJson(COLLECT_URL, {
      consent: 'granted',
      path: location.pathname || '/',
      referrer: document.referrer || '',
    });
  }

  function applyConsent(value, recordOnServer) {
    persistConsent(value);
    if (recordOnServer) {
      postJson(CONSENT_URL, { action: value });
    }
    if (value === 'granted') {
      collectPageview();
    }
    closeDialog();
  }

  function openDialog() {
    if (typeof dialog.show === 'function') {
      if (!dialog.open) dialog.show();
    } else {
      dialog.setAttribute('open', '');
    }
    var rejectBtn = dialog.querySelector('[data-wm-consent="denied"]');
    if (rejectBtn) rejectBtn.focus();
  }

  function closeDialog() {
    if (typeof dialog.close === 'function' && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  }

  dialog.addEventListener('click', function (event) {
    var target = event.target;
    if (!(target instanceof HTMLElement)) return;
    var choice = target.getAttribute('data-wm-consent');
    if (choice === 'granted' || choice === 'denied') {
      applyConsent(choice, true);
    }
  });

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest('.wm-consent-open')) {
      event.preventDefault();
      openDialog();
    }
  });

  if (privacyRejected()) {
    if (storedConsent() !== 'denied') persistConsent('denied');
    return;
  }

  var current = storedConsent();
  if (current === 'granted') {
    collectPageview();
    return;
  }
  if (current === 'denied') {
    return;
  }
  openDialog();
})();
