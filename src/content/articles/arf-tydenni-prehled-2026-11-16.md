---
title: "Týdenní EUDI Wallet přehled — 16.–23. listopadu 2026"
description: "Bezpečnost trust kontextů, proximity BLE, OpenID4VP, OpenID4VCI a nové konformační testy."
pubDate: 2026-11-23
tags: [arf, tydenni-prehled, oid4vp, oid4vci, trust, security, wrprc]
draft: false
---

Týden **16.–23. listopadu 2026** přinesl hlavně bezpečnostní opravy referenčních knihoven a nové konformační testy. Významné jsou samostatné trust kontexty pro status listy, ochrana proximity přenosu a zpřísnění [[OID4VP]] a [[OID4VCI]]. V uvedených změnách není nová normativní revize ARF ani TS5.

## Sloučené změny

### Status listy: oddělené trust kontexty

Dne **18. listopadu** byly sloučeny [iOS Wallet Kit #578](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/578) a [ISO 18013 Security #151](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-iso18013-security/pull/151). Status listy se již neověřují univerzálním [[WRPAC]] trust kontextem. Validátor volí kontext podle vlastníka: [[PID]], příslušné atestace nebo registračního [[WRPRC]]. Anchory pro status signing zůstávají oddělené od issuer a reader trustu.

**Dopad:** zkontrolujte mapování typu credentialu na status-signing trust anchor a revokační politiku.

### [[OID4VP]]: bezpečnější šifrování a podpisy

[Android Wallet Core #482](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/482), sloučený **18. listopadu**, zužuje výchozí šifrovací algoritmy odpovědi a odstraňuje zastaralé CBC metody. [iOS ISO 18013 Security #150](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-iso18013-security/pull/150), sloučený téhož dne, odmítá nezabezpečený [[JWS]] s algoritmem none. [Swift OpenID4VP #272](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vp-swift/pull/272), sloučený **18. listopadu**, zahrnuje bezpečnostní opravy kolem [[WRPRC]], JAR a legal name.

**Dopad:** explicitně nastavte povolené algoritmy [[JWE]] a validujte podpis, nikoli pouze přítomnost certifikátu.

### BLE proximity: izolace sessions, identita readeru a limity

V iOS ISO 18013 Data Transfer byla sloučena série oprav: [#167](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-iso18013-data-transfer/pull/167) (**18. listopadu**) váže GATT session na jednu BLE central; [#180](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-iso18013-data-transfer/pull/180) (**20. listopadu**) kontroluje 16bajtový Ident odvozený z QR engagementu a přidává timeout; [#170](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-iso18013-data-transfer/pull/170) (**20. listopadu**) omezuje skládání BLE zpráv na 256 KiB. [#174](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-iso18013-data-transfer/pull/174) synchronizuje přístup k transportnímu stavu. [#176](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-iso18013-data-transfer/pull/176) počítá náhled consentu bez použití device-authentication klíčů před souhlasem uživatele.

**Dopad:** testujte souběžné čtečky, neplatný Ident, nadměrné a nedokončené BLE zprávy i ukončování session.

### Reader authentication před consentem

[Android Wallet UI #782](https://github.com/eu-digital-identity-wallet/eudi-app-android-wallet-ui/pull/782), sloučený **20. listopadu**, odmítá proximity a mdoc Digital Credentials API požadavky s přítomnou, ale neúspěšnou reader authentication ještě před zobrazením consentu. Varování o neověřené identitě nemá umožnit pokračovat s neplatným podpisem nebo nedůvěryhodným certifikátem.

### [[OID4VCI]]: vazba klíčů a algoritmy

[Android Wallet Core #484](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/484), sloučený **19. listopadu**, odstraňuje riziko kolize aliasů client-attestation klíčů různých Authorization Serverů. [iOS Wallet Kit #579](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/579) (**19. listopadu**) opravuje výběr signing algoritmů pro attestation-only issuance; [#572](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/572) (**17. listopadu**) místo pádu vrací chybu, pokud počet vydaných credentialů neodpovídá dostupným binding keys. [Swift OpenID4VCI #415](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/415) (**20. listopadu**) odstraňuje zastaralý RSA1_5 z [[JWE]] algoritmů a [#416](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/416) opravuje statistické zkreslení generování PKCE verifieru.

### Nové konformační testy

[Functional Conformance Assessment #94](https://github.com/eu-digital-identity-wallet/eudi-doc-functional-conformance-assessment/pull/94) a [#95](https://github.com/eu-digital-identity-wallet/eudi-doc-functional-conformance-assessment/pull/95), sloučené **18. listopadu**, přidávají testy tříd claimů [[SD-JWT-VC]], Type Metadata, jejich získávání, cache a dědičnosti. [#96](https://github.com/eu-digital-identity-wallet/eudi-doc-functional-conformance-assessment/pull/96) vysvětluje vazbu Implementation Conformance Statement na aplikovatelnost testů podle profilu.

## Otevřené návrhy

**Číselné názvy claimů v DCQL:** [iOS Wallet Kit #588](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/588), otevřený **22. listopadu**, řeší záměnu objektového klíče obsahujícího číslo za index pole. Ovlivňuje mimo jiné age claims v německém [[PID]] a matching credential sets.

**Batch issuance a unikátní binding keys:** [Swift OpenID4VCI #413](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/413), otevřený **19. listopadu**, navrhuje odmítat batch proofs sdílející tentýž binding key.

**DPoP a autorizace:** [Swift OpenID4VCI #414](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/414), otevřený **19. listopadu**, přidává podporu dpop_jkt; [#417](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/417), otevřený **22. listopadu**, zpřístupňuje authorization_expires_in z token response pro plánování opětovné autorizace.

**Povinné atributy:** [iOS Wallet Kit #520](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/520) zůstává otevřený. Wallet má odmítat credential bez atributů označených issuerem jako mandatory. [JVM SD-JWT #529](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-sdjwt-kt/pull/529) rozlišuje mandatory claim při issuance od jeho případného nezveřejnění při presentation.

## Praktický dopad

1. **Trust:** oddělte trust anchory vydavatelů, status-list signerů, [[WRPAC]] a [[WRPRC]].
2. **Proximity:** před consentem vyžadujte úspěšnou reader authentication a testujte identitu protistrany, izolaci sessions a limity zdrojů.
3. **[[OID4VCI]]:** kontrolujte vazbu credentialů na klíče, proof algoritmy a kryptografickou policy.
4. **[[OID4VP]]:** testujte DCQL s číselnými názvy objektových atributů a rozlišujte validaci claim path od výběru credentialu.

Změny tohoto týdne se týkají především implementací a konformačních testů, nikoli nové normativní revize ARF nebo TS5.
