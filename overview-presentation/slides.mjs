const U = {
  arf: 'https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework/tree/v3.0.0',
  roles: 'https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework/blob/v3.0.0/docs/main/03-roles-within-the-eudi-wallet-ecosystem.md',
  architecture: 'https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework/blob/v3.0.0/docs/main/04-high-level-architecture.md',
  protocols: 'https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework/blob/v3.0.0/docs/main/05-data-model-and-data-exchange-protocols.md',
  trust: 'https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework/blob/v3.0.0/docs/main/06-trust-model.md',
  topic3: 'https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework/blob/v3.0.0/docs/annexes/annex-2/annex-2.02-high-level-requirements-by-topic.md#a232-topic-3---pid-rulebook',
  ts3: 'https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/blob/main/docs/technical-specifications/ts3-wallet-unit-attestation.md',
  ts2: 'https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/blob/main/docs/technical-specifications/ts2-notification-publication-provider-information.md',
  ts5: 'https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/blob/main/docs/technical-specifications/ts5-common-formats-and-api-for-rp-registration-information.md',
  ts6: 'https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/blob/main/docs/technical-specifications/ts6-common-set-of-rp-information-to-be-registered.md',
  ts9: 'https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/blob/main/docs/technical-specifications/ts9-wallet-to-wallet-interactions.md',
  ri: 'https://docs.eudi.dev/latest/',
  riRepos: 'https://docs.eudi.dev/latest/reference-implementation/repositories-list/',
  riGithub: 'https://github.com/eu-digital-identity-wallet',
  oid4vp: 'https://openid.net/specs/openid-4-verifiable-presentations-1_0-final.html',
  oid4vci: 'https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0-final.html',
  haip: 'https://openid.net/specs/openid4vc-high-assurance-interoperability-profile-1_0-final.html',
  sdjwt: 'https://www.rfc-editor.org/rfc/rfc9901.html',
  sdjwtvc: 'https://datatracker.ietf.org/doc/draft-ietf-oauth-sd-jwt-vc/',
  status: 'https://datatracker.ietf.org/doc/draft-ietf-oauth-status-list/',
  rfc5280: 'https://www.rfc-editor.org/rfc/rfc5280.html',
  rfc6960: 'https://www.rfc-editor.org/rfc/rfc6960.html',
  rfc9449: 'https://www.rfc-editor.org/rfc/rfc9449.html',
  dcapi: 'https://www.w3.org/TR/digital-credentials/',
  pidRulebook: 'https://github.com/eu-digital-identity-wallet/eudi-doc-attestation-rulebooks-catalog/blob/main/rulebooks/pid/pid-rulebook.md',
  mdlRulebook: 'https://github.com/eu-digital-identity-wallet/eudi-doc-attestation-rulebooks-catalog/blob/main/rulebooks/mdl/mdl-rulebook.md',
  etsi472: 'https://www.etsi.org/deliver/etsi_ts/119400_119499/11947202/01.02.01_60/ts_11947202v010201p.pdf',
  etsi4723: 'https://www.etsi.org/deliver/etsi_ts/119400_119499/11947203/01.01.01_60/ts_11947203v010101p.pdf',
  etsi4118: 'https://www.etsi.org/deliver/etsi_ts/119400_119499/11941108/01.01.01_60/ts_11941108v010101p.pdf',
  etsi475: 'https://www.etsi.org/deliver/etsi_ts/119400_119499/119475/01.02.01_60/ts_119475v010201p.pdf'
};

const src = (label, url) => ({ label, url });

const sdJwtLabHtml = `
  <div class="interactive-lab sdjwt-lab" data-demo="sdjwt">
    <div class="lab-toolbar">
      <div><strong>Živá transformace</strong><span>Web Crypto · dočasné klíče P-256 · plochý JSON payload</span></div>
      <div class="lab-actions"><button type="button" data-action="issue">Vystavit z payloadu</button><button type="button" data-action="nonce">Nová relace</button></div>
    </div>
    <div class="sdjwt-workbench">
      <section class="lab-pane input-pane">
        <h2><span>1</span> Vstupní payload</h2>
        <textarea data-role="payload" spellcheck="false" aria-label="Vstupní JSON payload">{
  "iss": "https://pid.example.eu",
  "vct": "urn:eudi:pid:1",
  "iat": 1795600000,
  "exp": 1798200000,
  "given_name": "Ada",
  "family_name": "Nováková",
  "birthdate": "2001-02-03",
  "age_over_18": true,
  "country": "CZ"
}</textarea>
      </section>
      <section class="lab-pane issuer-pane">
        <h2><span>2</span> Issuer-signed JWT</h2>
        <pre><code data-role="issuer-payload">Čekám na výpočet…</code></pre>
        <div class="compact-token"><b>ES256 podpis</b><code data-role="issuer-token"></code></div>
      </section>
      <section class="lab-pane disclosure-pane">
        <h2><span>3</span> Disclosures</h2>
        <div class="disclosure-list" data-role="disclosures"></div>
        <p class="lab-hint">Výběr změní presentation, ale issuerův podpis zůstane stejný.</p>
      </section>
    </div>
    <div class="presentation-strip">
      <div class="kb-preview"><h2><span>4</span> KB-JWT payload</h2><pre><code data-role="kb-payload"></code></pre></div>
      <div class="wire-preview">
        <div class="wire-preview-head"><h2>SD-JWT + KB-JWT na drátě</h2><button type="button" data-action="expand-token" aria-haspopup="dialog">Rozbalit a dekódovat</button></div>
        <code data-role="presentation"></code><span data-role="relation"></span>
      </div>
      <div class="verification-preview"><h2>Vazby, které verifier přepočítá</h2><div data-role="checks"></div></div>
    </div>
    <div class="lab-status" data-role="status" aria-live="polite"></div>
    <section class="token-inspector" data-role="token-inspector" role="dialog" aria-modal="true" aria-labelledby="token-inspector-title" hidden>
      <header>
        <div><strong id="token-inspector-title">SD-JWT + KB-JWT: úplný obsah</strong><span>Barva určuje část artefaktu. Hover vysvětlí význam; kliknutí obsah dekóduje.</span></div>
        <button type="button" data-action="close-token" aria-label="Zavřít rozbalený token">Zavřít</button>
      </header>
      <div class="token-legend" aria-label="Legenda částí tokenu">
        <span class="issuer">Issuer JWT</span><span class="disclosure">Disclosure</span><span class="kb">KB-JWT</span>
      </div>
      <div class="token-inspector-body">
        <div class="token-parts" data-role="token-parts" aria-label="Úplný kompaktní token po částech"></div>
        <div class="token-decoded">
          <strong data-role="decoded-title">Klikněte na část tokenu</strong>
          <pre><code data-role="decoded-value">Zde se zobrazí dekódovaná hlavička, payload, disclosure nebo popis podpisu.</code></pre>
        </div>
      </div>
    </section>
  </div>`;

const verificationLabHtml = `
  <div class="interactive-lab protocol-lab" data-demo="verification">
    <div class="lab-toolbar protocol-toolbar">
      <div class="mode-group" aria-label="Způsob předání požadavku">
        <span>Transport</span>
        <button type="button" data-option="mode" data-value="redirect">Redirect/JAR · same-device</button>
        <button type="button" class="active" data-option="mode" data-value="same">DC API · same-device</button>
        <button type="button" data-option="mode" data-value="cross">DC API · cross-device</button>
        <button type="button" class="risk-option" data-option="mode" data-value="direct">Přímý QR · mimo EUDI profil</button>
      </div>
      <div class="step-controls"><button type="button" data-action="step-prev">Zpět</button><strong data-role="step-counter"></strong><button type="button" data-action="step-next">Další krok</button></div>
    </div>
    <div class="actor-rail" aria-label="Účastníci protokolu">
      <div data-actor="trust"><b>Registry a trust</b><small>LoTE · registrar · status</small></div>
      <div data-actor="rp"><b>Verifier / RP</b><small>služba + backend</small></div>
      <div data-actor="platform"><b>Browser / OS</b><small>DC API nebo QR</small></div>
      <div data-actor="wallet"><b>Wallet Unit</b><small>výběr + souhlas + proof</small></div>
    </div>
    <div class="protocol-workbench">
      <section class="protocol-explanation"><h2 data-role="step-title"></h2><p data-role="step-description"></p><h3>Kontrolní body</h3><ul data-role="step-checks"></ul></section>
      <section class="protocol-message"><h3>Zpráva nebo ověřovací stav</h3><pre><code data-role="message"></code></pre></section>
    </div>
    <div class="step-bar" data-role="step-bar" aria-label="Kroky verifikace"></div>
  </div>`;

const issuanceLabHtml = `
  <div class="interactive-lab protocol-lab" data-demo="issuance">
    <div class="lab-toolbar protocol-toolbar issuance-toolbar">
      <div class="mode-group"><span>Grant</span><button type="button" class="active" data-option="grant" data-value="code">Authorization Code</button><button type="button" data-option="grant" data-value="pre">Pre-Authorized Code</button></div>
      <div class="mode-group"><span>Start</span><button type="button" class="active" data-option="device" data-value="same">Same-device link</button><button type="button" data-option="device" data-value="cross">Cross-device QR</button></div>
      <div class="step-controls"><button type="button" data-action="step-prev">Zpět</button><strong data-role="step-counter"></strong><button type="button" data-action="step-next">Další krok</button></div>
    </div>
    <div class="actor-rail five-actors" aria-label="Účastníci protokolu">
      <div data-actor="trust"><b>Registry a trust</b><small>LoTE · WRPRC · WRPAC</small></div>
      <div data-actor="issuer"><b>Credential Issuer</b><small>metadata + endpoint</small></div>
      <div data-actor="as"><b>Authorization Server</b><small>PAR · login · token</small></div>
      <div data-actor="platform"><b>Browser / QR</b><small>zahájení flow</small></div>
      <div data-actor="wallet"><b>Wallet Unit</b><small>WIA · KA · holder key</small></div>
    </div>
    <div class="protocol-workbench">
      <section class="protocol-explanation"><h2 data-role="step-title"></h2><p data-role="step-description"></p><h3>Kontrolní body</h3><ul data-role="step-checks"></ul></section>
      <section class="protocol-message"><h3>Zpráva nebo ověřovací stav</h3><pre><code data-role="message"></code></pre></section>
    </div>
    <div class="step-bar" data-role="step-bar" aria-label="Kroky vydání"></div>
  </div>`;

export const deckMeta = {
  shortTitle: 'EUDI Wallet: od identity k protokolům',
  version: 'finální verze 2 · 24. 11. 2026'
};

export const slides = [
  {
    id: 'cover', title: 'European Digital Identity Wallet', section: 'Úvod', part: 1, level: 'core', minutes: 2, kind: 'cover',
    subtitle: 'Dále EUDI Wallet: od limitů centrální identity přes verifiable credentials až k evropské infrastruktuře důvěry a protokolům „on the wire“.',
    html: `<p class="big-statement">Nejde jen o novou přihlašovací aplikaci. Jde o změnu <strong>kdo zprostředkovává důvěryhodná data</strong> mezi člověkem, vydavatelem a službou.</p><div class="cover-mark"><span>blok 1 · význam a důvěra</span><span>blok 2 · protokoly a datové struktury</span></div>`,
    notes: `<p>Otevřete otázkou: „Kdo se dnes dozví, kam se přihlašuji?“ Studenti obvykle odpovědí IdP. To je vstup k motivaci celé přednášky.</p><p>Cílem není prohlásit federaci za špatnou. Budeme porovnávat dostupnost, soukromí, kontrolu, obnovu a správu důvěry. V závěru uvidíme, že EUDIW není čistá anarchická SSI, ale regulovaný ekosystém.</p>`,
    sources: [src('EUDI Wallet ARF v3.0.0', U.arf)]
  },
  {
    id: 'route', title: 'Jak budeme postupovat', section: 'Úvod', part: 1, level: 'core', minutes: 3,
    html: `<div class="timeline" style="--steps:5"><div><b>Problém</b><small>prostředník, korelace, odmítnutí služby</small></div><div><b>Nový model</b><small>vydavatel, držitel, ověřovatel</small></div><div><b>Důvěra</b><small>co musí zůstat společné</small></div><div><b>Evropské řešení</b><small>role, pravidla, certifikace</small></div><div><b>Na drátě</b><small>prezentace a vydání credentialu</small></div></div><div class="callout"><strong>Dvě vrstvy:</strong> každý celek nejprve význam a děj, potom konkrétní zprávy a struktury.</div>`,
    notes: `<p>První devadesátiminutový blok buduje mentální model. Druhý blok sleduje konkrétní protokoly. Slidy označené „technické prohloubení“ lze při kratší variantě přeskočit klávesou D.</p><p>Doporučený rytmus: po každé velké sekci dvě až tři minuty na otázky; uvedené časy jsou čistý výklad.</p>`, sources: []
  },
  {
    id: 'first-glossary', title: 'Role, artefakty a první zkratky', section: 'Úvod', part: 1, level: 'core', minutes: 3,
    html: `<table class="matrix glossary-table"><thead><tr><th>Skupina</th><th>Zkratky a role</th><th>Rozdíl</th></tr></thead><tbody><tr><td>Federace</td><td><strong>IdP</strong> = Identity Provider<br><strong>RP</strong> = Relying Party</td><td>IdP autentizuje. RP údaje používá.</td></tr><tr><td>Nový model</td><td><strong>SSI</strong> = Self-Sovereign Identity<br>issuer · holder · verifier</td><td>Vydavatel podepíše, držitel předloží, ověřovatel zkontroluje.</td></tr><tr><td>Artefakty</td><td><strong>VC</strong> = Verifiable Credential<br><strong>EAA</strong> = Electronic Attestation of Attributes<br><strong>PID</strong> = Person Identification Data</td><td>Credential je obecný nosič; VC technický formát, EAA evropská kategorie potvrzení a PID zvláštní sada identifikačních údajů.</td></tr><tr><td>Protokoly</td><td><strong>OAuth</strong> · <strong>OIDC</strong> = OpenID Connect<br><strong>SAML</strong> = Security Assertion Markup Language</td><td>OAuth řeší delegovanou autorizaci, OIDC autentizaci a SAML federované assertions.</td></tr></tbody></table>`,
    notes: `<p>Tento slovník zavádí zkratky dříve, než je začneme běžně používat. Zdůrazněte zejména rozdíl mezi technickým credentialem a právně či sémanticky vymezenou kategorií EAA.</p><p>VC není synonymem EAA. Jedno popisuje technicky ověřitelný artefakt, druhé roli potvrzení atributů v evropském ekosystému. PID má v EUDIW zvláštní postavení a vlastní rulebook.</p>`,
    sources: [src('ARF – roles', U.roles), src('ARF – protocols', U.protocols)]
  },
  {
    id: 'story', title: 'Jeden příběh, tři různé otázky', section: 'Úvod', part: 1, level: 'core', minutes: 3,
    html: `<div class="three-col"><div class="col rule"><h2>1 · Kdo jste?</h2><p>Autentizace držitele.</p><p class="small muted">Např. přístup do banky.</p></div><div class="col rule"><h2>2 · Co o vás platí?</h2><p>Ověřitelný atribut.</p><p class="small muted">Např. věk ≥ 18.</p></div><div class="col rule"><h2>3 · Proč to smí služba chtít?</h2><p>Registrace účelu a rozsahu.</p><p class="small muted">Např. ověřená regulovaná služba.</p></div></div><p class="big-statement">EUDIW musí odpovědět na <span class="accent">všechny tři</span> a nepomíchat je.</p>`,
    notes: `<p>Běžný login řeší hlavně první otázku. Verifiable credentials přidávají druhou. Evropský model registrací RP a důvěry přidává třetí — kdo a pro jaký účel data žádá.</p><p>V dalších slidech se ke třem otázkám budeme vracet. Je to kontrolní mapa pro technické detaily.</p>`, sources: [src('ARF – trust model', U.trust)]
  },
  {
    id: 'terms', title: 'Čtyři pojmy, které se nesmí slít', section: 'Centrální identita', part: 1, level: 'core', minutes: 2,
    html: `<table class="matrix"><thead><tr><th>Pojem</th><th>Otázka</th><th>Příklad</th></tr></thead><tbody><tr><td>Identifikace</td><td>Jakou entitu označujeme?</td><td>sub = 248289761001</td></tr><tr><td>Autentizace</td><td>Kdo právě prokázal kontrolu?</td><td>passkey + biometrie</td></tr><tr><td>Autorizace</td><td>Co smí udělat?</td><td>scope = payments:read</td></tr><tr><td>Atestace</td><td>Jaké tvrzení platí?</td><td>age_over_18 = true</td></tr></tbody></table>`,
    notes: `<p>Identifikátor není důkaz. Přihlášení není automaticky oprávnění. A tvrzení „je starší 18 let“ nemusí odhalovat identitu. Tato separace je pro návrh peněženky zásadní.</p>`, sources: []
  },
  {
    id: 'central-flow', title: 'Centrální identita: užitečný prostředník', section: 'Centrální identita', part: 1, level: 'core', minutes: 2,
    html: `<div class="flow"><div class="node"><b>Uživatel</b><small>prokáže kontrolu účtu</small></div><div class="edge"></div><div class="node"><b>IdP</b><small>autentizuje a vydá assertion/token</small></div><div class="edge"></div><div class="node"><b>RP</b><small>věří IdP a založí relaci</small></div></div><div class="two-col"><div class="col"><h2>Co získáváme</h2><ul><li>jednotné přihlášení</li><li>centralizované řízení účtů</li><li>rychlé odvolání přístupu</li></ul></div><div class="col"><h2>Co koncentrujeme</h2><ul><li>dostupnost a rozhodnutí</li><li>telemetrii vztahů</li><li>bezpečnostní dopad kompromitace</li></ul></div></div>`,
    notes: `<p>Federace je často správná volba uvnitř organizace nebo řízeného ekosystému. Problém nevzniká existencí prostředníka, ale soustředěním pravomoci a znalosti do jednoho online bodu.</p><p>Dejte příklad výpadku IdP: samotná služba může být v pořádku, přesto nový login neproběhne.</p>`, sources: []
  },
  {
    id: 'oauth-oidc-saml', title: 'OAuth, OIDC a SAML nejsou totéž', section: 'Centrální identita', part: 1, level: 'core', minutes: 3,
    html: `<table class="matrix"><thead><tr><th></th><th>Primární účel</th><th>Artefakt</th><th>Typický svět</th></tr></thead><tbody><tr><td>OAuth 2.x</td><td>delegovaná autorizace k API</td><td>access token</td><td>REST/API</td></tr><tr><td>OIDC</td><td>autentizace nad OAuth</td><td>ID Token + UserInfo</td><td>web/mobile</td></tr><tr><td>SAML 2.0</td><td>federované SSO</td><td>XML assertion</td><td>enterprise web</td></tr></tbody></table><p class="callout warn"><strong>Častá chyba:</strong> access token není obecný průkaz identity uživatele.</p>`,
    notes: `<p>OAuth říká, jak klient získá oprávnění přistupovat k resource serveru. OIDC přidá autentizační vrstvu a ID Token určený klientovi. SAML řeší podobný federační problém jiným protokolem a datovým modelem.</p><p>Na úrovni architektury však všechny tři často znamenají závislost RP na online autoritě a předem navázané federaci.</p>`, sources: []
  },
  {
    id: 'oidc-wire', title: 'OIDC login „na drátě“', section: 'Centrální identita', part: 1, level: 'detail', minutes: 3,
    html: `<div class="wire"><div class="explain"><ol><li>RP pošle browser na autorizační endpoint.</li><li>IdP autentizuje člověka.</li><li>RP vymění code za tokeny.</li><li>ID Token sváže <code>iss</code>, <code>sub</code>, <code>aud</code>, <code>nonce</code>.</li></ol></div><pre><code>GET /authorize?&#10; response_type=code&#10; &amp;client_id=shop&#10; &amp;redirect_uri=https://shop/cb&#10; &amp;scope=openid&#10; &amp;state=7c...&#10; &amp;nonce=n-1...&#10; &amp;code_challenge=...&#10;&#10;{&#10; "iss":"https://idp.example",&#10; "sub":"248289761001",&#10; "aud":"shop",&#10; "nonce":"n-1..."&#10;}</code></pre></div>`,
    notes: `<p>Ukažte, kde se IdP dozví RP: autorizační požadavek nese client_id a redirect_uri. I když IdP neposílá atributy navíc, vidí vztah uživatele a služby.</p><p><code>state</code> váže odpověď na klientovu relaci a brání CSRF; <code>nonce</code> váže ID Token na autentizační požadavek; PKCE chrání autorizační kód.</p>`, sources: []
  },
  {
    id: 'intermediary', title: 'Prostředník vidí graf vztahů', section: 'Centrální identita', part: 1, level: 'core', minutes: 2,
    html: `<div class="flow"><div class="node"><b>IdP</b><small>čas, účet, zařízení, RP</small></div><div class="edge"></div><div class="node"><b>Login event</b><small>kdo · kam · kdy · odkud</small></div><div class="edge"></div><div class="node"><b>Graf</b><small>citlivější než jednotlivý atribut</small></div></div><p class="big-statement">Únik „Alice je klient banky X a kliniky Y“ může být horší než únik jména.</p>`,
    notes: `<p>Korelace není jen společný identifikátor. Vzniká také časováním, IP adresou, zařízením a vzorem návštěv. Pairwise pseudonymous identifiers řeší část, ne online pozorování IdP.</p><p>U VC může issuer zůstat při prezentaci offline. Tím mizí jeden velmi silný korelační bod, ne však všechny možnosti korelace.</p>`, sources: []
  },
  {
    id: 'denial', title: 'Denial: kdo může říci „dnes ne“?', section: 'Centrální identita', part: 1, level: 'core', minutes: 2,
    html: `<div class="three-col"><div class="col rule"><h2>Technický</h2><p>výpadek, DDoS, síťová nedostupnost</p></div><div class="col rule"><h2>Administrativní</h2><p>zablokovaný účet, chybné rizikové skóre</p></div><div class="col rule"><h2>Politický</h2><p>změna pravidel nebo přístupové politiky</p></div></div><div class="callout"><strong>Otázka návrhu:</strong> musí být autorita online při každém použití?</div>`,
    notes: `<p>Odlište legitimní revokaci od svévolného nebo chybného odmítnutí. Systém musí umět rychle zastavit kompromitaci, ale nedat jednomu bodu neomezenou možnost blokovat běžné použití.</p>`, sources: []
  },
  {
    id: 'federation-tradeoff', title: 'Federace škáluje správu, neodstraňuje moc', section: 'Centrální identita', part: 1, level: 'core', minutes: 3,
    html: `<table class="matrix"><thead><tr><th>Vlastnost</th><th>Centrální IdP</th><th>Federace IdP</th></tr></thead><tbody><tr><td>Počet hesel</td><td class="yes">nižší</td><td class="yes">nižší</td></tr><tr><td>Online závislost</td><td class="risk">silná</td><td class="risk">stále přítomná</td></tr><tr><td>Korelace</td><td class="risk">snadná</td><td>rozdělena mezi domény</td></tr><tr><td>Kořen důvěry</td><td>jedna autorita</td><td>metadata + smlouvy + klíče</td></tr></tbody></table><p class="callout">Federace decentralizuje provoz mezi IdP, ale držitel obvykle stále nepřenáší důkaz sám.</p>`,
    notes: `<p>SAML/OIDC federace umožňuje více domén identity a omezuje jeden globální účet. Stále je však potřeba společná metadata, registrace klientů, klíče a pravidla.</p><p>Ani SSI neodstraní trust infrastrukturu. Změní její topologii a okamžik použití.</p>`, sources: []
  },
  {
    id: 'ssi-promise', title: 'SSI mění topologii komunikace', section: 'Self-sovereign identity', part: 1, level: 'core', minutes: 2,
    html: `<div class="flow crypto-flow"><div class="node"><b>Issuer</b><small>digitálně podepíše credential svým soukromým klíčem</small></div><div class="edge"></div><div class="node"><b>Holder</b><small>chrání vlastní klíč a podepíše důkaz kontroly</small></div><div class="edge"></div><div class="node"><b>Verifier</b><small>ověří podpis issueru, holder proof a pravidla</small></div></div><div class="callout"><strong>Kryptografie je základ:</strong> digitální podpis chrání integritu a autenticitu, holder proof prokazuje kontrolu klíče a nonce váže odpověď na konkrétní relaci.</div><p class="small muted">Issuer při prezentaci nemusí být online ani informován.</p>`,
    notes: `<p>SSI stojí na asymetrické kryptografii. Issuer podepíše credential. Holder prokáže kontrolu svého soukromého klíče a verifier ověří kryptografický řetězec.</p><p>Kryptografie sama nepotvrdí pravdivost vstupních dat ani oprávnění issueru. Tyto významy doplňuje společná trust infrastruktura a pravidla.</p>`, sources: [src('ARF – data model and protocols', U.protocols)]
  },
  {
    id: 'three-party', title: 'Důkaz se vydá jednou, používá vícekrát', section: 'Self-sovereign identity', part: 1, level: 'core', minutes: 3,
    html: `<div class="timeline" style="--steps:4"><div><b>Issuance</b><small>issuer ověří data a vydá credential</small></div><div><b>Storage</b><small>holder chrání credential a klíč</small></div><div><b>Presentation</b><small>holder sestaví minimální odpověď</small></div><div><b>Verification</b><small>RP ověří podpis, stav a kontext</small></div></div><p class="callout warn">Credential není screenshot ani kopie databázového řádku. Je to kryptograficky ověřitelné tvrzení s kontextem.</p>`,
    notes: `<p>Oddělte issuance a presentation v čase i síti. Uživatel může dostat PID dnes a použít jej zítra bez kontaktu s PID providerem — pokud mechanismus stavu nevyžaduje jinak.</p><p>Verifier musí vědět nejen „podpis sedí“, ale i kdo issuer je, zda smí tento typ vydávat a podle jakých pravidel.</p>`, sources: [src('OpenID4VCI 1.0 Final', U.oid4vci), src('OpenID4VP 1.0 Final', U.oid4vp)]
  },
  {
    id: 'vc-beyond-auth', title: 'VC rozšiřuje login na přenos důvěryhodných faktů', section: 'Verifiable credentials', part: 1, level: 'core', minutes: 2,
    html: `<div class="two-col"><div class="col"><h2>Login</h2><p><strong>Událost:</strong> teď jsem prokázal kontrolu účtu.</p><p><strong>Relace:</strong> typicky IdP → konkrétní RP.</p></div><div class="col"><h2>Credential</h2><p><strong>Artefakt:</strong> issuer potvrzuje atributy a jejich kontext.</p><p><strong>Přenos:</strong> držitel jej může předložit více verifierům.</p></div></div><div class="callout"><strong>Příklady:</strong> PID, diplom, profesní kvalifikace, řidičské oprávnění, věk nad 18.</div>`,
    notes: `<p>Autentizace může být součástí prezentace — holder binding dokazuje, že předkládající ovládá příslušný klíč. Hlavní přidaná hodnota je ale důvěryhodný přenos atributů napříč službami.</p><p>Ptejte se, zda verifier skutečně potřebuje datum narození. Často mu stačí odvozené tvrzení <code>age_over_18=true</code>.</p>`, sources: [src('ARF – architecture', U.architecture)]
  },
  {
    id: 'vc-anatomy', title: 'Co credential musí nést', section: 'Verifiable credentials', part: 1, level: 'detail', minutes: 2,
    html: `<div class="three-col"><div class="col rule"><h2>Význam</h2><ul><li>typ credentialu</li><li>atributy</li><li>issuer</li></ul></div><div class="col rule"><h2>Kryptografie</h2><ul><li>podpis issueru</li><li>holder binding</li><li>presentation binding</li></ul></div><div class="col rule"><h2>Životní cyklus</h2><ul><li>platnost</li><li>status/revokace</li><li>pravidla použití</li></ul></div></div><p class="big-statement">Ověřitelný formát bez společné sémantiky je jen bezpečně podepsaný zmatek.</p>`,
    notes: `<p>Formát odpovídá na syntaxi a kryptografii. Rulebook odpovídá na sémantiku: názvy atributů, povinnost, kódování, validitu a trust anchors.</p><p>Holder binding brání prostému přeposlání cizího credentialu. Presentation binding přes nonce a audience brání replay jiné relace.</p>`, sources: [src('SD-JWT VC draft', U.sdjwtvc), src('PID Rulebook', U.pidRulebook)]
  },
  {
    id: 'trust-remains', title: 'SSI důvěru nemaže — rozkládá ji', section: 'Důvěra', part: 1, level: 'core', minutes: 2,
    html: `<div class="flow"><div class="node"><b>Podpis</b><small>data se nezměnila</small></div><div class="edge"></div><div class="node"><b>Identita issueru</b><small>kdo drží klíč</small></div><div class="edge"></div><div class="node"><b>Oprávnění issueru</b><small>co smí potvrzovat</small></div><div class="edge"></div><div class="node"><b>Proces</b><small>jak tvrzení vzniklo</small></div></div><p class="callout warn">Platný podpis pod falešně získaným credentialem je stále platný podpis.</p>`,
    notes: `<p>Kryptografie dokazuje integritu a kontrolu klíče. Nedokazuje správnost vstupních registrů, kvalitu ověření člověka, bezpečné vydání ani legitimitu issueru.</p><p>Proto se při posuzování systému ptáme na lidi, procesy, software, hardware, registry, audity a právní odpovědnost.</p>`, sources: [src('ARF – trust model', U.trust)]
  },
  {
    id: 'trust-surface', title: 'Příklady vrstev důvěry', section: 'Důvěra', part: 1, level: 'core', minutes: 3,
    subtitle: 'Výběr pro orientaci, nikoli vyčerpávající bezpečnostní model.',
    html: `<table class="matrix"><thead><tr><th>Příklad vrstvy</th><th>Možné selhání</th><th>Příklad obrany</th></tr></thead><tbody><tr><td>Evidence a proces</td><td>credential pro nesprávnou osobu</td><td>pravidla identifikace, audit, kontrola druhou osobou</td></tr><tr><td>Klíče issueru</td><td>masové padělání</td><td>hardwarová ochrana, rotace, revokace, dohled</td></tr><tr><td>Wallet a její klíče</td><td>krádež, export, malware</td><td>bezpečné úložiště, vazba na zařízení, certifikace</td></tr><tr><td>Aplikace a uživatelské rozhraní</td><td>zobrazí jiný účel než odesílá</td><td>integrita aplikace, podepsaný požadavek, souhlas</td></tr><tr><td>Verifier</td><td>nadměrný sběr a sekundární užití</td><td>registrace, minimalizace, právo</td></tr><tr><td>Trust infrastruktura</td><td>podvržený issuer nebo služba</td><td>seznamy důvěry, certifikační autority, registry</td></tr></tbody></table>`,
    notes: `<p>Tabulka ukazuje příklady, ne úplný výčet. Úplný threat model musí doplnit dodavatelský řetězec, aktualizace, obnovu, dostupnost, časové zdroje, koncová zařízení, administrátory a další provozní vazby.</p><p>Projděte řádky od vstupu po použití. Kryptografie pokrývá jen část důvěry. Certifikace proto nekončí u kryptografického modulu.</p>`, sources: [src('ARF – trust model', U.trust), src('ARF – architecture', U.architecture)]
  },
  {
    id: 'roots', title: 'Kořen důvěry je kombinace techniky a pravidel', section: 'Důvěra', part: 1, level: 'core', minutes: 2,
    html: `<div class="two-col"><div class="col"><h2>Technický kořen</h2><ul><li>certifikační autorita nebo trust anchor</li><li>podepsaný seznam entit</li><li>status a revokace</li></ul></div><div class="col"><h2>Institucionální kořen</h2><ul><li>kdo smí být zapsán</li><li>podmínky auditu a dohledu</li><li>náprava, odpovědnost, odvolání</li></ul></div></div><p class="big-statement">„Důvěřuji klíči“ je zkratka pro celý <span class="accent">governance proces</span>.</p>`,
    notes: `<p>Trust list bez pravidel zápisu je jen seznam klíčů. Pravidla bez autentického seznamu nejsou strojově ověřitelná. EUDIW oba světy spojuje.</p><p>Na této vrstvě se SSI znovu potkává s veřejnou správou: společná infrastruktura je nutná, jen není v každé prezentaci online prostředníkem.</p>`, sources: [src('ARF – trust model', U.trust)]
  },
  {
    id: 'eudi-section', title: 'Jak na to odpovídá EUDIW', section: 'EUDIW – řešení', part: 1, level: 'core', minutes: 2, kind: 'section',
    subtitle: 'EUDI Wallet je soubor národních peněženek, společných protokolů, certifikací, registrací a pravidel důvěry.',
    html: `<p class="big-statement">Uživatel řídí prezentaci. <strong>Ekosystém řídí, komu a čemu lze věřit.</strong></p><p><strong>ARF</strong> je Architecture and Reference Framework. <strong>RI</strong> je referenční implementace, která ukazuje jednu možnou realizaci.</p>`,
    notes: `<p>Toto je přechod od obecného modelu k evropské implementaci. EUDIW zachovává držitelem řízenou prezentaci a přidává regulaci providerů, issuerů, wallet komponent i RP.</p><p>Zaveďte zkratky ARF a RI. ARF popisuje cílovou architekturu a požadavky, RI demonstruje konkrétní komponenty a protokoly.</p>`, sources: [src('ARF v3.0.0', U.arf)]
  },
  {
    id: 'eudi-answer', title: 'Technická a organizační opatření EUDIW', section: 'EUDIW – řešení', part: 1, level: 'core', minutes: 3,
    subtitle: 'EUDIW definuje konkrétní opatření pro jednotlivé problémy v ekosystému důvěry.',
    html: `<table class="matrix"><thead><tr><th>Problém</th><th>Opatření definované v EUDIW</th><th>Co nezmizí</th></tr></thead><tbody><tr><td>online prostředník</td><td>držitel předkládá PID nebo EAA přímo</td><td>issuer, status a trust data</td></tr><tr><td>korelace</td><td>selektivní zveřejnění a samostatné klíče</td><td>služba může korelovat vlastní data</td></tr><tr><td>krádež klíče</td><td>bezpečné úložiště, vazba na zařízení, ověření wallet při vydání</td><td>obnova a revokace</td></tr><tr><td>podvržená služba</td><td>access certificate a registrační informace</td><td>uživatelské rozhodnutí a právo</td></tr><tr><td>význam dat</td><td>rulebook, typ credentialu a metadata</td><td>doménová governance</td></tr></tbody></table>`,
    notes: `<p>Neprezentujte žádný řádek jako absolutní ochranu. Selective disclosure minimalizuje předaná data, ale RP může uživatele korelovat přes účet, IP či fingerprint. Access cert autentizuje RP, ale nezaručí, že lidsky formulovaný účel je etický.</p><p>Issuer nemusí být online při každém použití, ale některá trust a status data verifier stále načítá.</p>`, sources: [src('ARF – architecture', U.architecture), src('ARF – trust model', U.trust)]
  },
  {
    id: 'eudi-tech-glossary', title: 'Zkratky technických záruk EUDIW', section: 'EUDIW – řešení', part: 1, level: 'core', minutes: 3,
    html: `<table class="matrix glossary-table"><thead><tr><th>Zkratka</th><th>Význam</th><th>Úloha</th></tr></thead><tbody><tr><td>WUA</td><td>Wallet Unit Attestation</td><td>Zastřešující označení pro WIA a KA.</td></tr><tr><td>WIA</td><td>Wallet Instance Attestation</td><td>Pravost, integrita a stav instance wallet aplikace při vydávání.</td></tr><tr><td>KA</td><td>Key Attestation</td><td>Vlastnosti a stav úložiště klíčů a jeho veřejné klíče při vydávání.</td></tr><tr><td>WSCA / WSCD</td><td>Wallet Secure Cryptographic Application / Device</td><td>Aplikace používající klíče a prostředí, které je chrání.</td></tr><tr><td>LoTE / TL</td><td>List of Trusted Entities / Trusted List</td><td>Strojově ověřitelné kořeny důvěry pro různé kategorie entit.</td></tr><tr><td>CAB / NAB</td><td>Conformity Assessment Body / National Accreditation Body</td><td>Posouzení shody a akreditace posuzovatele.</td></tr></tbody></table>`,
    notes: `<p>Zaveďte zkratky dříve, než se objeví v dalších schématech. Nejdůležitější rozlišení je mezi WIA a KA a mezi jejich použitím při vydání a pozdější prezentací credentialu.</p><p>U variant EAA stačí pro tuto chvíli říci, že QEAA je kvalifikované potvrzení a PuB-EAA potvrzení vydané subjektem veřejného sektoru.</p>`,
    sources: [src('TS3 – Wallet Unit Attestation', U.ts3), src('ARF – roles', U.roles), src('ARF – trust model', U.trust)]
  },
  {
    id: 'stack', title: 'Technologický stack: od křemíku po pravidla', section: 'EUDIW – řešení', part: 1, level: 'core', minutes: 2,
    html: `<div class="timeline" style="--steps:5"><div><b>WSCD</b><small>chrání kryptografický klíč</small></div><div><b>WSCA</b><small>volá secure element/keystore</small></div><div><b>Wallet App</b><small>UX, consent, protokoly</small></div><div><b>Protokoly</b><small>OID4VCI, OID4VP, ISO mdoc</small></div><div><b>Governance</b><small>certifikace, LoTE, registry, rulebooks</small></div></div><div class="callout">Bez spodních vrstev klíč unikne. Bez horních vrstev nevíme, co podpis znamená.</div>`,
    notes: `<p>WSCD je mechanismus chránící klíče; WSCA je komponenta přistupující k WSCD. Konkrétní nasazení může využít lokální secure element, TEE nebo vzdálený mechanismus podle profilu.</p><p>Komponenty mohou mít různé dodavatele a certifikační hranice.</p>`, sources: [src('ARF – architecture', U.architecture)]
  },
  {
    id: 'key-storage', title: 'Klíč není soubor vedle credentialu', section: 'EUDIW – řešení', part: 1, level: 'core', minutes: 2,
    html: `<div class="two-col wide-left"><div class="col"><div class="flow vertical"><div class="node"><b>Wallet App</b><small>žádá: podepiš transcript</small></div><div class="edge"></div><div class="node"><b>WSCA</b><small>autorizuje operaci</small></div><div class="edge"></div><div class="node"><b>WSCD / keystore</b><small>soukromý klíč neopouští hranici</small></div></div></div><div class="col"><h2>Požadované vlastnosti</h2><ul><li>neexportovatelnost</li><li>vazba na uživatele/zařízení</li><li>odolnost proti replay</li><li>stav a revokace</li></ul></div></div>`,
    notes: `<p>„Hardware-backed“ není binární nálepka. Zajímají nás konkrétní garance: kde klíč vznikl, zda je exportovatelný, co autorizuje podpis a jak se pozná kompromitovaná implementace.</p><p>Holder binding funguje jen tak dobře jako ochrana holderova klíče a UI, které podpis vyvolává.</p>`, sources: [src('ARF – architecture', U.architecture), src('TS3 – Wallet Unit Attestation', U.ts3)]
  },
  {
    id: 'wia-ka', title: 'WUA = důkaz o Wallet App i úložišti klíčů', section: 'EUDIW – řešení', part: 1, level: 'core', minutes: 3,
    html: `<div class="issuance-only"><strong>Role při vydávání</strong><span>Wallet předloží WIA a KA issuerovi. Při pozdější prezentaci je RP nedostává.</span></div><div class="two-col"><div class="col rule"><h2>WIA</h2><p><strong>Wallet Instance Attestation</strong></p><ul><li>pravost a integrita aplikace</li><li>identifikátor providera</li><li>status instance</li></ul></div><div class="col rule"><h2>KA</h2><p><strong>Key Attestation</strong></p><ul><li>vlastnosti WSCA/WSCD</li><li>veřejné klíče</li><li>stav úložiště klíčů</li></ul></div></div><p class="small muted">RP se spoléhá na záruku issueru, že wallet při vydání zkontroloval, a na následnou kontrolu statusu credentialu.</p>`,
    notes: `<p>WIA a KA vstupují do issuance. WIA říká issueru, že jedná s legitimní a neodvolanou instancí wallet aplikace. KA dokládá vlastnosti a stav klíčového úložiště i veřejné klíče.</p><p>Při prezentaci RP WIA ani KA nedostává. RP musí věřit procesu issueru: issuer je při vydání ověřil, credential navázal na doložený klíč a podle pravidel promítá zneplatnění wallet do statusu credentialu.</p>`, sources: [src('TS3 – Wallet Unit Attestation', U.ts3)]
  },
  {
    id: 'certification', title: 'Certifikace je řetězec, ne logo', section: 'EUDIW – řešení', part: 1, level: 'core', minutes: 2,
    html: `<div class="flow"><div class="node"><b>Schéma</b><small>požadavky a assurance level</small></div><div class="edge"></div><div class="node"><b>CAB</b><small>posoudí produkt/proces</small></div><div class="edge"></div><div class="node"><b>NAB</b><small>akredituje CAB</small></div><div class="edge"></div><div class="node"><b>Dohled</b><small>životní cyklus a náprava</small></div></div><p class="callout warn">Certifikace je snímek + průběžné povinnosti. Aktualizace softwaru může měnit posuzovanou bezpečnost.</p>`,
    notes: `<p>Vysvětlete role Conformity Assessment Body a National Accreditation Body. Certifikace má technickou, procesní i organizační stránku.</p><p>Po závažné zranitelnosti musí následovat aktualizace, status, případná revokace a komunikace s uživateli.</p>`, sources: [src('ARF – roles', U.roles), src('ARF – trust model', U.trust)]
  },
  {
    id: 'regulated-ssi', title: 'EUDIW je SSI princip, ne absolutní suverenita', section: 'EUDIW – řešení', part: 1, level: 'core', minutes: 2,
    html: `<table class="matrix"><thead><tr><th>Držitel skutečně řídí</th><th>Držitel neřídí sám</th></tr></thead><tbody><tr><td>kdy credential předloží</td><td>kdo smí vydat PID</td></tr><tr><td>které povolené atributy zveřejní</td><td>obsah a pravidla typu</td></tr><tr><td>souhlas s konkrétním požadavkem</td><td>certifikaci wallet řešení</td></tr><tr><td>lokální použití klíče</td><td>revokaci kompromitované instance</td></tr></tbody></table><p class="big-statement">„User-controlled“ neznamená „user-defined truth“.</p>`,
    notes: `<p>EUDIW maximalizuje kontrolu uživatele nad prezentací, ale veřejně uznávané tvrzení stále vzniká v regulovaném ekosystému.</p><p>Je přesnější říkat „holder-controlled presentation“ než tvrdit, že celý trust systém je self-sovereign.</p>`, sources: [src('ARF – roles', U.roles), src('ARF – trust model', U.trust)]
  },
  {
    id: 'kill-switch', title: 'Lze peněženku odříznout? Ano — a je to záměr', section: 'EUDIW – řešení', part: 1, level: 'core', minutes: 3,
    html: `<div class="flow"><div class="node"><b>Wallet Provider</b><small>zneplatní WIA / KA</small></div><div class="edge"></div><div class="node"><b>PID Provider</b><small>pravidelně kontroluje stav</small></div><div class="edge"></div><div class="node"><b>PID status</b><small>PID může být odvolán</small></div><div class="edge"></div><div class="node"><b>RP</b><small>odmítnutý PID při další prezentaci</small></div></div><div class="callout warn">Bezpečnostní pojistka i bod moci. Ochrana stojí na pravidlech, opravných prostředcích a obnově.</div>`,
    notes: `<p>PID provider kontroluje WIA a KA alespoň jednou za 24 hodin během platnosti PID a při zneplatnění může PID revokovat.</p><p>Nepřehánějte závěr: jiné EAA mohou mít jiné politiky. Revokace wallet nemusí magicky invalidovat každé kdy vydané tvrzení.</p>`, sources: [src('TS3 – Wallet Unit Attestation', U.ts3), src('ARF – trust model', U.trust)]
  },
  {
    id: 'ecosystem-overview', title: 'Ekosystém ARF: role kolem uživatele', section: 'Ekosystém', part: 1, level: 'core', minutes: 3,
    html: `<div class="ecosystem-diagram"><div class="eco-governance"><b>Governance a důvěra</b><span>Registrar · Access CA · Registration provider · LoTE/TL provider · CAB/NAB · dohled · attestation schemes</span></div><div class="eco-main"><div class="eco-issuers"><h2>Vydávání</h2><div class="eco-source">Authentic Source</div><div class="eco-box">PID Provider</div><div class="eco-box">EAA Provider <small>zahrnuje kvalifikované, veřejné i nekvalifikované EAA</small></div></div><div class="eco-exchange"><span>vydání credentialu</span><b>→</b></div><div class="eco-wallet"><h2>User</h2><strong>Wallet Unit</strong><small>credentials + klíče + souhlas</small></div><div class="eco-exchange"><span>prezentace</span><b>→</b></div><div class="eco-rp"><h2>Použití</h2><strong>Relying Party</strong><small>případně přes intermediary</small></div></div><div class="eco-foundation"><b>Provozní základ</b><span>Wallet Provider · WSCA/WSCD nebo keystore · výrobce zařízení · služby pro elektronický podpis</span></div></div>`,
    notes: `<p>Diagram záměrně redukuje kategorie vydavatelů na PID Provider a EAA Provider. Pod EAA Provider zde patří qualified, public-body i non-qualified varianty. Tato redukce pomáhá nejprve pochopit tok vydání a prezentace.</p><p>Okolní role z ARF zůstávají zachovány ve dvou pásech: governance a provozní základ. Trasujte PID od authentic source přes PID Provider a Wallet Unit k RP.</p>`, sources: [src('ARF – roles', U.roles)]
  },
  {
    id: 'role-clusters', title: 'Čtyři skupiny rolí v ekosystému', section: 'Ekosystém', part: 1, level: 'core', minutes: 2,
    html: `<div class="two-col"><div class="col rule"><h2>1 · Governance</h2><p>registrar · Access CA · LoTE/TL · CAB · NAB · dohled</p></div><div class="col rule"><h2>2 · Vydávání</h2><p>PID Provider · EAA Provider · authentic sources</p></div><div class="col rule"><h2>3 · Držení</h2><p>User · Wallet Provider · Wallet Unit</p></div><div class="col rule"><h2>4 · Použití</h2><p>RP · intermediaries · signature services</p></div></div>`,
    notes: `<p>Začněte governance, protože určuje, kdo smí vstoupit do dalších rolí a jaké kořeny důvěry se distribuují. Potom sledujte credential od vydání přes držení až k použití.</p><p>Registrar zapisuje RP a jeho zamýšlené použití. Access CA vydává certifikát, kterým se konkrétní služba kryptograficky autentizuje.</p>`, sources: [src('ARF – roles', U.roles)]
  },
  {
    id: 'architecture-figure', title: 'Čtyři oddělené proudy architektury', section: 'Ekosystém', part: 1, level: 'core', minutes: 2,
    html: `<div class="architecture-streams"><div><b>1 · Vydání</b><span>Wallet Unit ⇄ PID/EAA Provider</span><small>autorizace, WIA/KA, holder binding, credential</small></div><div><b>2 · Online prezentace</b><span>Wallet Unit ⇄ Relying Party</span><small>registrace RP, požadavek, souhlas, presentation</small></div><div><b>3 · Proximity prezentace</b><span>Wallet Unit ⇄ reader</span><small>engagement, secure session, mdoc request/response</small></div><div><b>4 · Trust a životní cyklus</b><span>všechny role ⇄ trust služby</span><small>certifikáty, LoTE/TL, status listy, rulebooks, dohled</small></div></div><p class="callout">Osobní data a soukromé klíče zůstávají ve Wallet Unit. Evropská infrastruktura distribuuje pravidla a ověřitelné kořeny důvěry, nikoli centrální databázi peněženek.</p>`,
    notes: `<p>Původní diagram ARF je pro projekci příliš hustý, proto jej zde převádíme na čtyři čitelné proudy. Zdůrazněte, že issuance, online presentation, proximity presentation a trust/lifecycle nejsou jedna synchronní transakce.</p><p>Schéma je logické. Jedna organizace může plnit více rolí a jedna role může být realizována několika komponentami.</p>`, sources: [src('ARF – architecture', U.architecture)]
  },
  {
    id: 'ri-mapping', title: 'Referenční implementace je ukázka, ne norma', section: 'Ekosystém', part: 1, level: 'core', minutes: 3,
    html: `<table class="matrix"><thead><tr><th>ARF role</th><th>RI komponenty</th><th>Co demonstrují</th></tr></thead><tbody><tr><td>Wallet Unit</td><td>Android app + Core; iOS app + Wallet Kit</td><td>UI, storage, issuance, presentation</td></tr><tr><td>Issuer</td><td>Issuer service + OIDC AS</td><td>credential offer a OID4VCI</td></tr><tr><td>RP</td><td>web verifier + proximity verifier</td><td>OID4VP a ISO mdoc</td></tr><tr><td>Trust služby</td><td>RP registration, trusted/status list</td><td>registry a lifecycle</td></tr></tbody></table><div class="ri-links"><a href="https://docs.eudi.dev/latest/reference-implementation/repositories-list/" target="_blank" rel="noreferrer"><strong>Přehled komponent a repozitářů</strong><span>docs.eudi.dev</span></a><a href="https://github.com/eu-digital-identity-wallet" target="_blank" rel="noreferrer"><strong>Zdrojové kódy RI</strong><span>GitHub organizace EUDI Wallet</span></a></div><p class="small muted">RI je interoperabilní demonstrátor. Podpůrné registry a trust služby v RI nejsou produkční autoritou.</p>`,
    notes: `<p>Odlište normativní ARF a technické specifikace od implementačního příkladu. RI je modulární sada mobilních aplikací, knihoven, issuerů, verifierů a podpůrných služeb, nikoli jeden monorepozitář.</p><p>Odkazy na slidu vedou na kurátorovaný seznam repozitářů a oficiální GitHub organizaci. Pro shodu jsou zdrojem ARF, technické specifikace a závazné předpisy. Registry a trusted-list služby RI jsou výslovně experimentální.</p>`, sources: [src('EUDI Reference Implementation', U.ri), src('RI repositories list', U.riRepos), src('Official EUDI Wallet GitHub', U.riGithub)]
  },
  {
    id: 'wallet-functions', title: 'Co musí peněženka umět', section: 'Ekosystém', part: 1, level: 'core', minutes: 2,
    html: `<div class="four-col"><div class="col rule"><h2>Získat</h2><ul><li>najít issuer</li><li>autorizovat vydání</li><li>navázat credential na klíč</li></ul></div><div class="col rule"><h2>Chránit</h2><ul><li>klíče a credentials</li><li>lokální autentizace</li><li>bezpečné aktualizace</li></ul></div><div class="col rule"><h2>Předložit</h2><ul><li>porozumět požadavku</li><li>minimalizovat atributy</li><li>ověřit RP a získat souhlas</li></ul></div><div class="col rule"><h2>Provozovat</h2><ul><li>auditní záznamy</li><li>záloha a obnova</li><li>životní cyklus a revokace</li></ul></div></div><div class="callout"><strong>Audit chrání odpovědnost, záloha a obnova dostupnost.</strong> Ani jedna funkce nesmí vytvořit snadno exportovatelnou kopii soukromých klíčů.</div>`,
    notes: `<p>Wallet parsuje podepsaný požadavek, ověřuje RP a registraci, vybírá credentials, vysvětluje účel, získá souhlas a vytvoří kryptografickou odpověď.</p><p>Audit má dát uživateli i provozovateli dohledatelnost. Záloha a obnova musí řešit ztrátu zařízení, ale nesmí obejít neexportovatelnost klíčů a holder binding.</p>`, sources: [src('ARF – architecture', U.architecture)]
  },
  {
    id: 'part1-recap', title: 'Víme, jak vypadá ekosystém EUDIW a jaké byly motivace', section: 'Shrnutí bloku 1', part: 1, level: 'core', minutes: 2,
    html: `<ol><li><strong>Federace</strong> řeší správu loginů, ale koncentruje online zprostředkování.</li><li><strong>VC</strong> oddělí vydání od prezentace a dovolí přenášet atributy.</li><li><strong>SSI</strong> stojí na digitálních podpisech, klíčích a kryptografických důkazech, ale stále potřebuje trust infrastrukturu.</li><li><strong>EUDIW</strong> kombinuje kontrolu prezentace s regulovaným ekosystémem důvěry.</li></ol><p class="callout"><strong>Po pauze:</strong> otevřeme konkrétní tokeny, datové struktury a sekvence zpráv.</p>`,
    notes: `<p>Nechte studenty popsat rozdíl mezi „IdP mě právě přihlásil“ a „issuer dříve vydal credential, který teď předkládám“.</p><p>Kontrolní otázka: zmizel online bod moci? Ne úplně; issuer je offline při prezentaci, ale existují status, registrace, trust listy a revokace.</p>`, sources: []
  },
  {
    id: 'wire-section', title: 'Od modelu k bitům', section: 'Formáty a protokoly', part: 2, level: 'core', minutes: 2, kind: 'section',
    subtitle: 'Druhý blok: jak se význam, důvěra, souhlas a privacy projeví v tokenu a v konkrétní sekvenci zpráv.',
    html: `<p class="big-statement">Budeme vždy hledat vazbu <strong>issuer → credential → holder → verifier session</strong>.</p><div class="protocol-primer"><div><b>JSON · JWS · JWT · SD-JWT</b><small>textová webová větev a selective disclosure</small></div><div><b>CBOR · COSE · mdoc</b><small>binární větev, zejména proximity</small></div><div><b>OID4VP</b><small>OpenID for Verifiable Presentations</small></div><div><b>OID4VCI</b><small>OpenID for Verifiable Credential Issuance</small></div></div>`,
    notes: `<p>Připomeňte, že kryptografická kontrola bez kontextu nestačí. U každé zprávy se ptejte: kdo ji podepsal, pro koho je určena, k jaké relaci patří a odkud se bere její sémantika.</p><p>Tento slide předem zavádí dvě formátové rodiny i názvy protokolů. SD-JWT znamená Selective Disclosure JSON Web Token, mdoc mobile document.</p>`, sources: [src('ARF – protocols', U.protocols)]
  },
  {
    id: 'format-landscape', title: 'Dva formátové světy v EUDIW', section: 'Formáty credentials', part: 2, level: 'core', minutes: 2,
    html: `<table class="matrix"><thead><tr><th></th><th>SD-JWT VC</th><th>ISO mdoc</th></tr></thead><tbody><tr><td>Datový základ</td><td>JSON + JWS + disclosures</td><td>CBOR + COSE + namespaces</td></tr><tr><td>Typická síla</td><td>webové a vzdálené flow</td><td>proximity/offline, mDL</td></tr><tr><td>Selective disclosure</td><td>hashované disclosures</td><td>issuer-signed data elements</td></tr><tr><td>Holder proof</td><td>KB-JWT</td><td>DeviceAuth / session transcript</td></tr></tbody></table><div class="callout">Dále jdeme do hloubky u JWT větve; mdoc držíme jako důležitý rozdílový model.</div>`,
    notes: `<p>Oba formáty umějí selektivní zveřejnění a vazbu na zařízení/relaci, ale jejich datové a kryptografické stavebnice jsou jiné.</p><p>SD-JWT VC je stále IETF draft, zatímco základ selective disclosure pro JWT je RFC 9901. mdoc vychází z ISO/IEC 18013-5.</p>`, sources: [src('RFC 9901 – SD-JWT', U.sdjwt), src('SD-JWT VC draft', U.sdjwtvc), src('ARF – protocols', U.protocols)]
  },
  {
    id: 'jwt-to-sdjwt', title: 'JWT zveřejní celý payload; SD-JWT rozdělí claims', section: 'Formáty credentials', part: 2, level: 'core', minutes: 2,
    html: `<div class="two-col"><div class="col"><h2>JWS/JWT</h2><pre><code>base64(header)&#10;.base64(payload)&#10;.signature&#10;&#10;payload = všechny claims</code></pre><p class="small">Podepsané ≠ šifrované.</p></div><div class="col"><h2>SD-JWT</h2><pre><code>issuer-signed JWT&#10;~disclosure A&#10;~disclosure B&#10;~...&#10;~KB-JWT</code></pre><p class="small">Holder vybere jen potřebné disclosures.</p></div></div>`,
    notes: `<p>Base64url není ochrana důvěrnosti. Běžný podepsaný JWT ukáže celý payload každému příjemci.</p><p>SD-JWT ponechá v podepsaném JWT hashové závazky. Hodnoty jsou ve zvláštních disclosures a držitel při prezentaci pošle jen vybrané.</p>`, sources: [src('RFC 9901 – SD-JWT', U.sdjwt)]
  },
  {
    id: 'disclosure-mechanics', title: 'Selective disclosure: issuer podepisuje hash závazku', section: 'Formáty credentials', part: 2, level: 'core', minutes: 3,
    html: `<div class="timeline" style="--steps:4"><div><b>1 · Disclosure</b><small>[salt, claim name, value]</small></div><div><b>2 · Hash</b><small>base64url(SHA-256(disclosure))</small></div><div><b>3 · _sd</b><small>hash je v podepsaném JWT</small></div><div><b>4 · Present</b><small>holder přiloží jen vybrané disclosure</small></div></div><div class="callout warn">Salt brání slovníkovému útoku na malou množinu hodnot, například boolean.</div>`,
    notes: `<p>Verifier disclosure znovu zahashuje a zkontroluje, že digest je v podepsaném <code>_sd</code>. Claim, jehož disclosure nedostal, nezná.</p><p>Selective disclosure nezaručuje, že samotná kombinace odhalených atributů není unikátní. Datová minimalizace je stále návrhové rozhodnutí.</p>`, sources: [src('RFC 9901 – SD-JWT', U.sdjwt)]
  },
  {
    id: 'sdjwt-wire', title: 'SD-JWT v kompaktní podobě', section: 'Formáty credentials', part: 2, level: 'detail', minutes: 2,
    html: `<div class="wire"><div class="explain"><ol><li>Issuer podepíše JWT s digesty.</li><li>Za <code>~</code> přidá disclosures.</li><li>Při prezentaci holder některé vynechá.</li><li>Na konec může přidat KB-JWT.</li></ol></div><pre><code>eyJhbGciOiJFUzI1NiJ9.&#10;eyJpc3MiOiJodHRwczovL2...&#10;.MEQC...&#10;~WyIyR0xDNDIiLCJiaXJ0aGRhdGUiLCIyMDAxLTAyLTAzIl0&#10;~WyJHYTVnIiwibmFtZSIsIkFkYSJd&#10;~eyJ0eXAiOiJrYitqd3Qi...&#10;&#10;issuer JWT ~ D_birthdate ~ D_name ~ KB-JWT</code></pre></div>`,
    notes: `<p>Ve skutečném řetězci nejsou mezery ani popisky. Tilda je oddělovač. Issuance končí také tildou, presentation s key bindingem končí KB-JWT.</p><p>Dekódovaná disclosure je JSON pole <code>[salt, claim-name, claim-value]</code>. U vnořených struktur existují další pravidla.</p>`, sources: [src('RFC 9901 – compact serialization', U.sdjwt)]
  },
  {
    id: 'pid-payload', title: 'PID jako SD-JWT VC: sémantika nad SD-JWT', section: 'Formáty credentials', part: 2, level: 'detail', minutes: 2,
    html: `<div class="wire"><div class="explain"><ul><li><code>vct</code> určí typ a metadata.</li><li><code>iss</code>, <code>nbf</code>, <code>exp</code> dávají issuer a technickou platnost.</li><li><code>cnf</code> váže credential na holder key.</li><li><code>_sd</code> obsahuje hashované claims.</li></ul></div><pre><code>{&#10; "iss":"https://pid.cz",&#10; "vct":"urn:eudi:pid:1",&#10; "nbf":1795600000,&#10; "exp":1798200000,&#10; "cnf":{"jwk":{"kty":"EC",...}},&#10; "_sd_alg":"sha-256",&#10; "_sd":["VJk...","m1Q..."],&#10; "status":{"status_list":{...}}&#10;}</code></pre></div><span class="code-caption">Zjednodušený pedagogický payload; domácí typ může rozšířit základní <code>urn:eudi:pid:1</code>.</span>`,
    notes: `<p>PID Rulebook definuje základní VCT <code>urn:eudi:pid:1</code> a namespace pro národní typy. Povinné a volitelné claims definuje rulebook, ne obecný SD-JWT standard.</p><p><code>nbf</code>/<code>exp</code> jsou technická platnost tokenu. Administrativní datum expirace dokladu může být samostatný atribut.</p>`, sources: [src('PID Rulebook', U.pidRulebook), src('ARF Topic 3', U.topic3), src('SD-JWT VC draft', U.sdjwtvc)]
  },
  {
    id: 'kb-jwt', title: 'KB-JWT sváže prezentaci s držitelem a relací', section: 'Formáty credentials', part: 2, level: 'detail', minutes: 2,
    html: `<div class="flow"><div class="node"><b>Credential</b><small>obsahuje holder public key v cnf</small></div><div class="edge"></div><div class="node"><b>KB-JWT</b><small>podepsán odpovídajícím private key</small></div><div class="edge"></div><div class="node"><b>Session</b><small>aud + nonce + sd_hash</small></div></div><pre><code>{"typ":"kb+jwt","alg":"ES256"}.&#10;{"aud":"https://rp.example",&#10; "nonce":"n-9f...",&#10; "iat":1795600123,&#10; "sd_hash":"uQz..."}.signature</code></pre>`,
    notes: `<p><code>sd_hash</code> pokrývá konkrétní prezentaci včetně vybraných disclosures. <code>nonce</code> a <code>aud</code> brání replay u jiného RP nebo v jiné relaci.</p><p>KB-JWT nedokazuje občanskou identitu zařízení. Dokazuje kontrolu klíče, na který issuer credential vázal.</p>`, sources: [src('RFC 9901 – key binding', U.sdjwt)]
  },
  {
    id: 'sdjwt-lab', title: 'Laboratoř SD-JWT: od payloadu k presentation', section: 'Formáty credentials', part: 2, level: 'detail', minutes: 3, kind: 'interactive',
    html: sdJwtLabHtml,
    notes: `<p>Nejprve nechte ukázku vystavit výchozí payload. V prostředním panelu ukažte, že podepsaný JWT obsahuje digesty a veřejný holder key v <code>cnf</code>, nikoli selektivní hodnoty. Zaškrtnutím claims měňte pouze přiložené disclosures.</p><p>Potom klikněte na „Nová relace“. Issuer JWT a disclosures zůstanou stejné, ale nový <code>nonce</code> změní <code>sd_hash</code>, KB-JWT i holderův podpis. Demo používá skutečné SHA-256 a dočasné P-256 podpisy přes Web Crypto. Nejde o produkční issuer ani trvalé klíče.</p>`,
    sources: [src('RFC 9901 – SD-JWT', U.sdjwt)]
  },
  {
    id: 'mdoc-difference', title: 'mdoc: stejný cíl, jiná stavebnice', section: 'Formáty credentials', part: 2, level: 'core', minutes: 2,
    html: `<div class="two-col"><div class="col"><h2>IssuerAuth</h2><p>COSE podpis nad MobileSecurityObject; digesty jednotlivých data elements.</p></div><div class="col"><h2>DeviceAuth</h2><p>Zařízení váže odpověď na SessionTranscript a požadavek readeru.</p></div></div><div class="callout"><strong>Proximity:</strong> DeviceEngagement → SessionEstablishment → DeviceRequest/Response, typicky QR + BLE.</div><p class="small muted">mDL Rulebook vyžaduje ISO/IEC 18013-5; pro mDL se SD-JWT VC nepoužívá.</p>`,
    notes: `<p>mdoc používá CBOR/COSE a namespacy, nikoli JSON/JWS. Selektivní zveřejnění je vestavěno přes jednotlivé issuer-signed data elements.</p><p>Pro offline wallet-to-wallet je to dnes klíčový formát. Později uvidíme engagement a transporty.</p>`, sources: [src('mDL Rulebook', U.mdlRulebook), src('ARF – protocols', U.protocols)]
  },
  {
    id: 'rp-section', title: 'Kdo se ptá a za jakým účelem?', section: 'Registrace RP', part: 2, level: 'core', minutes: 2, kind: 'section',
    subtitle: 'EUDIW odděluje kryptografickou autentizaci služby od registrační informace o její roli, účelu a deklarovaných datech.',
    html: `<p class="big-statement"><strong>Wallet RP Access Certificate (WRPAC)</strong> odpoví „kdo drží klíč“. <strong>Wallet RP Registration Certificate (WRPRC)</strong> odpoví „co a proč deklaroval“.</p>`,
    notes: `<p>Právní pojem wallet-relying party zahrnuje také issuery. ARF technicky používá Relying Party hlavně pro službu nebo verifier. Proto se vždy ptejte, jakou roli organizace v konkrétní interakci plní.</p><p>Terminologie se zkracuje na access a registration certificate. Důležité je funkční rozdělení: autentizace endpointu a klíče versus registrovaná role, služba, účel a rozsah dat.</p>`, sources: [src('ARF – roles', U.roles), src('ARF – trust model', U.trust), src('ETSI TS 119 475', U.etsi475)]
  },
  {
    id: 'access-vs-registration', title: 'Verifier i issuer se registrují podle své činnosti', section: 'Registrace RP', part: 2, level: 'core', minutes: 2,
    html: `<table class="matrix"><thead><tr><th>Role v interakci</th><th>Co registruje</th><th>Kdy potřebuje intended use</th></tr></thead><tbody><tr><td>Verifier / service provider</td><td>právní entitu, službu, entitlement <code>Service_Provider</code>, privacy policy, credentials a claims</td><td>vždy pro konkrétní službu a účel požadavku</td></tr><tr><td>Čistý issuer</td><td>entitlement <code>PID/QEAA/PuB-EAA/Non-Q</code> a <code>providesAttestations</code></td><td>ne, pokud z walletu žádná data nepožaduje</td></tr><tr><td>Issuer žádající PID/EAA</td><td>obě předchozí role</td><td>ano, pro údaje potřebné během issuance</td></tr></tbody></table><div class="callout warn"><strong>Registrace zajišťuje transparentnost.</strong> Sama nenahrazuje právní oprávnění vydávat nebo požadovat údaje.</div>`,
    notes: `<p>Registrar zapisuje nejen verifiery, ale také PID a EAA providery. Issuer registruje typ provideru a co vydává. Pokud během vydání požádá wallet o PID nebo jiný credential, současně vystupuje jako service provider a registruje vlastní intended use.</p><p>Neříkejte, že Registrar tím automaticky povoluje činnost. Registrace zveřejní deklaraci a strojově ověřitelná data. Právní oprávnění může vznikat v jiném procesu.</p>`, sources: [src('ARF – roles', U.roles), src('ARF – trust model', U.trust), src('TS5 – RP registration information', U.ts5)]
  },
  {
    id: 'registration-structure', title: 'Registration Information: entita, služba a intended use', section: 'Registrace RP', part: 2, level: 'core', minutes: 3,
    html: `<div class="wire registration-wire"><div class="explain"><div class="registration-tree"><div><b>WalletRelyingParty</b><span>právní identita · země · registry URI</span></div><div><b>Service</b><span>service identifier · název · stav · entitlements</span></div><div><b>IntendedUse</b><span>identifikátor · lokalizovaný purpose · privacy policy</span></div><div><b>Credential + claims</b><span>format · VCT/docType · přesné claim paths</span></div></div><p class="small muted">WRPRC vzniká pro jednu kombinaci Service × IntendedUse. WRPAC a WRPRC se propojí shodou RP a service identifieru.</p></div><pre><code>// zjednodušený výřez modelu TS5/TS6&#10;{&#10; "rpId":"CZ-LEI-…",&#10; "serviceId":"age-check-web",&#10; "intendedUse":{&#10;  "id":"age-check",&#10;  "purpose":{"cs":"Ověření plnoletosti"},&#10;  "privacyPolicy":"https://bank.example/privacy",&#10;  "credentials":[{&#10;   "format":"dc+sd-jwt",&#10;   "meta":{"vct":"urn:eudi:pid:1"},&#10;   "claims":[{"path":["age_over_18"]}]&#10;  }]&#10; }&#10;}</code></pre></div>`,
    notes: `<p>Datový model začíná právní entitou a jejími službami. Každá služba má role a může mít několik intended uses. Intended use obsahuje účel, privacy policy a přesně popsané credentialy a claim paths.</p><p>Registration certificate neboli WRPRC je podepsaný JWT pro jednu kombinaci služby a intended use. Access certificate neboli WRPAC je X.509 certifikát pro klíč a endpoint. Wallet kontroluje shodu RP identifieru a service identifieru mezi oběma artefakty. Kód na slidu záměrně zkracuje názvy polí, zachovává však hierarchii modelu.</p>`, sources: [src('TS5 – RP registration information', U.ts5), src('TS6 – minimum registration dataset', U.ts6), src('ETSI TS 119 475', U.etsi475)]
  },
  {
    id: 'trust-lists', title: 'Tři publikační vrstvy důvěry', section: 'Registrace RP', part: 2, level: 'core', minutes: 3,
    html: `<table class="matrix trust-publication-table"><thead><tr><th>Vrstva</th><th>Kdo a co zapisuje</th><th>Co obsahuje</th><th>Jak se publikuje</th></tr></thead><tbody><tr><td>Trusted List</td><td>členský stát: QEAA a QTSP</td><td>poskytovatel, trust service, certifikát, stav, policy</td><td>stát podepíše národní TL; Commission LOTL publikuje odkazy</td></tr><tr><td>List of Trusted Entities</td><td>stát notifikuje Komisi: Wallet/PID/PuB-EAA provider, Access CA, registration provider</td><td>typ entity, identita, trust anchor, service URI, stav a datum</td><td>Komise vytvoří, podepíše a publikuje LoTE; umístění oznámí v OJEU</td></tr><tr><td>Národní RP registry</td><td>Registrar po národním onboarding procesu</td><td>entita, služby, intended uses, credentials a claims</td><td>human + machine API, WRPRC JWT a status list</td></tr></tbody></table><div class="callout warn">Jednotlivý verifier není v TL ani LoTE. Wallet ověří WRPAC přes Access CA v LoTE a WRPRC přes registration provider v LoTE.</div>`,
    notes: `<p>Trust list není jeden evropský soubor všech subjektů. Národní Trusted Lists podle ETSI TS 119 612 slouží pro kvalifikované trust services. Commission List of Trusted Lists je rozcestník na národní TL.</p><p>LoTE podle ETSI TS 119 602 pokrývají další provider role. Členský stát entitu notifikuje Komisi a Komise podepsaný seznam publikuje. Národní Registrar vede objemná data o konkrétních RP. Při změně se entita typicky nemaže, ale změní stav. Certifikáty a registrační informace mají vlastní revokaci nebo status.</p>`, sources: [src('ARF – trust model', U.trust), src('ARF – roles', U.roles), src('TS2 – provider notification and publication', U.ts2), src('TS5 – RP registry API', U.ts5)]
  },
  {
    id: 'signed-rp-request', title: 'RP certifikáty v podepsaném OID4VP requestu', section: 'Registrace RP', part: 2, level: 'detail', minutes: 2,
    html: `<div class="wire"><div class="explain"><ol><li>RP podepíše Request Object klíčem z WRPAC.</li><li>JWS header nese WRPAC chain v <code>x5c</code>.</li><li><code>verifier_info</code> nese WRPRC JWT pro konkrétní intended use.</li><li>Wallet ověří oba trust řetězce, identifikátory a rozsah DCQL.</li></ol></div><pre><code>// Request Object JWS header&#10;{"alg":"ES256",&#10; "x5c":["WRPAC","Access-CA"]}&#10;&#10;// signed payload fragment&#10;"client_id":"x509_hash:ab...",&#10;"verifier_info":[{&#10; "format":"registration_cert",&#10; "data":"eyJ...WRPRC-JWT..."&#10;}],&#10;"dcql_query":{"credentials":[{&#10; "id":"pid",&#10; "claims":[{"path":["age_over_18"]}]&#10;}]}</code></pre></div>`,
    notes: `<p>Access certificate WRPAC autentizuje podpisový klíč a službu. Registration certificate WRPRC přenáší registrovanou službu, jeden intended use a rozsah dat. <code>verifier_info</code> je profilová informace o verifieru, kterou wallet používá před zobrazením souhlasu.</p><p>Produkční validace zahrnuje cestu a stav WRPAC, důvěru k Access CA, podpis a stav WRPRC, důvěru k provideru registračních certifikátů, shodu RP a service identifieru a kontrolu, že DCQL nepřekračuje registrované claims.</p>`, sources: [src('ETSI TS 119 472-2', U.etsi472), src('TS5 – RP registration information', U.ts5), src('ETSI TS 119 475', U.etsi475), src('ARF – trust model', U.trust)]
  },
  {
    id: 'oid4vp-section', title: 'Online prezentace: OpenID4VP', section: 'OID4VP', part: 2, level: 'core', minutes: 2, kind: 'section',
    subtitle: 'RP vytvoří podepsaný požadavek; wallet vybere credential, zobrazí účel a vrátí presentation vázanou na relaci.',
    html: `<div class="flow"><div class="node"><b>Request</b><small>co, kdo, proč, nonce</small></div><div class="edge"></div><div class="node"><b>Consent</b><small>výběr credentialu a claims</small></div><div class="edge"></div><div class="node"><b>vp_token</b><small>selective presentation + proof</small></div></div>`,
    notes: `<p>OpenID4VP 1.0 je finální standard z července 2025. ARF jej profiluje a doplňuje evropskou RP autentizací a registrací.</p>`, sources: [src('OpenID4VP 1.0 Final', U.oid4vp), src('ARF – protocols', U.protocols)]
  },
  {
    id: 'oid4vp-overview', title: 'OID4VP ve čtyřech krocích', section: 'OID4VP', part: 2, level: 'core', minutes: 2,
    html: `<div class="timeline" style="--steps:4"><div><b>1 · Start</b><small>URL, QR nebo Digital Credentials API</small></div><div><b>2 · Request</b><small>signed Request Object + DCQL</small></div><div><b>3 · Wallet</b><small>ověření RP, consent, key binding</small></div><div><b>4 · Response</b><small>vp_token; často direct_post.jwt</small></div></div><div class="callout">Protocol transport vyvolá wallet. Credential format určí vnitřek presentation.</div>`,
    notes: `<p>Nezaměňujte OID4VP s formátem credentialu. OID4VP přenese SD-JWT VC i mdoc presentation podle profilu.</p><p>DCQL je dotaz na credentials a claims. Response může obsahovat více výsledků pod ID jednotlivých dotazů.</p>`, sources: [src('OpenID4VP 1.0 Final', U.oid4vp)]
  },
  {
    id: 'same-device', title: 'Same-device: browser a wallet sdílejí zařízení', section: 'OID4VP', part: 2, level: 'core', minutes: 2,
    html: `<div class="device-topology same-device-topology"><div class="device-boundary"><span class="topology-label">Zařízení uživatele</span><div class="component wallet-component"><b>Wallet Unit</b><small>výběr credentialu, souhlas, presentation</small></div><div class="topology-channel"><b>Platformní rozhraní</b><small>Digital Credentials API nebo wallet API</small></div><div class="component browser-component"><b>Browser / mobilní aplikace</b><small>zobrazuje službu a zahajuje požadavek</small></div></div><div class="protocol-bridge"><b>OpenID4VP</b><span>podepsaný request ⇄ response</span></div><div class="component rp-component"><b>Relying Party</b><small>vytvoří požadavek a ověří výsledek</small></div></div><div class="journey-steps" style="--journey-steps:4"><div><b>1</b><span>RP připraví request</span></div><div><b>2</b><span>platforma vybere wallet</span></div><div><b>3</b><span>uživatel schválí údaje</span></div><div><b>4</b><span>wallet vrátí presentation</span></div></div>`,
    notes: `<p>RP vytvoří request URI nebo použije platformní API. OS/browser vybere peněženku, ta stáhne a ověří požadavek, získá souhlas a pošle response.</p><p>Hlavní rizika: mix-up mezi relacemi, podvržený callback, replay a nejasný přechod mezi browserem a wallet. Proto request a response vážeme pomocí nonce, client_id, response_uri a podpisů.</p>`, sources: [src('ARF – protocols', U.protocols), src('OpenID4VP 1.0 Final', U.oid4vp)]
  },
  {
    id: 'cross-device', title: 'Cross-device: QR páruje zařízení, data jdou tunelem', section: 'OID4VP', part: 2, level: 'core', minutes: 2,
    html: `<div class="device-topology cross-device-topology"><div class="device-boundary compact-device"><span class="topology-label">Telefon</span><div class="component wallet-component"><b>Wallet Unit</b><small>přijme signed request i autentizovaný origin</small></div></div><div class="protocol-bridge qr-bridge"><b>Párovací QR</b><span>proximity check + CTAP hybrid tunnel</span></div><div class="device-boundary compact-device"><span class="topology-label">Druhé zařízení</span><div class="component browser-component"><b>Web browser</b><small>DC API drží původní browser context</small></div></div><div class="protocol-bridge"><b>OpenID4VP</b><span>request a šifrovaná response tunelem</span></div><div class="component rp-component"><b>Relying Party</b><small>výsledek dostane původní Promise</small></div></div><div class="journey-steps" style="--journey-steps:4"><div><b>1</b><span>browser vyvolá DC API</span></div><div><b>2</b><span>platforma zobrazí párovací QR</span></div><div><b>3</b><span>request, souhlas a proof v telefonu</span></div><div><b>4</b><span>response se vrátí platformním tunelem</span></div></div>`,
    notes: `<p>Cross-device EUDI flow používá Digital Credentials API. Desktopový browser nebo OS zobrazí párovací QR a vytvoří bezpečný tunel k telefonu. QR nenese prostý OpenID4VP request_uri pro libovolnou aplikaci.</p><p>Podepsaný Request Object a autentizovaný web origin projdou tunelem do wallet. Po souhlasu se šifrovaná response vrátí do původního browser contextu. ETSI profil podle dostupnosti požaduje CTAP 2.2 hybrid s proximity checkem a krátkodosahovým transportem.</p>`, sources: [src('OpenID4VP 1.0 Final', U.oid4vp), src('W3C Digital Credentials API', U.dcapi), src('ETSI TS 119 472-2', U.etsi472)]
  },
  {
    id: 'direct-wallet-invocation', title: 'Přímé vyvolání wallet: same-device profil a rizikový QR', section: 'OID4VP', part: 2, level: 'core', minutes: 2,
    html: `<div class="flow"><div class="node"><b>RP</b><small>vytvoří podepsaný Request Object</small></div><div class="edge"></div><div class="node"><b>eu-eaap / QR</b><small>předá client_id + request_uri</small></div><div class="edge"></div><div class="node"><b>Wallet</b><small>stáhne JAR a ověří WRPAC/RPRC</small></div></div><div class="two-col"><div class="col rule"><h2>Same-device bez DC API</h2><p>EUDI profil používá <code>eu-eaap</code>, podepsaný JAR a <code>direct_post.jwt</code>. Návrat musí potvrdit původní browser session.</p></div><div class="col rule"><h2>Cross-device přímým QR</h2><p>Obecný OID4VP jej umožňuje, ale EUDI profil vyžaduje API-mediated mechanismus. QR lze relayovat nebo zaměnit.</p></div></div><div class="callout warn"><strong>Cross-device přímým QR je mimo EUDI profil a nedoporučuje se.</strong> Chybí autentizovaný web origin a platformní vazba na původní browser context.</div>`,
    notes: `<p>Same-device redirect bez Digital Credentials API zůstává součástí EUDI profilu. Wallet se vyvolá schématem <code>eu-eaap</code>, načte podepsaný JWT-Secured Authorization Request z <code>request_uri</code> a odpověď pošle přes <code>direct_post.jwt</code>.</p><p>Obecný OpenID4VP dovoluje podobný request_uri vložit do cross-device QR. ETSI EUDI profil však pro cross-device vyžaduje API-mediated mechanismus, typicky DC API s platformním secure tunnelem. Přímý QR zvyšuje riziko relay, QR swappingu, phishingu a session fixation.</p>`,
    sources: [src('OpenID4VP 1.0 Final', U.oid4vp), src('W3C Digital Credentials API', U.dcapi), src('ARF – protocols', U.protocols)]
  },
  {
    id: 'dc-api', title: 'Digital Credentials API: platforma zprostředkuje wallet', section: 'OID4VP', part: 2, level: 'core', minutes: 2,
    html: `<div class="flow"><div class="node"><b>Web RP</b><small>navigator.credentials.get()</small></div><div class="edge"></div><div class="node"><b>Browser / OS</b><small>origin binding, wallet picker, případně hybrid tunnel</small></div><div class="edge"></div><div class="node"><b>Wallet</b><small>podepsaný OID4VP request a šifrovaná response</small></div></div><div class="two-col"><div class="col rule"><h2>Same-device</h2><p>Platforma předá autentizovaný origin přímo walletu.</p></div><div class="col rule"><h2>Cross-device</h2><p>Párovací QR vytvoří bezpečný platformní tunel, nikoli prostý OpenID4VP deep link.</p></div></div><div class="callout warn"><strong>Stav 2026:</strong> W3C Digital Credentials API je Working Draft; dostupnost se liší podle browseru a OS.</div>`,
    notes: `<p>API omezuje custom-scheme deep links a dává platformě možnost kontrolovat původ webu, vybrat wallet a vytvořit bezpečnější předávací kanál. Cross-device varianta používá párovací QR a podle platformy CTAP hybrid tunnel.</p><p>EUDI profil používá podepsaný Request Object, <code>expected_origins</code> a response mode <code>dc_api.jwt</code>. Nepoužívá <code>response_uri</code> ani <code>state</code>; relaci váže platformní browser context. Nezaměňujte API platformy s protokolem OID4VP uvnitř.</p>`, sources: [src('W3C Digital Credentials API', U.dcapi), src('OpenID4VP 1.0 Final', U.oid4vp), src('ETSI TS 119 472-2', U.etsi472)]
  },
  {
    id: 'oid4vp-request', title: 'Request Object propojí RP, registraci a relaci', section: 'OID4VP', part: 2, level: 'detail', minutes: 3,
    html: `<div class="wire oid4vp-request-wire"><div class="explain"><ul><li><code>typ=oauth-authz-req+jwt</code>, podpis a <code>x5c</code> autentizují request klíčem z WRPAC.</li><li><code>verifier_info</code> může nést podepsaný WRPRC i registrar dataset s intended use.</li><li><code>client_metadata</code> nese protokolové schopnosti a jednorázový klíč pro šifrovanou response.</li><li><code>nonce</code> vstoupí do KB-JWT. DCQL určí credential a claim paths.</li></ul><p class="small muted">DC API: <code>dc_api.jwt</code> + <code>expected_origins</code>, bez response_uri a state. Redirect: <code>direct_post.jwt</code> + response_uri + state.</p></div><pre><code>// protected header&#10;{"typ":"oauth-authz-req+jwt","alg":"ES256",&#10; "x5c":["WRPAC","Access-CA"]}&#10;&#10;// signed payload fragment&#10;{"aud":"https://self-issued.me/v2",&#10; "client_id":"x509_hash:ab...",&#10; "response_type":"vp_token",&#10; "response_mode":"direct_post.jwt",&#10; "response_uri":"https://rp.example/cb",&#10; "nonce":"z-8f...","state":"s-7c...",&#10; "verifier_info":[&#10;  {"format":"registrar_dataset",&#10;   "data":{"intendedUseIdentifier":"age-check",&#10;    "purpose":"Ověření plnoletosti"}},&#10;  {"format":"registration_cert",&#10;   "data":"eyJ...WRPRC..."}],&#10; "client_metadata":{"jwks":{"keys":[{"kid":"enc-tx"}]}},&#10; "dcql_query":{"credentials":[...]}}</code></pre></div>`,
    notes: `<p>Wallet nejprve ověří JAR: typ, algoritmus, podpis, WRPAC řetězec a stav. U redirect varianty také zkontroluje, že <code>client_id</code> s prefixem <code>x509_hash</code> obsahuje SHA-256 DER leaf WRPAC a že vnější i vnitřní client ID souhlasí.</p><p><code>verifier_info</code> může nést dva formáty. <code>registration_cert</code> je podepsaný WRPRC. <code>registrar_dataset</code> zpřístupní lidsky i strojově čitelný účel a rozsah. Wallet důvěru odvodí z WRPRC nebo ověření proti API registrátora. <code>client_metadata</code> není důkaz identity ani oprávnění RP.</p>`, sources: [src('OpenID4VP 1.0 Final', U.oid4vp), src('ETSI TS 119 472-2', U.etsi472), src('ETSI TS 119 475', U.etsi475)]
  },
  {
    id: 'dcql', title: 'DCQL: dotaz na credential a konkrétní claims', section: 'OID4VP', part: 2, level: 'detail', minutes: 2,
    html: `<div class="wire"><div class="explain"><p>RP chce PID v SD-JWT VC a pouze tvrzení o plnoletosti.</p><p>Wallet může nabídnout credential, který splňuje typ i claim path.</p></div><pre><code>{"credentials":[{&#10; "id":"pid",&#10; "format":"dc+sd-jwt",&#10; "meta":{&#10;  "vct_values":["urn:eudi:pid:1"]&#10; },&#10; "claims":[{&#10;  "id":"adult",&#10;  "path":["age_over_18"]&#10; }]&#10;}]}</code></pre></div><span class="code-caption">Zjednodušený příklad DCQL; konkrétní claim path musí odpovídat credential type metadata/rulebooku.</span>`,
    notes: `<p>ID <code>pid</code> se později objeví jako klíč v <code>vp_token</code>. <code>format</code> a metadata omezují přijatelné credentials.</p><p>DCQL umí alternativy, množiny credentials i kombinace claims. Privacy začíná už návrhem dotazu: RP nemá chtít „celý PID“, když mu stačí jeden odvozený atribut.</p>`, sources: [src('OpenID4VP 1.0 Final – DCQL', U.oid4vp), src('PID Rulebook', U.pidRulebook)]
  },
  {
    id: 'vp-response', title: 'vp_token nese selective disclosure a holder proof', section: 'OID4VP', part: 2, level: 'detail', minutes: 2,
    html: `<div class="wire vp-response-wire"><div class="explain"><ol><li>Klíč <code>pid</code> odpovídá DCQL credential query ID.</li><li>Issuer JWS zůstává podepsaným základem.</li><li>Wallet přiloží jen disclosures nutné pro vybrané claims, včetně vazeb vnořených struktur.</li><li>KB-JWT podepíše holder key z <code>cnf</code> a pokryje audience, nonce a přesný SD-JWT řetězec.</li></ol><p class="small"><strong>Audience:</strong> redirect používá celý <code>client_id</code>; DC API používá <code>origin:https://rp.example</code>.</p></div><pre><code>{&#10; "vp_token":{&#10;  "pid":["Issuer-JWS~Disclosure-age~KB-JWT"]&#10; },&#10; "state":"jen-pro-direct-post-session"&#10;}&#10;&#10;// decoded KB-JWT payload&#10;{&#10; "iat":1795500123,&#10; "aud":"x509_hash:ab...",&#10; "nonce":"z-8f...",&#10; "sd_hash":"SHA-256(Issuer-JWS~Disclosure-age~)"&#10;}&#10;&#10;// podpis KB-JWT se ověří klíčem z&#10;// issuer-signed credentialu: cnf.jwk</code></pre></div>`,
    notes: `<p>Digest disclosure se počítá z jeho base64url řetězce, nikoli z dekódovaného JSON. Verifier najde digest v <code>_sd</code> issuer-signed payloadu. U vnořených struktur mohou být potřeba další disclosures, aby vznikla cesta k vybranému claimu.</p><p><code>sd_hash</code> pokrývá issuer JWS, přesnou posloupnost vybraných disclosures a koncovou tildu. <code>cnf</code> není v KB-JWT. Je v credentialu a určuje veřejný klíč pro ověření KB-JWT. Direct-post response se šifruje request-scoped klíčem z client metadata.</p>`, sources: [src('OpenID4VP 1.0 Final', U.oid4vp), src('RFC 9901 – SD-JWT', U.sdjwt)]
  },
  {
    id: 'verification-algorithm', title: 'Verifier neověřuje jeden podpis, ale celý řetězec', section: 'OID4VP', part: 2, level: 'core', minutes: 2,
    html: `<ol><li><strong>Request context:</strong> state, nonce, response mode, session.</li><li><strong>RP vlastní očekávání:</strong> DCQL query a formát.</li><li><strong>Credential:</strong> issuer signature, trust anchor, type, time, status.</li><li><strong>Disclosure:</strong> digests a povolené claim paths.</li><li><strong>Holder proof:</strong> klíč z <code>cnf</code>, audience, nonce, <code>sd_hash</code>.</li><li><strong>Policy:</strong> assurance a pravidla konkrétní služby.</li></ol>`,
    notes: `<p>Pořadí implementace může být jiné, ale všechny vrstvy musí být pokryty. Validní JWS nestačí.</p><p>Je vhodné logovat rozhodnutí a důvod odmítnutí bez ukládání nadbytečných osobních údajů.</p>`, sources: [src('OpenID4VP 1.0 Final', U.oid4vp), src('RFC 9901 – SD-JWT', U.sdjwt)]
  },
  {
    id: 'verification-lab', title: 'Laboratoř verifikace: registrace, request a proof', section: 'OID4VP', part: 2, level: 'detail', minutes: 3, kind: 'interactive',
    html: verificationLabHtml,
    notes: `<p>Projděte osm kroků. Začněte registrací, protože access certificate a registration certificate se nevytvářejí během OID4VP relace. U Request Objectu ukažte, odkud wallet získá identitu služby, intended use a povolený rozsah claims.</p><p>Přepněte transport. DC API mění zprostředkování mezi browserem, OS a wallet, zatímco podepsaný request, DCQL, selective disclosure a holder proof zůstávají protokolovým jádrem. Přímý QR nebo deep link ukazuje fallback se slabší vazbou na web origin. Poslední krok shrnuje validaci od session až po service policy.</p>`,
    sources: [src('OpenID4VP 1.0 Final', U.oid4vp), src('RFC 9901 – SD-JWT', U.sdjwt), src('ETSI TS 119 472-2', U.etsi472), src('TS5 – RP registration information', U.ts5)]
  },
  {
    id: 'w2w-section', title: 'Offline wallet‑to‑wallet', section: 'W2W proximity', part: 2, level: 'core', minutes: 2, kind: 'section',
    subtitle: 'Verifier drží druhý telefon. Zařízení navážou proximity session, vymění mdoc request a response bez serverového retrieval.',
    html: `<p class="big-statement">Engagement najde a sváže zařízení. <strong>SessionTranscript</strong> sváže kryptografii s konkrétním spojením.</p>`,
    notes: `<p>Aktuální TS9 profiluje W2W pouze přes ISO 18013-5 mdoc. Nejde o „OID4VP bez internetu“.</p>`, sources: [src('TS9 – Wallet-to-Wallet Interactions', U.ts9)]
  },
  {
    id: 'w2w-overview', title: 'W2W: holder wallet se chová jako mdoc', section: 'W2W proximity', part: 2, level: 'core', minutes: 2,
    html: `<div class="w2w-remake"><div class="wallet-party holder-party"><span>Holder</span><b>Holder Wallet Unit</b><small>vybírá credential a žádá o souhlas</small></div><div class="proximity-channel"><div><b>QR engagement</b><small>najde zařízení a předá parametry</small></div><div><b>BLE secure session</b><small>DeviceRequest ⇄ DeviceResponse</small></div></div><div class="wallet-party verifier-party"><span>Verifier</span><b>Verifier Wallet Unit</b><small>funguje jako mdoc reader a ověřuje odpověď</small></div></div><div class="journey-steps w2w-journey" style="--journey-steps:5"><div><b>1</b><span>obě strany zvolí režim</span></div><div><b>2</b><span>verifier připraví nabídku atributů</span></div><div><b>3</b><span>holder načte engagement</span></div><div><b>4</b><span>request, kontrola rozsahu a souhlas</span></div><div><b>5</b><span>response, ověření a zobrazení</span></div></div><p class="small muted arf-remake-note">Zjednodušené překreslení ARF Figure 15. Presentation Offer je volitelná, server retrieval je v profilu TS9 zakázán.</p>`,
    notes: `<p>Verifier wallet připraví nabídku požadovaných dat a ukáže QR. Holder wallet načte engagement, naváže transport a vrátí mdoc DeviceResponse.</p><p>TS9 omezuje verifier wallet: nesmí předávat získané atributy třetím stranám a používá rate limits proti masovému sběru.</p>`, sources: [src('TS9 – Wallet-to-Wallet Interactions', U.ts9), src('ARF – protocols', U.protocols)]
  },
  {
    id: 'engagement-transports', title: 'Engagement není přenos credentialu', section: 'W2W proximity', part: 2, level: 'core', minutes: 2,
    html: `<div class="timeline" style="--steps:4"><div><b>1 · Engagement</b><small>QR povinně; NFC volitelně</small></div><div><b>2 · Retrieval</b><small>BLE povinně; NFC/Wi‑Fi Aware volitelně</small></div><div><b>3 · Secure session</b><small>ephemeral keys + transcript</small></div><div><b>4 · Data</b><small>DeviceRequest / DeviceResponse</small></div></div><div class="callout warn">Server retrieval je ve W2W profilu zakázán. Verifier wallet authentication je požadována, ale její konečný mechanismus je v TS9 stále otevřený.</div>`,
    notes: `<p>QR nese engagement data: verze, bezpečnostní parametry a možnosti transportu. Vlastní osobní data pak tečou přes navázaný proximity kanál.</p><p>Ukažte otevřený bod specifikace. Je dobré studentům přiznat, co ještě není uzavřené.</p>`, sources: [src('TS9 – Wallet-to-Wallet Interactions', U.ts9)]
  },
  {
    id: 'w2w-cbor', title: 'DeviceEngagement „na drátě“: CBOR, ne JSON', section: 'W2W proximity', part: 2, level: 'detail', minutes: 2,
    html: `<div class="wire"><div class="explain"><p>Diagnostická CBOR notace zobrazuje mapu. Rozšíření <code>-1</code> nese PresentationOffer.</p><p>Požadavek uvádí docType, namespace a elementy.</p></div><pre><code>{&#10; 0: "1.0",&#10; 1: [1, 24(h'...readerKey...')],&#10; 2: [ ...retrieval methods... ],&#10; -1: {&#10;   0: "1.0",&#10;   1: [{&#10;     0: "org.iso.18013.5.1.mDL",&#10;     1: {"org.iso.18013.5.1":&#10;       ["family_name","driving_privileges"]}&#10;   }]&#10; }&#10;}</code></pre></div>`,
    notes: `<p>Číselné klíče šetří místo. Toto je diagnostická reprezentace; na drátě jsou CBOR bajty.</p><p><code>IntentToRetain</code> má být ve W2W false. Potom následuje ISO mdoc DeviceRequest a DeviceResponse v secure session.</p>`, sources: [src('TS9 – Wallet-to-Wallet Interactions', U.ts9)]
  },
  {
    id: 'vci-section', title: 'Vydání credentialu: OpenID4VCI', section: 'OID4VCI', part: 2, level: 'core', minutes: 2, kind: 'section',
    subtitle: 'Issuer zveřejní metadata, nabídne typ credentialu, autorizuje držitele a vydá credential vázaný na klíč z peněženky.',
    html: `<div class="flow"><div class="node"><b>Offer</b><small>co lze získat</small></div><div class="edge"></div><div class="node"><b>Authorization</b><small>kdo má nárok</small></div><div class="edge"></div><div class="node"><b>Proof</b><small>kam credential svázat</small></div><div class="edge"></div><div class="node"><b>Credential</b><small>podepsaný výsledek</small></div></div>`,
    notes: `<p>OpenID4VCI 1.0 je finální standard ze září 2025. Jeho OAuth vrstva řeší autorizaci vydání; proof v credential requestu řeší holder binding.</p>`, sources: [src('OpenID4VCI 1.0 Final', U.oid4vci)]
  },
  {
    id: 'vci-overview', title: 'OID4VCI: discovery, offer, token, credential', section: 'OID4VCI', part: 2, level: 'core', minutes: 2,
    html: `<div class="timeline" style="--steps:5"><div><b>Metadata</b><small>issuer + AS + configurations</small></div><div><b>Offer</b><small>credential IDs + grant</small></div><div><b>Authorize</b><small>authorization code nebo pre-authorized</small></div><div><b>Token</b><small>access token; případně refresh</small></div><div><b>Issue</b><small>proofs + credential response</small></div></div>`,
    notes: `<p>Same-device offer bývá link/deep link; cross-device offer QR s <code>credential_offer_uri</code>. Citlivé a dlouhé hodnoty proto nemusí být přímo v QR.</p><p>Authorization server issueru může být oddělený od credential endpointu.</p>`, sources: [src('OpenID4VCI 1.0 Final', U.oid4vci)]
  },
  {
    id: 'offer-metadata', title: 'Offer ukáže kam, podepsaná metadata řeknou komu věřit', section: 'OID4VCI', part: 2, level: 'detail', minutes: 2,
    html: `<div class="wire vci-metadata-wire"><div class="explain"><ol><li><strong>Offer</strong> nese issuer URL, configuration IDs a grant. Wallet jej považuje za nedůvěryhodný vstup.</li><li><strong>Metadata JWS</strong> nese endpointy, AS a podporované credential configurations.</li><li><strong>Issuer access certificate</strong> v <code>x5c</code> autentizuje podpis metadata a službu.</li><li><strong>Registration certificate</strong> v <code>issuer_info</code> dokládá roli, service identifier a <code>providesAttestations</code>.</li></ol><p class="small muted">Wallet ověří oba řetězce vůči Access CA a registration provideru v LoTE a zkontroluje shodu issuer a service identifiers.</p></div><pre><code>// Credential Offer&#10;{"credential_issuer":"https://pid.example.cz",&#10; "credential_configuration_ids":["pid-sd-jwt"],&#10; "grants":{"authorization_code":{&#10;   "issuer_state":"s-29..."}}}&#10;&#10;// GET /.well-known/openid-credential-issuer&#10;// Accept: application/jwt&#10;// JWS header&#10;{"typ":"openidvci-issuer-metadata+jwt",&#10; "alg":"ES256","x5c":["issuer-WRPAC","Access-CA"]}&#10;// signed payload fragment&#10;{"sub":"https://pid.example.cz",&#10; "credential_endpoint":"https://pid.example.cz/credential",&#10; "nonce_endpoint":"https://pid.example.cz/nonce",&#10; "issuer_info":[{&#10;   "format":"registration_cert",&#10;   "data":"eyJ...issuer-WRPRC..."}],&#10; "credential_configurations_supported":{&#10;   "pid-sd-jwt":{"format":"dc+sd-jwt","vct":"urn:eudi:pid:1"}}}</code></pre></div>`,
    notes: `<p>Credential Offer může přijít QR kódem nebo linkem a není sám o sobě důkazem identity issueru. Wallet z issuer URL načte podepsaná metadata. Access certificate v <code>x5c</code> ověří přes Access CA v LoTE a registration certificate v <code>issuer_info</code> přes provider registračních certifikátů v LoTE.</p><p>Registration certificate issueru ukáže jeho entitlement a typy attestations, které deklaruje. Wallet dále ověří přesnou shodu <code>credential_issuer</code>, <code>sub</code>, service identifieru, endpointů a požadované credential configuration. Potom načte metadata zvoleného authorization serveru.</p>`, sources: [src('OpenID4VCI 1.0 Final', U.oid4vci), src('ETSI TS 119 472-3', U.etsi4723), src('TS5 – RP registration information', U.ts5), src('ARF – trust model', U.trust)]
  },
  {
    id: 'authorization-modes', title: 'Authorization Code vs. Pre‑Authorized Code', section: 'OID4VCI', part: 2, level: 'core', minutes: 2,
    html: `<table class="matrix"><thead><tr><th></th><th>Authorization Code</th><th>Pre‑Authorized Code</th></tr></thead><tbody><tr><td>Kdy</td><td>wallet zahájí OAuth autorizaci</td><td>issuer držitele předautorizoval mimo OAuth flow</td></tr><tr><td>Ochrany</td><td>PAR + PKCE + state/iss + login/consent</td><td>krátký single-use code + případný tx_code z druhého kanálu</td></tr><tr><td>Společné</td><td colspan="2">WIA + WIA-PoP pro wallet klienta; DPoP sender-constrained access token</td></tr><tr><td>Typický start</td><td>browser authorization po same/cross-device offer</td><td>QR nebo link po předchozím procesu</td></tr><tr><td>Riziko</td><td>redirect nebo mix-up</td><td>krádež offer/code bez session bindingu</td></tr></tbody></table>`,
    notes: `<p>Pre-authorized code není credential. Je to krátkodobé jednorázové oprávnění získat access token. <code>tx_code</code> může přijít druhým kanálem a zmírnit krádež offeru.</p><p>HAIP vyžaduje podporu Authorization Code, PAR a PKCE; EUDI profil používá také WIA, WIA-PoP a DPoP. Pre-Authorized Code je profilová možnost. Způsob předání offeru, same-device nebo cross-device, nemění následnou token a credential výměnu.</p>`, sources: [src('OpenID4VCI 1.0 Final', U.oid4vci), src('HAIP 1.0 Final', U.haip), src('TS3 – Wallet Unit Attestation', U.ts3)]
  },
  {
    id: 'credential-request', title: 'Credential request: token autorizuje, proof váže klíč', section: 'OID4VCI', part: 2, level: 'detail', minutes: 2,
    html: `<div class="wire"><div class="explain"><ol><li>Wallet získá <code>c_nonce</code> z nonce endpointu.</li><li>DPoP-bound access token autorizuje issuance.</li><li>Proof JWT nese issuer audience, <code>c_nonce</code> a Key Attestation.</li><li>Issuer vydá credential pro doložený holder key.</li></ol><p class="small muted"><code>c_nonce</code> chrání credential proof. HTTP <code>DPoP-Nonce</code> je jiná výzva pro DPoP.</p></div><pre><code>POST /nonce&#10;→ {"c_nonce":"cn-61a..."}&#10;&#10;POST /credential&#10;Authorization: DPoP eyJ...access-token...&#10;DPoP: eyJ...request-proof...&#10;&#10;{&#10; "credential_identifier":"pid-dataset-4",&#10; "proofs":{&#10;   "jwt":["eyJ...openid4vci-proof+jwt..."]&#10; }&#10;}&#10;&#10;→ {"credentials":[{"credential":"issuerJWT~..."}]}</code></pre></div>`,
    notes: `<p>Access token říká, že request smí být proveden. DPoP jej váže na klientský klíč. Credential proof říká, pro jaký holder key má issuer credential vydat. Tyto tři vazby nesmí být zaměněny.</p><p>Pokud Token Response vrátí <code>credential_identifiers</code>, request použije <code>credential_identifier</code>. Jinak použije <code>credential_configuration_id</code>. Proof JWT má typ <code>openid4vci-proof+jwt</code>, audience rovnou credential issueru, čerstvý <code>c_nonce</code> a v EUDI profilu Key Attestation v headeru.</p>`, sources: [src('OpenID4VCI 1.0 Final', U.oid4vci), src('HAIP 1.0 Final', U.haip), src('TS3 – Wallet Unit Attestation', U.ts3)]
  },
  {
    id: 'wia-ka-wire', title: 'Kam přesně vstupují WIA a KA', section: 'OID4VCI', part: 2, level: 'detail', minutes: 3,
    html: `<div class="issuance-only"><strong>Pouze issuance</strong><span>WIA, DPoP a KA/holder proof se použijí mezi Wallet Unit, autorizačním serverem a issuerem. Do OID4VP presentation se neposílají.</span></div><div class="three-col key-separation"><div class="col"><h2>1 · Wallet instance · WIA</h2><pre><code>POST /par nebo /token&#10;OAuth-Client-Attestation: &lt;WIA&gt;&#10;OAuth-Client-Attestation-PoP: &lt;WIA-PoP&gt;</code></pre><p class="small">AS ověří původ a stav Wallet Unit i kontrolu attested WIA key.</p></div><div class="col"><h2>2 · OAuth klient · DPoP</h2><pre><code>POST /token nebo /credential&#10;DPoP: &lt;request proof&gt;&#10;&#10;→ access_token je&#10;  sender-constrained</code></pre><p class="small">Samostatný DPoP key váže access token na konkrétního klienta.</p></div><div class="col"><h2>3 · Credential key · KA</h2><pre><code>// header proof JWT&#10;{"typ":"openid4vci-proof+jwt",&#10; "key_attestation":"&lt;KA&gt;"}&#10;// payload: aud + c_nonce&#10;// podpis: holder key</code></pre><p class="small">Issuer ověří key storage a naváže credential na key doložený v KA.</p></div></div><p class="callout"><strong>Tři klíče nemusí být stejné.</strong> WIA key dokládá wallet instanci, DPoP key chrání OAuth token a credential holder key později vytváří KB-JWT.</p>`,
    notes: `<p>WIA se posílá jako OAuth Client Attestation při PAR nebo token requestu. Její proof of possession se vztahuje k WIA key. DPoP je samostatná OAuth vazba access tokenu. KA vstupuje do credential requestu v headeru credential proofu a dokládá vlastnosti credential holder key. Standard nevyžaduje, aby šlo o jediný klíč.</p><p>Všechny tyto artefakty hrají roli při vydání, ne při prezentaci RP. RP se spoléhá na issuer: issuer validitu wallet a klíče zkontroloval, credential navázal na doložený holder key a u PID promítá revokaci wallet do statusu credentialu. Při presentation wallet dokládá kontrolu tohoto holder key pomocí KB-JWT.</p>`, sources: [src('TS3 – Wallet Unit Attestation', U.ts3), src('OpenID4VCI 1.0 Final', U.oid4vci), src('HAIP 1.0 Final', U.haip)]
  },
  {
    id: 'issuance-lab', title: 'Laboratoř vydání: offer, grant, attestace a credential', section: 'OID4VCI', part: 2, level: 'detail', minutes: 3, kind: 'interactive',
    html: issuanceLabHtml,
    notes: `<p>Nejprve přepněte same-device a cross-device. Tím se mění předání Credential Offer, nikoli následný discovery, token a credential protokol. Potom porovnejte Authorization Code s PAR, PKCE a browserovou autentizací proti Pre-Authorized Code s jednorázovým kódem a případným <code>tx_code</code>.</p><p>V krocích 6 a 7 oddělte tři vrstvy: <code>c_nonce</code> chrání credential-binding proof a vstupuje do <code>proofs.jwt</code>; <code>DPoP-Nonce</code> chrání HTTP DPoP proof. <code>Authorization: DPoP</code> nese sender-constrained access token, zatímco samostatná hlavička <code>DPoP</code> nese čerstvý request proof s <code>htm</code>, <code>htu</code>, <code>jti</code>, <code>ath</code> a případně nonce. DPoP key a credential holder key nemusí být stejné.</p><p>V celém flow sledujte issuer metadata podepsaná access klíčem, WIA na OAuth vrstvě, DPoP pro access token a KA plus holder proof v credential requestu. Poslední krok ukazuje, co musí issuer ověřit před podpisem credentialu.</p>`,
    sources: [src('OpenID4VCI 1.0 Final', U.oid4vci), src('RFC 9449 – DPoP', U.rfc9449), src('HAIP 1.0 Final', U.haip), src('ETSI TS 119 472-3', U.etsi4723), src('TS3 – Wallet Unit Attestation', U.ts3), src('ARF – trust model', U.trust)]
  },
  {
    id: 'vci-advanced', title: 'Batch, refresh, deferred — a privacy cena', section: 'OID4VCI', part: 2, level: 'core', minutes: 2,
    html: `<table class="matrix"><thead><tr><th>Mechanismus</th><th>Proč</th><th>Privacy/bezpečnostní dopad</th></tr></thead><tbody><tr><td>Batch issuance</td><td>více credentialů / klíčů najednou</td><td>issuer může vidět společný batch</td></tr><tr><td>Refresh token</td><td>obnova bez plného loginu</td><td>dlouhodobá vazba na wallet</td></tr><tr><td>Deferred issuance</td><td>výsledek není ihned připraven</td><td>transaction_id musí být chráněn</td></tr><tr><td>Jednorázové credentials</td><td>omezit korelaci mezi RP</td><td>více issuance a status záznamů</td></tr><tr><td>Samostatné klíče</td><td>omezit cross-credential linkability</td><td>větší lifecycle režie</td></tr></tbody></table>`,
    notes: `<p>Privacy není vlastnost jediného tokenu. Záleží i na issuance strategii: zda stejné credential/key používáme opakovaně, zda refresh kontaktuje issuer a jak status list seskupuje uživatele.</p><p>Batch v OID4VCI znamená více proofs/credentials v jedné výměně, ne jeden credential s mnoha claims.</p>`, sources: [src('OpenID4VCI 1.0 Final', U.oid4vci), src('ARF – protocols', U.protocols)]
  },
  {
    id: 'validity-section', title: 'Platnost není jeden boolean', section: 'Platnost a revokace', part: 2, level: 'core', minutes: 2, kind: 'section',
    subtitle: 'Credential může být správně podepsaný a současně nepřijatelný: expirovaný, odvolaný, předložený jiným držitelem nebo v nesprávné relaci.',
    html: `<p class="big-statement">Validace je <strong>průnik kryptografie, času, statusu, trustu, holder bindingu a politiky</strong>.</p>`,
    notes: `<p>Tato sekce propojí technickou platnost credentialu s delším stavem wallet instance. To je místo, kde se často chybně směšuje krátké WIA a dlouhá použitelnost PID.</p>`, sources: [src('ARF – trust model', U.trust)]
  },
  {
    id: 'validity-checks', title: 'Šest nezávislých kontrol', section: 'Platnost a revokace', part: 2, level: 'core', minutes: 3,
    html: `<table class="matrix"><thead><tr><th>Kontrola</th><th>Otázka</th></tr></thead><tbody><tr><td>Signature</td><td>Nezměnil se credential a patří klíči issueru?</td></tr><tr><td>Trust</td><td>Je issuer oprávněn vydávat tento typ?</td></tr><tr><td>Time</td><td>Platí <code>nbf/exp</code> a administrativní datum?</td></tr><tr><td>Status</td><td>Nebyl credential odvolán/suspendován?</td></tr><tr><td>Holder</td><td>Ovládá předkládající klíč z <code>cnf</code>?</td></tr><tr><td>Session/policy</td><td>Sedí nonce, audience, účel a assurance?</td></tr></tbody></table><div class="callout warn">„JWT signature valid“ je jen první řádek.</div>`,
    notes: `<p>Nechte studenty navrhnout pořadí fail-fast kontrol. Pozor, i chybová hlášení mohou unikat informace o credentialu.</p><p>Trust může být typově specifický: stejná organizace může být důvěryhodná pro jeden typ atestace, ne pro jiný.</p>`, sources: [src('ARF – trust model', U.trust), src('RFC 9901 – SD-JWT', U.sdjwt)]
  },
  {
    id: 'status-privacy', title: 'Tři vrstvy platnosti a odvolání', section: 'Platnost a revokace', part: 2, level: 'core', minutes: 2,
    html: `<div class="three-col status-layers"><div class="col rule"><h2>1 · PID / EAA credential</h2><ul><li><code>exp</code> nebo <code>validUntil</code>: plánovaný konec platnosti</li><li><code>status {uri, idx}</code>: předčasné odvolání</li></ul><div class="status-method"><b>SD-JWT VC</b><span>IETF Token Status List</span></div><div class="status-method"><b>mdoc</b><span>Attestation Status List nebo revocation / identifier list</span></div><p class="small muted">Při technické platnosti ≤ 24 h může profil status referenci vynechat.</p></div><div class="col rule"><h2>2 · Certifikáty ekosystému</h2><div class="status-method"><b>WRPAC · X.509</b><span>řetězec + čas + CRL a/nebo OCSP podle policy</span></div><div class="status-method"><b>WRPRC · JWT</b><span>podepsaný veřejný status list; ne CRL/OCSP</span></div><p>LoTE poskytuje trust anchors pro certifikáty i pro ověření podepsaných seznamů.</p><p class="small muted">Stejné slovo „certificate“, dva odlišné status mechanismy.</p></div><div class="col rule"><h2>3 · Wallet a její klíče</h2><ul><li>Stav WIA i KA: Token Status List.</li><li>PID Provider kontroluje WIA/KA při vydání a u déle platného PID nejméně 1× / 24 h.</li><li>Odvolaná WIA/KA ⇒ issuer odvolá navázaný PID.</li></ul><p class="small muted">RP při prezentaci WIA/KA nevidí; spoléhá se na issuerem udržovaný status PID.</p></div></div><div class="status-summary"><span><b>Expirace</b> = předem naplánovaný konec</span><span><b>Revokace</b> = mimořádné zneplatnění před koncem</span><span><b>Privacy</b> = seznam stáhnout a cachovat mimo konkrétní prezentaci</span></div>`,
    notes: `<p>Postup kontroly credentialu: ověřit podpis issueru, časovou platnost a teprve potom stav podle reference <code>uri + idx</code>. Token Status List je podepsaný hromadný seznam; verifier ověří jeho issuer, podpis, čas a index. U mdoc ARF připouští také seznam odvolaných identifikátorů. Krátká technická platnost omezuje okno rizika, ale není totéž co aktivní revokace.</p><p>U WRPAC se kontroluje X.509 cesta a revokační informace přes CRL a/nebo OCSP podle certifikační politiky. WRPRC je navzdory názvu podepsaný JWT, proto používá veřejný podepsaný status list a nikoli CRL/OCSP. Stav wallet se k RP neposílá: PID Provider kontroluje WIA/KA a jejich zneplatnění řetězí do statusu vydaného PID. ARF požaduje kontrolu statusu jako SHOULD; vynechání musí podložit risk analysis. Token Status List je ke dni prezentace stále IETF draft.</p>`,
    sources: [src('ARF 3.0 – trust model a credential status', U.trust), src('IETF Token Status List draft', U.status), src('TS3 – WIA/KA lifecycle a revokace', U.ts3), src('ETSI TS 119 411-8 – X.509 CRL/OCSP', U.etsi4118), src('ETSI TS 119 475 – registration certificate status', U.etsi475), src('RFC 5280 – CRL', U.rfc5280), src('RFC 6960 – OCSP', U.rfc6960)]
  },
  {
    id: 'wallet-validity-chain', title: 'Krátká WIA, delší wallet status, ještě jiná PID platnost', section: 'Platnost a revokace', part: 2, level: 'core', minutes: 2,
    html: `<div class="timeline" style="--steps:4"><div><b>WIA při vydání</b><small>technické exp &lt; 24 h</small></div><div><b>WIA/KA status</b><small>delší období údržby stavu</small></div><div><b>PID</b><small>vlastní nbf/exp + status</small></div><div><b>RP při prezentaci</b><small>ověří PID; vazba na wallet je nepřímá</small></div></div><div class="callout warn">RP WIA ani KA nevidí. Spoléhá se na záruku PID Provideru, že wallet při issuance zkontroloval a její pozdější zneplatnění promítne do statusu PID.</div>`,
    notes: `<p>Krátce platná WIA nemusí být přítomna při každém použití dlouhodobějšího credentialu. Její status se udržuje a issuer jej periodicky sleduje.</p><p>Podle TS3 má Wallet Unit držet WIA/KA, jejichž status provider udržuje alespoň 31 dní do budoucna. PID Provider stav kontroluje nejméně jednou za 24 hodin během platnosti PID. Konkrétní credential policy může být přísnější.</p>`, sources: [src('TS3 – Wallet Unit Attestation', U.ts3)]
  },
  {
    id: 'rulebook', title: 'Rulebook spojuje sémantiku, kódování a důvěru', section: 'Rulebooks', part: 2, level: 'core', minutes: 2,
    html: `<div class="timeline" style="--steps:5"><div><b>Scope</b><small>co typ potvrzuje</small></div><div><b>Attributes</b><small>povinné, volitelné, význam</small></div><div><b>Encoding</b><small>mdoc namespace / SD-JWT claims</small></div><div><b>Lifecycle</b><small>validita, status, revokace</small></div><div><b>Trust</b><small>issuer, anchors, compliance</small></div></div><div class="callout">Standard formátu říká „jak podepsat“. Rulebook říká „co přesně tento credential znamená a kdo ho smí vydat“.</div>`,
    notes: `<p>PID Rulebook má společnou sémantickou vrstvu a zvláštní kódování pro ISO mdoc a SD-JWT VC. Definuje také použití, trust anchors, revokaci a compliance.</p><p>Rulebook je profil pro konkrétní attestation type. Nestačí podporovat obecné OID4VCI/OID4VP.</p>`, sources: [src('PID Rulebook', U.pidRulebook), src('mDL Rulebook', U.mdlRulebook)]
  },
  {
    id: 'rulebook-example', title: 'PID Rulebook: jeden význam, dvě reprezentace', section: 'Rulebooks', part: 2, level: 'detail', minutes: 2,
    html: `<table class="matrix"><thead><tr><th>Význam</th><th>ISO mdoc</th><th>SD-JWT VC</th></tr></thead><tbody><tr><td>Příjmení</td><td><code>family_name</code> v namespace</td><td><code>family_name</code></td></tr><tr><td>Datum narození</td><td><code>birth_date</code></td><td><code>birthdate</code></td></tr><tr><td>Technická platnost</td><td>MSO validity info</td><td><code>nbf</code> / <code>exp</code></td></tr><tr><td>Typ</td><td><code>eu.europa.ec.eudi.pid.1</code></td><td><code>vct=urn:eudi:pid:1</code></td></tr></tbody></table><p class="small muted">Jména claims se mohou lišit, význam má zůstat kompatibilní s definicí rulebooku.</p>`,
    notes: `<p>Upozorněte na snadnou záměnu: mdoc attestation type/namespace a SD-JWT VCT nejsou stejný řetězec. Převod nelze dělat mechanickým kopírováním JSON názvů.</p><p>Rulebook také rozlišuje technickou expiraci tokenu a atribut data expirace dokladu.</p>`, sources: [src('PID Rulebook', U.pidRulebook), src('ARF Topic 3', U.topic3)]
  },
  {
    id: 'end-to-end', title: 'Celý příběh: od registru až k jednomu booleanu', section: 'Syntéza', part: 2, level: 'core', minutes: 3,
    html: `<div class="timeline" style="--steps:6"><div><b>1 · Evidence</b><small>authentic source potvrzuje data</small></div><div><b>2 · Issue</b><small>PID Provider ověří WIA/KA a vydá</small></div><div><b>3 · Store</b><small>credential je vázán na wallet key</small></div><div><b>4 · Ask</b><small>RP podepíše OID4VP + registraci</small></div><div><b>5 · Consent</b><small>wallet ukáže účel a claim</small></div><div><b>6 · Verify</b><small>RP dostane age ≥ 18 a ověří řetězec</small></div></div><div class="callout"><strong>Výsledek:</strong> služba může rozhodnout „plnoletý“, aniž dostane jméno, přesné datum narození nebo online potvrzení issueru.</div>`,
    notes: `<p>Projděte kroky pomalu a u každého jmenujte kořen důvěry. Evidence stojí na registru/procesu; issuance na issueru a WIA/KA; presentation na RP certifikátech, consentu, holder proofu a statusu.</p><p>Toto je cílová hodnota architektury: minimalizovat předaná data a online zprostředkování, nikoli odstranit všechny autority.</p>`, sources: [src('ARF v3.0.0', U.arf), src('OpenID4VCI 1.0 Final', U.oid4vci), src('OpenID4VP 1.0 Final', U.oid4vp)]
  },
  {
    id: 'takeaways', title: 'Pět vět, které mají zůstat', section: 'Závěr', part: 2, level: 'core', minutes: 2,
    html: `<ol><li>EUDIW <strong>neodstraňuje důvěru</strong>; činí její vrstvy explicitní a kontrolovatelné.</li><li>VC oddělí vydání od prezentace a umožní <strong>datovou minimalizaci</strong>.</li><li>RP se musí prokázat stejně vážně jako holder: <strong>access + registration</strong>.</li><li>Platnost je řetězec: issuer, čas, status, holder, session a policy.</li><li>ARF je architektura; standardy a RI se vyvíjejí — <strong>verzi vždy uvádíme</strong>.</li></ol><div class="callout warn">Otevřené body 2026: SD-JWT VC a Status List jsou drafty; Digital Credentials API je Working Draft; W2W verifier authentication není definitivně určena.</div>`,
    notes: `<p>Závěrečná otázka: „Je EUDIW decentralizovaná identita?“ Dobrá odpověď zní: holder-mediated a distribuovaná v prezentaci, ale záměrně regulovaná a ukotvená ve společné infrastruktuře důvěry.</p><p>Pro další seminář lze zvolit jednu ze tří hloubek: kryptografie SD-JWT, implementace OID4VP/OID4VCI, nebo governance a threat modeling.</p>`, sources: [src('EUDI Wallet ARF v3.0.0', U.arf), src('SD-JWT VC draft', U.sdjwtvc), src('Digital Credentials API', U.dcapi), src('TS9 – W2W', U.ts9)]
  }
];
