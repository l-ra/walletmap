---
title: "Státní doklady — PID a zbrojní průkazy"
description: "Jak klub jako ověřovatel pracuje s doklady vydanými státem v peněžence."
series: strelecky-klub
order: 60
category: overovani
roles: ["Závodník", "Klub (ověřovatel)", "Stát (vydavatel)"]
deepenLinks:
  - label: "eIDAS 2.0 — nařízení"
    url: "https://eur-lex.europa.eu/legal-content/CS/TXT/?uri=CELEX%3A32024R1183"
  - label: "EUDI ARF — Rulebook for PID"
    url: "https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework"
  - label: "OID4VP — Verifier Metadata"
    url: "https://openid.net/specs/openid-4-verifiable-presentations-1_0.html"
prev: pristup-streliste
---

Stát vydává do peněženky doklady, které klub **nevyužívá jako vydavatel**, ale jako **ověřovatel** při registraci závodníka. Jde o tři typy dokladů relevantní pro tento model.

## Doklady od státu

| Doklad | Účel v klubu | Povinnost |
|--------|--------------|:---------:|
| **PID** (EU Digital Identity) | Ověření totožnosti závodníka | doporučeno |
| **Zbrojní oprávnění** | Právní způsobilost k držení zbraně | povinné |
| **Průkaz zbraně / povolení** | Konkrétní zbraň závodníka | volitelné |

## User journey — závodník (držitel)

1. Stát nabídne PID a zbrojní doklady do peněženky (mimo kompetenci klubu)
2. Závodník je uloží vedle klubových průkazů
3. Při registraci u klubu **selektivně sdílí** jen požadované atributy
4. Peněženka zobrazuje, kdo a kdy doklad viděl (audit pro držitele)

## User journey — klub (ověřovatel)

1. Připraví **presentation definition** pro každý státní doklad
2. V žádosti specifikuje přesný seznam atributů (data minimization)
3. Ověří:
   - kryptografický podpis **státního vydavatele** (trust chain EUDIW)
   - platnost dokladu (datum, status)
   - úroveň záruky (LoA) dle politiky klubu
4. Uloží výsledek ověření — **neukládá celý doklad**, pokud to není nutné
5. Vydá vlastní průkaz závodníka s atributem `gun_license_verified: true`

## PID — co klub typicky žádá

- `given_name`, `family_name`
- `birth_date`
- volitelně: `nationality`

Klub **nežádá** o rodné číslo, adresu ani biometrii, pokud to není zákonně nutné.

## Zbrojní oprávnění — co klub typicky žádá

- číslo průkazu / licence
- datum platnosti
- kategorie / skupiny zbraní
- stav (platný / odebraný)

## Průkaz zbraně — kdy a proč

Klub může při soutěži požadovat průkaz konkrétní zbraně pro:

- ověření, že závodník smí použít danou zbraň na střelnici
- kontrolu souladu s kategorií soutěže

Závodník sdílí atributy zbraně (typ, výrobní číslo, platnost) — ne celý doklad.

## Důvěryhodnost a eIDAS 2.0

Ověřovatel spoléhá na:

- **trust list** národního ekosystému EUDIW
- certifikáty vydavatele (stát = Qualified Trust Service Provider)
- formát **SD-JWT VC** s selektivním sdílením

## Oddělení rolí — shrnutí

| Role klubu | Státní doklady |
|------------|----------------|
| Vydavatel | ✗ — klub nevydává PID ani zbrojní průkazy |
| Ověřovatel | ✓ — klub ověřuje při registraci závodníka |
| Držitel | částečně — členové klubu jsou držiteli státních dokladů jako občané |

Tento scénář je základ pro všechny interakce, kde klub potřebuje důvěryhodně ověřit údaje od státu — zejména v [Registraci závodníka](/scenare/strelecky-klub/registrace-zavodnika).
