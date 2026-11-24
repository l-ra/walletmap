---
title: "Valetka: česká evropská peněženka má dodavatele. Kdo stojí za konsorciem Wultry?"
description: "DIA vybrala dodavatele Valetky. Přehled koncese, harmonogramu, technologických partnerů a jejich zahraničních referencí."
pubDate: 2026-11-24
tags: [eudiw, cesko, implementace, valetka, certifikace]
draft: false
---

Digitální a informační agentura (DIA) oznámila 24. listopadu 2026 výběr konsorcia vedeného českou společností Wultra pro vývoj a provoz české [[EUDIW]], která ponese název Valetka. Zajímavé je zejména propojení zkušeností z bankovní autentizace, vzdáleného ověřování dokladů a zahraničních národních peněženek.

## Koncese a harmonogram

Podle [oznámení DIA](https://www.dia.gov.cz/cs/aktuality/stat-vybral-dodavatele-evropske-penezenky-digitalni-identity) má být smlouva podepsána do konce listopadu 2026. K okamžiku oznámení tedy nelze výběr dodavatele zaměňovat za uzavření smlouvy. Podle [vyjádření konsorcia zveřejněného na Lupě](https://www.lupa.cz/aktuality/konec-noseni-penezenky-cesko-bude-mit-digitalni-doklady-valetka-vyridite-s-ni-urady-i-banky-v-cele-eu/) bude koncese trvat pět let od spuštění.

| Milník | Plán |
| --- | --- |
| Podpis koncese | listopad 2026 |
| Vývoj a dokončení státní infrastruktury | 2026–2027 |
| Certifikace | Q2–Q3 2027 |
| Veřejné spuštění pro Android a iOS | Q4 2027 |
| Cíl adopce | přes 4 miliony uživatelů a 1 500+ firem do roku 2032 |

Dodavatel má odpovídat za vývoj a provoz, stát za vydávání [[PID]], registraci [[RP]] a bezpečnostní dohled. Odměna má záviset na smluvních výsledcích. DIA avizuje veřejný zdrojový kód aplikace a nezávislou certifikaci. Podrobné licenční podmínky komponent však zatím nejsou známé.

Použití bude dobrovolné a pro občany bezplatné. eDoklady mají nadále fungovat. Plánované funkce zahrnují osobní i online identifikaci, doklady o řidičském oprávnění, ověření věku, zastupování a kvalifikované podepisování pro osobní potřeby.

## Kdo tvoří konsorcium

[Prezentace DIA z tiskové konference](https://www.dia.gov.cz/media/4264/download/Valetka_prezentace_.pdf?v=1) jmenuje vedle Wultry čtyři partnery. Vyjádření dodavatele navíc uvádí Amdocs jako subdodavatele. Následující přehled odlišuje doložené reference od předpokládaných rolí v českém projektu.

### Wultra (Česko)

Pražská firma založená roku 2014 odpovídá za celkovou podobu řešení. Zaměřuje se na autentizaci, ochranu mobilních aplikací a digitální identitu. DIA uvádí bankovní zákazníky včetně ČNB, ČSOB, Raiffeisenbank a MONETA Money Bank.

Vedle bankovních nasazení má firma referenci v oblasti státních služeb: [MojeID Klíč pro CZ.NIC](https://www.wultra.com/case-studies/mojeid-klic-the-one-app-for-fast-and-secure-access-to-egovernment-and-commercial-services). Její [Digital ID Wallet Gateway](https://developers.wultra.com/products/diw-gateway/) podporuje vydávání a ověřování atestací pomocí [[OID4VCI]] a [[OID4VP]]. Jde o produkt pro integraci peněženek, nikoli důkaz existence certifikované klientské peněženky.

### iProov (Velká Británie)

Dodavatel obličejové biometrie a detekce živosti, včetně obrany proti podvrženým vstupům. Technologie je nasazena v britském programu EU Settlement Scheme; [iProov uvádí](https://www.iproov.com/use-cases/visas-borders-immigration/) více než pět milionů úspěšně dokončených žádostí. Další [vládní reference](https://www.iproov.com/reports/case-studies-government-digital-identity/) zahrnují Singapur.

Spolupráce s Wultrou není nová: [technická dokumentace](https://developers.wultra.com/products/identity-verification/service-providers) již popisuje integraci biometrické komponenty a společný [webinář s Raiffeisenbank](https://www.wultra.com/webinars/combating-the-rising-threat-of-deepfakes-and-beyond) dokumentuje zkušenosti z bankovního onboardingu. Firma se také účastní [sandboxu GOV.UK Wallet](https://www.iproov.com/press/gov-uk-wallet-credential-checks-sandbox-opens).

Pro Valetku je přirozeným kandidátem na biometrické ověřování při vzdálené aktivaci. Přesný proces a způsob zpracování biometrických údajů zatím nebyl zveřejněn.

### Signicat (Norsko)

Poskytovatel služeb digitální identity, jehož ReadID umožňuje číst a ověřovat čipy elektronických dokladů prostřednictvím NFC. [Smlouva s dánskou agenturou pro digitalizaci](https://www.signicat.com/press-releases/signicat-danish-digital-identity-wallet) pokrývá existující mobilní řidičský průkaz a ověřování identity pro připravovanou dánskou peněženku. Firma uvádí také [reference BankID, britského Home Office a One Login](https://www.signicat.com/use-cases/eudi-wallet).

V kombinaci s iProov lze technicky vytvořit onboarding založený na autentizaci čipu dokladu a porovnání fotografie s živou osobou. Jde o možnou architekturu, nikoli zveřejněnou specifikaci Valetky.

### youniqx Identity AG (Rakousko)

Digitální dceřiná společnost Österreichische Staatsdruckerei (OeSD). Mezi její reference patří rakouské eAusweise a lichtenštejnské eID.li. Zvlášť relevantní je [zakázka agentury SPRIND na infrastrukturu německé peněženky](https://www.staatsdruckerei.at/en/osd-news/digital-subsidiary-of-austrian-state-printing-company-wins-infrastructure-tender-for-german-eu-digital-identity-wallet/), kterou získalo konsorcium youniqx, A1 Digital, CRYPTAS a msg group.

V listopadu 2026 společnost rovněž [představila vlastní otevřený sandbox](https://www.staatsdruckerei.at/allgemein/youniqx-identity-veroeffentlicht-offene-eudi-sandbox/). Společný dodavatel českého a německého projektu představuje zajímavý průnik zkušeností, neprokazuje však společnou klientskou implementaci ani přenos certifikace.

### Partners Banka (Česko)

Banka přináší zkušenosti s finančními službami a péčí o klienty. Relevantní je její [akreditace DIA pro správu kvalifikovaného systému elektronické identifikace](https://www.dia.gov.cz/cs/legislativa/eidas-sluzby-vytvarejici-duveru-a-elektronicka-identifikace/povinne-zverejnovane-informace/oznameni-o-udeleni-akreditace-pro-spravu-kvalifikovaneho-systemu-elektronicke-identifikace-poskytovatel-partners-banka-a-s). Z oznámení nelze dovodit, že bude přímo provozovat aktivační místa nebo zajišťovat všechny služby podpory.

### Amdocs (subdodavatel)

Mezinárodní technologická skupina izraelského původu se zkušenostmi s telekomunikačními a podnikovými systémy. [Produktové portfolio](https://www.amdocs.com/products-services) zahrnuje i správu digitální identity. Mezi veřejné reference patří [AT&T](https://www.amdocs.com/press-release/att-and-amdocs-expand-collaboration-bringing-together-amdocs-aos-and-atts-ai-enabled-framework). Rozsah dodávky pro Valetku ani přímou referenci na národní evropskou peněženku se nepodařilo ověřit.

## Co bude důležité sledovat

Zkušenosti konsorcia pokrývají několik vrstev ekosystému. Samotné reference jednotlivých komponent ale nenahrazují certifikaci výsledného systému podle [[eIDAS]].

Po zveřejnění smlouvy a technického návrhu bude důležité vyjasnit zejména:

- rozdělení odpovědností za Wallet Unit, backend, [[WSCD]] a životní cyklus klíčů;
- architekturu vzdáleného onboardingu, zpracování biometrie, umístění služeb a retenci údajů;
- poskytovatele kvalifikovaného podepisování a jeho integraci;
- rozsah otevřeného kódu a licencovaných komponent, podmínky přenositelnosti a ukončení koncese;
- rozsah certifikace, interoperabilitu a konkrétní kritéria akceptace;
- vztah deklarované postkvantové autentizace ke standardizovaným formátům a algoritmům evropské peněženky.

Postkvantová ochrana některé autentizační vrstvy sama o sobě nedokládá postkvantovou odolnost celého řetězce vydávání a prezentace atestací.

## Závěr

Výběr dodavatele posouvá český projekt do realizační fáze. Zahraniční reference jsou nejkonkrétnější v oblastech biometrického ověřování, NFC ověřování dokladů a infrastruktury národních peněženek. O výsledné architektuře a odpovědnostech jednotlivých společností rozhodnou až smluvní a technické dokumenty.

## Hlavní zdroje

- [DIA: oznámení výběru dodavatele, 24. 11. 2026](https://www.dia.gov.cz/cs/aktuality/stat-vybral-dodavatele-evropske-penezenky-digitalni-identity)
- [DIA: prezentace Valetka](https://www.dia.gov.cz/media/4264/download/Valetka_prezentace_.pdf?v=1)
- [Digitální Česko: Valetka](https://digitalnicesko.gov.cz/valetka)
- [FF News: oznámení konsorcia](https://ffnews.com/news/wultra-led-consortium-wins-tender-to-deliver-and-operate-czech-eudi-wallet-89ece9d8)
- [Wultra: případové studie](https://www.wultra.com/case-studies)

Stav informací k 24. listopadu 2026. Reference dodavatelů jsou tam, kde není dostupné nezávislé potvrzení, uváděny jako jejich vlastní publikované informace.
