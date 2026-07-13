---
title: "Žádost o členství"
description: "Jak zájemce požádá o členství a co se děje v peněžence."
series: strelecky-klub
order: 20
category: clenstvi
roles: ["Zájemce", "Řadový člen"]
deepenLinks:
  - label: "OID4VCI — Credential Offer"
    url: "https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-credential-offer"
prev: typy-atributu-prukazu
next: schvaleni-a-vydani-clenstvi
---

Zájemce o členství v klubu podává žádost přes web klubu. Průkaz do peněženky zatím nedostane — nejdřív musí projít schválením výborem.

## User journey — zájemce

1. **Navštíví web klubu** a vyplní registrační formulář (kontakt, osobní údaje, souhlas se statutem)
2. Systém vytvoří záznam ve stavu `čeká na schválení`
3. Zájemce obdrží e-mail s potvrzením přijetí žádosti
4. Po schválení výborem (viz další scénář) dostane **nabídku průkazu** (credential offer) do peněženky
5. V peněžence potvrdí přijetí → **klubový průkaz** se uloží

## Co se v peněžence zatím neděje

Dokud výbor neschválí, peněženka žádný průkaz neobsahuje. Klub může volitelně požádat o **prezentaci PID** už při podání žádosti pro ověření totožnosti — to závisí na politice klubu.

## Volitelné ověření totožnosti při žádosti

Pokud klub vyžaduje PID už při registraci:

1. Web klubu zahájí **OID4VP** transakci
2. Zájemce v peněžence vybere **PID** a sdílí požadované atributy (jméno, datum narození)
3. Klub porovná údaje s formulářem a uloží referenci do žádosti

> Tento krok není povinný v základním průběhu — klub může totožnost ověřit až při první návštěvě osobně.

## Výstup scénáře

| Stav | Kdo | Výsledek |
|------|-----|----------|
| Žádost podána | Zájemce | Záznam v členské databázi |
| Čeká na schválení | Výbor | Notifikace ve webové aplikaci |
| Schváleno | Výbor | Přechod na scénář Schválení a vydání |

## UX principy

- Jasná informace, že průkaz přijde **až po schválení**
- Notifikace v peněžence při nabídce průkazu (push / deeplink)
- Srozumitelný popis, jaké údaje průkaz bude obsahovat
