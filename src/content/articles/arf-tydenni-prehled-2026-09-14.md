---
title: "Týdenní EUDI Wallet přehled — 14.–21. září 2026"
description: "Bez nové revize ARF/TS; iOS OpenID4VP zavírá verifier-binding chyby, WRPAC profil se zpřesňuje a OpenID4VCI reference stack odděluje ETSI a standardní proof profil."
pubDate: 2026-09-21
tags: [arf, tydenni-prehled, oid4vp, oid4vci, wrpac, trust, key-attestation, security]
draft: false
---

Tento týden nepřinesl novou věcnou revizi ARF ani Standards & Technical Specifications. Největší posun je v referenčních implementacích: několik dříve otevřených security oprav v [[OID4VP]] a [[OID4VCI]] bylo sloučeno, výrazně se zpřesnil profil [[WRPAC]] a Android Wallet Core formalizuje rozdíl mezi evropským ETSI proof profilem a obecným [[OID4VCI]].

### Sloučené změny

**1. iOS OpenID4VP: response URI se konečně váže na autentizovanou identitu verifieru.**

[PR #234](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vp-swift/pull/234), který jsme sledovali už minulý týden, byl sloučen. Pro `x509_san_dns` se nyní kontroluje, že `client_id` je skutečně v DNS SAN leaf certifikátu a že host `response_uri` odpovídá této autentizované identitě. U `verifier_attestation` se `response_uri` a `redirect_uri` kontrolují proti URI deklarovaným v attestaci. U `redirect_uri` client-id scheme musí `client_id` přesně odpovídat cílovému URI.

Prakticky se tedy oddělují dvě otázky:

```text
Je request kryptograficky autentizovaný?
        ↓
Patří response destination stejné autentizované protistraně?
```

To zavírá třídu útoků, kde byl request podepsaný legitimním [[Verifier|verifierem]], ale odpověď mohla být odeslána na jiný endpoint.

---

**2. iOS OpenID4VP: unsigned request je povolen jen pro `redirect_uri` scheme.**

Navazující [PR #235](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vp-swift/pull/235) byl sloučen 15. září. Plain, nepodepsaný authorization request je nyní akceptován pouze pro `redirect_uri` client-id scheme. `preregistered`, X.509, verifier attestation i DID varianty vyžadují podepsaný JAR.

To je důležitý fail-closed posun: nakonfigurovaný způsob autentizace už nelze obejít tím, že stejný `client_id` přijde v unsigned requestu.

---

**3. Swift OpenID4VCI: issuer a Authorization Server metadata jsou pevně bindována na discovery URL.**

[PR #348](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/348) byl sloučen 14. září. Wallet nyní porovnává celý Credential Issuer URL s `credential_issuer` v metadata, nikoli pouze hostname. Původní issuer identifier z Credential Offeru se zachovává a Authorization Server metadata musí podle RFC 8414 obsahovat `issuer` přesně odpovídající discovery URL.

Tím se zavírá i popsaný client-attestation relay attack chain: Authorization Server už se nemůže vydávat za jiný server jen tím, že vrátí vhodně sestavená metadata.

Správná trust vazba je tedy:

```text
Credential Offer issuer identifier
        ↓ exact binding
Credential Issuer metadata
        ↓
Authorization Server identifier
        ↓ exact RFC 8414 binding
Authorization Server metadata
```

---

**4. Swift OpenID4VCI: nevalidní encryption metadata už nespadnou na `notSupported`.**

[PR #350](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/350) byl rovněž sloučen. Dřívější konstrukce `try? ... ?? .notSupported` mohla převést chybná nebo bezpečnostně nepřijatelná encryption metadata na stav „issuer encryption nepodporuje“.

Nově platí:

```text
metadata block chybí
    → notSupported může být legitimní

metadata block existuje, ale je nevalidní
    → chyba / reject
```

To je důležitý obecný princip pro všechny security metadata: absence capability a nevalidní deklarace capability nesmějí být interpretovány stejně.

---

**5. Android Wallet Core: ETSI a standardní OpenID4VCI proof profil jsou explicitně odděleny.**

[PR #413](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/413) zavádí `IssuanceProofProfile` s variantami `Etsi`, `Standard` a `Custom`.

Defaultní `Etsi` profil preferuje:

```text
Attestation Proof
JWT + Key Attestation
```

`Standard` profil naproti tomu připouští v pořadí plain JWT bez [[KA]], JWT s [[KA]], Attestation Proof a No Proof. Custom profil dovoluje implementátorovi definovat vlastní pořadí a algoritmy.

To potvrzuje trend z minulého týdne: **protokolová capability není totéž co EUDI security policy**. Reference wallet může interoperovat s obecným [[OID4VCI]], ale evropský profil zůstává defaultně attested.

---

**6. WRPAC: validity-assured short-term certifikáty jsou nyní explicitně zakázány.**

[ETSI 1196x2 PR #157](https://github.com/eu-digital-identity-wallet/eudi-lib-kmp-etsi-1196x2/pull/157) opravuje dřívější interpretaci ETSI TS 119 411-8. [[WRPAC]] nesmí být validity-assured short-term certificate. Pokud obsahuje QC statement `ext-etsi-valassured-ST-certs`, validátor jej nově odmítne.

Předchozí implementace naopak krátkodobý certifikát za určitých podmínek akceptovala. Pro implementátora to znamená, že krátká platnost sama o sobě není problém, ale **WRPAC nesmí používat ETSI validity-assured short-term profil**.

---

**7. WRPAC subject validation se zpřesňuje pro certifikáty s více policy OID.**

[PR #153](https://github.com/eu-digital-identity-wallet/eudi-lib-kmp-etsi-1196x2/pull/153) opravuje validaci Subject DN. [[WRPAC]] může podle GEN-6.6.1-03 nést více policy identifierů. Pokud certifikát současně deklaruje natural-person i legal-person policy, Subject musí splnit požadavky obou profilů; validátor už tuto kombinaci nepovažuje za případ, který není třeba kontrolovat.

To je relevantní hlavně pro vlastní implementace ETSI profilu: policy OID není jen výběr jedné validační větve. Při více policy se constraints skládají.

---

**8. Direct trust validation přechází na přesnou DER shodu certifikátu.**

[ETSI 1196x2 PR #161](https://github.com/eu-digital-identity-wallet/eudi-lib-kmp-etsi-1196x2/pull/161) refaktoruje direct trust. Místo porovnávání vybraných atributů certifikátu se leaf certificate porovnává s trust anchorem podle kompletního DER encodingu. Současně se `ValidateCertificateChainUsingDirectTrust` mění na functional interface.

Pro pinning/direct-trust scénáře je to bezpečnější a předvídatelnější model: trusted je konkrétní certifikát, nikoli jiný certifikát, který náhodou sdílí s anchorem vybranou množinu atributů.

---

**9. Android Wallet Core: multi-signed presentation request už vybírá první důvěryhodnou identitu.**

[PR #414](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/414) je sice formálně upgrade Multipaz, ale obsahuje věcnou breaking změnu v reader authentication. `Requester` už nemá jeden `certChain`, ale seznam `requesterIdentities`. U requestu s více podpisy se pro trust rozhodnutí vybere první **důvěryhodná** identita, nikoli jednoduše první podpis v requestu.

To je důležité pro systémy, které mohou stejný request podepisovat v několika trust frameworks. Nevalidní podpis stále shodí celý request; změna se týká pouze výběru identity pro trust policy.

### Otevřené návrhy

**iOS PKIX: revocation checking má být defaultně zapnutý.** [ETSI 1196x2 PR #158](https://github.com/eu-digital-identity-wallet/eudi-lib-kmp-etsi-1196x2/pull/158) navrhuje změnit `PKIXConfiguration()` tak, aby `isRevocationEnabled` bylo defaultně `true`. Testy bez AIA/OCSP musí revocation explicitně vypnout. Pokud bude PR sloučen, produkční iOS integrace získají bezpečnější default, ale současně je potřeba počítat se síťovou dostupností OCSP/CRL infrastruktury a s chováním při nedostupnosti revokační služby.

**iOS trust stack: odstranit produkční accept-all validátor podpisu LoTE JWT.** [PR #160](https://github.com/eu-digital-identity-wallet/eudi-lib-kmp-etsi-1196x2/pull/160) odstraňuje `InsecureAcceptAllJwtSignature`, který vracel `Verified` pro libovolný [[LoTE]] JWT. Místo něj přidává Swift-friendly callback, přes který aplikace dodá skutečné ověření podpisu. Pokud změna projde, bude výrazně těžší omylem nasadit demo trust konfiguraci do produkce.

**iOS OpenID4VP: další security hardening DID.** [PR #243](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vp-swift/pull/243) sdružuje několik security/privacy findings kolem DID. Je stále otevřený; před nasazením DID client-id scheme bych proto tuto větev změn sledoval a nepovažoval současnou implementaci za definitivně hardened.

### Co z toho plyne pro implementátory

Největší posun týdne je v **identity bindingu a trust enforcementu**. Nestačí ověřit podpis requestu nebo metadata izolovaně; musí být kryptograficky a sémanticky svázány i cílové URI, discovery identifikátory a konkrétní trust profil.

Pro [[OID4VP]] bych dnes požadoval minimálně:

```text
signed JAR, pokud scheme není redirect_uri
        ↓
client-id scheme authentication
        ↓
certificate / attestation trust
        ↓
response_uri binding
        ↓
WRPAC / registration policy
        ↓
disclosure
```

Pro [[OID4VCI]] bych držel oddělenou konfiguraci `Etsi` versus obecný standardní profil. Plain JWT proof může být legitimní interoperabilní capability, ale neměl by se omylem stát fallbackem evropského issuance flow.

A u [[WRPAC]] bych zkontroloval vlastní profil proti dvěma tento týden potvrzeným pravidlům: validity-assured short-term profil je zakázaný a při více certificate policy OID je nutné kumulativně vyhodnotit odpovídající Subject DN constraints.

Celkově byl týden 14.–21. září méně o nové normativní specifikaci a více o **odstraňování implicitních trust předpokladů z referenčního kódu**. To je pro produkční implementátory podstatné: několik kontrol, které dříve bylo možné považovat za samozřejmé, se teprve nyní stává explicitně fail-closed.