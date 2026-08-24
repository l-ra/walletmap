# Týdenní EUDI Wallet přehled — 10.–17. srpna 2026

Tento týden byl ve **standardech a ARF klidný**: v `eudi-doc-architecture-and-reference-framework` ani `eudi-doc-standards-and-technical-specifications` jsem za sledované období nenašel věcný merge. Vývoj se přesunul hlavně do referenčních knihoven. Nejpodstatnější jsou tři věci: **uvolnění validace Key Attestation v OpenID4VCI**, konsolidace **WRPRC/issuer registration validation v Android Wallet Core 0.30.0** a objevení poměrně závažného otevřeného problému s **pre-authorized code při více Authorization Serverech**.

## Sloučené změny

### 1. Key Attestation: OpenID4VCI knihovna už nevynucuje TS3 profil

Dne **11. srpna** byl sloučen [JVM OpenID4VCI PR #574 – Relax KeyAttestationJWT checks](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-openid4vci-kt/pull/574).

Je to architektonicky dost významná změna. Při parsování `KeyAttestationJWT` knihovna nově odstranila:

* kontrolu, že podpisový algoritmus patří mezi algoritmy povolené TS3,
* automatickou kontrolu kompletního TS3 payloadu,
* LoA kontroly `key_storage` a `user_authentication`,
* povinnost, aby payload přímo odpovídal `KeyAttestationJWTClaims`.

Základní parser nyní v zásadě kontroluje především správný typ podepsaného JWT a existenci `attested_key`. TS3 datový model `KeyAttestationJWTClaims` zůstává, takže aplikace může attestaci explicitně dekódovat jako TS3 profil.

**Co to podle mě znamená:** není to změna TS3 ve smyslu „LoA High už není potřeba“. Je to další krok ve stejném architektonickém směru, který jsme viděli u Client Attestation a WRPRC: **generická OpenID4VCI knihovna přestává být policy/trust validátorem**.

To je důležité pro vlastní implementaci. Pokud dnes spoléháte na to, že konstrukce:

```text
KeyAttestationJWT(jwt)
```

sama znamená „toto je validní EUDI TS3 Key Attestation“, po této změně to už neplatí. Potřebujete samostatně určit vrstvu, která ověří například:

```text
signature / x5c trust
       ↓
TS3 claims profile
       ↓
key_storage
user_authentication
certification
LoA / attack resistance
status
       ↓
attested_key
```

Samotný `attested_key` je nyní spíš **syntaktická podmínka použitelnosti** než důkaz požadované kvality key storage.

---

### 2. Android Wallet Core 0.30.0: WRPRC se dostává do „hotové“ architektury

Dne **13. srpna** byl vydán přes [PR #392 – Release 0.30.0](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/392) nový Wallet Core.

Tahle release je důležitější než samotné číslo verze. Konsoliduje předchozí jednotlivé PR kolem registračních certifikátů do společného modelu pro **presentation i issuance**.

Architektura je nyní velmi explicitní:

```text
                Registration Certificate
                         │
              ┌──────────┴──────────┐
              │                     │
        authentication           evaluation
              │                     │
        parse WRPRC            binding
        verify signature       expiry
        verify chain           status
        establish trust        revocation
                               scope
```

A hlavně:

> **Authentication provádí knihovna a nelze ji nahradit custom policy. Evaluation lze nahradit vlastní implementací.**

To je podle mě nejdůležitější vyjasnění trust modelu za poslední týdny.

Android implementace teď používá stejný koncept ve dvou směrech:

| Presentation                        | Issuance                                        |
| ----------------------------------- | ----------------------------------------------- |
| WRP registration certificate        | issuer registration certificate                 |
| WRPAC autentizuje RP                | signed issuer metadata autentizují issuer       |
| `credentials` = co smí RP požadovat | `provides_attestations` = co smí issuer vydávat |
| kontrola **over-asking**            | kontrola **over-providing**                     |
| OpenID4VP / mdoc / DC API           | OpenID4VCI                                      |

Knihovna porovnává registrační certifikát i s konkrétní operací.

### Prakticky velmi zajímavé: revocation failure je fail

Default evaluator kontroluje:

1. binding na access certificate,
2. expiraci,
3. přítomnost status-list reference,
4. stav v revocation/status listu,
5. scope.

Pokud revocation status **nelze zjistit**, není certifikát považován za validovaný. To je bezpečnější než model „soft fail“.

### A ještě jeden nenápadný detail

`WrpRegistrationPolicy.Enabled` je default, ale samotná konfigurace `Enabled` nestačí. Pokud wallet nemá nakonfigurovaný trust source, nemá vůči čemu ověřit poskytovatele WRPRC a výsledek se vůbec nevystaví.

Z implementačního hlediska tedy:

```text
WRPRC support enabled
        ≠
WRPRC trust configured
        ≠
WRPRC enforcement actually working
```

Pro produkční wallet bude zásadní správně připojit LoTE / Trusted List pro kontexty:

```text
WalletRelyingPartyRegistrationCertificate
WalletRelyingPartyRegistrationCertificateStatus
```

---

### 3. iOS: issuer registration se kontroluje už při resolve credential offer

Také **11. srpna** byl sloučen [iOS WalletKit PR #443](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/443).

`OfferedIssuanceModel` nyní může obsahovat:

```swift
wrpVciRegistrationPolicy
wrpVciWarnings
```

tedy informace z registračního certifikátu issueru a výsledky policy validation **už při resolution credential offeru**, ještě před samotným issuance.

To je UXově i bezpečnostně důležité:

```text
scan/open credential offer
        ↓
resolve issuer + metadata
        ↓
validate issuer registration
        ↓
zobraz:
  kdo credential vydává
  k čemu je registrován
  případné warnings
        ↓
uživatel pokračuje
        ↓
issuance
```

Wallet tedy nemusí zjistit problematický issuer až poté, co už proběhla authorization/issuance část.

Je tu vidět konvergence Androidu a iOS na podobný koncept: **registration check jako pre-operation authorization input**, ne pouze post-hoc informace.

---

### 4. iOS WalletKit: credential obrázky už neobcházejí TLS policy aplikace

Dne **14. srpna** byl sloučen [PR #444](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/444). Je menší, ale bezpečnostně praktický.

Credential display metadata mohou obsahovat vzdálené logo/background image. Wallet je při issuance stahuje a ukládá jako `data:` URI, mimo jiné proto, aby issuer později nemohl sledovat, kdy uživatel credential zobrazil.

Jenže stahování používalo:

```swift
URLSession.shared
```

a tím obcházelo networking vrstvu dodanou host aplikací. Takže například vlastní:

* certificate pinning,
* TLS policy,
* proxy/network controls

se na stahování issuer-controlled obrázku nevztahovaly.

Nově se používá stejný injected `Networking` jako pro ostatní OpenID4VCI komunikaci.

To bych určitě převzal i do vlastní architektury: **všechno, co pochází z issuer metadata a způsobuje HTTP request, musí projít stejným security networking stackem**, nejen token/credential endpointy.

---

## Otevřené návrhy

### ⚠️ Swift OpenID4VCI: pre-authorized code může skončit u špatného Authorization Serveru

Za nejzávažnější otevřený návrh považuji draft [PR #316](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/316).

Řeší situaci, kdy credential offer obsahuje oba granty:

```json
{
  "grants": {
    "authorization_code": {
      "authorization_server": "https://as1.example"
    },
    "urn:ietf:params:oauth:grant-type:pre-authorized_code": {
      "authorization_server": "https://as2.example",
      "pre-authorized_code": "..."
    }
  }
}
```

Dosavadní model držel pouze jedny `authorizationServerMetadata`. Výsledkem mohlo být, že:

```text
pre-authorized code určený AS2
             │
             ▼
     token endpoint AS1
```

tedy **odeslání credential-grantu špatnému Authorization Serveru**.

PR proto odděluje:

```swift
authorizationCodeServerMetadata
preAuthorizationCodeServerMetadata
```

a pre-authorized flow používá vlastní token endpoint. PR je stále **draft**, takže změna ještě není finální.

Tohle není jen interoperability bug. Pokud jsou AS skutečně různé subjekty, jde potenciálně o **únik bearer-like pre-authorized code** k nesprávné protistraně.

Pro vlastní implementaci bych už nyní modeloval Authorization Server **per grant**, nikoliv per credential offer.

---

### OpenID4VP Android: `fragment` / `query` response může wallet zahodit

Stále otevřený je [Android Wallet Core PR #390](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/390), založený **11. srpna**.

U OpenID4VP s:

```text
response_mode=fragment
```

nebo

```text
response_mode=query
```

je výsledný `vp_token` součástí redirect URI. Wallet ale při `DispatchOutcome.RedirectURI` poslala pouze událost `ResponseSent` a vlastní redirect URI dál nepředala.

Důsledek je podstatný:

```text
verifier → wallet
           │
           │ user approves
           ▼
     VP response generated
           │
           X   redirect discarded
           
verifier nikdy nedostane vp_token
```

Navrhovaná oprava místo toho emituje:

```kotlin
TransferEvent.Redirect(outcome.value)
```

a dovolí aplikaci redirect skutečně otevřít.

Je to dobrá připomínka, že testovat jen `direct_post` nestačí. Pokud chcete podporovat celý OpenID4VP response-mode prostor, je třeba zvlášť integračně testovat `query`, `fragment`, `direct_post` a jejich JWT varianty.

---

## Co bych tento týden změnil v implementačním návrhu

Největší architektonický signál je podle mě stále zřetelnější oddělení **protokolové syntaktické validace, trust establishment a business/policy authorization**.

Pro Key Attestation bych dnes navrhoval:

```text
OID4VCI library
     │
     ├── parse Key Attestation
     ├── extract attested_key
     │
     ▼
EUDI trust/profile layer
     │
     ├── typ
     ├── signature
     ├── x5c / Wallet Provider trust
     ├── TS3 claims
     ├── key_storage
     ├── user_authentication
     ├── certification
     ├── status
     └── LoA
```

A pro registrační certifikáty:

```text
WRPAC / signed issuer metadata
            +
           WRPRC
            │
            ▼
       authentication
 signature + chain + trust
            │
            ▼
         binding
     expiry + status
            │
            ▼
      scope evaluation
      ┌─────┴─────┐
 presentation   issuance
 over-asking   over-providing
```

**Nejdůležitější novinka týdne pro váš dřívější problém s PID/SUA a vazbou klíčů je #574:** samotná referenční OpenID4VCI knihovna se ještě více vzdaluje představě, že `KeyAttestationJWT` automaticky znamená „EUDI-trusted key“. Pokud chcete při vydání SUA získat silný důkaz o vlastnostech klíče a Wallet Providera, bude nutné explicitně implementovat **TS3/LoTE trust validation nad Key Attestation**, nikoliv jen věřit tomu, že ji OpenID4VCI SDK přijalo.
