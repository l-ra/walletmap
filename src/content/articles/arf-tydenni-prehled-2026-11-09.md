---
title: "Týdenní EUDI Wallet přehled — 9.–16. listopadu 2026"
description: "TS5 v1.6.1 opravuje registrační API; Android zpřísňuje reader authentication a minimalizaci SD-JWT; iOS rozšiřuje DCQL výběr a OpenID4VCI ochrany."
pubDate: 2026-11-16
tags: [arf, tydenni-prehled, ts5, oid4vp, oid4vci, trust, security, wrprc]
draft: false
---

Týden 9.–16. listopadu přinesl **nové TS5 errata v1.6.1** a několik důležitých bezpečnostních oprav referenčních implementací. Největší praktický dopad mají opravy registrace [[RP]], autentizace jednotlivých požadavků na mdoc, selektivního zveřejňování [[SD-JWT-VC]] a kontroly DPoP při [[OID4VCI]]. V [[ARF]] se nová věcná revize neobjevila.

## Sloučené změny

### TS5 v1.6.1: opravy registračních API a životního cyklu služby

Dne **11. listopadu** byl sloučen [STS PR #668](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/pull/668). Vydává errata **TS5 v1.6.1** (v changelogu datovaná 10. listopadu), nikoli jen redakční opravy. OpenAPI pro Registrar API přechází z v1.6 na **v1.6.1**, u write API z v0.1 na **v0.1.1**. Pole `trustAuthorities` se přejmenovává na `trustedAuthorities`, zpřesňuje se model `Claim.path` a model služby dostává atributy `status`, `createdAt`, `suspendedAt`, `revokedAt`. `serviceIdentifier` je v UML povinný. Write API přebírá sdílené definice pomocí referencí na hlavní schéma.

**Dopad:** integrátoři registrátorů a [[WRPRC]] mají provést schema diff, aktualizovat serializaci a otestovat validaci povinných atributů i lifecycle stavů. Pozor: write metody POST/PUT/DELETE jsou v samostatném dokumentu stále označeny jako **nenormativní**.

### Android Wallet Core: reader authentication pro každý DocRequest

[PR #478](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/478), sloučený **12. listopadu**, odstraňuje chybu, kdy se důvěra prvního podepsaného `DocRequest` aplikovala na celý ISO 18013-5 request. Nově se bez `readerAuthAll` ověřuje podpis a důvěra **každého** `DocRequest`; jeden nepodepsaný či nedůvěryhodný požadavek nemůže zdědit identitu jiného readeru. U `readerAuthAll` se vyhodnocuje podpis pokrývající celý request. Kontrola registrace se váže na odpovídající autentizovanou identitu.

**Dopad:** proximity prezentace s více požadavky musí mít testy pro kombinace podepsaných, nepodepsaných a různými čtečkami podepsaných `DocRequest`.

### Android Wallet Core: selektivní zveřejnění nesmí odeslat celý nadřazený Disclosure

[PR #476](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/476), sloučený **10. listopadu**, opravuje situaci, kdy dotaz na `address.country` mohl odeslat celý Disclosure `address` včetně dalších podatributů, přestože consent ukazoval pouze zemi. Nově je Disclosure použitelný jen tehdy, když jsou vybrány všechny jeho skutečně zpřístupňované claims; jinak se nevyhovující credential nemá nabízet.

**Dopad:** nelze předpokládat, že libovolný vnořený claim lze selektivně odhalit, pokud jej issuer zakódoval jako jeden nedělitelný Disclosure. Consent musí odpovídat skutečně odesílaným datům.

### Swift OpenID4VCI: zákaz tichého downgrade DPoP na Bearer

[PR #403](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/403), sloučený **11. listopadu**, opravuje token exchange: i když wallet požadovala DPoP a poslala proof, knihovna dříve přijala i token odpověď s `token_type: Bearer`. Při `requireDpop` se nyní musí ověřit také skutečný typ vráceného tokenu.

**Dopad:** bezpečnostní policy je nutné kontrolovat i na odpovědi Authorization Serveru, nikoli pouze na vlastním requestu.

### iOS Wallet Kit: DCQL výběr, VCT a metadata cache

[PR #563](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/563), sloučený **12. listopadu**, umožňuje pro DCQL `multiple: true` vybrat neprázdnou podmnožinu credentialů, nikoli automaticky odeslat všechny odpovídající. Validuje povinné query a vazby `transaction_data` na skutečně odesílané credentialy. [PR #560](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/560), sloučený **11. listopadu**, opravuje matching více hodnot `meta.vct_values` — dříve se vyhodnocovala jen první. [PR #562](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/562), sloučený **13. listopadu**, synchronizuje sdílené cache metadat vydavatelů a Authorization Serverů, aby souběžná issuance nevedla k datovým závodům.

### Další důležité opravy

[Android Wallet Core #479](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/479), sloučený **13. listopadu**, zabraňuje tiché změně formátu, `docType` nebo `vct` při re-issuance; původní dokument se nemá nahradit credentialem jiného typu. iOS ISO 18013 data model [#175](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-iso18013-data-model/pull/175) a [#177](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-iso18013-data-model/pull/177), oba sloučené **12. listopadu**, odstraňují z implicitních logů identifikátory klíčů, engagement payloady a hodnoty claims. iOS Wallet Kit [#558](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/558), sloučený **11. listopadu**, zpřístupňuje konfigurovatelnou kontrolu `iss` v authorization response; výchozí režim kontrolu nevyžaduje, produkční profil ji může zpřísnit.

## Otevřené návrhy — zatím neimplementovaná baseline

**Odlišné klíče v batch issuance.** JVM [[OID4VCI]] [PR #633](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-openid4vci-kt/pull/633), otevřený **15. listopadu**, navrhuje odmítnout batch proofs používající opakovaně stejný binding key. OpenID4VCI 1.0 §8 vyžaduje odlišný kryptografický materiál; duplicitní klíče mohou vést k linkovatelným credentialům.

**`locations` v token requestu.** JVM [[OID4VCI]] [PR #631](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-openid4vci-kt/pull/631), otevřený **13. listopadu**, opravuje opačně vyhodnocenou podmínku pro `authorization_details.locations`, které jsou relevantní, když Credential Issuer používá oddělený Authorization Server.

**X.509 profil fyzických a právnických osob.** ETSI knihovna [PR #222](https://github.com/eu-digital-identity-wallet/eudi-lib-kmp-etsi-1196x2/pull/222), otevřený **12. listopadu**, navrhuje vyžadovat `organizationIdentifier` pouze pro subject DN právnické osoby.

**JVM [[OID4VP]] response destination.** [PR #528](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-openid4vp-kt/pull/528) zůstává otevřený; řeší použití původního `client_id` jako `response_uri` u prefixu `redirect_uri`, pokud explicitní `response_uri` chybí. Nejde zatím o stabilní implementační pravidlo.

## Praktický dopad na implementátory

1. **Registrace:** porovnat TS5 v1.6.1 proti v1.6, zejména `trustedAuthorities`, identifikátory služby, lifecycle metadata a povinnosti schématu. Nezaměňovat errata s dokončenou normativizací write API.
2. **Prezentace a privacy:** testovat autentizaci každého `DocRequest` a skutečnou granularitu Disclosure u [[SD-JWT-VC]]. Zobrazovaný consent nesmí slibovat užší rozsah než skutečně odeslaný payload.
3. **Issuance:** vynucovat DPoP i na `token_type`, správně oddělovat identity issueru a Authorization Serveru a chránit původní typ credentialu při obnově.
4. **iOS integrace:** aktualizovat DCQL `multiple: true` consent a zvážit explicitní policy pro kontrolu `iss`; ověřit souběžné issuance a zákaz logování hodnot claims.

V samotném [[ARF]] nebyla ve sledovaném týdnu sloučena věcná změna. Nejvýznamnější dokumentační novinkou je tedy **TS5 v1.6.1**, zatímco většina ostatních změn zpřísňuje bezpečnostní a privacy vlastnosti referenčního stacku.
