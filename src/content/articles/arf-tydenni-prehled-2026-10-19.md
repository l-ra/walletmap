---
title: "Týdenní EUDI Wallet přehled — 19.–26. října 2026"
description: "Android Wallet Core opravuje autentizaci signera LoTE a integritu ukládaných credentialů; iOS Wallet Kit zpřesňuje výběr issuer klíče a metadata cache. Otevřené návrhy řeší chybějící WRPRC, OpenID4VP error dispatch a unsigned odpovědi v technických specifikacích."
pubDate: 2026-10-26
tags: [arf, tydenni-prehled, oid4vp, oid4vci, wrprc, lote, trust, security]
draft: false
---

Týden 19.–26. října nepřinesl novou sloučenou normativní revizi **ARF ani Standards & Technical Specifications**. Nejvýznamnější změny jsou tentokrát v referenčních implementacích: Android Wallet Core uzavírá dvě důležité trust mezery kolem [[LoTE]] a integrity credentialů, iOS Wallet Kit opravuje interoperabilitu [[SD-JWT-VC]] a práci s metadata Authorization Serveru. V technických specifikacích se objevil nový otevřený návrh na volitelnou unsigned reprezentaci odpovědí.

### Sloučené změny

**1. Android Wallet Core nově autentizuje signera [[LoTE]] proti explicitním trust anchorům.**  
[PR #441](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/441), sloučený 20. října, opravuje zásadní bootstrap problém. Vestavěný `LoteJwtVerifier` dříve ověřoval [[JWS]] podpis seznamu klíčem z jeho vlastního `x5c`, ale neověřoval, zda je tento signer vůbec důvěryhodný. Útočníkem podepsaný seznam tak mohl dodat vlastní trust anchory pro issuery, readery, registrační certifikáty nebo status-list signery.

Nově musí konfigurace dodat `loteSignerTrustAnchors()` nebo vlastní `jwtSignatureVerifier()`. Vestavěná cesta kontroluje chain signera vůči připnutým anchorům, časovou platnost certifikátu a teprve potom podpis [[LoTE]]. Praktický dopad je breaking change: samotný kryptograficky validní podpis seznamu už není trust bootstrap.

**2. Android Wallet Core odděluje integritu credentialu od trust policy issueru.**  
[PR #446](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/446), sloučený 21. října, zavádí povinné integrity kontroly ještě před uložením credentialu. U mdoc se ověřuje podpis MSO, digest každého `IssuerSignedItemBytes` proti MSO a shoda `docType`; u [[SD-JWT-VC]] se vždy ověřuje issuer-signed JWT proti certifikátu z `x5c`.

Důležité je, že tyto kontroly jsou nyní nezávislé na trust policy. Režim `INFORM` ani chybějící konfigurace issuer trustu už nesmějí způsobit uložení credentialu s neplatným podpisem. **Integrita artefaktu a důvěra v jeho vydavatele jsou dvě různé podmínky a první z nich nesmí být pouze warning.**

**3. iOS Wallet Kit přijímá standardně validní [[SD-JWT-VC]] bez `kid`, pokud je issuer key jednoznačný.**  
[PR #514](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/514), sloučený 21. října, opravuje příliš striktní výběr podpisového klíče. `kid` je v tomto mechanismu doporučený, nikoli povinný. Pokud chybí, Wallet Kit nyní může vybrat jediný signing key z issuer metadata; při více kandidátech, žádném kandidátu nebo konfliktu s `jwk` request korektně odmítne.

To zlepšuje interoperabilitu bez oslabení bezpečnosti: fallback není „vezmi první klíč“, ale pouze jednoznačný výběr z publikované sady.

**4. iOS Wallet Kit cachuje metadata Authorization Serveru podle URL.**  
[PR #517](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/517), sloučený 25. října, přidává cache Authorization Server metadata pro opakované issuance a deferred flows. Cache je klíčovaná URL, při změně issueru se tedy metadata nemíchají; neúspěšný lookup nezůstává trvale cachovaný a po vyčištění se metadata znovu načtou.

Pro implementátory [[OID4VCI]] je důležité zachovat stejný princip: cache musí být svázána s konkrétní identitou/URL Authorization Serveru a její životní cyklus s issuance kontextem, nikoli sdílená globálně bez klíče.

**5. iOS Wallet Kit dokončuje migraci reader authentication API.**  
[PR #516](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/516), sloučený 22. října, odstraňuje starý boolean `readerCertIssuerValid`. Integrace mají používat strukturovaný `readerAuthenticationStatus`, který rozlišuje autentizační výsledek readeru. Jde o pokračování změn z předchozích týdnů: aplikace nemá redukovat reader authentication na jediný příznak platnosti issuer certifikátu.

### Otevřené návrhy

**Chybějící [[WRPRC]] má být rozhodnutí policy, ne pevná chyba parseru.**  
OpenID4VP Swift [PR #263](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vp-swift/pull/263) navrhuje přesunout případ chybějícího [[WRPRC]] do `RegistrationCertificatePolicy`. Default zůstává fail-closed, ale explicitní policy může request povolit s warningem. Navazující Wallet Kit PR #513 mapuje tento stav na `wrprcVpTrustPolicy`: `.enforce` odmítne, `.warning` může pokračovat s `wrprcMissing` warningem. Návrh je praktický pro testovací a přechodová prostředí, ale produkční profil by měl absenci registračního certifikátu povolit jen vědomým rozhodnutím policy.

**Android Wallet Core chce zpřístupnit konfiguraci [[OID4VP]] error dispatch.**  
[PR #451](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/451) přidává možnost změnit `ErrorDispatchPolicy`. Default zůstává `OnlyAuthenticatedClients`, takže protokolová error response se neposílá neautentizovanému klientovi. Integrátor ale může povolit odpověď i klientovi, jehož autentizace selhala například kvůli špatně nakonfigurovanému [[WRPAC]]. To je užitečné pro interoperabilitu a diagnostiku, ale současně je to privacy/security rozhodnutí: detailní chyby mohou neautentizované protistraně poskytovat informace o validačním procesu.

**Technické specifikace diskutují unsigned reprezentaci odpovědí.**  
Otevřený [STS PR #659](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/pull/659) navrhuje, aby klient mohl přes `Accept` požádat vedle podepsané odpovědi také o plain JSON variantu kvůli čitelnosti a jednoduššímu zpracování. Produkční systémy by ji nemusely podporovat. Dokud není návrh sloučen a přesně vymezen jeho security model, neměl by se interpretovat jako změna současné normativní baseline.

**JVM [[SD-JWT-VC]] validátor chce rozlišit issuance a presentation semantiku `mandatory`.**  
[PR #488](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-sdjwt-kt/pull/488) rozlišuje validaci při issuance a presentation. `mandatory: true` znamená při issuance povinnou přítomnost claimu; při presentation může být mandatory claim legitimně nepřítomný, pokud je selectively disclosable a holder jej neprezentoval. Návrh zároveň mění veřejné API verifieru, takže implementace pracující s Type Metadata by měly sledovat jeho další vývoj.

### ARF, registrace a technické specifikace

V ARF se tento týden neobjevila věcná změna baseline; aktualizovaný PR #768 je pouze oprava duplicitních slov bez změny významu nebo HLR. Referenční registrátor [[RP]] má stále otevřenou preprod větev, ale bez samostatně popsané nové normativní změny registračního modelu.

Jediným novým věcným návrhem v dokumentační vrstvě je STS #659 s unsigned response variantou. Proto tento týden **nemění normativní ARF/TS baseline**.

### Co z toho plyne pro implementátory

Nejdůležitější je tento týden trust bootstrap. [[LoTE]] není důvěryhodný proto, že má validní podpis; důvěryhodný musí být i **signer tohoto seznamu**. Produkční konfigurace proto potřebuje explicitní root-of-trust pro [[LoTE]] signer chain a jasnou revokační policy.

Stejně důležité je oddělit **integritu credentialu od issuer trustu**. Podpis, digesty a interní vazby credentialu musí být validní vždy. Teprve nad tím se vyhodnocuje, zda je issuer důvěryhodný a zda policy dovoluje pokračovat. Režim typu `INFORM` smí změnit rozhodnutí o trustu, nikoli přijmout kryptograficky poškozený credential.

U [[OID4VP]] se naopak dál rozšiřuje policy vrstva: chybějící [[WRPRC]] i způsob odesílání chyb mohou být konfigurovatelné, ale bezpečný default zůstává fail-closed. Implementace by proto měly tyto volby chápat jako explicitní deployment policy, ne jako interoperability fallback.