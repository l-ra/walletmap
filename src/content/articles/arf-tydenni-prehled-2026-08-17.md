---
title: "Týdenní EUDI Wallet přehled — 17.–24. srpna 2026"
description: "TS5 v1.5 a TS6 v1.2.2 mění datový model WRP registrace, finalizace TS8 pro reporting do DPA a v iOS WalletKit oddělená WRPRC politika pro VP/VCI včetně kontroly entitlementů."
pubDate: 2026-08-24
tags: [arf, tydenni-prehled, wrprc, oid4vp, oid4vci, ts5, ts8]
draft: true
---

Tento týden se těžiště vývoje znovu přesunulo ke **specifikacím registrace Wallet-Relying Parties**. Nejdůležitější jsou **TS5 v1.5**, navazující **TS6 v1.2.2** a finalizace **TS8 v1.0**. V referenční implementaci se současně zpřesňuje interpretace [[WRPRC]]: nestačí kontrolovat, zda jsou požadované/vydávané credentialy uvedeny v certifikátu, ale kontroluje se také odpovídající **entitlement**.

## Sloučené změny

### TS5 v1.5 — další podstatná změna datového modelu WRP registrace

[PR #637 – TS5 v1.5](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/pull/637) byl sloučen jako „alignment with changes introduced in EU 2026/1730“ a současně opravuje kardinality a UML chyby zavedené verzí 1.4.

Tohle bych nepovažoval za kosmetickou revizi. OpenAPI/datový model se znovu mění například zhruba takto:

```text
walletRelyingPartyService  → services
intendedUse                → intendedUses
usesIntermediary           → usesIntermediaries

ProvidedAttestation:
    meta                    → type

WalletRelyingPartyService:
    + subEntitlements
    + servedWRPServices
```

Současně se mění některé kardinality. Například `serviceIdentifier`, který v předchozí verzi působil jako jednoznačně povinný identifikátor služby, je v UML nově **0..1**. `supportURI` se mění z pole na jednu hodnotu a service contact model je doplněn o `email` a `phone`.

Důležitá je také změna modelu intermediary. TS5 nyní explicitněji reprezentuje jak služby, které **používají intermediary**, tak služby, které jako intermediary **obsluhují jiné WRP services**.

**Praktický závěr:** TS5 v1.4 bych už nepoužíval jako stabilní kontrakt. Pokud máte registr nebo vlastní objektový model WRP postavený přímo podle 1.4, v1.5 je reálná datová migrace, ne jen aktualizace dokumentace.

---

### TS6 v1.2.2 — synchronizace minimálního registračního datasetu s TS5

[PR #638](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/pull/638) vydává **TS6 v1.2.2**, datovanou **20. srpna 2026**. Oficiálně jde o „attribute naming fixes and markdown style improvements“, ale část změn je důležitá právě kvůli vazbě na TS5 v1.5.

Například se zpřesňuje mapování mezi právně požadovaným registračním údajem a technickým modelem:

```text
Trade Name
 ├── WalletRelyingParty.tradeName
 └── WalletRelyingPartyService.serviceTradeName

Contact information
 ├── WalletRelyingPartyService.supportURI
 ├── WalletRelyingPartyService.email
 └── WalletRelyingPartyService.phone
```

To dále potvrzuje rozdíl mezi:

```text
Wallet-Relying Party
        │
        └── jedna nebo více registrovaných služeb
```

a současně ukazuje, proč nebylo dobré považovat každý údaj z technického service modelu automaticky za povinný údaj podle [[CIR]].

---

### TS8 v1.0 — reporting WRP k Data Protection Authority

Významnou novinkou je finalizace [TS8 – Specification of Common Interface for reporting of Relying Parties to Data Protection Authorities, PR #636](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/pull/636).

TS8 nyní výrazněji propojuje **[[WRPRC]] s uživatelskou možností nahlásit [[RP]] dozorovému úřadu**.

Klíčovým zdrojem se stává:

```text
WRPRC
  └── supervisory_authority
        ├── infoURI
        ├── email
        └── phone
```

Wallet má při požadavku uživatele použít kontaktní údaje DPA právě z `supervisory_authority` registračního certifikátu a umožnit uživateli report snadno zahájit. Podle dostupného kontaktu může jít například o otevření `mailto:`, webu DPA nebo telefonní aplikace. Alespoň jeden z kontaktních kanálů má být k dispozici.

To je zajímavé i architektonicky: [[WRPRC]] už není jen vstup pro rozhodnutí

```text
„smí tento RP požadovat tyto atributy?“
```

ale začíná být také důvěryhodným zdrojem informací pro UX walletu:

```text
identita RP
účel
entitlements
rozsah dat
supervisory authority
```

Pro presentation history bych proto zachovával dost informací na to, aby wallet dokázal report připravit i později, nejen během samotné prezentace.

---

### iOS WalletKit — oddělená politika WRPRC pro VP a VCI

[iOS WalletKit PR #448](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/448) byl sloučen a poměrně výrazně přepracovává rozhraní registrační validace.

Místo jedné obecné:

```swift
wrprcTrustPolicy
```

jsou nyní dvě:

```swift
wrprcVpTrustPolicy
wrprcVciTrustPolicy
```

tedy zvlášť pro:

```text
presentation → OpenID4VP / proximity
issuance     → OpenID4VCI
```

Obě mohou mít režim `enforce` nebo `warning`.

Přibývá také samostatná API operace:

```swift
resolveIssuerRegistration(
    issuerName,
    credentialConfigurationIds
)
```

která umožňuje **ověřit registraci issueru ještě před zahájením issuance**. Výsledkem je decoded registration policy a případné typed violations, aniž by se credential skutečně vydával.

To je podle mě správný vzor pro UI:

```text
Credential Offer
      ↓
resolve issuer
      ↓
authenticate + evaluate WRPRC
      ↓
zobraz issuer / registration / warnings
      ↓
teprve potom issuance
```

---

### iOS: nově se kontroluje také `entitlement`

[PR #450](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/450) přidává nový důvod selhání:

```text
entitlementMissing(expected: ...)
```

jak pro presentation, tak pro issuance.

Pro issuance se nyní odděleně kontroluje:

```text
1. provides_attestations
   → je issuer registrován pro tento credential type?

2. entitlements
   → má issuer vůbec příslušnou roli?
```

Například implementace rozlišuje [[PID]] a ostatní attestace a očekává URI entitlementů typu:

```text
.../PID_Provider
.../PUB_EAA_Provider
```

U presentation se očekává `Service_Provider`.

To je podstatné. Kontrola:

> „[[WRPRC]] obsahuje tento docType/VCT“

sama o sobě není úplná autorizační kontrola.

Správnější model je:

```text
WRPRC trusted?
    ↓
správný entitlement?
    ↓
konkrétní credential registrován?
    ↓
konkrétní claims/intended use dovoleny?
```

Zároveň byla opravena situace, kdy chybějící `provides_attestations` mohlo být interpretováno příliš benevolentně. Nově `nil` funguje jako prázdný seznam, takže nabídnuté credentialy nejsou automaticky považovány za pokryté.

---

### Intermediary model je stále v pohybu

21. srpna byl sloučen také [WalletKit PR #452](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/452), který opět mění reprezentaci `intermediary` v `WrpRegistrationPolicy`.

Zajímavé je, že popis PR hovoří o obnovení podpory multiple entries, zatímco výsledný diff mění model zpět na:

```swift
PolicyIntermediary?
```

a binding access certificate porovnává proti jednomu `intermediary.identifier`.

Nechtěl bych z toho zatím vyvozovat definitivní normativní závěr; spíš je to další signál, že **intermediary část [[WRPRC]]/datového modelu ještě není dost stabilní na hard-coded doménový model bez versioningu**.

## Otevřené návrhy

Nejdůležitější otevřená věc z minulého týdne stále **není vyřešená**: Swift [[OID4VCI]] [PR #316](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/316) je stále **open draft**. Řeší credential offer, kde `authorization_code` a `pre-authorized_code` používají různé Authorization Servery. Bez opravy může pre-authorized code skončit na token endpointu jiného AS.

Navrhovaný model je správně per-grant:

```text
CredentialOffer
   │
   └── GrantsMetadata
        ├── authorizationCode → AS-A
        └── preAuthorizationCode → AS-B
```

a nikoliv jedno globální `authorizationServerMetadata`. Dokud není PR sloučen, považoval bych tuto kombinaci ve Swift stacku za něco, co stojí za vlastní integrační kontrolu.

Stále otevřený je také Android Wallet Core [PR #390](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/390), který opravuje [[OID4VP]] `response_mode=query` a `response_mode=fragment`. Současný kód podle PR vytvoří správný redirect URI s `vp_token`, ale místo jeho předání aplikaci pouze vyhlásí `ResponseSent`, takže se celý response fakticky zahodí. PR je stále open a během týdne prošel další kontrolou.

## Co bych podle tohoto týdne změnil v návrhu implementace

* **Verzoval bych WRP registry schema.** TS5 1.4 → 1.5 mění názvy, kardinality i vazby mezi službami natolik, že „JSON objekt WRP“ není bezpečné považovat za dlouhodobě stabilní datový kontrakt.
* **[[WRPRC]] authorization bych dělal ve více krocích:** trust/signature → binding → entitlement → credential type → claims/intended use. Samotné `provides_attestations` nebo `credentials` nestačí.
* **`supervisory_authority` bych ukládal spolu s presentation history**, případně s odkazem na autentizovaný [[WRPRC]], protože TS8 z něj dělá vstup pro reporting do DPA.
* **VP a VCI trust policy bych konfiguroval odděleně.** Referenční iOS stack už tuto separaci explicitně zavádí a dává smysl i z hlediska různých rizik a přechodných režimů.
* U intermediary vztahů bych si zatím ponechal **flexibilní model 1:N**, i kdyby konkrétní SDK dnes nabízelo jednodušší objekt; standardizační model se v posledních týdnech několikrát měnil.

V samotném **ARF repozitáři jsem v období 17.–24. srpna nenašel nový věcný PR**. Hlavní pohyb se tedy tento týden odehrává o úroveň níže: v technických specifikacích registrace a v tom, jak referenční wallet skutečně interpretuje [[WRPRC]].

Největší posun týdne bych shrnul takto: **[[WRPRC]] se postupně mění z „podepsaného popisu registrace“ na skutečný policy objekt walletu — obsahuje nejen scope credentialů, ale roli subjektu, regulatorní kontakt a informace potřebné pro několik následných bezpečnostních a uživatelských rozhodnutí.**
