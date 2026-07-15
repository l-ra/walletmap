---
title: "Role a průkazy"
description: "Přehled všech rolí, jejich oprávnění a typů průkazů v peněžence."
series: strelecky-klub
order: 2
category: uvod
roles: ["Řadový člen", "Člen výboru", "Předseda", "Správce střelnice", "Rozhodčí", "Závodník"]
deepenLinks:
  - label: "SD-JWT VC — formát průkazů"
    url: "https://datatracker.ietf.org/doc/draft-ietf-oauth-sd-jwt-vc/"
prev: prehled-modelu
next: zalohovani-a-obnova-penazenky
---

Každá role v klubu má definovaná oprávnění. Role se projevují jako **atributy** na klubovém průkazu a určují, co může držitel dělat.

## Role na klubovém průkazu

| Role / úroveň | Oprávnění v modelu |
|---------------|-------------------|
| **Řadový člen** | Přístup na střelnici (s platným členstvím), klubová aplikace, účast na organizaci akcí |
| **Člen výboru** | Schvalování vydání a změn průkazů (společně s dalším členem výboru nebo předsedou) |
| **Předseda výboru** | Schvalování vydání samostatně nebo s jedním členem výboru |
| **Správce střelnice** | Přístup do zázemí (elektronické zámky), správa provozu |
| **Rozhodčí** | Ověřování závodníků na soutěži (funkce může být atribut na průkazu) |

Člen může mít **více rolí současně** (např. řadový člen + správce střelnice + rozhodčí).

## Průkazy v peněžence — kdo vydává

### Vydávané klubem

| Průkaz | Účel | Platnost |
|--------|------|----------|
| Klubový průkaz | Identita člena, role, stav členství | 1 rok, automatická obnova po zaplacení příspěvku (background refresh) |
| Průkaz závodníka | Oprávnění startovat v sezóně | 1 sezóna, automatické prodloužení po 3 závodech (background refresh) |
| Startovní lístek | Účast na konkrétní soutěži | Po dobu soutěže |

### Vydávané státem

| Průkaz | Účel | Kdy se použije |
|--------|------|----------------|
| PID (EU Digital Identity) | Identifikace občana | Registrace závodníka, ověření totožnosti |
| Zbrojní oprávnění | Oprávnění držet a používat zbraň | Povinné pro registraci závodníka |
| Průkaz zbraně / povolení | Konkrétní zbraň nebo kategorie | Volitelné dle pravidel soutěže |

## Matice role × interakce

| Interakce | Řadový člen | Výbor / předseda | Správce | Rozhodčí | Závodník |
|-----------|:-----------:|:----------------:|:-------:|:--------:|:--------:|
| Žádost o členství | ✓ | schvaluje | | | |
| Přihlášení do aplikace | ✓ | ✓ | ✓ | ✓ | ✓ |
| Přístup zázemí | | | ✓ | | |
| Přístup střeliště | ✓* | ✓* | ✓* | | ✓** |
| Registrace na závod | | | | | ✓ |
| Ověření na závodě | | | | ✓ | předkládá |

\* s platným klubovým průkazem  
\** navíc se startovním lístkem pro danou soutěž

## Stav členství

Klubový průkaz nese atribut **stav členství**:

- `aktivní` — platné po zaplacení příspěvku
- `ke obnově` — blíží se konec období
- `ukončené` — člen ukončil členství
- `vyloučený` — rozhodnutí výboru, průkaz zneplatněn (revokace)

Změny stavu se promítnou do peněženky aktualizací nebo odvoláním průkazu — viz scénáře v sekci Členství.
