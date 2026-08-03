---
title: "Přístup na střeliště"
description: "Zámek střeliště akceptuje klubový průkaz nebo startovní lístek závodníka."
series: strelecky-klub
order: 51
category: pristup
roles: ["Řadový člen", "Závodník", "Správce střelnice"]
deepenLinks:
  - label: "ARF 3.0 — proximity a OID4VP fallback"
    url: "https://eudi.dev/latest/"
  - label: "OID4VP — záložní režim (QR)"
    url: "https://openid.net/specs/openid-4-verifiable-presentations-1_0.html"
prev: pristup-spravce-zazemi
next: statni-doklady-pid-zbrojak
---

Elektronické zámky **střeliště** mají odlišná pravidla od zámků zázemí. Přístup mají:

- **všichni členové klubu** s platným klubovým průkazem
- **závodníci** s platným startovním lístkem pro probíhající soutěž
- **správci střelnice** (navíc mají přístup do zázemí — viz předchozí scénář)

## User journey — člen klubu

1. Přistoupí k zámku střeliště
2. Přiloží telefon k NFC čtečce (nebo naváže BLE spojení)
3. V peněžence potvrdí proximity prezentaci (ISO/IEC 18013-5)
4. Zámek ověří `status: aktivní` a platnost
5. Dveře se otevřou

## User journey — závodník (mimo pravidelný provoz)

1. Přistoupí k zámku v den soutěže
2. Přiloží telefon k NFC čtečce (primární kanál) nebo naskenuje QR při selhání proximity
3. Prezentuje **startovní lístek** (+ volitelně průkaz závodníka)
3. Zámek ověří:
   - `competition_id` odpovídá aktuální akci NEBO obecný provozní režim
   - `valid_from` ≤ nyní ≤ `valid_until`
   - `status: platný`
4. Dveře se otevřou

## Logika zámku — hybridní prezentace s alternativou

Zámek střeliště primárně používá **ISO/IEC 18013-5** (NFC/BLE); při selhání proximity nabídne **QR fallback** ve vzdáleném [[OID4VP]] režimu. V obou případech akceptuje **jeden z dvou** typů průkazů:

| Typ | Podmínka | Typický kontext |
|-----|----------|-----------------|
| `ClubMembership` | aktivní členství | pravidelný trénink |
| `CompetitionEntry` | platný lístek pro dnešní závod | soutěžní den |

Peněženka závodníka, který je i členem, může nabídnout oba — zámek vybere vhodný. Stejná logika platí v obou režimech (proximity i QR fallback).

## Kanály zámku

| Priorita | Kanál | Protokol |
|----------|-------|----------|
| 1 | NFC / BLE | ISO/IEC 18013-5 |
| 2 | QR na displeji | [[OID4VP]] (záloha) |

## User journey — závodník-člen (oba průkazy)

Závodník, který je současně členem klubu:

- v běžný den použije klubový průkaz
- v den soutěže může použít startovní lístek (granulárnější audit)
- oba průkazy jsou v peněžence vedle sebe

## Odmítnutí přístupu

| Situace | Komu |
|---------|------|
| Nezaplacený příspěvek | člen — expirovaný průkaz |
| Bez startovního lístku v den závodu | hostující závodník |
| Vyloučený člen | revokovaný průkaz |
| Soutěž skončila | expirovaný lístek |

## Rozdíl oproti zámku zázemí

| | Zázemí | Střeliště |
|---|--------|-----------|
| Klubový průkaz (řadový člen) | ✗ | ✓ |
| Klubový průkaz (správce) | ✓ | ✓ |
| Startovní lístek | ✗ | ✓ |
| Ověření role | `správce střelnice` | členství nebo lístek |
