---
title: "Registrace závodníka"
description: "Online registrace závodníka s ověřením PID a zbrojního oprávnění od státu."
series: strelecky-klub
order: 40
category: zavodnik
roles: ["Závodník", "Klub (ověřovatel)"]
deepenLinks:
  - label: "OID4VP — Presentation Exchange"
    url: "https://openid.net/specs/openid-4-verifiable-presentations-1_0.html"
  - label: "EUDI ARF — PID Rulebook"
    url: "https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework"
prev: prihlaseni-klubove-aplikace
next: vydani-prukazu-zavodnika
---

Každý, kdo chce soutěžit, se registruje jako **závodník**. Klub musí ověřit **zbrojní oprávnění** (povinné) a identitu přes **PID** (doporučené). Volitelně může požadovat i **průkaz zbraně**.

## Předpoklady

- Závodník má v peněžence **PID** od státu
- Závodník má platné **zbrojní oprávnění** v peněžence
- Závodník nemusí být členem klubu (dle statutu), ale v tomto modelu často ano

## User journey — závodník

1. Na webu klubu zvolí **Registrace závodníka**
2. Systém zahájí **OID4VP** transakci — nejdřív požádá o **PID**:
   - jméno, příjmení, datum narození
3. Závodník v peněžence potvrdí sdílení atributů PID
4. Systém požádá o **zbrojní oprávnění**:
   - číslo průkazu, platnost, kategorie
5. Závodník potvrdí sdílení
6. Volitelně klub požádá o **průkaz zbraně** (konkrétní zbraň)
7. Po úspěšném ověření systém vytvoří záznam závodníka
8. Klub vydá **průkaz závodníka** (další scénář)

## User journey — klub (ověřovatel)

1. Definuje **presentation definition** pro státní doklady
2. Ověří podpis státního vydavatele (CZ)
3. Zkontroluje platnost zbrojního oprávnění
4. Uloží výsledek ověření (`gun_license_verified: true`) do profilu závodníka
5. Initiuje vydání průkazu závodníka

## Selektivní sdílení — co závodník vidí

Peněženka zobrazí dvě (nebo tři) samostatné žádosti nebo jednu kombinovanou:

| Doklad | Sdílené atributy | Skryté |
|--------|------------------|--------|
| PID | jméno, datum narození | adresa, rodné číslo (pokud nepožadováno) |
| Zbrojní opr. | číslo, platnost, kategorie | — |
| Průkaz zbraně | typ, výrobní číslo, platnost | — |

## Odmítnutí registrace

Klub registraci odmítne pokud:

- zbrojní oprávnění není platné
- identita neodpovídá (nesoulad PID a formuláře)
- závodník je v registru vyloučených osob (interní seznam klubu)

## Vztah k členství

| Varianta | Klubový průkaz | Registrace závodníka |
|----------|:--------------:|:--------------------:|
| Člen klubu | ano | ověření státních dokladů |
| Hostující závodník | ne | stejné ověření, bez klubového průkazu |

Hostující závodník nemá přístup na střelnici mimo závody bez platného startovního lístku.
