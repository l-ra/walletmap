---
title: "Nastavení ekosystému klubu"
description: "Co musí klub zajistit, aby mohl vydávat a ověřovat průkazy v EUDIW."
series: strelecky-klub
order: 10
category: system
roles: ["Klub (vydavatel)", "Klub (ověřovatel)"]
deepenLinks:
  - label: "Prohloubení — vydavatel"
    url: "/scenare/strelecky-klub/issuer-prohloubeni-vydavani"
  - label: "Prohloubení — RP a verifier"
    url: "/scenare/strelecky-klub/rp-certifikaty-a-verifier"
prev: zalohovani-a-obnova-penazenky
next: registrace-vydavatele
---

Než klub vydá první členský průkaz, musí se zapojit do ekosystému EUDIW ve dvou rolích: **vydavatel (EAA Provider)** a **spolehlivá strana (Relying Party)**. Obě registrace probíhají u **národního registrátora** v členském státě, kde je klub založen.

## Dvě registrace — jeden subjekt

Střelecký klub je jedna právnická osoba, ale v EUDIW registruje **dvě oddělené role**:

| Role v EUDIW | Entitlement URI | Co klub dělá |
|--------------|-----------------|--------------|
| **EAA Provider** (nevázaný) | `…/Entitlement/Non_Q_EAA_Provider` | Vydává klubové průkazy, průkazy závodníků, startovní lístky |
| **Service Provider** (RP) | `…/Entitlement/Service_Provider` | Ověřuje průkazy v aplikaci, na zámcích, u rozhodčích |

Registrace lze podat **jedním registračním záznamem** s oběma entitlements a příslušnými daty (`providesAttestations` + `intendedUse`).

## Kroky v tomto modelu

### 1. Registrace vydavatele

Klub zaregistruje typy průkazů, které bude vydávat, a získá **access certificate** pro issuer instanci. Publikuje **Credential Issuer Metadata** podepsaná access certifikátem.

→ Podrobně: [Registrace vydavatele](/scenare/strelecky-klub/registrace-vydavatele)

### 2. Registrace Relying Party

Klub zaregistruje **každé zamýšlené použití prezentace** (intended use) zvlášť — přihlášení do aplikace, ověření u zámků, registrace závodníka atd. Pro každé použití definuje požadované atestace a claims.

→ Podrobně: [Registrace RP a použití prezentací](/scenare/strelecky-klub/registrace-rp)

### 3. Certifikáty a metadata

Po registraci klub obdrží:

- **Access certificate (WRPAC / issuer access cert)** — X.509 pro každou technickou instanci; RP profil dle **ETSI TS 119 411-8**
- **Registration certificate (WRPRC)** — podepsaný JWT/CWT dle **ETSI TS 119 475** (volitelně dle politiky státu)
- **Registry URI** — peněženka ověřuje registraci proti národnímu registru (TS5 API)

### 4. Nasazení služeb

| Služba | Protokol | Endpoint |
|--------|----------|----------|
| Issuer | OID4VCI | `/.well-known/openid-credential-issuer` |
| Klubová aplikace (RP) | OID4VP | presentation request |
| Zámky / terminál rozhodčího (RP Instance) | OID4VP | proximity nebo remote |

### 5. Ověření peněženkou

Před interakcí peněženka:

1. ověří **access certificate** vydavatele / RP vůči LoTE
2. zkontroluje **registration certificate** nebo dotaz na registr (TS5)
3. u RP porovná požadované claims s registrovaným **intended use**
4. u vydavatele ověří `providesAttestations` a `entitlement`

## Mapa zamýšlených použití prezentace

| ID | Systém | Scénář |
|----|--------|--------|
| `iu-klub-app` | Klubová aplikace | [Přihlášení](/scenare/strelecky-klub/prihlaseni-klubove-aplikace) |
| `iu-reg-zavodnik` | Web registrace | [Registrace závodníka](/scenare/strelecky-klub/registrace-zavodnika) |
| `iu-zamek-zazemi` | Zámek zázemí | [Přístup správce](/scenare/strelecky-klub/pristup-spravce-zazemi) |
| `iu-zamek-streliste` | Zámek střeliště | [Přístup střeliště](/scenare/strelecky-klub/pristup-streliste) |
| `iu-rozhodci` | Terminál rozhodčího | [Ověření rozhodčím](/scenare/strelecky-klub/rozhodci-overeni-zavodnika) |

Struktury registrace každého použití jsou v článku [Registrace RP](/scenare/strelecky-klub/registrace-rp).

## User journey — administrátor klubu

1. Připraví registrační data (IČO/EUID, popis služeb, privacy policy, intended uses)
2. Podá registraci u českého registrátora EUDIW
3. Obdrží access certifikáty pro issuer a RP instance
4. Nasadí issuer metadata a OID4VP konfigurace
5. Otestuje v pilotní peněžence vydání i ověření
6. Spustí provoz pro členy

> **Poznámka:** Provozní detaily (HSM, Kubernetes) zůstávají mimo rozsah — viz budoucí články o infrastruktuře.
