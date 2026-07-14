---
title: "Schválení a vydání členství"
description: "Workflow výboru a technické vydání klubového průkazu do peněženky."
series: strelecky-klub
order: 21
category: clenstvi
roles: ["Člen výboru", "Předseda výboru", "Klub (vydavatel)"]
deepenLinks:
  - label: "OID4VCI — celá specifikace"
    url: "https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html"
  - label: "EUDI ARF — Topic 27 Revocation"
    url: "https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework"
prev: zadost-o-clenstvi
next: obnova-a-ukonceni-clenstvi
---

Po podání žádosti výbor schválí členství v klubové aplikaci. Teprve pak klub jako **vydavatel** nabídne průkaz do peněženky.

## User journey — člen výboru / předseda

1. Přihlásí se do **klubové aplikace** klubovým průkazem (musí mít roli výboru nebo předsedy)
2. Zobrazí seznam čekajících žádostí
3. Prohlédne údaje zájemce
4. Schválí nebo zamítne žádost

### Pravidlo čtyř očí

Schválení musí provést:

- **předseda výboru** (samostatně), NEBO
- **dva členové výboru**, NEBO
- **předseda + jeden člen výboru**

Aplikace eviduje oba podpisy s časovým razítkem.

## User journey — nový člen (po schválení)

1. Obdrží notifikaci (e-mail + volitelně push do peněženky)
2. Otevře **credential offer** — deeplink nebo QR kód
3. Peněženka zobrazí náhled průkazu (název klubu, platnost, role)
4. Člen potvrdí → průkaz se uloží
5. Může se přihlásit do klubové aplikace

## Technický průběh — vydavatel (Issuer)

```mermaid
flowchart LR
    A["Výbor schválí"] --> B["Aplikace zavolá Issuer API"]
    B --> C["Credential Offer (OID4VCI)"]
    C --> D["Peněženka"]
    D --> E["WIA k Authorization Serveru"]
    E --> F["Token exchange"]
    F --> G["Credential Request s KA + proof"]
    G --> H["Vydání SD-JWT VC"]
    H --> I["Uložení v peněžence"]
```

Detail WIA/KA atestací a jejich role při revokaci peněženky: [Vydávání, metadata a revokace](/scenare/strelecky-klub/issuer-prohloubeni-vydavani#wua-wia-ka).

Klíčové úkoly vydavatele:

1. Sestavit payload průkazu dle schématu `ClubMembership`
2. Podepsat průkaz klubovým certifikátem
3. Zaznamenat vydání do auditu
4. Publikovat případnou aktualizaci status listu

## Zamítnutí žádosti

Pokud výbor zamítne:

- žádný průkaz se nevydává
- zájemce dostane odůvodnění e-mailem
- záznam se archivuje

## Co tento scénář neřeší (odkazy na budoucí články)

- Konkrétní formát credential offer URI
- Správa klíčů a HSM
- Notifikační kanály peněženky dle výrobce
