---
title: "Registrace na soutěž"
description: "Závodník se přihlásí na konkrétní závod a obdrží startovní lístek."
series: strelecky-klub
order: 42
category: zavodnik
roles: ["Závodník", "Klub (vydavatel)", "Klub (ověřovatel)"]
deepenLinks:
  - label: "OID4VCI — Multiple Credentials"
    url: "https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html"
prev: vydani-prukazu-zavodnika
next: rozhodci-overeni-zavodnika
---

Závodník s platným průkazem závodníka se registruje na konkrétní soutěž a obdrží **startovní lístek** platný po dobu závodu.

## User journey — závodník

1. V klubové aplikaci (přihlášen průkazem závodníka nebo klubovým) zobrazí kalendář soutěží
2. Vybere soutěž a disciplínu
3. Systém ověří:
   - platný **průkaz závodníka** pro aktuální sezónu
   - volitelně platný **klubový průkaz** (pokud soutěž vyžaduje členství)
4. Závodník potvrdí registraci a uhradí startovné
5. Obdrží **credential offer** pro startovní lístek
6. V peněžence se uloží `CompetitionEntry` s datem, názvem závodu a disciplínou

## User journey — klub

1. Definuje parametry soutěže (datum, disciplíny, kapacita)
2. Při registraci ověří prezentaci průkazu závodníka (OID4VP)
3. Po zaplacení startovného vydá startovní lístek (OID4VCI)
4. Eviduje seznam přihlášených pro rozhodčí

## Atributy startovního lístku

Závodník v peněžence vidí:

- název soutěže a datum
- disciplínu
- platnost (od–do)
- stav: `platný`

## Odhlášení ze soutěže

1. Závodník požádá o odhlášení v aplikaci
2. Klub startovní lístek **revokuje**
3. V peněžence se lístek označí jako neplatný
4. Zámek střeliště při ověření odmítne vstup

## Vztah k přístupu na střelnici

Během soutěže platí:

- **Člen klubu** — vstup na střelnici s platným klubovým průkazem
- **Závodník (i nečlen)** — vstup se **startovním lístkem** pro danou soutěž
- Oba typy vstupu akceptuje zámek střeliště (viz scénář Přístup střeliště)
