---
title: "Národní rozšíření PID v EUDI Wallet: jak se liší identifikační údaje v EU-27"
description: "Srovnání národních datových modelů PID, identifikátorů osob, zdrojů údajů a dopadů na přeshraniční interoperabilitu a KYC. Stav k 25. listopadu 2026."
pubDate: 2026-11-25
tags: [pid, eudiw, arf, eidas, interoperabilita, oid4vci, oid4vp, onboarding, eu-staty]
draft: false
---

Bude možné při identifikaci držitele evropské peněženky vždy získat jeho národní identifikační číslo? A pokud ano, bude ve stejném atributu bez ohledu na stát vydání? Již publikované národní specifikace ukazují, že odpověď na obě otázky je záporná.

Evropská peněženka digitální identity ([[EUDIW]]) používá společný základ osobních identifikačních údajů ([[PID]]), ale členské státy mohou doplnit vlastní atributy. Rozdíly se týkají nejen identifikačních čísel, ale také titulů, údajů o rodičích, věkových hranic nebo metadat o způsobu ověření totožnosti.

Tento článek navazuje na [zářijový přehled vydávání a plnění PID v členských státech](/clanky/pid-plneni-staty-eu-prehled/) a soustředí se na konkrétní datové modely a jejich důsledky pro integrátory. Stav dokumentace je posuzován k 25. listopadu 2026.

## 1. Evropský základ a prostor pro národní rozšíření

[Prováděcí nařízení (EU) 2024/2977 v konsolidovaném znění](https://eur-lex.europa.eu/eli/reg_impl/2024/2977/2026-08-11), po změně nařízením [(EU) 2026/1731](https://eur-lex.europa.eu/legal-content/CS/TXT/?uri=CELEX%3A32026R1731), vymezuje společnou množinu údajů. [ARF, příloha 3.01 — PID Rulebook](https://eudi.dev/latest/annexes/annex-3/annex-3.01-pid-rulebook/) rozpracovává technickou reprezentaci v mdoc a [[SD-JWT-VC]].

| Kategorie | Příklady |
| --- | --- |
| Povinné údaje | Příjmení, jméno, datum narození, místo narození, státní příslušnost |
| Portrét | Povinnost od 11. srpna 2028; při výslovném opt-out se hodnota ponechá prázdná |
| Volitelné standardizované údaje | Adresa a její části, osobní administrativní číslo, jména při narození, pohlaví, e-mail a telefon |
| Národní rozšíření | Další údaje s vlastní definicí a kódováním |

Nejde o úplný seznam metadat credentialu. Identifikátory polí se navíc mezi formáty liší. Například datum narození je v mdoc `birth_date`, zatímco v [[SD-JWT-VC]] `birthdate`. Podobně se liší reprezentace místa narození, státní příslušnosti a adresy.

### Národní identifikátor není automaticky národní extenzí

Evropský model již zná volitelný atribut `personal_administrative_number`. Jeho hodnota musí být jedinečná v rozsahu čísel přidělovaných daným vydavatelem. Členský stát, který atribut zahrne, má popsat politiku jeho hodnot a případné zvláštní podmínky jejich zpracování.

Stát tedy může do společného atributu vložit existující národní číslo, může definovat vlastní národní atribut nebo může zvolit identifikační model bez předávání univerzálního osobního čísla. Standardizovaný název pole sám o sobě nezajišťuje shodnou sémantiku ani oprávnění hodnotu zpracovávat.

### Technické vyjádření národních rozšíření

| Prvek | ISO mdoc | SD-JWT VC |
| --- | --- | --- |
| Evropský základ | `docType: eu.europa.ec.eudi.pid.1` | `vct: urn:eudi:pid:1` |
| Příklad z Německa | Dodatečný namespace `eu.europa.ec.eudi.pid.de.1` | `vct: urn:eudi:pid:de:1` |
| Popis | Rulebook a definice elementů | Rulebook a metadata typu (VCT) |

V mdoc zůstává společný typ dokumentu a národní elementy jsou v domácím jmenném prostoru. U [[SD-JWT-VC]] lze národní typ vyjádřit rozšířením evropského typu prostřednictvím Type Metadata. Společné atributy si zachovávají interoperabilní význam.

Z toho neplyne automatická možnost požadovat jakýkoli národní atribut. Spoléhající se strana ([[RP]]) musí respektovat účel zpracování, registraci, oprávnění k požadovaným údajům a případná národní omezení.

## 2. Publikované národní datové modely

### Německo: elektronický doklad jako zdroj identity

[Německá příručka pro spoléhající se strany](https://bmi.usercontent.opencode.de/eudi-wallet/developer-guide/resources/pid_reference/) popisuje jednoho národně určeného vydavatele, který využívá elektronickou identifikační funkci občanského průkazu, pobytového oprávnění nebo elektronického průkazu pro občany EU. Data se vydávají v obou evropských formátech.

| Atribut v SD-JWT VC | Význam |
| --- | --- |
| `source_document_type` | Typ zdrojového dokladu |
| `birth_name` | Jméno při narození, které může zahrnovat více než jen příjmení |
| `raw_eid_birth_date` | Původní, případně neúplné datum narození z elektronického dokladu |
| `also_known_as` | Umělecké jméno nebo pseudonym |
| `academic_title` | Akademický titul |
| `age_equal_or_over` | Dosažení věkových hranic 12, 14, 16, 18, 21 a 65 let |

V mdoc jsou věkové hranice samostatnými elementy `age_over_NN` v německém namespace. V [[SD-JWT-VC]] jsou členy objektu `age_equal_or_over`.

Neúplné datum narození může obsahovat nuly místo neznámého dne či měsíce. Německá implementace odlišuje původní hodnotu od normalizovaného evropského data. Pro identity matching je to podstatné: normalizované datum nemusí vyjadřovat přesný známý den narození.

Německý profil neuvádí univerzální národní identifikační číslo osoby. Strukturované části adresy mohou být dostupné, pokud je elektronický doklad poskytne; není proto správné předpokládat, že německá adresa buď vždy chybí, nebo je vždy kompletní.

### Nizozemsko: BSN a obnova peněženky

V nizozemském projektu NL Wallet je relevantním zdrojem registr obyvatel BRP a vydávání je spojeno s RvIG (Rijksdienst voor Identiteitsgegevens).

[Dokumentace NL Wallet 0.7.2](https://minbzk.github.io/nl-wallet/v0.7.2/development/authorized-attributes.html) uvádí v národním typu `urn:eudi:pid:nl:1` mimo jiné:

| Atribut | Význam |
| --- | --- |
| `bsn` | Burgerservicenummer, nizozemské identifikační číslo |
| `recovery_code` | Kód pro obnovu |

Nizozemská implementace tedy pracuje s vlastním názvem pole pro BSN. Dokumentace je zajímavá i tím, že explicitně vymezuje autorizované cesty k atributům v registračním certifikátu [[WRPRC]]. Pro dotaz v [[OID4VP]] musí být požadovaný formát, typ a atributy pokryty odpovídající autorizací. To je konkrétní příklad, proč nestačí pouze znát jméno národního atributu.

Jde o dokumentaci konkrétní vývojové verze. Sama upozorňuje, že konfigurace reálně provozovaných prostředí se může lišit. [Poznámky k verzi 0.7.2](https://minbzk.github.io/nl-wallet/v0.7.2/release-notes/v0.7.2.html) jsou dalším zdrojem pro sledování vývoje.

### Itálie: identifikační číslo a metadata o ověření identity

[IT-Wallet Technical Specifications 1.5.0, kapitola 10.2](https://italia.github.io/eid-wallet-it-docs/releases/1.5.0/en/credential-data-model-pid.html) rozlišuje evropský [[PID]] a národní IT-Wallet ID používaný před notifikací evropské peněženky. Národní identifikační infrastruktura využívá zejména elektronický občanský průkaz CIE a SPID; konkrétní onboarding musí splnit požadovanou úroveň záruky.

Pro evropský typ `urn:eudi:pid:it:1` jsou definována dvě národní metadata:

| Atribut | Význam |
| --- | --- |
| `sub` | Identifikátor subjektu |
| `verification` | Údaje o ověření identity a použité úrovni záruky |

Ilustrační, neúplný payload (nikoli přenositelný podepsaný credential):

```json
{
  "vct": "urn:eudi:pid:it:1",
  "verification": {
    "trust_framework": "it_cie",
    "assurance_level": "https://trust-anchor.example.it/loa/high"
  }
}
```

V mdoc jsou `sub` a `verification` v namespace `eu.europa.ec.eudi.pid.it.1`.

Itálie využívá volitelný standardní atribut `personal_administrative_number`. Pro [[SD-JWT-VC]] specifikuje identifikační schéma podle ETSI EN 319 412-1: `PNO` pro IDANPR (identifikátor v registru obyvatel) a `TIN` pro Codice Fiscale. Pro mdoc specifikace popisuje národní identifikátor generovaný registrem ANPR. Integrátor musí ověřovat pravidla pro konkrétní formát, nikoli automaticky předpokládat identickou reprezentaci obou variant.

Oproti [starší specifikaci 1.4.5](https://italia.github.io/eid-wallet-it-docs/releases/1.4.5/en/credential-data-model-pid.html), která pracovala s `tax_id_code`, je patrný posun ke společnému poli. Přesto nelze `sub` bez další analýzy považovat za trvalý a univerzální identifikátor občana.

### Rumunsko: CNP místo evropského osobního administrativního čísla

[Rumunský národní Rulebook](https://github.com/Ministerul-Afacerilor-Interne/rowallet-pid/blob/master/RO_PID.md), publikovaný ministerstvem vnitra, popisuje vydávání přes DGEP s využitím registru obyvatel RNEP a elektronického občanského průkazu CEI. Vydání využívá [[OID4VCI]]; součástí procesu je ověření držitele elektronického dokladu.

| Atribut v SD-JWT VC | Význam |
| --- | --- |
| `personal_numeric_code` | Třináctimístné rumunské identifikační číslo CNP |
| `age_equal_or_over` | Dosažení hranic 14, 16, 18 a 65 let |

V mdoc se používá namespace `eu.europa.ec.eudi.pid.ro.1` a samostatné věkové elementy `age_over_14`, `age_over_16`, `age_over_18` a `age_over_65`. Typ [[SD-JWT-VC]] je `urn:eudi:pid:ro:1`.

Rulebook záměrně nepoužívá `personal_administrative_number`; CNP je samostatný národní atribut. Jeho struktura sama nese další informace o osobě, proto jeho předávání přináší riziko nadbytečného zveřejnění osobních údajů. Podmínky přístupu je třeba sledovat v aktuální verzi národního Rulebooku.

## 3. Starší pilotní návrhy: DC4EU

Projekt [DC4EU — D4.2 Onboarding Process Analysis](https://www.dc4eu.eu/wp-content/uploads/2025/08/DC4EU_D4.2_Onboarding-Process-Analysis-v.1.0.pdf) obsahuje na stranách 16–17 přehled zamýšlených národních atributů podle odpovědí účastníků pilotu. Dokument má datum odevzdání 31. prosince 2024. Jde tedy o historický snímek, nikoli o garantovaný produkční model v roce 2026.

| Stát / účastník | Doložené pilotní atributy | Význam |
| --- | --- | --- |
| Finsko / DVV | `personal_identity_code` | Národní identifikátor HETU |
| Finsko / DVV | `family_name_national_characters`, `given_name_national_characters` | Jména v národním zápisu |
| Řecko / GRNET | `afm`, `username` | Daňový identifikátor a uživatelské jméno |
| Řecko / GRNET | `fathers_name`, `mothers_name`, `personal_identity_card_id` | Jména rodičů a identifikační číslo dokladu |
| Španělsko / FNMT | `unique_id`, `age_over_18` | Identifikační číslo osoby z národního dokladu a dosažení věku |
| Švédsko / Digg | `Personal_identity_number` | Trvalý národní identifikátor |

Finsko navíc u atributů národního zápisu jmen v tomto dokumentu uvádělo, že nejsou v národním namespace. Nelze proto mechanicky převzít pilotní názvy a prohlásit je za finální domácí extenze podle dnešního modelu.

Švédsko v témže materiálu preferovalo dynamické potvrzování věku před pevnými hranicemi. V Řecku je pro budoucí datový model relevantní také nový Personal Number, jehož mapování zde není potvrzeno.

## 4. Standardizovaný atribut v Polsku a Estonsku

Polský [legislativní podklad z roku 2026](https://www.zpp.pl/storage/library/2026-05/46baf701bbc8ebfa3995a9aad361dbf7.pdf) uvádí záměr použít číslo PESEL jako hodnotu `personal_administrative_number`. To odpovídá potřebám existujících systémů veřejné správy. Jde o podklad k legislativnímu procesu, nikoli produkční schéma.

Estonská [Digital Identity Wallet Ecosystem Analysis, v1.1, kapitola 2.4.2.1.1](https://www.ria.ee/sites/default/files/documents/2026-05/Digital-identity-wallet-ecosystem-analysis.pdf) z 2. července 2025 navrhuje vkládat do stejného atributu estonské identifikační číslo (isikukood). Analýza současně zdůrazňuje potřebu autoritativních zdrojů údajů.

Oba případy ukazují, že pro podporu národního identifikačního čísla není nezbytné zavádět vlastní claim.

## 5. Česká republika: identifikátor osoby versus identifikátor vydaného credentialu

Český přístup je třeba hodnotit v kontextu základních registrů a agendových identifikátorů fyzických osob (AIFO). Ztotožnění v registru obyvatel (ROB), získání údajů prostřednictvím propojeného datového fondu (PPDF) a případná vazba evidence vydaných credentialů na AIFO jsou jiné operace než samotné uložení čísla osoby do peněženky.

Dřívější rešerše smluvních podkladů DIA identifikovala požadavky na evidenci identifikátorů vydaných [[PID]] a vazbu na AIFO, možné rodné číslo jako národní atribut, věkové atributy a onboarding prostřednictvím NIA či fyzického ověření. [Odkaz na smluvní dokumentaci](https://smlouvy.gov.cz/smlouva/soubor/41962585/Prov%C3%A1d%C4%9Bc%C3%AD%20smlouva%20%C4%8D.%206%20-znaleck%C3%A9%20%C4%8Dinnosti%20-%20ZKLM%20-%20EUDIW_final_v%C4%8D%20p%C5%99%C3%ADloh_k%20podpisu%283060266784%29_ISRS.pdf) se při přípravě tohoto článku nepodařilo znovu načíst; jde proto o neověřený popis dřívějšího návrhu, nikoli o závazné produkční schéma.

Zásadní je rozlišovat tři hodnoty:

- identifikátor osoby v autoritativním registru;
- identifikátor konkrétního vydaného credentialu;
- identifikátor, který je možné předat spoléhající se straně.

Nemusejí být stejné. Vazba na AIFO v evidenci vydavatele sama o sobě neznamená, že AIFO bude přenášeno v peněžence. Stejně tak případná podpora rodného čísla neznamená povinnost jeho vydání nebo obecné oprávnění k jeho vyžádání.

Aktuální kontext českého projektu doplňuje [článek o výběru dodavatele Valetky](/clanky/valetka-dodavatel-2026-11-24/).

## 6. Přehled všech 27 členských států

Úroveň doloženosti se vztahuje k veřejně dostupným informacím o datovém modelu, nikoli k certifikaci nebo skutečnému termínu spuštění peněženky.

- **A:** publikovaná technická specifikace nebo implementace.
- **B:** doložený pilot, analýza nebo legislativní záměr.
- **C:** konkrétní mapování atributů nebylo potvrzeno.

U skupiny C jsou existující národní čísla uvedena výhradně jako kontext, nikoli jako potvrzené atributy. Pro český případ je úroveň B předběžná vzhledem k výše uvedenému omezení zdroje.

| Stát | Relevantní infrastruktura | Identifikátor / rozšíření | Stav |
| --- | --- | --- | :---: |
| Rakousko | ID Austria, eAusweise | Sektorová čísla bPK; mapování neznámé | C |
| Belgie | MyGov.be, národní registr | National Register Number; mapování neznámé | C |
| Bulharsko | Národní eID infrastruktura | EGN; mapování neznámé | C |
| Chorvatsko | AKD, eOI, Certilia | OIB; mapování neznámé | C |
| Kypr | Digital Citizen, CY Login | Číslo osoby; mapování neznámé | C |
| Česko | DIA, NIA, ROB | Evidence credentialů, vazba na AIFO, možné RČ; návrh | B |
| Dánsko | AltID, MitID | CPR; mapování neznámé | C |
| Estonsko | RIA, národní eID | Isikukood v `personal_administrative_number` dle analýzy | B |
| Finsko | DVV, registr obyvatel | HETU a národní zápis jmen v pilotu | B |
| Francie | France Identité, ANTS | NIR; zahrnutí nepotvrzeno | C |
| Německo | Elektronické průkazy, národní vydavatel | Typ dokladu, pseudonym, titul, datum narození, věk | A |
| Řecko | GRNET, Gov.gr Wallet | AFM, jména rodičů a další pilotní atributy | B |
| Maďarsko | DÁP, IdomSoft | Národní a sektorová čísla; mapování neznámé | C |
| Irsko | MyGovID, DSP | PPSN; mapování neznámé | C |
| Itálie | IT-Wallet, CIE, SPID, ANPR | `sub`, `verification`, IDANPR / Codice Fiscale | A |
| Lotyšsko | VDAA, PMLP | Personas kods; mapování neznámé | C |
| Litva | Národní registry | Asmens kodas; mapování neznámé | C |
| Lucembursko | CTIE, GouvID | Matricule; mapování neznámé | C |
| Malta | MDIA, Identità | Identifikační číslo; mapování neznámé | C |
| Nizozemsko | RvIG, BRP, NL Wallet | `bsn`, `recovery_code` | A |
| Polsko | mObywatel, COI | PESEL v `personal_administrative_number` dle návrhu | B |
| Portugalsko | IRN, Cartão de Cidadão | NIC, NIF, NISS; mapování neznámé | C |
| Rumunsko | DGEP, RNEP, CEI | `personal_numeric_code`, věk | A |
| Slovensko | eIDENTITA, eDOKLADY | Rodné číslo; mapování neznámé | C |
| Slovinsko | SI-TRUST, SI-PASS | EMŠO, daňové číslo; mapování neznámé | C |
| Španělsko | FNMT, DNIe | `unique_id` v pilotu | B |
| Švédsko | Digg, registr obyvatel | `Personal_identity_number` v pilotu | B |

Celkem: 4 státy s konkrétním technickým modelem, 7 s alespoň dílčím návrhem nebo pilotem a 16 bez potvrzeného mapování. Jde o výsledek této rešerše, nikoli oficiální statistiku Evropské komise. Kontext národních projektů vychází také ze [zářijového přehledu WalletMap](/clanky/pid-plneni-staty-eu-prehled/) a [EU Digital Wallet Trackeru](https://www.myid.ie/business/eu-digital-wallet-tracker/).

## 7. Dopady na integrátory a identity matching

Z příkladů vyplývají nejméně čtyři architektonické strategie.

| Strategie | Příklad | Důsledek |
| --- | --- | --- |
| Národní číslo ve společném poli | Polsko, Estonsko, Itálie | Shodný název, rozdílná pravidla a sémantika hodnot |
| Národní číslo ve vlastním poli | Nizozemsko, Rumunsko | Národní claim a jeho autorizace |
| Bez univerzálního čísla osoby v credentialu | Německo | Jiný mechanismus ztotožnění |
| Identifikátor credentialu a vazba vedená vydavatelem | Český návrh | Rozlišení identity osoby a konkrétního vydání |

Pro univerzální integraci [[OID4VP]] je vhodné oddělit kryptografickou validaci od významové interpretace údajů a samotného ztotožnění osoby.

```text
Prezentace credentialu
  |
  +-- Validace podpisu, důvěry, platnosti a vazby na držitele
  |
  +-- Rozpoznání vydavatele, formátu a národního profilu
  |
  +-- Normalizace atributů podle verze Rulebooku
  |
  +-- Výběr přípustné strategie identity matching
  |
  +-- Ztotožnění / doplnění údajů / alternativní postup
```

Praktická doporučení:

- Udržovat verzované mapování podle formátu, namespace, VCT, vydavatele a sémantiky atributů. Nespoléhat na samotný název claimu.
- Při tvorbě DCQL dotazů respektovat autorizaci jednotlivých cest a typů v [[WRPRC]]. Podporu dědičnosti VCT ověřit podle použitého profilu a implementace.
- U identifikátorů rozlišovat jejich vydavatele, typ, jurisdikci, životní cyklus a pravidla zpracování. Nepoužívat automaticky `sub` ani identifikátor credentialu jako stabilní klíč osoby.
- Počítat s volitelnou či samostatně vydávanou adresou. Nedostupnost volitelného atributu sama o sobě neznamená neplatný credential.
- Pro ověření věku počítat s různými národními reprezentacemi a se samostatnými [[EAA]]. Nepožadovat datum narození, pokud postačí důkaz dosažení příslušného věku.
- V bankovním KYC oddělit ověření státem vydané identity od ztotožnění s klientskou evidencí a dalších požadavků na hloubkovou kontrolu klienta.

## Závěr

Společný evropský základ neznamená shodný národní datový model. Německo rozšiřuje údaje získávané z elektronického dokladu, Nizozemsko a Rumunsko definují vlastní pole pro národní čísla a Itálie doplňuje metadata o ověření identity. Polsko a Estonsko naopak plánují využít standardizované osobní administrativní číslo.

Pro integrátora je proto důležité pracovat s národními profily jako s verzovanými, významově odlišnými datovými kontrakty. Přeshraniční interoperabilita společných atributů je výchozím bodem, nikoli zárukou stejného způsobu jednoznačné identifikace občana ve všech státech.

<details>
<summary>Metodika a omezení rešerše</summary>

Článek se týká fyzických osob. Specifikace, vývojové implementace, historické piloty a legislativní návrhy jsou odlišné úrovně důkazů; žádná z nich sama nedokládá stav certifikovaného produkčního vydávání. U šestnácti států nebyl potvrzen konkrétní národní datový model. Zmíněná existující národní čísla nejsou tvrzením, že budou součástí credentialu. Český smluvní podklad se nepodařilo při redakci znovu otevřít. Před produkční integrací je nutné ověřit aktuální národní Rulebook, metadata vydavatele, autorizaci atributů a právní rámec.

</details>
