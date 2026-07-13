---
title: "Přehled modelu"
description: "Celkový kontext střeleckého klubu jako modelového příkladu EUDIW."
series: strelecky-klub
order: 1
category: uvod
roles: []
deepenLinks:
  - label: "EUDI Wallet — oficiální portál"
    url: "https://digital-identity-wallet.europa.eu/"
  - label: "Architecture and Reference Framework (ARF)"
    url: "https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework"
next: role-a-prukazy
---

Střelecký klub pořádá pravidelné závody ve sportovní střelbě, umožňuje členům přístup na střelnici a vyžaduje účast členů na organizaci klubových akcí. Klub se rozhodl využívat **evropskou peněženku digitální identity** pro vydávání a ověřování průkazů.

## Celková situace

Klub vystupuje jako **vydavatel (Issuer)** vlastních průkazů a zároveň jako **spolehlivá strana (Relying Party)** při přihlašování do klubové aplikace a správě členské databáze. Střelnice a závody vystupují jako **ověřovatelé (Verifier)**. Stát vydává **PID**, **zbrojní oprávnění** a případně **průkaz zbraně**.

## Hlavní procesy

1. **Členství** — roční klubový průkaz se schvalováním výborem
2. **Závodník** — registrace se státními doklady, sezónní průkaz závodníka
3. **Soutěže** — registrace na konkrétní závod, startovní lístek
4. **Přístup** — elektronické zámky zázemí a střeliště
5. **Klubová aplikace** — přihlášení průkazem z peněženky

## Zapojené strany

| Strana | Úloha v EUDIW |
|--------|---------------|
| Občan / člen / závodník | Držitel peněženky, předkládá a přijímá průkazy |
| Střelecký klub | Vydavatel klubových průkazů, RP klubové aplikace |
| Stát (CZ) | Vydavatel PID a zbrojních dokladů |
| Střelnice (zámky) | Verifier při fyzickém přístupu |
| Rozhodčí na závodě | Verifier startovního lístku a průkazu závodníka |

## User journey — typický nový člen-závodník

1. Podá žádost o členství → schválení výborem → **klubový průkaz** v peněžence
2. Přihlásí se do klubové aplikace průkazem
3. Požádá o registraci závodníka → předloží **PID** a **zbrojní oprávnění** → obdrží **průkaz závodníka**
4. Přihlásí se na soutěž → obdrží **startovní lístek**
5. Na střelnici předloží průkazy zámku / rozhodčímu

Další scénáře rozebírají každý krok zvlášť — z pohledu uživatele, vydavatele i ověřovatele.
