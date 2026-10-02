---
title: "Národní certifikační schéma EUDIW-CZ 1.2: co skutečně požaduje česká certifikace"
description: "Detailní rozbor českého certifikačního schématu EUDIW-CZ 1.2 podle hlavního dokumentu a příloh: kompozitní certifikace, český architektonický profil, požadavky na wallet a PID providery, ověřovací službu, WSCD/WSCA, dodavatele, CAB, životní cyklus, open-source povinnost a správu zranitelností."
pubDate: 2026-10-01
tags: [eudiw, eidas, certifikace, cesko, pid, bezpecnost, compliance]
draft: false
---

Digitální a informační agentura zveřejnila české národní certifikační schéma **[[EUDIW]]-CZ, verze 1.2** pro [[EUDIW]]. Po prostudování hlavního dokumentu a zveřejněných příloh je zřejmé, že česká certifikace je podstatně konkrétnější než samotný obecný evropský rámec: stanoví nejen proces certifikace, ale také český architektonický profil, vlastní bezpečnostní požadavky nad rámec baseline ENISA, konkrétní požadavky na poskytovatele peněženky a [[PID]], ověřovací službu, [[WSCD]]/WSCA, dodavatelský řetězec a velmi podrobnou kvalifikaci certifikačních orgánů.

Základní metadata schématu jsou:

| Parametr | [[EUDIW]]-CZ 1.2 |
|---|---|
| Vlastník schématu | Digitální a informační agentura (DIA) |
| Orgán dohledu | DIA |
| Národní akreditační orgán | Český institut pro akreditaci (ČIA) |
| Typ schématu | typ 6 podle ISO/IEC 17067 |
| Flexibilita schématu | není |
| Rozhodující jazyk | čeština; anglické znění je informativní |

> **Základní závěr:** [[EUDIW]]-CZ není certifikace jedné mobilní aplikace. Certifikuje služby IKT, jejich produktové i procesní komponenty a vazby mezi nimi. Schéma je kompozitní a dovoluje samostatnou certifikaci částí, ale výsledná záruka musí pokrýt i jejich integraci.

## Co přesně český certifikát osvědčuje

Hlavní dokument [[EUDIW]]-CZ stanoví, že certifikát je certifikátem podle čl. 5c odst. 1 [[eIDAS]] a osvědčuje shodu řešení peněženky a systému elektronické identifikace, v jehož rámci je poskytováno:

- s požadavky na kybernetickou bezpečnost podle přílohy X [[EUDIW]]-CZ,
- s funkčními požadavky podle přílohy III prováděcího nařízení (EU) 2024/2981.

Schéma současně výslovně říká, že k prokázání této shody se **nevyžaduje žádný další národní certifikační mechanismus**.

Do rozsahu spadají služby IKT včetně jejich dokumentace. Schéma jmenuje zejména:

1. služby poskytování řešení peněženky,
2. systém elektronické identifikace, v jehož rámci je peněženka poskytována, v českém schématu reprezentovaný rolí poskytovatele [[PID]],
3. jednotlivé části těchto služeb,
4. následnou certifikaci kompozitního celku.

Příloha V mezi typy služby IKT, které mohou být uvedeny na certifikátu, uvádí například **Poskytovatele peněženky, Poskytovatele [[PID]] a zastřešující certifikát**. Na jednom certifikátu může být uvedeno více služeb IKT.

Příloha I tento rámec zpřesňuje velmi jednoznačně. Schéma je složeno ze tří certifikačních částí:

1. **Poskytování peněženky** — služby pro poskytování a provozování řešení peněženky a pro ověřování validity peněženek a spoléhajících se stran,
2. **Poskytování [[PID]]** — služba poskytování údajů o identifikaci osoby,
3. **zastřešující certifikace [[EUDIW]]-CZ**.

Diagram na první straně přílohy I zakresluje tyto části uvnitř společné hranice TOE: modrou oblast služby peněženky a žlutou oblast poskytování [[PID]], nad nimiž stojí zastřešující [[EUDIW]]-CZ. Mimo tuto hranici jsou naopak zakresleny služby vytvářející důvěru, služby elektronické identifikace, infrastruktura trust listů a ostatní spoléhající se strany.

Příloha I také výslovně stanoví, co **není** předmětem certifikace [[EUDIW]]-CZ: služby vytvářející důvěru, služby elektronické identifikace atestované podle zákona č. 250/2017 Sb. pro úrovně „značná“ a „vysoká“, služby publikace seznamů kvalifikovaných služeb a důvěryhodných entit (LoTL/[[LoTE]]) a ostatní spoléhající se strany. Tyto systémy však mohou být kritickými externími závislostmi certifikovaného řešení.

## Kompozitní model: Ia + Ib + integrační zastřešující certifikát

[[EUDIW]]-CZ výslovně pracuje s **kompozitní certifikací**. Přílohy Ia a Ib oddělují certifikační rozsah poskytování peněženky a poskytování [[PID]], zatímco příloha Ic přesně definuje úlohu zastřešujícího certifikátu.

U zastřešující certifikace certifikační orgán:

1. ověří, že hodnocení podle příloh **Ia a Ib bylo provedeno řádně a úplně**,
2. a protože tato dvě hodnocení mohou proběhnout v různém čase nebo dokonce u různých certifikačních orgánů, ověří také provedení funkčních testů, které dokazují **interoperabilitu a funkčnost všech vzájemných integrací**.

Zastřešující certifikát tedy není mechanické „sečtení“ dvou certifikátů ani třetí kompletní evaluace všeho od začátku. Jeho explicitním účelem je ověřit úplnost obou dílčích evaluací a assurance nad jejich integrací.

Samostatně mohou být v rámci schématu hodnoceny i další části a komponenty s již existující assurance evidence. Certifikační orgán hodnotící složenou službu musí získat relevantní informace od orgánu, který hodnotil dílčí službu nebo komponentu. Předchozí certifikace tedy může snížit rozsah opakovaného testování, ale sama o sobě neprokazuje shodu celého řešení.

České schéma tento princip zpřesňuje v příloze IX. Každý existující důkaz o záruce se hodnotí ve třech dimenzích:

1. **vydavatel** — důvěryhodnost, odborná způsobilost a akreditace,
2. **rozsah** — zda původní certifikát skutečně pokrývá vlastnosti potřebné pro [[EUDIW]]-CZ,
3. **úroveň záruky** — zda provedené hodnotící činnosti dosahují požadované síly.

Pokud existují mezery, certifikační orgán stanoví **zbytkové hodnotící činnosti**. Přijetí komponentního certifikátu tedy znamená přijetí strukturovaného důkazu, nikoli automatické uznání komponenty nebo celého řešení.

Příloha IX pro tento účel výslovně pracuje s dependency analysis podle CEN TS 18072.

## Co přesně patří do certifikace „Poskytování peněženky“

Příloha Ia dává certifikační oblasti poskytování peněženky konkrétní komponentový obsah. Vedle společných komponent z přílohy I zahrnuje nejméně:

| Komponenta | Role v certifikovaném scope |
|---|---|
| instance peněženky | uživatelské rozhraní; může mít více variant pro různé platformy a architektury |
| WSCA | bezpečná kryptografická aplikace peněženky spravující kritická aktiva přes [[WSCD]] |
| služba jednotky peněženky | backendová služba podporující jednotlivé wallet units |
| proces nahrávání a aktualizace | distribuce a aktualizace instance peněženky a WSCA |
| služba poskytování a správy peněženek | zřízení a řízení peněženky po celý životní cyklus |
| ověřování validity spoléhajících se stran | ověření pravosti a platnosti identity registrovaných [[RP]] |
| ověřování validity peněženek | ověření pravosti a platnosti evropských peněženek digitální identity |
| [[WSCD]] | kryptografický prostředek chránící kritická aktiva a provádějící kritické kryptografické operace |

Příloha I navíc říká, že **všichni poskytovatelé peněženek musí bezplatně zajistit služby ověřování validity spoléhajících se stran a ověřování validity peněženek** podle čl. 5a odst. 8 [[eIDAS]].

U [[WSCD]] příloha Ia připouští i situaci, kdy [[WSCD]] není přímo součástí certifikované IKT služby. V takovém případě však poskytovatel musí explicitně definovat assumptions, na kterých WSCA vůči externímu [[WSCD]] závisí, a jejich platnost prokázat. Součástí certifikace poskytování peněženky jsou zároveň funkční testy podle společné části přílohy I.

Zvláštní český organizační detail je, že vybraný koncesionář má dodat také službu fyzického ověření totožnosti a level-up procesu z eID úrovně „značná“. Přestože ji může dodávat wallet provider, tato funkčnost se podle přílohy I certifikuje v oblasti **Poskytování [[PID]]**, nikoli jako součást wallet certifikátu.

## Český architektonický profil je konkrétní

Příloha X není napsána jako neutrální katalog pro libovolnou architekturu. Výslovně pracuje s architektonickým profilem [[EUDIW]]-CZ a zavádí předpoklady, které mají přímé dopady na návrh řešení.

Pro účely přílohy X se uvažuje, že každá wallet unit:

- obsahuje **jednu WSCA**,
- obsahuje **jeden [[WSCD]]** pro dosažení úrovně záruky „vysoká“,
- obsahuje **jednu instanci peněženky**.

Elektronická potvrzení atributů mohou být podle rulebooku konkrétního [[EAA]] uložena i mimo tento [[WSCD]].

Příloha X dále opakovaně pracuje s profilem **vzdáleného [[WSCD]]**, typicky provozovaného jako HSM. Pro tento profil české schéma identifikuje centralizovaný [[WSCD]] jako významnou sdílenou bezpečnostní závislost, řeší multi-tenancy izolaci, redundanci, obnovu a autentizovaný kanál mezi instancí peněženky, WSCA a vzdáleným [[WSCD]].

Certifikační target tedy není pouze sada protokolů. Je spojen s konkrétními architektonickými assumptions a s kontrolami, které musí tyto assumptions pokrývat.

## Bezpečnostní požadavky: čtyři kategorie

Příloha X rozděluje požadavky do čtyř kategorií:

| Kategorie | Význam |
|---|---|
| **Fun** | funkční bezpečnostní požadavky; shodu lze typicky ověřovat testováním |
| **Sec** | implementační bezpečnostní požadavky; typicky audit a inspekce |
| **Cond** | podmíněné požadavky, například pro vzdálený nebo externí [[WSCD]] |
| **Privacy** | doplňkové privacy požadavky nad rámec kybernetické bezpečnosti |

Důležitá nuance: privacy vlastnosti nejsou obecně „volitelné“. Požadavky na ochranu soukromí, které jsou současně bezpečnostními vlastnostmi, jsou vedeny jako **[Sec] a jsou povinné**. Samostatná kategorie **[Privacy]** označuje pouze doplňkové rozšíření certifikačního scope.

České schéma například ponechává jako povinné bezpečnostní požadavky i pravidla, která zakazují zbytečné sledování používání peněženky a kombinování osobních údajů z peněženky s jinými službami poskytovatele.

## Společný rozsah: full-stack systém a pět provozních procesů

Příloha I stanoví společný základ pro každou certifikovanou službu IKT. Každá služba je kombinací produktů, služeb, ISMS a procesních komponent. **Systém IKT je posuzován jako full-stack**, takže se očekává assurance evidence pro celý systém, nikoli pouze pro jeho aplikační vrstvu.

Společný rozsah zahrnuje také procesy:

- vývoje,
- řízení změn,
- správy zranitelností,
- řízení incidentů,
- řízení podvodů.

Schéma výslovně řeší i provozní prostředí. Pokud jej poskytuje sám poskytovatel nebo jeho smluvní třetí strana, například cloud provider, musí být doloženo splnění assumptions. Pokud prostředí poskytuje uživatel, musí poskytovatel definovat kontroly, které ověří platnost assumptions na uživatelském zařízení.

## Hodnotící metody A / I / T / C

Příloha X klasifikuje hodnotící metody do čtyř skupin:

- **A — Audit:** přezkum dokumentace a politik,
- **I — Inspekce:** ověření skutečné implementace,
- **T — Testování:** funkční nebo bezpečnostní test,
- **C — Certifikát:** využití existujícího certifikátu po dependency analysis podle přílohy IX.

Konkrétní kombinace není dána jen kategorií požadavku. Certifikační orgán ji určuje v hodnotícím plánu podle architektury, rizik, existujících důkazů a zbytkových činností.

## Funkční testování: FCAF nestačí samo o sobě

Příloha I doplňuje bezpečnostní evaluaci o explicitní funkční testing. CAB má primárně využívat evropský Functional Conformance Assessment Framework (FCAF), ale české schéma počítá s tím, že jeho pokrytí nemusí být úplné.

V době vzniku verze 1.2 schéma uvádí FCAF **0.0.10** a konstatuje, že neobsahuje testovací scénáře pro všechny funkční požadavky [[CIR]] (EU) 2024/2977, 2024/2979 a 2024/2982. Do zveřejnění úplných referenčních sad proto platí přechodný postup:

- CAB použije nejnovější FCAF dostupný ke dni zahájení hodnocení,
- chybějící scénáře odvodí přímo z příslušných prováděcích nařízení,
- použitou verzi FCAF, rozsah a pokrytí zdokumentuje v Certifikační zprávě.

Česká národní specifika musí funkční testování pokrýt také. Příloha I výslovně jmenuje **onboarding atestaci**, která má svázat uživatele prokazujícího svou totožnost s konkrétní wallet unit, do níž má být vydán [[PID]].

DIA a Komise definují funkční požadavky a testovací scénáře, nikoli nutně kompletní testovací infrastrukturu. **CAB odpovídá za zajištění testovacích nástrojů a za kvalitu testu.** Může použít i nástroje dodavatele řešení, pouze pokud má plný přístup k nástroji a jeho logům a sám odpovídá za dostatečnost testování.

## [[EUDIW]]-CZ přidává vlastní požadavky nad baseline ENISA

Příloha X má samostatnou kapitolu **X.1.4 Rozšíření nad rámec baseline ENISA**. Česká nadstavba není jen stylistická. Zahrnuje požadavky v následujících oblastech:

| Oblast | Příklady české nadstavby |
|---|---|
| řízení rizik | rozšířený registr rizik [[EUDIW]]-CZ a jeho zapracování do risk managementu |
| politiky | český jazyk, politika pro vzdálený [[WSCD]], assumptions uživatelského zařízení |
| provoz | oddělení rolí, privilegovaný přístup, vzdálený [[WSCD]], síťová a fyzická bezpečnost, kontinuita |
| ISMS procesy | bezpečný vývoj, řízení dodavatelů, zranitelností, incidentů a podvodů |
| wallet unit | specifika WSCA↔[[WSCD]] a instance↔WSCA |
| wallet provider | obnova, nezávislá autentizace uživatele, vzdálený [[WSCD]], aktualizace |
| [[PID]] provider | onboarding, autoritativní zdroj, pečetění [[PID]], revokace a anti-fraud |
| ověřovací služba | trust listy, registr [[RP]], dostupnost a oddělení rolí |
| provozní prostředí | infrastruktura, uživatelské zařízení, vzdálený [[WSCD]] |
| ochrana údajů | povinné oddělení dat, zákaz zbytečného sledování a kombinování údajů |

## Deset českých architekturních rizik CZ-01 až CZ-10

Vedle evropského registru rizik zavádí [[EUDIW]]-CZ vlastní sadu **CZ-01 až CZ-10**:

| ID | Riziko |
|---|---|
| CZ-01 | kompromitace centralizovaného [[WSCD]] |
| CZ-02 | výpadek konektivity mezi instancí peněženky a vzdáleným [[WSCD]] |
| CZ-03 | kompromitace prostředku elektronické identifikace během onboardingu |
| CZ-04 | kompromitace externí služby pečetění [[PID]] |
| CZ-05 | insider threat u poskytovatele peněženky a jeho subdodavatelů |
| CZ-06 | kaskádová kompromitace sdílené infrastruktury |
| CZ-07 | nedostatečné oddělení prostředí u subdodavatele vývoje systému poskytovatele [[PID]] |
| CZ-08 | ztráta nebo krádež uživatelského zařízení |
| CZ-09 | útok na registr [[RP]] |
| CZ-10 | kumulace rolí u jednoho subjektu ekosystému |

Tyto položky ukazují bezpečnostní priority českého profilu. Nejde jen o obecný požadavek úrovně „high“; schéma identifikuje konkrétní architektonické single points of failure, dodavatelská rizika a governance konflikty.

## Poskytovatel peněženky: certifikace zasahuje celý životní cyklus wallet unit

Příloha X definuje detailní povinnosti poskytovatele peněženky.

### Aktivace a průběžné monitorování

Poskytovatel musí podle příslušných kontrol například:

- před aktivací ověřit pravost instance peněženky pro danou platformu,
- provést eligibility kontroly zařízení včetně verze OS a integrity platformy,
- aktivovat wallet unit pouze při splnění požadované bezpečnostní úrovně WSCA/[[WSCD]],
- průběžně monitorovat bezpečnostní stav provozních instancí,
- detekovat kritické změny prostředí včetně root/jailbreak stavu,
- při kompromitaci wallet unit analyzovat dopad a případně ji revokovat včetně souvisejících [[WUA]].

### Uživatelský účet a obnova po ztrátě zařízení

České schéma jde velmi konkrétně do recovery modelu. WPS-05 požaduje, aby uživatel měl účet u poskytovatele peněženky a aby byly při aktivaci zaregistrovány autentizační metody **nezávislé na wallet unit a na uživatelském zařízení**.

Zřízení účtu má uživateli vysvětlit jeho účel, umožnit registraci pod aliasem a zabránit použití registrovaných dat pro jiné účely bez odpovídajícího právního základu nebo souhlasu podle konkrétní situace.

WPS-09 pak vyžaduje proces obnovy po ztrátě nebo krádeži zařízení. Ten zahrnuje zejména:

- nezávislou autentizaci uživatele,
- revokaci [[WUA]] ztracené wallet unit,
- zničení souvisejícího kryptografického materiálu,
- aktivaci nové wallet unit,
- podporu opětovného vydání [[PID]] a dalších atestací,
- auditní záznam recovery procesu.

### [[WUA]] a [[WIA]]

Pro [[WUA]] schéma požaduje politiku správy a vydávání. [[WUA]] nesmí obsahovat informace o uživateli a musí obsahovat identifikátor wallet unit použitelný pro revokaci bez identifikace osoby.

Pro [[WIA]] české schéma stanoví, že:

- její platnost musí být **kratší než 24 hodin**,
- před podpisem [[WIA]] musí poskytovatel ověřit integritu instance peněženky,
- vzhledem ke krátké platnosti není vyžadován samostatný revokační mechanismus [[WIA]].

### Aktualizační mechanismus

Proces distribuce a aktualizace musí být integrován do change a vulnerability managementu. Příloha X požaduje mimo jiné:

- code signing distribuovaných komponent,
- ochranu signing klíče instance peněženky na úrovni odpovídající „high“,
- ochranu signing klíče WSCA v HSM,
- pokud je to technicky možné, oddělení bezpečnostních oprav od funkčních aktualizací,
- možnost automatizované distribuce bezpečnostních aktualizací,
- možnost pozastavit wallet unit do instalace povinné bezpečnostní aktualizace,
- pro sdílenou WSCA v remote-[[WSCD]] profilu kontrolu kompatibility, rollback a informování klíčových subjektů.

## Povinnost zveřejnit zdrojový kód klientské části peněženky

Příloha III obsahuje jeden z nejvýraznějších praktických požadavků schématu:

> poskytovatel certifikované peněženky zveřejní **zdrojový kód aplikačních komponent peněženky, které běží na zařízení uživatele, jako součást programu s otevřeným zdrojovým kódem**.

Tím se opravuje běžná představa, že zdrojový kód je pouze neveřejným vstupem auditora. [[EUDIW]]-CZ rozlišuje dvě situace:

- detailní interní evidence a jiné citlivé materiály jsou chráněny pravidly důvěrnosti,
- zdrojový kód aplikačních komponent běžících na uživatelském zařízení má být veřejně dostupný jako open source.

Příloha III vedle toho vyžaduje zveřejnění:

- instalačních, konfiguračních a bezpečnostních pokynů,
- známých nebo předvídatelných okolností vytvářejících významná kybernetická rizika,
- postupů pro aktualizace a postupu pro deaktivaci automatických bezpečnostních aktualizací,
- postupu bezpečného vyřazení peněženky a odstranění uživatelských dat,
- seznamu komponent certifikovaného řešení včetně poskytovatelů a relevantních verzí,
- omezení použití,
- kontaktu pro hlášení zranitelností,
- odkazu na veřejně zveřejněné zranitelnosti,
- typu bezpečnostní podpory a data konce podpory.

Tyto informace mají být jasně a snadno dostupné **každému, kdo chce řešení peněženky používat**.

## Soukromí: české schéma certifikuje konkrétní anti-tracking vlastnosti

[[EUDIW]]-CZ obsahuje několik technicky konkrétních privacy požadavků.

### Oddělení údajů poskytovatele

DPR-01 požaduje logické oddělení osobních údajů souvisejících s poskytováním peněženky od ostatních dat poskytovatele.

DPR-02 omezuje sběr údajů o používání wallet unit na údaje nezbytné pro samotnou službu. Monitorování nemá zahrnovat informaci, **kdy, kde a vůči komu uživatel prezentoval [[PID]] nebo atestaci**.

DPR-03 omezuje kombinování osobních dat z wallet unit nebo údajů o jejím používání s daty z jiných služeb poskytovatele nebo třetích stran, pokud to není nezbytné, s výjimkami odpovídajícími požadavkům schématu a právnímu rámci.

### Ochrana proti korelaci

Příloha X rovněž požaduje například:

- pseudonymy odlišné pro různé [[RP]],
- privacy-preserving revokaci [[PID]] a atestací,
- aby prezentace atestace vůči [[RP]] nevyžadovala komunikaci s jejím vydavatelem způsobem umožňujícím sledování použití,
- mechanismy, které omezují korelaci přes status/revocation infrastrukturu.

Cílem je, aby poskytovatel peněženky, poskytovatel [[PID]], vydavatel atestace ani jednotlivé [[RP]] nemohli sestavit globální stopu používání peněženky.

## [[WSCD]] a WSCA: konkrétní assurance target

České schéma je výrazně konkrétní u kryptografických komponent.

### [[WSCD]]

Příloha X a kritéria přílohy IX pracují pro [[WSCD]] s minimálním cílem odpovídajícím:

- **EAL4**,
- vulnerability assessment **AVA_VAN.5**,

v rámci EUCC nebo Common Criteria, případně s ekvivalentní úrovní záruky podle použitelného evropského rámce.

U centralizovaného [[WSCD]] obsluhujícího více wallet units musí být prokázána multi-tenant izolace. Administrativní přístup nesmí prolomit izolaci uživatelských klíčů a kompromitace jedné logické instance nesmí ohrozit ostatní.

Centralizovaný [[WSCD]] musí mít rovněž odpovídající redundanci a disaster-recovery mechanismy.

### WSCA

WSCA musí být hodnocena metodologií Common Criteria/EUCC. U architektury se vzdáleným [[WSCD]] připouští [[EUDIW]]-CZ za kompenzačních podmínek minimálně **AVA_VAN.3**, zatímco **AVA_VAN.5 zůstává preferovaným cílem**.

Toto je příklad kompozitního principu: assurance level jednotlivé komponenty nelze vytrhnout z kontextu jejího provozního prostředí a vazeb na další komponenty.

## Poskytovatel [[PID]]: certifikace je širší než podpis credentialu

Příloha Ib přesně vymezuje dvě hlavní specifické komponenty certifikace Poskytování [[PID]] nad společným základem přílohy I:

1. **registraci a správu uživatelů s ověřením totožnosti**, a to vzdáleně i za fyzické přítomnosti,
2. **poskytování a správu [[PID]] po celý životní cyklus**.

Tato služba musí splnit relevantní požadavky pro systém elektronické identifikace s úrovní záruky „vysoká“. Příloha Ib zároveň upozorňuje, že poskytovatel [[PID]] odpovídá jen za část komponent prostředku elektronické identifikace; není tedy automaticky vlastníkem nebo provozovatelem všech externích eID prostředků použitých při identity proofingu.

Příloha X pak tuto oblast rozpracovává o konkrétní bezpečnostní požadavky na onboarding, issuance, anti-fraud, správu a revokaci [[PID]].

### Vydání [[PID]]

Před vydáním musí poskytovatel podle příslušných kontrol mimo jiné:

- ověřit identitu na úrovni záruky „vysoká“,
- ověřit, že wallet provider vyplývající z [[WIA]] je důvěryhodný,
- ověřit integritu a obsah [[WIA]],
- validovat vydávané identifikační údaje proti **autoritativnímu zdroji**; schéma jako příklad uvádí registr obyvatel,
- implementovat anti-fraud monitoring issuance procesu.

Pokud je pečetění [[PID]] zajištěno externím poskytovatelem, české schéma požaduje kvalifikovaného poskytovatele a kvalifikovanou elektronickou pečeť; poskytovatel [[PID]] ověřuje integritu pečeti před uvolněním credentialu.

### Český onboarding: tři cesty k úrovni „vysoká“

ONB-01 definuje tři základní způsoby ověření identity:

1. fyzickou přítomnost s kontrolou dokladů,
2. prostředek elektronické identifikace na úrovni „vysoká“,
3. **level-up prostředku na úrovni „značná“ na „vysoká“** doplňkovým ověřením podle prováděcího nařízení (EU) 2026/798 a ETSI TS 119 461.

Příloha X současně popisuje jako primární metodu českého architektonického profilu vzdálené automatizované ověření bez dohledu s dokladem totožnosti jako součást tohoto level-up procesu.

Pro vzdálené automatické snímání osoby schéma stanoví požadavek na hodnocení odolnosti proti biometric injection attack podle TS 18099 s přechodovým mechanismem, pokud příslušná akreditovaná laboratoř není dostupná.

ONB-04 navíc požaduje strukturovaný důkaz o identity proofingu, například se záznamem výsledku a času ověření, a jeho evidenci chráněnou důvěryhodným časovým údajem podle požadavků schématu.

### Revokace [[PID]]

U revokovatelného [[PID]] české schéma vyžaduje revokaci mimo jiné:

- na žádost uživatele,
- při revokaci wallet unit,
- při úmrtí osoby,
- pokud změna autoritativního zdroje způsobí, že [[PID]] již neodpovídá skutečnosti.

Poskytovatel [[PID]] zůstává odpovědnou stranou za revokaci i tehdy, když technické provedení deleguje.

PIDR-R06 navíc požaduje **křížovou kontrolu stavu revokace wallet unit nejméně jednou za 24 hodin**. Mechanismus musí být odolný vůči výpadkům, smluvně popsán a komunikace mezi poskytovateli musí být chráněna.

## Ověřování validity je přímo součástí certifikace poskytování peněženky

Příloha Ia odstraňuje zde jakoukoli nejasnost: dvě služby — **ověřování validity spoléhajících se stran** a **ověřování validity peněženek** — jsou explicitními komponentami certifikační oblasti Poskytování peněženky. Příloha I navíc ukládá všem wallet providerům jejich bezplatné poskytování.

Příloha X.9 pak pro tuto oblast stanoví detailní bezpečnostní požadavky. Požadavky kapitol X.2 až X.5 se vztahují minimálně na poskytovatele peněženky, poskytovatele [[PID]] a provozovatele ověřovací služby a samostatné požadavky VER pokrývají validační funkce.

Ověřovací služba poskytuje mechanismy pro:

1. ověření autenticity a platnosti wallet units,
2. ověření autenticity a platnosti identity registrovaných [[RP]].

Rozsah zahrnuje zejména:

- systém IKT ověřovací služby,
- její ISMS procesy,
- validaci wallet unit,
- validaci identity [[RP]],
- mechanismy identifikace a autentizace [[RP]].

### Registrace [[RP]] není totéž co validace [[RP]]

[[EUDIW]]-CZ výslovně odlišuje **registraci [[RP]]** od provozního ověřování registrované [[RP]]. Proces, kterým je [[RP]] přijata do registru, je rolí registrátora a není totožný s validačním mechanismem, který registry a certifikáty používá.

To je důležité organizačně i architektonicky: ověřovací služba registr konzumuje a musí chránit jeho integritu, ale samotný registration workflow je samostatná governance role.

### Bezpečnost registru a autentizace [[RP]]

České schéma pro tuto oblast požaduje mimo jiné:

- ověřit, zda je [[RP]] registrována a jaký rozsah údajů je oprávněna požadovat,
- poskytovat informace potřebné k ověření registrace a kategorie [[RP]],
- rychle promítat pozastavení, zrušení nebo změnu oprávnění,
- chránit publikovaná data kryptograficky,
- při významných změnách registru používat mechanismy oddělení oprávnění a kontroly,
- mít auditní stopu změn, zálohování, obnovu a řízení privilegovaných přístupů,
- nevydat přístupové oprávnění subjektu bez platné registrace,
- navrhnout službu bez kritického single point of failure,
- oddělit infrastrukturu od dalších služeb tam, kde kumulace rolí vytváří riziko.

České požadavky rovněž sledují, aby provozovatel validační služby nemohl snadno vytvářet sledovací stopu konkrétních wallet units a [[RP]].

## [[RP]]: co česká certifikace znamená pro banku, úřad nebo jiného verifiera

Běžná [[RP]] není sama o sobě tímto schématem certifikována jako wallet provider. [[EUDIW]]-CZ ale vytváří prostředí, ve kterém má být její identita a oprávnění před wallet unit ověřitelné.

Pro [[RP]] z toho prakticky plyne potřeba:

- platné registrace,
- správně vymezeného rozsahu požadovaných dat,
- vazby mezi registrací a technickými přístupovými prostředky,
- schopnosti pracovat s validačním mechanismem wallet unit,
- počítat s tím, že wallet ověřuje nejen technickou identitu, ale i registrační status a rozsah oprávnění.

Registrace [[RP]] je však samostatný governance proces a tento článek ji proto neprezentuje jako certifikaci podle [[EUDIW]]-CZ.

## Poskytovatelé [[EAA]] a [[QEAA]]

[[EUDIW]]-CZ nenahrazuje právní a certifikační režim vydavatelů [[EAA]] nebo [[QEAA]]. Kvalifikovaný status [[QTSP]] vzniká v režimu služeb vytvářejících důvěru, nikoli získáním wallet certifikátu.

Přesto mají vydavatelé atestací v certifikované architektuře důležité vazby:

- wallet unit musí umět jejich credentialy přijmout a prezentovat podle pravidel,
- privacy požadavky omezují možnost vydavatele sledovat jednotlivé prezentace credentialu vůči [[RP]],
- existující kvalifikované certifikace a audity mohou vstoupit do dependency analysis,
- komponenty a služby, na kterých wallet provider nebo [[PID]] provider závisí, podléhají supply-chain hodnocení.

## Dodavatelský řetězec: požadavky pokračují až k subdodavatelům

SUP-04 stanoví zásadní pravidlo: pokud poskytovatel služby EUDI využívá třetí strany, relevantní požadavky přílohy X se promítají i do těchto vztahů a činnosti třetích stran zůstávají v rozsahu certifikačního posouzení.

Nestačí tedy smluvně označit cloud, vývojáře nebo HSM provider za externího dodavatele. Držitel certifikátu musí dodat použitelnou assurance evidence.

### Povinný SBOM

SUP-05 požaduje strojově čitelný **Software Bill of Materials** pro komponenty řešení. Má zahrnovat:

- přímé závislosti,
- automatizovaně zjistitelné tranzitivní závislosti,
- jméno, původ nebo dodavatele, verzi a strojově použitelný identifikátor, například PURL nebo CPE.

Schéma jako běžné formáty uvádí SPDX a CycloneDX.

### Posouzení kritických dodavatelů

SUP-06 výslovně pracuje s kritickými dodavateli, například:

- poskytovateli infrastruktury hostující kritické komponenty včetně [[WSCD]],
- poskytovateli pečetění [[PID]],
- poskytovateli onboardingu,
- výrobci [[WSCD]]/HSM,
- dodavateli systému poskytovatele [[PID]],
- klíčovými subdodavateli těchto dodavatelů.

Pokud neexistuje přiměřená certifikační nebo auditní evidence, musí následovat samostatné hodnotící činnosti.

### Code escrow v EU

SUP-07 zavádí pro kritické komponenty vyvíjené externě smluvní mechanismus **úschovy zdrojového kódu u nezávislé třetí strany usazené v EU**.

Rozsah má zahrnout nejméně:

- úplný zdrojový kód,
- build instructions,
- SBOM,
- dokumentaci potřebnou k pokračování vývoje a údržby.

Požadavek se vztahuje minimálně na kritické komponenty identifikované schématem, mezi nimiž jsou instance peněženky, WSCA a systém poskytovatele [[PID]].

Release conditions zahrnují situace, jako je insolvence dodavatele, ukončení činnosti bez nástupce, závažné opakované neplnění maintenance/security povinností nebo rozhodnutí příslušného orgánu či soudu.

**Primárním příjemcem uvolněných artefaktů je vlastník schématu [[EUDIW]]-CZ**, tedy DIA, která může podle podmínek mechanismu artefakty využít nebo jejich využití umožnit subjektu určenému k pokračování provozu.

Escrow se má aktualizovat nejméně při major release a bezpečnostně významných aktualizacích a nejméně jednou ročně se má nezávisle ověřit jeho funkčnost včetně **testu sestavitelnosti**.

## Pět povinných ISMS procesů

Příloha X staví pět procesů jako významné procesní komponenty certifikované služby:

1. secure development,
2. change management,
3. vulnerability management,
4. incident management,
5. fraud management.

Nejde pouze o existenci politiky. Hodnotí se také jejich skutečná provozní účinnost a koordinace přes organizační hranice.

Fraud management je důležitý i při přebírání ISO/IEC 27001 evidence: příloha IX výslovně upozorňuje, že ISO/IEC 27001 tuto oblast explicitně nepokrývá a musí být doplněna samostatným posouzením.

## Co musí žadatel dodat už na začátku certifikace

Příloha IV požaduje při zahájení hodnocení nejméně:

| Oblast | Požadovaný obsah |
|---|---|
| veřejné informace | vše, co má být po certifikaci zveřejněno podle přílohy III |
| architektura | role komponent, interní a externí rozhraní, assumptions |
| certifikační plán | existující nebo plánované certifikace komponent, security targets, integrační dokumentace |
| risk assessment | jak bylo řešení navrženo, vyvinuto, vytvořeno, dodáno a udržováno; vazba na evropský registr rizik |
| exit plan | plán ukončení činnosti při odebrání nebo omezení certifikace |

Dependency model a certifikační strategie tedy nemohou vzniknout až na konci projektu. Jsou vstupem do hodnocení.

## Jaké existující certifikace lze využít

Příloha IX má vlastní katalog assurance zdrojů, které lze za definovaných podmínek použít, například:

- EUCC,
- Common Criteria / SOG-IS,
- EN 17640 / FitCEM včetně vybraných národních schémat,
- certifikaci QSCD přes podkladové Common Criteria hodnocení,
- ISO/IEC 27001:2022,
- SOC 2,
- ETSI EN 319 401.

Klíčové je, že **žádný z těchto důkazů automaticky nenahrazuje [[EUDIW]]-CZ evaluaci**.

Například ISO/IEC 27001 typicky prokazuje část obecných ISMS mechanismů, ale české schéma vyžaduje zbytkové posouzení EUDI-specifických procesů, fraud managementu, meziorganizační koordinace a provozní účinnosti konkrétních kontrol.

SOC 2 může být důkazem pro část infrastrukturních opatření, ale sám o sobě nepokrývá kryptografické požadavky, izolaci wallet units, vazby WSCA–[[WSCD]] ani evropské regulatorní požadavky.

## CAB: české požadavky jsou výrazně konkrétnější než obecná akreditace

Hlavní schéma požaduje akreditaci certifikačních orgánů podle:

- EN ISO/IEC 17065:2012,
- ETSI EN 319 403-1 V2.3.1,
- specifických požadavků přílohy VIII.

Příloha VIII jde podstatně dál.

### Požadavky na zkušenost

Pracovníci odpovědní za určení shody technických komponent mají mít odpovídající akademickou/odbornou kvalifikaci nebo zkušenost a nejméně:

- čtyři roky praxe související s vývojem softwaru,
- z toho nejméně dva roky v identity nebo jiných citlivých službách.

Každý člen hodnoticího týmu má mít prokazatelnou kvalifikaci v IT security; příloha jako minimální model uvádí vysokoškolské vzdělání v IT/kybernetické bezpečnosti nebo ekvivalentní profesní certifikaci a nejméně tři roky aktivní praxe v penetration testingu, bezpečnostních auditech nebo conformity assessment.

### Common Criteria a kompozitní evaluace

Nejméně jeden klíčový člen musí mít hlubokou znalost Common Criteria a CEM. Tým musí být schopen provádět dependency analysis a composite evaluation podle CCDB-2012-04-001 nebo ekvivalentního postupu.

### Minimální tým a oddělení rolí

Minimální velikost hodnoticího týmu pro jeden certifikační projekt jsou dvě osoby, přičemž kumulace role vedoucího a přezkoumatele je vyloučena. Příloha rozeznává vedoucího hodnotitele, technického hodnotitele/analytika a přezkoumatele; potřebná personální kapacita tak závisí na kombinaci rolí a kompetencí.

### Technické a mezioborové pokrytí

CAB musí mít kompetenci mimo jiné pro:

- asymetrickou kryptografii a PKI,
- správu klíčů,
- mobile security a secure hardware,
- hodnocení zranitelností na úrovni odpovídající LoA high / AVA_VAN.5,
- selective disclosure,
- přeshraniční interoperabilitu,
- consent mechanismy,
- vydávání [[PID]],
- kvalifikované podpisy a pečetě,
- offline scénáře.

Hodnoticí tým má být interdisciplinární a pokrývat penetration testing, hardware security, ochranu osobních údajů a shodu s technickými specifikacemi ENISA/ETSI.

Pokud CAB outsourcuje například penetration testing laboratoři, odpovědnost za finální certifikační rozhodnutí zůstává na CAB.

## Dvoufázové posouzení

Příloha VIII popisuje dvě fáze auditu.

### Fáze 1

Auditor studuje dokumentaci, architekturu, risk analysis, identifikované zranitelnosti a existující penetration-test reports. Zvláštní důraz se klade na odůvodnění odolnosti vůči útokům a na identifikaci míst, která musí být ověřena ve fázi 2.

### Fáze 2

Druhá fáze ověřuje:

- zda návrh a implementace odpovídají specifikacím,
- zda je skutečně dosažena požadovaná attack resistance,
- zda proběhlo odpovídající funkční testování,
- zneužitelnost identifikovaných zranitelností.

Součástí je vulnerability assessment.

## Certifikační životní cyklus: referenčně 4 roky, ale ne absolutní pevná délka

Zjednodušení „certifikát má čtyřletý cyklus“ není úplně přesné.

Hlavní schéma stanoví:

- dobu platnosti určuje certifikační orgán podle charakteru služby,
- standardní maximum je **4 roky**,
- s předchozím souhlasem DIA lze dobu výjimečně prodloužit až na **5 let**.

Příloha II definuje čtyři druhy následného hodnocení:

1. základní dozorové,
2. rozšířené dozorové,
3. recertifikační,
4. mimořádné.

Dozor se provádí **nejméně jednou ročně**. Každé dva roky musí proběhnout rozšířené dozorové nebo recertifikační hodnocení. Rozšířené hodnocení doplňuje základní dozor o vulnerability assessment.

U referenčního čtyřletého certifikátu vypadá cyklus:

| Rok | Hodnocení |
|---|---|
| 1 | základní dozor |
| 2 | rozšířený dozor + vulnerability assessment |
| 3 | základní dozor |
| 4 | recertifikace |

Recertifikační hodnocení se plánuje tak, aby proběhlo přibližně **dva měsíce před expirací** a bylo možné certifikát obnovit včas.

### První dozor je zvláštní

V prvním dozorovém hodnocení po vydání prvního certifikátu se má vyhodnotit **účinnost všech opatření**. Důvodem je, že peněženka musí být certifikována před ostrým provozem a provozní účinnost proto nelze plně ověřit při počáteční certifikaci.

## Významná událost: změna se neposuzuje jen jednou ročně

Příloha II zavádí rozlišení mezi významnými a ostatními událostmi.

**Významná událost** — významná neshoda, změna nebo zranitelnost — se oznamuje CAB bez čekání na další plánovaný dozor. CAB provede následnou kontrolu.

Za významné změny mají být považovány zejména:

- změny, které mohou vytvořit významnou neshodu,
- funkční změny s dopadem na bezpečnost nebo rozhraní,
- změny architektury,
- změny kritických komponent, například [[WSCD]] nebo WSCA.

Ostatní změny mohou být řešeny běžným interním procesem, jehož účinnost CAB každoročně hodnotí.

V praxi to znamená, že certification impact assessment má být součástí release a architecture governance.

## Pozastavení a odebrání certifikátu

Při neshodě může CAB certifikát pozastavit.

Hlavní schéma stanoví:

- standardní pozastavení na dobu odpovídající okolnostem, nejvýše **42 dní**,
- držitel musí informovat dotčené uživatele a informaci zveřejnit,
- v řádně odůvodněném případě může DIA povolit prodloužení,
- celková doba pozastavení nesmí přesáhnout **1 rok**.

Pokud certifikát není v souladu se schématem, může jej odebrat vydávající certifikační orgán nebo DIA. O odebrání se informuje Komise a evropská skupina pro spolupráci.

## Zranitelnosti: koordinované zveřejnění je součástí certifikace

Držitel certifikátu musí mít vulnerability-management proces a koordinovanou disclosure policy.

Pro zranitelnost s dopadem na certifikovaný scope musí zejména:

- vyhodnotit dopad,
- navrhnout a implementovat nápravu,
- je-li zpracována formální vulnerability impact analysis, předat CAB i návrh nápravných opatření,
- zveřejnit koordinovanou politiku hlášení zranitelností,
- po opravě zveřejnit veřejně známé a odstraněné zranitelnosti v evropské databázi zranitelností nebo v úložišti deklarovaném pro službu.

Tento proces je přímo propojen s dozorovým a change-management mechanismem certifikátu.

## Co bude veřejně vidět z certifikace

Příloha V vyžaduje, aby certifikát obsahoval například:

- jedinečný identifikátor,
- název a typ služby IKT,
- hodnocenou verzi,
- držitele certifikátu,
- odkaz na povinně zveřejněné informace,
- u služby zajišťující ověřování totožnosti metody ověřování identity,
- certifikační orgán a případné subdodavatele hodnocení,
- DIA jako vlastníka schématu,
- odkazy na právní základ,
- odkaz na Certifikační zprávu,
- odkaz na Zprávu o posouzení/hodnocení,
- verze použitých standardů,
- datum vydání a dobu platnosti.

Certifikát musí být v češtině a musí obsahovat anglický překlad.

## Certifikační zpráva a detailní hodnotící evidence

Příloha VI požaduje Certifikační zprávu založenou na Technické zprávě o hodnocení. Má být zveřejněna spolu s certifikátem a obsahovat praktické informace pro uživatele a zainteresované strany, například:

- přesný seznam a verze komponent,
- předem certifikované komponenty a odkazy na jejich assurance evidence,
- assumptions provozního prostředí,
- zvláštní konfigurační požadavky,
- popis architektury,
- bezpečnostní politiky,
- mapování kontrol na komponenty a rizika,
- shrnutí auditu a hodnotících činností,
- potvrzení dosažené úrovně záruky.

Příloha VII jde výrazně hlouběji do Zprávy o certifikačním posouzení/hodnocení. Ta má zachytit mimo jiné:

- všechny dodavatele a subdodavatele komponent v certifikovaném scope,
- zda a v jakém rozsahu prošli posouzením shody,
- konkrétní provedené metody, sampling a testy,
- interní dokumentaci zahrnutou do hodnocení,
- exit plan,
- incident-notification plan,
- informace o finančních zdrojích a případném pojištění odpovědnosti,
- seznam [[WSCD]] a jejich certifikací,
- další důvěryhodné kryptografické systémy a jejich certifikace,
- neshody a schválené corrective-action plány,
- termín dalšího dozoru a dalšího conformity assessment,
- časovou náročnost jednotlivých fází v osobo-dnech.

Tím vzniká velmi podrobná auditní stopa toho, **co přesně bylo ověřeno a na jakém důkazu certifikační rozhodnutí stojí**.

## DIA není pouze vlastník dokumentu

[[EUDIW]]-CZ dává DIA aktivní průběžnou governance roli.

DIA jako vlastník schématu monitoruje:

- plnění povinností CAB,
- plnění povinností držitelů,
- trvající shodu certifikovaných služeb,
- zda záruka vyjádřená certifikátem stále odpovídá vyvíjejícímu se threat landscape.

DIA může vybírat vzorky certifikovaných služeb k prověření a využívat informace od CAB, akreditačního orgánu, vlastní audity, šetření, stížnosti a odvolání.

Schéma zároveň stanoví, že DIA alespoň jednou ročně zváží změny právního, technického a bezpečnostního prostředí a při podstatných změnách NCS aktualizuje. Každá aktualizace má definovat přechodový harmonogram pro nová opatření a změny referenčních dokumentů.

## Kumulace rolí je v českém profilu explicitní riziko

Příloha X označuje jako CZ-10 situaci, kdy tentýž subjekt v ekosystému současně zastává více rolí.

Schéma proto vyžaduje odpovídající separation-of-duties a řízení střetu rolí:

- jasné vymezení odpovědností,
- oddělení personálu zejména u privilegovaných činností,
- podle rizika také oddělení informačních systémů a technické infrastruktury.

U validační oblasti jsou obdobné požadavky důležité zejména tam, kde tentýž subjekt provozuje více služeb ekosystému.

## Dopady na jednotlivé aktéry

| Aktér | Dopad [[EUDIW]]-CZ 1.2 |
|---|---|
| **DIA — vlastník schématu** | udržuje NCS, monitoruje CAB a certifikované služby, může požadovat dodatečné prověření, schvaluje výjimečné prodloužení platnosti a podle supply-chain pravidel vystupuje jako primární beneficiary vybraného code-escrow mechanismu |
| **DIA — orgán dohledu** | dostává certifikáty a hodnotící dokumentaci a informace o závažných problémech a zranitelnostech |
| **DIA — provozní role v ekosystému** | podle přílohy I zastřešuje dodávku a provoz certifikovaných i necertifikovaných komponent; certifikované komponenty DIA spadají do části Poskytování [[PID]], zatímco NIA, základní registry nebo další podpůrné systémy mohou zůstat mimo scope certifikace |
| **ČIA** | akredituje CAB podle EN ISO/IEC 17065, ETSI EN 319 403-1 a českých požadavků přílohy VIII |
| **CAB** | provádí nebo řídí audit, inspekci, testování, dependency analysis a certifikační rozhodnutí; musí mít specializovaný interdisciplinární tým |
| **Poskytovatel peněženky** | odpovídá za wallet lifecycle, aktivaci, [[WUA]]/[[WIA]], recovery, monitoring, privacy, updates a supply chain |
| **Poskytovatel [[PID]]** | odpovídá za high-assurance onboarding, autoritativní validaci, issuance, pečetění, revokaci a anti-fraud |
| **Ověřování validity wallet / [[RP]]** | příloha Ia jej výslovně řadí do certifikační oblasti Poskytování peněženky; příloha I požaduje, aby jej všichni wallet provideři poskytovali bezplatně |
| **Registrátor [[RP]]** | zajišťuje registrační proces; tento proces není totožný s provozní validací registrované [[RP]] |
| **[[RP]]** | musí mít ověřitelnou registraci a oprávnění; [[EUDIW]]-CZ však běžnou [[RP]] necertifikuje jako wallet providera |
| **Dodavatel [[WSCD]]/HSM** | musí dodat assurance odpovídající požadované vysoké úrovni a důkazy použitelné v dependency analysis |
| **Dodavatel WSCA** | podléhá požadavkům na Common Criteria/EUCC assurance podle zvoleného architektonického profilu |
| **Cloud/infrastrukturní dodavatel** | jeho činnosti mohou zůstat v certifikačním scope; musí dodat auditní/certifikační evidence nebo projít doplňkovým hodnocením |
| **Externí vývojář** | musí splnit secure-development a supply-chain požadavky; u kritických komponent se může uplatnit code escrow |
| **Poskytovatel onboardingu** | je kritickou závislostí a jeho bezpečnostní stav je předmětem assurance |
| **[[QTSP]] pečetící [[PID]]** | kvalifikovaná assurance může být znovu použita, ale integrace a použití pro [[PID]] se stále posuzuje |
| **Poskytovatel [[EAA]]/[[QEAA]]** | jeho vlastní trust-service režim NCS nenahrazuje; wallet musí současně splnit privacy a interoperabilní požadavky při práci s atestacemi |
| **Uživatel** | není certifikovaným subjektem; získává veřejné bezpečnostní informace, recovery/revocation mechanismy a ochranu před trackingem |

## Co by měl implementátor připravit před formální certifikací

Z [[EUDIW]]-CZ plyne praktický engineering baseline:

1. definovat hranice certifikačního scope a role všech organizací,
2. vytvořit architekturu s explicitními trust boundaries a assumptions,
3. zpracovat risk model zahrnující evropská rizika i CZ-01 až CZ-10,
4. vytvořit traceability mezi rizikem, kontrolou, komponentou, metodou evaluace a důkazem,
5. katalogizovat všechny existující certifikáty a assurance evidence a provést předběžnou dependency analysis,
6. zavést SBOM napříč přímými i relevantními tranzitivními závislostmi,
7. integrovat certification impact assessment do change managementu,
8. smluvně zajistit auditní evidence, vulnerability notifications a případný source-code escrow u kritických dodavatelů,
9. připravit veřejnou bezpečnostní dokumentaci a open-source klientský kód,
10. navrhnout roční surveillance evidence už během vývoje,
11. oddělit role a infrastruktury tam, kde tentýž subjekt kumuluje governance nebo provozní role,
12. připravit exit plan pro omezení nebo odebrání certifikace.

## Co je podle přílohy I přímo mimo scope

Příloha I výslovně vyjmenovává oblasti, které nejsou předmětem certifikace [[EUDIW]]-CZ:

- služby vytvářející důvěru, například vydávání kvalifikovaných certifikátů, kvalifikované podepisování nebo pečetění a vydávání kvalifikovaných atributů,
- služby elektronické identifikace atestované podle zákona č. 250/2017 Sb. pro úrovně „značná“ a „vysoká“,
- služby publikace seznamů kvalifikovaných služeb a důvěryhodných entit, například LoTL a [[LoTE]],
- ostatní spoléhající se strany.

To znamená, že certifikace [[EUDIW]]-CZ sama o sobě nenahrazuje registraci [[RP]], kvalifikovaný status [[QTSP]], režim [[QEAA]], atestaci externího eID systému ani obecné povinnosti podle GDPR nebo NIS2.

Tyto oblasti však nejsou pro assurance „neviditelné“. Pokud na nich certifikovaná služba závisí — například na NIA, základních registrech, externím eID, [[QTSP]], trust listech nebo cloudu — musí být jejich bezpečnostní assumptions a vazby odpovídajícím způsobem pokryty dependency analysis a provozními kontrolami.

## Co je oproti obecnému evropskému rámci specificky české

Za nejvýznamnější české konkretizace [[EUDIW]]-CZ 1.2 lze považovat:

- definovaný kompozitní model služeb a komponent,
- konkrétní architektonický profil včetně remote-[[WSCD]] scénářů,
- vlastní registr CZ-01 až CZ-10,
- české nadstavbové požadavky nad ENISA baseline,
- explicitní assurance target pro [[WSCD]] a WSCA,
- detailně popsané varianty high-assurance onboardingu,
- specifické požadavky na ochranu proti biometric injection attack,
- velmi detailní validační mechanismy pro wallets a [[RP]],
- povinný SBOM,
- code escrow kritických externě vyvíjených komponent v EU,
- povinnost zveřejnit klientský zdrojový kód jako open source,
- přesné kvalifikační požadavky na CAB,
- detailní surveillance a significant-event proces,
- konkrétní anti-tracking a privacy mechanismy,
- explicitní řešení kumulace rolí v českém governance modelu.

To jsou požadavky, které nelze bezpečně odvodit jen z obecného nařízení 2024/2981; vyplývají přímo z českého schématu a jeho příloh.

## Stav a verzování schématu

Zveřejněný dokument je označen jako **[[EUDIW]]-CZ verze 1.2**. Hlavní schéma samo počítá s průběžnou údržbou: DIA sleduje změny legislativy, threat landscape, technických standardů, certifikačních schémat a relevantní národní legislativy.

Každá aktualizace má stanovit přechodový harmonogram tak, aby bylo možné řídit:

```text
verze EUDIW-CZ
  + verze referenčních standardů
  + certifikované komponenty a jejich verze
  + architektonické assumptions
  + verze konkrétní služby IKT
= konkrétní certifikační baseline
```

Pro certifikovaného provozovatele proto nestačí „získat certifikát“. Musí dlouhodobě řídit vztah mezi verzí produktu, verzí komponentních certifikátů, provozním prostředím a aktuální verzí [[EUDIW]]-CZ.

## Primární zdroje

- [DIA — Národní certifikační schéma [[EUDIW]]](https://www.dia.gov.cz/cs/legislativa/eidas-sluzby-vytvarejici-duveru-a-elektronicka-identifikace/informace-pro-odborniky/narodni-certifikacni-schema-eudiw)
- **[[EUDIW]]-CZ, verze 1.2 — České národní certifikační schéma evropské peněženky digitální identity**
- **Příloha I — Rozsah certifikace**
- **Příloha Ia — Rozsah certifikace: Poskytování peněženky**
- **Příloha Ib — Rozsah certifikace: Poskytování [[PID]]**
- **Příloha Ic — Rozsah certifikace: Zastřešující certifikát**
- **Příloha II — Kontinuita opatření a životní cyklus certifikace**
- **Příloha III — Seznam veřejně dostupných informací**
- **Příloha IV — Seznam informací požadovaných k žádosti o certifikaci**
- **Příloha V — Obsah certifikátu**
- **Příloha VI — Obsah Certifikační zprávy**
- **Příloha VII — Obsah Zprávy o certifikačním posouzení/hodnocení**
- **Příloha VIII — Požadavky na orgány posuzování shody**
- **Příloha IX — Kritéria pro posouzení přijatelnosti informací o záruce**
- **Příloha X — Bezpečnostní požadavky na peněženky EUDI a systémy eID, v rámci kterých jsou poskytovány**
- [Prováděcí nařízení Komise (EU) 2024/2981](https://eur-lex.europa.eu/eli/reg_impl/2024/2981/oj)
- [Nařízení (EU) 2024/1183](https://eur-lex.europa.eu/eli/reg/2024/1183/oj)

---

*Stav rozboru: 1. října 2026. Text je založen na hlavním dokumentu [[EUDIW]]-CZ 1.2 a přílohách I, Ia, Ib, Ic a II–X. Uváděné hranice certifikačních oblastí, komponenty wallet a [[PID]] služeb a význam zastřešujícího certifikátu proto vycházejí přímo z českého schématu.*
