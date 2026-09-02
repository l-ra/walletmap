---
title: "Plnění PID ve státech EU — přehled záměrů, rozdílů a technických dopadů pro onboarding"
description: "Průzkum 27 členských států EU: jak plánují vydávat PID do EUDI Wallet, jaké národní extenze a onboardingové cesty zvolily, a co z toho plyne pro integrátory a procesy KYC/onboardingu."
pubDate: 2026-09-02
updatedDate: 2026-09-02
tags: [pid, eudiw, eidas, oid4vci, oid4vp, rp, wrprc, wrpac, onboarding, eu-staty]
draft: false
---

Každý členský stát EU musí do **24. 12. 2026** nabídnout alespoň jednu certifikovanou [[EUDIW]] s [[PID]] vydávaným na úrovni jistoty **high** dle [[eIDAS]]. V praxi jde ale o **27 různých implementačních drah** — od živých národních peněženek po státy, kde je zatím vidět spíše zákon, tendr nebo uzavřený pilot.

Tento článek shrnuje veřejně dostupné informace k září 2026: u každého státu, kde se podařilo dohledat konkrétní plán, stručně popisuje **jak bude s [[PID]] nakládáno**, **jak bude plněno** (onboarding do peněženky a vydání credentialu) a **co z toho plyne pro onboarding obchodních procesů**. Následuje srovnání rozdílů mezi státy, technická kapitola pro integrátory a přehled doplňkových atestací vedle samotného [[PID]].

<details>
<summary>Metodika a omezení</summary>

Vycházíme z oficiálních zdrojů států, [ARF PID Rulebook](https://eudi.dev/latest/annexes/annex-3/annex-3.01-pid-rulebook/), prováděcího nařízení k [[PID]] (IR 2024/2977), německého architektonického konceptu (BMI/SPRIND), italské specifikace IT-Wallet, trackerů ([iGrant EUDI Wallet Status Tracker](https://eudi-wallet-tracker.igrant.io/), [eIDAS Pro](https://eidas-pro.com/blog/eudi-wallet-rollout-member-states-april-2026), [Namirial Q1 2026](https://www.namirial.com/en/blog/stories/status-check-eudi-wallet/)) a přehledu GÉANT. Stav se rychle mění — u států bez veřejné technické dokumentace uvádíme **orientační** charakteristiku.

</details>

## Společný rámec: co je PID a co stát musí zajistit

[[PID]] je státem vydávaný credential s minimální sadou atributů dle IR 2024/2977: mimo jiné `family_name`, `given_name`, `birth_date`, `birth_place`, `nationality` a (s přechodnou lhůtou) `portrait`. Metadata zahrnují povinně `expiry_date`, `issuing_authority`, `issuing_country`; volitelně např. `document_number` nebo `personal_administrative_number` — národní identifikátor, který stát může, ale nemusí do [[PID]] zahrnout.

Technicky musí být [[PID]] vydáván:

- ve formátech **[[SD-JWT-VC]]** a **mdoc** (ISO/IEC 18013-5) s typy `urn:eudi:pid:1` resp. doctype `eu.europa.ec.eudi.pid.1`;
- přes **[[OID4VCI]]** s **device binding** (`cnf` + [[KA]]);
- po ověření [[WIA]] peněženky vůči trust listu poskytovatelů peněženek;
- s možností **národních extenzí** v domácím namespace (`urn:eudi:pid:de:1`, `eu.europa.ec.eudi.pid.it.1` atd.).

Onboarding uživatele do peněženky (ne zaměňovat s KYC u [[RP]]) se od dubna 2026 řídí také [IR 2026/798](https://eur-lex.europa.eu/eli/reg_impl/2026/798/oj): umožňuje cestu **notifikované eID na LoA substantial + doplňkové vzdálené procedury** tak, aby výsledek splnil LoA high — klíčové pro státy, které nechtějí vyžadovat fyzickou identifikaci u každého občana.

```text
Občan → onboarding do peněženky (LoA high) → vydání PID (OID4VCI) → prezentace RP (OID4VP)
         ↑ IR 2026/798, národní eID              ↑ jeden PID Provider / stát   ↑ WRPRC/WRPAC
```

---

## Přehled podle připravenosti (září 2026)

| Skupina | Státy | Typický stav [[PID]] |
|---------|-------|----------------------|
| **Živá peněženka / veřejný sandbox** | Dánsko, Francie, Německo, Itálie | PID testovatelné nebo v produkci; Německo/Francie mají playground pro [[RP]] |
| **Produkční národní app + EUDI upgrade** | Rakousko, Belgie, Česko, Kypr, Řecko, Maďarsko, Lucembursko, Polsko, Portugalsko, Slovensko, Španělsko | [[PID]] vznikne transformací stávající eID / dokladové app |
| **Oznámený projekt, uzavřený pilot** | Chorvatsko, Estonsko, Irsko, Lotyšsko, Litva, Malta, Rumunsko, Slovinsko, Švédsko | LSP / tendr; externí sandbox často chybí |
| **Právní / vývojové materiály, riziko termínu** | Bulharsko, Finsko, Nizozemsko | První vydání [[PID]] může být po 12/2026 nebo s omezeným rozsahem |

---

## Stát po státu

### Rakousko (AT)

**Peněženka:** ID Austria (online eID, podpis) + **eAusweise** (mdL, registr vozidla, ověření věku). Upgrade na [[EUDIW]] potvrzen; testovací open-source peněženka **Valera** (A-SIT) pro LSP.

**Plnění [[PID]]:** Aktivace přes stávající **ID Austria** (vysoká úroveň jistoty). eAusweise již nese identitu a věk z národních zdrojů; migrace do ARF-kompatibilního [[PID]] s domácím typem `urn:eudi:pid:at:1` (předpoklad dle konvence ARF).

**Pro onboarding:** Silná základna — občané již mají mobilní eID. [[RP]] může očekávat relativně brzkou dostupnost plného [[PID]]; pozor na rozdíl mezi „eAusweise identita“ a finálním certifikovaným [[PID]].

### Belgie (BE)

**Peněženka:** **MyGov.be** (BOSA) — státní alternativa k Itsme; data z registrů, ne centrální nová databáze.

**Plnění [[PID]]:** Aktivace přes **beID** nebo **Itsme**; plánovaný mobilní eID a [[QEAA]]-kompatibilní doklady. [[PID]] bude vycházet z federálních identitních zdrojů (FAS).

**Pro onboarding:** Itsme zůstává běžný u soukromých [[RP]]; [[EUDIW]] [[PID]] bude paralelní kanál. Adresa a národní identifikátor závisí na tom, co Belgie zahrne do domácí extenze.

### Bulharsko (BG)

**Peněženka:** Návrh zákona o [[EUDIW]] (veřejné připomínky únor 2026); referenční implementace, bez veřejného sandboxu.

**Plnění [[PID]]:** Zatím nezveřejněno — očekává se minimální MVP do konce 2026 s rizikem zpoždění.

**Pro onboarding:** Nízká priorita do vydání trust listu PID Providera; plán fallback KYC.

### Chorvatsko (HR)

**Peněženka:** **Certilia** (FINA) — eID, zdravotní, studentské karty; upgrade DII na [[EUDIW]].

**Plnění [[PID]]:** Data z národní eID infrastruktury; detail domácího schématu zatím neveřejný.

### Kypr (CY)

**Peněženka:** **Digital Citizen** — biometrická občanka, řidičák, STK; alignment s řeckým gov.gr.

**Plnění [[PID]]:** Atributy z digitální občanky; cross-border pilot s Řeckem.

### Česká republika (CZ)

**Peněženka:** [[EUDIW]] přes **DIA**, realizace **koncesí** (5letý provoz od cílového spuštění 24. 12. 2026). Paralelně rozvoj eDokladů → peněženka.

**Plnění [[PID]]:** DIA jako **PID Provider** (návrh adaptačního zákona). První vlna: prokazování totožnosti a autentizace v rozsahu dnešního Portálu identit občana — **postupné** naplnění dalších dokladů a atestací. Onboarding pravděpodobně naváže na stávající prostředky (eDoklady, bankovní identita, datové schránky); IR 2026/798 otevírá cestu vzdálenému onboardingu na LoA high.

**Pro onboarding:** Po spuštění počítat s **užší počáteční sadou** atributů než u FR/DE/IT. Národní identifikátor (rodné číslo) — sledovat, zda bude v `personal_administrative_number` nebo domácí extenzi `urn:eudi:pid:cz:1`. Integrace [[RP]] dle IR 2025/848 (registrace u DIA).

### Dánsko (DK)

**Peněženka:** **AltID** — v produkci (2026); DIGST, fázovaný rollout.

**Plnění [[PID]]:** Navázání na **MitID** (adopce > 90 %). První verze: eID + ověření věku; veřejný testovací nástroj pro příjemce.

**Pro onboarding:** Jeden z nejdříve testovatelných trhů v severské oblasti.

### Estonsko (EE)

**Peněženka:** Projekt RIA; staví se na **Smart-ID** / **Mobile-ID** (velmi vysoká adopce).

**Plnění [[PID]]:** eID infrastruktura existuje; [[PID]] jako ARF obálka nad stávajícími prostředky — detaily vydávání zatím málo veřejné.

### Finsko (FI)

**Peněženka:** DVV (Digital and Population Data Services Agency); pilot peněženky skončil 30. 9. 2025; dev repozitář.

**Plnění [[PID]]:** Postupné rozšíření po certifikaci; spíše **Tier 4** riziko termínu 12/2026.

### Francie (FR)

**Peněženka:** **France Identité** (ANTS) — produkce od 2/2024; sandbox **EUDIW Unfold** / playground pro [[OID4VP]] a [[OID4VCI]].

**Plnění [[PID]]:** Dematerializace občanky (formát carte d'identité 2021); dnes **LoA high vyžaduje fyzickou identifikaci** — FR explicitně zkoumá nižší LoA pro snazší adopci. [[PID]] v mdoc pod `eu.europa.ec.eudi.pid.1` + samostatná **Age Verification** (`eu.europa.ec.av.1`) pod kořenem [[EAA]], ne v [[PID]].

**Pro onboarding:** Playground vhodný pro early integraci; produkční onboarding zatím náročný kvůli fyzickému KYC u plného [[PID]]. Pro věk použít spíše AV credential než celý [[PID]].

### Německo (DE)

**Peněženka:** Státní [[EUDIW]] — veřejný **sandbox** (SPRIND/BMDS); produkční státní peněženka plánována **2. 1. 2027**, trh soukromých peněženek od 2028. Otevřená certifikace (Samsung, Google aj.).

**Plnění [[PID]]:** **Jeden PID Provider** — backend překládá **Online-Ausweisfunktion** (eID karta, elektronický povolený pobyt, eID pro občany EU) do [[PID]]. Typ `urn:eudi:pid:de:1`. Povinné CIR atributy z eID; **adresa, portrait, sex, e-mail, telefon nejsou** v německém [[PID]] (omezení dat na kartě). Domácí extenze: `source_document_type`, `academic_title`, `birth_name`, `also_known_as`, věkové claimy.

**Privacy:** [[PID]] se vydávají **v dávkách** — každý credential jednorázový, obnova přes refresh token (max. 5 let dle PAuswG), aby se snížila linkovatelnost prezentací.

**Pro onboarding:** Referenční implementace pro integrátory — německý [PID Rulebook](https://bmi.usercontent.opencode.de/eudi-wallet/eidas-2.0-architekturkonzept/content/ecosystem-architecture/PID/german-pid-rulebook/) popisuje mapování atributů. **Nepočítejte na adresu ani rodné číslo** v německém [[PID]]; ověření věku přes `age_equal_or_over` / samostatné atestace.

### Řecko (GR)

**Peněženka:** **gov.gr Wallet** (GRNET) — občanka, řidičák, sociální certifikáty; closed pilot s 13+ doklady včetně pasu.

**Plnění [[PID]]:** Atributy z občanského průkazu (jméno, rodiče, místo narození, foto, číslo dokladu). Upgrade na ARF [[PID]].

### Maďarsko (HU)

**Peněženka:** **DÁP** (Digitális Állampolgár) — brána digitálních služeb, eID a podpisy.

**Plnění [[PID]]:** Upgrade DÁP na [[EUDIW]]; technické schema zatím neveřejné.

### Irsko (IE)

**Peněženka:** Veřejný pilot testovací peněženky (duben 2026); MyGovID infrastruktura.

**Plnění [[PID]]:** Zaměření na mDL v první vlně; plný [[PID]] v consultaci.

### Itálie (IT)

**Peněženka:** **Systém IT-Wallet** — veřejná peněženka v aplikaci **IO** + akreditované **soukromé peněženky** (jediný velký stát s touto dualitou). Dokumenty v IO od 12/2024 (řidičák, průkaz pojištěnce, průkaz ZTP).

**Plnění [[PID]]:** Onboarding přes **CIE** nebo **SPID** (> 41,5 mil. registrací SPID). [[PID]] typ `urn:eudi:pid:it:1` (přechodně `urn:it-wallet:pid:1`). Povinné: jméno, datum/místo narození, státní příslušnost, **daňový kód (`tax_id_code`)** nebo `personal_administrative_number` z ANPR. Domácí extenze **`verification`** — metoda proofingu a LoA (povinné pro IT).

**Pro onboarding:** Daňové identifikační číslo (codice fiscale) bude pro mnoho italských procesů klíčové — je v domácí namespace, ne v unijním minima. Lze aktivovat přes existující SPID → nižší tření než greenfield onboarding.

### Lotyšsko (LV)

**Peněženka:** Prototyp z LSP; plán základní verze do 12/2026, plná implementace do 2029.

### Litva (LT)

**Peněženka:** MVIA projekt; státní peněženka použitelná pro reálné služby do konce 2026 (cíl).

### Lucembursko (LU)

**Peněženka:** Vývoj na bázi **LuxTrust** / **GouvID**; partnerství INCERT–HOPAE.

**Plnění [[PID]]:** Navázání na luxemburskou důvěryhodnou infrastrukturu; detaily [[PID]] TBD.

### Malta (MT)

**Peněženka:** MDIA — tendr na implementaci; start identita + věk.

**Plnění [[PID]]:** Minimální MVP identifikace a age verification do 12/2026.

### Nizozemsko (NL)

**Peněženka:** **Public NL Wallet** (MinBZK); open-source [nl-wallet](https://github.com/MinBZK/nl-wallet); **otevřená certifikace** soukromých peněženek (TNO).

**Plnění [[PID]]:** Vláda přiznává, že **první verze nemusí splnit všechny požadavky** do 12/2026 — spíše až 2027. Pilot: vydání údajů o narození do peněženky přes **OOTS** (Once-Only) s [[QEAA]] (Cleverbase). Národní implementační zákon očekáván ke konci 2026.

**Pro onboarding:** Plánovat **nl-NL specifický harmonogram**; využít open certification, pokud certifikovaná soukromá peněženka vyjde dříve než státní.

### Polsko (PL)

**Peněženka:** **mObywatel** (> 18 mil. uživatelů) → **mObywatel 3.0** / [[EUDIW]] od listopadu 2026 (oficiální cíl).

**Plnění [[PID]]:** mDowód s **PESEL**, foto, číslo dokladu; migrace do `urn:eudi:pid:pl:1`. Cross-border v rámci POTENTIAL LSP.

**Pro onboarding:** PESEL pravděpodobně v `personal_administrative_number` nebo domácí extenzi — klíč pro polské registry a banky.

### Portugalsko (PT)

**Peněženka:** **id.gov.pt** / gov.pt app — upgrade na [[EUDIW]].

**Plnění [[PID]]:** Stávající gov.pt identita; veřejné detaily domácího schématu omezené.

### Rumunsko (RO)

**Peněženka:** **RoEUDIW** — adoptováno německé open-source řešení; fáze 1: mobilní app, [[PID]], ověření věku (2026).

**Plnění [[PID]]:** MEDAT / ADR; „substantial“ LoA v první fázi dle trackeru.

### Slovensko (SK)

**Peněženka:** **eDoklady** — harmonogram EUDIW offline verifikace Q2 2026.

**Plnění [[PID]]:** Upgrade eDokladů; účast v LSP.

### Slovinsko (SI)

**Peněženka:** Pilot MVZI; SI-PASS ekosystém.

**Plnění [[PID]]:** Oznámený projekt, málo veřejných detailů k [[PID]].

### Španělsko (ES)

**Peněženka:** **Cartera Digital** (Cl@ve, > 24 mil. uživatelů); **MiDNI** pro prezenční QR z databáze DNI (data se **nestahují lokálně** — dotaz v reálném čase).

**Plnění [[PID]]:** První verze na Launchpadu 12/2025; [[PID]] pravděpodobně nad Cl@ve/MiDNI. Roadmapa certifikace ne zcela veřejná.

**Pro onboarding:** Architektura „thin wallet“ u MiDNI — [[RP]] musí počítat s online dostupností vydavatele, ne jen offline credentialem.

### Švédsko (SE)

**Peněženka:** **Sverige-ID** (DIGG); open certification; PTS registr [[RP]].

**Plnění [[PID]]:** **Polisen** má být PID Provider pro fyzické osoby; po autentizaci LoA high lookup v registr obyvatel. Roadmap: test prostředí 12/2026, certifikovaná [[EUDIW]] až **2029**.

**Pro onboarding:** Švédsko bude **pozdě** na plnohodnotný cross-border [[PID]] — do té doby BankID/eIDAS notified means.

---

## Srovnání: kde se státy liší

### Onboarding do peněženky (aktivace)

| Přístup | Státy / příklady | Dopad pro adopci |
|---------|------------------|------------------|
| Stávající vysoké eID | DE (eID karta), IT (SPID/CIE), AT (ID Austria), DK (MitID) | Nízké tření pro digitálně zralé občany |
| Fyzická identifikace pro LoA high | FR (dnes), část CZ scénářů | Bariéra adopce; FR hledá substantial + doplněk dle IR 2026/798 |
| Postupné MVP | CZ, MT, NL, LV | Peněženka existuje, ale [[PID]]/atestace přibývají po vlnách |
| Open certification | DE, NL, SE | Více peněženek na trhu — [[RP]] musí akceptovat metadata certifikace, ne konkrétní appku |

### Obsah a extenze [[PID]]

| Téma | Rozdíl mezi státy |
|------|-------------------|
| **Národní identifikátor** | IT (`tax_id_code`), PL (PESEL), DE (**ne** — chybí `personal_administrative_number`) |
| **Adresa** | Povinná volitelná v CIR; DE neposkytuje `resident_*`; FR/IT variabilně |
| **Portrait** | CIR: povinné po 24 měsících od novely IR; DE bez portrétu v [[PID]] |
| **Domácí namespace** | Povinné pro národní atributy: `urn:eudi:pid:cc:1` / `eu.europa.ec.eudi.pid.cc.1` |
| **Proofing metadata** | IT vyžaduje claim `verification`; jinde často jen v metadatech vydavatele |
| **Privacy / linkability** | DE: dávkové jednorázové [[PID]]; jinde často delší životnost credentialu |

### Vydávání a architektura

| Téma | Příklady |
|------|----------|
| **Počet PID Providerů** | DE: právě jeden; IT: státní provider + ekosystém; SE: Polisen (osoby fyzické) |
| **Formát první vlny** | IT: přechodně jen [[SD-JWT-VC]]; jinde oba formáty |
| **Termín produkce** | DE: 1/2027 (státní); SE: certifikace 2029; většina EU: cíl 12/2026 |
| **Thin vs fat wallet** | ES MiDNI: data on-demand; většina: lokální credential |

### Co [[RP]] dostane v praxi pro onboarding

Pro **identifikaci subjektu** (KYC light) obvykle stačí: jméno, datum narození, státní příslušnost, někdy identifikátor. Pro **plné KYC/AML** často **nestačí** samotný [[PID]] — chybí adresa (DE), beneficienti, doklad o bydlišti → nutné [[PuB-EAA]] / [[QEAA]] nebo další kroky.

| Potřeba procesu | FR | DE | IT | PL | CZ (očekávání) |
|-----------------|----|----|----|----|----------------|
| Věk 18+ bez jména | AV credential | age claim / EAA | TBD | TBD | TBD |
| Daňové ID | — | — | `tax_id_code` | PESEL | RČ / domácí ext. |
| Adresa | volitelně | ne | volitelně | v mDowód | postupně |
| LoA high audit trail | standard | eID log | `verification` | standard | dle DIA |

---

## Technická část: jak získat [[PID]] a pracovat s extenzemi

### Tok vydání ([[OID4VCI]])

Standardizovaný postup (EWC RFC 003, ARF Topic 10, německý blueprint):

1. **Peněženka** ověří [[PID]] Providera — access certifikát v národním seznamu PID Provider Access CA + metadata vydavatele podepsaná tímto certifikátem.
2. **Peněženka** předá [[WIA]] (a u device-bound [[PID]] [[KA]] s `cnf` klíčem).
3. **PID Provider** ověří peněženku vůči Wallet Provider Trusted List a platnost [[WIA]].
4. **Autentizace držitele** — národně specifická (eID karta, SPID, CIE, MitID…).
5. **Credential request** s proof of possession nad nonce; vydavatel vloží `cnf` do [[PID]].
6. Odpověď [[SD-JWT-VC]] nebo mdoc; volitelně [[JWE]] šifrování odpovědi.

### Typy credentialu a dotazy ([[RP]] / [[Verifier]])

| Formát | Typ / doctype | Dotaz [[RP]] |
|--------|---------------|--------------|
| [[SD-JWT-VC]] | `vct`: `urn:eudi:pid:1` (unijní) nebo `urn:eudi:pid:de:1` (domácí) | DCQL `meta.vct_values` + `claims` |
| mdoc | doctype `eu.europa.ec.eudi.pid.1` | DCQL `meta.doctype_value`; domácí claimy cestou `["eu.europa.ec.eudi.pid.de.1", "…"]` |

[[RP]] registrace: [[WRPRC]] (intended use, požadované claimy) + [[WRPAC]] (podpis [[OID4VP]] requestu); ověření vůči [[LoTE]] a národním seznamům dle IR 2025/848.

### Co lze požadovat v jednom [[OID4VP]] kroku

[[OID4VP]] 1.0 předává požadavek peněžence jako **DCQL query** (`dcql_query`). Integrátor by měl rozlišovat tři vrstvy, které se snadno pletou:

| Vrstva | Co řeší | Klíčová pole |
|--------|---------|--------------|
| **Typ credentialu** | *Který* doklad z peněženky | `meta.vct_values` ([[SD-JWT-VC]]) nebo `meta.doctype_value` (mdoc) |
| **Atributy** | *Které claimy* z vybraného dokladu | `claims[]` s `path` |
| **Kombinace více dokladů** | *Kolik* credentialů a v jaké logice | pole `credentials[]` + volitelně `credential_sets` |

#### 1. Jeden typ — unijní nebo domácí

Nejjednodušší dotaz: jedna položka v `credentials[]` s jedním typem.

```json
{
  "credentials": [
    {
      "id": "pid",
      "format": "dc+sd-jwt",
      "meta": { "vct_values": ["urn:eudi:pid:1"] },
      "claims": [
        { "path": ["family_name"] },
        { "path": ["given_name"] },
        { "path": ["birth_date"] }
      ]
    }
  ]
}
```

**Domácí extenze** (`urn:eudi:pid:it:1`, `urn:eudi:pid:de:1` …) se liší od unijního typu `urn:eudi:pid:1` — viz další podsekce o matchování.

#### 2. Více typů v jednom kroku (AND)

Pole `credentials[]` může obsahovat **více nezávislých dotazů** — typicky [[PID]] + jiná [[EAA]] / [[PuB-EAA]] / řidičák. Každý má vlastní `id`; odpověď `vp_token` je objekt s klíči podle těchto `id`.

**Pravidlo bez `credential_sets`:** pokud `credential_sets` **neuvedete**, [[Verifier]] požaduje prezentaci **všech** credentialů z `credentials[]` — logické **AND**. Peněženka transakci nedokončí, pokud uživatel nemá (nebo nechce sdílet) kterýkoli z nich.

```json
{
  "credentials": [
    {
      "id": "pid",
      "format": "dc+sd-jwt",
      "meta": { "vct_values": ["urn:eudi:pid:1"] },
      "claims": [{ "path": ["family_name"] }, { "path": ["given_name"] }]
    },
    {
      "id": "address",
      "format": "dc+sd-jwt",
      "meta": { "vct_values": ["urn:eudi:pub-eaa:address:1"] },
      "claims": [{ "path": ["resident_city"] }]
    }
  ]
}
```

Typický onboarding: identita z [[PID]] + bydliště z [[PuB-EAA]], protože unijní minimum v [[PID]] adresu neobsahuje (a některé státy ji v [[PID]] vůbec nevydají, např. Německo).

#### 3. Alternativy a volitelné sady (`credential_sets`)

Když stačí **jedna z více možností** (OR), nebo když je druhý doklad **nepovinný**, použijte `credential_sets`. Každá sada má `options` — seznam variant; peněženka musí uspokojit **jednu** variantu ze sady.

```json
{
  "credentials": [
    { "id": "pid", "format": "dc+sd-jwt", "meta": { "vct_values": ["urn:eudi:pid:1"] }, "claims": [...] },
    { "id": "pid_reduced", "format": "dc+sd-jwt", "meta": { "vct_values": ["urn:eudi:pid:1"] }, "claims": [...] },
    { "id": "loyalty", "format": "dc+sd-jwt", "meta": { "vct_values": ["urn:example:loyalty:1"] }, "claims": [...] }
  ],
  "credential_sets": [
    {
      "options": [
        ["pid"],
        ["pid_reduced"]
      ]
    },
    {
      "required": false,
      "options": [
        ["loyalty"]
      ]
    }
  ]
}
```

První sada: stačí buď plný [[PID]], nebo redukovaná varianta (různé sady claimů). Druhá sada: věrnostní karta je volitelná (`required: false`). Uživatel obvykle vybírá variantu v UI peněženky.

#### 4. Více hodnot v `vct_values` (OR uvnitř jednoho dotazu)

`vct_values` je **pole** — credential matchne, pokud jeho typ **odpovídá nebo dědí** od **kterékoli** uvedené hodnoty (OID4VP appendix B.3.5, dědičnost dle SD-JWT VC).

```json
"meta": { "vct_values": ["urn:eudi:pid:1", "urn:eudi:pid:de:1"] }
```

Prakticky: OR typů. U [[PID]] stačí téměř vždy **jen** `urn:eudi:pid:1` — domácí typy po něm dědí (viz níže). Výjimka: přechodné národní typy mimo `urn:eudi:pid:*` (Itálie `urn:it-wallet:pid:1`) — tam musíte uvést oba, dokud trvá migrace.

#### 5. Více instancí stejného typu (`multiple: true`)

Výchozí `multiple: false` — nejvýše **jeden** credential na dotaz. S `multiple: true` může peněženka vrátit **pole** prezentací (např. více bankovních výpisů). U [[PID]] to běžné není — občan má obvykle **jeden aktivní [[PID]]** od svého státu; Německo vydává dávky jednorázových [[PID]] záměrně, ale stále jde o rotaci instancí **téhož typu**, ne o více státních identit najednou.

### Unijní `urn:eudi:pid:1` vs. domácí extenze — matchování a obsah

Toto je nejčastější otázka integrátorů: *„Když žádám jednotný [[PID]], dostanu automaticky národní?“*

**Krátká odpověď:** Ano u **výběru credentialu** (match typu), ne automaticky u **obsahu** (domácích claimů).

| Otázka | Odpověď |
|--------|---------|
| Matchne `vct_values: ["urn:eudi:pid:1"]` německý `urn:eudi:pid:de:1`? | **Ano** — domácí typ **extenduje** unijní (ARF PID_14, SD-JWT VC dědičnost / `aka_vcts`). |
| Matchne dotaz na `urn:eudi:pid:de:1` italský `urn:eudi:pid:it:1`? | **Ne** — domácí typy navzájem nedědí. |
| Dostanu v odpovědi claim `tax_id_code` / PESEL, když žádám jen `urn:eudi:pid:1`? | **Jen pokud** je v `claims[]` explicitně uveden (včetně domácí cesty u mdoc). Typ sám o sobě claimy ne „přibalí“. |
| Který [[PID]] peněženka vybere? | Obvykle **jediný [[PID]]** vydaný státem sídla občana (u něj jeden PID Provider). Cizinec v DE předloží svůj národní [[PID]], ne německý. |
| Jak vynutit konkrétní stát? | Domácí typ (`urn:eudi:pid:cz:1`), filtr `trusted_authorities`, nebo po prezentaci kontrola `issuing_country`. |

```text
Verifier žádá:  vct_values = ["urn:eudi:pid:1"]
                         │
Peněženka občana:  ┌──────┴──────┐
                  │ DE občan    │ → nabídne credential vct=urn:eudi:pid:de:1  ✓ match
                  │ IT občan    │ → nabídne credential vct=urn:eudi:pid:it:1  ✓ match
                  │ bez PID     │ → transakce selže (credential chybí)
                         │
Prezentované claimy:  pouze ty uvedené v claims[] — včetně domácích,
                      pokud jsou v claims[] cestou k domácímu namespace
```

**Pro [[SD-JWT-VC]]:** domácí atributy (např. italské `tax_id_code`, `verification`) jsou běžné claimy v credentialu s `vct: urn:eudi:pid:it:1`. [[RP]] je musí pojmenovat v `claims`:

```json
{ "path": ["tax_id_code"] }
```

**Pro mdoc:** společný doctype zůstává `eu.europa.ec.eudi.pid.1`; domácí elementy jsou v namespace `eu.europa.ec.eudi.pid.de.1` atd.:

```json
{ "path": ["eu.europa.ec.eudi.pid.it.1", "tax_id_code"] }
```

Dotaz jen na unijní elementy (`family_name` v kořenovém namespace) funguje cross-border; domácí elementy **bez explicitní cesty** se neobjeví.

#### Kdy použít který typ dotazu

| Cíl onboardingu | Doporučený dotaz |
|-----------------|------------------|
| Cross-border KYC (jméno, datum narození, stát vydavatele) | `urn:eudi:pid:1` + unijní claimy |
| Národní identifikátor (PESEL, codice fiscale, RČ…) | `urn:eudi:pid:xx:1` **nebo** `urn:eudi:pid:1` + domácí claim v `claims[]` |
| Jen občané jednoho státu | `urn:eudi:pid:cz:1` — užší match, jasnější intent ve [[WRPRC]] |
| Identita + atestace bydliště | dva záznamy v `credentials[]` ([[PID]] + [[PuB-EAA]]), ne vše v jednom [[PID]] |

#### Limity vynucené peněženkou

I správně sestavený DCQL dotaz peněženka může odmítnout:

- **Over-asking:** požadavek přesahuje rozsah ve [[WRPRC]] (registrované `vct` a claimy).
- **Chybějící claim:** uživatel credential má, ale bez požadovaného atributu (DE bez adresy v [[PID]]).
- **Uživatelský souhlas:** držitel může odškrtnout i povinné claimy v CIR — [[RP]] musí proces navrhnout s fallbackem.

<details>
<summary>Příklad: co žádat pro minimální onboarding</summary>

Pro **ověření totožnosti bez národního ID** (cross-border):

```text
credentials[0].meta.vct_values: ["urn:eudi:pid:1"]
claims: family_name, given_name, birth_date, issuing_country
```

→ Matchne domácí [[PID]] občana jakékoli země; vrátí jen uvedené unijní claimy.

Pro **český bankovní účet** (až bude domácí extenze):

```text
credentials[0].meta.vct_values: ["urn:eudi:pid:cz:1"]
   — nebo — ["urn:eudi:pid:1"] se stejným účinkem matchování
claims: family_name, given_name, birth_date,
        personal_administrative_number   // nebo domácí claim z cz namespace
```

Pro **identitu + bydliště v jednom kroku** (AND, dva credentialy):

```text
credentials[0]: vct urn:eudi:pid:1 + jméno, datum narození
credentials[1]: vct urn:eudi:pub-eaa:… + resident_city, resident_country
(credential_sets neuvedeno → oba povinné)
```

</details>

### Identifikátory v credentialu

| Claim | Význam | Poznámka |
|-------|--------|----------|
| `sub` / holder binding | Vázání na klíč peněženky | Device binding — [[PID]] nelze přenést jako soubor |
| `personal_administrative_number` | Národní unikátní ID | Volitelný v CIR; politika státu (PL, IT, …) |
| `document_number` | Číslo dokladu [[PID]] | Volitelné metadata |
| `issuing_country` | ISO 3166-1 alpha-2 | Povinné — rozhoduje o jurisdikci vydavatele |
| Domácí claimy | RČ, PESEL, codice fiscale, `verification` | V namespace `eu.europa.ec.eudi.pid.xx.1` |

### Ochrana soukromí

- **Selektivní sdílení:** [[SD-JWT-VC]] / mdoc umožňují prezentovat podmnožinu claimů; [[RP]] smí žádat jen to, co deklaruje ve [[WRPRC]] (minimalizace dle čl. 5b odst. 9 [[eIDAS]]).
- **Krátká technická platnost** vs. dlouhá administrativní platnost — vydavatel může rotovat krátkodobé credentialy (DE: batch + refresh token).
- **Oddělení věku od identity:** FR vydává **Age Verification** jako samostatný typ pod [[EAA]], ne jako claim v [[PID]] — vhodné pro age-gating bez odhalení jména.
- **Portrait:** citlivý biometrický údaj; CIR umožňuje opt-out prázdným portraitem.

### Registrace [[RP]] pro onboardingové procesy

1. Registrace u členského státu sídla (v ČR DIA).
2. Vydání [[WRPRC]] s **intended use** (např. „vzdálený onboarding retailového účtu“) a výčtem požadovaných atributů.
3. [[WRPAC]] pro technickou instanci (sandbox států: DE SPRIND, FR playground).
4. V [[OID4VP]] requestu sestavit DCQL dle sekce výše — typ (`vct_values`), claimy a případně `credential_sets` musí odpovídat registraci ve [[WRPRC]].
5. Ověřit certifikátový řetězec [[PID]] vůči trust anchor v národním seznamu PID Providerů / EU seznamu peněženek.

---

## Doplňkové atestace vedle [[PID]]

Státy **nepředpokládají**, že [[PID]] pokryje celý digitální profil občana. Typické vrstvy:

| Typ | Příklady | Státy |
|-----|----------|-------|
| Samostatné doklady v peněžence | mDL, EHIC, průkaz ZTP | IT (IO), AT (eAusweise), BE (plán EHIC 2026) |
| [[PuB-EAA]] z registrů | bydliště, rodný list, sociální údaje | NL (OOTS + obce), CZ (postupně z registrů) |
| [[QEAA]] | kvalifikované atributy (věk od QTSP) | FR (AV pod EAA kořenem), obecně banky/QTSP |
| Věk bez [[PID]] | `eu.europa.ec.av.1` | FR |
| Podpis [[QEAA]] / QES | kvalifikovaný podpis | DE (plán), PL (mObywatel), IT |

**Itálie** explicitně odděluje [[PID]] od digitálních dokladů v IO (řidičák jako samostatný credential). **Německo** plánuje QES a další doklady po identifikaci přes [[PID]]. **Francie** kombinuje [[PID]] + AV + řidičák v France Identité, ale technicky oddělené typy.

Pro onboarding to znamená: **identita ([[PID]]) ≠ prokázání bydliště ≠ prokázání příjmu ≠ AML screening**. Integrátor by měl mapovat požadované atributy na konkrétní typy credentialů a plán dostupnosti per stát.

---

## Praktické závěry pro návrh onboardingu

1. **Neplánujte jednotný EU go-live 1. 1. 2027** — prioritizujte FR/DE/DK/IT/AT/PL/BE a sledujte sandboxy.
2. **Rozlište aktivaci peněženky vs. vydání [[PID]]** — občan může mít appku bez aktuálního [[PID]] credentialu.
3. **Dotazujte `urn:eudi:pid:1` pro cross-border match** — domácí credential se vybere sám; domácí claimy ale musí být v `claims[]` explicitně.
4. **Počítejte s chybějícími atributy** — DE bez adresy, FR s fyzickým KYC, CZ/NL s postupným rozsahem.
5. **Věk a biometrie** — preferujte samostatné age credentials nebo `age_equal_or_over`, ne celý [[PID]].
6. **Testujte proti národním sandboxům** dříve než produkce — DE (SPRIND), FR (playground), DK (AltID test).
7. **AML** — [[PID]] LoA high neznamená automatické splnění due diligence (AMLR); kombinujte s [[PuB-EAA]]/[[QEAA]] dle jurisdiction.

---

## Zdroje

- [ARF Annex 3.01 — PID Rulebook](https://eudi.dev/latest/annexes/annex-3/annex-3.01-pid-rulebook/)
- [IR (EU) 2024/2977 — PID a EAA](https://eur-lex.europa.eu/eli/reg_impl/2024/2977/oj)
- [IR (EU) 2026/798 — vzdálený onboarding peněženky](https://eur-lex.europa.eu/eli/reg_impl/2026/798/oj)
- [IR (EU) 2025/848 — registrace wallet-RP](https://eur-lex.europa.eu/eli/reg_impl/2025/848/oj)
- [Německo — German PID Rulebook (draft)](https://bmi.usercontent.opencode.de/eudi-wallet/eidas-2.0-architekturkonzept/content/ecosystem-architecture/PID/german-pid-rulebook/)
- [Itálie — IT-Wallet PID Data Model](https://italia.github.io/eid-wallet-it-docs/versione-corrente/en/credential-data-model-pid.html)
- [EWC RFC 003 — Issue PID](https://github.com/EWC-consortium/eudi-wallet-rfcs/blob/main/ewc-rfc003-issue-person-identification-data.md)
- [iGrant EUDI Wallet Status Tracker](https://eudi-wallet-tracker.igrant.io/)
- [eIDAS Pro — Rollout April 2026](https://eidas-pro.com/blog/eudi-wallet-rollout-member-states-april-2026)
- [Namirial — Status-Check Q1 2026](https://www.namirial.com/en/blog/stories/status-check-eudi-wallet/)
- [Signicat — EUDI Wallets one year to launch](https://www.signicat.com/blog/eudi-wallets-only-one-year-to-launch)
- [GÉANT — National adoption overview](https://wiki.geant.org/display/G52W5/National+adoption)
- [France Identité — EUDIW Playground](https://playground.france-identite.gouv.fr/)
- [Nizozemsko — Public NL Wallet](https://www.nldigitalgovernment.nl/overview/identity/id-wallet/)
- [Povinnost akceptace EUDIW soukromým sektorem](/clanky/povinnost-akceptace-eudiw-soukromy-sektor/) — český a evropský právní rámec pro [[RP]]

---

*Poslední aktualizace: 2. září 2026. Přehled vychází z veřejných zdrojů jednotlivých států a analytických materiálů; před produkční integrací vždy ověřte aktuální národní PID Rulebook a trust listy.*
