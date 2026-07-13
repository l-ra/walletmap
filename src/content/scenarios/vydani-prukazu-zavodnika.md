---
title: "Vydání průkazu závodníka"
description: "Klub vydá sezónní průkaz závodníka po úspěšné registraci."
series: strelecky-klub
order: 41
category: zavodnik
roles: ["Závodník", "Klub (vydavatel)"]
deepenLinks:
  - label: "OID4VCI — Issuance Flow"
    url: "https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html"
prev: registrace-zavodnika
next: registrace-na-soutez
---

Po ověření státních dokladů klub vydá **průkaz závodníka** platný jednu sezónu. Závodník si ho může prodloužit na další sezónu.

## User journey — závodník

1. Po úspěšné registraci obdrží notifikaci
2. Otevře credential offer v peněžence
3. Vidí náhled: jméno, sezóna, platnost, klub
4. Potvrdí → **průkaz závodníka** se uloží vedle ostatních dokladů
5. V aplikaci klubu vidí stav: „Závodník — sezóna 2026"

## User journey — klub (vydavatel)

1. Systém automaticky (nebo po schválení) sestaví payload `CompetitorLicense`
2. Issuer podepíše a nabídne průkaz
3. Zaznamená vazbu `competitor_id` ↔ ověřené PID
4. Nastaví `valid_until` na konec sezóny

## Prodloužení na další sezónu

Na konci sezóny:

1. Závodník požádá o prodloužení (online)
2. Klub znovu ověří platnost **zbrojního oprávnění** (OID4VP)
3. Vydá nový průkaz pro další sezónu
4. Starý průkaz se revokuje

Prodloužení nevyžaduje opětovnou registraci celého profilu — stačí ověřit, že zbrojní oprávnění stále platí.

## Pozastavení a zrušení

| Důvod | Akce |
|-------|------|
| Ztráta zbrojního oprávnění | revokace průkazu závodníka |
| Disciplinární opatření | `license_status: pozastavený` |
| Ukončení registrace závodníka | revokace |

Závodník s pozastaveným průkazem se nemůže registrovat na soutěže.
