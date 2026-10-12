---
title: "Týdenní EUDI Wallet přehled — 5.–12. října 2026"
description: "Bez změny ARF/TS baseline; iOS zpřísňuje reader authentication a SD-JWT validaci, issuer reference implementation přidává registrační certifikáty a OpenID4VCI opravuje audience client-attestation PoP."
pubDate: 2026-10-12
tags: [arf, tydenni-prehled, oid4vp, oid4vci, wrprc, security]
draft: false
---

Týden 5.–12. října nepřinesl novou změnu normativní baseline **ARF ani Standards & Technical Specifications**. V obou dokumentačních repozitářích nebyl v tomto období aktualizován žádný pull request. Prakticky významné změny se soustředily do iOS trust/presentation vrstvy, [[OID4VCI]], registračních certifikátů vydavatelů a SD-JWT validace.

### Sloučené změny

**1. iOS Wallet Kit nově skutečně vynucuje reader authentication před prezentací.**  
[PR #500](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/500), sloučený 9. října, odděluje stav reader authentication od informací o issuerovi certifikátu a od warningů registračního certifikátu. X.509 request bez úspěšné trust evaluace je odmítnut a wallet nesmí vytvořit odpověď po neúspěšném nebo neúplném dekódování requestu.

To je důležitá změna trust boundary: přítomnost access certifikátu nebo parsovatelný request nejsou samy o sobě důkazem autentizace [[RP]]. Session musí explicitně nést stav, že reader authentication proběhla úspěšně, a tento stav se nesmí přenést z předchozího requestu.

**2. Issuer reference implementation začíná publikovat registrační certifikát v issuer metadata.**  
[PR #189](https://github.com/eu-digital-identity-wallet/eudi-srv-web-issuing-eudiw-py/pull/189), sloučený 7. října, přidává podporu JWT Registration Certificate. Konfigurace může načíst registrační certifikát ze souboru a Credential Issuer metadata jej následně publikují v `issuer_info` jako objekt s `format: registration_cert` a samotnými daty certifikátu. Navazující frontend [PR #16](https://github.com/eu-digital-identity-wallet/eudi-srv-web-issuing-frontend-eudiw-py/pull/16) registrační certifikát propouští dál.

Pro implementátory je podstatné, že registrační model se netýká jen verifierů. Referenční issuer stack už počítá s tím, že registrační artefakt vydavatele je discoverable přímo z [[OID4VCI]] metadata. To je další krok k oddělení technické autentizace endpointu od registrace role, oprávnění a intended use subjektu.

**3. Swift [[OID4VCI]] opravuje audience client-attestation PoP u pre-authorized flow.**  
[PR #375](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/375), sloučený 8. října, vrací jako audience client-attestation Proof-of-Possession issuer Authorization Serveru v pre-authorized-code token requestu. Jde o opravu regresního chování v bezpečnostně citlivém bindingu client attestation k protistraně.

Prakticky doporučuji auditovat všechny issuance cesty zvlášť: authorization-code a pre-authorized-code flow musí používat stejný trust model, ale audience PoP musí být odvozena od skutečného Authorization Serveru, nikoli od Credential Issuer identifieru nebo jiného sousedního identifikátoru.

**4. iOS Wallet Kit opravuje client ID používané při JWT proof creation.**  
[PR #499](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/499), sloučený 9. října, používá při inicializaci bezpečnostního klíče resolved client ID z aktivní issuer konfigurace místo Credential Issuer Identifieru. Je to další oprava stejné třídy problémů: v [[OID4VCI]] nelze zaměňovat identitu Credential Issueru, Authorization Serveru a OAuth klienta walletu.

**5. Swift SD-JWT verifier zpřísňuje `typ` a disclosure policy.**  
[PR #186](https://github.com/eu-digital-identity-wallet/eudi-lib-sdjwt-swift/pull/186), sloučený 5. října, vyžaduje po úspěšném ověření podpisu validní `typ`. Defaultně je povolen pouze `dc+sd-jwt`; starší `vc+sd-jwt`, obecné `JWT` nebo chybějící `typ` jsou odmítnuty, pokud je implementátor explicitně nepřidá do allow-listu.

[PR #183](https://github.com/eu-digital-identity-wallet/eudi-lib-sdjwt-swift/pull/183) současně vynucuje `sd: always` a `sd: never` z type metadata a zakazuje selective disclosure registrovaných JWT claimů podle kořene claim path. To je důležité zejména u vnořených struktur a wildcard metadata cest: validační policy se nesmí redukovat na prosté porovnání názvu leaf claimu.

**6. iOS umožňuje konfigurovat algoritmus device signature pro mdoc.**  
Wallet Kit [PR #497](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/497) propisuje konfigurovatelný `deviceAlgorithm` do BLE i [[OID4VP]] mdoc podpisů; výchozí zůstává ES256. Není to jen dependency bump — algoritmus se nově skutečně přenáší do obou presentation cest. Implementace, které mají policy omezení na konkrétní algoritmy nebo používají jiné WSCD capability, tím získávají potřebný konfigurační bod.

**7. Android demo opravuje routing authorization callbacku mezi více issuery.**  
[PR #727](https://github.com/eu-digital-identity-wallet/eudi-app-android-wallet-ui/pull/727), sloučený 9. října, řeší stav, kdy opuštěný authorization flow jednoho issueru mohl spotřebovat redirect určený jinému issueru. Aplikace si nyní pamatuje posledního issueru zvoleného pro authorization a obnovuje jen jeho cached manager. Oprava pokrývá configuration-based issuance, credential offers i reissuance s authorization fallbackem.

Pro wallet podporující více issuerů je to důležitý state-management princip: authorization callback nesmí být broadcastován všem aktivním issuance sessions.

### Otevřené návrhy

**Wallet-side policy pro šifrování credential response v [[OID4VCI]].**  
Swift [[OID4VCI]] [PR #376](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/376) navrhuje `EncryptionSupportConfig` obdobný Kotlin implementaci. Wallet by mohl explicitně vyžadovat šifrovanou credential response, zakázat RSA nebo EC rodinu, omezit JWE algoritmy, křivku, velikost RSA klíče a content-encryption methods. Negotiation má být průnik issuer metadata a wallet policy při zachování preference issueru.

Pokud změna projde, je vhodné v produkčním profilu neponechat algoritmickou policy implicitně na „vezmi první hodnotu z metadata issueru“. Kryptografické capability walletu a bezpečnostní policy jsou dvě odlišné věci.

**Optional Request Object encryption pro [[OID4VP]].**  
[PR #258](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vp-swift/pull/258) přidává třetí režim vedle `required` a `notRequired`: `supported`. Wallet při `request_uri_method=post` publikuje encryption key a umí přijmout JWE, ale zároveň přijme signed-only JWS. Nezašifrovatelný JWE má být vždy chyba a nesmí propadnout do parseru podepsaného requestu.

Tento návrh přesněji modeluje [[OID4VP]] 1.0: „šifrování podporuji“ není totéž jako „šifrování vyžaduji“.

**iOS Wallet Kit připravuje stejné optional encryption chování a opt-in DPoP s client-attestation key.**  
Otevřený [PR #502](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/502) integruje optional Request Object encryption do vyšší wallet vrstvy a současně řeší opt-in DPoP navázaný na client-attestation key. Změna je zatím návrh; pro implementátory je důležité sledovat zejména to, zda bude výsledná konfigurace jasně oddělovat interoperabilní capability od povinného bezpečnostního profilu.

### ARF a technické specifikace

V repozitáři ARF ani v `eudi-doc-standards-and-technical-specifications` nebyl mezi 5. a 12. říjnem aktualizován žádný pull request. Tento týden tedy **nemění normativní ARF/TS baseline**. Implementační změny výše je potřeba číst jako zpřesnění a opravy referenčního stacku, nikoli jako novou normativní povinnost.

### Co z toho plyne pro implementátory

Nejdůležitější téma týdne je **identity a trust binding mezi jednotlivými rolemi protokolu**. V [[OID4VCI]] je nutné striktně rozlišovat Credential Issuer, Authorization Server a OAuth client ID walletu; client-attestation PoP, proof creation a callback routing musí být navázány na správný identifikátor a konkrétní issuance session.

U [[OID4VP]] je znovu vidět posun k explicitnímu fail-closed reader authentication. Request se nemá považovat za důvěryhodný jen proto, že obsahuje certifikát nebo prošel syntaktickým parsingem. A u šifrování je vhodné modelovat tři stavy — nepodporováno, podporováno, vyžadováno — místo jediného booleanu.

Registrační certifikáty se mezitím rozšiřují i do issuer discovery. Pokud navrhujete vlastní trust model, počítejte s tím, že technická autentizace endpointu a registrační oprávnění subjektu jsou samostatné vrstvy a budou se vyhodnocovat společně až při policy rozhodnutí.
