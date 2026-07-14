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

Access certifikát je standardní **X.509** certifikát ([RFC 5280](https://datatracker.ietf.org/doc/html/rfc5280)) vydaný **Access Certificate Authority** (ACA). Slouží k **autentizaci technické instance** vůči peněžence — ne k zápisu registrace subjektu (ten je v registration certificate nebo v registru).

Stejný typ certifikátu používá i **RP instance** při OID4VP — viz [Registrace RP](/scenare/strelecky-klub/registrace-rp) a [RP certifikáty](/scenare/strelecky-klub/rp-certifikaty-a-verifier).

**Vystavení — co musí udělat držitel instance**

1. Vygenerovat kryptografický pár klíčů (typicky **ES256** / P-256).
2. **Privátní klíč** vytvořit, uložit a spravovat na instanci (HSM, TPM, zabezpečené úložiště) — nesmí opustit provoz a nesmí být sdílen mezi instancemi.
3. Z privátního klíče vytvořit **Certificate Signing Request (CSR)** s identifikátorem instance (obvykle DNS jméno v **Subject Alternative Name**).
4. Zaslat CSR **vydavateli access certifikátů** (ACA) — obvykle přes portál registrátora po schválení registrace.
5. Po vydání nasadit certifikát na instanci; privátním klíčem podepisovat metadata a protokolové zprávy.

**Ověření peněženkou**

Peněženka ověří platnost certifikátu, nepoužití odvolaného stavu a že řetěz vede k **trust anchor** ACA uvedené v **LoTE**. U RP navíc kontroluje shodu s `client_id` v verifier metadata.

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

Pokud český registrátor vydává registration certificates (ETSI TS 119 475), klub obdrží **registration certificate** — opět standardní **X.509** certifikát, ale vydaný **Provider of Registration Certificates** (registrátorem), nikoli ACA. Obsahuje:

- `entitlement`: Non_Q_EAA_Provider
- `providesAttestations`: seznam typů
- identifikátor vydavatele
- `registryURI`

Peněženka ověřuje podpis registration certificate vůči důvěryhodnému vydavateli a obsah registrace dle požadavků **ISSU_34a** a **ISSU_34b** (ARF Topic 12). Certifikát **nepodepisuje** transakce s peněženkou — k tomu slouží access certifikát.

<details>
<summary>Prohloubení — registration certificate vydavatele (X.509)</summary>

Registration certificate je **X.509** certifikát dle **ETSI TS 119 475**. Registrační údaje (`entitlement`, `providesAttestations`, identifikátor subjektu, `registryURI`) jsou zakódované v certifikátových rozšířeních, nikoli v běžných polích Subject.

**Vystavení**

Na rozdíl od access certifikátu klub obvykle **negeneruje CSR** — po schválení registrace registrátor vydá certifikát podepsaný svým klíčem a doručí ho klubu (DER nebo PEM). Klub ho publikuje v `issuer_info` metadat:

```json
{
  "format": "registration_cert",
  "data": "<base64 DER registration certificate>"
}
```

Alternativně peněženka načte stejná data přes `registrar_dataset` a dotaz na **TS5 API** (`registryURI`).

**Ověření peněženkou**

1. Ověří podpis certifikátu vůči důvěryhodnému vydavateli registration certificates.
2. Zkontroluje `entitlement` = EAA Provider.
3. Ověří, že požadovaný typ credential je v `providesAttestations`.

**Příklad — dekódovaná registrace v certifikátu (konceptuálně)**

```json
{
  "format": "eaa_provider_registration_cert",
  "issuerIdentifier": "urn:eudi:CZ:EUID:…",
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
```

> Přesná struktura rozšíření se řídí ETSI TS 119 475 a národní politikou registrátora.

</details>

<details>
<summary>Struktura issuer_info v metadatech (ETSI TS 119 472-3 §4.2.3)</summary>

```json
{
  "issuer_info": [
    {
      "format": "registration_cert",
      "data": "<base64 DER registration certificate>"
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
      "jwt": { "proof_signing_alg_values_supported": ["ES256"] }
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

Při vydání `CompetitorLicense` klub zároveň vystupuje jako **RP** — ověřuje PID a zbrojní oprávnění. Viz [Registrace RP](/scenare/strelecky-klub/registrace-rp), intended use `iu-reg-zavodnik`.

→ **Další prohloubení:** [Vydávání, metadata a revokace](/scenare/strelecky-klub/issuer-prohloubeni-vydavani) — credential offer, proofy, status list.
