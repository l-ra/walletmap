---
title: "Týdenní EUDI Wallet přehled — 2.–9. listopadu 2026"
description: "Zpřísnění bezpečnosti referenčních peněženek, trust a revokace, OpenID4VP minimalizace dat a OpenID4VCI issuer binding."
pubDate: 2026-11-09
tags: ["arf", "tydenni-prehled", "oid4vp", "oid4vci", "trust", "bezpecnost"]
draft: false
---

Týden 2.–9. listopadu nepřinesl nové sloučené změny v repozitářích ARF ani Standards & Technical Specifications. Výrazné změny však proběhly v referenčních implementacích: ochrana před nadměrným zpřístupněním atributů, důslednější autentizace čtečky, revokace certifikátů, vazba šifrování na session transcript a bezpečnostní defaulty Android Wallet Core. Níže jsou odděleny sloučené změny od dosud otevřených návrhů.

## Sloučené změny

### Android Wallet Core 0.32.0: přísnější bezpečnostní defaulty

[Release PR #473](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/473), sloučený 6. listopadu, shrnuje breaking changes: issuer trust, autentizace signera [[LoTE]] a trust registračních certifikátů jsou nyní vynucovány jako výchozí chování. Sestavení wallet konfigurace selže, pokud chybí potřebný trust. Autentizace uživatele pro dokumentové klíče je standardně `Required`. Integrace musí zohlednit také Kotlin 2.4.20 a úpravu packaging konfigurace pro BouncyCastle 1.86.

**Dopad:** při aktualizaci nestačí změnit závislost. Je nutné zkontrolovat konfiguraci issuer, registration a [[LoTE]] trust anchorů a uživatelskou autentizaci klíčů.

### iOS: explicitní prázdný výběr už nesmí odhalit celý dokument

V [ISO 18013 data transfer #154](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-iso18013-data-transfer/pull/154), sloučeném 5. listopadu, byl odstraněn nebezpečný fallback: prázdný výběr položek dříve mohl znamenat zveřejnění všech atributů dokumentu. Explicitně prázdný výběr nyní nezveřejní žádné datové elementy, zatímco nepřítomná selekce se nadále vyhodnocuje podle požadavku verifieru.

Tato oprava je významná pro princip minimalizace údajů v [[OID4VP]] i proximity prezentacích. Odlišujte `nil` (výběr neurčen) od prázdné množiny (výslovně nevybráno nic).

### iOS Wallet Kit: autentizace BLE readeru a vazba [[WRPRC]]

[Wallet Kit #541](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/541), sloučený 6. listopadu, odmítá BLE požadavky, u nichž reader authentication selhala. Registrační [[WRPRC]] se váže pouze na úspěšně validovaný reader certifikát; nepodporované `readerAuthAll` požadavky se odmítají. Požadavky bez reader authentication se nadále mohou zpracovat podle příslušné policy. Autoři uvádějí osm úspěšných testů, nikoli však end-to-end test na zařízení.

### iOS Wallet Kit: správný klíč v mdoc session transcript

[Wallet Kit #547](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/547), sloučený 5. listopadu, opravuje vazbu session transcript a reader key pro device MAC na `responseEncryptionSpecification.clientKey` — tedy klíč skutečně použitý pro šifrování odpovědi. U šifrované odpovědi transcript obsahuje thumbprint tohoto klíče; u nešifrované je hodnota `null`. Nesprávná vazba mohla způsobit neinteroperabilní či nevalidní device authentication.

### ETSI trust: iOS CRL revocation mimo SecTrust

[ETSI 1196x2 #218](https://github.com/eu-digital-identity-wallet/eudi-lib-kmp-etsi-1196x2/pull/218), sloučený 6. listopadu, opravuje revokační kontrolu na iOS. Původní kombinace `kSecRevocationRequirePositiveResponse` a `Security.framework` nevracela pozitivní výsledek pro CRL, takže konfigurace `crl` a smíšené strategie odmítaly i validní řetězce. Nově se CRL a kombinované strategie vyhodnocují v PKIX bridge podle pořadí zvolené metody.

### Status List: `ttl` běží od stažení, nikoli od `iat`

[Swift Statium #66](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-statium-swift/pull/66), sloučený 9. listopadu, opravuje interpretaci `ttl` podle návrhu Token Status List: jde o dobu cache od okamžiku stažení, nikoli o interval od `iat` tokenu. Původní logika mohla čerstvě stažený seznam nesprávně odmítnout. Cache musí současně respektovat `exp`, pokud je uvedeno.

### Referenční aplikace: bezpečnostní hardening a proximity session

[Android reference wallet #748](https://github.com/eu-digital-identity-wallet/eudi-app-android-wallet-ui/pull/748) a [iOS reference wallet #603](https://github.com/eu-digital-identity-wallet/eudi-app-ios-wallet-ui/pull/603), obě sloučené 6. listopadu, sjednocují pravidla pro session, autentizaci, trust rozhodování, vstupní odkazy a životní cyklus osobních dat. Integrátoři by měli projít aktualizované konfigurační a go-live návody.

[Android Wallet Core #470](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/470) navíc zabraňuje tomu, aby nové NFC přiložení převzalo již běžící proximity prezentaci zahájenou přes QR. [#471](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/471) synchronizuje rotované refresh tokeny u více dokumentů vydaných v rámci jedné autorizace.

## Otevřené návrhy

### [[OID4VP]]: DCQL bez `claims` nesmí znamenat všechny claims

[Wallet Kit #551](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/551) opravuje interpretaci credential query bez `claims`. Podle OpenID4VP 1.0 §6.4.1 nesmí být absence explicitních požadavků automaticky převedena na požadavek všech selektivně zpřístupnitelných atributů. Pro mdoc se má prezentovat dokument bez datových elementů; u SD-JWT VC zůstávají jen neselektivně zpřístupnitelné claims. Navazující [ISO 18013 #157](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-iso18013-data-transfer/pull/157) řeší prázdné `nameSpaces`. Oba návrhy jsou zatím otevřené.

### [[OID4VCI]]: kontrola issuer identity a `iss`

[Swift OpenID4VCI #401](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/401) navrhuje přesnou shodu `credential_issuer` z discovery metadata s Credential Issuer Identifierem, z něhož se sestavila well-known URL. [#402](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/402) přidává wallet-side policy pro RFC 9207 `iss`: `never`, `ifSupported`, `required`. Oba návrhy jsou otevřené; pro bezpečné deploymenty je podstatná striktní identitní vazba a vědomá volba policy.

### [[OID4VP]]: kontrola typu podepsaného Request Objectu

[Swift OpenID4VP #268](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vp-swift/pull/268) má pro všechny signed request objekty vynucovat JOSE `typ: oauth-authz-req+jwt`; dosud se tato kontrola aplikovala jen na preregistrované klienty. Návrh zatím není sloučen.

### Další návrhy pro produkční integrace

[Android Wallet Core #469](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/469) navrhuje CRL cache, protože opakovaná validace reader certifikátů může téměř pokaždé znovu stahovat CRL. [iOS Wallet Kit #520](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/520) chce odmítat vydané credentialy s chybějícími mandatory claims. [#553](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/553) připravuje vlastní authorization flow handler místo pevně daného `ASWebAuthenticationSession`. Jde o otevřené návrhy, nikoli potvrzené chování vydaných verzí.

## Dopad na implementátory

**První priorita je minimalizace údajů.** Ověřte regresní testy pro prázdný výběr atributů, DCQL credential query bez `claims` a více dokumentů v jedné prezentaci. Výchozí chování nesmí nikdy zaměnit „nic nevybráno“ za „zveřejnit vše“.

**Druhou prioritou je trust konfigurace při upgradu.** Android Wallet Core 0.32.0 vyžaduje explicitní issuer, registrační a [[LoTE]] trust. U iOS revokačních strategií otestujte CRL-only autority i kombinaci OCSP/CRL a správnou cache platnost status listů.

**Třetí prioritou je protokolové identity binding.** U [[OID4VCI]] ověřujte identitu issueru v discovery a `iss` authorization response; u [[OID4VP]] typ podepsaného requestu a vazbu mdoc session transcript na skutečný response encryption key. Otevřené PR zatím nejsou normativním ani implementačním baseline.
