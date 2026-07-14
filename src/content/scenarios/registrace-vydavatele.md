---
title: "Registrace vydavatele (EAA Provider)"
description: "Registrace klubu jako vydavatele EAAs, certifikáty, issuer metadata a rulebooky průkazů."
series: strelecky-klub
order: 11
category: system
roles: ["Klub (vydavatel)"]
deepenLinks:
  - label: "ETSI TS 119 472-3 — Issuer Metadata"
    url: "https://www.etsi.org/deliver/etsi_ts/119400_119499/11947203/01.01.01_60/ts_11947203v010101p.pdf"
  - label: "ETSI TS 119 475 — Registration Certificates (WRPRC)"
    url: "https://www.etsi.org/deliver/etsi_ts/119400_119499/119475/01.02.01_60/ts_119475v010201p.pdf"
  - label: "OID4VCI — Credential Issuer Metadata"
    url: "https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html"
  - label: "TS11 — Katalog atestací"
    url: "https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/blob/main/docs/technical-specifications/ts11-interfaces-and-formats-for-catalogue-of-attributes-and-catalogue-of-schemes.md"
  - label: "ARF Topic 12 — Issuance"
    url: "https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework/blob/main/docs/annexes/annex-2/annex-2.02-high-level-requirements-by-topic.md"
  - label: "Prohloubení — vydávání a revokace"
    url: "/scenare/strelecky-klub/issuer-prohloubeni-vydavani"
prev: nastaveni-ekosystemu
next: issuer-prohloubeni-vydavani
---

Střelecký klub vystupuje jako **non-qualified EAA Provider** — vydává nevázané elektronické atestace atributů (EAAs) ve formátu SD-JWT VC. Tento článek popisuje registraci vydavatele, certifikáty a publikaci issuer metadat pro jednotlivé typy průkazů.

## Právní a registrační rámec

Dle ARF (kap. 3.8, 6.3) se vydavatel atestací registruje u **Registrar** v členském státě sídla. Registrátor zapíše:

- identitu právnické osoby (EUID / IČO)
- **entitlement** `Non_Q_EAA_Provider`
- seznam **`providesAttestations`** — typy průkazů, které klub vydává

Klub **nevyžaduje** registraci intended use pro čisté vydávání — intended use registruje jen pokud zároveň něco **vyžaduje** od peněženky (např. při vydání průkazu závodníka ověřuje PID).

## Kroky registrace vydavatele

### 1. Příprava registračních dat

| Položka | Hodnota pro klub |
|---------|------------------|
| `identifier` | EUID právnické osoby |
| `legalName` | Střelecký klub Brno z.s. |
| `entitlements` | `https://uri.etsi.org/19475/Entitlement/Non_Q_EAA_Provider` |
| `providesAttestations` | 3 typy (viz níže) |
| `registryURI` | URI českého registru (přidělí registrátor) |
| `supervisoryAuthority` | ÚOOÚ |

### 2. Registrace typů průkazů (`providesAttestations`)

Každý vydávaný typ se registruje jako `ProvidedAttestation` — bez seznamu claims (ten je v Attestation Rulebook / schématu).

<details>
<summary>ProvidedAttestation — Klubový průkaz (ClubMembership)</summary>

```json
{
  "format": "dc+sd-jwt",
  "meta": {
    "vct": "urn:walletmap:club:membership:1",
    "schema_uri": "https://walletmap.eu/schemas/club-membership/v1"
  }
}
```

</details>

<details>
<summary>ProvidedAttestation — Průkaz závodníka (CompetitorLicense)</summary>

```json
{
  "format": "dc+sd-jwt",
  "meta": {
    "vct": "urn:walletmap:club:competitor:1",
    "schema_uri": "https://walletmap.eu/schemas/competitor-license/v1"
  }
}
```

</details>

<details>
<summary>ProvidedAttestation — Startovní lístek (CompetitionEntry)</summary>

```json
{
  "format": "dc+sd-jwt",
  "meta": {
    "vct": "urn:walletmap:club:entry:1",
    "schema_uri": "https://walletmap.eu/schemas/competition-entry/v1"
  }
}
```

</details>

> V produkčním ekosystému budou `vct` a `schema_uri` odkazovat na záznam v **katalogu atestací** (TS11). Pro modelový příklad používáme vlastní URN.

### 3. Získání access certificate

**Access Certificate Authority** (ACA, přidružená k registrátorovi) vydá access certifikát **issuer instanci** po ověření registrace:

| Instance | Účel | Subjekt certifikátu |
|----------|------|---------------------|
| `issuer.walletmap-club.cz` | OID4VCI vydávání | Klub (EAA Provider) |

Certifikát vydává ACA, jejíž kořenový certifikát je zapsán v **List of Trusted Entities (LoTE)**. Peněženka ověří řetěz důvěry vůči LoTE a platnost certifikátu; issuer instancí se jím podepisuje `signed_metadata` a autentizuje se při komunikaci s peněženkou.

<details>
<summary>Prohloubení — access certifikát (X.509)</summary>

Access certifikát je standardní **X.509** certifikát ([RFC 5280](https://datatracker.ietf.org/doc/html/rfc5280)) vydaný **Access Certificate Authority** (ACA). Slouží k **autentizaci technické instance** vůči peněžence — ne k zápisu registrace subjektu (ten je ve **WRPRC** nebo v registru).

Pro **issuer / PID/EAA Provider** profiluje použití v metadatech **ETSI TS 119 472-3** §4.2.2: podpis `signed_metadata` musí být access certifikátem providera, v JWS hlavičce v parametru `x5c` jako DER.

Pro **RP instanci** jde o **WRPAC** (*Wallet-Relying Party Access Certificate*) — profil a certifikační politiku definuje **[ETSI TS 119 411-8](https://www.etsi.org/deliver/etsi_ts/119400_119499/11941108/01.01.01_60/ts_11941108v010101p.pdf)** (policy OID např. `NCP-l-eudiwrp` / `QCP-l-eudiwrp` pro právnickou osobu). Vazba WRPAC ↔ WRPRC popisuje **ETSI TS 119 475** §4.5–5.1.

Stejný princip (X.509, CSR, LoTE) platí pro issuer i RP — viz [Registrace RP](/scenare/strelecky-klub/registrace-rp).

**Vystavení — co musí udělat držitel instance**

1. Vygenerovat kryptografický pár klíčů (typicky **ES256** / P-256).
2. **Privátní klíč** vytvořit, uložit a spravovat na instanci (HSM, TPM, zabezpečené úložiště) — nesmí opustit provoz a nesmí být sdílen mezi instancemi.
3. Z privátního klíče vytvořit **Certificate Signing Request (CSR)** s identifikátorem instance (obvykle DNS jméno v **Subject Alternative Name**).
4. Zaslat CSR **vydavateli access certifikátů** (ACA) — obvykle přes portál registrátora po schválení registrace.
5. Po vydání nasadit certifikát na instanci; privátním klíčem podepisovat metadata a protokolové zprávy.

**Ověření peněženkou**

Peněženka ověří platnost certifikátu, nepoužití odvolaného stavu a že řetěz vede k **trust anchor** ACA uvedené v **LoTE**. U RP (WRPAC) navíc kontroluje shodu s `client_id` a profil dle TS 119 411-8.

**Příklad — access certifikát issuer instance (modelový PEM)**

```
-----BEGIN CERTIFICATE-----
MIICKDCCAc2gAwIBAgIUdM4hwZVkIwdIIvSgiHTUA3WQFxMwCgYIKoZIzj0EAwIw
RzEaMBgGA1UEAwwRQ1ogRVVESSBBY2Nlc3MgQ0ExHDAaBgNVBAoME01pbmlzdGVy
c3R2byB2bml0cmExCzAJBgNVBAYTAkNaMB4XDTI2MDcxNDA1NDMyN1oXDTI4MDcx
MzA1NDMyN1owUzEhMB8GA1UEAwwYaXNzdWVyLndhbGxldG1hcC1jbHViLmN6MSEw
HwYDVQQKDBhTdHJlbGVja3kga2x1YiBCcm5vIHoucy4xCzAJBgNVBAYTAkNaMFkw
EwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEbEKWfUhPCjfGczb/MYb5svwKfyW4tTVc
s1KLqYNpCv0jkDT6q7fPYKEh2pYxtC1ah+eNi2BDpMnjc9pHH0WkvqOBijCBhzAL
BgNVHQ8EBAMCBaAwEwYDVR0lBAwwCgYIKwYBBQUHAwIwIwYDVR0RBBwwGoIYaXNz
dWVyLndhbGxldG1hcC1jbHViLmN6MB0GA1UdDgQWBBTc0T/ZL7fIx0k+HrD9IhYZ
73AxczAfBgNVHSMEGDAWgBRP0RoMUHN5U3r5wB/m9c6a2h7pLzAKBggqhkjOPQQD
AgNJADBGAiEAw2/bII/2Il5tlyPraryHnJ0XXEq7X3mYR2nKhV8FhHICIQDHiIRw
iqSKTIeQZkzTifuzsmMHYesBc8P6NFLmT0lsVQ==
-----END CERTIFICATE-----
```

| Pole | Hodnota (model) |
|------|-----------------|
| Issuer | `CN=CZ EUDI Access CA, O=Ministerstvo vnitra, C=CZ` |
| Subject | `CN=issuer.walletmap-club.cz, O=Střelecký klub Brno z.s., C=CZ` |
| SAN | `DNS:issuer.walletmap-club.cz` |
| Veřejný klíč | EC P-256 (ES256) |
| Key Usage | `digitalSignature`, `keyEncipherment` |
| EKU | `clientAuth` (TLS / mTLS k peněžence) |

> V produkčním ekosystému může certifikát obsahovat další EUDI rozšíření (identifikátor subjektu, role instance). Kořen ACA musí být v LoTE — peněženka neověřuje „obsah“ LoTE v certifikátu, ale **řetěz vydavatelů** proti němu.

</details>

### 4. Registration certificate (volitelné)

Pokud český registrátor vydává registration certificates (**ETSI TS 119 475**), klub obdrží **WRPRC** (*Wallet-Relying Party Registration Certificate*) — **podepsaný JWT nebo CWT**, nikoli X.509 certifikát. Vydává ho **Provider of Registration Certificates** (registrátor). Payload obsahuje mimo jiné:

- `entitlements`: např. `Non_Q_EAA_Provider`
- `provides_attestations`: seznam typů průkazů
- identifikátor subjektu (`sub`)
- `registry_uri`

Peněženka ověřuje podpis WRPRC (AdES profil B-B dle **ETSI TS 119 182-1**) vůči důvěryhodnému vydavateli a obsah registrace dle **ISSU_34a** / **ISSU_34b** (ARF Topic 12). WRPRC **nepodepisuje** transakce s peněženkou — k tomu slouží access certifikát.

<details>
<summary>Prohloubení — registration certificate vydavatele (WRPRC)</summary>

**Formát:** dle **ETSI TS 119 475** §5.2.1 je WRPRC **podepsaný JWT** (`typ: rc-wrp+jwt`) nebo **CWT** (`typ: rc-wrp+cwt`), nikoli X.509. Registrační údaje (`entitlements`, `provides_attestations`, identifikátor, `registry_uri`) jsou v **payload** tokenu.

> ETSI používá zkratku **WRPRC** (Wallet-Relying Party Registration Certificate). Stejný formát se používá i pro subjekty s entitlements vydavatele atestací (`Non_Q_EAA_Provider` atd.) — viz příklad v Annex C TS 119 475.

**Vystavení**

Na rozdíl od access certifikátu klub **negeneruje CSR** — po schválení registrace registrátor vydá WRPRC podepsaný svým klíčem (pečeť/podpis TSP z trusted list) a doručí ho klubu jako JWS compact string. Klub ho publikuje v `issuer_info`:

```json
{
  "format": "registration_cert",
  "data": "<JWS compact WRPRC, typ rc-wrp+jwt>"
}
```

Alternativně peněženka načte stejná data přes `registrar_dataset` a dotaz na **TS5 API** (`registryURI`).

**Ověření peněženkou**

1. Ověří podpis JWT/CWT (AdES B-B) a řetěz `x5c` vůči vydavateli registration certificates.
2. Zkontroluje `entitlements` obsahuje EAA Provider.
3. Ověří, že požadovaný typ credential je v `provides_attestations`.

**Příklad — payload WRPRC pro EAA Provider (zjednodušeně, dle TS 119 475 Annex C)**

```json
{
  "typ": "rc-wrp+jwt",
  "alg": "ES256",
  "x5c": ["<řetěz certifikátů vydavatele WRPRC>"]
}
```

Payload (dekódovaný):

```json
{
  "sub": "urn:eudi:CZ:EUID:…",
  "sub_ln": "Střelecký klub Brno z.s.",
  "country": "CZ",
  "registry_uri": "https://registry.eudi.cz/api/v1",
  "entitlements": [
    "https://uri.etsi.org/19475/Entitlement/Non_Q_EAA_Provider"
  ],
  "provides_attestations": [
    { "format": "dc+sd-jwt", "meta": { "vct": "urn:walletmap:club:membership:1" } },
    { "format": "dc+sd-jwt", "meta": { "vct": "urn:walletmap:club:competitor:1" } },
    { "format": "dc+sd-jwt", "meta": { "vct": "urn:walletmap:club:entry:1" } }
  ]
}
```

> Přesná struktura payloadu se řídí **ETSI TS 119 475** §5.2.4 a Annex V CIR (EU) 2025/848.

</details>

<details>
<summary>Struktura issuer_info v metadatech (ETSI TS 119 472-3 §4.2.3)</summary>

```json
{
  "issuer_info": [
    {
      "format": "registration_cert",
      "data": "<JWS compact WRPRC>"
    },
    {
      "format": "registrar_dataset",
      "data": {
        "identifier": "urn:eudi:CZ:…",
        "entitlements": [
          "https://uri.etsi.org/19475/Entitlement/Non_Q_EAA_Provider"
        ],
        "providesAttestations": [
          { "format": "dc+sd-jwt", "meta": { "vct": "urn:walletmap:club:membership:1" } },
          { "format": "dc+sd-jwt", "meta": { "vct": "urn:walletmap:club:competitor:1" } },
          { "format": "dc+sd-jwt", "meta": { "vct": "urn:walletmap:club:entry:1" } }
        ],
        "registryURI": "https://registry.eudi.cz/api/v1"
      }
    }
  ]
}
```

</details>

## Credential Issuer Metadata

Issuer publikuje metadata na `https://issuer.walletmap-club.cz/.well-known/openid-credential-issuer`. Metadata jsou **podepsána** access certifikátem (`signed_metadata` dle OID4VCI).

### Společná struktura

<details>
<summary>Základ issuer metadat — společná část</summary>

```json
{
  "credential_issuer": "https://issuer.walletmap-club.cz",
  "authorization_servers": ["https://auth.walletmap-club.cz"],
  "preferred_client_status_period": 2678400,
  "credential_endpoint": "https://issuer.walletmap-club.cz/credential",
  "nonce_endpoint": "https://issuer.walletmap-club.cz/nonce",
  "notification_endpoint": "https://issuer.walletmap-club.cz/notification",
  "grant_types_supported": [
    "authorization_code",
    "urn:ietf:params:oauth:grant-type:pre-authorized_code"
  ],
  "credential_response_encryption": {
    "alg_values_supported": ["ECDH-ES+A256KW"],
    "enc_values_supported": ["A256GCM"],
    "encryption_required": true
  },
  "signed_metadata": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVkZW50aWFsX2lzc3VlciI6Imh0dHBzOi8vaXNzdWVyLndhbGxldG1hcC1jbHViLmN6In0.MEQCI…podpis…"
}
```

</details>

<details>
<summary>Prohloubení — credential_response_encryption</summary>

OID4VCI umožňuje issuerovi vyžadovat **šifrování odpovědi** na `credential` endpointu, aby vydaný credential necestoval v plaintextu.

| Pole | Význam |
|------|--------|
| `alg_values_supported` | Povolené algoritmy pro dohodu / obal klíče (JWE `alg`), např. `ECDH-ES+A256KW` |
| `enc_values_supported` | Povolené algoritmy pro šifrování obsahu (JWE `enc`), např. `A256GCM` |
| `encryption_required` | `true` = peněženka **musí** credential response zašifrovat |

**Tok:** peněženka vygeneruje efemérní klíč, odvodí sdílené tajemství s veřejným klíčem issuer instance (z access certifikátu nebo z `jwks` v metadatech) a odešle credential jako **JWE**. Issuer dešifruje **privátním klíčem** své instance.

Pokud issuer šifrování nevyžaduje, pole v metadatech chybí nebo `encryption_required` je `false`.

</details>

<details>
<summary>Prohloubení — signed_metadata</summary>

`signed_metadata` je **JWS** v compact serializaci (`header.payload.signature`) nad issuer metadaty. Issuer podepisuje **privátním klíčem** svého access certifikátu — peněženka tedy ověřuje jak podpis, tak platnost access certifikátu vůči **LoTE**.

**Protected header (zjednodušeně):**

```json
{
  "alg": "ES256",
  "typ": "JWT",
  "x5c": ["<DER access certifikát issuer instance, base64>"]
}
```

Alternativně může header obsahovat `kid` odkazující na certifikát známý z TLS handshaku.

**Payload** obsahuje stejná metadata jako JSON dokument — `credential_issuer`, `credential_configurations_supported`, `issuer_info`, endpointy atd.

**Ověření peněženkou:**

1. Dekóduje JWS a ověří podpis veřejným klíčem z `x5c` / access certifikátu.
2. Ověří platnost access certifikátu a řetěz vůči **LoTE**.
3. Použije obsah payloadu jako důvěryhodná metadata (nedůvěřuje nepodepsanému JSONu z HTTP odpovědi).

> Podrobnější tok: [Vydávání, metadata a revokace](/scenare/strelecky-klub/issuer-prohloubeni-vydavani).

</details>

### Metadata podle typu průkazu

Každý typ má vlastní položku v `credential_configurations_supported`:

<details>
<summary>credential_configurations_supported — club_membership_sd_jwt</summary>

```json
{
  "club_membership_sd_jwt": {
    "format": "dc+sd-jwt",
    "scope": "club_membership",
    "vct": "urn:walletmap:club:membership:1",
    "cryptographic_binding_methods_supported": ["jwk"],
    "credential_signing_alg_values_supported": ["ES256"],
    "proof_types_supported": {
      "jwt": {
        "proof_signing_alg_values_supported": ["ES256"],
        "key_attestation_required": {
          "key_storage": ["iso_18045_high"],
          "user_authentication": ["iso_18045_moderate"],
          "preferred_key_storage_status_period": 2678400
        }
      },
      "attestation": {
        "key_attestation_required": {
          "key_storage": ["iso_18045_high"],
          "preferred_key_storage_status_period": 2678400
        }
      }
    },
    "display": [
      {
        "name": "Klubový průkaz",
        "locale": "cs",
        "description": "Členský průkaz střeleckého klubu",
        "background_color": "#0b0d1a",
        "text_color": "#e8edf5"
      }
    ],
    "claims": [
      { "path": ["member_id"], "display": [{ "name": "Číslo člena", "locale": "cs" }] },
      { "path": ["membership_level"], "display": [{ "name": "Úroveň členství", "locale": "cs" }] },
      { "path": ["roles"], "display": [{ "name": "Funkce", "locale": "cs" }] },
      { "path": ["status"], "display": [{ "name": "Stav", "locale": "cs" }] },
      { "path": ["valid_until"], "display": [{ "name": "Platnost do", "locale": "cs" }] }
    ]
  }
}
```

</details>

<details>
<summary>credential_configurations_supported — competitor_license_sd_jwt</summary>

```json
{
  "competitor_license_sd_jwt": {
    "format": "dc+sd-jwt",
    "scope": "competitor_license",
    "vct": "urn:walletmap:club:competitor:1",
    "cryptographic_binding_methods_supported": ["jwk"],
    "credential_signing_alg_values_supported": ["ES256"],
    "proof_types_supported": {
      "jwt": {
        "proof_signing_alg_values_supported": ["ES256"],
        "key_attestation_required": {
          "key_storage": ["iso_18045_high"],
          "user_authentication": ["iso_18045_moderate"],
          "preferred_key_storage_status_period": 2678400
        }
      },
      "attestation": {
        "key_attestation_required": {
          "key_storage": ["iso_18045_high"],
          "preferred_key_storage_status_period": 2678400
        }
      }
    },
    "display": [
      {
        "name": "Průkaz závodníka",
        "locale": "cs",
        "description": "Oprávnění startovat v sezóně střeleckého klubu"
      }
    ],
    "claims": [
      { "path": ["competitor_id"] },
      { "path": ["season"] },
      { "path": ["license_status"] },
      { "path": ["gun_license_verified"] },
      { "path": ["valid_until"] }
    ]
  }
}
```

</details>

<details>
<summary>credential_configurations_supported — competition_entry_sd_jwt</summary>

```json
{
  "competition_entry_sd_jwt": {
    "format": "dc+sd-jwt",
    "scope": "competition_entry",
    "vct": "urn:walletmap:club:entry:1",
    "cryptographic_binding_methods_supported": ["jwk"],
    "credential_signing_alg_values_supported": ["ES256"],
    "proof_types_supported": {
      "jwt": {
        "proof_signing_alg_values_supported": ["ES256"],
        "key_attestation_required": {
          "key_storage": ["iso_18045_high"],
          "user_authentication": ["iso_18045_moderate"],
          "preferred_key_storage_status_period": 2678400
        }
      },
      "attestation": {
        "key_attestation_required": {
          "key_storage": ["iso_18045_high"],
          "preferred_key_storage_status_period": 2678400
        }
      }
    },
    "display": [
      {
        "name": "Startovní lístek",
        "locale": "cs",
        "description": "Vstupenka na konkrétní soutěž"
      }
    ],
    "claims": [
      { "path": ["entry_id"] },
      { "path": ["competition_id"] },
      { "path": ["competition_name"] },
      { "path": ["discipline"] },
      { "path": ["valid_from"] },
      { "path": ["valid_until"] },
      { "path": ["status"] }
    ]
  }
}
```

</details>

## Ověření peněženkou před vydáním

Dle ARF (ISSU_34a, ISSU_34b) peněženka před přijetím credential offer:

1. stáhne a ověří **signed metadata** (podpis access certifikátem)
2. zkontroluje `issuer_info` — registration cert nebo `registrar_dataset`
3. ověří, že `entitlement` = EAA Provider
4. ověří, že požadovaný typ je v `providesAttestations`
5. zobrazí uživateli náhled (`display`) a žádá souhlas

## Revokace a status list

Vydavatel provozuje **status list** nebo notification endpoint pro:

- ukončení / vyloučení člena → revokace `ClubMembership`
- ztráta zbrojního oprávnění → revokace `CompetitorLicense`
- odhlášení ze závodu → revokace `CompetitionEntry`

Detail revokačních mechanismů — samostatný budoucí článek.

## Vazba na scénáře klubu

| Průkaz | Scénář vydání |
|--------|---------------|
| ClubMembership | [Schválení a vydání členství](/scenare/strelecky-klub/schvaleni-a-vydani-clenstvi) |
| CompetitorLicense | [Vydání průkazu závodníka](/scenare/strelecky-klub/vydani-prukazu-zavodnika) |
| CompetitionEntry | [Registrace na soutěž](/scenare/strelecky-klub/registrace-na-soutez) |

Při vydání `CompetitorLicense` klub zároveň vystupuje jako **RP** — v kombinované prezentaci ověřuje PID a zbrojní oprávnění. Viz [Registrace RP](/scenare/strelecky-klub/registrace-rp), intended use `iu-reg-zavodnik`.

→ **Další prohloubení:** [Vydávání, metadata a revokace](/scenare/strelecky-klub/issuer-prohloubeni-vydavani) — credential offer, WIA/KA atestace, proofy, status list.
