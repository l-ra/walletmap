---
title: "Týdenní EUDI Wallet přehled — 21.–28. září 2026"
description: "Bez nové revize ARF/TS; Wallet Trust Mark a transaction_data v Android Wallet Core, rozsáhlý OpenID4VCI/OpenID4VP security hardening a zpřísnění práce s LoTE a WRPAC."
pubDate: 2026-09-28
tags: [arf, tydenni-prehled, oid4vp, oid4vci, lote, wrpac, security]
draft: false
---

Tento týden nepřinesl novou sloučenou revizi **ARF ani Standards & Technical Specifications**. Hlavní změny jsou ale implementačně výrazné: Android Wallet Core získal **EUDI Wallet Trust Mark podle TS1** a `transaction_data` pro [[OID4VP]], zatímco Swift [[OID4VCI]] uzavřel několik security mezer kolem Authorization Server mix-up útoků, client attestation, proof/nonce zpracování a šifrování. Trust knihovna současně zpřísnila práci s [[LoTE]] a ASN.1.

### Sloučené změny

**1. EUDI Wallet Trust Mark se dostává přímo do Wallet Core.**  
Android Wallet Core [PR #417](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/417), sloučený **23. září**, implementuje Trust Mark podle TS1 v1.2. Podporuje statické předání informace při distribuci aplikace i dynamické získání přes backend Wallet Providera. `TrustMarkManager.getTrustMark()` následně načte logo a lokalizovaný text z endpointu hostovaného Evropskou komisí.

Trust Mark tedy přestává být jen položkou specifikace a stává se součástí reference Wallet API.

---

**2. [[OID4VP]] dostává `transaction_data`.**  
Android Wallet Core [PR #418](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/418), sloučený **25. září**, přidává `transaction_data` pro SD-JWT VC presentations. Funkce je opt-in: wallet musí explicitně deklarovat přijímané typy, například `QES_APPROVAL`.

To je podstatné pro QES a další transakční use-cases — [[Verifier]] může presentation request svázat s konkrétními strukturovanými daty transakce.

---

**3. Swift [[OID4VCI]] nyní kontroluje RFC 9207 `iss`.**  
[PR #359](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/359), sloučený **22. září**, řeší Authorization Server mix-up attack. Authorization request si uchovává očekávaný issuer a callback musí při deklarované podpoře `authorization_response_iss_parameter_supported` obsahovat odpovídající `iss`.

Samotné `state` tedy už není jediným bindingem authorization response k Authorization Serveru.

---

**4. Client attestation a endpointy Authorization Serveru jsou pevněji bindovány.**  
Swift [[OID4VCI]] [PR #365](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/365), sloučený **23. září**, přidává `requireClientAttestation`. Současně kontroluje, že authorization, token, PAR a challenge endpoint mají stejný origin — scheme, host a port — jako validovaný Authorization Server issuer.

Důvěryhodná metadata tak nemohou wallet přesměrovat s attestation-bound requestem na jiný origin.

---

**5. Proof/nonce chyby už nesmějí zmizet silent fallbackem.**  
[PR #357](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/357) odstraňuje několik `try?` v credential proof cestě. Selhání výpočtu proofu nebo získání nonce se nyní propaguje a issuance se zastaví.

Release [[OID4VCI]] **0.55.0** v [PR #367](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/367) tento hardening konsoliduje a zpřísňuje také encryption a DPoP. Pokud issuer vyžaduje response encryption, wallet nesmí pokračovat bez encryption konfigurace ani přijmout plaintext. DPoP token se nesmí při chybějícím konstruktoru nebo endpointu degradovat na Bearer.

Společným principem je: **přítomná, ale nevalidní security metadata znamenají reject, nikoli fallback na méně bezpečnou variantu.**

---

**6. iOS [[OID4VP]] prošel rozsáhlým security hardeningem.**  
[PR #246](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vp-swift/pull/246) zpřesňuje DID autentizaci: `kid` se interpretuje jako celý DID URL, base DID musí přesně odpovídat `client_id` a resolver dostává i fragment pro výběr konkrétní verification method. Z neověřeného JWT se navíc už nepřebírá `response_uri` pro error callback.

[PR #247](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vp-swift/pull/247) vyžaduje kompletně parsovatelný `x5c` chain, skutečně vynucuje konfiguraci GET/POST `request_uri` a při povinném JAR encryption selže uzavřeně při chybě generování klíče nebo dešifrování.

---

**7. Wallet Kit odmítá nepodepsané SD-JWT credentialy.**  
iOS Wallet Kit [PR #482](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/482) odmítá credential s chybějícím podpisem, `alg: none`, HMAC nebo jiným nepřijatelným signature algorithm ještě před issuer-key resolution.

To je správná trust boundary: kryptograficky nepřijatelný JOSE envelope se nemá vůbec dostat do dalšího credential processingu.

---

**8. [[LoTE]] se nově kontroluje i časově.**  
ETSI 1196x2 [PR #166](https://github.com/eu-digital-identity-wallet/eudi-lib-kmp-etsi-1196x2/pull/166), sloučený **24. září**, odmítá [[LoTE]] s `NextUpdate` v minulosti a ukládá jeho `SequenceNumber` do cache metadata. Kryptograficky validní, ale expirovaný seznam tedy už není použitelný trust material.

Stejná knihovna v [PR #178](https://github.com/eu-digital-identity-wallet/eudi-lib-kmp-etsi-1196x2/pull/178), sloučeném **25. září**, hardenuje ASN.1 parser: chrání proti integer overflow v length fields, omezuje recursion depth proti stack exhaustion a odmítá prázdný algorithm identifier.

Certifikáty jsou attacker-controlled input, takže parser je součástí trust threat modelu stejně jako samotná PKIX validace.

### Otevřené návrhy

V ARF stojí za sledování dva nové návrhy, ale **zatím nemění baseline**.

[ARF PR #769](https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework/pull/769) připravuje po připomínkách EDICG finální discussion paper pro **Topic E**.

[ARF PR #767](https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework/pull/767) obdobně finalizuje **Topic AB — QES** po review round uzavřeném 2. září.

V iOS [[OID4VP]] je nově otevřený [PR #249](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vp-swift/pull/249), který má odmítat request obsahující současně `response_uri` i `redirect_uri`. Jde o správný fail-closed přístup k nejednoznačné response destination.

[PR #250](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vp-swift/pull/250) připravuje validaci formátů deklarovaných v DCQL; PR je zatím rozpracovaný a testovací checklist není dokončen.

Pro registrační infrastrukturu je zajímavý otevřený [WRP registration PR #35](https://github.com/eu-digital-identity-wallet/eudi-srv-web-relyingparty-registration-py/pull/35), který přidává DNS SAN do vydávaného certifikátu podle support URI. To může být důležité pro vazbu [[WRPAC]] na DNS identitu při [[OID4VP]], ale zatím nejde o finální chování referenčního registrátora.

### Co z toho plyne pro implementátory

Nejsilnější trend týdne je opět **fail-closed security processing**.

V produkčním [[OID4VCI]] bych dnes explicitně skládal kontrolu jako:

```text
issuer/AS metadata binding
        ↓
endpoint-origin binding
        ↓
RFC 9207 iss
        ↓
WIA / client-attestation policy
        ↓
proof + nonce
        ↓
request/response encryption
        ↓
DPoP
```

Žádná z těchto vrstev by při chybě neměla tiše degradovat na méně bezpečný mechanismus.

U [[OID4VP]] bych auditoval nejen signature/trust validation, ale i to, **co se děje před úspěšnou autentizací requestu**. Ze signed requestu, jehož podpis ještě nebyl ověřen, se nesmí odvozovat `response_uri` ani jiný údaj způsobující síťovou akci.

A [[LoTE]] bych už modeloval jako **časově verzovaný trust artefakt**, nikoli pouze podepsaný seznam: validace zahrnuje trust/signature, `NextUpdate`, sequence number a bezpečné zpracování všech certifikátových/ASN.1 struktur.

Celkově tedy 21.–28. září nepřineslo novou normativní verzi ARF/TS, ale reference stack udělal další výrazný krok od „happy-path interoperability“ k produkčnímu security enforcementu. Navíc se do Wallet Core dostávají dvě funkce s přímým funkčním dopadem: **EUDI Wallet Trust Mark a transakční data pro QES/presentation flow**.
