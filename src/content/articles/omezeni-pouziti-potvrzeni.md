---
title: "Jak může vydavatel omezit použití elektronického potvrzení atributů v EUDI Wallet"
description: "Reuse policy, Embedded Disclosure Policy, platnost, revokace a kryptografické vazby: jak vydavatel řídí následné použití EAA v evropské peněžence — a co standardní mechanismy samy o sobě neumějí."
pubDate: 2026-09-15
tags: [eidas, eudiw, eaa, pid, rp, wrprc, wrpac, oid4vci, sd-jwt-vc, vazby, atestace]
draft: false
---

[[EAA|Elektronická potvrzení atributů]] uložená v [[EUDIW|evropské peněžence digitální identity]] nemusí být univerzálně použitelná bez omezení. Vydavatel může při vydání ovlivnit například to, **jak často má být stejný technický credential používán, kterým relying parties může být potvrzení zpřístupněno, jak dlouho je platné nebo zda jej lze před koncem platnosti zneplatnit**.

Jednotlivé mechanismy však řeší různé problémy. Omezení typu „použij tento credential pouze jednou“ je především nástrojem proti sledování uživatele mezi transakcemi. Embedded Disclosure Policy naopak určuje, vůči kterým relying parties vydavatel připouští zpřístupnění potvrzení. Platnost a revokace řeší, zda je potvrzení ještě možné považovat za platné. A kryptografický binding omezuje možnost potvrzení zkopírovat do jiné peněženky.

Aktuální technický základ těchto mechanismů tvoří zejména ETSI TS 119 472-3 V1.1.1 z března 2026. Prováděcí nařízení (EU) 2024/2982 ve znění změny provedené nařízením (EU) 2026/1731 na tuto specifikaci přímo odkazuje a stanoví také několik úprav jejího použití. ([Eur-Lex][1])

## Omezení použití není jedna vlastnost

Při návrhu konkrétního [[EAA]] je užitečné rozlišovat několik samostatných otázek:

| Otázka                                                      | Hlavní mechanismus                          |
| ----------------------------------------------------------- | ------------------------------------------- |
| Má se při každé transakci použít jiný technický credential? | `credential_reuse_policy`                   |
| Má stejný credential fungovat jen krátkou dobu?             | technická platnost + `limited-time`         |
| Má mít každá relying party jinou instanci credentialu?      | `per-relying-party`                         |
| Smí být [[EAA]] předloženo jen konkrétním relying parties?      | Embedded Disclosure Policy                  |
| Smí být [[EAA]] předloženo jen určité kategorii subjektů?       | EDP + entitlement relying party             |
| Smí být [[EAA]] předloženo jen v určité trust infrastruktuře?   | EDP + specific root of trust                |
| Jak dlouho je credential platný?                            | `exp`, `validUntil` apod. podle formátu     |
| Lze jeho platnost ukončit předčasně?                        | revokace / status                           |
| Lze credential překopírovat do jiné peněženky?              | cryptographic holder/device binding         |
| Lze určit obchodní pravidlo „maximálně třikrát za život“?   | standardní reuse policy sama o sobě nestačí |

Zvlášť důležité je poslední rozlišení: **počet použití jednoho technického credentialu není totéž jako počet použití oprávnění, které credential reprezentuje**.

---

## 1. Credential reuse policy: jak se má credential opakovaně používat

ETSI TS 119 472-3 definuje v Issuer Metadata parametr `credential_reuse_policy`. Vydavatel jím sděluje peněžence, jakým způsobem má zacházet s jednotlivými technickými instancemi [[PID]] nebo [[EAA]]. Specifikace definuje čtyři základní režimy:

* `once_only`,
* `limited-time`,
* `rotating-batch`,
* `per-relying-party`.

ETSI stanoví, že tato informace je součástí `credential_metadata` příslušné konfigurace credentialu. Pokud `credential_reuse_policy` podle samotné ETSI specifikace chybí, znamená to, že vydavatel počet prezentací daného [[PID]]/[[EAA]] tímto mechanismem neomezuje. Aktuální ARF jde dále a předpokládá používání tohoto parametru pro stanovení reuse strategie. 

## Varianta A: `once_only`

Režim `once_only` znamená, že **jedna konkrétní technická instance credentialu má být použita pouze jednou**.

ETSI uvádí například následující strukturu:

```json
{
  "credential_reuse_policy": {
    "id": "arf_annex_ii",
    "options": [
      {
        "details": ["once_only"],
        "batch_size": 10,
        "reissue_trigger_unused": 2
      }
    ]
  }
}
```

Tento příklad vychází přímo z ETSI TS 119 472-3. `batch_size` určuje velikost dávky credentialů a `reissue_trigger_unused` hranici, při níž má peněženka zahájit získání nové dávky. 

### Jak se to projeví v praxi

Představme si elektronické potvrzení o profesní kvalifikaci.

V peněžence není pouze jedna technická instance:

```text
ProfessionalQualification #1
ProfessionalQualification #2
ProfessionalQualification #3
...
ProfessionalQualification #10
```

Obsahově mohou všechny potvrzovat totéž:

```text
holder = Jan Novák
qualification = Authorized Engineer
valid_until = 2027-06-30
```

Technicky však jde o deset samostatných credentialů.

Při první prezentaci peněženka použije například credential č. 7, při druhé č. 2 a při další č. 9. Jednou použitou instanci již za normálních okolností znovu nepoužije. Jakmile zůstávají jen dvě nepoužité instance, `reissue_trigger_unused: 2` vyvolá doplnění další dávky.

Smyslem tohoto režimu není zejména říci:

> „Profesní oprávnění lze využít maximálně desetkrát.“

Smyslem je:

> „Stejnou technickou reprezentaci profesního oprávnění nepředkládej různým relying parties opakovaně.“

Jde tedy hlavně o omezení **linkability** — možnosti různých relying parties zjistit podle identického technického credentialu, že komunikovaly se stejným uživatelem. ARF výslovně spojuje reuse policy právě se snižováním rizika linkability. ([Eudi][2])

---

## 2. `limited-time`: jedna instance používaná po omezenou dobu

Druhou možností je použít jednu technickou instanci opakovaně, ale jen po omezenou dobu.

Příklad ETSI:

```json
{
  "credential_reuse_policy": {
    "id": "arf_annex_ii",
    "options": [
      {
        "details": ["limited-time"],
        "reissue_trigger_lifetime_left": 86400
      }
    ]
  }
}
```

Hodnota `86400` představuje 86 400 sekund, tedy 24 hodin. Neříká ale, že credential platí 24 hodin. Říká, že **24 hodin před jeho expirací má být vyvoláno obnovení**. 

Samotná technická platnost je součástí credentialu a její přesná reprezentace závisí na jeho formátu. Například u JWT založených formátů se může projevit jako:

```json
{
  "iat": 1789466400,
  "nbf": 1789466400,
  "exp": 1790071200
}
```

kde `exp` představuje okamžik expirace.

Výsledné chování může být:

```text
15. 9. 2026   credential vydán
16. 9.        prezentace bance A
17. 9.        prezentace bance B
18. 9.        další prezentace bance A
...
21. 9.        zbývá 24 hodin → peněženka zahájí re-issuance
22. 9.        starý credential expiruje
```

V režimu `limited-time` může být tedy **stejná technická instance viditelná několika relying parties**. Z hlediska ochrany proti korelaci je proto méně silná než `once_only`, ale výrazně zjednodušuje issuance a správu credentialů. ARF stanoví, že u této metody může wallet stejný credential prezentovat opakovaně stejné i různým relying parties až do jeho expirace. ([Eudi][2])

---

## 3. `rotating-batch`: několik instancí, které se střídají

Kompromisem mezi předchozími variantami je `rotating-batch`.

ETSI uvádí například:

```json
{
  "credential_reuse_policy": {
    "id": "arf_annex_ii",
    "options": [
      {
        "details": ["rotating-batch"],
        "batch_size": 50,
        "reissue_trigger_lifetime_left": 86400
      }
    ]
  }
}
```

Peněženka tedy disponuje například 50 ekvivalentními technickými instancemi. Při prezentacích je postupně používá v náhodném pořadí. Po použití celé dávky ji může „resetovat“ a jednotlivé instance začít znovu používat. 

Příklad:

```text
RP A  → credential 37
RP B  → credential 12
RP C  → credential 48
RP D  → credential 3
...
```

Po 50 prezentacích nezačne credential jako celek automaticky odmítat další transakce. Jednotlivé instance mohou být opět použity.

Proto ani:

```json
"batch_size": 50
```

**neznamená „credential lze použít maximálně padesátkrát“.**

Je to velikost poolu technických instancí, nikoli obchodní limit spotřeby oprávnění.

---

## 4. `per-relying-party`: jiná instance pro každou relying party

Režim `per-relying-party` řeší jiný problém. Peněženka se snaží zajistit, aby **různé relying parties dostávaly různé technické credentialy**.

Po změně právního rámce v roce 2026 je třeba při této variantě zohlednit také úpravu ETSI pravidel provedenou nařízením (EU) 2026/1731. Pro `per-relying-party` se vyžaduje také `reissue_trigger_unused`. ([Eur-Lex][3])

Datově tak může konfigurace vypadat například takto:

```json
{
  "credential_reuse_policy": {
    "id": "arf_annex_ii",
    "options": [
      {
        "details": ["per-relying-party"],
        "batch_size": 10,
        "reissue_trigger_unused": 2,
        "reissue_trigger_lifetime_left": 86400
      }
    ]
  }
}
```

Při používání se pak vytváří logická vazba:

```text
Banka A        → credential #3
Banka B        → credential #8
Pojišťovna C   → credential #1
Banka A znovu  → credential #3
```

ARF požaduje, aby wallet pro různé relying parties použila rozdílné instance a evidovala vazbu podle unikátního identifikátoru relying party. Při dalších transakcích se stejnou relying party může stejnou instanci použít znovu. ([Eudi][2])

Tento mechanismus je potřeba odlišovat od whitelistu.

`per-relying-party` neříká:

> „Jen Banka A smí credential získat.“

Říká:

> „Bance A ukaž jinou technickou instanci než Bance B.“

Pro skutečné omezení okruhu příjemců slouží Embedded Disclosure Policy.

---

## 5. Embedded Disclosure Policy: komu smí být [[EAA]] zpřístupněno

Embedded Disclosure Policy, zkráceně EDP, je sada pravidel spojených s [[EAA]], která určuje podmínky, jež má relying party splnit pro přístup k potvrzení. Prováděcí nařízení požaduje, aby wallet policy vyhodnotila společně s autentizovanými informacemi o requesting relying party a informovala uživatele o výsledku. Od srpna 2026 je technická specifikace EDP přímo navázána na článek 4.2.5 ETSI TS 119 472-3. ([Eur-Lex][4])

ETSI umožňuje mimo jiné:

1. žádné omezení,
2. seznam autorizovaných relying parties,
3. podmínku založenou na entitlementu relying party,
4. konkrétní root nebo intermediate certificate,
5. rozšíření policy, případně odlišná pravidla pro vybrané atributy. ([ETSI][5])

Důležitá technická poznámka: ETSI TS 119 472-3 v současné verzi definuje **sémantický datový model EDP**, ale nepředepisuje u všech jeho prvků tak jednoznačnou JSON serializaci jako u `credential_reuse_policy`. Následující JSON ukázky EDP jsou proto **schematické**, zatímco identifikátory, DN a entitlement URI odpovídají prvkům definovaným ve specifikacích.

## Omezení na konkrétní relying party

Vydavatel může autorizovanou [[RP|relying party]] identifikovat prostřednictvím jejího subject distinguished name v [[WRPAC|access certificate]].

Schematicky:

```json
{
  "policy": "authorised_relying_parties_only",
  "authorised_relying_parties": [
    {
      "subject_dn":
        "CN=Example Bank,O=Example Bank,ORGID=CZ-EXAMPLE-001,C=CZ"
    }
  ]
}
```

Wallet obdrží presentation request a současně autentizuje [[WRPAC|access certificate]] [[RP|relying party]].

Jestliže certifikát obsahuje například:

```text
CN=Example Bank
O=Example Bank
ORGID=CZ-EXAMPLE-001
C=CZ
```

policy vyhoví.

Pokud požadavek pošle:

```text
CN=Other Bank
O=Other Bank
ORGID=CZ-EXAMPLE-002
C=CZ
```

výsledek vyhodnocení bude negativní.

ETSI stanoví právě použití LDAP reprezentace subject DN podle RFC 4514; pro právnickou osobu pracuje mimo jiné s `commonName`, `organizationName`, `organizationIdentifier` a `countryName`. 

---

## 6. Omezení podle role nebo oprávnění relying party

Vydavatel nemusí vyjmenovávat jednotlivé společnosti. EDP může pracovat také s **entitlementem** relying party.

ETSI TS 119 475 například definuje celoevropské entitlementy:

```text
Service_Provider
QEAA_Provider
Non_Q_EAA_Provider
PUB_EAA_Provider
PID_Provider
```

a jejich standardizované URI. Například:

```text
https://uri.etsi.org/19475/Entitlement/QEAA_Provider
```

označuje poskytovatele kvalifikovaných elektronických potvrzení atributů. ([ETSI][6])

Schematická EDP pak může odpovídat pravidlu:

```json
{
  "policy": "authorised_relying_parties_only",
  "required_entitlement":
    "https://uri.etsi.org/19475/Entitlement/QEAA_Provider"
}
```

Praktickým případem může být [[EAA]] obsahující údaje, které vydavatel připouští zpřístupnit pouze jiným [[QEAA]] providerům.

Wallet ověří autentizovaná data relying party a zjistí například:

```json
{
  "entitlements": [
    "https://uri.etsi.org/19475/Entitlement/QEAA_Provider"
  ]
}
```

Podmínka tedy vyhoví.

ETSI TS 119 475 obsahuje entitlementy také přímo v datovém modelu [[WRPRC|registračního certifikátu]] [[RP|relying party]]. ([ETSI][6])

---

## 7. Omezení na konkrétní trust infrastrukturu

Další variantou EDP je **Specific root of trust**.

Issuer nemusí určovat jednotlivé relying parties. Může říci, že potvrzení má být zpřístupňováno pouze subjektům, jejichž access certificate vychází z určitého root nebo intermediate certifikátu.

ETSI požaduje, aby každý takový trust anchor obsahoval zejména:

* distinguished name issuera certifikátu,
* serial number certifikátu. 

Schematicky:

```json
{
  "policy": "specific_root_of_trust",
  "trusted_roots": [
    {
      "issuer_dn": "CN=Example EUDI RP CA,O=Example Authority,C=CZ",
      "serial_number": "47110815"
    }
  ]
}
```

Wallet pak kontroluje řetězec access certificate relying party:

```text
Relying Party certificate
        ↓
Intermediate RP CA
        ↓
Example EUDI RP CA
```

Je-li řetězec odvozen od rootu uvedeného v policy, podmínka je splněna.

Tento model je vhodný například tam, kde existuje sektorová trust infrastruktura a vydavatel nechce udržovat seznam stovek jednotlivých relying parties.

---

## 8. Rozdílná pravidla pro jednotlivé atributy

ETSI připouští také EDP extension umožňující aplikovat odlišná pravidla na konkrétní selektivně zveřejnitelné atributy. Současně však specifikace upozorňuje, že obecná rozšíření policy mohou být peněženkou ignorována. 

Příklad [[EAA]]:

```json
{
  "qualification": "Physician",
  "specialisation": "Cardiology",
  "licence_number": "CZ-123456",
  "internal_register_id": "987654321"
}
```

Koncepčně může policy stanovit:

```text
qualification
specialisation
    → širší okruh autorizovaných relying parties

licence_number
    → pouze oprávněné zdravotnické subjekty

internal_register_id
    → pouze vymezená relying party
```

Z pohledu interoperability je však vhodné rozlišovat mezi **standardními EDP mechanismy**, které musí ekosystém rozumět, a proprietárními extensions, jejichž chování nemusí být ve všech walletech stejné.

---

## 9. Časová platnost je jiné omezení než reuse policy

Credential může být omezen časově nezávisle na reuse mechanismu.

Příklad:

```text
administrativní platnost licence:
1. 1. 2026 – 31. 12. 2026

technická platnost jedné instance EAA:
15. 9. 2026 – 22. 9. 2026
```

U JWT založeného formátu se technická expirace může projevit například prostřednictvím:

```json
{
  "nbf": 1789466400,
  "exp": 1790071200
}
```

V jiných credential formátech jsou použity jiné datové prvky, například `validFrom` a `validUntil`.

Issuer tedy může mít dlouhodobě platné oprávnění, ale vydávat jen krátkodobé technické credentialy. ARF výslovně počítá s technickou platností jako jedním z parametrů reuse strategie. ([Eudi][7])

To je užitečné například pro zaměstnanecké oprávnění:

> Pracovní vztah je platný dlouhodobě, ale peněženka dostává credential platný jen 24 hodin a pravidelně jej obnovuje.

Takový model výrazně snižuje potřebu revokace dlouhodobě platných credentialů.

---

## 10. Revokace: možnost ukončit platnost před expirací

Vedle expirace může vydavatel použít revokaci.

Revokační informace typicky propojují credential se status listem nebo revocation listem provozovaným vydavatelem. Relying party tak může při validaci zjistit:

```text
credential #4711
        ↓
status endpoint vydavatele
        ↓
valid / revoked
```

ARF 2.8 například předpokládá, že pro credentialy platné déle než 24 hodin mohou být uvnitř credentialu uvedeny údaje o umístění status nebo revocation listu a index či identifikátor odpovídající konkrétnímu credentialu. Pro krátkodobé credentialy může být alternativou jejich krátká životnost bez samostatné revokace. ([Eudi][8])

Revokace je vhodná například tehdy, když:

* zanikne pracovní poměr,
* profesní oprávnění je odebráno,
* změní se atributy,
* dojde ke kompromitaci credentialu.

Jde ale opět o jiný mechanismus než počet použití. Revokace znamená přibližně:

> „Od tohoto okamžiku credential již nepovažujte za platný.“

Není určena k vyjádření:

> „Po třetím použití credential automaticky spotřebujte.“

---

## 11. Binding: credential lze omezit na konkrétního držitele nebo zařízení

Dalším omezením je kryptografický holder/device binding.

Například u [[SD-JWT-VC|SD-JWT]] může být veřejný klíč držitele reprezentován prostřednictvím `cnf`:

```json
{
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

Při prezentaci musí wallet prokázat, že ovládá odpovídající privátní klíč. Pouhé zkopírování credentialu do jiné aplikace tedy nestačí. Princip `cnf` jako proof-of-possession bindingu je standardizován a používá se i u [[SD-JWT-VC|SD-JWT]]. ([RFC Editor][9])

Toto omezení odpovídá otázce:

> „Kdo může credential prezentovat?“

Nikoli:

> „Komu jej může prezentovat?“

Pro druhou otázku je relevantní EDP.

---

## 12. Účel použití: jiná vrstva než issuer policy

[[RP|Relying party]] se v ekosystému [[EUDIW]] registruje a pro každý zamýšlený způsob použití uvádí mimo jiné data a atributy, které chce požadovat, a popis jejich zamýšleného použití. To stanoví prováděcí nařízení (EU) 2025/848. ([Eur-Lex][10])

Technický model [[WRPRC|registračního certifikátu]] definovaný ETSI TS 119 475 obsahuje například:

```json
{
  "purpose": [
    {
      "lang": "en-US",
      "value": "Required for checking the minimum age"
    }
  ],
  "credentials": [
    {
      "format": "dc+sd-jwt",
      "claim": [
        {
          "path": [
            "age_equal_or_over",
            "18"
          ]
        }
      ]
    }
  ]
}
```

Tento příklad vychází z informativního příkladu [[WRPRC|registračního certifikátu]] v ETSI TS 119 475. 

Wallet tak může uživateli ukázat, že relying party je například registrována pro ověření věku a požaduje atribut `age_equal_or_over/18`.

To je ale potřeba odlišovat od issuerem vloženého omezení.

V současném standardním modelu není obecný parametr [[EAA]] ve stylu:

```json
{
  "allowed_purpose": "customer_onboarding_only"
}
```

který by kryptograficky zajistil, že relying party získané údaje následně nikdy nepoužije k jinému účelu. Purpose limitation je kombinací registrace relying party, informování uživatele, právních pravidel a případně dalších policy mechanismů.

---

## Co standardní mechanismy neumějí vyjádřit přímo

Z uvedeného vyplývá důležitá hranice.

Představme si jízdenku, voucher nebo jednorázové oprávnění:

> „Toto oprávnění je možné využít přesně třikrát. Po třetím použití musí definitivně zaniknout bez možnosti získání dalšího ekvivalentního credentialu.“

Použití:

```json
{
  "details": ["once_only"],
  "batch_size": 3
}
```

**takovou vlastnost nezajišťuje.**

Toto nastavení znamená tři jednorázově používané **technické instance**. Standardní reuse mechanismus je konstruován tak, aby wallet mohla credentialy znovu získávat a aby minimalizovala linkability.

Skutečný „usage counter“:

```text
remaining_uses = 3
remaining_uses = 2
remaining_uses = 1
remaining_uses = 0 → permanently consumed
```

vyžaduje dodatečný stav spravovaný aplikačním systémem, online autorizaci, specifické issuance pravidlo nebo specializovaný credential scheme. Není to základní význam `credential_reuse_policy`.

---

## Kombinace mechanismů v jednom praktickém scénáři

Jednotlivá omezení lze kombinovat.

Představme si profesní [[EAA]] lékaře, u něhož vydavatel požaduje:

* různým relying parties poskytovat různé technické instance,
* používat pool 10 credentialů,
* při zbývajících dvou instancích pool doplnit,
* obnovovat credential den před expirací,
* zpřístupňovat [[EAA]] pouze oprávněným zdravotnickým subjektům,
* technická platnost jedné instance je sedm dní,
* při odebrání licence je možné credential revokovat,
* credential je kryptograficky bound k peněžence držitele.

Reuse metadata mohou obsahovat například:

```json
{
  "credential_reuse_policy": {
    "id": "arf_annex_ii",
    "options": [
      {
        "details": ["per-relying-party"],
        "batch_size": 10,
        "reissue_trigger_unused": 2,
        "reissue_trigger_lifetime_left": 86400
      }
    ]
  }
}
```

EDP k témuž typu [[EAA]] může schematicky požadovat příslušné oprávnění relying party:

```text
required relying-party entitlement
    ↓
zdravotnický / sektorový entitlement
```

Samotný credential zároveň nese technickou platnost:

```text
valid from:  15. 9. 2026
valid until: 22. 9. 2026
```

a kryptografický binding:

```text
credential
    ↓
public key
    ↓
private key chráněný Wallet Unit
```

Výsledkem je vícevrstvý model:

```text
               ┌─ je credential ještě časově platný?
               │
               ├─ není revokovaný?
               │
EAA ───────────┼─ prezentuje jej správná peněženka?
               │
               ├─ jakou technickou instanci má wallet použít?
               │
               └─ je requesting relying party podle EDP přípustná?
```

Žádný z těchto mechanismů sám o sobě nenahrazuje ostatní.

---

## Shrnutí

Vydavatel [[EAA]] má v evropském ekosystému několik nástrojů pro řízení následného používání potvrzení. Jejich účel je ale potřeba přesně interpretovat.

**`credential_reuse_policy`** řídí především používání jednotlivých technických instancí credentialu a ochranu proti linkability. Podporuje `once_only`, `limited-time`, `rotating-batch` a `per-relying-party`.

**Embedded Disclosure Policy** umožňuje určit, kterým relying parties nebo skupinám relying parties může být [[EAA]] zpřístupněno — například konkrétním subjektům, relying parties s určitým entitlementem nebo subjektům v určité trust infrastruktuře.

**Platnost a revokace** určují, zda je credential ještě možné považovat za platný.

**Cryptographic binding** omezuje možnost credential zkopírovat a prezentovat z jiné peněženky.

**Registrace [[RP|relying party]] a intended use** poskytují informace o tom, za jakým účelem a o jaké atributy [[RP|relying party]] žádá, nejde však o totéž jako issuerem kryptograficky vynucené omezení účelu.

A konečně, klasické obchodní pravidlo typu **„lze využít maximálně Nkrát a potom oprávnění definitivně zaniká“ není totožné s `once_only` ani s `batch_size`** a vyžaduje další aplikační nebo autorizační mechanismus.

### Hlavní zdroje

[ETSI TS 119 472-3 V1.1.1 – Profiles for issuance of EAA or PID](https://www.etsi.org/deliver/etsi_ts/119400_119499/11947203/01.01.01_60/ts_11947203v010101p.pdf)

[ETSI TS 119 475 V1.2.1 – Relying party attributes supporting EUDI Wallet user's authorization decisions](https://www.etsi.org/deliver/etsi_ts/119400_119499/119475/01.02.01_60/ts_119475v010201p.pdf)

[Prováděcí nařízení (EU) 2024/2982 – aktuální konsolidované znění](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02024R2982-20260811)

[Prováděcí nařízení (EU) 2024/2979 – aktuální konsolidované znění](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02024R2979-20260811)

[Prováděcí nařízení (EU) 2026/1731 – změny technických standardů a specifikací](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32026R1731)

[Prováděcí nařízení (EU) 2025/848 – registrace relying parties](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32025R0848)

[EUDI Wallet Architecture and Reference Framework 2.8.0](https://eudi.dev/2.8.0/architecture-and-reference-framework-main/)

*Text vychází ze stavu evropského regulačního a technického rámce k září 2026.*

[1]: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02024R2982-20260811 "EUR-Lex - 02024R2982-20260811 - NL - EUR-Lex"
[2]: https://eudi.dev/1.6.0/annexes/annex-2/annex-2-high-level-requirements/ "ANNEX 2 - High-Level Requirements - EUDI Wallet"
[3]: https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ%3AL_202601731 "Commission Implementing Regulation (EU) 2026/1731 of 15 July 2026 amending Implementing Regulations (EU) 2024/2977, (EU) 2024/2979, (EU) 2024/2980 and (EU) 2024/2982 as regards applicable standards and specifications"
[4]: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02024R2979-20260811 "EUR-Lex - 02024R2979-20260811 - EN - EUR-Lex"
[5]: https://www.etsi.org/deliver/etsi_ts/119400_119499/11947203/01.01.01_60/ts_11947203v010101p.pdf "TS 119 472-3 - V1.1.1 - Electronic Signatures and Trust Infrastructures (ESI); Profiles for Electronic Attestation of Attributes; Part 3: Profiles for issuance of EAA or PID"
[6]: https://www.etsi.org/deliver/etsi_ts/119400_119499/119475/01.02.01_60/ts_119475v010201p.pdf "TS 119 475 - V1.2.1 - Electronic Signatures and Trust Infrastructures (ESI); Relying party attributes supporting EUDI Wallet user's authorization decisions"
[7]: https://eudi.dev/2.8.0/annexes/annex-2/annex-2.03-high-level-requirements-by-category/ "European Digital Identity Wallet - European Digital Identity"
[8]: https://eudi.dev/2.8.0/architecture-and-reference-framework-main/ "European Digital Identity Wallet - European Digital Identity"
[9]: https://www.rfc-editor.org/info/rfc7800/ "RFC 7800: Proof-of-Possession Key Semantics for JSON Web Tokens (JWTs) | RFC Editor"
[10]: https://eur-lex.europa.eu/legal-content/EN/TXT/?qid=1749354943224&uri=CELEX%3A32025R0848 "Implementing regulation - EU - 2025/848 - ES - EUR-Lex"
