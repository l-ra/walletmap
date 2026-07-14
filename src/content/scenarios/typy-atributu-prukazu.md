---
title: "Atributy průkazů klubu"
description: "Jaká data klub vkládá do členských průkazů, průkazů závodníků a startovních lístků."
series: strelecky-klub
order: 13
category: system
roles: ["Klub (vydavatel)"]
deepenLinks:
  - label: "SD-JWT-based Verifiable Credentials"
    url: "https://datatracker.ietf.org/doc/draft-ietf-oauth-selective-disclosure-jwt/"
  - label: "EUDI ARF — Attestation Rulebook"
    url: "https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework"
prev: rp-certifikaty-a-verifier
---

Každý typ průkazu nese sadu **atributů** definovaných klubem v souladu s profilem EUDIW. Peněženka umožňuje **selektivní sdílení** — držitel nemusí odhalit vše.

## Klubový průkaz (`ClubMembership`)

| Atribut | Příklad | Poznámka |
|---------|---------|----------|
| `member_id` | `SK-2026-0042` | Interní identifikátor |
| `given_name`, `family_name` | Jan Novák | |
| `membership_level` | `řadový člen` / `člen výboru` / `předseda výboru` | |
| `roles` | `["správce střelnice", "rozhodčí"]` | Více hodnot |
| `status` | `aktivní` | aktivní / ke obnově / ukončené / vyloučený |
| `valid_from`, `valid_until` | 2026-01-01 / 2026-12-31 | Roční cyklus |
| `club_id` | `cz-strelecky-klub-brno` | Identifikátor vydavatele |
| `photo` | (volitelně) | Dle politiky klubu |

**Při ověření** zámek střeliště typicky žádá pouze: `status`, `valid_until`, případně `roles`.

## Průkaz závodníka (`CompetitorLicense`)

| Atribut | Příklad | Poznámka |
|---------|---------|----------|
| `competitor_id` | `COMP-2026-0187` | |
| `given_name`, `family_name` | Jan Novák | |
| `season` | `2026` | Sezóna |
| `license_status` | `platný` | platný / pozastavený / zrušený |
| `gun_license_verified` | `true` | Klub ověřil zbrojní oprávnění při registraci |
| `valid_until` | 2026-12-31 | Konec sezóny |
| `club_id` | `cz-strelecky-klub-brno` | |

## Startovní lístek (`CompetitionEntry`)

| Atribut | Příklad | Poznámka |
|---------|---------|----------|
| `entry_id` | `ENTRY-2026-0521` | |
| `competition_id` | `COMP-CZ-260315` | Identifikátor závodu |
| `competition_name` | Jarní pohár 2026 | |
| `competitor_id` | `COMP-2026-0187` | Vazba na závodníka |
| `discipline` | `IPSC Production` | |
| `valid_from`, `valid_until` | 2026-03-15 08:00 / 2026-03-15 18:00 | Po dobu soutěže |
| `status` | `platný` | platný / odhlášený / zrušený |

## Selektivní sdílení — příklad

Závodník se registruje online: klub v jedné **kombinované prezentaci** požaduje [[PID]] a **zbrojní oprávnění** (číslo, platnost). Závodník v peněžence vidí jeden consent dialog se všemi požadovanými atributy a sdílí **pouze to, co klub žádá**, ne celé doklady.

## Revokace a aktualizace

| Událost | Akce vydavatele |
|---------|-----------------|
| Nezaplacený příspěvek | `status` → `ke obnově` nebo pozastavení |
| Vyloučení | revokace klubového průkazu |
| Ukončení členství | revokace nebo `status` → `ukončené` |
| Změna role | vydání aktualizovaného průkazu |
| Odhlášení ze závodu | revokace startovního lístku |

Mechanismus revokace dle IETF Token Status List a OID4VCI — viz [Revokace a status list](/scenare/strelecky-klub/revokace-a-status-list).
