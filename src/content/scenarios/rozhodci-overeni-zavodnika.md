---
title: "Ověření rozhodčím na závodě"
description: "Rozhodčí ověřuje průkaz závodníka a startovní lístek při nástupu na střelnici."
series: strelecky-klub
order: 43
category: zavodnik
roles: ["Rozhodčí", "Závodník"]
deepenLinks:
  - label: "OID4VP — Verifier"
    url: "https://openid.net/specs/openid-4-verifiable-presentations-1_0.html"
prev: registrace-na-soutez
next: pristup-spravce-zazemi
---

Na soutěži rozhodčí ověřuje, že závodník má platný **průkaz závodníka** a **startovní lístek** pro danou akci.

## User journey — rozhodčí

1. Přihlásí se do aplikace rozhodčích (klubovým průkazem s rolí `rozhodčí`)
2. Vybere aktuální soutěž ze seznamu
3. U vstupu na střeliště nebo v sekretariátu zahájí ověření:
   - naskenuje QR kód z peněženky závodníka, NEBO
   - závodník přiloží telefon k terminálu (NFC / BLE)
4. Systém ověří:
   - platný průkaz závodníka (`license_status: platný`, správná sezóna)
   - platný startovní lístek (`competition_id` odpovídá, `status: platný`, čas v rozsahu)
5. Zobrazí výsledek: ✓ povolen vstup / ✗ zamítnuto s důvodem
6. Závodník se zapíše do listiny účastníků

## User journey — závodník

1. Otevře peněženku a vybere **prezentovat průkazy**
2. Vidí žádost: *„Ověření pro Jarní pohár 2026 — stanoviště rozhodčího"*
3. Sdílí průkaz závodníka + startovní lístek (selektivně jen požadované atributy)
4. Obdrží potvrzení o úspěšném ověření

## Technický průběh

Rozhodčí terminál funguje jako **Verifier** (OID4VP):

```
Rozhodčí zahájí ověření → Presentation Request (2 credential typy) →
  Peněženka → VP → Verifier ověří podpisy a platnost → Výsledek
```

Presentation definition požaduje:

- `CompetitorLicense` — atributy: `competitor_id`, `license_status`, `season`
- `CompetitionEntry` — atributy: `competition_id`, `status`, `valid_from`, `valid_until`

## Možné důvody zamítnutí

| Důvod | Zobrazení pro rozhodčího |
|-------|--------------------------|
| Expirovaný startovní lístek | „Lístek již neplatí" |
| Špatná soutěž | „Lístek je pro jiný závod" |
| Pozastavený průkaz závodníka | „Průkaz závodníka není platný" |
| Revokovaný průkaz | „Průkaz byl zrušen" |

## Offline režim

Pro odlehlá stanoviště může terminál ověřovat lokálně přes **status list** a cached klíče — detail v budoucím článku o offline verifikaci.
