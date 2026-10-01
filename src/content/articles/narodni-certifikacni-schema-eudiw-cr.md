---
title: "Národní certifikační schéma EUDIW v ČR: struktura, certifikační cyklus a dopady na aktéry"
description: "Detailní rozbor prvního veřejného konceptu českého Národního certifikačního schématu EUDIW: kompozitní model, rozsah certifikace, role DIA, ČIA a CAB, životní cyklus certifikátu a praktické dopady na poskytovatele, subdodavatele, relying parties i uživatele."
pubDate: 2026-10-01
tags: [eudiw, eidas, certifikace, cesko, pid, bezpecnost, compliance]
draft: false
---

Digitální a informační agentura 1. října 2026 zveřejnila **první veřejný koncept českého Národního certifikačního schématu (NCS)** pro [[EUDIW|evropskou peněženku digitální identity]]. Jde o dokument, podle kterého se má v České republice prokazovat shoda řešení peněženky a systému elektronické identifikace, v jehož rámci je peněženka poskytována, s evropským regulačním rámcem.

Český návrh je důležitý především tím, že je **kompozitní**. DIA jej veřejně popisuje jako kombinaci tří certifikací:

1. **certifikace poskytovatele peněženky** — služby pro poskytování a provozování řešení peněženky a pro ověřování peněženek a spoléhajících se stran,
2. **certifikace poskytovatele [[PID]]** — služby pro poskytování osobních identifikačních údajů,
3. **zastřešující certifikace**.

To znamená, že certifikace nemá být redukována na bezpečnostní audit mobilní aplikace. Evropský rámec požaduje posouzení **celé poskytované služby a elektronického identifikačního systému**: softwaru, relevantních hardwarových a platformních závislostí, bezpečnostních předpokladů, procesů onboardingu, řízení prostředků, změn, aktualizací, zranitelností a provozu.

> **Základní závěr:** certifikace [[EUDIW]] je průběžný assurance proces nad konkrétní verzí, architekturou a provozním modelem. Certifikát není obecné potvrzení, že „produkt je bezpečný“, ale důkaz shody přesně vymezeného objektu certifikace za definovaných předpokladů.

## Stav českého schématu k 1. říjnu 2026

DIA zveřejněný dokument označuje jako **první veřejný koncept**. Současně uvádí několik důležitých omezení jeho aktuálnosti:

- koncept zachycuje stav evropských nařízení, technických specifikací a norem **ke konci června 2026**,
- Český institut pro akreditaci (ČIA) jej posoudil a schválil jako podklad pro připravovanou akreditační službu,
- NCS má být závazným dokumentem pro dodavatele řešení [[EUDIW]], kteří je chtějí provozovat v České republice,
- DIA jako vlastník schématu předpokládá **aktualizaci pravděpodobně na konci roku 2026**, protože technické specifikace se dále mění.

Návrh NCS byl podle DIA ostatním členským státům předložen již začátkem června 2026. V tomto mezistátním připomínkování nebyly podle zveřejněné informace vzneseny zásadní připomínky. Akreditace certifikačních orgánů má navazovat prostřednictvím ČIA.

To má praktický důsledek: implementátor nemůže chápat vydání z 1. října jako navždy zmrazený certifikační target. Musí pracovat s **verzí schématu, verzemi použitých norem a přechodovými pravidly**.

## Právní základ: co musí národní schéma pokrýt

Základní evropský rámec vytváří [[eIDAS]] ve znění evropského rámce digitální identity a zejména prováděcí nařízení Komise (EU) 2024/2981 o certifikaci peněženek.

Toto prováděcí nařízení stanoví, že předmětem certifikace je **poskytování a provozování řešení peněženky a systému elektronické identifikace, v jehož rámci je poskytováno**. Do objektu certifikace patří zejména:

| Vrstva | Co se posuzuje |
|---|---|
| Software | Komponenty peněženky a elektronického identifikačního systému, jejich nastavení a konfigurace. |
| Hardware a platformy | Komponenty, na kterých kritické operace běží nebo na které spoléhají, pokud je poskytovatel přímo či nepřímo poskytuje nebo jsou nutné pro požadovanou úroveň záruky. |
| Externí platformy | Pokud je poskytovatel nekontroluje, musí schéma pracovat s explicitními bezpečnostními předpoklady a s mechanismem, který ověřuje, že jsou předpoklady v provozu skutečně splněny. |
| Procesy | Onboarding uživatele, registrace/enrolment, správa elektronických identifikačních prostředků, organizace a související provozní procesy. |
| Kryptografické prostředí | [[WSCD]], wallet secure cryptographic application a související assurance evidence, pokud jsou pro architekturu relevantní. |
| Provoz | Řízení změn, verzí, aktualizací, zranitelností a incidentů. |

Schéma musí pokrýt tři skupiny požadavků současně: **funkčnost, kybernetickou bezpečnost a ochranu osobních údajů**. Certifikace tedy není pouze penetrační test ani pouze kontrola shody implementace s protokolem.

## Kompozitní český model

Veřejný popis DIA rozděluje české NCS do tří částí. Toto rozdělení je vhodné číst jako oddělení odpovědností a evidence, nikoli jako tři navzájem nezávislé světy.

### 1. Certifikace poskytovatele peněženky

Tato část se týká služby, která:

- poskytuje a provozuje řešení peněženky,
- zajišťuje funkce potřebné k ověřování peněženek,
- zajišťuje funkce potřebné k ověřování spoléhajících se stran.

Z evropského rámce současně plyne, že poskytovatel musí umět pro konkrétní implementaci doložit architekturu, bezpečnostní kontroly, provozní procesy, závislosti a rizika. Pokud používá externí platformu, HSM, secure element, cloudovou službu nebo jiný komponentní certifikát, neznamená to automaticky, že je odpovědnost „přenesena“ na subdodavatele. Musí existovat **dependency analysis** a musí být prokázáno, že použitá assurance evidence skutečně pokrývá předpoklady dané architektury.

### 2. Certifikace poskytovatele [[PID]]

Druhou explicitní částí českého NCS je služba poskytování [[PID]]. DIA na stránce schématu uvádí, že podle připravované české legislativy má být poskytovatelem [[PID]] právě DIA.

Pro tuto část je zásadní, že [[PID]] není jen datový objekt. Jeho důvěryhodnost závisí na řetězci procesů od ověření identity a vazby na konkrétního uživatele přes vydání do správné wallet unit až po správu životního cyklu. Certifikační evidence proto musí být schopna prokázat, že výsledný credential vzniká v procesu splňujícím požadovanou úroveň záruky a že rozhraní mezi poskytovatelem [[PID]] a peněženkou nezavádí nepokrytá rizika.

### 3. Zastřešující certifikace

Třetí vrstvu DIA označuje jako **zastřešující certifikaci**.

Její praktický význam je podstatný: ani úspěšná certifikace dílčích služeb sama o sobě neprokazuje, že jejich kompozice funguje bezpečně jako celek. Zastřešující úroveň musí být schopna pracovat s rozhraními, rozdělenými odpovědnostmi, sdílenými procesy, předpoklady a důkazy z nižších úrovní.

Veřejná stránka DIA sama nepopisuje detailní dependency graph mezi třemi certifikacemi. Proto není správné z pouhého slova „kompozitní“ dovozovat, že vyšší certifikát vznikne mechanickým sečtením dvou nižších certifikátů. Evropský rámec naopak vyžaduje posouzení architektury a pokrytí rizik celé implementace.

Schematicky lze český model číst takto:

```text
                zastřešující certifikace
                         │
              ┌──────────┴──────────┐
              │                     │
   certifikace wallet služby   certifikace PID služby
              │                     │
     wallet solution /         issuance / identity
     provoz / verifikace       lifecycle / vazby
              │                     │
              └──────────┬──────────┘
                         │
                společný eID systém
```

Diagram je logické vysvětlení kompozitního principu, nikoli náhrada přesného certifikačního dependency modelu stanoveného přílohami NCS.

## Architektonické profily: certifikuje se konkrétní způsob realizace

Prováděcí nařízení 2024/2981 vyžaduje, aby národní certifikační schéma popsalo konkrétní architekturu. Pokud podporuje více architektur, musí pro každou existovat **samostatný profil**.

Každý profil musí minimálně obsahovat:

1. konkrétní architekturu peněženky a souvisejícího systému elektronické identifikace,
2. bezpečnostní kontroly odpovídající požadované úrovni záruky,
3. evaluation plan podle EN ISO/IEC 17065,
4. bezpečnostní požadavky pokrývající relevantní rizika a hrozby,
5. mapování kontrol na komponenty architektury,
6. vysvětlení, jak navržené kontroly, mapování a evaluace pokrývají rizika až do požadované úrovně záruky.

To je důležité i pro produktové rozhodování. Změna například z lokálního [[WSCD]] na vzdálený kryptografický modul, změna mobilní platformy nebo přesun kritické serverové funkce do jiného provozního modelu nemusí být jen „implementační detail“. Může měnit předpoklady certifikovaného profilu a tím vyvolat potřebu zvláštní evaluace.

## Risk-based přístup: evropský registr rizik je pouze výchozí bod

Příloha I prováděcího nařízení 2024/2981 obsahuje společný evropský risk register. Zahrnuje mimo jiné rizika:

| ID | Oblast |
|---|---|
| R1 | vytvoření nebo použití existující elektronické identity neoprávněným způsobem |
| R2 | vytvoření nebo použití falešné elektronické identity |
| R3 | vytvoření nebo použití falešných atributů |
| R4 | krádež identity |
| R5 | krádež dat |
| R6 | neoprávněné zpřístupnění dat |
| R7 | manipulace s daty |
| R8 | ztráta dat |
| R9 | neautorizovaná transakce |
| R10 | manipulace s transakcí |
| R11 | popření uskutečněné operace |
| R12 | zpřístupnění transakčních dat |
| R13 | narušení dostupnosti služby |
| R14 | sledování uživatele |
| SR1 | plošné sledování |
| SR2 | reputační škoda |
| SR3 | právní nesoulad |

Provozovatel ale nesmí skončit u obecného seznamu. Musí doplnit **rizika specifická pro svou implementaci** a navrhnout jejich ošetření. Certifikační orgán pak hodnotí, zda jsou rizika, kontroly a důkazy konzistentní.

Pro architekta je proto důležité, aby threat model a risk register vznikaly současně s architekturou. Dodatečně vytvořený „compliance dokument“ bez vazby na komponenty, trust boundaries a provozní procesy nebude odpovídat logice schématu.

## Požadovaná úroveň odolnosti

Schéma musí vyžadovat odolnost odpovídající úrovni záruky **high**, včetně odolnosti proti útočníkům s vysokým attack potential.

To se promítá zejména do:

- návrhu a ochrany kritických aktiv,
- úložiště a používání kryptografických klíčů,
- hodnocení [[WSCD]] a wallet secure cryptographic application,
- vulnerability assessment,
- posuzování zdrojového kódu tam, kde je to pro evaluaci nutné,
- penetračních a dalších technických testů,
- bezpečnostních předpokladů na operační systém, zařízení, secure hardware a backend.

Použití již certifikovaného komponentu je výhodou, ale není automatickým „pass“. Evaluátor musí posoudit, zda rozsah, assumptions, security target a provozní podmínky existující certifikace odpovídají tomu, jak je komponent použit v peněžence.

## Co musí žadatel připravit pro certifikaci

Prováděcí nařízení předpokládá, že certifikační orgán dostane dostatek evidence k ověření nejen výsledku, ale i konstrukce celého assurance argumentu.

V praxi musí žadatel počítat minimálně s následujícími skupinami podkladů:

| Evidence | Typický obsah |
|---|---|
| Architektura | komponenty, rozhraní, trust boundaries, kritická aktiva, deployment model, podporované varianty a zařízení |
| Risk management | evropská rizika + implementačně specifická rizika, jejich treatment a residual risk |
| Security controls | kontrola, její účel, implementace, vlastník a vazba na riziko |
| Evaluation plan | co se bude auditovat, testovat, analyzovat a jaký důkaz se očekává |
| Component assurance | certifikáty, assurance reports, security targets, assumptions a provozní omezení externích komponent |
| Vývoj | secure development, řízení změn, verzování, release a update proces |
| Provoz | monitoring, incident management, vulnerability management, change management |
| Personál | role, odpovědnosti, kvalifikace, bezpečnostní školení a řízení přístupů |
| Testování | funkční testy, bezpečnostní testy, výsledky vulnerability assessment a případně penetrační testy |
| Zdrojový kód | v rozsahu, který je pro konkrétní evaluaci nutný |
| Subdodavatelé | rozdělení odpovědností, SLA, kontrolní mechanismy, assurance evidence a exit/change scénáře |

Velkou praktickou změnou proti běžnému produktovému auditu je **důraz na dependency analysis**. Poskytovatel musí vědět, na jaké externí komponentě nebo službě stojí každá bezpečnostní vlastnost a jakým důkazem je tato závislost pokryta.

## Jak probíhá posuzování shody

Národní schéma musí být podle prováděcího nařízení implementováno jako **type 6 certification scheme** podle EN ISO/IEC 17067. Certifikační orgány musí být akreditovány podle EN ISO/IEC 17065.

Samotná evaluace má zahrnovat mimo jiné:

- audit implementace vůči risk registru,
- funkční testování,
- hodnocení existence a vhodnosti maintenance procesů,
- hodnocení jejich skutečné provozní účinnosti,
- dependency analysis,
- vulnerability assessment,
- review návrhu a podle potřeby i zdrojového kódu,
- testování odolnosti proti útočníkovi s vysokým attack potential,
- vyhodnocení změn threat landscape,
- ověření, že konkrétní implementace odpovídá deklarovanému architektonickému profilu.

Schéma může umožnit **sampling** variant komponent a cílových zařízení, aby se zbytečně neopakovaly identické testy. Certifikační orgán ale musí použití vzorkování odůvodnit.

## ČIA, certifikační orgány a subdodavatelé evaluace

V českém modelu je národním akreditačním orgánem ČIA. Certifikační orgán musí před vydáváním certifikátů získat odpovídající akreditaci a prokázat zejména:

- detailní technickou znalost podporovaných architektur,
- znalost relevantních hrozeb a rizik,
- znalost bezpečnostních řešení používaných pro vysokou úroveň záruky,
- schopnost posuzovat existující certifikáty a další assurance evidence komponent,
- detailní znalost českého NCS.

Certifikační orgán smí některé evaluační činnosti subkontrahovat. Odpovědnost za výsledek ale zůstává na certifikačním orgánu a schéma musí řešit způsobilost subdodavatelů například podle standardů pro testovací laboratoře, inspekci, audit, validaci nebo verifikaci.

Pro český trh to znamená, že vznik NCS je jen první krok. Praktická dostupnost certifikace závisí také na tom, kdy budou existovat akreditované orgány s odpovídající odborností a kapacitou.

## Certifikační životní cyklus: ne koncový audit, ale čtyřletý cyklus

Prováděcí nařízení definuje model pravidelného dohledu. Zjednodušeně:

| Rok | Typ | Hlavní činnost |
|---|---|---|
| 0 | počáteční certifikace | úplná evaluace včetně vulnerability assessment, posouzení update mechanismů a maintenance procesů, vydání certifikátu |
| 1 | surveillance | kontrola provozní účinnosti version/update/vulnerability managementu a bezpečnostně relevantních změn |
| 2 | surveillance | vulnerability assessment celé solution + kontrola maintenance procesů a změn |
| 3 | surveillance | kontrola maintenance procesů a bezpečnostně relevantních změn |
| 4 | recertifikace | úplná evaluace, vulnerability assessment a vydání nového certifikátu |

To vytváří významný provozní závazek. Certifikační dokumentace nemůže vzniknout pouze těsně před auditem. Organizace musí být schopna průběžně dokazovat, že kontrolní mechanismy **skutečně fungují v provozu**.

## Změny produktu: kdy už nestačí běžný release proces

Schéma musí obsahovat proces pro řízení změn certifikovaného objektu. Změna se posoudí a podle dopadu může být pokryta:

- pravidelným ověřením účinnosti maintenance procesů, nebo
- **special evaluation**, pokud má specifický dopad na předpoklady nebo shodu.

Z praktického hlediska by tedy release governance měla obsahovat certifikační impact assessment. Před významnou změnou architektury, kryptografie, platformy, identity proofingu, update mechanismu nebo kritického subdodavatele je nutné vyhodnotit, zda změna zůstává uvnitř certifikovaného scope.

Certifikace tím zasahuje přímo do product lifecycle managementu a change managementu.

## Incidenty a zranitelnosti

Držitel certifikátu musí certifikační orgán **bez zbytečného odkladu** informovat o narušení nebo kompromitaci, která může mít dopad na shodu.

Musí rovněž:

- udržovat vulnerability management policy a procesy,
- definovat kritéria pro oznamování zranitelností a změn certifikačnímu orgánu,
- pro relevantní zranitelnost softwarových komponent zpracovat vulnerability impact analysis,
- posoudit dopad na certifikované řešení, pravděpodobnost útoku a možnosti nápravy,
- veřejně známé a opravené zranitelnosti registrovat podle pravidel schématu.

Certifikační orgán může certifikát pozastavit, pokud potvrzený incident narušuje shodu. Pokud není problém včas napraven nebo závažná zranitelnost zůstává neošetřena v čase odpovídajícím její závažnosti, může dojít ke zrušení certifikátu.

To je důležité i smluvně: provozní smlouvy se subdodavateli musí umožnit získat informace a provést nápravu v časových oknech, která držitel certifikátu potřebuje pro splnění vlastních povinností.

## Evidence a uchovávání záznamů

Schéma musí řešit recordkeeping jak na straně certifikačních orgánů, tak držitelů certifikátu.

Relevantní informace z certifikačních činností musí být chráněny a uchovávány nejméně po dobu požadovanou právem a minimálně **pět let po zrušení nebo vypršení certifikátu**. Držitel má obdobně uchovávat podklady poskytnuté v průběhu certifikace a v relevantních případech i vzorky hardwarových komponent zahrnutých do scope.

Současně musí být chráněno obchodní tajemství, důvěrné informace a práva duševního vlastnictví. Požadavek zpřístupnit při evaluaci detailní technické informace nebo zdrojový kód proto neznamená jejich veřejné zveřejnění.

## Co obsahuje výsledný certifikát

Evropské prováděcí nařízení vyžaduje, aby certifikát shody obsahoval zejména:

- unikátní identifikátor,
- název peněženky,
- název systému elektronické identifikace, v jehož rámci je poskytována,
- **hodnocenou verzi**,
- identitu držitele certifikátu,
- odkaz na veřejně poskytované informace,
- identifikaci certifikačního orgánu a případně samostatného evaluačního subjektu,
- informaci o jeho akreditaci,
- vlastníka certifikačního schématu,
- odkazy na příslušné právní předpisy,
- odkazy na certification report a certification assessment report,
- použité standardy **včetně jejich verzí**,
- datum vydání a dobu platnosti.

Dvě položky jsou prakticky zásadní: **verze řešení** a **verze standardů**. Certifikace tedy není abstraktní razítko nad názvem produktu.

## Dopady na jednotlivé aktéry českého ekosystému

| Aktér | Je přímým cílem NCS? | Co pro něj schéma prakticky znamená |
|---|---|---|
| DIA jako vlastník schématu | governance | Udržuje NCS, řeší změny a přechody mezi verzemi, informuje evropskou Cooperation Group o revizích a v českém modelu je zároveň plánovaným poskytovatelem [[PID]]. |
| ČIA / národní akreditační orgán | akreditace | Akredituje certifikační orgány a ověřuje jejich kompetenci podle EN ISO/IEC 17065 a NCS. |
| Certifikační orgán / CAB | ano, jako vykonavatel certifikace | Provádí nebo řídí evaluaci, rozhoduje o certifikaci, surveillance, suspension a cancellation; odpovídá i za subkontrahované evaluační činnosti. |
| Poskytovatel peněženky | **ano** | Musí prokázat shodu architektury, implementace a provozu, pokrytí rizik, řízení závislostí a účinné maintenance procesy. |
| Poskytovatel [[PID]] | **ano v českém kompozitním modelu** | Musí prokázat shodu služby vydávání [[PID]], zejména důvěryhodnost issuance a vazeb na identifikační a wallet procesy. |
| Držitel zastřešující certifikace | **ano** | Nese assurance argument za složený celek a za rozhraní mezi dílčími certifikovanými oblastmi. |
| Vývojář / integrátor peněženky | nepřímo | Musí dodávat evidence, traceability kontrol, secure development a podporu pro zdrojový kód, testování, změny a opravy. |
| Provozovatel backendu / cloudu | nepřímo až přímo podle scope | Je zdrojem důkazů pro dostupnost, bezpečnost, incidenty, změny, přístupy a provozní assumptions. |
| Dodavatel HSM, secure hardware nebo [[WSCD]] | komponentní závislost | Jeho certifikace a assurance evidence lze využít, ale jejich vhodnost pro konkrétní architekturu musí být ověřena. |
| Poskytovatel onboardingu / identity proofingu | procesní závislost | Jeho proces může být součástí elektronického identifikačního systému a musí splnit požadovanou úroveň záruky a důkazní požadavky. |
| [[RP\|Spoléhající strana]] | typicky není držitelem wallet certifikátu | NCS ji přímo necertifikuje jako běžnou spoléhající se stranu, ale certifikovaná wallet služba musí bezpečně pracovat s jejím ověřením a registrací. |
| Poskytovatel [[EAA]] / [[QEAA]] | zpravidla jiný regulatorní režim | Jeho vlastní status nebo kvalifikace není nahrazena NCS; jeho rozhraní vůči peněžence ale vstupuje do interoperabilního a trust modelu. |
| Uživatel peněženky | ne | Není certifikovaným subjektem; certifikace má chránit jeho identitu, data, klíče, transakce a soukromí a zvyšovat důvěru v konkrétní wallet unit. |
| Orgán dohledu | dohled | Dostává informace o vydání, pozastavení a zrušení certifikátů a může požadovat relevantní evidence. |

### Poznámka k [[RP]]

Je důležité nezaměňovat dvě věci:

1. **registraci a autentizaci [[RP]] v ekosystému**, a
2. **certifikaci wallet solution a eID systému**.

Veřejný český popis zahrnuje do certifikace poskytovatele peněženky také službu ověřování spoléhajících se stran. To ale neznamená, že každá banka, e-shop nebo úřad žádající o data z peněženky získává stejný typ certifikátu jako poskytovatel peněženky. [[RP]] má vlastní registrační a trust mechanismy podle evropského rámce.

### Poznámka k poskytovatelům atributů

Podobně NCS nenahrazuje pravidla pro vydavatele [[EAA]] nebo [[QEAA]]. Kvalifikovaný poskytovatel [[QEAA]] zůstává v režimu kvalifikovaných služeb vytvářejících důvěru a jeho status se neposuzuje prostým získáním wallet certifikátu. Certifikace peněženky ověřuje mimo jiné to, že wallet ecosystem s takovými důvěryhodnými zdroji interoperuje bezpečně a podle pravidel.

## Co z NCS plyne pro subdodavatelský řetězec

Jedním z největších praktických dopadů je přesun certifikačních požadavků do supply chainu.

Pokud poskytovatel spoléhá na externí:

- mobilní operační systém,
- secure element nebo TEE,
- HSM,
- cloud,
- CI/CD infrastrukturu,
- remote [[WSCD]],
- identity proofing,
- monitoring nebo SOC,
- komponentu třetí strany,

musí být schopný vysvětlit, **která bezpečnostní vlastnost na této závislosti stojí a jak je zajištěna**.

Dodavatelská smlouva proto může potřebovat ustanovení o:

- poskytování auditní a certifikační evidence,
- oznamování změn a zranitelností,
- podpoře incident response,
- zachování konkrétní certifikované konfigurace,
- řízení verzí,
- právu na audit nebo přístup k assurance reportům,
- řízení zásadních změn subdodavatele.

NCS tak není pouze téma bezpečnostního nebo compliance týmu; vstupuje i do nákupu, vendor managementu, architektury a smluv.

## Ochrana osobních údajů: certifikace není náhrada GDPR

Prováděcí nařízení výslovně zahrnuje data protection requirements do národního certifikačního schématu. Současně ale zachovává oddělení rolí: posouzení incidentu nebo vulnerability certifikačním orgánem nepředjímá posouzení dozorového úřadu podle pravidel ochrany osobních údajů.

Prakticky tedy nelze certifikát použít jako tvrzení, že jsou automaticky splněny všechny povinnosti správce nebo zpracovatele osobních údajů. Certifikace a privacy governance se překrývají, ale jedna druhou nenahrazuje.

## Co by měl poskytovatel začít dělat ještě před formální žádostí

Největší úsporu času nepřinese „psaní dokumentace pro audit“, ale vytvoření evidence současně s řešením. Praktický přípravný baseline je:

1. **Zmrazit a popsat certifikační scope** — co je wallet solution, co je eID systém, kdo vlastní jednotlivé procesy a kde leží hranice subdodavatelů.
2. **Vybrat architektonický profil** a explicitně sepsat assumptions na zařízení, platformy a externí služby.
3. **Vytvořit traceability**: riziko → požadavek → kontrola → komponenta/proces → test/evidence.
4. **Zavést certifikační impact assessment do change managementu**.
5. **Zmapovat komponentní certifikáty a assurance evidence** a ověřit, zda jejich scope a assumptions odpovídají skutečnému použití.
6. **Propojit vulnerability management s certifikačním reportingem**, nikoli pouze s interním ticketingem.
7. **Připravit surveillance evidence** tak, aby bylo možné každoročně dokládat skutečnou účinnost maintenance procesů.
8. **Smluvně ošetřit dodavatelský řetězec**, zejména změny, zranitelnosti, auditní podklady a reakční doby.
9. **Verzovat compliance baseline** společně s produktem, protože certifikát odkazuje na konkrétní verzi řešení i standardů.
10. **Sledovat revize NCS**, protože DIA výslovně očekává aktualizovanou verzi po spuštění akreditační služby.

## Co znamená červnový cut-off zveřejněného konceptu

DIA uvádí, že zveřejněný koncept reflektuje stav k **30. červnu 2026**. To je důležitá hranice.

Po tomto datu došlo k dalším změnám technického rámce. V červenci 2026 bylo přijato například prováděcí nařízení (EU) 2026/1731, které aktualizovalo část technických specifikací peněženky. Takové změny automaticky neznamenají, že je říjnový koncept nepoužitelný; znamenají ale, že implementátor musí pečlivě rozlišovat:

```text
verze NCS
  + verze evropských prováděcích aktů
  + verze technických standardů
  + verze architektonického profilu
  + verze konkrétní implementace
= konkrétní certifikační baseline
```

Právě tento versioning je jeden z důvodů, proč DIA již při zveřejnění první verze avizuje další aktualizaci.

## Co certifikace řeší — a co ne

NCS řeší prokazování shody peněženky a elektronického identifikačního systému s relevantními funkčními, bezpečnostními a privacy požadavky. Neřeší ale samo o sobě všechny otázky ekosystému.

**Certifikace například nenahrazuje:**

- registraci [[RP]],
- kvalifikovaný status [[QTSP]],
- právní režim [[QEAA]],
- obecné povinnosti [[TSP]],
- samostatné povinnosti podle GDPR nebo NIS2,
- provozní řízení bezpečnosti po vydání certifikátu.

Naopak právě vazba certifikace na každodenní provoz je klíčová. Incident, neřízená změna, neopravená zranitelnost nebo ztráta kontroly nad důležitým předpokladem může mít přímý dopad na platnost certifikátu.

## Shrnutí

České NCS staví certifikaci [[EUDIW]] jako **kompozitní a průběžný systém assurance**. Veřejně potvrzené tři vrstvy jsou certifikace poskytovatele peněženky, certifikace poskytovatele [[PID]] a zastřešující certifikace.

Evropský rámec pod tímto českým členěním vyžaduje podstatně širší posouzení, než naznačuje slovo „certifikace produktu“: konkrétní architekturu, software, kritické hardwarové a platformní závislosti, procesy, bezpečnostní assumptions, risk management, dependency analysis, funkční testy, vulnerability assessment, provozní účinnost maintenance procesů a řízení změn.

Pro poskytovatele je proto nejdůležitější připravit certifikovatelnost už v architektuře a provozním modelu. Pro ČIA a certifikační orgány vzniká nový specializovaný akreditační a evaluační obor. Pro subdodavatele vzniká požadavek dodávat použitelnou assurance evidence. Pro [[RP]], vydavatele atributů a uživatele je NCS primárně trust mechanismem: jejich vlastní role nemusí být přímo certifikována tímto schématem, ale bezpečné fungování jejich interakcí s peněženkou je součástí certifikovaného ekosystému.

A konečně, první veřejná verze není konečný stav. Její normativní a technický baseline končí červnem 2026 a DIA již při zveřejnění počítá s další revizí. Certifikační strategie proto musí počítat nejen s prvním získáním certifikátu, ale také s **průběžnou změnou schématu, standardů a produktu**.

## Primární zdroje

- [DIA — Národní certifikační schéma, první veřejný koncept](https://www.dia.gov.cz/cs/legislativa/eidas-sluzby-vytvarejici-duveru-a-elektronicka-identifikace/informace-pro-odborniky/narodni-certifikacni-schema-eudiw)
- [DIA — informace o předložení návrhu ostatním členským státům](https://www.dia.gov.cz/cs/aktuality/dia-poskytla-navrh-certifikacniho-schematu-eudiw-ke-stanovisku-ostatnim-clenskym-statum-eu)
- [Prováděcí nařízení Komise (EU) 2024/2981](https://eur-lex.europa.eu/eli/reg_impl/2024/2981/oj) — závazná pravidla pro národní certifikační schémata peněženek
- [Nařízení (EU) 2024/1183](https://eur-lex.europa.eu/eli/reg/2024/1183/oj) — evropský rámec digitální identity
- [Prováděcí nařízení Komise (EU) 2026/1731](https://eur-lex.europa.eu/eli/reg_impl/2026/1731/oj) — červencová aktualizace části technických specifikací peněženky

---

*Stav článku: 1. října 2026. Článek rozlišuje veřejně potvrzenou strukturu českého NCS od požadavků, které pro něj přímo stanoví evropské právo. Vzhledem k avizované aktualizaci schématu je při přípravě certifikace nutné ověřit aktuální verzi NCS, prováděcích aktů a technických standardů.*
