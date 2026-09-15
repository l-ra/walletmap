---
title: "Základní srovnání EAA a QEAA — kvalifikovaní a nekvalifikovaní vydavatelé"
description: "Jak se liší režim běžného a kvalifikovaného vydavatele elektronických potvrzení atributů podle eIDAS: povinnosti TSP a QTSP, posuzování shody, ověření identity a atributů, autentické zdroje, právní účinky a společná technická vrstva EUDI Wallet."
pubDate: 2026-09-15
tags: [eidas, eudiw, eaa, qeaa, pub-eaa, legislativa, tsp, qtsp]
draft: false
---

Elektronická potvrzení atributů představují jednu ze základních součástí ekosystému [[EUDIW|Evropské peněženky digitální identity]]. Umožňují elektronicky prokazovat konkrétní informace nebo vlastnosti vztahující se k fyzické nebo právnické osobě – například věk, adresu, státní občanství, dosažené vzdělání, profesní kvalifikaci, oprávnění zastupovat určitou organizaci nebo existenci konkrétního povolení.

Evropský rámec digitální identity přitom rozlišuje několik kategorií elektronických potvrzení atributů a jejich vydavatelů. Základní rozdíl existuje mezi:

* [[EAA|elektronickým potvrzením atributů]] vydávaným poskytovatelem služby vytvářející důvěru,
* [[QEAA|kvalifikovaným elektronickým potvrzením atributů]] vydávaným kvalifikovaným poskytovatelem služby vytvářející důvěru,
* a zvláštní kategorií [[PuB-EAA|potvrzení vydávaných orgánem veřejného sektoru odpovědným za autentický zdroj nebo jeho jménem]].

Tento článek se zaměřuje především na první dvě kategorie a vysvětluje, jak se liší požadavky kladené na běžného a kvalifikovaného vydavatele.

Základním právním předpisem je nařízení [[eIDAS]] – nařízení (EU) č. 910/2014, zásadně novelizované nařízením (EU) 2024/1183, kterým byl vytvořen evropský rámec digitální identity.

[Nařízení (EU) 2024/1183 – evropský rámec digitální identity na EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/1183/oj)

## Vydávání elektronických potvrzení atributů je službou vytvářející důvěru

Prvním důležitým principem je, že vydávání elektronických potvrzení atributů není z pohledu [[eIDAS]] pouze technickou činností spočívající ve vytvoření digitálního credentialu.

[[eIDAS]] jej řadí mezi služby vytvářející důvěru – trust services.

To znamená, že také subjekt, který vydává běžné, tedy nekvalifikované [[EAA]], vystupuje v tomto rozsahu jako [[TSP|poskytovatel služby vytvářející důvěru]].

Nekvalifikovaný vydavatel tedy nestojí mimo regulatorní rámec [[eIDAS]]. Rozdíl mezi kvalifikovaným a nekvalifikovaným vydavatelem spočívá zejména v rozsahu povinností, způsobu dohledu, požadované úrovni ověření a právních účincích vydávaných potvrzení.

Zjednodušeně lze oba režimy popsat následovně:

**Nekvalifikovaný vydavatel [[EAA]]**

[[TSP]] → obecné požadavky [[eIDAS]] → bezpečnost a řízení rizik → pravidla pro konkrétní [[EAA]] → pravidla interoperability s [[EUDIW]]

**Kvalifikovaný vydavatel [[QEAA]]**

[[TSP]] → [[QTSP]] → posouzení shody → kvalifikovaný status → pravidelný dohled a audity → přísnější ověření identity a atributů → specifické požadavky na [[QEAA]] → pravidla interoperability s [[EUDIW]]

Kvalifikovaný vydavatel tedy podléhá základním povinnostem [[TSP]] stejně jako nekvalifikovaný vydavatel, ale nad nimi existuje další regulatorní vrstva vztahující se na [[QTSP|kvalifikované poskytovatele služeb vytvářejících důvěru]].

## Nekvalifikovaný neznamená neregulovaný

Pojem „nekvalifikovaný“ může vyvolávat dojem, že vydavatel nepodléhá zvláštním regulatorním požadavkům. Takový výklad by ale nebyl správný.

Evropský rámec stanovuje povinnosti také poskytovatelům nekvalifikovaných služeb vytvářejících důvěru. Významnou oblastí je zejména řízení rizik.

Článek 19a [[eIDAS]] stanoví požadavky na řízení právních, podnikatelských, provozních a dalších rizik spojených s poskytováním nekvalifikovaných služeb vytvářejících důvěru.

Tyto povinnosti byly dále konkretizovány prováděcím nařízením Komise (EU) 2025/2160.

[Prováděcí nařízení (EU) 2025/2160 – řízení rizik nekvalifikovaných služeb vytvářejících důvěru](https://eur-lex.europa.eu/eli/reg_impl/2025/2160/oj)

Nekvalifikovaný poskytovatel musí mít mimo jiné zdokumentovanou politiku řízení rizik schválenou vedením organizace. Musí identifikovat a vyhodnocovat rizika, sledovat rizika spojená s třetími stranami, identifikovat případná kritická místa infrastruktury a zavést plán opatření pro ošetření identifikovaných rizik.

Vyhodnocení rizik a plán jejich ošetření musí být pravidelně přezkoumávány a nejméně jednou ročně aktualizovány, případně také při významných změnách infrastruktury, provozu nebo rizikového prostředí či po významném incidentu.

Prováděcí nařízení současně odkazuje na vybrané části technického standardu ETSI EN 319 401 V3.1.1, který upravuje obecné požadavky na poskytovatele služeb vytvářejících důvěru.

Pro presumpci souladu se u nekvalifikovaných služeb používají například části týkající se:

* hodnocení rizik,
* politik a provozních pravidel,
* interní organizace,
* lidských zdrojů,
* správy aktiv,
* řízení přístupu,
* fyzické a environmentální bezpečnosti.

Rozdíl mezi kvalifikovaným a nekvalifikovaným vydavatelem proto nelze jednoduše popsat jako „ETSI versus bez ETSI“. Technické a organizační standardy se uplatňují v obou případech, ale v rozdílném rozsahu a v rozdílném režimu posuzování shody.

## Kvalifikovaný vydavatel musí nejprve získat kvalifikovaný status

Zásadní rozdíl nastává v okamžiku, kdy chce poskytovatel vydávat kvalifikovaná elektronická potvrzení atributů – [[QEAA]].

Takovou službu může poskytovat pouze Qualified Trust Service Provider a pouze poté, co byl kvalifikovaný status přiznán jak poskytovateli, tak příslušné kvalifikované službě.

Před zahájením poskytování kvalifikované služby musí poskytovatel projít posouzením shody – conformity assessment – prostřednictvím akreditovaného subjektu posuzování shody.

Následně oznamuje příslušnému dozorovému orgánu svůj záměr zahájit poskytování kvalifikované služby a předkládá mu příslušný conformity assessment report. Dozorový orgán ověřuje, zda poskytovatel i služba splňují požadavky [[eIDAS]] a související požadavky kybernetické bezpečnosti.

Podrobnější proces stanoví prováděcí nařízení Komise (EU) 2025/1572, které se od 19. srpna 2026 používá pro oznámení záměru zahájit poskytování kvalifikované služby a pro jeho ověření dozorovým orgánem.

[Prováděcí nařízení (EU) 2025/1572 – zahájení kvalifikovaných služeb vytvářejících důvěru](https://eur-lex.europa.eu/eli/reg_impl/2025/1572/oj)

Součástí oznámení jsou například informace o poskytovateli a službě, conformity assessment report, informace potřebné pro zápis služby do trusted listu, analýzy rizik a plán ukončení služby.

Kvalifikovaný status tedy není označení, které by si poskytovatel mohl přidělit sám. Vzniká až na základě formálního regulatorního procesu.

## Posuzování shody a pravidelné audity

Získáním kvalifikovaného statusu regulatorní proces nekončí.

Kvalifikovaní poskytovatelé musí být podle článku 20 [[eIDAS]] auditováni na vlastní náklady nejméně jednou za 24 měsíců. Audit provádí subjekt posuzování shody a jeho cílem je ověřit, zda [[QTSP]] a jím poskytované kvalifikované služby nadále splňují požadavky [[eIDAS]] a příslušné požadavky NIS2. Výsledný conformity assessment report musí být předán dozorovému orgánu.

Dozorový orgán může provést nebo vyžádat také další posouzení mimo pravidelný cyklus.

Pravidla pro akreditaci subjektů posuzování shody, strukturu conformity assessment reportů a samotná schémata posuzování shody dále upravuje prováděcí nařízení Komise (EU) 2025/2162.

[Prováděcí nařízení (EU) 2025/2162 – posuzování shody [[QTSP]]](https://eur-lex.europa.eu/eli/reg_impl/2025/2162/oj)

Prováděcí nařízení stanoví mimo jiné požadavky na conformity assessment schemes a požaduje, aby u každé hodnocené kvalifikované služby probíhalo nejméně jedno surveillance conformity assessment ročně v rámci příslušného schématu.

Pro vydavatele [[QEAA]] tak není důležitý pouze stav systému v okamžiku získání kvalifikovaného statusu, ale také průběžná schopnost jeho shodu prokazovat.

## Organizační požadavky na kvalifikovaného poskytovatele

[[eIDAS]] ukládá [[QTSP]] řadu dalších požadavků týkajících se fungování organizace.

Kvalifikovaný poskytovatel musí například využívat zaměstnance a případné subdodavatele s odpovídající odborností, zkušenostmi a kvalifikací, používat důvěryhodné systémy a produkty, chránit používané systémy proti neoprávněným změnám a zabezpečit ukládaná data tak, aby byla zachována jejich autenticita a aby je mohly měnit pouze oprávněné osoby.

Součástí požadavků je také odpovídající finanční zajištění rizika odpovědnosti. [[QTSP]] má podle použitelného národního práva disponovat dostatečnými finančními zdroji nebo odpovídajícím pojištěním odpovědnosti.

Kvalifikovaný poskytovatel musí rovněž informovat dozorový orgán o relevantních změnách poskytované kvalifikované služby a o záměru její poskytování ukončit.

Tyto požadavky vytvářejí podstatně širší compliance rámec, než jaký se uplatňuje pouze na základě obecného režimu nekvalifikované služby.

## Ověření identity před vydáním [[QEAA]]

Jednou z nejdůležitějších oblastí, ve kterých se oba režimy liší, je ověření identity subjektu před vydáním potvrzení.

Článek 24 [[eIDAS]] vyžaduje, aby [[QTSP]] při vydávání kvalifikovaného elektronického potvrzení atributů ověřil identitu fyzické nebo právnické osoby, které má být potvrzení vydáno, a případně také její specifické atributy.

Podrobnější technické požadavky byly stanoveny prováděcím nařízením Komise (EU) 2025/1566.

[Prováděcí nařízení (EU) 2025/1566 – ověřování identity a atributů pro QEAA](https://eur-lex.europa.eu/eli/reg_impl/2025/1566/oj)

Nařízení jako referenční standard používá ETSI TS 119 461 V2.1.1, s konkrétními úpravami pro případy vydávání kvalifikovaných certifikátů a kvalifikovaných elektronických potvrzení atributů.

Cílem je zajistit, aby identita osoby, které je [[QEAA]] vydáváno, nebyla ověřena pouze na základě libovolného registračního procesu vydavatele, ale prostřednictvím mechanismu odpovídajícího požadované vysoké úrovni důvěry.

U nekvalifikovaného [[EAA]] se stejný kvalifikovaný identity-proofing režim automaticky neuplatní. Ani zde však neplatí, že by ověření identity bylo bez pravidel. Prováděcí nařízení 2025/2160 například stanoví, že nekvalifikovaný [[TSP]] má tam, kde je to relevantní, ověřovat identitu uživatelů přímo nebo prostřednictvím třetí strany a zveřejňovat informace o používaných metodách ověření identity.

## Ověření samotných atributů

Vedle identity osoby je nutné řešit druhou otázku: odkud pochází informace, kterou vydavatel potvrzuje.

Pokud například credential potvrzuje dosažené vzdělání, profesní kvalifikaci nebo věk, důvěryhodnost credentialu závisí nejen na tom, zda je správně identifikován jeho držitel, ale také na tom, zda má vydavatel spolehlivý podklad pro samotný atribut.

U [[QEAA]] jsou požadavky na ověřování atributů součástí kvalifikovaného režimu podle článku 24 [[eIDAS]] a navazujících prováděcích pravidel.

Významnou roli přitom mohou hrát tzv. autentické zdroje – authentic sources.

## Přístup kvalifikovaných vydavatelů k autentickým zdrojům

Článek 45e [[eIDAS]] zavádí mechanismus, který umožňuje kvalifikovaným poskytovatelům vydávajícím [[QEAA]] ověřovat vybrané atributy elektronickou cestou proti autentickým zdrojům veřejného sektoru, pokud jsou příslušné informace v takových zdrojích vedeny.

Nařízení se zde zaměřuje především na atributy uvedené v příloze VI [[eIDAS]].

Může jít například o údaje týkající se:

* adresy,
* věku,
* státního občanství,
* vzdělání,
* titulů a licencí,
* profesní kvalifikace,
* veřejných povolení,
* oprávnění zastupovat fyzickou nebo právnickou osobu,
* některých údajů vztahujících se k právnickým osobám.

Smyslem tohoto mechanismu je umožnit vydavateli [[QEAA]] založit vydání potvrzení na informaci pocházející z autoritativního zdroje, nikoli pouze na tvrzení žadatele.

Samotný mechanismus vydávání [[QEAA]] a ověřování atributů proti autentickým zdrojům dále konkretizuje prováděcí nařízení Komise (EU) 2025/1569.

[Prováděcí nařízení (EU) 2025/1569 – QEAA, autentické zdroje a schémata atributů](https://eur-lex.europa.eu/eli/reg_impl/2025/1569/oj)

U běžného nekvalifikovaného [[EAA]] není obdobný přístup k autentickým zdrojům automaticky garantovaným právem vydavatele. Zdroj atributu a způsob jeho ověření proto závisí na konkrétním modelu služby, použitém schématu a právním základu pro přístup k příslušným údajům.

## Specifické požadavky na vydávání [[QEAA]]

Prováděcí nařízení 2025/1569 stanoví rovněž technické požadavky na samotné vydávání kvalifikovaných elektronických potvrzení atributů.

Vydavatel má například podle okolností:

* ověřit, zda osoba požadující vydání potvrzení může jednat za subjekt, ke kterému se atribut vztahuje,
* ověřit identitu autentického zdroje, pokud je používán,
* zpracovávat pouze minimální množství atributů nezbytných pro vydání a správu potvrzení.

Pokud je potvrzení vydáváno do [[EUDIW]], musí poskytovatel také autentizovat příslušnou wallet unit a ověřit, že tato wallet unit nebyla zneplatněna nebo pozastavena.

## Povinný obsah kvalifikovaného elektronického potvrzení atributů

Dalším zásadním rozdílem je samotný obsah vydaného credentialu.

Požadavky na [[QEAA]] jsou stanoveny přímo v příloze V [[eIDAS]].

Kvalifikované elektronické potvrzení atributů musí obsahovat mimo jiné:

* informaci, že jde o kvalifikované elektronické potvrzení atributů,
* jednoznačnou identifikaci [[QTSP]], který potvrzení vydal,
* členský stát, ve kterém je [[QTSP]] usazen,
* údaje jednoznačně identifikující subjekt, ke kterému se potvrzovaný atribut vztahuje,
* samotný atribut nebo atributy a případně informace o jejich rozsahu,
* počátek a konec doby platnosti,
* unikátní identifikátor potvrzení,
* případnou informaci o schématu potvrzení atributů,
* kvalifikovaný elektronický podpis nebo kvalifikovanou elektronickou pečeť vydávajícího [[QTSP]],
* informace umožňující získat příslušný certifikát,
* informace nebo odkaz na službu umožňující zjistit aktuální stav platnosti potvrzení.

U běžného [[EAA]] obdobný univerzální seznam povinných položek v příloze V [[eIDAS]] neexistuje.

To ale neznamená, že může mít při použití v [[EUDIW]] libovolnou strukturu. Další požadavky mohou vyplývat z pravidel interoperability, konkrétního formátu credentialu a příslušného schématu atributů.

## Společná technická vrstva [[EUDIW]]

Z pohledu [[EUDIW]] je důležité oddělit dvě otázky:

1. jakou úroveň důvěry a jaký regulatorní status má credential, a
2. jakým technickým způsobem je credential vydán do peněženky a následně prezentován.

Pokud jsou elektronická potvrzení atributů vydávána do [[EUDIW]], vstupují do hry společná pravidla evropského interoperabilního rámce.

Základním předpisem je zde prováděcí nařízení Komise (EU) 2024/2977, které upravuje identifikační údaje osoby a elektronická potvrzení atributů vydávaná do evropských peněženek digitální identity. Toto nařízení bylo následně aktualizováno a k září 2026 je dostupné v konsolidovaném znění.

[Prováděcí nařízení (EU) 2024/2977 – EAA vydávaná do EUDI Wallet](https://eur-lex.europa.eu/eli/reg_impl/2024/2977/oj)

Technické požadavky se vztahují například k podporovaným formátům, autentizaci zúčastněných subjektů a způsobu, jakým peněženka ověřuje původ a integritu credentialu.

Proto není přesné chápat rozdíl mezi kvalifikovaným a nekvalifikovaným [[EAA]] jako rozdíl mezi „standardizovaným“ a „nestandardizovaným“ credentialem.

Oba druhy mohou využívat společnou technickou infrastrukturu [[EUDIW]].

Hlavní rozdíl spočívá v tom, jakým způsobem byla důvěryhodnost informace vytvořena a jaké regulatorní záruky stojí za vydavatelem a procesem vydání.

## Životní cyklus potvrzení a informace o jeho platnosti

Elektronický credential není pouze statický dokument.

Po jeho vydání může dojít například ke změně skutečnosti, kterou potvrzuje, ke ztrátě příslušného oprávnění, ke kompromitaci prostředků vydavatele nebo k jiné okolnosti, kvůli které již nemá být credential považován za platný.

Proto evropský rámec pracuje také s mechanismy pro ověřování aktuálního statusu potvrzení, jeho revokaci nebo další řízení životního cyklu.

U [[QEAA]] je informace nebo umístění služby, prostřednictvím které lze zjistit aktuální validity status potvrzení, přímo jedním z povinných údajů stanovených přílohou V [[eIDAS]].

Konkrétní schéma atributů může definovat další pravidla pro revokaci a správu životního cyklu. Prováděcí nařízení 2025/1569 například počítá s tím, že schéma pro potvrzení atributů obsahuje popis modelu důvěry, governance a mechanismů revokace.

## Právní účinky běžného [[EAA]]

[[eIDAS]] poskytuje právní ochranu také běžnému elektronickému potvrzení atributů.

Podle článku 45b nesmí být elektronickému potvrzení atributů odepřen právní účinek nebo přípustnost jako důkazu v soudním řízení pouze z toho důvodu, že:

* má elektronickou formu, nebo
* nesplňuje požadavky na kvalifikované elektronické potvrzení atributů.

To je důležitý princip technologické neutrality.

Nekvalifikované [[EAA]] tedy není z právního hlediska „bez hodnoty“. Nemá však automaticky stejné zvláštní právní účinky, které [[eIDAS]] přiznává kvalifikovanému potvrzení.

## Silnější právní účinek [[QEAA]]

U kvalifikovaného elektronického potvrzení atributů stanoví článek 45b odst. 2 [[eIDAS]], že má stejný právní účinek jako zákonně vydané potvrzení v listinné podobě.

Právě tento účinek představuje jeden z hlavních rozdílů mezi [[EAA]] a [[QEAA]].

Kvalifikované potvrzení navíc těží z celoevropského regulatorního rámce pro kvalifikované služby vytvářející důvěru. [[eIDAS]] stanoví, že kvalifikované elektronické potvrzení atributů vydané v jednom členském státě musí být jako kvalifikované potvrzení uznáno také v ostatních členských státech.

Kvalifikovaný status tak poskytuje především vyšší míru právní a regulatorní jistoty při přeshraničním použití.

## Rozdílný režim odpovědnosti

Významný rozdíl existuje také v oblasti odpovědnosti za škodu.

Článek 13 [[eIDAS]] stanoví, že poskytovatelé služeb vytvářejících důvěru odpovídají za škodu způsobenou úmyslným nebo nedbalostním porušením povinností podle [[eIDAS]].

Rozdílně je ale nastaveno důkazní břemeno.

U nekvalifikovaného [[TSP]] musí úmysl nebo nedbalost poskytovatele prokázat osoba, která náhradu škody požaduje.

U kvalifikovaného [[QTSP]] se naopak úmysl nebo nedbalost presumují. [[QTSP]] musí v případě sporu prokázat, že škoda nevznikla v důsledku jeho úmyslného nebo nedbalostního jednání.

Vyšší úroveň důvěry spojená s kvalifikovaným statusem je tak doprovázena také přísnějším režimem odpovědnosti poskytovatele.

## Hlavní rozdíly v přehledu

| Oblast                                           | Nekvalifikovaný vydavatel [[EAA]]                             | Kvalifikovaný vydavatel [[QEAA]]                            |
| ------------------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------- |
| Postavení podle [[eIDAS]]                        | Poskytovatel služby vytvářející důvěru – [[TSP]]                  | Kvalifikovaný poskytovatel služby vytvářející důvěru – [[QTSP]] |
| Nutnost získat kvalifikovaný status              | Ne                                                            | Ano                                                         |
| Posouzení shody před zahájením služby            | Není podmínkou poskytování nekvalifikované služby jako takové | Ano                                                         |
| Zápis kvalifikované služby do Trusted List       | Ne                                                            | Ano                                                         |
| Pravidelný audit podle čl. 20 [[eIDAS]]          | Ne v režimu určeném [[QTSP]]                                      | Ano, nejméně každých 24 měsíců                              |
| Průběžné conformity assessment                   | Omezenější režim                                              | Ano, podle pravidel conformity assessment scheme            |
| Řízení rizik                                     | Ano                                                           | Ano, jako součást širšího režimu [[QTSP]]                       |
| ETSI EN 319 401                                  | Vybrané části prostřednictvím IR 2025/2160                    | Součást širšího frameworku posuzování kvalifikované služby  |
| Ověření identity uživatele                       | Podle charakteru služby a risk-based požadavků                | Zvláštní požadavky čl. 24 a IR 2025/1566                    |
| Ověření atributů                                 | Podle charakteru služby, schématu a zdroje dat                | Regulovaný proces s vysokou mírou důvěry                    |
| Ověření proti autentickému zdroji                | Bez obecného nároku vyplývajícího z čl. 45e                   | [[eIDAS]] vytváří zvláštní mechanismus pro relevantní atributy |
| Povinný obsah credentialu podle přílohy V        | Ne                                                            | Ano                                                         |
| Kvalifikovaný podpis nebo pečeť vydavatele       | Není obecnou podmínkou [[EAA]]                                | Ano                                                         |
| Informace o validity statusu podle přílohy V     | Není obecnou podmínkou každého [[EAA]]                        | Ano                                                         |
| Použití v [[EUDIW]]                              | Ano, při splnění příslušných interoperabilních pravidel       | Ano                                                         |
| Standardizované wallet formáty                   | Podle pravidel [[EUDIW]]                                      | Podle pravidel [[EUDIW]] a specifických pravidel [[QEAA]]   |
| Právní ochrana elektronické formy                | Ano                                                           | Ano                                                         |
| Právní účinek odpovídající listinnému potvrzení  | Ne automaticky                                                | Ano                                                         |
| Přeshraniční qualified recognition               | Ne jako qualified credential                                  | Ano                                                         |
| Odpovědnost                                      | Poškozený prokazuje úmysl nebo nedbalost                      | Úmysl nebo nedbalost [[QTSP]] se presumuje                      |
| Finanční zajištění / pojištění podle režimu [[QTSP]] | Nejde o obecný ekvivalent povinnosti [[QTSP]]                     | Ano, podle národního práva                                  |
| Dohled                                           | Ano, v režimu [[TSP]]                                             | Rozšířený dohled nad [[QTSP]] a kvalifikovanou službou          |

## Rozdíl není především ve formátu credentialu

Z pohledu uživatele mohou běžné [[EAA]] a [[QEAA]] v [[EUDIW]] vypadat velmi podobně.

Oba mohou být uloženy v peněžence, oba mohou obsahovat strukturované atributy a oba mohou být prezentovány poskytovateli služby prostřednictvím standardizovaných mechanismů [[EUDIW]].

Zásadní rozdíl se skrývá především za credentialem.

U kvalifikovaného potvrzení existuje regulatorně kontrolovaný řetězec důvěry zahrnující:

ověření vydavatele → kvalifikovaný status → audit → ověření identity → ověření atributu → vydání → kryptografickou ochranu → správu životního cyklu → dohled

U nekvalifikovaného [[EAA]] existuje rovněž regulatorní a technický rámec, ale úroveň a způsob zajištění jednotlivých kroků mohou být flexibilnější a více závislé na konkrétním případu použití a rizikovém profilu služby.

## Kdy je kvalifikovaný režim důležitý

Kvalifikované elektronické potvrzení atributů je určeno především pro případy, ve kterých je důležitá vysoká úroveň právní a technické jistoty.

Může jít například o situace, ve kterých je nutné spolehlivě prokázat právně významnou vlastnost, kvalifikaci, oprávnění nebo jinou skutečnost a současně zajistit důvěryhodné přeshraniční použití.

Nekvalifikovaná [[EAA]] mohou pokrývat širší spektrum situací, ve kterých není takto silný regulatorní režim nezbytný.

Volba mezi [[EAA]] a [[QEAA]] proto není pouze technickou otázkou. Souvisí s:

* povahou potvrzovaného atributu,
* požadovanou mírou důvěry,
* právními účinky, které mají být s potvrzením spojeny,
* způsobem ověřování zdrojových údajů,
* rizikem konkrétního případu použití,
* a požadavkem na přeshraniční použití.

## Třetí kategorie: potvrzení vydávaná z autentických zdrojů veřejného sektoru

Vedle běžných [[EAA]] a [[QEAA]] existuje ještě třetí kategorie, kterou je vhodné od předchozích dvou odlišovat.

Článek 45f [[eIDAS]] upravuje [[PuB-EAA|elektronická potvrzení atributů vydávaná orgánem veřejného sektoru odpovědným za autentický zdroj nebo jeho jménem]]. Jde například o situaci, kdy je credential vydáván přímo na základě údajů spravovaných příslušným veřejným registrem.

Tato potvrzení mají vlastní regulatorní režim a nejsou jednoduše totožná ani s běžným nekvalifikovaným [[EAA]], ani s [[QEAA]] vydávaným komerčním [[QTSP]].

Zároveň jim [[eIDAS]] přiznává významné právní účinky. Podle článku 45b mají stejně jako [[QEAA]] stejný právní účinek jako zákonně vydaná potvrzení v listinné podobě. Potvrzení vydané veřejným subjektem odpovědným za autentický zdroj v jednom členském státě má být navíc jako takové uznáváno v ostatních členských státech.

Tato kategorie je proto důležitá zejména tam, kde stát zvolí model přímého vydávání credentialů z veřejných registrů namísto využití kvalifikovaného poskytovatele.

## Základní evropské předpisy

Pro oblast vydávání [[EAA]] a [[QEAA]] jsou z pohledu vydavatele nejdůležitější zejména následující předpisy:

**Nařízení (EU) č. 910/2014 – [[eIDAS]], ve znění evropského rámce digitální identity**
Základní právní rámec pro služby vytvářející důvěru, elektronická potvrzení atributů, [[QTSP]], právní účinky a dohled.
[Konsolidované eIDAS na EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02014R0910-20241018)

**Nařízení (EU) 2024/1183 – European Digital Identity Framework**
Novela [[eIDAS]], která zavedla [[EUDIW]] a nový rámec elektronických potvrzení atributů.
[Nařízení (EU) 2024/1183](https://eur-lex.europa.eu/eli/reg/2024/1183/oj)

**Prováděcí nařízení (EU) 2024/2977**
Pravidla pro identifikační údaje osoby a [[EAA]] vydávaná do [[EUDIW]].
[Prováděcí nařízení (EU) 2024/2977](https://eur-lex.europa.eu/eli/reg_impl/2024/2977/oj)

**Prováděcí nařízení (EU) 2025/1566**
Referenční standardy pro ověřování identity a atributů při vydávání kvalifikovaných certifikátů a [[QEAA]].
[Prováděcí nařízení (EU) 2025/1566](https://eur-lex.europa.eu/eli/reg_impl/2025/1566/oj)

**Prováděcí nařízení (EU) 2025/1569**
Technická a procesní pravidla pro [[QEAA]], potvrzení vydávaná z autentických zdrojů, katalog atributů a schémata potvrzení atributů.
[Prováděcí nařízení (EU) 2025/1569](https://eur-lex.europa.eu/eli/reg_impl/2025/1569/oj)

**Prováděcí nařízení (EU) 2025/1572**
Formát a proces oznámení záměru zahájit poskytování kvalifikované služby a ověřování splnění podmínek dozorovým orgánem.
[Prováděcí nařízení (EU) 2025/1572](https://eur-lex.europa.eu/eli/reg_impl/2025/1572/oj)

**Prováděcí nařízení (EU) 2025/2160**
Řízení rizik při poskytování nekvalifikovaných služeb vytvářejících důvěru a reference na vybrané části ETSI EN 319 401.
[Prováděcí nařízení (EU) 2025/2160](https://eur-lex.europa.eu/eli/reg_impl/2025/2160/oj)

**Prováděcí nařízení (EU) 2025/2162**
Akreditace conformity assessment bodies, pravidla conformity assessment schemes a obsah zpráv o posouzení shody kvalifikovaných poskytovatelů a kvalifikovaných služeb.
[Prováděcí nařízení (EU) 2025/2162](https://eur-lex.europa.eu/eli/reg_impl/2025/2162/oj)

## Shrnutí

Základní rozdíl mezi kvalifikovaným a nekvalifikovaným vydavatelem elektronických potvrzení atributů nespočívá pouze v použité technologii nebo formátu credentialu.

V obou případech se jedná o regulovanou oblast služeb vytvářejících důvěru a při integraci s [[EUDIW]] se na oba typy potvrzení mohou vztahovat společná technická pravidla interoperability.

Kvalifikovaný vydavatel ale navíc působí v režimu [[QTSP]]. Musí získat kvalifikovaný status, projít posouzením shody, podléhá průběžným auditům a dohledu a musí splnit přísnější požadavky na ověření identity, atributů, bezpečnost a provoz služby. Samotné [[QEAA]] má zároveň zákonem stanovený obsah a silnější právní účinky.

Nekvalifikovaný vydavatel má flexibilnější režim, není však mimo regulaci. Musí plnit obecné povinnosti [[TSP]], řídit rizika a zabezpečit službu a při použití [[EUDIW]] dodržovat příslušná pravidla evropského interoperabilního rámce.

Z pohledu ekosystému [[EUDIW]] tak oba modely mohou existovat vedle sebe. Rozdíl mezi nimi vyjadřuje především úroveň regulatorně garantované důvěry, způsob vzniku a ověření atributu a právní účinky výsledného elektronického potvrzení.
