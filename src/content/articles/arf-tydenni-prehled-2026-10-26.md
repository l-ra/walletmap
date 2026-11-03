---
title: "Týdenní EUDI Wallet přehled — 26. října–2. listopadu 2026"
description: "TS5 errata, oddělení trustu registračních certifikátů, JAR encryption, issuer hardening a další změny EUDI Wallet za poslední týden."
pubDate: 2026-11-02
tags: ["EUDI Wallet", "ARF", "OpenID4VP", "OpenID4VCI", "trust", "WRPRC"]
---

Týden 26. října až 2. listopadu přinesl jednu věcnou změnu v publikovaných technických specifikacích a několik důležitých oprav referenčních implementací. Největší praktický dopad má oddělení trustu registračních certifikátů od reader authentication trustu v Android Wallet Core. Současně se zpřesňuje JAR encryption, zpracování issuer-controlled dat a práce s registračními certifikáty.

## Sloučené změny

### TS5: publikována errata k registračnímu datovému modelu

V repozitáři Standards & Technical Specifications byl 27. října sloučen [PR #661](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/pull/661), který publikuje změny připravené jako TS5 EE comments errata. Součástí je aktualizovaný common RP data model a nový OpenAPI 3.1 popis Registrar API v1.6.

Pro implementátory [[WRPRC]]/registrátorů je důležité zejména to, že OpenAPI model explicitně popisuje `trustAuthorities` pro poskytované attestace, `Claim.path` kompatibilní s [[OpenID4VP]] claims path pointerem a strukturu služeb, intended uses, entitlements a intermediaries. Nejde tedy jen o redakční změnu dokumentace; implementace registračních API by měly model znovu porovnat se svou serializací a validací.

### Android Wallet Core: registrační certifikáty dostávají vlastní trust boundary

[PR #454](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/454), sloučený 27. října, opravuje několik závažných trust problémů kolem registračních certifikátů. Status-list signer [[WRPRC]] se bez ETSI trustu dříve kontroloval pouze proti klíči z vlastního `x5c`; nově se jeho chain vždy ověřuje proti trustu nakonfigurovanému pro registrační certifikáty. Současně se [[WRPRC]] už nesmí validovat proti reader-authentication trustu.

Nové `configureWrpRegistrationTrust` a `configureIssuerRegistrationTrust` oddělují CA pro registrační certifikáty a případně i pro jejich status listy. Pokud je registrační policy zapnutá a není k dispozici ani tento trust, ani ETSI trust, konfigurace walletu skončí chybou. Defaultní revocation policy nových konfigurací je `HardFail`.

Praktický dopad je zásadní: access certificate CA, registrar CA a status-list signer CA je potřeba modelovat jako oddělené trust domény. Deploymenty se statickými anchory by měly registrar CA odstranit z reader trustu a přesunout ji do explicitního registration trustu.

### Android Wallet Core: limit hloubky issuer-controlled dat

[PR #459](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/459), sloučený 29. října, zavádí maximální hloubku 64 úrovní při převodu CBOR/JSON issuer dat do claims. Před opravou mohl hluboce vnořený credential způsobovat `StackOverflowError` při každém pozdějším čtení. Wallet nyní takový credential odmítne už při ukládání.

Změna současně dělá robustnější registraci do Digital Credential API: vadný dokument se přeskočí a nové registrace se sestaví před vymazáním starých, takže chyba jednoho credentialu neshodí registraci ostatních dokumentů.

### JAR encryption: další zpřísnění algoritmů a key agreement

V iOS [[OpenID4VP]] byl sloučen [PR #267](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vp-swift/pull/267). Pro JAR encryption už wallet nepublikuje RSA-OAEP-256, ale pouze ECDH-ES a ECDH-ES+A256KW; zároveň se zpřesňuje validace algoritmů a křivek při dešifrování Request Objectu.

Android Wallet Core [#450](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/450) opravuje podporu `ECDH-ES+A256KW`: wallet nově generuje ephemeral EC key pro key agreement namísto pokusu použít signing key. Implementace by proto měly striktně oddělit signing keys od key-agreement keys a nepředpokládat, že stejný klíčový materiál je vhodný pro oba účely.

### iOS Wallet Kit: robustnější zpracování serializovaných WRPRC

[PR #525](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/525), sloučený 29. října, refaktoruje dekódování [[WRPRC]] a přidává testy pro serializované registrační certifikáty. Jde především o interoperabilní hardening, ale v kombinaci s androidovou změnou #454 potvrzuje, že registration-certificate cesta je nyní samostatnou a aktivně zpřesňovanou částí trust stacku.

## Otevřené návrhy

### Trust Validator: oddělení LoTE downloadu od trust-anchor injection

Otevřený [PR #94](https://github.com/eu-digital-identity-wallet/eudi-srv-web-trust-validator-py/pull/94) navrhuje rozdělit stažení [[LoTE]] a aktualizaci trust anchorů. To je architektonicky správný směr: transport, kryptografická validace seznamu a změna aktivního trust store jsou tři různé operace a neměly by být skryté v jednom kroku.

### Trust Validator: signed responses a klientská autentizace

Otevřený [PR #95](https://github.com/eu-digital-identity-wallet/eudi-srv-web-trust-validator-py/pull/95) rozpracovává podepisování odpovědí a autentizaci klientů. Pro integrátory je relevantní zejména oddělení transportního TLS od aplikační integrity odpovědi trust služby; dokud není PR sloučen, nejde ale o stabilní kontrakt.

### TS5: paralelní unsigned JSON response zůstává otevřená

[PR #659](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/pull/659) zůstává otevřený. Navrhuje, aby klient mohl přes `Accept` vyžádat vedle podepsané reprezentace i čitelnou plain JSON odpověď. Produkční systémy by unsigned variantu nemusely podporovat. Dokud návrh není sloučen, nelze na tuto variantu stavět interoperabilitu.

## Dopad na implementátory

Nejdůležitější doporučení týdne je zkontrolovat **trust-domain separation**. Reader authentication, [[WRPRC]], issuer registration a status-list signing nejsou jedna PKI role a neměly by automaticky sdílet stejné trust anchory. Zejména fallback „když nemám registration trust, použiji reader trust“ je nyní v referenčním Android stacku odstraněn.

Druhé téma je práce s nedůvěryhodným vstupem ještě před kryptografickým rozhodnutím. Hloubka CBOR/JSON struktur, JAR algoritmy, křivky a typ klíče jsou součástí security boundary stejně jako samotné ověření podpisu. Wallet by měla limity a algoritmovou policy aplikovat předtím, než data vstoupí do dlouhodobého úložiště nebo dalších subsystémů.

A konečně TS5 errata stojí za kontrolu u každého, kdo už implementuje registrační API. Aktualizovaný model v1.6 explicitněji propojuje registraci RP, poskytované attestace, trust authorities a [[OpenID4VP]] claim paths; vlastní datový model by měl být proti této verzi znovu diffnut.