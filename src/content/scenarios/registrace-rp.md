---
title: "Registrace RP a použití prezentací"
description: "Registrace klubu jako Relying Party, certifikáty a jednotlivá intended use pro každý scénář ověření."
series: strelecky-klub
order: 13
category: system
roles: ["Klub (ověřovatel)"]
deepenLinks:
  - label: "Prohloubení — certifikáty a verifier metadata"
    url: "/scenare/strelecky-klub/rp-certifikaty-a-verifier"
  - label: "CIR (EU) 2025/848 — registrace RP"
    url: "http://data.europa.eu/eli/reg_impl/2025/848/oj"
  - label: "TS5 — Formáty a API registrace RP"
    url: "https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/blob/main/docs/technical-specifications/ts5-common-formats-and-api-for-rp-registration-information.md"
  - label: "TS6 — Sada registračních údajů RP"
    url: "https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/blob/main/docs/technical-specifications/ts6-common-set-of-rp-information-to-be-registered.md"
  - label: "ETSI TS 119 475 — RP Registration Certificate (WRPRC)"
    url: "https://www.etsi.org/deliver/etsi_ts/119400_119499/119475/01.02.01_60/ts_119475v010201p.pdf"
  - label: "ETSI TS 119 411-8 — WRPAC Access Certificate Policy"
    url: "https://www.etsi.org/deliver/etsi_ts/119400_119499/11941108/01.01.01_60/ts_11941108v010101p.pdf"
prev: revokace-a-status-list
next: rp-certifikaty-a-verifier
---

Klub jako **Service Provider** (Relying Party) registruje u národního registrátora nejen svou identitu, ale i **každé zamýšlené použití prezentace** (intended use). Peněženka pak při OID4VP transakci ověří, že RP žádá pouze registrované atestace a claims.

## Právní rámec

Dle **čl. 5b odst. 11 eIDAS** a **CIR (EU) 2025/848** musí každá organizace, která vyžaduje údaje z peněženky, být registrována v národním registru. Registrace zahrnuje:

- identitu subjektu (EUID)
- popis služeb a účel zpracování (GDPR)
- seznam **intended uses** — jednotlivých způsobů, jak RP hodlá prezentace využívat

## Základní registrační struktura klubu

Klub registruje **jeden** záznam `WalletRelyingParty` s entitlement `Service_Provider` a polem `intendedUse` obsahujícím 5 použití.

<details>
<summary>WalletRelyingParty — základní registrační záznam klubu</summary>

```json
{
  "identifier": {
    "type": "http://data.europa.eu/eudi/id/EUID",
    "value": "CZ-…"
  },
  "legalName": "Střelecký klub Brno z.s.",
  "tradeName": "WalletMap Demo Klub",
  "entitlements": [
    "https://uri.etsi.org/19475/Entitlement/Service_Provider"
  ],
  "isPSB": false,
  "isIntermediary": false,
  "registryURI": "https://registry.eudi.cz/api/v1",
  "supportURI": ["https://walletmap-club.cz/podpora", "mailto:podpora@walletmap-club.cz"],
  "srvDescription": [
    { "lang": "cs", "content": "Správa členů, závodů a přístupu na střelnici" }
  ],
  "supervisoryAuthority": {
    "name": "Úřad pro ochranu osobních údajů",
    "country": "CZ",
    "formURI": ["https://www.uoou.cz/"]
  },
  "intendedUse": [ "… viz jednotlivá použití níže …" ]
}
```

</details>

> Klub zároveň registruje entitlement `Non_Q_EAA_Provider` ve stejném nebo odděleném záznamu — viz [Registrace vydavatele](/scenare/strelecky-klub/registrace-vydavatele).

## Certifikáty RP

### Access certificate — jedna pro každou RP Instance

Každý technický systém, který komunikuje s peněženkou, je **Relying Party Instance** a potřebuje vlastní access certifikát:

| RP Instance | Hostname | Intended use |
|-------------|----------|--------------|
| `rp-app` | `app.walletmap-club.cz` | `iu-klub-app`, `iu-reg-zavodnik` |
| `rp-lock-back` | `zamek-zazemi.walletmap-club.cz` | `iu-zamek-zazemi` |
| `rp-lock-range` | `zamek-streliste.walletmap-club.cz` | `iu-zamek-streliste` |
| `rp-referee` | `rozhodci.walletmap-club.cz` | `iu-rozhodci` |

<details>
<summary>Access certificate — atributy (zjednodušeně)</summary>

```json
{
  "subject": "CN=rp-app.walletmap-club.cz",
  "issuer": "CZ EUDI Access CA",
  "serialNumber": "…",
  "wrpIdentifier": "urn:eudi:CZ:walletmap-club",
  "rpInstanceId": "rp-app",
  "validFrom": "2026-01-01",
  "validTo": "2028-01-01",
  "trustAnchor": "LoTE://access-ca.cz"
}
```

</details>

Access certifikát se prezentuje peněžence při každém OID4VP requestu. Peněženka ověří řetěz důvěry certifikátu vůči [[LoTE]] a shodu s `client_id`.

<details>
<summary>Prohloubení — access certifikát / WRPAC (X.509)</summary>

Access certifikát RP instance je v terminologii ETSI [[WRPAC]] — standardní **X.509** certifikát ([RFC 5280](https://datatracker.ietf.org/doc/html/rfc5280)) vydaný **Access Certificate Authority** (ACA). Certifikační politiku a profil definuje **[ETSI TS 119 411-8](https://www.etsi.org/deliver/etsi_ts/119400_119499/11941108/01.01.01_60/ts_11941108v010101p.pdf)**:

| Policy OID (příklad) | Účel |
|----------------------|------|
| `NCP-l-eudiwrp` | Nevázaný access cert pro právnickou osobu |
| `QCP-l-eudiwrp` | Kvalifikovaný access cert pro právnickou osobu |
| `NCP-n-eudiwrp` / `QCP-n-eudiwrp` | Obdobně pro fyzickou osobu |

WRPAC slouží k **autentizaci RP instance** vůči peněžence — ne k zápisu intended use (ten je ve [[WRPRC]] nebo v registru). Vazbu WRPAC ↔ WRPRC a mapování atributů popisuje **[ETSI TS 119 475](https://www.etsi.org/deliver/etsi_ts/119400_119499/119475/01.02.01_60/ts_119475v010201p.pdf)** §4.3–5.1.

Stejný princip X.509 access certifikátu (CSR, LoTE) používá i **issuer instance** — viz [Registrace vydavatele](/scenare/strelecky-klub/registrace-vydavatele); profil issuer access certifikátu v metadatech profiluje **ETSI TS 119 472-3** §4.2.2.

**Vystavení — co musí udělat držitel instance**

1. Vygenerovat kryptografický pár klíčů (typicky **ES256** / P-256).
2. **Privátní klíč** vytvořit, uložit a spravovat na instanci (HSM, TPM, zabezpečené úložiště) — nesmí opustit provoz a nesmí být sdílen mezi instancemi.
3. Z privátního klíče vytvořit **Certificate Signing Request (CSR)** s identifikátorem instance (DNS jméno v **Subject Alternative Name** musí odpovídat `client_id`, např. `app.walletmap-club.cz`).
4. Zaslat CSR **vydavateli access certifikátů** (ACA) — obvykle přes portál registrátora po schválení registrace.
5. Po vydání nasadit certifikát na instanci; privátním klíčem podepisovat OID4VP request object.

**Ověření peněženkou**

Peněženka ověří platnost WRPAC, profil dle TS 119 411-8, nepoužití odvolaného stavu, řetěz vůči **trust anchor** ACA v [[LoTE]] a shodu SAN DNS s `client_id` (např. `x509_san_dns:app.walletmap-club.cz`).

**Příklad — WRPAC RP instance (modelový PEM)**

```
-----BEGIN CERTIFICATE-----
MIICITCCAcegAwIBAgIUdM4hwZVkIwdIIvSgiHTUA3WQFxQwCgYIKoZIzj0EAwIw
RzEaMBgGA1UEAwwRQ1ogRVVESSBBY2Nlc3MgQ0ExHDAaBgNVBAoME01pbmlzdGVy
c3R2byB2bml0cmExCzAJBgNVBAYTAkNaMB4XDTI2MDcxNDA1NDQxN1oXDTI4MDcx
MzA1NDQxN1owUDEeMBwGA1UEAwwVYXBwLndhbGxldG1hcC1jbHViLmN6MSEwHwYD
VQQKDBhTdHJlbGVja3kga2x1YiBCcm5vIHoucy4xCzAJBgNVBAYTAkNaMFkwEwYH
KoZIzj0CAQYIKoZIzj0DAQcDQgAEIGt3QxYuTs6L7x3ocTtpt4OmRPvuaLRatIcm
AJ0ubpVSRcNkUoowxa9zjhRJT9FxV0VPWdNaXNRP2TaoO4LE4KOBhzCBhDAgBgNV
HREEGTAXghVhcHAud2FsbGV0bWFwLWNsdWIuY3owCwYDVR0PBAQDAgWgMBMGA1Ud
JQQMMAoGCCsGAQUFBwMCMB0GA1UdDgQWBBRHaCj1JzSwWHF5GEzoi30OnYXigjAf
BgNVHSMEGDAWgBRP0RoMUHN5U3r5wB/m9c6a2h7pLzAKBggqhkjOPQQDAgNIADBF
AiAtwEzu3Mxj0nFnurke1HJJR8/+9EKBjvCWJwJdftph0QIhAIPVAymTptTP4l9r
aHt8lHIx/CjYFrZ2lI2RUozPZUfC
-----END CERTIFICATE-----
```

| Pole | Hodnota (model) |
|------|-----------------|
| Issuer | `CN=CZ EUDI Access CA` |
| Subject | `CN=app.walletmap-club.cz, O=Střelecký klub Brno z.s., C=CZ` |
| SAN | `DNS:app.walletmap-club.cz` |
| Veřejný klíč | EC P-256 (ES256) |

> V produkci je WRPAC podepsaný ACA z LoTE dle **ETSI TS 119 411-8**. Ukázka ilustruje vazbu hostname ↔ `client_id`.

</details>

<details>
<summary>Prohloubení — šifrování authorization response (OID4VP)</summary>

U scénářů s `response_mode` **`direct_post.jwt`** (typicky zámky střeliště) OID4VP vyžaduje šifrování authorization response na aplikační vrstvě — `vp_token` necestuje v plaintextu přes front channel.

| Kde | Co |
|-----|-----|
| `client_metadata.jwks` v presentation requestu | RP publikuje **veřejný** šifrovací klíč (typicky efemérní, na request) |
| `client_metadata.encrypted_response_enc_values_supported` | Povolené JWE `enc` algoritmy (např. `A128GCM`) |
| Privátní klíč na RP instanci | RP jím dešifruje přijatou odpověď; **není** to klíč z WRPAC pro podpis requestu (může být stejný pár, ale účel je jiný) |
| `wallet_metadata` peněženky | Peněženka deklaruje podporované `authorization_encryption_*` algoritmy |

**Tok:** RP vygeneruje šifrovací pár → veřejný klíč vloží do `client_metadata.jwks` → peněženka zašifruje `vp_token` jako JWE → RP dešifruje privátním klíčem podle `kid` v hlavičce JWE.

Podrobný příklad a tabulka kroků: [RP certifikáty a verifier metadata](/scenare/strelecky-klub/rp-certifikaty-a-verifier#sifrovani-authorization-response).

</details>

### Registration certificate — jedna na intended use

Pokud registrátor vydává registration certificates (**ETSI TS 119 475**), platí:

- **jeden WRPRC** (*Wallet-Relying Party Registration Certificate*) na každý intended use — **podepsaný JWT** (`typ: rc-wrp+jwt`) nebo **CWT** (`typ: rc-wrp+cwt`), **nikoli X.509**
- vydává ho **Provider of Registration Certificates** (registrátor), nikoli ACA
- `intendedUseIdentifier` v registru = identifikátor v payload WRPRC
- payload obsahuje: účel, privacy policy, seznam credential/claims

Peněženka při consent dialogu ověří podpis WRPRC (AdES B-B, **ETSI TS 119 182-1**) a shodu presentation requestu s jeho obsahem. WRPRC **nepodepisuje** OID4VP request — k tomu slouží WRPAC instance.

<details>
<summary>Prohloubení — registration certificate RP (WRPRC)</summary>

[[WRPRC]] dle **[ETSI TS 119 475](https://www.etsi.org/deliver/etsi_ts/119400_119499/119475/01.02.01_60/ts_119475v010201p.pdf)** §5.2 je **podepsaný JWT nebo CWT**, ne X.509 certifikát. Registrační údaje intended use (`purpose`, `privacy_policy`, `credentials`, `claims`) jsou v **payload** tokenu. Header obsahuje `typ: rc-wrp+jwt` (nebo `rc-wrp+cwt`) a `x5c` s řetězem vydavatele WRPRC.

**Vystavení**

Po registraci intended use u registrátora klub obdrží WRPRC jako JWS compact string podepsaný klíčem providera registration certificates. Klub ho nasadí na příslušnou RP instanci a přikládá do OID4VP requestu **by value** (dle RPRC_19 / TS 119 475).

**Ověření peněženkou**

1. Ověří podpis JWT/CWT (AdES B-B) a `x5c` vůči důvěryhodnému vydavateli WRPRC.
2. Porovná `input_descriptors` s registrovanými `credentials` a `claims` v payload.
3. Zobrazí `purpose` a `privacy_policy` z WRPRC v consent dialogu.

Mapování TS5 → WRPRC: [RP certifikáty a verifier metadata](/scenare/strelecky-klub/rp-certifikaty-a-verifier).

</details>

<details>
<summary>Registration certificate — struktura payload WRPRC (zjednodušeně)</summary>

```json
{
  "format": "rp_registration_cert",
  "wrpIdentifier": "urn:eudi:CZ:walletmap-club",
  "intendedUseIdentifier": "iu-klub-app",
  "purpose": [{ "lang": "cs", "content": "Přihlášení do klubové aplikace" }],
  "privacyPolicy": [{ "type": "PrivacyStatement", "uri": "https://walletmap-club.cz/gdpr/app" }],
  "credentials": [
    {
      "format": "dc+sd-jwt",
      "meta": { "vct": "urn:walletmap:club:membership:1" },
      "claims": [
        { "path": ["member_id"] },
        { "path": ["membership_level"] },
        { "path": ["roles"] },
        { "path": ["status"] },
        { "path": ["valid_until"] }
      ]
    }
  ],
  "supervisoryAuthority": { "name": "ÚOOÚ", "country": "CZ", "formURI": ["https://www.uoou.cz/"] },
  "registryURI": "https://registry.eudi.cz/api/v1"
}
```

</details>

## Pět zamýšlených použití prezentací

Níže je registrace každého intended use dle TS5 (`IntendedUse` + `Credential` + `Claim`). Každé použití odpovídá konkrétnímu scénáři v modelu klubu.

### Kombinovaná prezentace

Když intended use registruje **více credential typů**, RP je v jedné OID4VP transakci žádá jako **kombinovanou prezentaci** — jedna presentation definition s více `input_descriptors`, jeden consent dialog v peněžence. Platí pro:

| Intended use | Credential typy | Logika |
|--------------|-----------------|--------|
| `iu-reg-zavodnik` | PID + zbrojní opr. + (průkaz zbraně) | všechny povinné/volitelné doklady najednou |
| `iu-rozhodci` | CompetitorLicense + CompetitionEntry | oba průkazy najednou |
| `iu-zamek-streliste` | ClubMembership / CompetitionEntry | alternativa — závodník předloží jeden z typů (`submission_requirements`) |

Peněženka ověří, že všechny `input_descriptors` odpovídají credential typům a claims registrovaným v příslušném WRPRC.

---

### IU-1: Přihlášení do klubové aplikace

**Scénář:** [Přihlášení do klubové aplikace](/scenare/strelecky-klub/prihlaseni-klubove-aplikace)  
**RP Instance:** `rp-app`

<details>
<summary>intendedUse — iu-klub-app (registrační struktura)</summary>

```json
{
  "intendedUseIdentifier": "iu-klub-app",
  "createdAt": "2026-01-01",
  "purpose": [
    { "lang": "cs", "content": "Přihlášení člena do klubové webové aplikace pro správu členství a závodů" }
  ],
  "privacyPolicy": [
    {
      "type": "PrivacyStatement",
      "uri": "https://walletmap-club.cz/gdpr/app"
    }
  ],
  "credentials": [
    {
      "format": "dc+sd-jwt",
      "meta": { "vct": "urn:walletmap:club:membership:1" },
      "claims": [
        { "path": ["member_id"] },
        { "path": ["given_name"] },
        { "path": ["family_name"] },
        { "path": ["membership_level"] },
        { "path": ["roles"] },
        { "path": ["status"] },
        { "path": ["valid_until"] }
      ]
    }
  ]
}
```

</details>

<details>
<summary>OID4VP presentation definition — odpovídající konfigurace RP</summary>

```json
{
  "id": "iu-klub-app",
  "purpose": "Přihlášení do klubové aplikace",
  "input_descriptors": [
    {
      "id": "club_membership",
      "format": { "dc+sd-jwt": { "vct": "urn:walletmap:club:membership:1" } },
      "constraints": {
        "fields": [
          { "path": ["$.member_id"], "intent_to_retain": false },
          { "path": ["$.status"], "filter": { "const": "aktivní" } },
          { "path": ["$.valid_until"], "filter": { "type": "string" } }
        ]
      }
    }
  ]
}
```

</details>

---

### IU-2: Registrace závodníka (státní doklady)

**Scénář:** [Registrace závodníka](/scenare/strelecky-klub/registrace-zavodnika)  
**RP Instance:** `rp-app`  
**Poznámka:** Klub zde ověřuje **státní** atestace (PID, zbrojní oprávnění), ne vlastní.

<details>
<summary>intendedUse — iu-reg-zavodnik (registrační struktura)</summary>

```json
{
  "intendedUseIdentifier": "iu-reg-zavodnik",
  "createdAt": "2026-01-01",
  "purpose": [
    { "lang": "cs", "content": "Ověření totožnosti a zbrojního oprávnění při registraci závodníka" }
  ],
  "privacyPolicy": [
    { "type": "PrivacyStatement", "uri": "https://walletmap-club.cz/gdpr/registrace-zavodnik" }
  ],
  "credentials": [
    {
      "format": "dc+sd-jwt",
      "meta": { "vct": "urn:eudi:pid:1" },
      "claims": [
        { "path": ["given_name"] },
        { "path": ["family_name"] },
        { "path": ["birth_date"] }
      ]
    },
    {
      "format": "dc+sd-jwt",
      "meta": { "vct": "urn:czechia:zbrojni-opravneni:1" },
      "claims": [
        { "path": ["license_number"] },
        { "path": ["valid_until"] },
        { "path": ["categories"] }
      ]
    },
    {
      "format": "dc+sd-jwt",
      "meta": { "vct": "urn:czechia:prukaz-zbrane:1" },
      "claims": [
        { "path": ["weapon_type"] },
        { "path": ["serial_number"] },
        { "path": ["valid_until"] }
      ]
    }
  ]
}
```

</details>

<details>
<summary>OID4VP presentation definition — kombinovaná prezentace (iu-reg-zavodnik)</summary>

```json
{
  "id": "iu-reg-zavodnik",
  "purpose": "Ověření totožnosti a zbrojního oprávnění při registraci závodníka",
  "input_descriptors": [
    {
      "id": "pid",
      "format": { "dc+sd-jwt": { "vct": "urn:eudi:pid:1" } },
      "constraints": {
        "fields": [
          { "path": ["$.given_name"] },
          { "path": ["$.family_name"] },
          { "path": ["$.birth_date"] }
        ]
      }
    },
    {
      "id": "gun_license",
      "format": { "dc+sd-jwt": { "vct": "urn:czechia:zbrojni-opravneni:1" } },
      "constraints": {
        "fields": [
          { "path": ["$.license_number"] },
          { "path": ["$.valid_until"] },
          { "path": ["$.categories"] }
        ]
      }
    },
    {
      "id": "weapon_permit",
      "format": { "dc+sd-jwt": { "vct": "urn:czechia:prukaz-zbrane:1" } },
      "constraints": {
        "fields": [
          { "path": ["$.weapon_type"] },
          { "path": ["$.serial_number"] },
          { "path": ["$.valid_until"] }
        ]
      }
    }
  ]
}
```

</details>

> Třetí `input_descriptor` (průkaz zbraně) je volitelný — klub ho zahrne do kombinované prezentace jen pokud to vyžadují pravidla soutěže.

---

### IU-3: Přístup správce do zázemí

**Scénář:** [Přístup správce do zázemí](/scenare/strelecky-klub/pristup-spravce-zazemi)  
**RP Instance:** `rp-lock-back` (proximity — NFC/BLE u zámku)

<details>
<summary>intendedUse — iu-zamek-zazemi (registrační struktura)</summary>

```json
{
  "intendedUseIdentifier": "iu-zamek-zazemi",
  "createdAt": "2026-01-01",
  "purpose": [
    { "lang": "cs", "content": "Ověření oprávnění správce střelnice pro vstup do zázemí" }
  ],
  "privacyPolicy": [
    { "type": "PrivacyStatement", "uri": "https://walletmap-club.cz/gdpr/pristup" }
  ],
  "credentials": [
    {
      "format": "dc+sd-jwt",
      "meta": { "vct": "urn:walletmap:club:membership:1" },
      "claims": [
        { "path": ["member_id"] },
        { "path": ["roles"] },
        { "path": ["status"] },
        { "path": ["valid_until"] }
      ]
    }
  ]
}
```

</details>

<details>
<summary>Podmínka na straně RP Instance — validace po ověření</summary>

```json
{
  "post_verification_policy": {
    "require_claim": { "path": ["roles"], "contains": "správce střelnice" },
    "require_claim": { "path": ["status"], "equals": "aktivní" }
  }
}
```

</details>

> Registrace definuje *jaké* claims lze žádat. Podmínka na hodnotu role (`správce střelnice`) se uplatňuje v logice zámku — není součástí registračního záznamu (TS5, poznámka k Claim).

---

### IU-4: Přístup na střeliště

**Scénář:** [Přístup na střeliště](/scenare/strelecky-klub/pristup-streliste)  
**RP Instance:** `rp-lock-range`  
**Poznámka:** Kombinovaná prezentace se dvěma credential typy — závodník předloží **členství NEBO** startovní lístek (`submission_requirements`).

<details>
<summary>intendedUse — iu-zamek-streliste (registrační struktura)</summary>

```json
{
  "intendedUseIdentifier": "iu-zamek-streliste",
  "createdAt": "2026-01-01",
  "purpose": [
    { "lang": "cs", "content": "Ověření oprávnění vstupu na střeliště — člen klubu nebo závodník se startovním lístkem" }
  ],
  "privacyPolicy": [
    { "type": "PrivacyStatement", "uri": "https://walletmap-club.cz/gdpr/pristup" }
  ],
  "credentials": [
    {
      "format": "dc+sd-jwt",
      "meta": { "vct": "urn:walletmap:club:membership:1" },
      "claims": [
        { "path": ["member_id"] },
        { "path": ["status"] },
        { "path": ["valid_until"] }
      ]
    },
    {
      "format": "dc+sd-jwt",
      "meta": { "vct": "urn:walletmap:club:entry:1" },
      "claims": [
        { "path": ["entry_id"] },
        { "path": ["competition_id"] },
        { "path": ["status"] },
        { "path": ["valid_from"] },
        { "path": ["valid_until"] }
      ]
    }
  ]
}
```

</details>

> Oba credential typy jsou v jedné kombinované prezentaci; `submission_requirements` určí, že závodník může předložit klubový průkaz **nebo** startovní lístek.

---

### IU-5: Ověření rozhodčím na závodě

**Scénář:** [Ověření rozhodčím](/scenare/strelecky-klub/rozhodci-overeni-zavodnika)  
**RP Instance:** `rp-referee`

<details>
<summary>intendedUse — iu-rozhodci (registrační struktura)</summary>

```json
{
  "intendedUseIdentifier": "iu-rozhodci",
  "createdAt": "2026-01-01",
  "purpose": [
    { "lang": "cs", "content": "Ověření závodníka a platnosti startovního lístku před vstupem na střelnici v den soutěže" }
  ],
  "privacyPolicy": [
    { "type": "PrivacyStatement", "uri": "https://walletmap-club.cz/gdpr/soutez" }
  ],
  "credentials": [
    {
      "format": "dc+sd-jwt",
      "meta": { "vct": "urn:walletmap:club:competitor:1" },
      "claims": [
        { "path": ["competitor_id"] },
        { "path": ["season"] },
        { "path": ["license_status"] }
      ]
    },
    {
      "format": "dc+sd-jwt",
      "meta": { "vct": "urn:walletmap:club:entry:1" },
      "claims": [
        { "path": ["entry_id"] },
        { "path": ["competition_id"] },
        { "path": ["competition_name"] },
        { "path": ["discipline"] },
        { "path": ["status"] },
        { "path": ["valid_from"] },
        { "path": ["valid_until"] }
      ]
    }
  ]
}
```

</details>

> Oba credential typy se žádají v **jedné kombinované prezentaci** — závodník potvrdí sdílení průkazu závodníka i startovního lístku jedním consent dialogem.

## Ověření peněženkou při prezentaci

Při každém OID4VP requestu peněženka (pokud uživatel aktivoval kontrolu):

1. ověří **access certificate** RP Instance
2. načte **registration certificate** nebo dotaz na registr (TS5 GET `/wrp`)
3. porovná `input_descriptors` s registrovanými `credentials` a `claims`
4. pokud RP žádá **neevidovaný** claim → zobrazí varování
5. zobrazí `purpose` a `privacyPolicy` z intended use

## Životní cyklus intended use

| Událost | Akce |
|---------|------|
| Nová služba (např. online platby) | Registrace nového intended use |
| Rozšíření claims | Aktualizace záznamu (PUT na registr) |
| Ukončení služby | `revokedAt` na intended use |
| Kompromitace instance | Revokace access certifikátu instance |

## Přehledová tabulka

| ID | RP Instance | Credential typy | Scénář |
|----|-------------|-----------------|--------|
| `iu-klub-app` | rp-app | ClubMembership | Přihlášení |
| `iu-reg-zavodnik` | rp-app | PID, Zbrojní opr., (Průkaz zbraně) | Registrace závodníka |
| `iu-zamek-zazemi` | rp-lock-back | ClubMembership (role) | Zázemí |
| `iu-zamek-streliste` | rp-lock-range | ClubMembership / CompetitionEntry | Střeliště |
| `iu-rozhodci` | rp-referee | CompetitorLicense + CompetitionEntry | Soutěž |

## Další prohloubení

- [RP certifikáty a verifier metadata](/scenare/strelecky-klub/rp-certifikaty-a-verifier) — mapování TS5 → ETSI 119 475, verifier metadata, presentation request
- Offline verifikace u zámků (cached status list) — viz [Revokace a status list](/scenare/strelecky-klub/revokace-a-status-list#kontrola-overovatelem-rp)
- Registrace intermediary pro provozovatele zámků třetí strany — připravujeme
