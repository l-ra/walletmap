---
title: "Týdenní EUDI Wallet přehled — 12.–19. října 2026"
description: "Bez změny ARF/TS baseline; OpenID4VCI získává wallet-side encryption policy a opravy client-attestation PoP, iOS Wallet Kit odděluje reader trust policy a trust stack zpřesňuje práci s revokací a podpisem LoTE."
pubDate: 2026-10-19
tags: [arf, tydenni-prehled, oid4vp, oid4vci, wrprc, trust, security]
draft: false
---

Týden 12.–19. října nepřinesl novou změnu normativní baseline **ARF ani Standards & Technical Specifications**. V obou dokumentačních repozitářích nebyl v tomto období aktualizován žádný pull request. Prakticky významné změny se soustředily do [[OID4VCI]], reader authentication v [[OID4VP]], revokační politiky trust stacku, [[PID]] metadata a registračních certifikátů.

### Sloučené změny

**1. Swift [[OID4VCI]] dostává explicitní wallet-side policy pro šifrování credential response.**  
[PR #376](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/376), sloučený 14. října, přidává `EncryptionSupportConfig`. Wallet může nově vyžadovat šifrovanou credential response, zakázat celou RSA nebo EC rodinu, omezit [[JWE]] algoritmy, křivku, velikost RSA klíče i content-encryption methods. Výsledná konfigurace se vyjednává jako průnik capability issueru a lokální wallet policy při zachování preference issueru.

To je důležitý posun od implicitního „vezmi první algoritmus z metadata issueru“ k explicitní bezpečnostní policy. Produkční profil může například vyžadovat encryption a povolit pouze ECDH-ES + AES-GCM; pokud issuer encryption nepodporuje nebo neexistuje společný algoritmus, issuance skončí chybou místo tichého fallbacku.

**2. Client-attestation PoP ve Swift [[OID4VCI]] se srovnává se specifikací a Android implementací.**  
[PR #378](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/378), sloučený 15. října, redukuje defaultní PoP na potřebné claims, opravuje chybové stavy chybějících claims a hlavně zpřesňuje práci s challenge při retry. Nová challenge z odpovědi se propaguje do opakovaného token requestu a chyba při získání challenge se už neztrácí.

Pro implementátory je důležité chápat attestation challenge jako součást konkrétního authorization/token exchange, nikoli jako volitelný pomocný údaj, který lze při retry znovu použít bez kontroly čerstvosti.

**3. iOS Wallet Kit odděluje trust reader certifikátu od autentizace requestu.**  
[PR #507](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/507) zavádí samostatnou `readerTrustPolicy`. Default `.enforce` dál odmítá nedůvěryhodný X.509 chain. Explicitní `.warning` ale dovolí pokračovat, pokud je request korektně podepsaný, chain je syntakticky validní a leaf odpovídá signing certifikátu; session pak vrací stav `authenticatedWithUntrustedCertificate`. Issuer trust a [[WRPRC]] policy zůstávají oddělené.

To je užitečné hlavně pro testovací a přechodové prostředí, ale UI musí tento stav zobrazit jako warning a nesmí jej prezentovat jako důvěryhodného readera. Produkční default zůstává fail-closed.

**4. iOS trust stack umožňuje volit revokační strategii i pro bundled anchors.**  
ETSI 1196x2 [PR #205](https://github.com/eu-digital-identity-wallet/eudi-lib-kmp-etsi-1196x2/pull/205), sloučený 16. října, doplňuje možnost předat vlastní PKIX/direct-trust validátor i do `usingBundledAnchors`. Důvod je praktický: defaultní iOS PKIX cesta vyžaduje pozitivní OCSP odpověď, takže CA publikující pouze CRL byly vyhodnoceny jako nedůvěryhodné. Implementátor může nově zvolit OCSP, CRL nebo revocation checking explicitně vypnout například pro offline testy.

**5. [[PID]] Type Metadata opravují význam `mandatory` pro `iss` a `iat`.**  
PID Issuer [PR #666](https://github.com/eu-digital-identity-wallet/eudi-srv-pid-issuer/pull/666), sloučený 16. října, mění `mandatory` u claimů `iss` a `iat` z `true` na `false`; oba přitom zůstávají `sd: never`. To je relevantní pro validátory Type Metadata: „nesmí být selectively disclosed“ není totéž jako „musí být vždy přítomno“.

**6. QES reference opravuje konstrukci [[OID4VP]] `transaction_data`.**  
Release [PR #37](https://github.com/eu-digital-identity-wallet/eudi-srv-web-walletdriven-rpcentric-signer-qtsp-java/pull/37) opravuje dvojité URL-decoding `authorization_details` při sestavení `transaction_data` a současně přidává same-device [[OID4VP]] stránku. Pro QES integrace je podstatná právě oprava serializace: data kryptograficky bindovaná do presentation flow musí odpovídat původnímu významu authorization requestu a nesmí být změněna opakovaným dekódováním.

### Otevřené návrhy

**Oprava vydávání [[WRPRC]] v referenčním registrátoru.**  
[PR #42](https://github.com/eu-digital-identity-wallet/eudi-srv-web-relyingparty-registration-py/pull/42) opravuje dvě konkrétní chyby v `intended_use_registration_certificate`: handler očekává `policy_uri`, zatímco model vrací `policyURI`, a volitelný `infoURI` může vést k neinicializované proměnné. Návrh má regresní testy a podle diskuse odpovídá i reálně pozorovaným HTTP 500 při vydávání registračního certifikátu; stále ale není sloučen.

**Android Wallet Core: `DoNotEnforce` nemá zahodit nakonfigurovaný reader trust material.**  
Otevřený [PR #438](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/438) řeší stav, kdy `DoNotEnforce` zahodí vytvořený reader trust store. Důsledkem je selhávání signed [[OID4VP]] requestů jako `Untrusted x5c` a současně nefunkční fallback validace registračních certifikátů mimo ETSI konfiguraci. Návrh zachovává význam „trust výsledek negatuje disclosure gate“, ale trust material zůstane dostupný pro autentizaci a policy vyhodnocení.

**Trust Validator má začít ověřovat podpis [[LoTE]] jako JAdES B-B.**  
Draft [PR #91](https://github.com/eu-digital-identity-wallet/eudi-srv-trust-validator/pull/91) nahrazuje dosavadní implicitní akceptaci podpisu [[LoTE]] skutečným ověřením přes DSS a konfigurovaný keystore; návrh má mít verification defaultně zapnutou. Pokud bude sloučen, odstraní významný trust bootstrap předpoklad: stažení [[LoTE]] přes důvěryhodný transport samo o sobě nebude stačit, seznam musí projít i kryptografickou validací podpisu.

**iOS Wallet Kit připravuje per-key proof pro [[KA]].**  
[PR #505](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/505) navrhuje předat provideru [[KA]] bezpečné signing handles ke každému credential key, aby backend mohl ověřit proof-of-possession bez exportu privátního klíče. Pro device-bound issuance je to důležitý krok: atestace klíče se tím může kryptograficky svázat s konkrétními credential keys, ne jen s jejich veřejnými reprezentacemi.

### ARF a technické specifikace

V repozitáři ARF ani v `eudi-doc-standards-and-technical-specifications` nebyl mezi 12. a 19. říjnem aktualizován žádný pull request. Tento týden tedy **nemění normativní ARF/TS baseline**.

### Co z toho plyne pro implementátory

Nejvýraznější trend týdne je další rozdělení **capability, autentizace a trust policy**. U [[OID4VCI]] už nestačí vědět, že knihovna umí [[JWE]] — wallet má mít vlastní allow-list a možnost encryption vyžadovat. U [[OID4VP]] je zase potřeba rozlišit kryptograficky autentizovaný request od důvěryhodnosti certifikačního chainu readeru a od oprávnění deklarovaných v [[WRPRC]].

Revokace se současně stává konfigurovatelnou součástí trust modelu. Implementace by měla explicitně určit, zda používá OCSP, CRL, obojí nebo offline režim, a co přesně znamená nedostupnost revokační infrastruktury. A pokud používá [[LoTE]], je vhodné už nyní navrhovat bootstrap tak, aby zahrnoval nejen transport a cache, ale i ověření podpisu seznamu.
