---
title: "Týdenní EUDI Wallet přehled — 31. srpna – 7. září 2026"
description: "Bez nových ARF/TS revizí; fail-closed reader authentication pro remote OpenID4VP, RFC 9207 iss proti mix-up v OpenID4VCI, reálné WRPRC ve WRP Registration Service a hardening SD-JWT."
pubDate: 2026-09-07
tags: [arf, tydenni-prehled, wrprc, wrpac, oid4vp, oid4vci, sd-jwt]
draft: false
---

Tento týden byl **bez nové věcné revize ARF nebo TS1–TSn**. V repozitářích ARF a `eudi-doc-standards-and-technical-specifications` jsem nenašel sloučenou změnu, která by měnila normativní baseline. Přesto je týden poměrně významný: referenční implementace zpřesňují **trust enforcement [[OID4VP]]**, ochranu [[OID4VCI]] proti **Authorization Server mix-up**, skutečné používání [[WRPRC]] v registrační službě a několik bezpečnostních detailů SD-JWT.

### Sloučené změny

**1. Android Wallet Core: výrazné zpřísnění reader/verifier authentication.**
[PR #409](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/409) sjednocuje konfiguraci do nového `configureReaderAuthentication { ... }` a současně opravuje důležitější problém: reader authentication se nově vynucuje nejen při proximity, ale také při **remote [[OID4VP]]/DCQL presentations**. Součástí je explicitně popsaná oprava fail-open chyby v `OpenId4VpReaderTrustImpl.isTrusted()` z logiky `!= false` na `== true`. Pokud trust store není k dispozici, výsledek je nyní nedůvěryhodný, nikoli implicitně důvěryhodný.

Zároveň se trust source a enforcement policy nedají konfigurovat nezávisle tak snadno jako dříve. `enforceIfPresent()` a `alwaysRequire()` vyžadují trust source; bez něj konfigurace skončí už při buildu. Pokud chcete reader authentication vědomě nevynucovat, musíte použít explicitní `doNotEnforce()`. ETSI [[LoTE]] nakonfigurovaná přes `configureEtsiTrust` se do reader authentication automaticky propíše.

Tohle považuji za **nejvýznamnější trust-model změnu týdne**. Doporučená architektura je teď velmi jasná:

```text
ETSI LoTE / static trust source
          ↓
WRPAC / reader certificate validation
          ↓
ReaderAuthPolicy
          ↓
OpenID4VP / DCQL / DC API / proximity
          ↓
disclosure allowed / rejected
```

Pro vlastní implementaci bych zejména zkontroloval, zda remote [[OID4VP]] dnes opravdu používá stejný trust policy engine jako proximity. Starší implementace založená na tomto Wallet Core to dělat nemusela.

---

**2. OpenID4VCI JVM: implementace RFC 9207 `iss` proti mix-up útoku.**
[PR #600](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-openid4vci-kt/pull/600) přidává kontrolu `iss` parametru Authorization Response podle RFC 9207. Nová konfigurace má režimy:

```text
Never
IfSupported
Required
```

Při `Required` musí Authorization Server deklarovat `authorization_response_iss_parameter_supported=true`; wallet následně kontroluje, že `iss` z redirectu odpovídá očekávanému AS. Přibyly konkrétní chyby `InvalidAuthorizationIssuer`, `MissingAuthorizationResponseIssuer` a `AuthorizationResponseIssuerParamNotSupported`.

Důležitý detail: **default je `Never`**. Samotný upgrade knihovny tedy ochranu automaticky nezapne. Implementátor musí nastavit `IfSupported` nebo `Required` a zároveň předat `iss` z authorization response do `authorizeWithAuthorizationCode()`.

Pro produkční [[EUDIW]] bych minimálně `IfSupported` zapnul. Je to přímá ochrana proti situaci, kdy wallet komunikuje s více Authorization Servery a authorization response je zaměněna mezi nimi.

---

**3. OpenID4VCI: wallet už deklaruje, které granty skutečně podporuje.**
[PR #578](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-openid4vci-kt/pull/578) přidává:

```kotlin
SupportedGrants.AuthorizationCode
SupportedGrants.PreAuthorizedCode
SupportedGrants.Both
```

Credential Offer, který neobsahuje žádný grant podporovaný walletem, je odmítnut jako `UnsupportedGrants`. `redirect_uri` je nově povinné pouze tehdy, když wallet podporuje Authorization Code Grant.

To je dobré zpřesnění capability modelu. Wallet by neměl svou podporu protokolových variant odvozovat až z konkrétního execution path; měla by být součástí jeho explicitní konfigurace. Minulý týden byl tento PR ještě otevřený; nyní je sloučen.

---

**4. Swift OpenID4VCI definitivně volí konzervativní řešení dvou Authorization Serverů.**
Minulý týden jsme sledovali problém Credential Offeru:

```text
authorization_code  → AS-A
pre-authorized_code → AS-B
```

[Swift PR #317](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/317) byl **1. září sloučen**. Pokud oba granty explicitně ukazují na různé Authorization Servery, offer se nyní odmítne jako `invalidGrants`, protože knihovna momentálně resolvuje metadata pouze prvního AS a jinak by mohla požadavek odeslat na nesprávný token endpoint.

Tím se Swift srovnal s JVM implementací z předchozího týdne. Dřívější návrh na plnohodnotnou per-grant podporu zatím nevyhrál; reference stack má nyní prakticky pravidlo:

```text
Both grants + stejný AS     → OK
Both grants + různé AS      → reject
```

Interní datový model bych přesto navrhoval per-grant. Omezení je podle popisu PR vlastnost současného resolveru, nikoli obecný protokolový princip.

---

**5. WRP Registration Service v2.2: WRPRC už je reálnou součástí referenčního registračního workflow.**
[PR #31](https://github.com/eu-digital-identity-wallet/eudi-srv-web-relyingparty-registration-py/pull/31) posouvá registrační službu výrazně dál od původního modelu založeného hlavně na [[WRPAC]]. Dokumentace nyní explicitně uvádí, že výsledkem registrace jsou **[[WRPAC]] i [[WRPRC]]**; [[WRPAC]] slouží k autentizaci instance [[RP]], zatímco [[WRPRC]] poskytuje walletu intended use a attribute-access policy. Implementace se deklaruje jako sladěná s [[CIR]] 2025/848, TS5, TS6, ETSI TS 119 411-8 a ETSI TS 119 475.

Významná je také integrace se **Status List Service**. Podle nové dokumentace musí [[WRPRC]] podle ETSI TS 119 475 obsahovat referenci na status list a pozici daného [[WRPRC]] v něm; referenční Registrar proto integruje `eudi-srv-statuslist-py`.

To potvrzuje architekturu:

```text
Registrar
   ├── registration data
   ├── WRPAC
   ├── WRPRC
   │     └── status-list reference + index
   └── Status List Service
```

Revokaci/status [[WRPRC]] bych tedy určitě nepovažoval za doplněk, který lze implementovat později.

---

**6. Verifier Endpoint: oprava nebezpečně zavádějící konfigurace Trust Validatoru.**
[PR #609](https://github.com/eu-digital-identity-wallet/eudi-srv-verifier-endpoint/pull/609), sloučený **1. září**, opravuje konfigurační klíč v develop profilu. Příklad používal:

```properties
verifier.trust.service-url=...
```

ale Spring ve skutečnosti očekává:

```properties
verifier.trust-validator.service-url=...
```

Důsledek byl nepříjemný: administrátor mohl mít dojem, že Trust Validator nakonfiguroval, ale aplikace skončila ve větvi:

```text
Trust Validator Service has not been configured.
Trusting all Attestation Issuers.
```

Je to jen oprava develop profilu, ne chyba samotného trust-validation algoritmu. Přesto bych v produkční konfiguraci doporučil startup check typu **„trust validator required, jinak start fail“** namísto fail-open režimu.

---

**7. SD-JWT: `cnf.jwk` už nemůže omylem obsahovat privátní parametry.**
[JVM SD-JWT PR #504](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-sdjwt-kt/pull/504) mění konstrukci `cnf` z vložení celého dodaného JWK na:

```kotlin
jwk.toPublicJWK()
```

tedy explicitně pouze public parameters.

Je to malá změna kódu s velmi správným security významem: API už nespoléhá na to, že caller určitě předá public-only JWK. V témže repozitáři proběhla tento týden širší sada hardening změn kolem reserved claim names, parseru [[JWS]] JSON, limitování rekurzivního Type Metadata resolution a omezení možnosti disclosure leakage přes `toString()`.

### Otevřené návrhy

Nejzajímavější je tentokrát **trojice draftů pro iOS OpenID4VP**, která podle popisu opravuje několik poměrně zásadních nedostatků autentizace [[Verifier|verifieru]].

[PR #218](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vp-swift/pull/218) odstraňuje fallback na „první nakonfigurovaný“ `client_id` scheme. Pokud například wallet dostane scheme, který není nakonfigurován, musí **fail closed** místo pokusu použít jiný podporovaný mechanismus.

[PR #219](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vp-swift/pull/219) jde dál a váže response destination na autentizovanou identitu [[Verifier|verifieru]]. Pro `x509_san_dns` kontroluje DNS SAN certifikátu a vazbu hostu `response_uri`; pro `verifier_attestation` kontroluje URI proti `response_uris`/`redirect_uris` v attestaci; u `redirect_uri` scheme má `client_id` přímo odpovídat cílovému URI.

[PR #220](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vp-swift/pull/220) pak navrhuje přijímat **unsigned authorization request pouze pro `redirect_uri` client-id scheme**. Ostatní mechanismy mají vyžadovat podepsaný JAR.

Tyto PR jsou stále **draft**, takže ještě nejde o baseline. Pokud ale projdou, jsou security-relevant a stojí za backport nebo alespoň vlastní audit současného iOS flow.

Druhý otevřený návrh, který bych sledoval, je [WRPRC signing profile #15](https://github.com/eu-digital-identity-wallet/eudi-srv-web-walletdriven-signer-external-sca-java/pull/15). Současný obecný JAdES výstup podle autora není přímo konzumovatelný jako [[WRPRC]] v testované Nimbus cestě. Návrh proto přidává profil, který vytvoří compact JAdES/[[JWS]] s:

```text
typ = rc-wrp+jwt
iat
x5c
```

a odstraní konfliktní kritický `sigT`. Autoři explicitně upozorňují, že to pouze vytváří správný envelope; **nevaliduje [[WRPRC]] claims ani nezakládá trust**.

To je pěkné praktické rozlišení, které stojí za zachování i ve vlastní architektuře:

```text
WRPRC serialization/signing
          ≠
WRPRC schema validation
          ≠
WRPRC trust validation
          ≠
WRPRC authorization policy
```

### Co z toho plyne pro implementátory

Za nejdůležitější považuji čtyři věci.

Za prvé, **reader/verifier authentication musí být fail-closed a společná pro remote i proximity presentation.** Remote [[OID4VP]] nesmí mít slabší trust policy než proximity.

Za druhé, u [[OID4VCI]] bych zapnul RFC 9207 `iss` checking — minimálně `IfSupported` — a neponechával nový default `Never`. Samotný upgrade knihovny ochranu nezapne.

Za třetí, Credential Offer se dvěma granty bych interně stále modeloval per-grant, i když reference Android/JVM/Swift stack dnes různé Authorization Servery konzervativně odmítá. Platformní rozdíl z minulého týdne (JVM reject vs. navrhovaný Swift per-grant) se tím prakticky uzavřel ve prospěch konzervativního odmítnutí.

Za čtvrté, [[WRPRC]] bych od začátku implementoval jako **stavový/revokovatelný authorization artefakt**, včetně Status List infrastruktury, nikoli jako statický JWT certifikát. Registrace má vydávat jak [[WRPAC]], tak [[WRPRC]].

Celkový trend posledních týdnů je podle mě už dost zřetelný: **specifikace se tentokrát neposunuly, ale reference implementation zavírá místa, kde „technicky validní request/certificate/token“ ještě neznamenal „request od správně autentizované a autorizované protistrany“.** Trust, identity binding a fail-closed enforcement se postupně přesouvají z implicitních předpokladů do explicitní aplikační logiky.
