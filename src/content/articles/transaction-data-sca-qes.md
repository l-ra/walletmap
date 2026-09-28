---
title: "transaction_data v OpenID4VP: jak EUDI Wallet potvrzuje platbu i QES"
description: "Detailní rozbor transakčních dat v OpenID4VP: opt-in typů, kryptografická vazba přes KB-JWT, bankovní SCA/SUA attestation a potvrzení QES včetně konkrétních struktur."
pubDate: 2026-09-28
tags: [oid4vp, eudiw, transaction-data, sca, sua, qes, platby, sd-jwt-vc]
draft: false
---

Běžná prezentace credentialu odpovídá na otázku **„kdo jste a co o sobě prokazujete?“**. Pro potvrzení platby nebo vytvoření kvalifikovaného elektronického podpisu to ale nestačí. Banka potřebuje důkaz, že uživatel nepotvrdil jen svou totožnost, ale **konkrétní částku a konkrétního příjemce**. Poskytovatel vzdáleného podpisu zase potřebuje vědět, že uživatel schválil **konkrétní dokumenty a konkrétní podpisovou operaci**.

[[OID4VP]] 1.0 proto obsahuje parametr `transaction_data`. [[Verifier|Ověřovatel]] může spolu s požadavkem na credential předat strukturovaná transakční data, peněženka je zobrazí uživateli a při souhlasu je kryptograficky sváže s prezentací. U [[SD-JWT-VC]] se toto svázání typicky projeví v **Key Binding JWT (KB-JWT)**.

Stejný základní mechanismus lze použít pro dvě velmi odlišné situace:

- **bankovní Strong Customer Authentication (SCA)** — zejména dynamic linking platby na částku a příjemce,
- **Qualified Electronic Signature (QES)** — žádost o vytvoření podpisu nebo schválení vytvoření QES v remote QSCD.

Článek rozebírá obecný mechanismus [[OID4VP]], potom profil TS12 pro elektronické platby a nakonec dva QES modely Cloud Signature Consortium. Příklady jsou záměrně konkrétní až na úroveň JSON a KB-JWT.

> **Nejdůležitější pointa:** `transaction_data` nejsou „další atributy credentialu“. Jsou to **data konkrétní operace**, která přicházejí v presentation requestu a jejichž přesná podoba se stane součástí kryptografického důkazu vytvořeného držitelem credentialu.

## Od prezentace identity k autorizaci konkrétní operace

Bez transakčních dat může [[RP]] požádat například o prezentaci credentialu:

```text
RP → Wallet:
    předlož credential X

Wallet → RP:
    credential X
    +
    důkaz držení privátního klíče
```

To prokazuje, že držitel disponuje credentialem a odpovídajícím klíčem. Samo o sobě to ale neříká, **co uživatel právě schválil**.

S `transaction_data` se tok mění:

```text
RP → Wallet:
    předlož credential X
    +
    potvrď transakci T

Wallet:
    1. ověří typ a strukturu T
    2. zobrazí T uživateli
    3. autentizuje uživatele podle pravidel use-case
    4. kryptograficky sváže prezentaci s T

Wallet → RP:
    credential X
    +
    holder-binding proof
    +
    důkaz vztahující se k přesně T
```

[[OID4VP]] přímo popisuje tento mechanismus jako vazbu mezi **identifikací/autentizací uživatele** a **autorizací uživatelem**. Jako příklady uvádí dokončení platby a podepsání konkrétních dokumentů pomocí QES.

## 1. Co přesně obsahuje `transaction_data`

Parametr `transaction_data` je v Authorization Requestu nepovinný, ale pokud je použit, je to **neprázdné pole řetězců**. Každý řetězec je base64url kódovaný JSON objekt.

Dekódovaný objekt má minimálně:

```json
{
  "type": "https://example.org/transaction/type",
  "credential_ids": ["credential_query_1"]
}
```

`type` určuje sémantiku a strukturu objektu. Samotný [[OID4VP]] konkrétní typy nedefinuje — ty přidávají navazující standardy a rulebooky.

`credential_ids` odkazuje na `id` credential query v DCQL:

```json
{
  "dcql_query": {
    "credentials": [
      {
        "id": "credential_query_1",
        "format": "dc+sd-jwt",
        "meta": {
          "vct_values": ["https://issuer.example/credential/type"]
        }
      }
    ]
  },
  "transaction_data": [
    "eyJ0eXBlIjoi..."
  ]
}
```

Tato vazba je důležitá. Jedna [[OID4VP]] žádost může požadovat více credentialů, ale konkrétní transakční objekt říká, **který z požadovaných credentialů smí transakci autorizovat**.

Pokud `credential_ids` obsahuje více položek, peněženka podle [[OID4VP]] použije pro autorizaci transakce **jeden** z referencovaných credentialů.

### `credential_ids` není bankovní ani CSC `credentialID`

Názvy jsou zrádně podobné.

```text
OID4VP credential_ids
    = lokální ID query uvnitř konkrétního presentation requestu

CSC credentialID
    = stabilnější identifikátor podpisového credentialu
      u remote signing service provideru
```

Například:

```json
{
  "dcql_query": {
    "credentials": [
      {
        "id": "qes_service_attestation",
        "format": "dc+sd-jwt"
      }
    ]
  }
}
```

a:

```json
{
  "type": "https://cloudsignatureconsortium.org/2025/qes-approval",
  "credential_ids": ["qes_service_attestation"]
}
```

neříká, že podpisový klíč u [[QTSP]] má ID `qes_service_attestation`. Jde jen o referenci na credential query v této jediné [[OID4VP]] transakci.

## 2. `transaction_data` je výjimka z pravidla „neznámé parametry ignoruj“

To je bezpečnostně zásadní.

U běžných neznámých parametrů Authorization Requestu může OAuth/OpenID implementace parametr ignorovat. [[OID4VP]] ale pro `transaction_data` stanoví opačné chování:

- peněženka, která `transaction_data` vůbec nepodporuje, **musí request odmítnout**,
- peněženka musí odmítnout request i tehdy, pokud nezná **kterýkoli** požadovaný typ,
- odmítne i známý typ s neznámými poli, špatnými typy, neplatnými hodnotami, chybějícími povinnými poli nebo neplatným `credential_ids`.

Standardní chyba je:

```text
invalid_transaction_data
```

Důvod je zřejmý: kdyby peněženka transakční část tiše zahodila a provedla obyčejnou prezentaci, [[RP]] by mohl prezentaci interpretovat jako autorizaci operace, kterou uživatel ve skutečnosti nikdy nepotvrdil.

## 3. Co znamená „opt-in“

Pojem **opt-in** se v této oblasti používá pro několik různých vrstev. Je užitečné je oddělit.

### Vrstva A — podpora `transaction_data` v peněžence

Základní [[OID4VP]] říká: pokud peněženka parametr nepodporuje, request s `transaction_data` nesmí zpracovat jako obyčejnou prezentaci.

To je první fail-closed hranice.

### Vrstva B — konkrétní podporované typy

Implementace musí vědět, jak konkrétní `type`:

- parsovat,
- validovat,
- zobrazit,
- zpracovat,
- kryptograficky vrátit v prezentaci.

Android Wallet Core od Evropské komise to od PR [#418](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/418) řeší explicitní konfigurací:

```kotlin
val config = OpenId4VpConfig.Builder()
    .withTransactionDataTypes(
        TransactionDataType.QES_APPROVAL,
        TransactionDataType.QES
    )
    .build()
```

Dokud wallet typ nedeklaruje, nic se pro něj nemění. Request s nedeklarovaným typem skončí `invalid_transaction_data`.

Toto je **implementační opt-in** Android Wallet Core — není to univerzální wire-format field, kterým by každá peněženka posílala seznam podporovaných typů [[RP]].

### Vrstva C — smí se tento typ použít s tímto credentialem?

Třetí otázka je ještě důležitější:

> I když peněženka daný typ umí, je **konkrétní credential** určen k autorizaci tohoto typu transakce?

Základní [[OID4VP]] záměrně nechává mechanismus, kterým issuer vyjádří tuto kompatibilitu, mimo svůj scope.

Navazující profily ji proto řeší samy:

- u bankovní SCA definuje TS12 v metadata SCA Attestation mapu `transaction_data_types`,
- u QES mohou kompatibilitu vyjádřit typ credentialu a jeho rulebook; CSC například očekává, že speciální `qesApproval` claim vrátí jen credential vydaný pro autorizaci QES creation.

Prakticky tedy:

```text
podporuje wallet transaction_data?
        │
        ├─ ne → reject
        │
        ▼
zná wallet transaction_data.type?
        │
        ├─ ne → invalid_transaction_data
        │
        ▼
smí požadovaný credential tento typ autorizovat?
        │
        ├─ ne → reject
        │
        ▼
odpovídá payload schématu / pravidlům typu?
        │
        ├─ ne → reject
        │
        ▼
zobrazit uživateli → consent → kryptografická vazba
```

## 4. Jak se data kryptograficky svážou s prezentací

U [[SD-JWT-VC]] je klíčovým artefaktem **KB-JWT** podepsaný privátním klíčem, na který je credential navázán prostřednictvím `cnf`.

Zjednodušený credential:

```json
{
  "iss": "https://issuer.example",
  "vct": "https://issuer.example/account",
  "cnf": {
    "jwk": {
      "kty": "EC",
      "crv": "P-256",
      "x": "...",
      "y": "..."
    }
  }
}
```

Při prezentaci peněženka prokáže držení odpovídajícího privátního klíče a vytvoří KB-JWT. Bez transakčních dat může jeho payload schematicky vypadat:

```json
{
  "aud": "x509_san_dns:rp.example",
  "nonce": "J7Bk8lJDM01zN2...",
  "iat": 1790580100,
  "sd_hash": "P4m7..."
}
```

S transakčními daty se přidá například:

```json
{
  "aud": "x509_san_dns:rp.example",
  "nonce": "J7Bk8lJDM01zN2...",
  "iat": 1790580100,
  "sd_hash": "P4m7...",
  "transaction_data_hashes": [
    "L3KBnAZiKJmWvQ..."
  ],
  "transaction_data_hashes_alg": "sha-256"
}
```

### Hashuje se přesný přijatý řetězec, nikoli dekódovaný JSON

To je nejčastější implementační past.

Řekněme, že request obsahuje:

```text
transaction_data[0] =
eyJ0eXBlIjoiaHR0cHM6Ly9leGFtcGxlLm9yZy9wYXltZW50IiwiY3JlZGVudGlhbF9pZHMiOlsic2NhIl19
```

Pro obecný [[OID4VP]] profil [[SD-JWT-VC]] se hash počítá takto:

```text
SHA-256(
  UTF8(
    "eyJ0eXBlIjoiaHR0cHM6Ly9leGFtcGxlLm9yZy9wYXltZW50IiwiY3JlZGVudGlhbF9pZHMiOlsic2NhIl19"
  )
)
```

**Ne takto:**

```text
base64url decode
      ↓
JSON parse
      ↓
JSON serialize
      ↓
SHA-256
```

Ani dvě JSON reprezentace stejného objektu nemusí mít stejné bajty:

```json
{"amount":12500,"currency":"CZK"}
```

a:

```json
{
  "currency": "CZK",
  "amount": 12500
}
```

jsou sémanticky stejné, ale jejich base64url řetězce a následně i hashe se liší.

[[Verifier|Ověřovatel]] proto musí uchovat **přesný řetězec `transaction_data`, který odeslal**, a proti němu po návratu prezentace hash přepočítat.

### Úplný číselný příklad

Vezměme přesně tento UTF-8 JSON bez mezer:

```json
{"type":"example_type","credential_ids":["id_card_credential"],"action":"Approve example"}
```

Jeho base64url reprezentace bez paddingu je:

```text
eyJ0eXBlIjoiZXhhbXBsZV90eXBlIiwiY3JlZGVudGlhbF9pZHMiOlsiaWRfY2FyZF9jcmVkZW50aWFsIl0sImFjdGlvbiI6IkFwcHJvdmUgZXhhbXBsZSJ9
```

SHA-256 se u generic [[OID4VP]] / [[SD-JWT-VC]] bindingu počítá **nad tímto řetězcem**, nikoli nad dekódovaným JSON. Po base64url zakódování digestu bez paddingu vyjde:

```text
TMFpAW0ZtFYNPi0p1trEWMu1XNVOMFXj9d-23lVPE8Y
```

KB-JWT proto může obsahovat:

```json
{
  "transaction_data_hashes": [
    "TMFpAW0ZtFYNPi0p1trEWMu1XNVOMFXj9d-23lVPE8Y"
  ],
  "transaction_data_hashes_alg": "sha-256"
}
```

Kdyby se stejný JSON pouze pěkně odsadit a znovu base64url zakódoval, vznikne jiný input a v tomto konkrétním příkladu hash:

```text
r6himU7V7aVlL1gH5sXiVKTC-AU6w3jjzwnybXtQox4
```

Sémantika objektu je stejná, kryptografická reprezentace nikoli.

### Proč nestačí `nonce`

`nonce` odpovídá přibližně na otázku:

> Je prezentace čerstvá a patří do tohoto request/response toku?

`transaction_data_hashes` odpovídá na jinou otázku:

> Která přesná transakční data držitel klíče tímto důkazem autorizoval?

Obě vazby jsou potřeba.

## 5. Holder binding je pro `transaction_data` povinný

U [[SD-JWT-VC]] může běžná prezentace za určitých okolností fungovat i bez kryptografického holder bindingu. Pro transakční autorizaci to neplatí.

[[OID4VP]] stanoví, že transakční mechanismus vyžaduje [[SD-JWT-VC]] s kryptografickým holder bindingem. Pokud typ transakčních dat dovoluje `require_cryptographic_holder_binding=false`, wallet musí request odmítnout.

Jinak by `transaction_data_hashes` nebyly podpisem svázány s klíčem ovládaným uživatelem a mechanismus by ztratil hlavní bezpečnostní vlastnost.

## 6. Obecný validační postup na straně [[RP]]

Po přijetí odpovědi nestačí zkontrolovat, že pole `transaction_data_hashes` existuje.

[[RP]] musí minimálně:

1. validovat issuer signature credentialu,
2. validovat platnost a stav credentialu podle jeho pravidel,
3. validovat KB-JWT podpis proti klíči z `cnf`,
4. validovat `nonce`,
5. validovat `aud`,
6. validovat `sd_hash`,
7. z původního **přesného** `transaction_data` stringu spočítat hash,
8. ověřit, že odpovídá `transaction_data_hashes`,
9. aplikovat pravidla konkrétního `transaction_data.type`,
10. teprve potom považovat operaci za autorizovanou.

Mechanismus tedy není:

```text
wallet odpověděla → transakce potvrzena
```

ale:

```text
validní credential
 + validní holder binding
 + validní session binding
 + validní transaction binding
 + use-case specifická validace
 = použitelný autorizační důkaz
```

---

# Bankovní SCA: SUA/SCA Attestation a dynamic linking

Pro elektronické platby je obecný [[OID4VP]] mechanismus profilován v **TS12 — Specification of Strong Customer Authentication (SCA) Implementation with the Wallet**, aktuálně ve verzi 1.0.1.

TS12 používá pojem **SCA Attestation** pro attestation určenou k payment SCA. Koncepčně navazuje na **SUA Attestation** — credential, který poskytovatel služby vydá uživateli do [[EUDIW]] pro následnou silnou autentizaci.

Typický model je:

```text
REGISTRACE / ENROLMENT

Banka / ASPSP
    │
    │ bezpečně asociuje klienta a Wallet Unit
    │ vydá SCA Attestation
    ▼
EUDI Wallet
    │
    │ credential je kryptograficky bound na wallet key
    ▼
dlouhodobý autentizační prostředek banky


POZDĚJŠÍ PLATBA

Banka / merchant / PISP
    │
    │ OID4VP request
    │ + požadavek na SCA Attestation
    │ + transaction_data s platbou
    ▼
Wallet
    │
    │ zobrazí částku + příjemce
    │ provede požadovanou autentizaci
    │ vytvoří transaction-bound presentation
    ▼
Banka / payment infrastructure
    │
    │ validace SCA výsledku
    ▼
provedení platby
```

SCA Attestation tak může plnit roli dlouhodobého bankovního autentizačního prostředku uvnitř [[EUDIW]], zatímco `transaction_data` řeší **konkrétní operaci v konkrétním okamžiku**.

## 7. Opt-in u SCA Attestation: `transaction_data_types`

TS12 přidává ke type metadata SCA Attestation povinnou mapu:

```json
{
  "category": "urn:eu:europa:ec:eudi:sua:sca",
  "transaction_data_types": {
    "urn:eudi:sca:payment:1": {
      "schema_uri": "https://bank.example/schemas/payment-v1.json"
    },
    "urn:eudi:sca:account_access:1": {
      "schema_uri": "https://bank.example/schemas/account-access-v1.json"
    }
  }
}
```

Tady je opt-in vyjádřen přímo ve vztahu ke **konkrétnímu typu credentialu**.

TS12 požaduje, aby [[RP]] použil pouze typy a schémata deklarovaná v `transaction_data_types`. Wallet následně kontroluje:

```text
1. je požadovaný credential SCA Attestation?
2. má category = urn:eu:europa:ec:eudi:sua:sca?
3. je transaction_data.type v transaction_data_types?
4. odpovídá payload deklarovanému JSON Schema?
5. umí wallet data korektně zobrazit?
```

Při selhání se zpracování zastaví.

Type metadata mohou vedle `schema` / `schema_uri` obsahovat také:

```text
claims / claims_uri
ui_labels / ui_labels_uri
```

To umožňuje definovat nejen syntaxi dat, ale i pravidla, **jaké hodnoty musí uživatel skutečně vidět a jak mají být lokalizovány**.

## 8. Čtyři základní SCA transakční typy

TS12 stanoví čtyři základní typy, jejichž zpracování a vykreslení musí Wallet Unit podporovat:

| Typ | Účel |
|---|---|
| `urn:eudi:sca:payment:1` | potvrzení platby |
| `urn:eudi:sca:login_risk_transaction:1` | login nebo riziková operace |
| `urn:eudi:sca:account_access:1` | přístup k informacím o účtu |
| `urn:eudi:sca:emandate:1` | elektronický mandát, včetně scénářů payee-initiated payments |

Pro banku tedy nejde o libovolný proprietární JSON vložený do walletu. TS12 vytváří interoperabilní základ, nad kterým mohou SCA Attestation Rulebooks přidat další pravidla.

## 9. Konkrétní příklad potvrzení bankovní platby

Představme si okamžitou platbu **12 500 CZK** společnosti ACME s.r.o.

DCQL část žádosti může schematicky požadovat bankovní SCA Attestation:

```json
{
  "dcql_query": {
    "credentials": [
      {
        "id": "sca_account",
        "format": "dc+sd-jwt",
        "meta": {
          "vct_values": [
            "https://bank.example/vct/sca-account/1"
          ]
        }
      }
    ]
  }
}
```

Dekódovaný `transaction_data` objekt:

```json
{
  "type": "urn:eudi:sca:payment:1",
  "credential_ids": ["sca_account"],
  "transaction_data_hashes_alg": ["sha-256"],
  "payload": {
    "transaction_id": "pay-2026-09-28-000184",
    "date_time": "2026-09-28T09:15:00+02:00",
    "payee": {
      "name": "ACME s.r.o.",
      "id": "CZ6508000000192000145399",
      "website": "https://acme.example"
    },
    "execution_date": "2026-09-28",
    "currency": "CZK",
    "amount": 12500.00,
    "sct_inst": true
  }
}
```

V samotném [[OID4VP]] requestu tento JSON necestuje jako JSON objekt, ale jako base64url string:

```json
{
  "transaction_data": [
    "eyJ0eXBlIjoidXJuOmV1ZGk6c2NhOnBheW1lbnQ6MSIsImNyZWRlbnRpYWxfaWRzIjpbInNjYV9hY2NvdW50Il0sLi4ufQ"
  ]
}
```

Řetězec výše je pouze zkrácená ilustrace; produkční hodnota musí být base64url celé UTF-8 JSON reprezentace.

### Co musí wallet ukázat

U bankovní SCA není bezpečnostní vlastnost jen v podpisu. Uživatel musí vědět, **co podepisovaným/autorizačním gestem potvrzuje**.

V tomto příkladu je minimální význam:

```text
Příjemce: ACME s.r.o.
Účet:     CZ65 0800 0000 1920 0014 5399
Částka:   12 500,00 CZK
Typ:      okamžitá platba
Datum:    28. 9. 2026
```

TS12 umožňuje pro jednotlivé claims určit úroveň vizuální důležitosti. Kritická data mají být na hlavní obrazovce souhlasu; některé doplňkové hodnoty lze přesunout do detailu. Pokud wallet nemá k povinným položkám potřebné lokalizované popisky, TS12 počítá s fail-closed chováním, nikoli s nečitelným generickým JSON dialogem.

## 10. Odpověď: KB-JWT jako důkaz SCA

Po úspěšném souhlasu vytvoří wallet prezentaci SCA Attestation a KB-JWT.

TS12 nad běžný [[OID4VP]] / [[SD-JWT-VC]] binding přidává další claims. Ilustrační payload:

```json
{
  "aud": "x509_san_dns:bank.example",
  "nonce": "bUtJdjJESWdmTWNjb011YQ",
  "iat": 1790580100,
  "jti": "c73313ae-67fa-49fd-b25a-7f9e2720c526",
  "sd_hash": "ohjM2a0W...",
  "response_mode": "direct_post.jwt",
  "amr": [
    {
      "possession": "key_in_local_native_wscd"
    },
    {
      "inherence": "fingerprint_device"
    }
  ],
  "transaction_data_hashes": [
    "8UMhO6Mxdx3Zfx1rY49Lz5KCquxXtZOENMqISB9f9cA"
  ],
  "transaction_data_hashes_alg": "sha-256"
}
```

Vedle standardních `aud`, `nonce`, `iat`, `sd_hash` a transaction hashů jsou pro SCA důležité zejména:

### `jti`

Musí jít o novou, kryptograficky náhodnou a unikátní hodnotu pro každou prezentaci. TS12 ji po úspěšném ověření používá jako **Authentication Code** požadovaný platebním regulačním rámcem.

### `amr`

`amr` zachycuje úspěšně použité autentizační faktory. TS12 definuje kategorie:

```text
knowledge
possession
inherence
```

a konkrétní metody, například:

```json
{
  "possession": "key_in_local_native_wscd"
}
```

nebo:

```json
{
  "inherence": "fingerprint_device"
}
```

Pole musí obsahovat alespoň dvě různé kategorie.

Samotné napsání dvou položek do `amr` samozřejmě nezajišťuje nezávislost faktorů ani regulatorní soulad. Banka a příslušný SCA rulebook musí důvěřovat tomu, **jak wallet a její bezpečné prostředí tyto faktory skutečně realizují**.

### `response_mode`

TS12 ukládá do KB-JWT i `response_mode` z původního requestu. Může být využit při vyhodnocení, zda byl tok proveden očekávaným způsobem, zejména u third-party-requested scénářů.

## 11. Kde přesně vzniká dynamic linking

Pro PSD2 SCA je důležité, aby autentizační kód byl dynamicky spojen s **částkou a příjemcem**.

V tomto modelu:

```text
transaction_data
  ├─ amount = 12500.00
  ├─ currency = CZK
  └─ payee = ACME / CZ65...
          │
          │ přesná base64url reprezentace
          ▼
       SHA-256
          │
          ▼
transaction_data_hashes
          │
          ▼
KB-JWT podepsaný holder klíčem
```

Kdyby útočník po souhlasu uživatele změnil:

```text
12 500 CZK → 125 000 CZK
```

nebo:

```text
ACME s.r.o. → účet útočníka
```

změní se vstup do hash funkce. Původní KB-JWT už nebude s novou transakcí souhlasit.

[[RP]] proto nesmí přijmout pouze hodnotu `jti` nebo fakt, že autentizace proběhla. Musí validovat **celý binding k původnímu transaction data objektu**.

## 12. Kde je v SCA Attestation SUA

V architektuře je užitečné odlišit dvě vrstvy:

```text
SUA Attestation
    obecný credential pro Strong User Authentication

        ↓ profil pro elektronické platby

SCA Attestation podle TS12
    credential používaný pro PSD2 Strong Customer Authentication
    + payment-specific transaction data
    + amr / jti / dynamic linking
```

Banka tedy může po prvotním onboardingu klienta vydat do [[EUDIW]] vlastní dlouhodobou attestation navázanou na wallet key. Pozdější login, přístup k účtu nebo potvrzení platby už nemusí znovu používat [[PID]] jako identifikační credential; používá se bankou vydaný autentizační prostředek a `transaction_data` dodává kontext konkrétní operace.

To je architektonicky podobné dnešnímu „mobilnímu klíči banky“, ale autentizační prostředek žije ve standardizovaném wallet ekosystému a jeho prezentace používá interoperabilní protokol.

---

