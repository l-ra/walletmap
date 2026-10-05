---
title: "Týdenní EUDI Wallet přehled — 28. září–5. října 2026"
description: "Bez nové normativní revize ARF/TS; opravy trust kontextu WRPRC, revokace certifikátů, OpenID4VP transaction_data a další fail-closed hardening referenčních knihoven."
pubDate: 2026-10-05
tags: [arf, tydenni-prehled, oid4vp, oid4vci, wrprc, lote, security]
draft: false
---

Týden 28. září–5. října nepřinesl novou sloučenou normativní revizi **ARF ani Standards & Technical Specifications**. Prakticky významné změny se ale soustředily do trust vrstvy, registračních certifikátů, [[OID4VP]] a [[OID4VCI]]. Největší dopad má oprava Android Wallet Core, kde se [[WRPRC]] validoval v nesprávném ETSI trust kontextu, a zapnutí revokačních kontrol v referenční Trust Validator službě.

### Sloučené změny

**1. Android Wallet Core opravuje trust kontext [[WRPRC]] a další fail-open chyby.**  
Android Wallet Core [PR #426](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/426) opravuje chyby vzniklé při migraci na sjednocenou reader-authentication konfiguraci. Nejdůležitější je, že registrační certifikát [[WRPRC]] se dříve vyhodnocoval proti kontextu pro [[WRPAC]]; nově se používá samostatný `WalletRelyingPartyRegistrationCertificate` context. Pro ne-ETSI konfigurace zůstává fallback na reader trust store.

PR současně odstraňuje osiřelý `useEtsiReaderTrust`, který mohl po migraci na nový DSL způsobit, že se neaplikovalo trust anchoring pro signer status listu. Pro aplikace se také zavádí `ReaderAuthPolicyException`, takže rejection podle reader-auth policy lze rozlišit typově a není nutné parsovat text `SecurityException`.

To je důležitá připomínka pro vlastní implementace: [[WRPAC]] a [[WRPRC]] nejsou zaměnitelné trust artefakty a mají mít oddělený validační kontext, policy i diagnostiku.

---

**2. Android Wallet Core uzavírá několik dalších trust fail-open cest.**  
[PR #423](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/423) opravuje několik bezpečnostních chyb. Při policy `ENFORCE` už neznámý typ attestace nemůže skončit neurčitým výsledkem místo odmítnutí; mdoc credential bez `x5chain` je explicitně nedůvěryhodný.

U SD-JWT VC se nově skutečně respektuje výsledek ověření podpisu — předchozí cesta mohla vrátit `Trusted` z trust callbacku ještě před tím, než se projevilo neplatné kryptografické ověření. Součástí jsou i opravy CWT status listů a registračních CWT pro standardní CBOR tag 18 a čtení `x5chain` z protected headeru.

Pro implementátora z toho plyne jednoduché pravidlo: výsledek trust-chain validace nikdy nesmí překrýt neúspěch kryptografického ověření samotného credentialu.

---

**3. Referenční Trust Validator zapíná revokační kontroly certifikátů.**  
Trust Validator [PR #78](https://github.com/eu-digital-identity-wallet/eudi-srv-trust-validator/pull/78) zapíná revocation checking. Navazující ETSI 1196x2 [PR #191](https://github.com/eu-digital-identity-wallet/eudi-lib-kmp-etsi-1196x2/pull/191) přidává na JVM convenience factory `withRevocationChecker`, takže integrátor může revokační politiku PKIX validace jemněji konfigurovat.

Na iOS straně [PR #185](https://github.com/eu-digital-identity-wallet/eudi-lib-kmp-etsi-1196x2/pull/185) rozšiřuje revocation policy z dřívějšího OCSP-only chování na volbu OCSP, CRL nebo kombinaci obou s preferovanou metodou.

Revokace se tak posouvá z implicitního detailu PKIX implementace do explicitní části trust konfigurace. Produkční systém by měl vedle volby metody definovat také chování při nedostupnosti revokačního zdroje a odlišit hard-fail a soft-fail scénáře.

---

**4. Profil access/provider certifikátů přestává vyžadovat kritičnost `basicConstraints` a `keyUsage`.**  
ETSI 1196x2 [PR #192](https://github.com/eu-digital-identity-wallet/eudi-lib-kmp-etsi-1196x2/pull/192) opravuje příliš striktní validaci profilů [[WRPAC]], PID Provider a Wallet Provider certifikátů. `basicConstraints` a `keyUsage` u end-entity certifikátů už nemusí být vždy označeny jako critical; dosavadní implementace vyžadovala něco, co příslušné ETSI/EN profily nepožadují.

Dopad je interoperabilní: validní certifikát vydaný jinou implementací nemá být odmítnut jen kvůli této criticality volbě.

---

**5. [[OID4VP]] `transaction_data` se rozšiřuje na mdoc a QES implementace.**  
Android Wallet Core [PR #424](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/424) přidává podporu `transaction_data` také pro `mso_mdoc`; JVM [[OID4VP]] [PR #508](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-openid4vp-kt/pull/508) přidává odpovídající MSO_MDoc transaction-data type.

Současně QTSP Authorization Server [PR #35](https://github.com/eu-digital-identity-wallet/eudi-srv-web-walletdriven-rpcentric-signer-qtsp-java/pull/35) přechází na `transaction_data` v [[OID4VP]] a Android RQES UI [PR #154](https://github.com/eu-digital-identity-wallet/eudi-lib-android-rqes-ui/pull/154) implementuje transaction-data flow na klientské straně.

To potvrzuje, že `transaction_data` není okrajová extension jen pro SD-JWT VC. Implementace QES by měla datový model a consent UI navrhnout formátově neutrálně a počítat s vazbou transakce jak na SD-JWT VC, tak na mdoc credential.

---

**6. iOS [[OID4VP]] zpřesňuje validaci transaction data a DCQL.**  
[PR #254](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vp-swift/pull/254) zavádí typed `invalid_transaction_data` a validuje envelope, reference na credentialy, holder binding i podporované hash algoritmy. Chyba přežije resolution a může být korektně vrácena jako authorization error; pro `direct_post.jwt` lze chybovou odpověď šifrovat.

Další sloučené PR #249–#253 zpřesňují request/DCQL validaci: request s oběma `response_uri` a `redirect_uri` je odmítnut, kontrolují se duplicate keys, struktura DCQL query, formáty a další [[RP]] validační případy. [PR #255](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vp-swift/pull/255) navíc při průniku VP formátů nekontroluje jen název formátu, ale i skutečně společné algoritmy nebo proof types.

Výsledkem je přesnější capability negotiation: dvě strany nepovažují formát za kompatibilní, pokud pro něj nemají žádný společný kryptografický mechanismus.

---

**7. Swift SD-JWT knihovna prošla další sadou security oprav.**  
V několika sloučených PR se opravuje key-binding freshness a audience validation, pořadí type-metadata fetch vůči signature verification, zpracování malformed disclosures, propagace KB-JWT signing failure, policy `requiredFor(vct)` a únik citlivých claimů do error logů.

Zvlášť důležitý je [PR #180](https://github.com/eu-digital-identity-wallet/eudi-lib-sdjwt-swift/pull/180): `TypeMetadataPolicy.optional` už nepolyká integrity, schema nebo disclosure chyby. Ignorují se pouze skutečné chyby dostupnosti metadata zdroje. „Metadata nejsou dostupná“ a „metadata říkají, že credential je neplatný“ jsou tedy správně dvě odlišné situace.

---

**8. [[OID4VCI]] opravuje authorization issuer a chybové odpovědi.**  
Swift [[OID4VCI]] [PR #371](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/371) a [#372](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/372) opravují práci s Authorization Serverem a porovnání `iss`. JVM [[OID4VCI]] [PR #609](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-openid4vci-kt/pull/609) zase korektně zpracuje HTTP 401 bez response body a zachová případný `WWW-Authenticate` header.

Jde spíše o interoperabilní hardening než nový protokolový mechanismus, ale je důležitý pro robustní produkční klienty: HTTP autentizační chyba není totéž co neparsovatelná credential error response.

---

**9. ARF: Topic AA pro Strong Customer Authentication postoupil do další revize.**  
ARF [PR #763](https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework/pull/763) byl sloučen jako revision-round discussion paper pro první focus-group meeting k SCA. Nejde ještě o novou normativní ARF baseline, ale téma je relevantní pro bankovní scénáře a vazbu walletu na silné ověření zákazníka.

### Otevřené návrhy

**Typed DCQL hodnoty pro Proof of Age.**  
iOS [[OID4VP]] [PR #257](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vp-swift/pull/257) navrhuje zachovat v `ClaimsQuery.values` skutečné JSON typy — string, integer a boolean — místo převodu na string. Companion Wallet Kit [PR #496](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/496) aplikuje stejné pravidlo při matching credential claims. Praktický motiv je Proof of Age: boolean `true`, string `"true"` a integer `1` nesmějí být považovány za stejnou hodnotu. Jde o source API změnu, kterou stojí za to sledovat.

**QES transaction data pro iOS Wallet Kit.**  
[PR #493](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/493) implementuje CSC QES transaction types pro [[OID4VP]], včetně `qes` a `qes-approval`, vazby transaction data na konkrétní credential, consent UI dat a formátově specifického proof bindingu pro SD-JWT VC a mdoc. Pokud projde, iOS se funkčně přiblíží Android cestě sloučené tento týden.

**Registrační certifikáty: tolerantnější `srv_description`.**  
Android Wallet Core [PR #422](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/422) navrhuje akceptovat `srv_description` a `purpose` ve [[WRPRC]] jak jako plochý seznam `MultiLangString`, tak jako array-of-arrays. Důvodem je nejednoznačnost TS5 mezi textovým popisem a typovou definicí. iOS Wallet Kit už obdobnou změnu sloučil v [PR #495](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/495).

**Referenční registrátor opravuje zastaralý [[PID]] request.**  
Otevřený [PR #38](https://github.com/eu-digital-identity-wallet/eudi-srv-web-relyingparty-registration-py/pull/38) odstraňuje `age_over_18` z [[PID]] presentation requestu. Age atributy už podle aktuálního PID Rulebooku nejsou součástí [[PID]] a požadavek je proto nesplnitelný. Zatím jde o návrh, ale vlastní [[RP]] konfigurace by neměly tento atribut z [[PID]] požadovat už dnes.

### Co z toho plyne pro implementátory

Nejdůležitější kontrola tohoto týdne je v trust vrstvě. Pokud máte vlastní reader authentication, ověřte, že [[WRPAC]] a [[WRPRC]] skutečně používají rozdílné validační kontexty a že žádná cesta při `ENFORCE` nevrací neurčitý/null výsledek, který se následně interpretuje jako úspěch.

Revocation checking už je součástí reference trust stacku, ale samotné „zapnout revokaci“ nestačí. Produkční policy musí definovat zdroj (OCSP/CRL), timeouty, caching a chování při nedostupnosti. To je zvlášť důležité pro mobilní wallet, kde offline nebo nestabilní síť není výjimečný stav.

U [[OID4VP]] je zřejmé, že `transaction_data` se stává společnou vrstvou pro QES a další autorizované transakce napříč credential formáty. Consent UI by proto nemělo zobrazovat jen „sdílené atributy“, ale také všechny transakční údaje, které budou kryptograficky svázány s prezentací.

A u DCQL je potřeba zachovávat nejen hodnotu, ale i její datový typ. To je prakticky viditelné právě u Proof of Age: boolean `true` není text `"true"`.

Celkově je 28. září–5. října opět týdnem implementačního hardeningu spíše než nové normativní baseline. Největší význam mají **oddělení trust kontextu [[WRPRC]] od [[WRPAC]], explicitní revokační politika a rozšiřování [[OID4VP]] transaction data z experimentální funkce do reálných QES toků**.
