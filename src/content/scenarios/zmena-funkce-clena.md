---
title: "Změna role člena"
description: "Povýšení do výboru, jmenování správce střelnice nebo rozhodčího."
series: strelecky-klub
order: 23
category: clenstvi
roles: ["Člen výboru", "Předseda výboru", "Správce střelnice", "Rozhodčí"]
deepenLinks:
  - label: "OID4VCI — Credential Re-issuance"
    url: "https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html"
prev: obnova-a-ukonceni-clenstvi
next: prihlaseni-klubove-aplikace
---

Role člena se mohou v průběhu roku měnit — například zvolení do výboru, jmenování správcem střelnice nebo určení rozhodčím.

## Typické situace

| Událost | Změna atributů |
|---------|----------------|
| Volby do výboru | `membership_level` → `člen výboru` |
| Zvolení předsedou | `membership_level` → `předseda výboru` |
| Jmenování správcem | `roles` += `správce střelnice` |
| Určení rozhodčím | `roles` += `rozhodčí` |
| Konec funkce | odebrání příslušné role |

## User journey — výbor

1. Na členské schůzi se rozhodne o změně funkcí
2. Předseda (nebo dva členové výboru) zadá změnu v klubové aplikaci
3. Systém připraví aktualizovaný průkaz
4. Člen obdrží nabídku nového průkazu v peněžence
5. Po přijetí má aktualizované role — zámky a aplikace je uznají

## User journey — člen

1. Notifikace: „Váš klubový průkaz byl aktualizován"
2. V peněžence porovná starý a nový průkaz (nové role zvýrazněny)
3. Potvrdí přijetí
4. Starý průkaz se revokuje

## Dopad na přístupová práva

| Role | Okamžitý dopad po aktualizaci |
|------|------------------------------|
| Správce střelnice | Zámek zázemí začne průkaz akceptovat |
| Rozhodčí | Aplikace pro rozhodčí povolí přístup |
| Člen výboru | Schvalovací workflow se zpřístupní |

Změny jsou účinné od okamžiku přijetí nového průkazu v peněžence — ověřovatelé kontrolují aktuální stav přes status list nebo online validaci.

## Schvalování změn

Stejné pravidlo jako při přijetí člena: schvalují **dva členové výboru** nebo **předseda** (samostatně nebo s jedním členem).
