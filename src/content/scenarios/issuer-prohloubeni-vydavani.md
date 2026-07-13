---
title: "Vydávání, metadata a revokace"
description: "Prohloubení vydavatele — signed metadata, credential offer, proofy, status list a revokace průkazů klubu."
series: strelecky-klub
order: 12
category: system
roles: ["Klub (vydavatel)"]
deepenLinks:
  - label: "OID4VCI — Credential Offer"
    url: "https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name credential-offer"
  - label: "TS3 — Wallet Unit Attestation"
    url: "https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/blob/main/docs/technical-specifications/ts3-wallet-unit-attestation.md"
  - label: "ARF Topic 27 — Revocation"
    url: "https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework/blob/main/docs/annexes/annex-2/annex-2.02-high-level-requirements-by-topic.md"
  - label: "Základ registrace vydavatele"
    url: "/scenare/strelecky-klub/registrace-vydavatele"
prev: registrace-vydavatele
next: registrace-rp
---

Tento článek prohlubuje [registraci vydavatele](/scenare/strelecky-klub/registrace-vydavatele) o provozní detaily: jak peněženka ověřuje metadata, jak probíhá vydání a jak klub spravuje revokaci.

## Tok ověření metadat peněženkou

Před zobrazením credential offer peněženka provede:

```
GET /.well-known/openid-credential-issuer
  → ověří signed_metadata (JWS, access certifikát vydavatele)
  → ověří issuer_info (registration_cert / registrar_dataset)
  → zkontroluje entitlement Non_Q_EAA_Provider
  → ověří, že požadovaný vct je v providesAttestations
  → zobrazí display[] uživateli
```

<details>
<summary>signed_metadata — struktura JWS payload (zjednodušeně)</summary>

```json
{
  "iss": "https://issuer.walletmap-club.cz",
  "iat": 1781366400,
  "credential_issuer": "https://issuer.walletmap-club.cz",
  "credential_configurations_supported": { "…": "…" },
  "issuer_info": [
    { "format": "registration_cert", "data": "MIIC…" },
    { "format": "registrar_dataset", "data": { "…": "…" } }
  ]
}
```

Podpis: private key vázaná na access certifikát vydavatele. Peněženka ověří řetěz vůči LoTE.

</details>

## Credential Offer — dva toky v klubu

### Pre-authorized code (schválení členství, startovní lístek)

Výbor schválí žádost → issuer vygeneruje offer bez interaktivního přihlášení:

<details>
<summary>credential_offer_uri — ClubMembership po schválení</summary>

```json
{
  "credential_issuer": "https://issuer.walletmap-club.cz",
  "credential_configuration_ids": ["club_membership_sd_jwt"],
  "grants": {
    "urn:ietf:params:oauth:grant-type:pre-authorized_code": {
      "pre-authorized_code": "SplxlOBeZQQYbYS6WxSbIA",
      "user_pin_required": false
    }
  }
}
```

</details>

Deeplink: `openid-credential-offer://?credential_offer_uri=https%3A%2F%2Fissuer…%2Foffer%2Fabc123`

### Authorization code (registrace závodníka po ověření PID)

Závodník nejdřív projde OID4VP ověřením státních dokladů, pak issuer nabídne CompetitorLicense:

<details>
<summary>credential_offer — CompetitorLicense (authorization_code)</summary>

```json
{
  "credential_issuer": "https://issuer.walletmap-club.cz",
  "credential_configuration_ids": ["competitor_license_sd_jwt"],
  "grants": {
    "authorization_code": {
      "issuer_state": "sess-reg-zavodnik-2026-0187"
    }
  }
}
```

</details>

## Proof a Wallet Unit Attestation

Při vydání peněženka posílá **proof** (JWT) s holder binding klíčem. V ekosystému EUDIW issuer typicky vyžaduje i **Wallet Unit Attestation (WUA)** dle TS3 — potvrzení, že peněženka splňuje bezpečnostní profil.

<details>
<summary>credential_request — proof + WUA (konceptuálně)</summary>

```json
{
  "credential_configuration_id": "club_membership_sd_jwt",
  "proof": {
    "proof_type": "jwt",
    "jwt": "eyJ…"
  },
  "wua": {
    "format": "jwt",
    "data": "eyJ…"
  }
}
```

</details>

Issuer ověří proof, vydá SD-JWT VC s `cnf` claim vázaným na holder klíč.

## Vydaný průkaz — příklad ClubMembership

<details>
<summary>SD-JWT VC payload (disclosed claims)</summary>

```json
{
  "iss": "https://issuer.walletmap-club.cz",
  "iat": 1781366400,
  "vct": "urn:walletmap:club:membership:1",
  "member_id": "SK-2026-0042",
  "given_name": "Jan",
  "family_name": "Novák",
  "membership_level": "řadový člen",
  "roles": ["správce střelnice"],
  "status": "aktivní",
  "valid_from": "2026-01-01",
  "valid_until": "2026-12-31",
  "cnf": { "jwk": { "…": "…" } }
}
```

</details>

## Revokace a status list

Klub musí zneplatnit průkaz při vyloučení, ukončení členství nebo odhlášení ze závodu.

### Notification endpoint (OID4VCI)

Peněženka po vydání registruje `notification_id`. Issuer při revokaci pošle:

<details>
<summary>notification — revokace průkazu</summary>

```json
{
  "notification_id": "notif-0042-2026",
  "event": "credential_deleted",
  "event_description": "Členství ukončeno dle žádosti člena"
}
```

</details>

### Status list (alternativa / doplněk)

Issuer publikuje token status list (JWT s seznamem revokovaných `jti`):

<details>
<summary>status_list_uri v credential metadata</summary>

```json
{
  "club_membership_sd_jwt": {
    "format": "dc+sd-jwt",
    "vct": "urn:walletmap:club:membership:1",
    "status_list": {
      "uri": "https://issuer.walletmap-club.cz/statuslists/club-membership/1",
      "idx": 42042
    }
  }
}
```

</details>

Ověřovatel (zámek, aplikace) kontroluje status při každé prezentaci — revokovaný průkaz projde i online dotazem na status list.

## Revokace podle typu průkazu

| Událost | Průkaz | Mechanismus |
|---------|--------|-------------|
| Vyloučení člena | ClubMembership | okamžitá revokace + status list |
| Nezaplacený příspěvek | ClubMembership | `status` → pozastaveno; volitelně revokace |
| Ztráta zbrojního oprávnění | CompetitorLicense | revokace po re-verifikaci |
| Odhlášení ze závodu | CompetitionEntry | revokace konkrétního `entry_id` |
| Prodloužení sezóny | CompetitorLicense | revokace starého + vydání nového |

## Issuer metadata podle role vydávání

Klub vydává ze **jedné issuer instance**, ale metadata rozlišují tři konfigurace. Každá má vlastní `scope` pro authorization server:

| configuration_id | scope | Kdo iniciuje | Grant type |
|------------------|-------|--------------|------------|
| `club_membership_sd_jwt` | `club_membership` | výbor po schválení | pre-authorized_code |
| `competitor_license_sd_jwt` | `competitor_license` | závodník po registraci | authorization_code |
| `competition_entry_sd_jwt` | `competition_entry` | závodník po platbě startovného | pre-authorized_code |

<details>
<summary>authorization_server — scope mapování</summary>

```json
{
  "scopes_supported": [
    "club_membership",
    "competitor_license",
    "competition_entry"
  ],
  "scope_to_credential": {
    "club_membership": ["club_membership_sd_jwt"],
    "competitor_license": ["competitor_license_sd_jwt"],
    "competition_entry": ["competition_entry_sd_jwt"]
  }
}
```

</details>

## Vazba na scénáře

| Operace | Scénář |
|---------|--------|
| Vydání členství | [Schválení a vydání](/scenare/strelecky-klub/schvaleni-a-vydani-clenstvi) |
| Revokace členství | [Obnova a ukončení](/scenare/strelecky-klub/obnova-a-ukonceni-clenstvi) |
| Vydání závodníka | [Vydání průkazu závodníka](/scenare/strelecky-klub/vydani-prukazu-zavodnika) |
| Startovní lístek | [Registrace na soutěž](/scenare/strelecky-klub/registrace-na-soutez) |

Pro ověřování státních dokladů před vydáním závodníka klub vystupuje jako RP — viz [Registrace RP](/scenare/strelecky-klub/registrace-rp) a [RP certifikáty a verifier](/scenare/strelecky-klub/rp-certifikaty-a-verifier).
