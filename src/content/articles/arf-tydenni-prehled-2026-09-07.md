---
title: "Týdenní EUDI Wallet přehled — 7.–14. září 2026"
description: "Bez nové revize ARF/TS; OpenID4VCI odděluje protokolové proof capabilities od EUDI policy, PID issuer přechází na x5u + x5t#S256 a zpřesňuje se trust binding metadat i verifier identity."
pubDate: 2026-09-14
tags: [arf, tydenni-prehled, oid4vci, oid4vp, pid, trust, key-attestation, sd-jwt]
draft: false
---

Tento týden je proti předchozím méně o změně samotných specifikací a více o **konvergenci referenčních implementací ke konkrétnímu security profilu**. V repozitářích ARF ani Standards & Technical Specifications nebyl mezi 7. a 14. zářím žádný nový nebo aktualizovaný PR, takže normativní baseline ARF/TS se tento týden nezměnila.

Nejvýznamnější věcný posun vidím v [[OID4VCI]]: Android/JVM i Swift nyní znovu připouštějí **plain JWT proof bez [[KA|Key Attestation]]**, ale produkční EUDI/HAIP profil jej nadále nemá používat jako default.

### Sloučené změny

**1. OpenID4VCI: návrat plain JWT Proof bez Key Attestation.**
Dne **10. září** byl v JVM [[OID4VCI]] sloučen [PR #602](https://github.com/eu-digital-identity-wallet/eudi-lib-jvm-openid4vci-kt/pull/602). Knihovna nyní explicitně rozlišuje tři varianty proof:

```text
JWT proof bez Key Attestation
JWT proof + Key Attestation
Attestation proof
```

Konfigurace tomu odpovídá přes samostatné `jwtProofWithKeyAttestation`, `jwtProofsWithoutKeyAttestation` a `attestationProof`. Důležitý detail je, že **plain JWT není defaultně povolen**. Default stále zapíná JWT + [[KA|Key Attestation]] a Attestation Proof.

Stejný krok udělal **Swift [[OID4VCI]]**, rovněž sloučený **10. září**, v [PR #349](https://github.com/eu-digital-identity-wallet/eudi-lib-ios-openid4vci-swift/pull/349). Zde je řešení ještě explicitnější: knihovna zavádí policy režimy `strict`, `acceptAll` a `flexible`. Produkční default `haipCompliant()` je `strict` a přijímá pouze attested proofs; plain JWT musí implementátor vědomě povolit.

Tohle je důležité interpretačně. Neznamená to:

> EUDI Wallet opouští Key Attestation.

Spíše se oddělují dvě vrstvy:

```text
OpenID4VCI protocol capability
        │
        ├── plain JWT
        ├── JWT + Key Attestation
        └── Attestation Proof
                 │
                 ▼
EUDI / HAIP policy
        │
        └── vyžaduje device-bound / attested variantu
```

Pro implementátora je to dobrý model: **protokolová knihovna nemusí hardcodovat evropský profil**, ale produkční wallet musí profil explicitně nakonfigurovat.

---

**2. PID Issuer byl srovnán s aktuálním PID Rulebookem.**
[PR #651](https://github.com/eu-digital-identity-wallet/eudi-srv-pid-issuer/pull/651) byl sloučen **11. září** a přímo deklaruje alignment s latest [[PID]] Rulebook.

Z [[PID]] se odstraňují `house_number` jako samostatný claim a dříve používané **trust anchor claims**.

Naopak se přidávají administrativní data validity a používají se pro:

```text
issuance_date
expiry_date
```

To je prakticky důležité, pokud máte vlastní [[PID]] mapper/datový model odvozený ze staršího Rulebooku. Doporučil bych zejména **nepovažovat dřívější set [[PID]] claims za stabilní API kontrakt** a nevázat interní schéma 1:1 na konkrétní starší verzi rulebooku.

---

**3. SD-JWT VC PID/EAA: issuer certificate se nyní publikuje pomocí `x5u` + `x5t#S256`.**
Hned navazující [PID issuer PR #652](https://github.com/eu-digital-identity-wallet/eudi-srv-pid-issuer/pull/652), také z **11. září**, přidává do [[PID]]/EAA ve formátu [[SD-JWT-VC|SD-JWT VC]]:

```text
x5u
x5t#S256
```

a nový veřejný endpoint přibližně:

```text
/signing-certificates/sd-jwt-vc/{vct}
```

ze kterého lze získat signing certificate chain pro daný VCT.

Implementačně vzniká čistý model:

```text
SD-JWT VC
   │
   ├── x5u ──────────────► issuer certificate endpoint
   │
   └── x5t#S256 ─────────► thumbprint očekávaného certifikátu
                              │
                              ▼
                           PKIX / LoTE
```

Tedy ne „důvěřuj certifikátu z URL“, ale:

1. bezpečně stáhnout chain,
2. ověřit vazbu `x5t#S256`,
3. provést PKIX/trust validaci proti odpovídajícím trust anchors z [[LoTE]].

To zapadá do celkového trendu, kdy se trust informace přesouvají pryč z proprietárních credential claims směrem ke standardní X.509/[[LoTE]] infrastruktuře.

---

**4. OpenID4VP Verifier: `aud` JAR se při dynamic discovery váže na konkrétní Wallet issuer.**
[Verifier Endpoint #615](https://github.com/eu-digital-identity-wallet/eudi-srv-verifier-endpoint/pull/615) mění konstrukci JAR. Dosavadní audience byla staticky:

```text
https://self-issued.me/v2
```

Nově, pokud Wallet při POST request-uri flow poskytne `wallet_metadata` s `issuer`, použije [[Verifier|verifier]] tento issuer jako `aud` request objectu. U statického GET flow zůstává `https://self-issued.me/v2`.

Schéma tedy vypadá:

```text
POST request_uri
Wallet → wallet_metadata.issuer = https://wallet.example

Verifier JAR:
aud = https://wallet.example
```

To je podstatné pro **audience binding JAR**. Signed request už není pouze „platně podepsaný request [[Verifier|verifieru]]“, ale je kryptograficky adresovaný konkrétní wallet identitě z discovery.

---

**5. Trust/LoTE: iOS může používat vlastní zabezpečený transport pro stahování List of Trusted Entities.**
[ETSI 1196x2 PR #138](https://github.com/eu-digital-identity-wallet/eudi-lib-kmp-etsi-1196x2/pull/138) přidává do `EudiwIosTrust` možnost dodat vlastní `LoadLoTE`. iOS aplikace tedy už nemusí používat vestavěný Darwin downloader a může [[LoTE]] načítat přes svůj networking stack s vlastními TLS pravidly, timeouty, response-size limity apod.

To není změna trust modelu samotného, ale pro produkční implementaci je praktická: **[[LoTE]] download je bezpečnostně citlivý síťový vstup a měl by procházet stejným hardened HTTP stackem jako ostatní trust material**.

---

**6. Android Wallet Core přechází na TS10 Transaction Log model.**
[PR #407](https://github.com/eu-digital-identity-wallet/eudi-lib-android-wallet-core/pull/407) je breaking změna: původní `TransactionLog` nahrazuje typovaný `TransactionEntry`. Nově se logují nejen presentation transakce, ale také issuance/re-issuance, credential deletion a lze přidávat další typy. Datový model je explicitně sladěn s **TS10**.

Důležitý detail pro úložiště: jedna transakce se zapisuje opakovaně během životního cyklu se stejným `transactionIdentifier`. Backend tedy musí dělat **UPSERT podle transactionIdentifier**, nikoli append-only insert. Export zatím vytváří plaintext JSON obsah TS10 objektu; [[JWE]] obálka definovaná TS10 ještě implementována není.

Tohle bych určitě zohlednil při návrhu audit/history subsystemu walletu.

### Otevřené návrhy

Za nejpodstatnější otevřenou změnu považuji **iOS OpenID4VCI #348**. PR reaguje rovnou na čtyři security findings kolem **identity binding metadata**. Wallet dnes podle návrhu musí porovnávat celý Credential Issuer URL, nikoli pouze hostname; Authorization Server metadata musí podle RFC 8414 skutečně obsahovat `issuer` odpovídající discovery URL; a Credential Offer si má zachovat původní důvěryhodný issuer identifier místo přepsání hodnotou z načtených metadata. Autoři výslovně uvádějí, že tím zavírají možný **client-attestation relay attack chain**. PR je stále open, ale **14. září už získal approval**.

Velmi podobně bezpečnostně důležitý je **iOS OpenID4VCI #350**. Současný kód uměl při chybných encryption metadata přes `try? ... ?? .notSupported` převést například „issuer vyžaduje encryption, ale metadata jsou nevalidní“ na pouhé „encryption není podporována“. Návrh mění chování na fail-closed: chybějící blok může znamenat `notSupported`, ale **přítomný nevalidní blok musí skončit chybou**. I tento PR je open a 14. září získal approval.

Stále otevřený je také **iOS OpenID4VP #219**, který váže `response_uri`/`redirect_uri` na **autentizovanou identitu [[Verifier|verifieru]]**. Pro `x509_san_dns` musí `client_id` odpovídat DNS SAN certifikátu a host `response_uri` autentizovanému client ID; u `verifier_attestation` musí response/redirect URI patřit mezi URI deklarované attestací. Pokud tenhle PR projde, považoval bych jej za důležitý security upgrade.

A z oblasti SD-JWT stojí za sledování **#488**, který konečně odděluje validaci credentialu při **issuance** od validace při **presentation** a interpretuje `mandatory` z Type Metadata podle kontextu. Povinný selectively-disclosable claim může při presentation legitimně chybět, pokud jeho disclosure nebyl předložen; při issuance ale musí být přítomen. To je správný a důležitý rozdíl, protože stejná validační funkce pro obě fáze vede buď k falešným rejectům presentation, nebo k příliš benevolentní validaci issuance.

### Co z toho plyne pro implementátory

Nejvíc bych si odnesl čtyři implementační principy.

**Proof type capability není totéž co EUDI policy.** [[OID4VCI]] SDK může podporovat plain JWT, ale produkční EUDI konfigurace má dál explicitně vyžadovat attested/device-bound proof tam, kde to profil požaduje.

**Metadata mají vlastní trust boundary.** `credential_issuer`, AS `issuer`, discovery URL a původní identifier z Credential Offeru musí být vzájemně bindované. Nestačí HTTPS a nestačí shoda hostname.

**Certifikát získaný přes `x5u` není automaticky trusted.** Potřebujete `x5t#S256` binding + PKIX + příslušný [[LoTE]]/trust context.

**Fail-closed parsing security metadata je zásadní.** Rozdíl mezi „pole není přítomno“ a „pole je přítomno, ale je nevalidní/nepodporované“ nesmí zmizet pomocí fallbacku na `notSupported`.

Celkově tedy tento týden nepřinesl nový ARF/TS text, ale implementačně je poměrně důležitý: **EUDI stack se dál rozděluje na obecné protokolové capability a explicitní EUDI security policy, zatímco trust binding mezi URL, metadata, certifikátem, wallet/verifier identitou a konkrétní protistranou se postupně zpřísňuje.**
