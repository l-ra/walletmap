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

Každý, kdo chce soutěžit, se registruje jako **závodník**. Klub musí ověřit **zbrojní oprávnění** (povinné) a identitu přes [[PID]]. Volitelně může požadovat i **průkaz zbraně**.

## Předpoklady

- Závodník má v peněžence [[PID]] od státu
- Závodník má platné **zbrojní oprávnění** v peněžence
- Závodník nemusí být členem klubu (dle statutu), ale v tomto modelu často ano

## User journey — závodník

1. Na webu klubu zvolí **Registrace závodníka**
2. Systém zahájí [[OID4VP]] transakci s **kombinovanou prezentací** — v jedné žádosti požádá o všechny potřebné státní doklady:
   - [[PID]] — jméno, příjmení, datum narození
   - **zbrojní oprávnění** — číslo průkazu, platnost, kategorie
   - volitelně **průkaz zbraně** — typ, výrobní číslo, platnost (konkrétní zbraň)
3. Závodník v peněžence vidí **jeden consent dialog** se seznamem všech požadovaných atributů ze všech dokladů
4. Závodník jedním potvrzením sdílí požadované atributy
5. Po úspěšném ověření systém vytvoří záznam závodníka
6. Klub vydá **průkaz závodníka** (další scénář)

## User journey — klub (ověřovatel)

1. Definuje **presentation definition** s více `input_descriptors` (kombinovaná prezentace) pro státní doklady registrované v intended use `iu-reg-zavodnik`
2. Ověří podpisy státních vydavatelů (CZ)
3. Zkontroluje platnost zbrojního oprávnění
4. Uloží výsledek ověření (`gun_license_verified: true`) do profilu závodníka
5. Initiuje vydání průkazu závodníka

## Selektivní sdílení — co závodník vidí

Peněženka zobrazí **jednu kombinovanou žádost** — consent dialog s přehledem všech dokladů a atributů, které klub žádá:

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
