---
title: "Týdenní EUDI Wallet přehled — 24.–31. srpna 2026"
description: "Bez nových ARF/TS revizí; hard enforcement issuer entitlementů v Android Wallet Core, opravy OpenID4VP trust validace a zpřesnění OpenID4VCI u více Authorization Serverů."
pubDate: 2026-08-31
tags: [arf, tydenni-prehled, wrprc, oid4vp, oid4vci]
draft: false
---

## Týdenní EUDI Wallet přehled — 24.–31. srpna 2026

Tento týden nepřinesl novou revizi **ARF ani technických specifikací TS**; v obou dokumentačních repozitářích jsem za sledované období nenašel věcný merge. Významné změny jsou ale v implementacích a několik z nich má přímý bezpečnostní nebo interoperabilní dopad: oprava trust validace OpenID4VP, zpřísnění kontroly issuer entitlementů a řešení několika méně obvyklých scénářů OpenID4VCI.

### Sloučené změny

**1. Android Wallet Core: chybějící issuer entitlement je nově hard failure.**
[PR #404](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/404) byl sloučen **25. srpna**. Dosud se `entitlements` z registračního certifikátu issueru sice parsovaly, ale při issuance se fakticky nevyhodnocovaly. Provider tedy mohl projít validací i tehdy, když nebyl registrován jako PID Provider nebo příslušný EAA Provider.

Nová posloupnost kontroly issuer WRPRC je prakticky:

```text
WRPRC trust / signature
        ↓
binding na issuer
        ↓
expiry + status + revocation
        ↓
ENTITLEMENT
        ↓
provides_attestations
```

PID vyžaduje `PID_Provider`; ostatní attestace musí být kryty alespoň jedním z `QEAA_Provider`, `PUB_EAA_Provider` nebo `Non_Q_EAA_Provider`. Pokud entitlement chybí, výsledek je `ENTITLEMENT_MISSING` a issuance se **blokuje**, nejde jen o warning.

To je významné vyjasnění předchozího modelu: `provides_attestations` samo o sobě není dostatečné. Registrace musí potvrdit jak **roli providera**, tak konkrétní rozsah vydávaných attestací.

---

**2. JVM OpenID4VP: oprava skutečné trust-validation chyby.**
[PR #498](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-openid4vp-kt/pull/498), sloučený **28. srpna**, opravuje dvě nepříjemné věci v autentizaci verifieru.

U Verifier Attestation se dříve volalo `verify(trust)`, ale kód pouze zachytil výjimku. Pokud verifier korektně vrátil `false`, výsledek nebyl explicitně odmítnut. Nově je `false` skutečně kontrolováno pomocí `ensure(isTrusted)`.

Současně se zpřísnilo zpracování `x5c`. Předchozí:

```text
mapNotNull(parse certificate)
```

mohlo vadný certifikát v chainu tiše vynechat. Nově musí být parsovatelný **celý předložený chain**, jinak je JAR odmítnut jako `Invalid x5c`.

Tohle bych klasifikoval jako **bezpečnostně relevantní opravu**, ne běžný bugfix. Pokud používáte Kotlin OpenID4VP library s `verifier_attestation`, `x509_san_dns` nebo jiným X.509 client authentication mechanismem, upgrade dává smysl prioritizovat.

---

**3. JVM OpenID4VP omezuje clock skew při validaci JWT na maximálně 60 sekund.**
[PR #500](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-openid4vp-kt/pull/500), rovněž z **28. srpna**, zavádí horní limit `clockSkew = 60 s` pro:

* signed authorization requests / JAR,
* Verifier Attestation JWT.

Default zůstává **15 sekund**, ale konfigurací už není možné nastavit arbitrárně vysoké okno.

Je to drobná změna API, ale správné security hardening: příliš velký clock skew fakticky prodlužuje přijatelnost JWT mimo jeho deklarované časové okno.

---

**4. OpenID4VCI: kombinace dvou grantů s různými Authorization Servery je v JVM zatím explicitně odmítnuta.**
Velmi zajímavý je [JVM OpenID4VCI PR #576](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-openid4vci-kt/pull/576), sloučený **24. srpna**.

Pokud Credential Offer obsahuje současně:

```text
authorization_code      → AS-A
pre-authorized_code     → AS-B
```

knihovna nyní nabídku odmítne jako `InvalidGrants`. Důvod je implementační: resolver dnes načítá metadata jednoho Authorization Serveru, takže bez tohoto omezení hrozilo použití pre-authorized code na nesprávném token endpointu.

To je pozoruhodné ve vztahu k otevřenému Swift PR #316, který řeší **stejný problém jinou cestou**: místo odmítnutí chce držet Authorization Server metadata zvlášť pro jednotlivé granty. Swift PR stále zůstává draftem. ([GitHub][1])

Máme tedy momentálně potenciální platformní rozdíl:

```text
Kotlin/JVM:
2 granty + 2 různé AS → reject

navrhovaný Swift:
2 granty + 2 různé AS → podporovat, AS držet per grant
```

Pro interoperabilní wallet bych datový model určitě navrhoval **per grant**, i když JVM reference implementation zatím zvolila konzervativní odmítnutí.

---

**5. Android Wallet Core správně používá `credential_identifiers` z token response.**
[PR #402](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/402), sloučený **24. srpna**, opravuje issuance v případě, kdy Authorization Server vrátí `credential_identifiers`.

Dříve wallet bez ohledu na token response vytvářel `ConfigurationBased` credential request. Nově:

```text
bez credential_identifiers
    → ConfigurationBased

s credential_identifiers
    → IdentifierBased
```

A pokud k jedné credential configuration patří více identifikátorů, vznikne **samostatný credential request a samostatná credential instance pro každý dataset**.

To je relevantní například tam, kde jedna konfigurace reprezentuje více uživatelem autorizovaných credential datasetů.

### Otevřené návrhy

Za nově otevřené věcné PR tohoto týdne stojí za pozornost **JVM OpenID4VCI #578 – “Introduce configuration option for supported Grants”**, otevřený **24. srpna**. Jeho směr je zajímavý hlavně v návaznosti na #576: wallet library má získat možnost explicitně deklarovat, které grant typy podporuje. PR je stále otevřený, takže bych zatím jeho API nepovažoval za stabilní. GitHub jej aktuálně uvádí mezi pěti otevřenými PR tohoto repozitáře. ([GitHub][2])

Stále otevřený a podle mě důležitější zůstává již zmíněný **Swift OpenID4VCI #316** pro různé Authorization Servery u `authorization_code` a `pre-authorized_code`. Je stále ve stavu **Draft / Open** a čeká na review. ([GitHub][1])

V JVM OpenID4VP zůstává dlouhodobě otevřený také [#438 – Add aud validation for JAR requests](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-openid4vp-kt/pull/438), označený dokonce `do not merge`; nejde tedy o nový návrh tohoto týdne a nepočítal bych s ním při plánování bez dalšího vývoje. ([GitHub][3])

### Co z toho plyne pro implementátory

Nejpodstatnější tento týden není nový standard, ale **zpřesňování enforcementu už existujících pravidel**.

Za prvé, issuer registration bych dnes modeloval minimálně jako tři nezávislé osy:

```text
trust / autenticita WRPRC
        +
entitlement providera
        +
scope konkrétních attestací
```

Úspěch jedné z nich nesmí implikovat ostatní.

Za druhé, při OpenID4VP bych nepovažoval návrat z obecné `verify()` funkce za „validní, pokud nevyhodila výjimku“. Tento týden se ukázalo přesně, proč musí být výsledek trust callbacku explicitně kontrolován.

Za třetí, OpenID4VCI Credential Offer bych interně určitě nereprezentoval jako:

```text
offer → jeden Authorization Server
```

ale spíše:

```text
offer
 ├─ authorization_code grant → AS metadata
 └─ pre-authorized grant     → AS metadata
```

I když Kotlin SDK dnes rozdílné AS odmítá, OpenID4VCI implementace už evidentně narážejí na případy, kde se tento předpoklad rozpadá.

A za čtvrté, `credential_identifiers` z token response nejsou jen informativní metadata. Pokud je AS vrátí, ovlivňují **konkrétní tvar následného credential requestu** a mohou znamenat více samostatných credential datasets.

Celkově tedy týden 24.–31. srpna nepřinesl nový ARF/TS baseline, ale přinesl několik změn, které bych považoval za důležité pro produkční implementaci: **hard enforcement issuer entitlementů, opravu verifier trust validace a zpřesnění OpenID4VCI issuance state modelu.**

[1]: https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/316 "grants: both with different authorization_servers can leak pre-authorized code to the wrong token endpoint by dtsiflit · Pull Request #316 · eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift · GitHub"
[2]: https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-openid4vci-kt/pulls "Pull requests · eu-digital-identity-wallet/eudi-lib-jvm-openid4vci-kt · GitHub"
[3]: https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-openid4vp-kt/pulls "Pull requests · eu-digital-identity-wallet/eudi-lib-jvm-openid4vp-kt · GitHub"
