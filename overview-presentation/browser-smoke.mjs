import { spawn } from 'node:child_process';
import { slides } from './slides.mjs';

const baseUrl = process.argv[2] ?? 'http://127.0.0.1:8080/';
const port = 9223;
const chrome = spawn('google-chrome', [
  '--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--incognito',
  `--remote-debugging-port=${port}`,
  '--user-data-dir=/tmp/eudi-browser-smoke',
  '--window-size=1600,900',
  'about:blank'
], { stdio: 'ignore' });

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function target() {
  for (let i = 0; i < 50; i += 1) {
    try {
      const pages = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
      const page = pages.find((item) => item.type === 'page');
      if (page) return page;
    } catch {}
    await pause(100);
  }
  throw new Error('Chrome DevTools endpoint se nespustil.');
}

const page = await target();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve, { once: true });
  ws.addEventListener('error', reject, { once: true });
});

let sequence = 0;
const pending = new Map();
ws.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

function call(method, params = {}) {
  const id = ++sequence;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  return result.result.value;
}

async function evaluateTarget(webSocketDebuggerUrl, expression) {
  const targetSocket = new WebSocket(webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    targetSocket.addEventListener('open', resolve, { once: true });
    targetSocket.addEventListener('error', reject, { once: true });
  });
  const result = await new Promise((resolve, reject) => {
    targetSocket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id !== 1) return;
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    });
    targetSocket.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: { expression, awaitPromise: true, returnByValue: true }
    }));
  });
  targetSocket.close();
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  return result.result.value;
}

async function scan(url) {
  await call('Page.navigate', { url });
  for (let i = 0; i < 50; i += 1) {
    if (await evaluate(`Boolean(document.querySelector('.slide'))`)) break;
    await pause(100);
  }
  return evaluate(`(async () => {
    const found = [];
    const wait = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    for (let i = 0; i < 100; i += 1) {
      await wait();
      const slide = document.querySelector('.slide');
      const body = document.querySelector('.slide-body');
      const content = document.querySelector('.content');
      const progress = document.querySelector('#progress').textContent;
      const images = [...document.querySelectorAll('.content img')];
      found.push({
        title: document.querySelector('h1').textContent.trim(),
        progress,
        bodyOverflow: body.scrollHeight > body.clientHeight + 2,
        contentOverflow: content.scrollHeight > content.clientHeight + 2,
        brokenImages: images.filter((img) => !img.complete || !img.naturalWidth).length,
        slideOutsideViewport: slide.getBoundingClientRect().bottom > innerHeight + 1,
        serviceMetadata: document.querySelectorAll('.slide-head, .slide > footer').length,
        tooltips: document.querySelectorAll('.slide abbr[title]').length,
        highlightedCode: document.querySelectorAll('.slide pre code[data-highlighted] span[class^="tok-"]').length
      });
      const [, position, total] = progress.match(/^(\\d+) \\/ (\\d+)/).map(Number);
      if (position === total) break;
      document.querySelector('#next').click();
    }
    document.querySelector('#notes').click();
    await wait();
    const notesOpen = document.querySelector('#speaker-panel').getAttribute('aria-hidden') === 'false';
    document.querySelector('#notes').click();
    return { found, notesOpen };
  })()`);
}

async function openInteractiveSlide(id) {
  const absoluteIndex = slides.findIndex((slide) => slide.id === id);
  if (absoluteIndex < 0) throw new Error(`Interaktivní slide ${id} neexistuje.`);
  const url = new URL(`index.html#slide-${absoluteIndex + 1}`, baseUrl).href;
  await call('Page.navigate', { url });
  for (let i = 0; i < 70; i += 1) {
    if (await evaluate(`document.querySelector('[data-demo]')?.dataset.ready === 'true'`)) return;
    await pause(100);
  }
  throw new Error(`Interaktivní slide ${id} se neinicializoval.`);
}

async function scanInteractiveDemos() {
  await openInteractiveSlide('sdjwt-lab');
  const sdJwt = await evaluate(`(async () => {
    const lab = document.querySelector('[data-demo="sdjwt"]');
    const wait = () => new Promise((resolve) => setTimeout(resolve, 180));
    const presentation = lab.querySelector('[data-role="presentation"]');
    const kbPayload = lab.querySelector('[data-role="kb-payload"]');
    const beforeDisclosure = presentation.title;
    const unchecked = [...lab.querySelectorAll('.disclosure-row input')].find((input) => !input.checked);
    unchecked.click();
    await wait();
    const afterDisclosure = presentation.title;
    const beforeNonce = kbPayload.textContent;
    lab.querySelector('[data-action="nonce"]').click();
    await wait();
    const afterNonce = kbPayload.textContent;
    lab.querySelector('[data-action="expand-token"]').click();
    await wait();
    const inspector = lab.querySelector('[data-role="token-inspector"]');
    const segments = [...inspector.querySelectorAll('.token-segment')];
    inspector.querySelector('.token-segment.issuer-payload').click();
    const issuerDecoded = inspector.querySelector('[data-role="decoded-value"]').textContent;
    inspector.querySelector('.token-segment.disclosure').click();
    const disclosureDecoded = inspector.querySelector('[data-role="decoded-value"]').textContent;
    inspector.querySelector('.token-segment.kb-payload').click();
    const kbDecoded = inspector.querySelector('[data-role="decoded-value"]').textContent;
    inspector.querySelector('[data-action="close-token"]').click();

    const source = JSON.parse(lab.querySelector('[data-role="payload"]').value);
    for (let index = 0; index < 24; index += 1) source['extra_claim_' + index] = 'delší demonstrační hodnota ' + index;
    lab.querySelector('[data-role="payload"]').value = JSON.stringify(source, null, 2);
    lab.querySelector('[data-action="issue"]').click();
    await wait();
    const scrollTargets = [...lab.querySelectorAll('pre, .wire-preview > code, .disclosure-list')];
    const overflowIsScrollable = (element) => {
      const style = getComputedStyle(element);
      const vertical = element.scrollHeight > element.clientHeight + 2;
      const horizontal = element.scrollWidth > element.clientWidth + 2;
      const verticalAllowed = ['auto', 'scroll'].includes(style.overflowY);
      const horizontalAllowed = ['auto', 'scroll'].includes(style.overflowX);
      return (!vertical || verticalAllowed) && (!horizontal || horizontalAllowed);
    };
    const canActuallyScroll = (element) => {
      if (element.scrollHeight <= element.clientHeight + 2) return null;
      element.scrollTop = element.scrollHeight;
      const moved = element.scrollTop > 0;
      element.scrollTop = 0;
      return moved;
    };
    const clipped = [...lab.querySelectorAll('pre, .wire-preview > code, .disclosure-list')]
      .filter((element) => !overflowIsScrollable(element))
      .map((element) => element.className || element.parentElement?.className || element.tagName);
    return {
      ready: lab.dataset.ready,
      disclosureCount: lab.querySelectorAll('.disclosure-row').length,
      checks: lab.querySelectorAll('[data-role="checks"] .check-ok').length,
      disclosureChanged: beforeDisclosure !== afterDisclosure,
      nonceChanged: beforeNonce !== afterNonce,
      inspectorHiddenAfterClose: inspector.hidden,
      segmentKinds: [...new Set(segments.map((segment) => segment.dataset.segment))],
      segmentTooltips: segments.every((segment) => Boolean(segment.title)),
      issuerDecoded,
      disclosureDecoded,
      kbDecoded,
      scrollableOverflowCount: scrollTargets.filter((element) => canActuallyScroll(element) === true).length,
      clipped
    };
  })()`);

  await openInteractiveSlide('verification-lab');
  const verification = await evaluate(`(async () => {
    const lab = document.querySelector('[data-demo="verification"]');
    const wait = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const clipped = [];
    let scrollableMessageSeen = false;
    let messageScrollWorked = false;
    const hasBlockedOverflow = (element) => {
      const style = getComputedStyle(element);
      return (element.scrollHeight > element.clientHeight + 2 && !['auto', 'scroll'].includes(style.overflowY)) ||
        (element.scrollWidth > element.clientWidth + 2 && !['auto', 'scroll'].includes(style.overflowX));
    };
    for (const mode of ['redirect', 'same', 'cross', 'direct']) {
      lab.querySelector('[data-option="mode"][data-value="' + mode + '"]').click();
      for (const [index, step] of [...lab.querySelectorAll('[data-role="step-bar"] button')].entries()) {
        step.click();
        await wait();
        for (const element of lab.querySelectorAll('.protocol-explanation, .protocol-message pre')) {
          if (hasBlockedOverflow(element)) {
            clipped.push(mode + '/krok-' + (index + 1) + '/' + element.className);
          }
        }
        const messagePane = lab.querySelector('.protocol-message pre');
        if (messagePane.scrollHeight > messagePane.clientHeight + 2) {
          scrollableMessageSeen = true;
          messagePane.scrollTop = messagePane.scrollHeight;
          messageScrollWorked ||= messagePane.scrollTop > 0;
          messagePane.scrollTop = 0;
        }
      }
    }
    lab.querySelector('[data-option="mode"][data-value="direct"]').click();
    lab.querySelectorAll('[data-role="step-bar"] button')[2].click();
    await wait();
    const directQr = lab.querySelector('[data-role="message"]').textContent;
    lab.querySelector('[data-option="mode"][data-value="cross"]').click();
    lab.querySelectorAll('[data-role="step-bar"] button')[5].click();
    await wait();
    const crossBinding = lab.querySelector('[data-role="message"]').textContent;
    return {
      ready: lab.dataset.ready,
      steps: lab.querySelectorAll('[data-role="step-bar"] button').length,
      directQr,
      crossBinding,
      messageOverflowY: getComputedStyle(lab.querySelector('.protocol-message pre')).overflowY,
      scrollableMessageSeen,
      messageScrollWorked,
      clipped: [...new Set(clipped)]
    };
  })()`);

  await openInteractiveSlide('issuance-lab');
  const issuance = await evaluate(`(async () => {
    const lab = document.querySelector('[data-demo="issuance"]');
    const wait = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const clipped = [];
    let scrollableMessageSeen = false;
    let messageScrollWorked = false;
    const hasBlockedOverflow = (element) => {
      const style = getComputedStyle(element);
      return (element.scrollHeight > element.clientHeight + 2 && !['auto', 'scroll'].includes(style.overflowY)) ||
        (element.scrollWidth > element.clientWidth + 2 && !['auto', 'scroll'].includes(style.overflowX));
    };
    for (const grant of ['code', 'pre']) {
      lab.querySelector('[data-option="grant"][data-value="' + grant + '"]').click();
      for (const device of ['same', 'cross']) {
        lab.querySelector('[data-option="device"][data-value="' + device + '"]').click();
        for (const [index, step] of [...lab.querySelectorAll('[data-role="step-bar"] button')].entries()) {
          step.click();
          await wait();
          for (const element of lab.querySelectorAll('.protocol-explanation, .protocol-message pre')) {
            if (hasBlockedOverflow(element)) {
              clipped.push(grant + '/' + device + '/krok-' + (index + 1) + '/' + element.className);
            }
          }
          const messagePane = lab.querySelector('.protocol-message pre');
          if (messagePane.scrollHeight > messagePane.clientHeight + 2) {
            scrollableMessageSeen = true;
            messagePane.scrollTop = messagePane.scrollHeight;
            messageScrollWorked ||= messagePane.scrollTop > 0;
            messagePane.scrollTop = 0;
          }
        }
      }
    }
    lab.querySelector('[data-option="grant"][data-value="pre"]').click();
    lab.querySelector('[data-option="device"][data-value="cross"]').click();
    lab.querySelectorAll('[data-role="step-bar"] button')[2].click();
    await wait();
    const preAuthorizedCross = lab.querySelector('[data-role="message"]').textContent;
    lab.querySelector('[data-option="grant"][data-value="code"]').click();
    lab.querySelector('[data-option="device"][data-value="same"]').click();
    lab.querySelectorAll('[data-role="step-bar"] button')[3].click();
    await wait();
    const authorizationCode = lab.querySelector('[data-role="message"]').textContent;
    lab.querySelectorAll('[data-role="step-bar"] button')[5].click();
    await wait();
    const nonceStep = lab.querySelector('[data-role="step-description"]').textContent + '\\n' + lab.querySelector('[data-role="message"]').textContent;
    lab.querySelectorAll('[data-role="step-bar"] button')[6].click();
    await wait();
    const credentialRequestStep = lab.querySelector('[data-role="step-description"]').textContent + '\\n' + lab.querySelector('[data-role="message"]').textContent;
    return {
      ready: lab.dataset.ready,
      steps: lab.querySelectorAll('[data-role="step-bar"] button').length,
      preAuthorizedCross,
      authorizationCode,
      nonceStep,
      credentialRequestStep,
      messageOverflowY: getComputedStyle(lab.querySelector('.protocol-message pre')).overflowY,
      scrollableMessageSeen,
      messageScrollWorked,
      clipped: [...new Set(clipped)]
    };
  })()`);

  return { sdJwt, verification, issuance };
}

async function scanPresenter(url) {
  await evaluate(`localStorage.setItem('eudiw-presenter-state', JSON.stringify({ type: 'state', absoluteIndex: 0, coreOnly: false, sentAt: Date.now() })); localStorage.removeItem('eudiw-presenter-end-time'); true`);
  await call('Page.navigate', { url });
  for (let i = 0; i < 70; i += 1) {
    if (await evaluate(`Boolean(document.querySelector('#current-frame')?.contentDocument?.querySelector('.slide')) && Boolean(document.querySelector('#next-frame')?.contentDocument?.querySelector('.slide')) && Boolean(document.querySelector('#presenter-note-copy')?.textContent.trim())`)) break;
    await pause(100);
  }
  return evaluate(`(async () => {
    const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
    const frameTitle = (id) => document.querySelector(id)?.contentDocument?.querySelector('.slide h1')?.textContent.trim() ?? '';
    const before = document.querySelector('#current-title').textContent.trim();
    const beforeCurrentFrame = frameTitle('#current-frame');
    const beforeNextFrame = frameTitle('#next-frame');
    document.querySelector('#start-90').click();
    document.querySelector('#presenter-next').click();
    await wait();
    const next = document.querySelector('#current-title').textContent.trim();
    const forwardCurrentFrame = frameTitle('#current-frame');
    const forwardNextFrame = frameTitle('#next-frame');
    document.querySelector('#presenter-prev').click();
    await wait();
    const back = document.querySelector('#current-title').textContent.trim();
    const backCurrentFrame = frameTitle('#current-frame');
    const backNextFrame = frameTitle('#next-frame');
    const currentFrame = document.querySelector('#current-frame');
    const nextFrame = document.querySelector('#next-frame');
    return {
      before,
      next,
      back,
      beforeCurrentFrame,
      beforeNextFrame,
      forwardCurrentFrame,
      forwardNextFrame,
      backCurrentFrame,
      backNextFrame,
      notes: document.querySelector('#presenter-note-copy').textContent.trim().length,
      currentFrame: currentFrame.src,
      nextFrame: nextFrame.src,
      currentFrameLoaded: Boolean(currentFrame.contentDocument?.querySelector('.slide')),
      nextFrameLoaded: Boolean(nextFrame.contentDocument?.querySelector('.slide')),
      fragment: location.hash,
      countdown: document.querySelector('#countdown').textContent.trim(),
      slideCountdown: document.querySelector('#slide-countdown').textContent.trim(),
      currentFrameTransform: getComputedStyle(currentFrame).transform,
      nextFrameTransform: getComputedStyle(nextFrame).transform,
      titleTooltips: document.querySelectorAll('.presenter-position abbr[title], .panel-heading abbr[title]').length,
      noteTooltips: document.querySelectorAll('.presenter-notes abbr[title]').length
    };
  })()`);
}

async function scanProjectionSync() {
  const opened = await call('Runtime.evaluate', {
    expression: `document.querySelector('#open-projection').click(); true`,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true
  });
  if (opened.exceptionDetails) throw new Error(opened.exceptionDetails.text);

  let projectionPage;
  for (let i = 0; i < 50; i += 1) {
    const pages = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
    projectionPage = pages.find((item) => item.type === 'page' && item.url.includes('projection=1'));
    if (projectionPage) break;
    await pause(100);
  }
  if (!projectionPage) throw new Error('Projekční okno se neotevřelo.');

  for (let i = 0; i < 50; i += 1) {
    const ready = await evaluateTarget(projectionPage.webSocketDebuggerUrl, `Boolean(document.querySelector('.slide h1'))`);
    if (ready) break;
    await pause(100);
  }
  const before = await evaluateTarget(projectionPage.webSocketDebuggerUrl, `document.querySelector('.slide h1').textContent.trim()`);
  const fullscreenControl = await evaluateTarget(projectionPage.webSocketDebuggerUrl, `({
    visible: getComputedStyle(document.querySelector('#projection-fullscreen')).display !== 'none',
    supported: typeof document.documentElement.requestFullscreen === 'function'
  })`);
  await evaluate(`document.querySelector('#presenter-next').click(); true`);
  await pause(600);
  const after = await evaluateTarget(projectionPage.webSocketDebuggerUrl, `document.querySelector('.slide h1').textContent.trim()`);
  const presenterTitle = await evaluate(`document.querySelector('#current-title').textContent.trim()`);
  return { before, after, presenterTitle, fullscreenControl };
}

async function scanRegularWindowSync(baseUrl) {
  const regularUrl = new URL('index.html#slide-1', baseUrl).href;
  const opened = await call('Runtime.evaluate', {
    expression: `window.open(${JSON.stringify(regularUrl)}, 'eudiw-regular-smoke', 'popup=yes,width=1600,height=900'); true`,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true
  });
  if (opened.exceptionDetails) throw new Error(opened.exceptionDetails.text);

  let regularPage;
  for (let i = 0; i < 50; i += 1) {
    const pages = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
    regularPage = pages.find((item) =>
      item.type === 'page' &&
      item.url.includes('/index.html') &&
      !item.url.includes('projection=1') &&
      !item.url.includes('embedded=1')
    );
    if (regularPage) break;
    await pause(100);
  }
  if (!regularPage) throw new Error('Běžné prezentační okno se neotevřelo.');

  for (let i = 0; i < 50; i += 1) {
    const ready = await evaluateTarget(regularPage.webSocketDebuggerUrl, `Boolean(document.querySelector('.slide h1'))`);
    if (ready) break;
    await pause(100);
  }
  await pause(400);

  await evaluateTarget(regularPage.webSocketDebuggerUrl, `document.querySelector('#next').click(); true`);
  await pause(500);
  const mainToPresenter = {
    main: await evaluateTarget(regularPage.webSocketDebuggerUrl, `document.querySelector('.slide h1').textContent.trim()`),
    presenter: await evaluate(`document.querySelector('#current-title').textContent.trim()`)
  };

  await evaluate(`document.querySelector('#presenter-next').click(); true`);
  await pause(500);
  const presenterToMain = {
    main: await evaluateTarget(regularPage.webSocketDebuggerUrl, `document.querySelector('.slide h1').textContent.trim()`),
    presenter: await evaluate(`document.querySelector('#current-title').textContent.trim()`)
  };

  await evaluateTarget(regularPage.webSocketDebuggerUrl, `location.hash = '#slide-10'; true`);
  await pause(600);
  const fragmentFromMain = {
    main: await evaluateTarget(regularPage.webSocketDebuggerUrl, `document.querySelector('.slide h1').textContent.trim()`),
    presenter: await evaluate(`document.querySelector('#current-title').textContent.trim()`),
    currentFrame: await evaluate(`document.querySelector('#current-frame').contentDocument.querySelector('.slide h1').textContent.trim()`),
    nextFrame: await evaluate(`document.querySelector('#next-frame').contentDocument.querySelector('.slide h1').textContent.trim()`)
  };

  await evaluate(`location.hash = '#slide-6'; true`);
  await pause(600);
  const fragmentFromPresenter = {
    main: await evaluateTarget(regularPage.webSocketDebuggerUrl, `document.querySelector('.slide h1').textContent.trim()`),
    presenter: await evaluate(`document.querySelector('#current-title').textContent.trim()`),
    currentFrame: await evaluate(`document.querySelector('#current-frame').contentDocument.querySelector('.slide h1').textContent.trim()`),
    nextFrame: await evaluate(`document.querySelector('#next-frame').contentDocument.querySelector('.slide h1').textContent.trim()`)
  };
  return { mainToPresenter, presenterToMain, fragmentFromMain, fragmentFromPresenter };
}

try {
  const full = await scan(`${baseUrl}#slide-1`);
  const core = await scan(`${baseUrl}?depth=core#slide-1`);
  const interactive = await scanInteractiveDemos();
  const presenter = await scanPresenter(new URL('presenter.html', baseUrl).href);
  const projectionSync = await scanProjectionSync();
  const regularWindowSync = await scanRegularWindowSync(baseUrl);
  const problems = [...full.found, ...core.found].filter((item) =>
    item.bodyOverflow || item.contentOverflow || item.brokenImages || item.slideOutsideViewport || item.serviceMetadata
  );
  const expectedCore = slides.filter((slide) => slide.level === 'core').length;
  if (full.found.length !== slides.length) throw new Error(`Plná varianta má v prohlížeči ${full.found.length} slidů, očekáváno ${slides.length}.`);
  if (core.found.length !== expectedCore) throw new Error(`Jádro má v prohlížeči ${core.found.length} slidů, očekáváno ${expectedCore}.`);
  if (!full.notesOpen || !core.notesOpen) throw new Error('Panel poznámek se neotevřel.');
  if (problems.length) throw new Error(`Nalezeny problémy s layoutem: ${JSON.stringify(problems, null, 2)}`);
  if (interactive.sdJwt.ready !== 'true' || interactive.sdJwt.checks !== 4 || interactive.sdJwt.disclosureCount < 2 ||
      !interactive.sdJwt.disclosureChanged || !interactive.sdJwt.nonceChanged || !interactive.sdJwt.inspectorHiddenAfterClose ||
      !['issuer-header', 'issuer-payload', 'issuer-signature', 'disclosure', 'kb-header', 'kb-payload', 'kb-signature']
        .every((kind) => interactive.sdJwt.segmentKinds.includes(kind)) ||
      !interactive.sdJwt.segmentTooltips || !interactive.sdJwt.issuerDecoded.includes('"_sd"') ||
      !interactive.sdJwt.issuerDecoded.includes('"cnf"') || !interactive.sdJwt.disclosureDecoded.includes('given_name') ||
      !interactive.sdJwt.kbDecoded.includes('"sd_hash"') || !interactive.sdJwt.kbDecoded.includes('"nonce"') ||
      interactive.sdJwt.scrollableOverflowCount < 1 || interactive.sdJwt.clipped.length) {
    throw new Error(`Laboratoř SD-JWT neprošla kontrolou vazeb a layoutu: ${JSON.stringify(interactive.sdJwt, null, 2)}`);
  }
  if (interactive.verification.ready !== 'true' || interactive.verification.steps !== 8 ||
      !interactive.verification.directQr.includes('mimo EUDI profil') ||
      !interactive.verification.crossBinding.includes('origin:https://bank.example.eu') ||
      interactive.verification.messageOverflowY !== 'auto' ||
      (interactive.verification.scrollableMessageSeen && !interactive.verification.messageScrollWorked) ||
      interactive.verification.clipped.length) {
    throw new Error(`Laboratoř OID4VP neprošla kontrolou větví a layoutu: ${JSON.stringify(interactive.verification, null, 2)}`);
  }
  if (interactive.issuance.ready !== 'true' || interactive.issuance.steps !== 8 ||
      !interactive.issuance.preAuthorizedCross.includes('eu-eaa-offer://') ||
      !interactive.issuance.preAuthorizedCross.includes('pre-authorized_code') ||
      !interactive.issuance.authorizationCode.includes('POST /par') ||
      !interactive.issuance.authorizationCode.includes('OAuth-Client-Attestation') ||
      !interactive.issuance.nonceStep.includes('c_nonce') || !interactive.issuance.nonceStep.includes('DPoP-Nonce') ||
      !interactive.issuance.credentialRequestStep.includes('Authorization: DPoP') ||
      !interactive.issuance.credentialRequestStep.includes('ath') ||
      !interactive.issuance.credentialRequestStep.includes('proofs') ||
      interactive.issuance.messageOverflowY !== 'auto' ||
      (interactive.issuance.scrollableMessageSeen && !interactive.issuance.messageScrollWorked) ||
      interactive.issuance.clipped.length) {
    throw new Error(`Laboratoř OID4VCI neprošla kontrolou větví a layoutu: ${JSON.stringify(interactive.issuance, null, 2)}`);
  }
  if (presenter.before === presenter.next) throw new Error('Presenter view neposunul aktuální slide.');
  if (!presenter.currentFrameLoaded) throw new Error('Velký náhled aktuálního slidu v presenter view se nenačetl.');
  if (!presenter.nextFrameLoaded) throw new Error('Náhled dalšího slidu v presenter view se nenačetl.');
  if (presenter.before !== presenter.beforeCurrentFrame ||
      presenter.next !== presenter.forwardCurrentFrame ||
      presenter.back !== presenter.backCurrentFrame ||
      presenter.beforeNextFrame !== presenter.forwardCurrentFrame ||
      presenter.forwardNextFrame === presenter.forwardCurrentFrame ||
      presenter.backNextFrame !== presenter.beforeNextFrame) {
    throw new Error(`Náhledy aktuálního a následujícího slidu se nepřekreslují správně: ${JSON.stringify(presenter)}`);
  }
  if (!presenter.countdown.startsWith('Do konce')) throw new Error('Odpočet +90 minut se v presenter view nespustil.');
  if (!/^Tento slide \d{2}:\d{2}$/.test(presenter.slideCountdown)) throw new Error(`Čas aktuálního slidu se nezobrazuje správně: ${presenter.slideCountdown}`);
  if (presenter.currentFrameTransform === 'none' || presenter.nextFrameTransform === 'none') throw new Error('Presenter view neškáluje náhledy jako celé 16:9 slidy.');
  if (projectionSync.before === projectionSync.after || projectionSync.after !== projectionSync.presenterTitle) {
    throw new Error(`Presenter a projekční okno nejsou synchronizované: ${JSON.stringify(projectionSync)}`);
  }
  if (!projectionSync.fullscreenControl.visible || !projectionSync.fullscreenControl.supported) {
    throw new Error(`Projekční okno nenabízí celou obrazovku: ${JSON.stringify(projectionSync.fullscreenControl)}`);
  }
  if (regularWindowSync.mainToPresenter.main !== regularWindowSync.mainToPresenter.presenter ||
      regularWindowSync.presenterToMain.main !== regularWindowSync.presenterToMain.presenter) {
    throw new Error(`Presenter a běžné prezentační okno nejsou synchronizované: ${JSON.stringify(regularWindowSync)}`);
  }
  const expectedMainFragment = slides[9].title;
  const expectedMainFragmentNext = slides[10].title;
  const expectedPresenterFragment = slides[5].title;
  const expectedPresenterFragmentNext = slides[6].title;
  if (regularWindowSync.fragmentFromMain.main !== expectedMainFragment ||
      regularWindowSync.fragmentFromMain.presenter !== expectedMainFragment ||
      regularWindowSync.fragmentFromMain.currentFrame !== expectedMainFragment ||
      regularWindowSync.fragmentFromMain.nextFrame !== expectedMainFragmentNext ||
      regularWindowSync.fragmentFromPresenter.main !== expectedPresenterFragment ||
      regularWindowSync.fragmentFromPresenter.presenter !== expectedPresenterFragment ||
      regularWindowSync.fragmentFromPresenter.currentFrame !== expectedPresenterFragment ||
      regularWindowSync.fragmentFromPresenter.nextFrame !== expectedPresenterFragmentNext) {
    throw new Error(`Navigace pomocí fragmentu nepřekreslila všechna okna: ${JSON.stringify(regularWindowSync)}`);
  }
  if (!full.found.some((item) => item.tooltips > 0)) throw new Error('V prezentaci nebyly vytvořeny tooltipy zkratek.');
  if (!full.found.some((item) => item.highlightedCode > 0)) throw new Error('Ukázky kódu nemají syntaktické zvýraznění.');
  console.log(JSON.stringify({
    fullSlides: full.found.length,
    coreSlides: core.found.length,
    layoutProblems: 0,
    notesPanel: 'ok',
    acronymTooltips: full.found.reduce((sum, item) => sum + item.tooltips, 0),
    syntaxTokens: full.found.reduce((sum, item) => sum + item.highlightedCode, 0),
    interactive,
    presenter,
    projectionSync,
    regularWindowSync
  }, null, 2));
} finally {
  ws.close();
  chrome.kill('SIGTERM');
}
