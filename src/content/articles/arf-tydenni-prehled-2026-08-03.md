---
title: "Týdenní EUDI Wallet přehled — 3.–10. srpna 2026"
description: "Korekce TS6 po legislativní úpravě registrace WRP, finalizace TS7 a validace WRPRC issuerů v Android/iOS wallet core."
pubDate: 2026-08-10
tags: [arf, tydenni-prehled, wrprc, ts6, ts7]
draft: false
---

Tento týden byl obsahově výrazně klidnější než předchozí vlna kolem ARF 3.0.0, ale jsou tu **tři změny s poměrně velkým implementačním dopadem**: korekce TS6 po nové legislativní úpravě registrace WRP, dokončení TS7 a hlavně přesun validace registračních certifikátů issuerů do skutečných Android/iOS wallet core implementací.

## Sloučené změny

### TS6: korekce nového modelu `WalletRelyingPartyService`

Dne **4. srpna** byl sloučen [TS6 PR #629](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/pull/629), který specifikaci znovu srovnal s Annex I [[CIR]] 2025/848 ve znění změn z [[CIR]] 2026/1730. Zajímavé je, že některé atributy zavedené v předchozí refinement verzi byly odstraněny právě proto, že pro ně autoři nenašli dostatečný právní základ: zejména `serviceIdentifier` a `serviceTradeName`. Současně byl nejprve odstraněn `providesAttestations`, doplněno `usesIntermediary` a nové propojení služby intermediary na obsluhovanou WRP.

Hned **5. srpna** ale následoval [PR #631](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/pull/631): `providesAttestations` byl **vrácen zpět s vysvětlující poznámkou**, opravilo se pojmenování atributu souvisejícího s bodem 16 právního základu a vznikla opravná verze **TS6 1.2.1**. To znamená, že minulý závěr „registrace se jednoznačně přesouvá na samostatný objekt služby“ je potřeba trochu zmírnit: koncept služby zůstává užitečný v TS5/API vrstvě, ale **není možné automaticky předpokládat, že každá vlastnost služby je zároveň zákonem požadovaným registračním údajem**.

### TS7 byl finalizován jako 1.0

[PR #630](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/pull/630) byl sloučen **4. srpna**. Vedle finalizace dokumentu zapracovává aktualizovaný právní stav registrace WRP. Výrazný detail: v aktualizovaném textu čl. 8 [[CIR]] 2025/848 už není vydávání [[WRPRC]] národní volbou „Member States may authorise…“, ale členský stát **shall authorise** alespoň jednu autoritu pro vydávání [[WRPRC]] a má zajistit jejich automatizované vydání bez zbytečného odkladu po registraci. To dále posouvá [[WRPRC]] z volitelného rozšíření do infrastruktury, se kterou musí implementátor evropské peněženky prakticky počítat.

### Android Wallet Core už validuje WRPRC issueru při OpenID4VCI

[PR #387](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/387), sloučený **4. srpna**, přidává validaci registračního certifikátu Credential Issueru přeneseného v podepsaných issuer metadata jako `issuer_info` podle ETSI TS 119 472-3. Výsledek validace a warnings jsou zpřístupněny tak, aby mohl být uživatel informován ještě před pokračováním issuance.

Zvlášť zajímavé je zde vyjasnění architektury. Wallet Core dokumentuje **dvě oddělené fáze**: nejprve authentication [[WRPRC]] — parsování, podpis a trust chain — a teprve potom evaluation proti konkrétní operaci. První fázi nelze nahradit vlastní policy; vlastní policy lze použít pro druhou. To dobře doplňuje minulý týden pozorovaný trend, kdy nízkoúrovňové [[OID4VP]]/[[OID4VCI]] knihovny přestávaly samy interpretovat raw [[WRPRC]]: **protokolová knihovna může být vůči [[WRPRC]] téměř opaque, ale vyšší Wallet Core stále musí vytvořit kryptograficky důvěryhodný registrační kontext před tím, než začne jeho obsah používat k autorizaci.**

Stejný posun nastal na **iOS**. [WalletKit PR #438](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/438), také z **4. srpna**, implementuje validaci WRP registration certificate během [[OID4VCI]] issuance a rozšiřuje návratové struktury o validační warnings. Prakticky tedy Android i iOS reference stack konvergují na model „issuer metadata → issuer_info/[[WRPRC]] → autentizace registrace → policy evaluation → warnings/deny“.

### Důležitá oprava scope kontroly WRPRC versus DCQL

[Android Wallet Core #388](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/388), sloučený **5. srpna**, opravuje false positive „over-asking“. Například registrační certifikát může povolit `["nationalities", null]`, tedy libovolný prvek pole, zatímco verifier požádá `["nationalities", 0]`. Starý kód oba claim paths převáděl na prosté stringy a ztrácel význam indexu/wildcardu. Nově je cesta modelována typově — claim name, konkrétní array index nebo all-array-elements — a containment odpovídá pravidlům [[OID4VP]] §7. To je malá změna názvem, ale velmi důležitá pro implementaci porovnání **„co je registrováno“ vs. „co právě požaduje DCQL“**.

V **ARF** jsem za toto sedmidenní období nenašel žádný nový věcný merge; po předchozí velké vlně ARF 3.0.0 je hlavní pohyb nyní ve specifikacích a reference implementation. Stejně tak v `eudi-srv-trust-validator` byly v tomto týdnu jen CI/dependency aktualizace, které do přehledu věcných změn nezahrnuji.

## Otevřené návrhy, které stojí za sledování

Nejdůležitější nový návrh je draft [JVM OpenID4VCI #574 – Relax KeyAttestationJWT checks](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-openid4vci-kt/pull/574), otevřený **5. srpna**. Navrhuje odstranit z obecného parseru Key Attestation JWT kontrolu, že podpisový algoritmus je jeden z algoritmů TS3, odstranit povinné ověřování struktury payloadu a LoA a vyžadovat v zásadě jen přítomnost `attested_key`. TS3 model claims by zůstal k dispozici těm, kdo chtějí [[KA|attestaci]] explicitně dekódovat a validovat podle TS3. PR je stále **draft**, takže bych podle něj zatím neměnil produkční validaci.

Druhým otevřeným PR, který byl tento týden znovu aktualizován, je [Android Wallet Core #357](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/357). Implementuje [[OID4VCI]] §11 Credential Issuer Notification: pokud issuer poskytne `notificationId`, wallet po úspěšném uložení credentialu odešle `Accepted`, při klientské chybě `Failed`; notifikace je non-fatal fire-and-forget. PR vznikl už v červnu, ale byl aktualizován **5. srpna** a stále není sloučen.

## Co bych z toho promítl do návrhu implementace

1. **Nezmrazoval bych vlastní registrační datový model podle jedné verze TS6 z přelomu července/srpna.** `serviceIdentifier`, `serviceTradeName` a `providesAttestations` prošly během několika dnů změnami právě kvůli otázce právního základu. Pro systém bych oddělil „minimální registrační dataset daný [[CIR]]“ od rozšiřujících technických atributů TS5/registru.

2. **[[WRPRC]] validaci bych explicitně rozdělil na authentication a authorization/evaluation.** Nejdříve podpis, řetězec, trust anchor a binding k access certificate; teprve nad autentizovaným obsahem porovnání entitlementů, `providesAttestations`, intended use a DCQL. Tento návrh nyní velmi zřetelně potvrzuje Android Wallet Core.

3. **DCQL paths neukládat jako string.** Potřebujete zachovat semantiku claim name / array index / wildcard `null` a implementovat containment podle [[OID4VP]]. Jinak bude registrační policy neprávem odmítat legitimní požadavky nebo, v horším případě, špatně vyhodnocovat širší scope.

4. **Pro issuance už bych s issuer [[WRPRC]] v `issuer_info` počítal jako s reálnou součástí wallet architektury**, nikoliv jen budoucím standardem. Android i iOS reference implementation jej tento týden dostaly do Wallet Core.

5. **S uvolněním validace Key Attestation bych zatím počkal.** #574 pokračuje ve filozofii „transport/protocol library nemá být policy engine“, ale pokud bude sloučen, bude o to důležitější přesně určit, ve které vyšší vrstvě se TS3 signature algorithm, LoA a další trust podmínky skutečně kontrolují.

Nejvýznamnější posun týdne bych tedy shrnul jako: **[[WRPRC]] už není jen věc specifikace — stává se skutečným autorizačním vstupem referenčních walletů při issuance, přičemž se současně zpřesňuje, které registrační údaje mají skutečný právní základ a jak přesně se mají porovnávat s DCQL.**
