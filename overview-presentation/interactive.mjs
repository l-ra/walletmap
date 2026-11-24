import { enhanceContent } from './enhance.mjs';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64Url(bytes) {
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = '';
  for (const byte of data) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '');
}

function encodeJson(value) {
  return base64Url(encoder.encode(JSON.stringify(value)));
}

async function sha256(value) {
  return base64Url(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
}

async function createSigningKey() {
  return crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify']
  );
}

async function signJws(header, payload, privateKey) {
  const signingInput = `${encodeJson(header)}.${encodeJson(payload)}`;
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    privateKey,
    encoder.encode(signingInput)
  );
  return `${signingInput}.${base64Url(signature)}`;
}

function decodeBase64Url(value) {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function verifyJws(token, publicKey) {
  const segments = token.split('.');
  if (segments.length !== 3) return false;
  return crypto.subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    publicKey,
    decodeBase64Url(segments[2]),
    encoder.encode(`${segments[0]}.${segments[1]}`)
  );
}

function randomToken(byteLength = 12) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

function short(value, start = 18, end = 10) {
  if (!value || value.length <= start + end + 1) return value;
  return `${value.slice(0, start)}…${value.slice(-end)}`;
}

function setCode(element, value) {
  element.textContent = value;
  delete element.dataset.highlighted;
  enhanceContent(element.parentElement ?? element);
}

function setStatus(element, message, kind = '') {
  element.textContent = message;
  element.dataset.kind = kind;
}

async function initSdJwtLab(lab) {
  if (lab.dataset.initialized) return;
  lab.dataset.initialized = 'true';

  const payloadInput = lab.querySelector('[data-role="payload"]');
  const issueButton = lab.querySelector('[data-action="issue"]');
  const nonceButton = lab.querySelector('[data-action="nonce"]');
  const status = lab.querySelector('[data-role="status"]');
  const issuerPayload = lab.querySelector('[data-role="issuer-payload"]');
  const issuerToken = lab.querySelector('[data-role="issuer-token"]');
  const disclosures = lab.querySelector('[data-role="disclosures"]');
  const kbPayload = lab.querySelector('[data-role="kb-payload"]');
  const presentation = lab.querySelector('[data-role="presentation"]');
  const checks = lab.querySelector('[data-role="checks"]');
  const relation = lab.querySelector('[data-role="relation"]');
  const expandTokenButton = lab.querySelector('[data-action="expand-token"]');
  const closeTokenButton = lab.querySelector('[data-action="close-token"]');
  const tokenInspector = lab.querySelector('[data-role="token-inspector"]');
  const tokenParts = lab.querySelector('[data-role="token-parts"]');
  const decodedTitle = lab.querySelector('[data-role="decoded-title"]');
  const decodedValue = lab.querySelector('[data-role="decoded-value"]');

  const state = {
    issuerKey: await createSigningKey(),
    holderKey: await createSigningKey(),
    nonce: randomToken(),
    issuerJwt: '',
    issuerPayload: null,
    disclosures: [],
    currentPresentation: null
  };

  const holderJwk = await crypto.subtle.exportKey('jwk', state.holderKey.publicKey);

  function decodeJsonSegment(value) {
    const text = decoder.decode(decodeBase64Url(value));
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  function showDecoded(title, value) {
    decodedTitle.textContent = title;
    setCode(decodedValue, typeof value === 'string' ? value : JSON.stringify(value, null, 2));
  }

  function signatureDescription(owner, value) {
    return {
      type: `${owner} podpis ECDSA / ES256`,
      encoding: 'base64url',
      bytes: decodeBase64Url(value).length,
      meaning: 'Podpis se nedekóduje jako JSON. Ověřuje integritu header.payload a držení odpovídajícího soukromého klíče.',
      value
    };
  }

  function tokenSegment({ label, value, kind, tooltip, decoded }) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `token-segment ${kind}`;
    button.dataset.segment = kind;
    button.textContent = value;
    button.title = `${tooltip} Kliknutím zobrazíte dekódovaný obsah.`;
    button.setAttribute('aria-label', `${label}. ${tooltip}`);
    button.addEventListener('click', () => showDecoded(label, decoded()));
    return button;
  }

  function tokenSeparator(value) {
    const separator = document.createElement('span');
    separator.className = 'token-separator';
    separator.textContent = value;
    separator.setAttribute('aria-hidden', 'true');
    return separator;
  }

  function tokenGroup(label, className, segments, separator = '.') {
    const group = document.createElement('section');
    group.className = `token-group ${className}`;
    const heading = document.createElement('strong');
    heading.textContent = label;
    const raw = document.createElement('div');
    raw.className = 'token-group-raw';
    segments.forEach((segment, index) => {
      if (index) raw.append(tokenSeparator(separator));
      raw.append(tokenSegment(segment));
    });
    group.append(heading, raw);
    return group;
  }

  function renderTokenInspector() {
    if (!state.currentPresentation) return;
    const { selected, kbJwt } = state.currentPresentation;
    const [issuerHeader, issuerBody, issuerSignature] = state.issuerJwt.split('.');
    const [kbHeader, kbBody, kbSignature] = kbJwt.split('.');
    const issuerGroup = tokenGroup('Issuer-signed JWT', 'issuer', [
      { label: 'Issuer JWT · protected header', value: issuerHeader, kind: 'issuer-header', tooltip: 'Typ tokenu, algoritmus a identifikátor podpisového klíče issueru.', decoded: () => decodeJsonSegment(issuerHeader) },
      { label: 'Issuer JWT · payload', value: issuerBody, kind: 'issuer-payload', tooltip: 'Viditelné claims, cnf holder key a hashe všech disclosures v _sd.', decoded: () => decodeJsonSegment(issuerBody) },
      { label: 'Issuer JWT · podpis', value: issuerSignature, kind: 'issuer-signature', tooltip: 'Podpis issueru nad prvními dvěma částmi JWT.', decoded: () => signatureDescription('Issuer', issuerSignature) }
    ]);
    const disclosureSegments = selected.map((item, index) => ({
      label: `Disclosure ${index + 1} · ${item.name}`,
      value: item.encoded,
      kind: 'disclosure',
      tooltip: `Salt, název a hodnota claimu ${item.name}; jeho SHA-256 digest je v _sd.`,
      decoded: () => item.decoded
    }));
    const disclosureGroup = tokenGroup('Vybrané disclosures', 'disclosure', disclosureSegments, '~');
    disclosureGroup.querySelector('.token-group-raw').prepend(tokenSeparator('~'));
    disclosureGroup.querySelector('.token-group-raw').append(tokenSeparator('~'));
    const kbGroup = tokenGroup('KB-JWT', 'kb', [
      { label: 'KB-JWT · protected header', value: kbHeader, kind: 'kb-header', tooltip: 'Označuje key-binding token a podpisový algoritmus holder key.', decoded: () => decodeJsonSegment(kbHeader) },
      { label: 'KB-JWT · payload', value: kbBody, kind: 'kb-payload', tooltip: 'Audience, nonce, čas a sd_hash celé předchozí SD-JWT presentation.', decoded: () => decodeJsonSegment(kbBody) },
      { label: 'KB-JWT · podpis', value: kbSignature, kind: 'kb-signature', tooltip: 'Podpis holder key, jehož veřejná část je v cnf issuer JWT.', decoded: () => signatureDescription('Holder / KB-JWT', kbSignature) }
    ]);
    tokenParts.replaceChildren(issuerGroup, disclosureGroup, kbGroup);
    enhanceContent(tokenParts);
    showDecoded('Issuer JWT · payload', decodeJsonSegment(issuerBody));
  }

  async function renderPresentation() {
    if (!state.issuerJwt) return;
    const selected = state.disclosures.filter((item) => item.selected);
    const sdJwt = `${state.issuerJwt}~${selected.map((item) => item.encoded).join('~')}~`;
    const kb = {
      aud: 'https://verifier.example.eu',
      nonce: state.nonce,
      iat: Math.floor(Date.now() / 1000),
      sd_hash: await sha256(sdJwt)
    };
    const kbJwt = await signJws({ typ: 'kb+jwt', alg: 'ES256' }, kb, state.holderKey.privateKey);
    const compact = `${sdJwt}${kbJwt}`;
    state.currentPresentation = { selected, sdJwt, kb, kbJwt, compact };

    setCode(kbPayload, JSON.stringify({
      ...kb,
      nonce: short(kb.nonce, 8, 5),
      sd_hash: short(kb.sd_hash, 14, 8)
    }, null, 2));
    kbPayload.title = JSON.stringify(kb, null, 2);
    presentation.textContent = `${short(state.issuerJwt, 23, 9)}~${selected.map((item) => short(item.encoded, 11, 6)).join('~')}~${short(kbJwt, 18, 8)}`;
    presentation.title = compact;
    relation.textContent = `${selected.length} z ${state.disclosures.length} disclosures · nonce ${short(state.nonce, 8, 5)}`;
    renderTokenInspector();

    const disclosureDigestsValid = (await Promise.all(selected.map(async (item) => (
      await sha256(item.encoded)
    ) === item.digest))).every(Boolean);
    const sdHashValid = kb.sd_hash === await sha256(sdJwt);
    const issuerSignatureValid = await verifyJws(state.issuerJwt, state.issuerKey.publicKey);
    const kbSignatureValid = await verifyJws(kbJwt, state.holderKey.publicKey);
    const results = [
      ['Podpis issueru', issuerSignatureValid],
      ['Digest disclosures', disclosureDigestsValid],
      ['sd_hash celé prezentace', sdHashValid],
      ['Podpis holder key z cnf', kbSignatureValid]
    ];
    checks.replaceChildren(...results.map(([label, valid]) => {
      const item = document.createElement('span');
      item.className = valid ? 'check-ok' : 'check-fail';
      item.textContent = `${valid ? '✓' : '×'} ${label}`;
      return item;
    }));
    lab.dataset.ready = results.every(([, valid]) => valid) ? 'true' : 'false';
  }

  function renderDisclosures() {
    disclosures.replaceChildren();
    for (const item of state.disclosures) {
      const label = document.createElement('label');
      label.className = 'disclosure-row';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = item.selected;
      checkbox.addEventListener('change', async () => {
        item.selected = checkbox.checked;
        await renderPresentation();
      });
      const name = document.createElement('strong');
      name.textContent = item.name;
      const digest = document.createElement('code');
      digest.textContent = short(item.digest, 12, 7);
      digest.title = `SHA-256(${item.encoded}) = ${item.digest}`;
      label.append(checkbox, name, digest);
      disclosures.append(label);
    }
  }

  async function issue() {
    issueButton.disabled = true;
    setStatus(status, 'Počítám disclosures a podpisy…');
    try {
      const source = JSON.parse(payloadInput.value);
      if (!source || Array.isArray(source) || typeof source !== 'object') throw new Error('Payload musí být JSON objekt.');
      const visibleNames = new Set(['iss', 'vct', 'iat', 'nbf', 'exp', 'status']);
      const visible = Object.fromEntries(Object.entries(source).filter(([name]) => visibleNames.has(name)));
      const selective = Object.entries(source).filter(([name]) => !visibleNames.has(name) && !['cnf', '_sd', '_sd_alg'].includes(name));
      if (!selective.length) throw new Error('Přidejte alespoň jeden selektivně zveřejnitelný claim.');

      state.disclosures = await Promise.all(selective.map(async ([name, value]) => {
        const decoded = [randomToken(8), name, value];
        const encoded = encodeJson(decoded);
        return {
          name,
          value,
          decoded,
          encoded,
          digest: await sha256(encoded),
          selected: name === 'age_over_18'
        };
      }));
      if (!state.disclosures.some((item) => item.selected)) state.disclosures[0].selected = true;
      state.issuerPayload = {
        ...visible,
        cnf: { jwk: { kty: holderJwk.kty, crv: holderJwk.crv, x: holderJwk.x, y: holderJwk.y } },
        _sd_alg: 'sha-256',
        _sd: state.disclosures.map((item) => item.digest)
      };
      state.issuerJwt = await signJws(
        { typ: 'dc+sd-jwt', alg: 'ES256', kid: 'pid-issuer-key-2026' },
        state.issuerPayload,
        state.issuerKey.privateKey
      );

      const displayPayload = {
        ...visible,
        cnf: { jwk: { kty: holderJwk.kty, crv: holderJwk.crv, x: short(holderJwk.x, 9, 6), y: short(holderJwk.y, 9, 6) } },
        _sd_alg: 'sha-256',
        _sd: state.disclosures.map((item) => `${item.name}: ${short(item.digest, 10, 6)}`)
      };
      setCode(issuerPayload, JSON.stringify(displayPayload, null, 2));
      issuerToken.textContent = short(state.issuerJwt, 29, 12);
      issuerToken.title = state.issuerJwt;
      renderDisclosures();
      await renderPresentation();
      setStatus(status, 'Vystaveno. Zaškrtnutí mění presentation i sd_hash.', 'ok');
    } catch (error) {
      setStatus(status, error.message, 'error');
      lab.dataset.ready = 'false';
    } finally {
      issueButton.disabled = false;
    }
  }

  issueButton.addEventListener('click', issue);
  expandTokenButton.addEventListener('click', () => {
    renderTokenInspector();
    tokenInspector.hidden = false;
    closeTokenButton.focus();
  });
  closeTokenButton.addEventListener('click', () => {
    tokenInspector.hidden = true;
    expandTokenButton.focus();
  });
  tokenInspector.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    tokenInspector.hidden = true;
    expandTokenButton.focus();
    event.stopPropagation();
  });
  nonceButton.addEventListener('click', async () => {
    state.nonce = randomToken();
    await renderPresentation();
    setStatus(status, 'Nová relace změnila nonce, KB-JWT i jeho podpis.', 'ok');
  });
  await issue();
}

const verifierSteps = [
  {
    title: 'Registrace služby a přístupový certifikát',
    actors: ['trust', 'rp'],
    text: 'Registrar zveřejní registrační informaci pro konkrétní službu a intended use. Access CA vydá certifikát pro podpis Request Objectu.',
    checks: ['role verifier', 'service identifier', 'intended use a povolené atributy', 'signing key a certifikační řetězec'],
    code: () => JSON.stringify({
      registration: {
        relying_party: 'Example Bank a.s.',
        role: 'verifier',
        service: 'Ověření plnoletosti',
        intended_use: 'age-check',
        requested_attributes: ['age_over_18'],
        registrar: 'https://registrar.example.eu'
      },
      access_certificate: {
        subject: 'Example Bank a.s.',
        service_uri: 'https://bank.example.eu/age-check',
        public_key: 'P-256 key for Request Object'
      }
    }, null, 2)
  },
  {
    title: 'RP vytvoří podepsaný Authorization Request',
    actors: ['rp'],
    text: 'Request Object spojuje identitu RP, konkrétní relaci, návratový kanál, registrační informaci a DCQL dotaz.',
    checks: ['JWS header: typ, alg a x5c', 'nonce a session binding', 'response_mode podle transportu', 'verifier_info, client_metadata a DCQL'],
    code: (mode) => JSON.stringify({
      jws_header: { typ: 'oauth-authz-req+jwt', alg: 'ES256', x5c: ['WRPAC', 'Access CA'] },
      aud: 'https://self-issued.me/v2',
      client_id: 'x509_hash:sha256-thumbprint',
      response_type: 'vp_token',
      response_mode: ['redirect', 'direct'].includes(mode) ? 'direct_post.jwt' : 'dc_api.jwt',
      response_uri: ['redirect', 'direct'].includes(mode) ? 'https://bank.example.eu/oid4vp/response' : undefined,
      expected_origins: ['same', 'cross'].includes(mode) ? ['https://bank.example.eu'] : undefined,
      nonce: 'n-7f4ab…',
      state: ['redirect', 'direct'].includes(mode) ? 'browser-session-18c…' : undefined,
      verifier_info: [
        { format: 'registrar_dataset', data: { registryURI: 'https://registrar.example.eu/api', intendedUseIdentifier: 'age-check', purpose: 'Ověření plnoletosti' } },
        { format: 'registration_cert', data: 'eyJ…WRPRC-JWT…' }
      ],
      client_metadata: { jwks: { keys: [{ kid: 'response-enc-tx91', use: 'enc', kty: 'EC', crv: 'P-256' }] } },
      dcql_query: { credentials: [{ id: 'pid', format: 'dc+sd-jwt', claims: [{ path: ['age_over_18'] }] }] }
    }, null, 2)
  },
  {
    title: 'Požadavek dorazí do zvolené wallet',
    actors: ['rp', 'platform', 'wallet'],
    text: 'Same-device redirect používá eu-eaap a request_uri. DC API předá autentizovaný origin a u cross-device vytvoří platformní tunel. Přímý cross-device QR je mimo EUDI profil.',
    checks: ['same-device redirect nebo DC API', 'jednorázový request_uri/JAR', 'DC API origin a CTAP hybrid', 'přímý QR: relay a session-fixation riziko'],
    code: (mode) => {
      if (mode === 'redirect') return 'eu-eaap://?\n client_id=x509_hash%3Asha256-thumbprint\n &request_uri=https%3A%2F%2Fbank.example.eu%2Frequests%2Fr-91\n\nGET request_uri\nAccept: application/oauth-authz-req+jwt';
      if (mode === 'direct') return 'QR: openid4vp://authorize?\n request_uri=https%3A%2F%2Fbank.example.eu%2Frequests%2Fr-91\n\n// obecný OID4VP; cross-device mimo EUDI profil\n// chybí autentizovaný origin a platformní session binding';
      return mode === 'cross'
        ? 'navigator.credentials.get({ digital: { requests: [{\n  protocol: "openid4vp-v1-signed",\n  data: { request: "<signed Request Object>" }\n}]}})\n\n// browser/OS: párovací QR → CTAP hybrid secure tunnel\n// signed request + authenticated origin → wallet v telefonu'
        : 'navigator.credentials.get({ digital: { requests: [{\n  protocol: "openid4vp-v1-signed",\n  data: { request: "<signed Request Object>" }\n}]}})\n\n// same-device browser/OS předá walletu request i web origin';
    }
  },
  {
    title: 'Wallet ověří RP a rozsah registrace',
    actors: ['wallet', 'trust'],
    text: 'Wallet nejprve ověří podpis a přístupový certifikát. Potom validuje registrační informaci a porovná DCQL claims s intended use služby.',
    checks: ['JAR signature, typ a WRPAC status', 'x509_hash nebo expected_origins', 'WRPRC/registrar dataset a provider LoTE', 'service ID, intended use a claim scope'],
    code: () => [
      '✓ x5c chain → Access CA z LoTE',
      '✓ typ=oauth-authz-req+jwt + JAR signature',
      '✓ x509_hash(leaf WRPAC) / expected_origins',
      '✓ verifier_info → WRPRC + registrar dataset',
      '✓ service = age-check',
      '✓ DCQL žádá pouze age_over_18',
      '✓ response_uri nebo DC API context odpovídá requestu'
    ].join('\n')
  },
  {
    title: 'Wallet vyhodnotí DCQL a získá souhlas',
    actors: ['wallet'],
    text: 'Wallet najde kompatibilní PID, odvodí nutné disclosures a ukáže uživateli identitu služby, účel i přesný seznam předávaných údajů.',
    checks: ['formát dc+sd-jwt', 'VCT urn:eudi:pid:1', 'claim age_over_18', 'výslovný souhlas uživatele'],
    code: () => JSON.stringify({
      query_id: 'pid',
      matched_credential: 'PID · urn:eudi:pid:1',
      disclose: ['age_over_18'],
      hidden: ['given_name', 'family_name', 'birthdate', 'address'],
      user_decision: 'approved'
    }, null, 2)
  },
  {
    title: 'Wallet sestaví SD-JWT + KB-JWT presentation',
    actors: ['wallet'],
    text: 'Issuerův podpis zůstává beze změny. Wallet připojí pouze zvolený disclosure a nový KB-JWT podepsaný holder key z cnf.',
    checks: ['digest disclosure je v _sd', 'KB-JWT aud odpovídá RP', 'nonce odpovídá requestu', 'sd_hash pokrývá vybranou presentation'],
    code: (mode) => [
      'issuerJWT~D_age_over_18~KB-JWT',
      '',
      '// decoded KB-JWT payload',
      JSON.stringify({
        aud: ['same', 'cross'].includes(mode) ? 'origin:https://bank.example.eu' : 'x509_hash:sha256-thumbprint',
        nonce: 'n-7f4ab…',
        iat: 1795600123,
        sd_hash: 'SHA-256(issuerJWT~D_age_over_18~)'
      }, null, 2),
      '',
      '// signature: holder private key matching cnf.jwk'
    ].join('\n')
  },
  {
    title: 'Authorization Response vrátí vp_token',
    actors: ['wallet', 'platform', 'rp'],
    text: 'DCQL query ID určí klíč v mapě vp_token. Direct post odešle odpověď RP backendu, zatímco DC API ji vrátí přes zprostředkovanou relaci.',
    checks: ['query ID pid', 'state nebo platformní session binding', 'response encryption/signature podle response mode', 'žádné nevyžádané disclosures'],
    code: (mode) => JSON.stringify({
      [(['redirect', 'direct'].includes(mode) ? 'response' : 'protocol')]: ['redirect', 'direct'].includes(mode) ? 'encrypted JWE for direct_post.jwt' : 'openid4vp-v1-signed',
      vp_token: { pid: ['issuerJWT~D_age_over_18~KB-JWT'] },
      state: ['redirect', 'direct'].includes(mode) ? 'browser-session-18c…' : undefined
    }, null, 2)
  },
  {
    title: 'RP ověří kryptografii, trust i vlastní politiku',
    actors: ['rp', 'trust'],
    text: 'Verifier zkontroluje vazbu na relaci, issuerův podpis a oprávnění, disclosure digesty, holder proof, status credentialu a pravidla služby.',
    checks: ['state/session, nonce a audience', 'issuer signature, type a trust anchor', 'time a status', 'disclosures, cnf key a KB-JWT', 'výsledek DCQL a service policy'],
    code: () => [
      '1  session + state + response mode       ✓',
      '2  issuer signature + issuer LoTE        ✓',
      '3  nbf / exp + credential status         ✓',
      '4  SHA-256(disclosure) ∈ _sd             ✓',
      '5  KB-JWT signature with cnf.jwk         ✓',
      '6  aud + nonce + sd_hash                 ✓',
      '7  DCQL result + age-check policy        ✓'
    ].join('\n')
  }
];

const issuanceSteps = [
  {
    title: 'Issuer vstoupí do ekosystému důvěry',
    actors: ['trust', 'issuer'],
    text: 'Issuer registruje provider entitlement a providesAttestations. Pokud během issuance žádá PID nebo EAA z wallet, registruje navíc Service_Provider, službu a intended use.',
    checks: ['provider entitlement', 'providesAttestations', 'volitelná service + intended use', 'access signing key a trust chain'],
    code: () => JSON.stringify({
      issuer_registration: {
        entity: 'PID Provider CZ',
        entitlement: 'PID_Provider',
        providesAttestations: ['urn:eudi:pid:1']
      },
      only_if_wallet_data_is_requested: {
        entitlement: 'Service_Provider',
        service: 'Vydání PID',
        intended_use: 'identity-evidence-for-pid-issuance',
        requested_credentials: ['PID or EAA required by rulebook']
      },
      access_certificate: { service_uri: 'https://pid.example.cz', key_use: 'metadata and service authentication' }
    }, null, 2)
  },
  {
    title: 'Wallet načte issuer a authorization server metadata',
    actors: ['wallet', 'issuer', 'as'],
    text: 'Wallet vyžádá issuer metadata jako podepsaný JWT. x5c nese issuer access certificate a issuer_info registration certificate. Teprve potom wallet důvěřuje endpointům a konfiguracím.',
    checks: ['metadata JWS a WRPAC chain', 'WRPRC signature, status a role', 'credential_endpoint a nonce_endpoint', 'AS, configuration, format a proof types'],
    code: () => [
      '// JOSE header',
      JSON.stringify({ typ: 'openidvci-issuer-metadata+jwt', alg: 'ES256', x5c: ['issuer-WRPAC', 'Access-CA'] }, null, 2),
      '// signed payload fragment',
      JSON.stringify({
        sub: 'https://pid.example.cz',
        credential_issuer: 'https://pid.example.cz',
        authorization_servers: ['https://as.pid.example.cz'],
        credential_endpoint: 'https://pid.example.cz/credential',
        nonce_endpoint: 'https://pid.example.cz/nonce',
        issuer_info: [{ format: 'registration_cert', data: 'eyJ…issuer-WRPRC…' }],
        credential_configurations_supported: { 'pid-sd-jwt': { format: 'dc+sd-jwt', vct: 'urn:eudi:pid:1' } }
      }, null, 2)
    ].join('\n')
  },
  {
    title: 'Credential Offer zahájí same-device nebo cross-device flow',
    actors: ['issuer', 'platform', 'wallet'],
    text: 'Offer lze předat hodnotou nebo přes credential_offer_uri. Cross-device typicky používá QR, same-device link nebo platformní zprostředkování.',
    checks: ['credential_issuer', 'credential_configuration_ids', 'nabízený grant', 'krátkodobý a chráněný offer URI'],
    code: (grant, device) => [
      device === 'cross'
        ? 'QR: eu-eaa-offer://?credential_offer_uri=https%3A%2F%2Fpid.example.cz%2Foffers%2Fo-72'
        : 'LINK: eu-eaa-offer://?credential_offer_uri=https%3A%2F%2Fpid.example.cz%2Foffers%2Fo-72',
      '',
      JSON.stringify({
        credential_issuer: 'https://pid.example.cz',
        credential_configuration_ids: ['pid-sd-jwt'],
        grants: grant === 'code'
          ? { authorization_code: { issuer_state: 'iss-state-29…' } }
          : { 'urn:ietf:params:oauth:grant-type:pre-authorized_code': { 'pre-authorized_code': 'pre-8fd…', tx_code: { input_mode: 'numeric', length: 6 } } }
      }, null, 2)
    ].join('\n')
  },
  {
    title: 'Wallet získá oprávnění k vydání',
    actors: ['wallet', 'as'],
    text: 'Authorization Code používá PAR, autentizaci držitele, souhlas a PKCE. Pre-authorized code jde přímo na token endpoint a může vyžadovat tx_code.',
    checks: ['WIA a WIA-PoP pro wallet klienta', 'DPoP sender-constrained token', 'grant-specific ochrany', 'autorizace konkrétní konfigurace'],
    code: (grant) => grant === 'code'
      ? [
        'POST /par',
        'OAuth-Client-Attestation: <WIA>',
        'OAuth-Client-Attestation-PoP: <WIA-PoP>',
        '',
        'response_type=code',
        'scope=pid-sd-jwt',
        'resource=https://pid.example.cz',
        'code_challenge=<PKCE S256>',
        'authorization_details=[{"type":"openid_credential",',
        '  "credential_configuration_id":"pid-sd-jwt"}]',
        '',
        '→ browser login + consent → authorization code'
      ].join('\n')
      : [
        'POST /token',
        'OAuth-Client-Attestation: <WIA>',
        'OAuth-Client-Attestation-PoP: <WIA-PoP>',
        '',
        'grant_type=urn:ietf:params:oauth:grant-type:pre-authorized_code',
        'pre-authorized_code=pre-8fd…',
        'tx_code=493821',
        '',
        '→ AS ověří jednorázový kód, tx_code a WIA'
      ].join('\n')
  },
  {
    title: 'Token Response určí autorizovaný credential dataset',
    actors: ['as', 'wallet'],
    text: 'Access token opravňuje volání credential endpointu. credential_identifier se použije, pokud jej authorization server vrátí v authorization_details.',
    checks: ['access token audience a scope', 'credential_identifier nebo configuration ID', 'DPoP/token binding podle profilu', 'refresh token jen pokud je povolen'],
    code: () => JSON.stringify({
      access_token: 'eyJ…access-token…',
      token_type: 'DPoP',
      expires_in: 300,
      authorization_details: [{
        type: 'openid_credential',
        credential_configuration_id: 'pid-sd-jwt',
        credential_identifiers: ['pid-dataset-4']
      }],
      refresh_token: 'optional-and-policy-controlled'
    }, null, 2)
  },
  {
    title: 'Dvě nonce chrání dvě různé vrstvy',
    actors: ['wallet', 'issuer'],
    text: 'c_nonce vstoupí do credential proofu podepsaného holder key. HTTP DPoP-Nonce vstoupí do nového DPoP proofu podepsaného DPoP key. Mohou přijít v jedné odpovědi, ale nemají definovaný vztah a nesmějí se zaměnit.',
    checks: ['c_nonce → proofs.jwt nonce', 'DPoP-Nonce → DPoP JWT nonce', 'credential proof: aud = issuer + KA', 'DPoP proof: htm + htu + jti'],
    code: () => [
      'POST /nonce',
      '← HTTP/1.1 200 OK',
      '  DPoP-Nonce: dpop-n-29…',
      '  {"c_nonce":"cred-n-61a…"}',
      '',
      '// c_nonce → credential-binding proof',
      JSON.stringify({
        header: { typ: 'openid4vci-proof+jwt', alg: 'ES256', key_attestation: 'eyJ…KA…' },
        payload: { aud: 'https://pid.example.cz', nonce: 'cred-n-61a…', iat: 1795600220 }
      }, null, 2),
      '',
      '// DPoP-Nonce → příští DPoP proof pro HTTP request',
      JSON.stringify({
        htm: 'POST',
        htu: 'https://pid.example.cz/credential',
        iat: 1795600221,
        jti: 'fresh-request-id',
        nonce: 'dpop-n-29…'
      }, null, 2)
    ].join('\n')
  },
  {
    title: 'Credential Request nese token a dva různé proofy',
    actors: ['wallet', 'issuer'],
    text: 'Authorization: DPoP přenáší sender-constrained access token. Samostatná hlavička DPoP nese čerstvý proof konkrétního HTTP requestu. proofs.jwt v těle je třetí artefakt: dokládá holder key pro nový credential pomocí c_nonce.',
    checks: ['Authorization: DPoP = access token', 'DPoP = htm/htu/jti/ath + nonce', 'proofs.jwt = holder key + c_nonce', 'DPoP key ≠ nutně credential key'],
    code: () => [
      'POST /credential',
      'Authorization: DPoP eyJ…access-token…',
      'DPoP: eyJ…fresh-request-proof…',
      '',
      '// decoded DPoP payload',
      JSON.stringify({
        htm: 'POST',
        htu: 'https://pid.example.cz/credential',
        iat: 1795600221,
        jti: 'fresh-request-id',
        ath: 'SHA-256(access-token)',
        nonce: 'dpop-n-29…'
      }, null, 2),
      '',
      '// request body: credential-binding proof je jiný podpis',
      JSON.stringify({
        credential_identifier: 'pid-dataset-4',
        proofs: { jwt: ['eyJ…openid4vci-proof+jwt; nonce=cred-n-61a…'] }
      }, null, 2)
    ].join('\n')
  },
  {
    title: 'Issuer validuje wallet a vydá podepsaný credential',
    actors: ['issuer', 'trust', 'wallet'],
    text: 'Issuer ověří token, WIA, KA, key proof, entitlement a zdrojové údaje. Potom podepíše credential, přidá holder binding a status a vrátí jej wallet.',
    checks: ['WIA status a PoP', 'KA chain, attested key a nonce', 'nárok držitele a authentic source', 'issuer signing key a status reference'],
    code: () => [
      '✓ access token + DPoP                 ✓',
      '✓ WIA + wallet provider trust         ✓',
      '✓ KA + proof signature + c_nonce      ✓',
      '✓ PID entitlement + authentic source  ✓',
      '',
      JSON.stringify({
        credentials: [{ credential: 'issuerJWT~D_given_name~D_age18~' }],
        notification_id: 'optional-n-14'
      }, null, 2)
    ].join('\n')
  }
];

function initProtocolLab(lab, steps, options) {
  if (lab.dataset.initialized) return;
  lab.dataset.initialized = 'true';
  let stepIndex = 0;
  const state = { ...options.initialState };
  const previous = lab.querySelector('[data-action="step-prev"]');
  const next = lab.querySelector('[data-action="step-next"]');
  const title = lab.querySelector('[data-role="step-title"]');
  const description = lab.querySelector('[data-role="step-description"]');
  const code = lab.querySelector('[data-role="message"]');
  const checks = lab.querySelector('[data-role="step-checks"]');
  const counter = lab.querySelector('[data-role="step-counter"]');
  const stepBar = lab.querySelector('[data-role="step-bar"]');
  const actorElements = [...lab.querySelectorAll('[data-actor]')];

  function render() {
    const step = steps[stepIndex];
    title.textContent = step.title;
    description.textContent = step.text;
    setCode(code, step.code(...options.argumentsFor(state)));
    checks.replaceChildren(...step.checks.map((item) => {
      const row = document.createElement('li');
      row.textContent = item;
      return row;
    }));
    counter.textContent = `Krok ${stepIndex + 1} / ${steps.length}`;
    previous.disabled = stepIndex === 0;
    next.disabled = stepIndex === steps.length - 1;
    actorElements.forEach((actor) => actor.classList.toggle('active', step.actors.includes(actor.dataset.actor)));
    [...stepBar.children].forEach((button, index) => button.classList.toggle('active', index === stepIndex));
    lab.dataset.step = String(stepIndex + 1);
    enhanceContent(title.parentElement);
    const messagePane = code.closest('pre');
    const explanationPane = title.closest('.protocol-explanation');
    messagePane.scrollTop = 0;
    messagePane.scrollLeft = 0;
    explanationPane.scrollTop = 0;
    explanationPane.scrollLeft = 0;
  }

  steps.forEach((step, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.title = step.title;
    button.setAttribute('aria-label', `Krok ${index + 1}: ${step.title}`);
    button.addEventListener('click', () => { stepIndex = index; render(); });
    stepBar.append(button);
  });
  previous.addEventListener('click', () => { stepIndex = Math.max(0, stepIndex - 1); render(); });
  next.addEventListener('click', () => { stepIndex = Math.min(steps.length - 1, stepIndex + 1); render(); });
  lab.querySelectorAll('[data-option]').forEach((button) => {
    button.addEventListener('click', () => {
      state[button.dataset.option] = button.dataset.value;
      lab.querySelectorAll(`[data-option="${button.dataset.option}"]`).forEach((candidate) => {
        candidate.classList.toggle('active', candidate === button);
      });
      render();
    });
  });
  render();
  lab.dataset.ready = 'true';
}

function initVerificationLab(lab) {
  initProtocolLab(lab, verifierSteps, {
    initialState: { mode: 'same' },
    argumentsFor: (state) => [state.mode]
  });
}

function initIssuanceLab(lab) {
  initProtocolLab(lab, issuanceSteps, {
    initialState: { grant: 'code', device: 'same' },
    argumentsFor: (state) => [state.grant, state.device]
  });
}

export function initInteractiveDemos(root) {
  root.querySelectorAll('[data-demo="sdjwt"]').forEach((lab) => initSdJwtLab(lab));
  root.querySelectorAll('[data-demo="verification"]').forEach((lab) => initVerificationLab(lab));
  root.querySelectorAll('[data-demo="issuance"]').forEach((lab) => initIssuanceLab(lab));
}
