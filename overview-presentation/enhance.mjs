export const acronymDefinitions = {
  'DPoP-Nonce': 'HTTP výzva serveru pro následující DPoP proof; je odlišná od OID4VCI c_nonce',
  'DC API': 'Digital Credentials API – rozhraní browseru a operačního systému pro zprostředkování digitálních credentials',
  'WIA-PoP': 'Wallet Instance Attestation Proof of Possession – důkaz kontroly klíče svázaného s WIA',
  'WRPRC-JWT': 'Wallet Relying Party Registration Certificate zapsaný jako podepsaný JSON Web Token',
  'SD-JWT VC': 'Selective Disclosure JSON Web Token Verifiable Credential – profil credentialu nad SD-JWT',
  'KB-JWT': 'Key Binding JSON Web Token – důkaz kontroly klíče svázaný s konkrétní prezentací a relací',
  'OpenID4VCI': 'OpenID for Verifiable Credential Issuance – protokol pro vydání credentialu',
  'OpenID4VP': 'OpenID for Verifiable Presentations – protokol pro vyžádání a předložení credentialu',
  'OAuth-Client-Attestation-PoP': 'OAuth Client Attestation Proof of Possession – důkaz kontroly klíče klienta při vydávání',
  'OAuth-Client-Attestation': 'OAuth Client Attestation – atestace klientské instance použitá při vydávání',
  'Digital Credentials API': 'Rozhraní browseru a operačního systému pro bezpečné vyvolání digitální peněženky',
  'PuB-EAA': 'Public Body-issued Electronic Attestation of Attributes – elektronické potvrzení atributů vydané subjektem veřejného sektoru',
  'SD-JWT': 'Selective Disclosure JSON Web Token – JWT s možností selektivního zveřejnění claims',
  'EUDI Wallet': 'European Digital Identity Wallet – evropská peněženka digitální identity',
  'EUDIW': 'European Digital Identity Wallet – evropská peněženka digitální identity',
  'EUDI': 'European Digital Identity – evropská digitální identita',
  'QEAA': 'Qualified Electronic Attestation of Attributes – kvalifikované elektronické potvrzení atributů',
  'OID4VCI': 'OpenID for Verifiable Credential Issuance – protokol pro vydání credentialu',
  'OID4VP': 'OpenID for Verifiable Presentations – protokol pro prezentaci credentialu',
  'WSCA': 'Wallet Secure Cryptographic Application – aplikace, která bezpečně používá kryptografické klíče peněženky',
  'WSCD': 'Wallet Secure Cryptographic Device – bezpečné zařízení nebo prostředí chránící klíče peněženky',
  'WUA': 'Wallet Unit Attestation – zastřešující důkaz tvořený WIA a KA',
  'WIA': 'Wallet Instance Attestation – důkaz pravosti a stavu instance wallet aplikace',
  'KA': 'Key Attestation – důkaz vlastností, veřejných klíčů a stavu úložiště klíčů',
  'WRPAC': 'Wallet Relying Party Access Certificate – X.509 certifikát autentizující službu a její podpisový klíč',
  'WRPRC': 'Wallet Relying Party Registration Certificate – podepsaný JWT s registrační informací pro službu a intended use',
  'RPAC': 'Relying Party Access Certificate – zkrácené označení přístupového certifikátu RP',
  'RPRC': 'Relying Party Registration Certificate – zkrácené označení registračního certifikátu RP',
  'EAA': 'Electronic Attestation of Attributes – elektronické potvrzení atributů v ekosystému EUDIW',
  'PID': 'Person Identification Data – základní identifikační údaje osoby',
  'ARF': 'Architecture and Reference Framework – architektonický a referenční rámec EUDI Wallet',
  'RI': 'Reference Implementation – referenční implementace',
  'SSI': 'Self-Sovereign Identity – model identity s držitelem řízenou prezentací a kryptografickými důkazy',
  'IdP': 'Identity Provider – poskytovatel identity',
  'RP': 'Relying Party – služba, která požaduje a ověřuje údaje',
  'VC': 'Verifiable Credential – kryptograficky ověřitelný credential',
  'OAuth': 'OAuth – protokol pro delegovanou autorizaci',
  'OIDC': 'OpenID Connect – autentizační vrstva nad OAuth',
  'OpenID': 'OpenID – rodina otevřených protokolů pro digitální identitu',
  'SAML': 'Security Assertion Markup Language – formát a protokol pro federovanou identitu',
  'JWT': 'JSON Web Token – kompaktní token s JSON claims',
  'JWS': 'JSON Web Signature – formát digitálního podpisu nad JSON obsahem',
  'JWE': 'JSON Web Encryption – šifrovaná obálka nad JSON nebo jiným obsahem',
  'JWK': 'JSON Web Key – JSON reprezentace kryptografického klíče',
  'X.509': 'X.509 – standard pro certifikáty veřejných klíčů',
  'JOSE': 'JSON Object Signing and Encryption – rodina standardů pro podpis a šifrování JSON artefaktů',
  'JAR': 'JWT-Secured Authorization Request – autorizační požadavek chráněný jako podepsaný JWT',
  'JSON': 'JavaScript Object Notation – textový formát strukturovaných dat',
  'CBOR': 'Concise Binary Object Representation – binární formát strukturovaných dat',
  'COSE': 'CBOR Object Signing and Encryption – kryptografické obálky pro CBOR',
  'DCQL': 'Digital Credentials Query Language – dotazovací jazyk pro požadované credentials a claims',
  'LoTE': 'List of Trusted Entities – seznam důvěryhodných entit',
  'TL': 'Trusted List – důvěryhodný seznam zejména pro kvalifikované poskytovatele služeb vytvářejících důvěru',
  'LOTL': 'List of Trusted Lists – komisní rozcestník na národní Trusted Lists',
  'QTSP': 'Qualified Trust Service Provider – kvalifikovaný poskytovatel služeb vytvářejících důvěru',
  'CAB': 'Conformity Assessment Body – subjekt posuzování shody',
  'NAB': 'National Accreditation Body – národní akreditační orgán',
  'HSM': 'Hardware Security Module – hardwarový bezpečnostní modul',
  'TEE': 'Trusted Execution Environment – izolované důvěryhodné běhové prostředí',
  'PKI': 'Public Key Infrastructure – infrastruktura veřejných klíčů',
  'PKCE': 'Proof Key for Code Exchange – ochrana autorizačního kódu v OAuth',
  'PAR': 'Pushed Authorization Request – předání autorizačního požadavku přímo autorizačnímu serveru',
  'DPoP': 'Demonstrating Proof of Possession – vazba OAuth tokenu na klíč klienta',
  'HAIP': 'High Assurance Interoperability Profile – OpenID profil pro vysoce důvěryhodnou interoperabilitu',
  'CSRF': 'Cross-Site Request Forgery – podvržení požadavku v kontextu uživatele',
  'DDoS': 'Distributed Denial of Service – distribuovaný útok na dostupnost',
  'API': 'Application Programming Interface – programové rozhraní',
  'PoP': 'Proof of Possession – důkaz kontroly odpovídajícího soukromého klíče',
  'IDs': 'Identifiers – identifikátory',
  'ID': 'Identifier – identifikátor',
  'URI': 'Uniform Resource Identifier – identifikátor zdroje',
  'URL': 'Uniform Resource Locator – adresa zdroje',
  'QR': 'Quick Response code – dvourozměrný čárový kód',
  'BLE': 'Bluetooth Low Energy – nízkoenergetický režim Bluetooth',
  'CTAP': 'Client to Authenticator Protocol – protokol platformy pro komunikaci s autentizátorem nebo hybridním zařízením',
  'NFC': 'Near Field Communication – bezkontaktní komunikace na krátkou vzdálenost',
  'Wi‑Fi': 'Wi-Fi – bezdrátová lokální síťová technologie',
  'Wi-Fi': 'Wi-Fi – bezdrátová lokální síťová technologie',
  'CRL': 'Certificate Revocation List – seznam odvolaných certifikátů',
  'OCSP': 'Online Certificate Status Protocol – protokol pro zjištění stavu certifikátu',
  'CA': 'Certification Authority – certifikační autorita',
  'AS': 'Authorization Server – autorizační server',
  'W2W': 'Wallet-to-Wallet – přímá komunikace dvou peněženek',
  'mdoc': 'Mobile document – mobilní dokument podle ISO/IEC 18013-5',
  'mDL': 'Mobile Driving Licence – mobilní řidičský průkaz',
  'W3C': 'World Wide Web Consortium – standardizační organizace pro web',
  'IETF': 'Internet Engineering Task Force – organizace vytvářející otevřené internetové standardy',
  'ETSI': 'European Telecommunications Standards Institute – evropská standardizační organizace',
  'OJEU': 'Official Journal of the European Union – Úřední věstník Evropské unie',
  'ISO': 'International Organization for Standardization – mezinárodní standardizační organizace',
  'IEC': 'International Electrotechnical Commission – mezinárodní elektrotechnická standardizační organizace',
  'RFC': 'Request for Comments – publikace internetového standardu nebo technické specifikace',
  'VCT': 'Verifiable Credential Type – identifikátor typu SD-JWT VC',
  'ES256': 'ECDSA using P-256 and SHA-256 – algoritmus digitálního podpisu',
  'ECDSA': 'Elliptic Curve Digital Signature Algorithm – algoritmus digitálního podpisu nad eliptickou křivkou',
  'P-256': 'NIST P-256 – standardizovaná eliptická křivka pro kryptografické klíče',
  'S256': 'SHA-256 code challenge method – metoda PKCE odvozená pomocí SHA-256',
  'SHA-256': 'Secure Hash Algorithm 256-bit – kryptografická hashovací funkce',
  'EC': 'Elliptic Curve – kryptografie nad eliptickými křivkami',
  'MSO': 'Mobile Security Object – podepsaná bezpečnostní struktura ISO mdoc',
  'TS2': 'Technical Specification 2 – notifikace a publikace informací o providerech',
  'TS3': 'Technical Specification 3 – specifikace Wallet Unit Attestation',
  'TS5': 'Technical Specification 5 – společné formáty a API pro RP registration information',
  'TS6': 'Technical Specification 6 – minimální sada registračních informací RP',
  'TS9': 'Technical Specification 9 – specifikace wallet-to-wallet interakcí',
  'TS': 'Technical Specification – technická specifikace',
  'CZ-LEI': 'Ilustrativní český Legal Entity Identifier – identifikátor právnické osoby',
  'CZ': 'Country code for Czechia – kód země Česko',
  'Non-Q': 'Non-qualified – nekvalifikované elektronické potvrzení atributů',
  'HLD': 'High-Level Design – návrh architektury na vysoké úrovni',
  'UX': 'User Experience – uživatelská zkušenost a návrh interakce',
  'UI': 'User Interface – uživatelské rozhraní',
  'IP': 'Internet Protocol – síťový protokol; IP adresa identifikuje síťový bod',
  'PIN': 'Personal Identification Number – osobní číselný kód',
  'EU': 'European Union – Evropská unie',
  'GET': 'HTTP GET – metoda pro načtení reprezentace zdroje',
  'POST': 'HTTP POST – metoda pro odeslání dat nebo vytvoření zpracování',
  'OS': 'Operating System – operační systém',
  'HTTP': 'Hypertext Transfer Protocol – protokol webové komunikace',
  'DER': 'Distinguished Encoding Rules – kanonické binární kódování ASN.1',
  'REST': 'Representational State Transfer – architektonický styl webových API',
  'XML': 'Extensible Markup Language – značkovací formát strukturovaných dat',
  'SSO': 'Single Sign-On – jednotné přihlášení'
};

const acronymTerms = Object.keys(acronymDefinitions).sort((a, b) => b.length - a.length);
const escapedTerms = acronymTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const acronymPattern = new RegExp(`(?<![\\p{L}\\p{N}_])(${escapedTerms.join('|')})(?![\\p{L}\\p{N}_])`, 'gu');

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function highlightCode(root) {
  root.querySelectorAll('pre code:not([data-highlighted])').forEach((element) => {
    const source = element.textContent;
    const tokenPattern = /\/\/[^\n]*|"(?:\\.|[^"\\])*"|\b(?:true|false|null)\b|\b-?\d+(?:\.\d+)?\b|^(?:GET|POST|PUT|PATCH|DELETE|HTTP)\b|^[A-Za-z][A-Za-z-]*(?=:)/gm;
    let cursor = 0;
    let output = '';
    for (const match of source.matchAll(tokenPattern)) {
      output += escapeHtml(source.slice(cursor, match.index));
      const token = match[0];
      const rest = source.slice(match.index + token.length);
      let kind = 'string';
      if (token.startsWith('//')) kind = 'comment';
      else if (/^(GET|POST|PUT|PATCH|DELETE|HTTP)$/.test(token)) kind = 'method';
      else if (/^[A-Za-z][A-Za-z-]*$/.test(token) && rest.startsWith(':')) kind = 'header';
      else if (token.startsWith('"') && /^\s*:/.test(rest)) kind = 'key';
      else if (/^(true|false|null)$/.test(token)) kind = 'literal';
      else if (/^-?\d/.test(token)) kind = 'number';
      output += `<span class="tok-${kind}">${escapeHtml(token)}</span>`;
      cursor = match.index + token.length;
    }
    output += escapeHtml(source.slice(cursor));
    element.innerHTML = output;
    element.dataset.highlighted = 'true';
  });
}

export function applyAcronymTooltips(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
      if (node.parentElement?.closest('abbr, script, style, textarea')) return NodeFilter.FILTER_REJECT;
      acronymPattern.lastIndex = 0;
      return acronymPattern.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    acronymPattern.lastIndex = 0;
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    for (const match of node.nodeValue.matchAll(acronymPattern)) {
      fragment.append(node.nodeValue.slice(cursor, match.index));
      const abbr = document.createElement('abbr');
      abbr.textContent = match[0];
      abbr.title = acronymDefinitions[match[0]];
      abbr.setAttribute('aria-label', `${match[0]}: ${acronymDefinitions[match[0]]}`);
      fragment.append(abbr);
      cursor = match.index + match[0].length;
    }
    fragment.append(node.nodeValue.slice(cursor));
    node.replaceWith(fragment);
  }
}

export function enhanceContent(root) {
  highlightCode(root);
  applyAcronymTooltips(root);
}
