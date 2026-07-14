---
title: "Obnova a ukončení členství"
description: "Roční obnova po zaplacení příspěvku, dobrovolné ukončení a vyloučení."
series: strelecky-klub
order: 22
category: clenstvi
roles: ["Řadový člen", "Člen výboru", "Klub (vydavatel)"]
deepenLinks:
  - label: "Revokace a status list — prohloubení"
    url: "/scenare/strelecky-klub/revokace-a-status-list"
  - label: "IETF — Token Status List"
    url: "https://datatracker.ietf.org/doc/html/draft-ietf-oauth-status-list"
prev: schvaleni-a-vydani-clenstvi
next: zmena-funkce-clena
---

Členství je **roční**. Po zaplacení příspěvku se členství prodlouží. Člen může členství ukončit, nebo může být vyloučen rozhodnutím výboru.

## Obnova členství

### User journey — člen

1. Před koncem platnosti obdrží upozornění (e-mail, v aplikaci, volitelně v peněžence)
2. Zaplatí roční příspěvek (platební brána klubu)
3. Po připsání platby systém automaticky iniciuje **aktualizaci průkazu**
4. V peněžence se objeví nabídka nového průkazu nebo aktualizace `valid_until`
5. Člen potvrdí → průkaz je platný další rok

### Úkoly vydavatele

- Zkontrolovat platbu v ekonomickém systému klubu
- Vydat aktualizovaný průkaz s novým `valid_until` a `status: aktivní`
- Starý průkaz **revokovat** nebo označit jako nahrazený

## Nezaplacený příspěvek

Pokud člen nezaplatí včas:

1. `status` se změní na `ke obnově` nebo `pozastaveno`
2. Zámek střeliště při ověření odmítne přístup (platnost vypršela)
3. Po doplacení se obnoví standardní postup

## Dobrovolné ukončení

### User journey — člen

1. Požádá o ukončení v klubové aplikaci nebo písemně
2. Výbor potvrdí přijetí ukončení
3. Klub **revokuje** klubový průkaz
4. V peněžence průkaz zmizí nebo se označí jako neplatný

## Vyloučení

1. Výbor rozhodne o vyloučení (dle statutu)
2. Administrátor v aplikaci nastaví `status: vyloučený`
3. Issuer provede **okamžitou revokaci** průkazu
4. Všechny verifikátory (zámky, aplikace) odmítnou průkaz

## Dopad na související průkazy

| Situace | Klubový průkaz | Průkaz závodníka | Startovní lístek |
|---------|:--------------:|:----------------:|:----------------:|
| Obnova | aktualizace | beze změny | beze změny |
| Ukončení | revokace | zvážit revokaci | zrušit budoucí |
| Vyloučení | revokace | revokace | zrušit vše |

Pravidla pro závodníka při ukončení členství závisí na statutu — závodník nemusí být totožný s členem klubu.
