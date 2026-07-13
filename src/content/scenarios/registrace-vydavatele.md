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

**Access Certificate Authority** (přidružená k registrátorovi) vydá access certifikát **issuer instanci**:

| Instance | Účel | Subjekt certifikátu |
|----------|------|---------------------|
| `issuer.walletmap-club.cz` | OID4VCI vydávání | Klub (EAA Provider) |

Certifikát obsahuje trust anchor v **List of Trusted Entities (LoTE)**. Peněženka jím ověřuje autenticitu při každém vydání.

### 4. Registration certificate (volitelné)

Pokud český registrátor vydává registration certificates (ETSI TS 119 475), klub obdrží certifikát obsahující:

- `entitlement`: Non_Q_EAA_Provider
- `providesAttestations`: seznam typů
- identifikátor vydavatele
- `registryURI`

Peněženka ověřuje registraci vydavatele dle požadavků **ISSU_34a** a **ISSU_34b** (ARF Topic 12).

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
  "credential_response_encryption": { "…": "…" },
  "signed_metadata": "<JWS podepsaný access certifikátem>"
}
```

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
