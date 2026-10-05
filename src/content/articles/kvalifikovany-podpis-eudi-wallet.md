---
title: "Kvalifikovaný podpis v EUDI Wallet: od eIDAS přes CSC po protokolové zprávy"
description: "Jak EUDI Wallet vytváří a autorizuje kvalifikovaný elektronický podpis: legislativa, lokální a vzdálený QSCD, ETSI TS 119 432, CSC API, OpenID4VP transaction_data a aktuální referenční implementace."
pubDate: 2026-10-05
tags: [eudiw, qes, csc, oid4vp, transaction-data, podpis, qtsp, etsi]
draft: false
---

Kvalifikovaný elektronický podpis (QES) je jedna z funkcí, kde se evropská digitální peněženka mění z „aplikace na průkazy“ na **aktivní bezpečnostní komponentu transakce**. Uživatel může v [[EUDIW]] vybrat dokument, vidět, co podepisuje, autorizovat použití kvalifikovaného podpisového klíče a získat například podepsané PDF. Samotný kvalifikovaný podpis ale nevytváří běžný prezentační klíč peněženky: právně rozhodující podpisová hodnota musí vzniknout pomocí **kvalifikovaného prostředku pro vytváření elektronických podpisů (QSCD)** a být založena na kvalifikovaném certifikátu.

V praxi proto existuje několik architektur. QSCD může být **lokální** v zařízení, **externí** (například čipová karta), nebo **vzdálený** u kvalifikovaného poskytovatele služeb vytvářejících důvěru (QTSP). Peněženka může být jen autentizačním a autorizačním prostředkem vůči vzdálenému QSCD, nebo může celý podpisový proces řídit jako signature creation application.

Tento článek skládá dohromady tři vrstvy, které se často směšují:

1. **právní požadavek** — co musí být splněno, aby výsledkem byl QES,
2. **podpisový protokol** — jak signature creation application komunikuje s QSCD/QTSP, zejména přes ETSI TS 119 432 a CSC API,
3. **wallet autorizační protokol** — jak se pomocí [[OID4VP]] a `transaction_data` prokáže, že uživatel schválil právě konkrétní podpisovou operaci.

> **Nejdůležitější rozlišení:** holder-binding podpis v [[OID4VP]], `qesApproval` a vlastní QES jsou tři různé kryptografické operace. Mohou proběhnout během jednoho uživatelského kroku, ale nemají stejný klíč, stejnou právní funkci ani stejný trust model.

Článek vychází ze stavu specifikací a referenčních implementací **k 5. říjnu 2026**. Kde je tok normativně určen, uvádím jej jako požadavek. Kde standard ponechává prostor nebo je implementace stále ve vývoji, je to výslovně označeno jako **varianta** nebo **navržené řešení**.

---

## 1. Právní základ v několika bodech

Podle [[eIDAS]] je QES pokročilý elektronický podpis, který je:

- vytvořen pomocí QSCD,
- založen na kvalifikovaném certifikátu pro elektronický podpis.

Článek 25 [[eIDAS]] mu přiznává **právní účinek rovnocenný vlastnoručnímu podpisu** a požaduje vzájemné uznávání kvalifikovaných podpisů napříč členskými státy.

Pro [[EUDIW]] jsou dnes ještě důležitější články 11 a 12 konsolidovaného prováděcího nařízení (EU) 2024/2979. Wallet provider musí zajistit, že uživatel může získat kvalifikovaný certifikát navázaný na:

- lokální QSCD,
- externí QSCD,
- vzdálený QSCD,

a wallet solution musí umět s těmito variantami bezpečně komunikovat. Fyzická osoba musí mít alespoň pro neprofesní použití bezplatný přístup k aplikaci umožňující vytvořit QES zdarma.

Signature creation application může podle stejného nařízení poskytovat:

- wallet provider,
- trust service provider,
- nebo [[RP]].

To je důležité: **právní rámec nepředepisuje jednu jedinou „správnou“ topologii**.

Po změně prováděcím nařízením (EU) 2026/1731 je v příloze IV jako povinný formát uveden **PAdES podle ETSI EN 319 142-1 V1.2.1 (2024-01)** a jako povinné aplikační rozhraní jsou určeny části **ETSI TS 119 432 v1.3.1 (2026-03), konkrétně 6.4.3, A.6, A.7 a A.8**.

To má praktický důsledek: pro implementaci QES v peněžence už nestačí říci „použijeme nějaké CSC API“. Evropská legislativní baseline od srpna 2026 ukazuje na velmi konkrétní ETSI profil, který kombinuje signature creation application, remote signing a [[OID4VP]].

### Hierarchie zdrojů

Je užitečné oddělit jejich normativní sílu:

```text
eIDAS / nařízení EU
        │
        ▼
prováděcí nařízení
2024/2979 + změna 2026/1731
        │
        ▼
povinné části ETSI TS 119 432 v1.3.1
        │
        ├── používají CSC model/API
        └── používají OpenID4VP transaction_data

ARF / Topic AB / referenční implementace
        │
        └── vysvětlují, profilují a ověřují konkrétní architektury,
            ale samy nejsou náhradou právního požadavku
```

**Prameny:**  
[Nařízení (EU) č. 910/2014, zejména čl. 3 a 25](https://eur-lex.europa.eu/legal-content/CS/TXT/?uri=CELEX:02014R0910-20241018)  
[Prováděcí nařízení (EU) 2024/2979 — konsolidované znění k 11. 8. 2026](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02024R2979-20260811)  
[Prováděcí nařízení (EU) 2026/1731 — změna technických specifikací](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32026R1731)  
[ETSI TS 119 432 v1.3.1](https://www.etsi.org/deliver/etsi_ts/119400_119499/119432/01.03.01_60/ts_119432v010301p.pdf)

---

## 2. Co je v podpisovém toku která komponenta

Největší zmatek obvykle vzniká tím, že se slovem „wallet“ označí celý systém. Pro podpis je ale potřeba rozlišit několik rolí.

> **Terminologická poznámka:** v tomto článku zkratka **SCA** znamená *Signature Creation Application*. Není tím míněna bankovní *Strong Customer Authentication*, která používá stejnou zkratku.

| Komponenta | Role |
|---|---|
| **Wallet Unit / Wallet Instance** | uživatelská peněženka; zobrazuje request, drží credentialy a provádí wallet prezentace |
| **Signature Creation Application (SCA)** | připraví data k podpisu, zobrazí signing UI, komunikuje s QSCD a sestaví výsledný podpisový formát |
| **Signature Interaction Component (SIC)** | část architektury, která zprostředkuje práci s podpisem/QSCD; konkrétní rozdělení funkcí závisí na implementaci |
| **QSCD** | chrání kvalifikovaný podpisový privátní klíč a provede podpisovou kryptografickou operaci |
| **QTSP / remote signing provider** | poskytuje kvalifikovaný certifikát a/nebo vzdálený QSCD a související autorizační infrastrukturu |
| **Authorization Server QTSP** | autentizuje a autorizuje použití podpisového credentialu; může použít [[OID4VP]] |
| **[[RP]]** | předkládá dokument nebo iniciuje podpisovou operaci |
| **CSC client** | klient Remote Signing Service, který volá `credentials/*` a `signatures/*` |

Některé z těchto rolí mohou být v jedné aplikaci. Jiné budou v různých systémech.

### Dva klíče, které se nesmí zaměnit

V typickém vzdáleném QES toku se objeví minimálně dva privátní klíče:

| Klíč | Typické umístění | Co podepisuje | Význam |
|---|---|---|---|
| wallet holder-binding / device key | [[WSCD]] nebo jiné bezpečné prostředí walletu | [[OID4VP]] proof, KB-JWT nebo mdoc DeviceSigned | prokazuje držení wallet credentialu a autorizaci `transaction_data` |
| qualified signing key | QSCD | DTBS/DTBSR nebo jeho hash | vytváří vlastní kvalifikovaný elektronický podpis |

Běžný wallet holder-binding klíč **není automaticky kvalifikovaným podpisovým klíčem**. To, že je klíč v bezpečném [[WSCD]], samo o sobě nestačí; aby šlo o QES klíč, musí být splněny požadavky pro QSCD a celý kvalifikovaný podpisový trust chain.

---

# Část I — základní scénáře

## 3. Pět užitečných scénářů QES s peněženkou

Pro implementační diskusi se vyplatí rozdělit použití do pěti scénářů.

| Scénář | Kde je QSCD | Kdo řídí signing flow | Je nutný CSC? | Role [[OID4VP]] |
|---|---|---|---|---|
| A. Lokální QES | v zařízení | wallet/SCA | ne nutně | volitelná, pokud podpis vyžádala [[RP]] |
| B. Externí QSCD | karta/token | wallet/SCA | ne nutně | volitelná |
| C. Wallet-driven remote QES | QTSP | wallet/SCA | typicky ano | autentizace/autorizace vzdáleného klíče |
| D. relying-party-driven QES přes wallet | QTSP nebo jiný QSCD | wallet/SCA zpracuje request od [[RP]] | podle podpisového backendu | hlavní transport `qes` requestu |
| E. QES approval | QTSP | [[RP]]/QTSP řídí signing flow, wallet schvaluje | typicky ano | přenáší `qes-approval` a důkaz souhlasu |

Scénáře C–E se mohou překrývat. Rozdíl je především v tom, **kdo je „driving application“** a kdo drží stav celého podpisového procesu.

---

## 4. Scénář A — lokální QSCD

Nejjednodušší mentální model je:

```text
Uživatel
   │
   ▼
EUDI Wallet / SCA
   │  dokument
   │  výpočet DTBS/DTBSR
   │  consent
   ▼
lokální QSCD
   │
   │ qualified signing operation
   ▼
signature value
   │
   ▼
SCA sestaví PAdES
```

Pokud je QSCD skutečně lokální a kvalifikovaný podpisový klíč je přímo v něm, není technicky nutné volat vzdálenou službu přes CSC. SCA:

1. načte dokument,
2. určí požadovaný podpisový profil,
3. připraví **Data To Be Signed / Data To Be Signed Representation (DTBS/DTBSR)**,
4. zobrazí uživateli jasný signing consent,
5. aktivuje lokální QSCD,
6. získá kryptografickou podpisovou hodnotu,
7. vloží ji do PAdES struktury,
8. ověří výsledný podpis a informuje uživatele.

### Co je stále otevřené

Právní předpis počítá s lokálním QSCD, ale to neznamená, že libovolný hardware-backed Android/iOS klíč je QSCD. Konkrétní mobilní platforma musí mít odpovídající certifikované řešení a bezpečnostní lifecycle. Proto je realistické očekávat, že část telefonů bude používat lokální variantu a jiná zařízení remote QSCD.

### Pokud podpis vyžádala [[RP]]

Lokální podpis lze zahájit i přes [[OID4VP]] `qes` request. V takovém případě [[OID4VP]] není vzdálený signing protokol; slouží jako **bezpečný request od [[RP]] k signature creation application**. SCA může následně použít lokální QSCD místo CSC backendu.

---

## 5. Scénář B — externí QSCD

Externím QSCD může být například čipová karta nebo jiný kvalifikovaný token dostupný přes NFC, USB či jiný zabezpečený kanál.

Tok je podobný lokálnímu:

```text
Wallet/SCA
   │
   │ DTBSR + uživatelský consent
   ▼
externí QSCD
   │
   │ PIN / lokální user verification
   │ signature operation
   ▼
signature value
   │
   ▼
PAdES
```

Z pohledu wallet protokolu se externí QSCD může chovat téměř stejně jako lokální. Rozdíl je v transportu, aktivaci a dostupnosti zařízení.

---

## 6. Scénář C — wallet-driven remote QES

Toto je dnes nejlépe vidět v evropské Android referenční implementaci.

Uživatel začne v peněžence nebo aplikaci, která do ní integruje RQES SDK. Peněženka:

1. vybere QTSP,
2. provede service authorization,
3. načte dostupné remote signing credentialy,
4. zvolí podpisový certifikát,
5. připraví hash dokumentu,
6. provede **credential authorization**,
7. autorizaci sváže s konkrétními dokumenty pomocí [[OID4VP]] `transaction_data`,
8. získá credential-scoped access token / jiný aktivační artefakt,
9. zavolá CSC `signatures/signHash`,
10. z vrácené signature value sestaví PAdES.

Referenční Kotlin CSC knihovna k 5. 10. 2026 podporuje CSC API 2.2 zejména:

```text
info                    ✅
credentials/list        ✅
credentials/info        ✅
signatures/signHash     ✅

credentials/authorize   ❌
signatures/signDoc      ❌
signatures/timestamp    ❌
```

Autorizační vrstva je v této implementaci řešena přes OAuth 2.0.

**Zdroj:** [EUDI rQES CSC library](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-rqes-csc-kt)

---

## 7. Scénář D — [[RP]] pošle walletu přímo požadavek `qes`

Tento model je důležitý proto, že **je právě on explicitně profilován v ETSI TS 119 432 v1.3.1, příloze A**, na kterou dnes odkazuje prováděcí nařízení.

[[RP]] například chce, aby uživatel podepsal smlouvu. Nepošle jen URL „otevři podpisovou aplikaci“, ale vytvoří [[OID4VP]] Authorization Request s:

- DCQL query na vhodný podpisový/certifikátový credential,
- `transaction_data` typu `https://cloudsignatureconsortium.org/2025/qes`,
- seznamem dokumentů a podpisových parametrů.

Wallet/SCA request ověří, načte dokument, zkontroluje checksum, zobrazí signing consent, vytvoří QES přes dostupný QSCD a výsledek vrátí [[RP]].

To je **wallet-centric / wallet-participating** model: [[RP]] zadá podpisovou operaci a peněženka ji skutečně zrealizuje.

---

## 8. Scénář E — wallet pouze autorizuje vzdálený QES (`qes-approval`)

V provider-centric nebo relying-party-centric toku už podpisový proces běží mimo wallet. QTSP nebo podpisová aplikace už například:

- zná `credentialID`,
- spočítala hashe DTBSR,
- ví, kolik podpisů má vzniknout.

Potřebuje ale silný, kryptograficky svázaný důkaz:

> „držitel tohoto wallet credentialu schválil právě použití remote credentialu `GX0112348` k podpisu těchto dvou digestů.“

K tomu slouží `transaction_data` typu:

```text
https://cloudsignatureconsortium.org/2025/qes-approval
```

Wallet v tomto modelu **nevytváří QES holder-binding klíčem**. Vytvoří autorizační důkaz, který QTSP Authorization Server / SAM následně ověří a použije jako vstup do skutečné signature activation procedury.

---

# Část II — protokoly do detailu

## 9. CSC: podpisový API protokol

Cloud Signature Consortium API je remote signing API mezi signature creation application a vzdálenou podpisovou službou.

V běžném wallet-driven toku jsou nejdůležitější tři skupiny endpointů:

```text
/csc/v2/info

/csc/v2/credentials/list
/csc/v2/credentials/info

/csc/v2/signatures/signHash
```

Vedle nich existují další operace CSC, ale současná evropská referenční Kotlin knihovna zatím implementuje jen část profilu.

### 9.1 Získání dostupných credentialů

Schematický request:

```http
POST /csc/v2/credentials/list HTTP/1.1
Host: qtsp.example
Authorization: Bearer SERVICE_ACCESS_TOKEN
Content-Type: application/json

{}
```

Odpověď může obsahovat identifikátory podpisových credentialů:

```json
{
  "credentialIDs": [
    "GX0112348",
    "GX0199981"
  ]
}
```

Následuje detail:

```http
POST /csc/v2/credentials/info HTTP/1.1
Host: qtsp.example
Authorization: Bearer SERVICE_ACCESS_TOKEN
Content-Type: application/json

{
  "credentialID": "GX0112348",
  "certificates": "single",
  "certInfo": true,
  "authInfo": true
}
```

V odpovědi signature creation application potřebuje zejména informace potřebné k:

- výběru kvalifikovaného certifikátu,
- validaci certificate chain,
- výběru podpisového algoritmu,
- přípravě PAdES.

Přesná množina polí závisí na CSC verzi a profilu služby; implementace nemá slepě spoléhat na ilustrační payload tohoto článku.

### 9.2 `signHash`

Po autorizaci credentialu může SCA požádat QSCD o podpis jednoho nebo více hashů:

```http
POST /csc/v2/signatures/signHash HTTP/1.1
Host: qtsp.example
Authorization: Bearer CREDENTIAL_ACCESS_TOKEN
Content-Type: application/json

{
  "credentialID": "GX0112348",
  "hashes": [
    "BASE64_DTBSR_DIGEST"
  ],
  "hashAlgorithmOID": "2.16.840.1.101.3.4.2.1",
  "signAlgo": "1.2.840.113549.1.1.1"
}
```

Ilustrační odpověď:

```json
{
  "signatures": [
    "BASE64_SIGNATURE_VALUE"
  ]
}
```

SCA tuto hodnotu vloží do připravené PAdES struktury.

> **Pozor:** OAuth access token, CSC SAD/SAD-R a interní aktivační artefakt QSCD nejsou nutně totéž. Konkrétní vazba mezi OAuth credential authorization a signature activation mechanismem je součástí profilu QTSP. Referenční server dnes vrací access token „authorizing credentials use (SAD/R)“, ale nelze z toho odvodit, že každý produkční QTSP bude mít identický wire format.

---

## 10. Wallet-driven remote signing krok za krokem

Aktuální evropská referenční implementace ukazuje následující model:

```mermaid
sequenceDiagram
    autonumber
    actor U as Uživatel
    participant W as EUDI Wallet / RQES SDK
    participant SCA as Signature Creation Application
    participant AS as QTSP Authorization Server
    participant V as OpenID4VP Verifier
    participant RS as QTSP CSC Resource Server
    participant Q as Remote QSCD/SAM

    U->>W: Vybere dokument a QTSP
    W->>AS: OAuth service authorization
    AS-->>W: service access token

    W->>RS: /credentials/list
    RS-->>W: credentialIDs
    W->>RS: /credentials/info
    RS-->>W: qualified certificate + metadata

    W->>SCA: Připrav podpis
    SCA->>SCA: DTBS/DTBSR + hash

    W->>AS: OAuth credential authorization
    AS->>V: OID4VP request + qes-approval transaction_data
    V-->>W: Authorization Request
    W->>U: Zobrazí dokument/digest, credential, účel
    U-->>W: Souhlas
    W-->>V: VP + transaction binding / qesApproval
    V-->>AS: ověřený výsledek

    AS-->>W: authorization code
    W->>AS: /oauth2/token
    AS-->>W: credential-scoped access token

    W->>RS: /signatures/signHash
    RS->>Q: Aktivace kvalifikovaného klíče
    Q-->>RS: signature value
    RS-->>W: signature value

    W->>SCA: signature value
    SCA-->>W: PAdES
    W-->>U: Podepsaný dokument
```

### Co je zde závazné a co implementační

**Stabilní princip:**

```text
dokument → DTBSR → explicitní souhlas → autorizace credentialu
→ QSCD vytvoří signature value → SCA sestaví PAdES
```

**Implementační volnost:**

- zda service authorization a credential authorization budou dva oddělené OAuth toky,
- zda se použije [[PAR]],
- jak QTSP mapuje `qesApproval` na SAD / SAM policy,
- zda bude document retrieval provozovat wallet, [[RP]] nebo jiná komponenta,
- jak bude řešeno více dokumentů a batch signing.

Referenční CSC knihovna sama například označuje svůj **Document Retrieval flow jako ne-část CSC specifikace a potenciálně odstranitelnou funkci**. To je přesně typ věci, kterou není vhodné zaměnit za evropský interoperabilní standard.

---

# Část III — `qes` přes OpenID4VP

## 11. Authorization Request

ETSI TS 119 432 příloha A staví request na [[OID4VP]]. V základním tvaru obsahuje mimo jiné:

```text
response_type=vp_token
response_mode=direct_post.jwt
client_id=...
nonce=...
dcql_query=...
transaction_data=...
```

V produkčním EUDI profilu bude request typicky předán jako podepsaný request object / JAR nebo přes `request_uri`; přesné client authentication a trust artefakty se řídí příslušným EUDI profilem.

Schematický dekódovaný request:

```json
{
  "response_type": "vp_token",
  "response_mode": "direct_post.jwt",
  "client_id": "x509_hash:...",
  "nonce": "M7k4b1P6...",
  "response_uri": "https://rp.example/oid4vp/response",
  "dcql_query": {
    "credentials": [
      {
        "id": "qualified_certificate",
        "format": "https://cloudsignatureconsortium.org/2025/x509"
      }
    ]
  },
  "transaction_data": [
    "BASE64URL_ENCODED_QES_REQUEST"
  ]
}
```

### Proč je tu DCQL

`transaction_data.credential_ids` neobsahuje CSC `credentialID`. Odkazuje na **query ID z DCQL v této jediné prezentaci**.

```text
DCQL id:
qualified_certificate
       │
       └── lokální reference v OID4VP requestu

CSC credentialID:
GX0112348
       │
       └── identifikátor remote signing credentialu u QTSP
```

Záměna těchto dvou identifikátorů je častá implementační chyba.

---

## 12. Dekódovaný `qesRequest`

Typ je:

```text
https://cloudsignatureconsortium.org/2025/qes
```

ETSI TS 119 432 uvádí model odpovídající zhruba následujícímu payloadu:

```json
{
  "type": "https://cloudsignatureconsortium.org/2025/qes",
  "credential_ids": [
    "qualified_certificate"
  ],
  "signatureRequests": [
    {
      "label": "Smlouva o úvěru 2026-041",
      "access": {
        "type": "public"
      },
      "href": "https://rp.example/documents/2026-041.pdf",
      "checksum": {
        "value": "BASE64_SHA256",
        "algorithmOID": "2.16.840.1.101.3.4.2.1"
      },
      "signature_format": "P",
      "conformance_level": "AdES-B-B",
      "signed_envelope_property": "Certification",
      "signAlgo": "1.2.840.113549.1.1.1",
      "signatureQualifier": "eu_eidas_qes",
      "responseURI": "https://rp.example/signature-response/123"
    }
  ]
}
```

Důležité prvky:

- `label` — člověkem čitelný název dokumentu,
- `href` — odkud dokument získat,
- `checksum` — integrita staženého dokumentu,
- `signature_format` — například PAdES,
- `conformance_level` — požadovaný AdES profil,
- `signAlgo` — podpisový algoritmus,
- `signatureQualifier` — pro QES typicky `eu_eidas_qes`,
- `responseURI` — možnost out-of-band předání výsledku.

### Co musí wallet udělat

Normativní tok ETSI je podstatně přísnější než „uživatel klikne na Podepsat“:

```text
1. ověř request / JAR a identitu protistrany
2. validuj DCQL a transaction_data
3. stáhni dokument
4. ověř checksum / integritu
5. připrav DTBS/DTBSR
6. ukaž:
   - co se podepisuje,
   - kdo podpis žádá,
   - podpisový profil,
   - relevantní digest / dokument
7. získej explicitní souhlas
8. vytvoř QES pomocí odpovídajícího QSCD
9. sestav PAdES
10. vrať výsledek nebo ho odešli na responseURI
```

Pokud checksum nesouhlasí, nesmí se tok „opravit“ stažením jiné verze nebo pokračovat s varováním. Podpis se musí ukončit.

---

## 13. Odpověď na `qes`

ETSI připouští více způsobů vrácení výsledku. Koncepčně může odpověď obsahovat například:

```json
{
  "qesResponse": {
    "signatureRequests": [
      {
        "label": "Smlouva o úvěru 2026-041",
        "documentWithSignature": "BASE64_SIGNED_PDF"
      }
    ]
  }
}
```

nebo může být výsledek předán mimo hlavní [[OID4VP]] response na `responseURI`.

Tady je potřeba počítat s praktickým omezením velikosti. Podepsané PDF může být příliš velké pro běžnou front-channel odpověď. Proto je pro produkční implementaci často rozumnější:

```text
OID4VP response
  └── stav / reference

responseURI nebo jiný chráněný kanál
  └── podepsaný dokument
```

Konkrétní packaging je ale nutné sladit s normativní verzí ETSI profilu a implementací protistrany.

---

# Část IV — `qes-approval`

## 14. Proč existuje druhý typ

`qes` říká přibližně:

> „Wallet, vytvoř tento podpis.“

`qes-approval` říká:

> „Wallet, autorizuj použití tohoto podpisového credentialu pro tyto konkrétní dokumentové digests; vlastní podpis pak provede vzdálený signing systém.“

Typ je:

```text
https://cloudsignatureconsortium.org/2025/qes-approval
```

Ilustrační request:

```json
{
  "type": "https://cloudsignatureconsortium.org/2025/qes-approval",
  "credential_ids": [
    "qes_service_attestation"
  ],
  "credentialID": "GX0112348",
  "signatureQualifier": "eu_eidas_qes",
  "numSignatures": 2,
  "documentDigests": [
    {
      "label": "Smlouva",
      "hash": "BASE64_DTBSR_HASH_1",
      "hashType": "dtbsr",
      "access": {
        "type": "public"
      },
      "href": "https://rp.example/contracts/1.pdf",
      "checksum": {
        "value": "BASE64_SHA256",
        "algorithmOID": "2.16.840.1.101.3.4.2.1"
      }
    },
    {
      "label": "Příloha",
      "hash": "BASE64_DTBSR_HASH_2",
      "hashType": "dtbsr"
    }
  ],
  "hashAlgorithmOID": "2.16.840.1.101.3.4.2.1"
}
```

Znovu jsou zde **dva různé credential identifikátory**:

```text
credential_ids
    = OID4VP/DCQL query IDs

credentialID
    = remote signing credential u QTSP
```

---

## 15. Tři různé hashové vazby

U QES se mohou současně objevit tři různé typy hashů. Je nutné je držet mentálně oddělené.

### A. Hash dokumentu / DTBSR

To je hodnota, kterou má nakonec podepsat kvalifikovaný podpisový klíč:

```text
dokument
  ↓
PAdES / signature-format processing
  ↓
DTBS / DTBSR
  ↓
hash
  ↓
QSCD signature operation
```

### B. Generic `transaction_data_hashes` v [[OID4VP]]

U [[SD-JWT-VC]] obecný [[OID4VP]] transaction binding hash typicky vzniká nad **přesným base64url řetězcem, jak byl přijat v `transaction_data`**.

```text
transaction_data[0]
= "eyJ0eXBlIjoiaHR0cHM6Ly..."

SHA-256( UTF8(exact_string_above) )
        │
        ▼
transaction_data_hashes
```

Nedělá se:

```text
base64url decode
→ JSON parse
→ JSON serialize
→ hash
```

protože reserializace může změnit bajtovou reprezentaci.

### C. CSC/ETSI `qesApproval`

`qesApproval` je **typově specifická** vazba a má jiné pravidlo.

Pro [[SD-JWT-VC]] variantu ETSI flow vzniká `qesApproval` z původních dekódovaných bajtů requestu a algoritmus se volí podle `hashAlgorithmOID`:

```text
outer transaction_data string
        │
        ├─ base64url decode
        ▼
původní UTF-8 bajty qesApprovalRequest JSON
        │
        │ hash podle hashAlgorithmOID
        ▼
digest
        │
        │ standard Base64
        ▼
qesApproval claim
```

Klíčové pravidlo:

> **Nesmí se parsovat a znovu serializovat JSON před výpočtem `qesApproval`.** Hash se počítá z původních dekódovaných UTF-8 bajtů requestu.

U mdoc je format-specific binding odlišný; současný CSC Data Model Bindings profil používá vlastní DeviceSigned `qesApproval` element a jeho pravidla je potřeba implementovat samostatně.

To znamená, že generic `transaction_data_hashes` a QES-specifický `qesApproval` mohou chránit **stejnou logickou transakci**, ale mají jiný hash input a u různých credential formátů i jinou reprezentaci výsledku.

---

## 16. `qesApproval` v [[SD-JWT-VC]]

U [[SD-JWT-VC]] se může objevit jako top-level claim v KB-JWT:

```json
{
  "aud": "https://qtsp.example",
  "nonce": "N8K5G...",
  "iat": 1791187200,
  "sd_hash": "BASE64URL_SD_HASH",
  "transaction_data_hashes": [
    "BASE64URL_GENERIC_TRANSACTION_HASH"
  ],
  "transaction_data_hashes_alg": "sha-256",
  "org.cloudsignatureconsortium.dm.1.qesApproval": "STANDARD_BASE64_APPROVAL_DIGEST"
}
```

Interpretace:

```text
KB-JWT signature
    ├── prokazuje kontrolu holder-binding klíče
    ├── binduje presentation session
    ├── binduje generic transaction_data
    └── nese QES-specifický approval digest
```

**Stále to není QES.**

---

## 17. `qesApproval` v mdoc

Aktuální Android Wallet Core už umí `transaction_data` také pro `mso_mdoc`. U QES approval je typově specifická data element vazba chráněna mdoc device authentication.

Koncept:

```text
DeviceSigned
  namespace:
    org.cloudsignatureconsortium.dm.1

  element:
    qesApproval

  value:
    bstr(raw digest)
```

U mdoc varianty se digest nevkládá jako base64 text uvnitř CBOR; jde o bytestring podle konkrétního bindingu. Současný CSC Data Model Bindings profil pro tento DeviceSigned element používá **SHA-256 nad původními dekódovanými JSON bajty**, bez reserializace a bez vnitřního Base64 obalu. Nejde tedy o prosté převzetí SD-JWT pravidla s `hashAlgorithmOID`.

Issuer zároveň musí příslušný device-signed element povolit v `KeyAuthorizations`. Jinak request nelze bezpečně autorizovat a má skončit `invalid_transaction_data`.

To je příklad, proč `transaction_data` není jen „feature OpenID“. Musí existovat **formátově specifický kryptografický binding**.

---

## 18. `qesApproval` není SAD

Tohle je jedna z nejdůležitějších hranic celého návrhu.

Po ověření wallet prezentace může Authorization Server vědět:

```text
uživatel U
+
wallet credential C
+
remote signing credential GX0112348
+
digests D1, D2
+
explicitní approval
```

Ale QSCD/SAM ještě musí splnit vlastní podmínky pro aktivaci podpisového klíče.

Správný model je:

```text
OID4VP presentation
       │
       ▼
ověřený qesApproval
       │
       ▼
QTSP authorization policy
       │
       ▼
SAD / SAD-R / jiný signature activation artefakt
       │
       ▼
SAM / remote QSCD
       │
       ▼
qualified signing key signs DTBSR
       │
       ▼
QES
```

Nelze tedy implementovat:

```text
validní KB-JWT → rovnou signHash bez další policy
```

pokud to neodpovídá certifikovanému signature activation designu daného remote QSCD.

### Co je zde ještě volné

Standardizace určuje, **co musí být autorizováno a jak lze approval kryptograficky přenést**, ale interní mechanismus, kterým konkrétní QTSP mapuje tento důkaz na aktivaci QSCD, není jeden univerzální protokol pro všechny poskytovatele.

Proto bych produkční rozhraní navrhoval tak, aby Authorization Server měl explicitní funkci:

```text
validateWalletApproval(request, presentation)
    ↓
createSignatureActivationContext(...)
    ↓
authorizeCredentialUse(...)
```

a nikoli aby `qesApproval` byl pouze další neinterpretovaný string propasovaný do `signHash`.

---

# Část V — enrolment kvalifikovaného podpisu

## 19. Jak se uživatel k remote QES credentialu dostane

Předchozí kapitoly předpokládají, že uživatel už má u QTSP:

- remote QSCD,
- kvalifikovaný podpisový klíč,
- kvalifikovaný certifikát,
- `credentialID`.

Právě enrolment je ale oblast, kde dnes zůstává více implementační volnosti.

### Co je pevné

QTSP musí splnit požadavky [[eIDAS]] na:

- ověření identity pro vydání kvalifikovaného certifikátu,
- kvalifikovanou službu,
- lifecycle certifikátu,
- QSCD / remote QSCD,
- výlučnou kontrolu podepisující osoby v požadovaném smyslu.

### Co bych očekával jako praktický EUDI flow

Následující tok je **návrh implementace**, nikoli tvrzení, že přesně tento wire flow je dnes jediný normativně předepsaný:

```mermaid
sequenceDiagram
    autonumber
    actor U as Uživatel
    participant W as EUDI Wallet
    participant Q as QTSP
    participant AS as QTSP Authorization Server
    participant H as Remote QSCD/HSM

    U->>W: Zvolí službu kvalifikovaného podpisu
    W->>Q: discovery / service metadata
    W->>AS: enrolment start
    AS-->>W: OID4VP request na PID / požadované atributy
    W->>U: Souhlas s identifikací
    W-->>AS: presentation
    AS->>AS: identity proofing + smluvní kroky
    AS->>H: vytvořit qualified signing key
    H-->>AS: public key
    AS->>Q: vydat kvalifikovaný certifikát
    Q-->>AS: qualified certificate
    AS-->>W: credential reference / service metadata / credentialID
```

Privátní klíč remote QSCD **se do walletu nestahuje**. Wallet si může uložit:

- identifikátor QTSP,
- `credentialID`,
- certifikát nebo jeho metadata,
- případně service attestation / credential určený k pozdější autorizaci.

### Proč zde není dobré předčasně zafixovat proprietární API

ARF Topic AB a související práce stále řeší některé HLR a integrační volby. Enrolment je navíc silně závislý na identity proofing politice QTSP. Proto je vhodné v implementaci oddělit:

```text
wallet UX + OID4VP identity proof
```

od:

```text
QTSP-specific qualified certificate enrolment API
```

a nesnažit se druhou část maskovat jako univerzální [[OID4VCI]], pokud pro konkrétní kvalifikovaný podpisový credential neexistuje závazný profil.

---

# Část VI — referenční implementace k 5. 10. 2026

## 20. Android: transaction data už nejsou jen SD-JWT

Android Wallet Core v září přidal obecnou podporu `transaction_data` pro [[SD-JWT-VC]]. Začátkem října byla sloučena i podpora pro `mso_mdoc`.

Aktuálně tedy umí:

```text
transaction_data
  ├── SD-JWT VC  ✅
  └── mdoc       ✅
```

U mdoc musí konkrétní transaction type dodat vlastní DeviceSigned data element; jinak neexistuje bezpečný formátový binding.

**Zdroj:** [Android Wallet Core PR #424](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/424)

---

## 21. Android RQES UI

Referenční RQES SDK podporuje dva praktické vstupy:

- **local file flow** — aplikace už má PDF,
- **remote URL flow** — dokument přijde například deep linkem / QR.

Zjednodušený uživatelský tok:

```text
app
  ↓
RQES SDK
  ↓
výběr QTSP
  ↓
OAuth authorization v system browseru
  ↓
návrat authorization code
  ↓
výběr credentialu
  ↓
podpis dokumentu
  ↓
success/share signed PDF
```

V PR #154 byla současně sloučena implementace transaction-data flow do Android RQES UI.

**Zdroj:** [eudi-lib-android-rqes-ui](https://github.com/eu-digital-identity-wallet/eudi-lib-android-rqes-ui)

---

## 22. Referenční QTSP

Evropská Komise provozuje vývojový referenční server pro wallet-driven i relying-party-centric remote QES.

Jeho dokumentovaný wallet-driven flow dnes odpovídá modelu:

```text
/credentials/info
→ vypočítat hash
→ /oauth2/authorize
→ OID4VP authorization
→ /oauth2/token
→ /signatures/signHash
→ sestavit podepsaný dokument
```

PR #35 z 5. října 2026 převedl QTSP Authorization Server na použití `transaction_data` v [[OID4VP]], takže autorizace už není jen obecné „share [[PID]] and continue“, ale může být kryptograficky svázána s konkrétní QES operací.

**Zdroj:**  
[QTSP reference server](https://github.com/eu-digital-identity-wallet/eudi-srv-web-walletdriven-rpcentric-signer-qtsp-java)  
[PR #35 — transaction_data](https://github.com/eu-digital-identity-wallet/eudi-srv-web-walletdriven-rpcentric-signer-qtsp-java/pull/35)

### Důležitá výhrada

README referenčního QTSP stále místy mluví o CSC API v2.0, zatímco novější Kotlin klient uvádí CSC API 2.2 a ETSI TS 119 432 v1.3.1 normativně odkazuje na novější CSC artefakty. Referenční repozitáře se tedy vyvíjejí různým tempem.

**Reference implementation je demonstrátor architektury, nikoli automaticky produkční interoperability profile.**

---

## 23. iOS: QES transaction data zatím nejsou na main

K 5. říjnu 2026 je iOS Wallet Kit PR #493 stále **draft**.

Navrhuje:

- explicitní opt-in typů `qes` a `qes-approval`,
- QES approval pro [[SD-JWT-VC]] i mdoc,
- consent data dostupná aplikaci,
- fail-closed `invalid_transaction_data`,
- zachování raw transaction representation,
- format-specific binding.

To je významný indikátor směru, ale dokud PR není sloučen, nelze tuto funkčnost popisovat jako současnou stabilní vlastnost iOS reference stacku.

**Zdroj:** [iOS Wallet Kit PR #493](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/493)

---

# Část VII — co je definitivní a co se ještě může změnit

## 24. Mapa jistoty

| Oblast | Stav k 5. 10. 2026 | Jak s tím zacházet |
|---|---|---|
| QES má účinek vlastnoručního podpisu | právně pevné | základ návrhu |
| QSCD může být lokální, externí nebo remote | právně pevné pro wallet support | podporovat architektonicky všechny tři |
| PAdES je povinný wallet formát | právně/technicky pevné | implementovat minimálně PAdES |
| ETSI TS 119 432 v1.3.1 6.4.3 + A.6–A.8 | přímo odkazované prováděcím aktem | považovat za interoperability baseline |
| OpenID4VP `transaction_data` | finální OpenID4VP 1.0 | fail-closed implementace |
| `qes` / `qes-approval` | současný CSC/ETSI model | implementovat, ale sledovat nové verze |
| přesná QTSP enrolment API sekvence | není jednotně uzavřena jedním wallet profilem | abstrahovat za provider adapter |
| mapování `qesApproval` → SAD/SAM | závisí na remote QSCD/QTSP profilu | nedělat implicitní mapování |
| document retrieval mimo ETSI `qes` flow | část reference stacku je experimentální | nepublikovat jako interoperabilní contract |
| iOS QES transaction data | draft implementace | nebrat jako hotovou baseline |
| budoucí zjednodušení QES authorization mimo [[OID4VP]] | diskutované | neblokovat architekturu jen na jeden transport |

### `qes-approval` může ještě evolvovat

CSC Data Model Bindings u QES transaction typů explicitně upozorňují na možnost změn v budoucích verzích. To neznamená, že jsou dnešní struktury nepoužitelné; znamená to, že implementátor by neměl hardcodovat JSON parser do doménové vrstvy bez verze/profile abstraction.

Doporučené rozhraní:

```text
TransactionTypeHandler
    ├── parse(raw)
    ├── validate(profileVersion)
    ├── renderConsent()
    ├── createFormatBinding()
    └── verifyResponse()
```

namísto:

```text
if type == "qes-approval":
    deserialize directly into permanent DB model
```

---

# Část VIII — bezpečnostní checklist

## 25. Co bych v produkční implementaci považoval za nepřekročitelné

### 1. Oddělit wallet proof key od QES key

Nikdy z existence validního KB-JWT neodvodit, že vznikl QES.

### 2. Ověřit [[RP]] / Authorization Server před zobrazením podpisového consentu

Uživatel musí vědět, kdo podpis žádá. Request object, certifikáty a EUDI trust policy je nutné ověřit před akcí.

### 3. `transaction_data` zpracovávat fail-closed

Pokud wallet:

- nezná `type`,
- neumí konkrétní format binding,
- nerozumí neznámému povinnému poli,
- nemá eligible credential,
- neumí bezpečně zobrazit význam operace,

má request odmítnout, nikoli pokračovat jako obyčejná prezentace.

### 4. Uchovat raw reprezentaci

Pro generic [[OID4VP]] hash i QES approval binding je zásadní zachovat přesné přijaté bajty/řetězce.

```text
raw string / raw decoded bytes
   ├── crypto binding
   └── parse → validation → UI
```

nikoli:

```text
parse → normalize → serialize → crypto binding
```

### 5. Dokument zobrazit a zkontrolovat

`href` bez integrity kontroly je nebezpečný. Pokud request nese checksum, musí být validován proti skutečně načtenému dokumentu.

### 6. Consent musí odpovídat tomu, co bude podepsáno

Minimálně:

- dokument / jasný label,
- protistrana,
- počet podpisů,
- signature qualifier,
- použitý credential,
- relevantní parametry podpisu.

Uživatel nemá potvrzovat neurčité „Pokračovat“.

### 7. `qesApproval` není univerzální podpisový activation token

QTSP musí explicitně vyhodnotit:

- identitu uživatele,
- vazbu na `credentialID`,
- digests,
- freshness,
- replay,
- policy remote QSCD,
- platnost wallet credentialu a proof.

### 8. Po `signHash` ověřit výsledný podpis

SCA má před předáním dokumentu uživateli nebo [[RP]] ověřit, že:

- signature value odpovídá DTBSR,
- certifikát je ten očekávaný,
- PAdES je syntakticky i kryptograficky validní,
- nevznikla záměna dokumentu.

### 9. Logy jsou citlivé

Signing transaction log může obsahovat:

- identifikaci dokumentu,
- QTSP,
- certifikát,
- digest,
- informaci o právní transakci.

Retence, šifrování a export logu musí respektovat privacy požadavky; „audit log“ není důvod ukládat celý dokument bez omezení.

---

# Část IX — doporučený referenční design

## 26. Jak bych dnes QES podporu v peněžence rozdělil

Z pohledu implementace bych nepoužil jednu monolitickou „QES service“, ale následující vrstvy:

```text
┌──────────────────────────────────────────────┐
│ QES UX / orchestration                      │
│ - výběr dokumentu                           │
│ - výběr QTSP / local QSCD                   │
│ - consent                                   │
└─────────────────┬────────────────────────────┘
                  │
┌─────────────────▼────────────────────────────┐
│ Transaction request layer                   │
│ - OID4VP qes                                │
│ - OID4VP qes-approval                       │
│ - local user-initiated signing              │
└─────────────────┬────────────────────────────┘
                  │
┌─────────────────▼────────────────────────────┐
│ Signature Creation Application              │
│ - PAdES / DTBSR                             │
│ - checksum / document retrieval             │
│ - final signature assembly + validation     │
└───────────────┬─────────────────┬────────────┘
                │                 │
        ┌───────▼──────┐   ┌──────▼─────────────┐
        │ Local QSCD   │   │ Remote signer      │
        │ adapter      │   │ - CSC 2.2 client   │
        └──────────────┘   │ - OAuth            │
                           │ - signHash          │
                           └──────┬──────────────┘
                                  │
                           ┌──────▼──────────────┐
                           │ QTSP / SAM / QSCD   │
                           └─────────────────────┘
```

Tento design má dvě výhody:

1. lokální a remote QSCD sdílejí signing UX a PAdES engine,
2. [[OID4VP]] je transport/authorization layer, nikoli natvrdo zabudovaný do podpisové kryptografie.

---

## 27. Kompletní příklad: podpis smlouvy remote QES

Nakonec celý tok v jednom příkladu.

### Krok 1 — [[RP]] vytvoří request

[[RP]] má smlouvu:

```text
https://bank.example/contracts/loan-2026-041.pdf
```

spočítá checksum a vytvoří `qes` transaction object:

```json
{
  "type": "https://cloudsignatureconsortium.org/2025/qes",
  "credential_ids": ["signing_cert"],
  "signatureRequests": [
    {
      "label": "Úvěrová smlouva 2026-041",
      "access": {"type": "public"},
      "href": "https://bank.example/contracts/loan-2026-041.pdf",
      "checksum": {
        "value": "k4W...==",
        "algorithmOID": "2.16.840.1.101.3.4.2.1"
      },
      "signature_format": "P",
      "conformance_level": "AdES-B-B",
      "signatureQualifier": "eu_eidas_qes",
      "signAlgo": "1.2.840.113549.1.1.1",
      "responseURI": "https://bank.example/qes/result/tx-184"
    }
  ]
}
```

Tento přesný JSON převede na UTF-8 a base64url bez paddingu a vloží do:

```json
{
  "dcql_query": {
    "credentials": [
      {
        "id": "signing_cert",
        "format": "https://cloudsignatureconsortium.org/2025/x509"
      }
    ]
  },
  "transaction_data": [
    "eyJ0eXBlIjoiaHR0cHM6Ly9jbG91ZHNpZ25hdHVyZWNvbnNvcnRpdW0ub3JnLzIwMjUvcWVzIi..."
  ]
}
```

### Krok 2 — wallet ověří request

Wallet:

```text
ověří JAR / protistranu
→ validuje DCQL
→ base64url dekóduje transaction_data
→ parser qes typu
→ stáhne PDF
→ ověří checksum
```

### Krok 3 — SCA připraví podpis

```text
PDF
 ↓
PAdES signing preparation
 ↓
DTBSR
 ↓
SHA-256
 ↓
document digest
```

### Krok 4 — wallet zvolí remote credential

```http
POST /csc/v2/credentials/info
Authorization: Bearer SERVICE_ACCESS_TOKEN
Content-Type: application/json

{
  "credentialID": "GX0112348",
  "certificates": "single",
  "certInfo": true,
  "authInfo": true
}
```

### Krok 5 — QTSP požádá o QES approval

Authorization Server vytvoří druhou [[OID4VP]] transakci:

```json
{
  "type": "https://cloudsignatureconsortium.org/2025/qes-approval",
  "credential_ids": ["qes_service_attestation"],
  "credentialID": "GX0112348",
  "signatureQualifier": "eu_eidas_qes",
  "numSignatures": 1,
  "documentDigests": [
    {
      "label": "Úvěrová smlouva 2026-041",
      "hash": "BASE64_DTBSR_HASH",
      "hashType": "dtbsr"
    }
  ],
  "hashAlgorithmOID": "2.16.840.1.101.3.4.2.1"
}
```

### Krok 6 — uživatel schválí

Wallet ukáže například:

```text
Kvalifikovaný elektronický podpis

Dokument:
Úvěrová smlouva 2026-041

Žadatel:
Banka Example a.s.

Podpisová služba:
QTSP Example

Počet podpisů:
1

[Zobrazit dokument]

[Zrušit]   [Podepsat kvalifikovaně]
```

Po autentizaci uživatele vytvoří wallet presentation a `qesApproval`.

### Krok 7 — QTSP ověří approval

Authorization Server musí ověřit minimálně:

```text
presentation signature / device authentication
nonce + audience + freshness
credential status
transaction binding
qesApproval digest
credentialID == autorizovaný remote credential
document digest == očekávaný DTBSR
policy konkrétního remote QSCD
```

### Krok 8 — token a `signHash`

Po úspěchu:

```http
POST /oauth2/token
...
```

→ credential-scoped token.

Potom:

```http
POST /csc/v2/signatures/signHash
Authorization: Bearer CREDENTIAL_ACCESS_TOKEN
Content-Type: application/json

{
  "credentialID": "GX0112348",
  "hashes": ["BASE64_DTBSR_HASH"],
  "hashAlgorithmOID": "2.16.840.1.101.3.4.2.1",
  "signAlgo": "1.2.840.113549.1.1.1"
}
```

Odpověď:

```json
{
  "signatures": [
    "BASE64_QUALIFIED_SIGNATURE_VALUE"
  ]
}
```

### Krok 9 — vznikne PAdES

SCA:

```text
signature value
+
qualified certificate
+
prepared PDF signature container
        │
        ▼
PAdES
```

Následně ověří výsledný dokument a odešle ho na `responseURI` nebo vrátí přes odpovídající response mechanismus.

---

## 28. Co si z toho odnést

QES v [[EUDIW]] není jedna funkce ani jeden protokol.

Je to řetězec:

```text
request / dokument
       │
       ▼
uživatelské porozumění + consent
       │
       ▼
OID4VP transaction binding
       │
       ▼
credential authorization
       │
       ▼
signature activation
       │
       ▼
qualified signing key v QSCD
       │
       ▼
PAdES
       │
       ▼
validace + předání výsledku
```

Nejdůležitější architektonické body jsou:

- **QSCD může být lokální, externí i remote** a peněženka musí být schopna s těmito modely pracovat.
- **PAdES a ETSI TS 119 432 v1.3.1 už nejsou jen doporučení reference stacku**; po změně prováděcího nařízení tvoří konkrétní evropskou technickou baseline.
- **CSC řeší remote signing API**, zejména credential discovery a vlastní `signHash`.
- **[[OID4VP]] `transaction_data` řeší autorizaci konkrétní operace** a brání tomu, aby se obyčejná autentizace zaměnila za souhlas s podpisem.
- **`qes` a `qes-approval` jsou dva odlišné modely**: první žádá wallet/SCA o vytvoření QES, druhý autorizuje podpis, který dokončí remote signing infrastruktura.
- **`qesApproval` není QES ani automaticky SAD**.
- **generic `transaction_data_hashes` a `qesApproval` mají odlišný hash input** — implementace musí zachovat původní wire representation.
- **referenční implementace je už prakticky použitelná pro Android remote QES**, ale její jednotlivé komponenty se stále rychle mění a některé profily, zejména iOS QES transaction data a část enrolmentu, ještě nejsou uzavřené.

Pro návrh produkční peněženky bych proto dnes považoval za správné implementovat povinný ETSI/PAdES základ, držet CSC a transaction-type handlery verzovaně a vše, co je dnes pouze referenční nebo diskusní, schovat za jasnou abstrakci místo zakódování do doménového modelu.

---

## Hlavní technické zdroje

- [ETSI TS 119 432 v1.3.1 — Protocols for remote digital signature creation](https://www.etsi.org/deliver/etsi_ts/119400_119499/119432/01.03.01_60/ts_119432v010301p.pdf)
- [OpenID for Verifiable Presentations 1.0 — Transaction Data](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#name-transaction-data)
- [Cloud Signature Consortium — CSC API v2.2](https://cloudsignatureconsortium.org/resources/csc-api-v2-2/)
- [Cloud Signature Consortium — Data Model Bindings](https://cloudsignatureconsortium.org/wp-content/uploads/2025/10/data-model-bindings.pdf)
- [ARF — aktuální dokumentace](https://eudi.dev/latest/)
- [ARF Topic AB — Digital Signature using the EUDI Wallet](https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework/issues/655)
- [EUDI rQES CSC Kotlin library](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-rqes-csc-kt)
- [EUDI Android RQES UI](https://github.com/eu-digital-identity-wallet/eudi-lib-android-rqes-ui)
- [EUDI reference QTSP server](https://github.com/eu-digital-identity-wallet/eudi-srv-web-walletdriven-rpcentric-signer-qtsp-java)
- [Android Wallet Core — OpenID4VP transaction data for mdoc](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/424)
- [iOS Wallet Kit — QES transaction data draft PR #493](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-wallet-kit/pull/493)

### Související článek na WalletMap

Pro detail generic [[OID4VP]] `transaction_data`, přesné hashování raw request stringu, bankovní SCA a původní rozbor QES typů viz:

[transaction_data v OpenID4VP: jak EUDI Wallet potvrzuje platbu i QES](/clanky/transaction-data-sca-qes/)
