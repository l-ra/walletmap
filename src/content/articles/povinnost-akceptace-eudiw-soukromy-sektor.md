---
title: "Povinnost akceptace EUDIW soukromým sektorem — kdo, proč a od kdy"
description: "Analýza legislativních povinností vyplývajících z eIDAS 2.0 a české adaptační legislativy: které soukromé subjekty musí peněženku přijímat, pro jaké účely (včetně plateb a SCA) a za jakých podmínek."
pubDate: 2026-09-02
updatedDate: 2026-09-02
tags: [eidas, eudiw, legislativa, rp, pid, eaa, oid4vp, platby, sca]
draft: false
---

Evropský rámec digitální identity ([[eIDAS]] 2.0, nařízení (EU) 2024/1183) neukládá soukromým subjektům povinnost *vydávat* nebo *používat* [[EUDIW]] jako jediný prostředek identifikace. Uživatel peněženku nikdy nemusí mít ani ji použít (čl. 5a odst. 15). Naopak u vybraných soukromých [[RP|spoléhajících stran]] vzniká povinnost peněženku **akceptovat** — ale jen tehdy, když ji uživatel dobrovolně nabídne a když je splněn právní „spouštěč“ silné autentizace.

Tento článek mapuje tyto povinnosti z pohledu evropského práva, české adaptační legislativy a navazujících sektorových předpisů. Vychází z konsolidovaného znění nařízení, prováděcích předpisů k peněžence (IR 2024/2977–2982, 2025/848) a návrhu novely zákonů o elektronické identifikaci a službách vytvářejících důvěru (DIA, březen 2026).

## Tři vrstvy povinností

Právní rámec lze číst ve třech vrstvách, které se v praxi prolínají, ale nesplývají:

| Vrstva | Kdo | Co musí | Právní základ |
|--------|-----|---------|---------------|
| **Stát** | členské státy | nabídnout alespoň jednu certifikovanou [[EUDIW]] | čl. 5a odst. 1 |
| **Veřejný sektor** | orgány veřejné moci | akceptovat peněženku tam, kde vyžadují elektronickou identifikaci online | čl. 5f odst. 1 |
| **Soukromý sektor** | vybrané [[RP]] | akceptovat peněženku při silné autentizaci online | čl. 5f odst. 2 a 3 |

Pro soukromé subjekty je rozhodující **druhá a třetí vrstva**. První vrstva je relevantní jako předpoklad: bez dostupné peněženky (termín **24. 12. 2026**) nemá akceptace praktický význam.

## Jádro povinnosti: čl. 5f odst. 2 eIDAS

Text čl. 5f odst. 2 (v konsolidovaném znění nařízení (EU) č. 910/2014 po novelě 2024/1183) ukládá soukromým [[RP]], které **poskytují služby** a nejsou mikro- ani malým podnikem dle doporučení Komise 2003/361/EC, následující:

> Pokud jsou povinny unijním nebo vnitrostátním právem používat **silnou autentizaci uživatele** pro online identifikaci, nebo pokud je silná autentizace vyžadována **smluvní povinností** — mimo jiné v oblastech dopravy, energetiky, bankovnictví, finančních služeb, sociálního zabezpečení, zdravotnictví, pitné vody, poštovních služeb, digitální infrastruktury, vzdělávání nebo telekomunikací — musí **nejpozději 36 měsíců** od účinnosti prováděcích předpisů k peněžence a **jen na dobrovolnou žádost uživatele** rovněž akceptovat evropské peněženky digitální identity poskytované v souladu s tímto nařízením.

Z toho plyne několik klíčových interpretačních bodů:

### 1. Spouštěč není odvětví, ale silná autentizace

Výčet sektorů (doprava, energie, bankovnictví …) je **ilustrativní** — úvodní formulace „mimo jiné v oblastech“ (*including in the areas of*) to potvrzuje. Povinnost vzniká tam, kde **již dnes** platí požadavek silné autentizace uživatele pro online identifikaci podle unijního nebo národního práva, případně smlouvy.

Obráceně: být v bankovnictví samo o sobě nestačí, pokud konkrétní proces silnou autentizaci nevyžaduje. A naopak subjekt mimo výčet se může do povinnosti dostat, pokud mu jiný předpis silnou autentizaci ukládá.

V eIDAS se používá termín *strong user authentication* (SUA); v platebním právu je ekvivalentem silné ověření klienta (SCA) dle PSD2.

### 2. Dobrovolnost ze strany uživatele

[[RP]] musí peněženku přijmout **jen tehdy, když o to uživatel požádá**. Služba musí zůstat dostupná i jinými prostředky (čl. 5a odst. 15). Peněženka je další kanál, ne náhrada všech metod přihlášení nebo identifikace.

### 3. Výjimka mikro- a malých podniků

Mikropodniky a malé podniky (definice dle doporučení 2003/361/EC) z povinnosti v čl. 5f odst. 2 **vyloučeny jsou**. Střední a velké podniky v dotčených procesech povinnost nesou.

### 4. Termín: 24. prosince 2027

Lhůta 36 měsíců běží od účinnosti prováděcích předpisů k peněžence podle čl. 5a odst. 23 a 5c odst. 6 — tj. od **24. 12. 2024** (IR 2024/2977–2982). Povinnost akceptace tedy nastává **24. 12. 2027**.

### 5. Rozsah akceptace

Povinnost se vztahuje na **online identifikaci** s využitím silné autentizace. Typicky jde o:

- přihlášení do klientské zóny (internetové bankovnictví, samoobslužný portál operátora),
- silně autentizovaný přístup k účtu nebo smlouvě,
- online prokázání totožnosti v procesu, kde právo vyžaduje silnou autentizaci.

Neznamená to automaticky, že každý proces KYC nebo ověření atributu musí peněženkou probíhat — záleží na tom, zda konkrétní krok spadá pod požadavek silné autentizace pro *identifikaci* a zda uživatel peněženku nabídne.

## Velmi velké online platformy: čl. 5f odst. 3

Samostatnou kategorií jsou **velmi velké online platformy** (VLOP) dle nařízení o digitálních službách (DSA). Uživatelům, kteří o to požádají, musí umožnit autentizaci prostřednictvím [[EUDIW]] — opět v rozsahu nezbytných údajů a se stejnou lhůtou **24. 12. 2027**.

Tato povinnost se váže na autentizaci uživatelů platformy, nikoli na libovolné ověřování atributů třetích stran.

## Pro jaké účely peněženku akceptovat

V praxi se povinnost akceptace projevuje ve třech typech situací:

### A. Elektronická identifikace a přihlášení (SUA/SCA)

[[RP]] přijme z peněženky [[PID]] nebo jiný identifikační credential a použije ho místo stávajícího prostředku silné autentizace (např. mobilní aplikace banky, hardware token, kombinace hesla a OTP).

Typický právní zdroj silné autentizace v ČR:

| Oblast | Příklad povinnosti | Český / unijní předpis |
|--------|-------------------|------------------------|
| Bankovnictví a platby | přihlášení do internetového bankovnictví, autorizace plateb | zákon č. 370/2017 Sb. o platebním styku, nařízení (EU) 2018/389 (RTS k PSD2) |
| Elektronické komunikace | silná autentizace u vybraných služeb | zákon o elektronických komunikacích, prováděcí akty EU |
| Zdravotnictví | přístup k elektronickým zdravotním záznamům pacienta | zákon o elektronizaci zdravotnictví, národní portály |
| Energetika / doprava | klientské portály s regulovaným přístupem | sektorové licence a provozní pravidla |

### B. Online prokázání skutečností (atestace atributů)

Kromě samotné identifikace může [[RP]] požadovat [[EAA]] — např. věk, způsobilost, členství, oprávnění. Čl. 5f odst. 2 se primárně vztahuje na identifikaci se silnou autentizací; ověření atributů online však často navazuje na tentýž proces (onboarding, změna smlouvy).

Návrh české adaptační novely (důvodová zpráva DIA, březen 2026) výslovně uvádí, že soukromoprávní subjekty, jimž právní předpis ukládá povinnost vyžadovat prokázání určitých skutečností, budou mít povinnost je **přijímat při online prokazování** — v rozsahu odpovídajícím schématům [[QEAA]], [[PuB-EAA]] a dalších [[EAA]] zveřejněných Agenturou.

### C. Prezenční prokázání totožnosti

U fyzické přítomnosti platí **jiný právní režim** než u online scénářů — evropské čl. 5f se vztahuje jen na online služby, zatímco prezenční povinnosti v ČR zakotvuje národní adaptační zákon. Podrobné shrnutí viz kapitola [Prezenční použití EUDIW](#prezenční-použití-eudiw--shrnutí-povinností).

## Peněženka a platby — co je možné a co povinné

V platebním kontextu se [[EUDIW]] často zaměňuje s „platební peněženkou“ typu Apple Pay nebo Wero. Právně i technicky jde ale o **dvě odlišné role**, které se mohou kombinovat:

| Role | Co peněženka dělá | Příklad |
|------|-------------------|---------|
| **Autentizátor (SCA)** | potvrzuje, že platbu schválil držitel účtu/karty | autorizace převodu, platba kartou online |
| **Identifikátor** | prokazuje totožnost před nebo během platebního procesu | onboarding účtu, ověření věku u tabáku |
| **Kontejner platebního nástroje** | nese credential vázaný na účet nebo kartu | SCA atestace vydaná bankou do peněženky |

Samotná [[EUDIW]] podle [[eIDAS]] **není platební systém** — nevede účet, neclearinguje transakce, nevydává peníze. Pro platby slouží především jako **důvěryhodný kanál silného ověření klienta** (SCA) a jako úložiště **SCA atestací** vydaných platební institucí.

### Právní rámec plateb

| Předpis | Vztah k peněžence | Stav (září 2026) |
|---------|-------------------|------------------|
| **[[eIDAS]] 2.0, čl. 5f odst. 2** | banky a další [[RP]] s povinností SUA/SCA musí peněženku akceptovat na žádost uživatele | účinné; akceptace od 24. 12. 2027 |
| **PSD2 / zákon o platebním styku** | SCA u elektronických plateb, přístupu k účtu online a rizikových akcí (čl. 97 PSD2, § 223 zákona č. 370/2017 Sb.) | platné; trigger pro čl. 5f |
| **PSD3 / PSR** (návrh) | konsolidace pravidel SCA; EBA má vypracovat nové RTS s ohledem na peněženku (čl. 89 PSR) | politická dohoda listopad 2025, finalizace 2026 |
| **AMLR** (EU 2024/1624) | identifikace zákazníka při zřizování vztahu; eIDAS-kompatibilní postupy | účinnost 10. 7. 2027 |
| **Digitální euro** (rulebook) | účastníci schématu mají umožnit autentizaci peněženkou, pokud to platební nástroj podporuje | pilot 2026–2027, pravidla ve vývoji |

Klíčové rozlišení: **povinnost akceptovat peněženku pro SCA** plyne z [[eIDAS]] (čl. 5f), nikoli přímo z AMLR. Obchodník, který jen přijímá kartu u terminálu a nemá povinnost silné autentizace ve smyslu eIDAS pro online identifikaci, **není** automaticky povinen přijímat [[EUDIW]] jako platební metodu — ale může ji využít nepřímo, pokud ji podporuje jeho acquirer nebo platební brána.

### Technická specifikace: TS12 (SCA s peněženkou)

Evropská komise publikovala technickou specifikaci **TS12** (*Specification of Strong Customer Authentication Implementation with the Wallet*, verze 1.0, prosinec 2025). Definuje minimální požadavky pro SCA pomocí [[EUDIW]] nad rámec obecného [[OID4VP]]:

**Životní cyklus ve třech krocích:**

```text
1. Registrace (mimo TS12)
   Banka vydá do peněženky SCA atestaci ([[EAA]]) vázanou na uživatele,
   účet (IBAN) nebo kartu (PAN last four) — přes [[OID4VCI]]

2. Autentizace transakce
   [[RP]] / obchodník pošle [[OID4VP]] presentation request
   s transaction_data (částka, příjemce, ID transakce)

3. Dynamic linking
   Peněženka zobrazí údaje transakce; uživatel potvrdí na [[WSCD]];
   odpověď obsahuje KB-JWT s hash transaction_data (SCA + dynamic linking dle PSD2)
```

**Dva provozní režimy:**

| Režim | Kdo iniciuje [[OID4VP]] | Typická situace |
|-------|-------------------------|-----------------|
| **Issuer-requested flow** | banka (ASPSP) nebo její zprostředkovatel | převod v mobilním bankovnictví, redirect z e-shopu na banku |
| **Third-party-requested flow** | třetí strana (obchodník, PISP, AISP) | embedded SCA v open bankingu, checkout s přesměrováním na peněženku |

V third-party režimu musí po autentizaci proběhnout ještě komunikace mezi třetí stranou a bankou přes platební nebo open banking síť — TS12 řeší jen autentizační vrstvu, ne settlement.

**Typy SCA atestací** (příklady z TS12):

- atestace **uživatele** (`payment_service_user`) — obecná identita plátce,
- atestace **účtu** (`payment_account` + IBAN/BIC) — vázaná na konkrétní platební účet,
- atestace **karty** — vázaná na platební kartu (poslední čtyři číslice, schéma).

Každý typ má metadata `transaction_data_types`, která určují, jaké transakční údaje smí být v presentation requestu (ochrana před zneužitím atestace k jinému účelu).

**Standardizované typy transakčních dat** (URN schémata):

| URN | Účel |
|-----|------|
| `urn:eudi:sca:payment:1` | potvrzení platby (částka, měna, příjemce, reference) |
| `urn:eudi:sca:account_access:1` | souhlas s přístupem k účtu (open banking / AISP) |
| `urn:eudi:sca:login_risk_transaction:1` | přihlášení nebo riziková akce bez platby |
| `urn:eudi:sca:emandate:1` | elektronický mandát pro opakované platby (MIT) |

Formát credentialu je [[SD-JWT-VC]]; prezentace probíhá přes [[OID4VP]] s `transaction_data` v authorization requestu. Device binding (`cnf` + [[KA]]) zajišťuje faktor *držení*; biometrie nebo PIN na [[WSCD]] faktor *inherence* nebo *znalost*.

Podrobněji o dynamic linking a KB-JWT viz [článek o atestacích](/clanky/nastaveni-atestaci-eudiw/) (sekce o autorizaci platby).

### Mapa platebních use cases

#### 1. Autorizace odchozí platby z účtu

**Aktéři:** plátce, banka (ASPSP), případně PISP nebo obchodník.

**Průběh:** Uživatel v internetovém bankovnictví nebo na platební bráně zvolí potvrzení přes [[EUDIW]]. Banka jako vydavatel SCA atestace pošle [[OID4VP]] request s `urn:eudi:sca:payment:1`. Peněženka zobrazí částku a příjemce; po souhlasu banka transakci provede.

**Povinnost:** Banka (střední/velký podnik) musí tuto cestu **umožnit** od 24. 12. 2027, pokud uživatel požádá — ne že by musela peněženku preferovat před vlastní aplikací.

#### 2. Platba kartou online (card-not-present)

**Aktéři:** držitel karty, vydavatel karty (banka), acquirer, obchodník.

**Průběh:** SCA atestace reprezentuje kartu (ne celé PAN). [[OID4VP]] request nese platební transaction data; dynamic linking váže souhlas na konkrétní obchodníka a částku — analogicky k 3-D Secure, ale s evropsky interoperabilní peněženkou.

**Povinnost:** Primárně na **vydavateli karty** (banka). Obchodník obvykle integruje existující bránu; podpora peněženky závisí na acquirerovi a schématu karet.

#### 3. Open banking — iniciace platby (PISP)

**Aktéři:** plátce, PISP, banka plátce.

**Průběh:** Uživatel v aplikaci třetí strany (např. agregátor, fintech) iniciuje platbu. PISP požádá o SCA — buď embedded flow, nebo redirect na peněženku (third-party-requested). Po úspěšné autentizaci PISP dokončí platební příkaz vůči bance přes PSD2 rozhraní.

**Povinnost:** Banka musí akceptovat peněženku pro SCA; PISP musí technicky podporovat TS12/OID4VP, pokud tuto cestu nabízí.

#### 4. Open banking — přístup k informacím o účtu (AISP)

**Aktéři:** uživatel, AISP, banka.

**Průběh:** Souhlas s přístupem k výpisu účtů se autorizuje SCA atestací s `urn:eudi:sca:account_access:1`. Nejde o platbu, ale o **regulovanou SCA akci** — spadá pod stejný právní trigger jako platby (přístup k platebnímu účtu online).

#### 5. Přihlášení do bankovnictví před platbou

Samotné přihlášení do internetového bankovnictví je SCA relevantní akce (§ 223 odst. 1 zákona o platebním styku). Peněženka může nahradit bankovní mobilní klíč — typ transaction data: `urn:eudi:sca:login_risk_transaction:1`.

Toto je **nejbližší** use case k čl. 5f odst. 2 a zároveň vstupní brána k dalším platebním operacím v téže session.

#### 6. E-commerce a „fast checkout“

**Scénář A — redirect na banku:** Obchodník přesměruje na ASPSP; banka autentizuje peněženkou (issuer-requested). Obchodník nemusí být registrovaná [[RP]] vůči peněžence — autentizaci provede banka.

**Scénář B — peněženka u obchodníka:** Obchodník nebo platební brána přímo volá [[OID4VP]] (third-party-requested). Vyžaduje registraci [[RP]], [[WRPRC]]/[[WRPAC]] a integraci s TS12. Vhodné pro větší e-commerce a PSP, ne pro každý mikro-eshop.

**Scénář C — atributy bez platby:** Obchodník požádá jen o věk nebo doručovací údaje z [[PID]]/[[PuB-EAA]] — to není platební SCA, ale ověření atributu (např. věk 18+ u omezeného zboží).

#### 7. Opakované platby a mandáty

`urn:eudi:sca:emandate:1` slouží k elektronickému mandátu pro opakované inkasa (merchant-initiated transactions). Uživatel jednou silně autentizuje souhlas s budoucími strženími v definovaném rozsahu — podobná logika jako dnes u SEPA mandátů s počátečním SCA.

#### 8. Digitální euro

Podle rulebooku schématu digitálního eura (v0.91, duben 2026) mají účastníci zajistit, aby koncoví uživatelé mohli k autentizaci použít [[EUDIW]], **pokud to platební nástroj podporuje** (FUR.06). V pilotu ECB mohou PSP volit metodu autentizace, ale peněženka je explicitně přípustná cesta pro online transakce digitálního eura.

Digitální euro a [[EUDIW]] zůstávají **oddělené produkty** propojené autentizační vrstvou — euro účet není automaticky součástí státní peněženky identity.

#### 9. Wero a komerční platební peněženky

**Wero** (European Payments Initiative) je **samostatná platební peněženka** pro account-to-account platby v EU. Může integrovat ověření identity (e-ID), ale není to totéž co státem certifikovaná [[EUDIW]] dle [[eIDAS]]. V praxi mohou občané používat obě aplikace paralelně:

- **[[EUDIW]]** — identita, SCA atestace od banky, [[PID]], úřední atestace,
- **Wero** — P2P a (postupně) e-commerce platby mezi účty.

Banky vydávající SCA atestace do [[EUDIW]] tím nejsou automaticky vázány na Wero a naopak.

### Kdo v platebním řetězci co musí udělat

| Subjekt | Povinnost k [[EUDIW]] | Technická akce |
|---------|----------------------|----------------|
| **Banka / ASPSP** | ano (SCA, od 24. 12. 2027) | vydat SCA atestace přes [[OID4VCI]]; přijmout prezentaci pro SCA |
| **PISP / AISP** | nepřímo (musí umět SCA flow) | third-party [[OID4VP]] + napojení na banku |
| **Vydavatel karty** | ano | SCA atestace karty, 3DS ekvivalent přes peněženku |
| **Acquirer / brána** | doporučená připravenost | podpora TS12 v terminálové integraci |
| **Obchodník (malý)** | typicky ne (výjimka mikro/malý podnik z 5f) | volitelně přes bránu nebo redirect na banku |
| **Obchodník (střední/velký)** | jen pokud sám vyžaduje SUA pro online identifikaci | registrace [[RP]] při přímé integraci |

### Co peněženka u plateb neřeší

- **Převod peněz** — probíhá v platebním systému (SEPA, karetní schéma, digitální euro), ne v [[OID4VP]].
- **Ověření příjemce (VoP)** — nová povinnost ve směru PSD3/PSR (verification of payee) je samostatná kontrola shody jména a IBAN; peněženka ji může podpořit zobrazením údajů, ale nenahrazuje bankovní ověřovací službu.
- **AML kontrola obchodníka** — SCA atestace neprokazuje legální původ prostředků.
- **Chargeback a odpovědnost** — platební pravidla vydavatele a schématu zůstávají v platnosti.

<details>
<summary>Shrnutí: platba vs. autentizace platby</summary>

```text
Uživatel chce zaplatit 1 500 Kč e-shopu
        │
        ├─► Platební síť (SEPA/karta/digitální euro)
        │     přesune prostředky — mimo EUDIW
        │
        └─► SCA vrstva (EUDIW + TS12)
              peněženka potvrdí: „tento uživatel schválil
              právě tuto částku tomuto příjemci“
```

Bez funkční SCA vrstvy banka platbu s rizikem podvodu neprovede. [[EUDIW]] je jedna z povolených implementací této vrstvy — nikoli samotná „platební aplikace“.

</details>

## Prezenční použití EUDIW — shrnutí povinností

Prezenční (proximity) scénář je situace, kdy uživatel fyzicky stojí před [[RP|ověřovatelem]] — na přepážce, u vstupu, u samoobslužného kiosku — a prokáže totožnost nebo atribut z peněženky přes NFC, Bluetooth nebo QR kód (ISO/IEC 18013-5, případně hybridní „remote flow“ dle ARF 4.4.2).

### Zda vůbec existuje povinnost

| Úroveň | Prezenční povinnost akceptace? | Proč |
|--------|-------------------------------|------|
| **EU — čl. 5f** | **Ne** (u soukromého sektoru) | Všechny odstavce 5f se vztahují k **online** službám, online identifikaci nebo autentizaci uživatelů platformy |
| **EU — technicky** | Podpora ano, povinnost ne | IR 2024/2982 a ARF předepisují proximity protokoly pro certifikované peněženky, ale neukládají soukromým subjektům povinnost je přijímat na místě |
| **ČR — návrh zákona** | **Ano**, u vybraných subjektů | § 18b zákona o elektronické identifikaci — národní doplněk k přímo použitelnému [[eIDAS]] |

**Závěr:** Povinnost akceptovat peněženku **prezenčně** neplyne přímo z evropského nařízení pro soukromý sektor. V České republice ji má zavést **adaptační zákon** (návrh DIA, březen 2026), a to **paralelně** s postupným ukončením povinnosti k eDokladům.

### Z jakých předpisů povinnost v ČR vychází

| Předpis | Ustanovení | Co ukládá |
|---------|------------|-----------|
| Nařízení (EU) 2024/1183 | čl. 5f odst. 1–3 | jen **online** akceptace (veřejný sektor, soukromý sektor se SUA, VLOP) |
| Návrh novely zákona č. 250/2017 Sb. (eID) | **§ 18b** | tomu, kdo musí při **fyzické přítomnosti** přijímat průkaz totožnosti (veřejná listina), umožnit prokázání i peněženkou |
| Návrh novely zákona č. 297/2016 Sb. (SVS) | **§ 12**, **§ 12a** | online (§ 12) a prezenční (§ 12a) přijímání [[PuB-EAA]] u orgánů veřejné moci; § 12a zahrnuje i kiosky („proximity unsupervised flow“) |
| Přechodná ustanovení návrhu | čl. II bod 2 | prezenční povinnost **ve vlnách** od **1. 1. 2028**, analogicky k eDokladům |
| Zákon č. 12/2020 Sb. + zákon č. 1/2024 Sb. | přechodná ustanovení k eDokladům | **vzor okruhu** subjektů a vln; po náběhu peněženky má povinnost k eDokladům zaniknout (plánovaná novela zákona o právu na digitální služby) |
| Návrh — § 19 písm. l) | povinnost DIA | centrální **ověřovací aplikace** pro prezenční ověření od **1. 7. 2027** |
| Návrh — § 25 odst. 2 | přestupek | soukromý subjekt jako [[RP]], který neumožní prokázání totožnosti peněženkou za podmínek čl. 5f (včetně národní implementace) |

### Kdo musí akceptovat peněženku prezenčně (ČR)

Spouštěč je stejný jako u eDokladů: subjekt, jemuž **právní předpis nebo výkon působnosti** ukládá, aby za fyzické přítomnosti přijímal **průkaz totožnosti** (nebo jiný doklad veřejné listiny). Okruh je podle důvodové zprávy **shodný** s povinností k digitálním stejnopisům průkazů dle zákona o právu na digitální služby.

Typické kategorie (ilustrativně, dle harmonogramu eDokladů):

| Kategorie | Příklad situace |
|-----------|-----------------|
| Orgány veřejné moci | úřad, policie, soud, volební komise |
| Územní samospráva | obec, kraj — přepážkové služby |
| Finanční sektor | banka při identifikaci klienta na pobočce |
| Zdravotnictví | zdravotní pojišťovna, registrace u poskytovatele |
| Vzdělávání | škola, vysoká škola — ověření totožnosti žáka/studenta |
| Pošta a vybrané soukromé subjekty | pošta, notář, exekutor, státní podnik, příspěvková organizace |

Subjekt, který **nemá** povinnost přijímat fyzický průkaz totožnosti (typický maloobchod, restaurace bez zákonné povinnosti kontroly dokladu), **nemá** ani povinnost akceptovat peněženku prezenčně — může tak učinit dobrovolně přes aplikaci DIA v omezeném režimu (stejný rozsah jako u eDokladů).

U **orgánů veřejné moci** navíc platí § 12a pro prezenční přijímání [[PuB-EAA]] (atestace z registrů), včetně samoobslužných kiosků bez přítomnosti úředníka.

### Podmínky pro uživatele i ověřovatele

Stejně jako u online režimu:

- uživatel peněženku **nemusí** mít ani ji použít — fyzický průkaz zůstává platnou alternativou;
- [[RP]] smí požadovat jen údaje v rozsahu deklarovaného intended use a registrace;
- prezenčně se [[RP]] prokazuje vůči peněžence přes [[WRPAC]]/[[WRPRC]] (registrace dle čl. 5b a IR 2025/848).

Technicky DIA nabídne **upravenou ověřovací aplikaci** (evoluce eDokladů) — webovou s periferií (mobil s NFC/BT jako čtečka) nebo mobilní aplikaci. Subjekty mohou použít i **vlastní aplikaci**, pokud splní požadavky.

### Časová osa prezenčních povinností (návrh zákona)

```text
1. 7. 2027 ──► DIA spustí centrální ověřovací aplikaci (prezenční režim)
1. 1. 2028 ──► začátek vln povinné prezenční akceptace (jako u eDokladů)
     …       ──► postupné rozšiřování na další kategorie subjektů
(poslední vlna) ──► ukončení povinnosti k eDokladům (+ 2leté překlenutí u soukromého práva)
```

| Datum | Událost |
|-------|---------|
| **24. 12. 2027** | online akceptace dle čl. 5f odst. 2 (EU, soukromý sektor) + § 12 online atributy (CZ návrh) |
| **1. 7. 2027** | centrální prezenční aplikace DIA (návrh § 19) |
| **1. 1. 2028** | start vln prezenční povinnosti (přechodná ustanovení návrhu) |
| **po poslední vlně** | zánik povinnosti k eDokladům; peněženka jako jediný digitální kanál na místě |

Přesné datum poslední vlny návrh v době psaní **neuvádí** — má být stejné schéma jako u eDokladů (postupný náběh od ústřední správy přes kraje a policii až po obce, banky, školy a poštu).

### EU vs. ČR — praktické důsledky

1. **Integrace online ≠ integrace na přepážce** — proximity vyžaduje NFC/BLE nebo QR, jiné testy a často jiný hardware; ARF to bere jako samostatný kanál.
2. **Prezenční povinnost je v ČR širší než čl. 5f** — zasáhne subjekty s povinností kontrolovat doklad na místě (banky, školy, pojišťovny), i když nemají online SUA.
3. **Mikropodniky** — výjimka z čl. 5f odst. 2 se týká **online**; prezenční povinnost v § 18b navazuje na **jiný** právní trigger (povinnost přijímat průkaz), nikoli na velikost podniku.
4. **Přeshraniční kontext** — [[PID]] v peněžence umožní prokázání totožnosti cizince u českého subjektu prezenčně; to je smysl evropské interoperability, i když samotnou prezenční povinnost stanovuje český zákon.

<details>
<summary>Co prezenční akceptace neznamená</summary>

- **Náhrada fyzického průkazu** — uživatel může dál ukázat občanku nebo řidičák.
- **Povinnost mít chytrý telefon** — digitální cesta je volitelná.
- **Jednotná EU lhůta** — prezenční vlny jsou **národní**; jiné státy mohou zvolit jiný harmonogram.
- **Automatické ověření všech atributů** — prezenčně lze předložit jen to, co [[RP]] oprávněně požaduje a co peněženka obsahuje.

</details>

## Kdo konkrétně spadá do povinnosti

Níže je praktická mapa podle typu subjektu. U každého platí: musí jít o subjekt **mimo kategorii mikro-/malého podniku**, musí existovat **požadavek silné autentizace** pro daný online proces a uživatel musí peněženku **dobrovolně zvolit**.

### Finanční sektor

**Banky, platební instituce, instituce elektronických peněz, poskytovatelé investičních služeb** — nejčastější a nejurgentnější skupina. Silné ověření klienta je vázáno na zákon o platebním styku a přímo použitelné RTS; přihlášení do elektronického bankovnictví je typickým use casem. U plateb navíc vystupují jako **vydavatelé SCA atestací** do peněženky a jako strana provádějící SCA při autorizaci transakcí — viz sekce [Peněženka a platby](#peněženka-a-platby--co-je-možné-a-co-povinné).

Povinnost akceptace **neznamená**, že peněženka nahrazuje celý AML proces identifikace zákazníka. Nařízení o AML (EU) 2024/1624 platí od **10. 7. 2027** a upřednostňuje postupy kompatibilní s [[eIDAS]], ale rozsah údajů pro due diligence musí odpovídat čl. 22 AMLR — samotná prezentace [[PID]] nemusí stačit bez dalších údajů (adresa, beneficienti apod.).

### Telekomunikace

Operátoři a poskytovatelé elektronických komunikací s online samoobsluhou a silně autentizovaným přístupem k účtu (správa tarifu, změna smlouvy, portál pro firemní zákazníky).

### Energetika, pitná voda, poštovní služby

Dodavatelé energií, plynu, tepla, vody a provozovatelé poštovních služeb s regulovaným online přístupem zákazníků — tam, kde právo nebo licence vyžadují silnou autentizaci identifikace uživatele portálu.

### Doprava

Dopravci a provozovatelé infrastruktury (letecké společnosti, železniční a autobusový dopravci, provozovatelé platebních systémů v dopravě) u online identifikace cestujícího nebo držitele průkazu — zejména tam, kde se překrývá s požadavky na silnou autentizaci (rezervační systémy s účtem, věrnostní programy s regulovaným přístupem).

Evropský digitální cestovní doklad (Digital Travel Credential) je samostatná linka; akceptace v peněžence se řídí technickými specifikacemi a národní implementací, nikoli přímo čl. 5f jako náhrada pasové kontroly.

### Zdravotnictví

Poskytovatelé zdravotních služeb, zdravotní pojišťovny a provozovatelé pacientských portálů — u online přístupu vyžadujícího silnou autentizaci (např. přístup k elektronické zdravotní dokumentaci).

### Vzdělávání

Vysoké školy, vzdělávací instituce a platformy s regulovaným přístupem studentů, kde právo vyžaduje silnou autentizaci online identity (studijní portály, státní maturity a centrální registry — dle konkrétní úpravy).

### Sociální zabezpečení

Soukromí poskytovatelé služeb v ekosystému sociálního zabezpečení (outsourcované klientské systémy, penzijní fondy s regulovaným online přístupem) — pokud na ně dopadá požadavek silné autentizace.

### Digitální infrastruktura

Poskytovatelé cloudových, hostingových a kritických digitálních služeb s regulovaným přístupem zákazníků vyžadujícím silnou autentizaci — typicky větší subjekty mimo kategorii malého podniku.

### Kdo obvykle **není** v čl. 5f odst. 2

| Subjekt | Proč typicky mimo povinnost |
|---------|----------------------------|
| Mikro- a malé podniky | explicitní výjimka v čl. 5f odst. 2 |
| Notáři, daňoví poradci, realitní zprostředkovatelé (AML povinné osoby) | často **nemají** povinnost silné autentizace ve smyslu eIDAS pro online identifikaci — AML je samostatný rámec |
| Běžný e-shop bez regulovaného přihlášení | chybí právní trigger silné autentizace |
| Subjekt, který identitu ověřuje jen prezenčně bez online požadavku | spadá spíše pod českou úpravu prezenčního prokazování (§ 18b návrhu zákona), ne přímo pod 5f(2) |

## Registrace a technické podmínky akceptace

Povinnost akceptovat není jen organizační — vyžaduje technickou připravenost:

1. **Registrace [[RP]]** u členského státu sídla (čl. 5b, IR (EU) 2025/848). V ČR bude registrátorem Digitální a informační agentura (DIA); zápis do seznamu stran spoléhajících se na peněženku.
2. **[[WRPRC]]** — registrační certifikát s deklarovaným intended use a požadovanými atributy.
3. **[[WRPAC]]** — přístupový certifikát instance pro autentizaci vůči peněžence (podpis presentation request v [[OID4VP]]).
4. **Ověření vůči [[LoTE]]** — peněženka přijme požadavek jen od důvěryhodné [[RP]].

Subjekt, který peněženku **neakceptuje**, ale chce z ní číst data (aktivní integrace), se rovněž registruje. Čistě pasivní příjem atestací může mít odlišný režim dle konkrétního use casu — registrace je však bezpečnostní kotva ekosystému.

<details>
<summary>Co akceptace neznamená</summary>

- **Náhrada všech metod přihlášení** — uživatel může zůstat u stávajícího řešení.
- **Povinnost vyžadovat peněženku** — [[RP]] nemůže uživatele k peněžence nutit.
- **Automické splnění AML/KYC** — rozsah dat v prezentaci musí odpovídat konkrétnímu regulatornímu účelu; [[QEAA]] nebo [[PuB-EAA]] mohou chybět, pokud je vydavatel nevydal.
- **Akceptace libovolné peněženky** — jen certifikované [[EUDIW]] dle nařízení a IR.
- **Přístup k údajům mimo registraci** — požadavek musí odpovídat deklarovanému intended use ve [[WRPRC]]; nadbytečné atributy jsou v rozporu s principem minimalizace (čl. 5b odst. 9).

</details>

## Česká adaptační legislativa

Nařízení [[eIDAS]] 2.0 je **přímo použitelné** i bez českého zákona. Adaptační novela (návrh DIA, březen 2026) řeší to, co nařízení ponechává na členských státech:

| Oblast | Co návrh zákona řeší |
|--------|---------------------|
| Orgán dohledu | DIA jako dohled nad rámcem [[EUDIW]] a službami vytvářejícími důvěru |
| Registr [[RP]] | seznam stran spoléhajících se na peněženku, vydávání [[WRPRC]] a [[WRPAC]] |
| [[PID]] | Agentura jako vydavatel osobních identifikačních údajů do peněženky |
| Sankce | přestupek dle § 25 odst. 2 — soukromý subjekt jako [[RP]], který neumožní prokázání totožnosti peněženkou za podmínek čl. 5f odst. 2 a 3 (pokuta do 1 mil. Kč) |
| Prezenční ověření | centrální aplikace DIA od 1. 7. 2027, vlnový náběh povinností |

Návrh výslovně odkládá povinnost soukromého práva umožnit prokázání totožnosti peněženkou na **24. 12. 2027** — v souladu s čl. 5f odst. 2. K témuž datu má být plně aplikovatelná evropská úprava online prokazování.

Stav legislativního procesu (září 2026): vláda návrh schválila, novela dosud nebyla předána do Poslanecké sněmovny; bez ní však **evropská povinnost akceptace platí přímo** od 24. 12. 2027 — národní zákon ji spíše konkretizuje (registr, sankce, prezenční režim) než vytváří.

## Časová osa pro soukromý sektor

```text
24. 12. 2024 ──► IR k peněžence (účinnost)
       │
       ├── 24. 12. 2026 ──► stát nabídne EUDIW (předpoklad pro akceptaci)
       │
       ├── 10. 7. 2027 ──► AMLR (přímá účinnost) — redesign KYC, ne nutně = akceptace
       │
       ├── 1. 7. 2027 ──► CZ: prezenční ověřovací aplikace DIA (návrh zákona)
       │
       ├── 1. 1. 2028 ──► CZ: vlny prezenční akceptace (§ 18b návrhu)
       │
       └── 24. 12. 2027 ──► povinnost online akceptace (čl. 5f odst. 2 a 3)
```

| Datum | Událost | Dopad na soukromé [[RP]] |
|-------|---------|--------------------------|
| 27. 5. 2025 | účinnost IR 2025/848 (registrace [[RP]]) | registrace před integrací |
| 24. 12. 2026 | povinnost států nabídnout [[EUDIW]] | možnost pilotů akceptace |
| 10. 7. 2027 | AMLR | revize onboardingových procesů |
| 1. 7. 2027 | CZ prezenční aplikace (návrh) | příprava na ověření na místě |
| 1. 1. 2028 | CZ § 18b — start vln prezenční akceptace | banky, školy, pojišťovny, obce… |
| 24. 12. 2027 | čl. 5f odst. 2 a 3 | **povinná online akceptace** při splnění podmínek |

## Praktické závěry pro organizace

1. **Zjistěte, zda na vás dopadá silná autentizace** pro online identifikaci — projděte platební, telekomunikační, zdravotní a další sektorové předpisy i smluvní závazky vůči regulátorům.
2. **Ověřte velikostní kategorii podniku** — mikro a malý podnik jsou z čl. 5f odst. 2 vyjmuty.
3. **Plánujte integraci s ročním předstihem** — registrace [[RP]], [[OID4VP]], testy proti národní peněžence; typická implementace trvá 9–18 měsíců.
4. **Oddělte autentizaci od AML** — akceptace peněženky pro přihlášení (SUA) a kompletní identifikace zákazníka pro AML jsou související, ale ne totožné procesy.
5. **U plateb plánujte TS12** — banky vydávají SCA atestace do peněženky, obchodníci integrují přes bránu nebo redirect; third-party flow vyžaduje registraci [[RP]].
6. **Oddělte online a prezenční integraci** — čl. 5f (online, 24. 12. 2027) a § 18b (prezenčně, vlny od 1. 1. 2028) jsou dva projekty s odlišnou technikou.
7. **Sledujte český adaptační zákon** — registr, sankce a prezenční režim; evropská povinnost akceptace online platí i bez něj.

## Omezení analýzy

- Výklad „silné autentizace“ u konkrétních českých zákonů může vyžadovat judikaturu nebo výklad regulátora (ČNB, ČTÚ, ÚOOÚ).
- RTS k AMLR pro due diligence zákazníků (čl. 28 AMLR) byly v době psaní ve fázi finalizace — detailní pravidla pro vzdálený onboarding se mohou upřesnit.
- Novela zákonů o eID a SVS v ČR není v září 2026 v platnosti; údaje o § 18b a sankcích vycházejí z vládního návrhu a důvodové zprávy.

## Zdroje

- [Nařízení (EU) 2024/1183](https://eur-lex.europa.eu/eli/reg/2024/1183/oj) — [[eIDAS]] 2.0, čl. 5a, 5b, 5f
- [IR (EU) 2024/2977–2982](https://digital-strategy.ec.europa.eu/en/library/implementing-regulation-european-digital-identity-wallets) — technické specifikace peněženky
- [IR (EU) 2025/848](https://eur-lex.europa.eu/eli/reg_impl/2025/848/oj) — registrace wallet-[[RP]]
- [Nařízení (EU) 2024/1624](https://eur-lex.europa.eu/eli/reg/2024/1624/oj) — AMLR (účinnost 10. 7. 2027)
- [Zákon č. 370/2017 Sb.](https://www.zakonyprolidi.cz/200p/2017) — platební styk, silné ověření klienta
- [Návrh novely zákonů o eID a SVS](https://www.odok.cz/portal/veklep/material/ALBSDHZA32NV/) — DIA, VeKLEP (březen 2026)
- [Legislativní harmonogram EUDIW](/clanky/eudiw-legislativni-harmonogram/) — související článek na WalletMap
- [TS12 — SCA Implementation with the Wallet](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/blob/main/docs/technical-specifications/ts12-electronic-payments-SCA-implementation-with-wallet.md) — transakční data `urn:eudi:sca:*`
- [Digital euro scheme rulebook v0.91](https://www.ecb.europa.eu/euro/digital_euro/timeline/profuse/shared/pdf/ecb.derdgpr260702_Digital_euro_scheme_rulebook_v0.91.en.pdf) — FUR.06 (autentizace peněženkou)
- [Jaké atestace lze v EUDI Wallet vydávat](/clanky/nastaveni-atestaci-eudiw/) — dynamic linking u plateb

---

*Poslední aktualizace: 2. září 2026. Analýza vychází z publikovaných textů EU a vládního návrhu české adaptační novely; před rozhodnutím o konkrétní compliance doporučujeme ověření u právního poradce a příslušného regulátora.*
