---
title: "BANCOMAT a Lissi: testování interoperability platebních credentialů v EUDI Wallet"
description: "Co je veřejně známo o testech BANCOMAT a Lissi v projektu APTITUDE a jak je zasadit do architektury EUDI Wallet, OpenID4VCI, OpenID4VP a pravidel SCA."
pubDate: 2026-11-04
tags: [eudiw, bancomat, lissi, aptitude, interoperabilita, platby, sca, oid4vci, oid4vp]
draft: true
---

**BANCOMAT a Lissi ověřují interoperabilitu digitálních credentialů mezi různými implementacemi evropských peněženek.** Za krátkou zprávou o společných testech se skrývá podstatnější otázka: dokáže platební nebo bankovní atestace vydaná jedním subjektem fungovat v peněžence jiného dodavatele a být bezpečně využita třetí stranou — včetně scénářů autentizace zákazníka a schvalování plateb?

Veřejné vyjádření zástupce BANCOMAT Emiliana Sparaca uvádí, že BANCOMAT umí vytvářet *third-party credentials* pro různé případy použití, včetně platebního scénáře **BPAY**, autentizace a silného ověření zákazníka (*Strong Customer Authentication*, SCA), a spolupracuje mimo jiné s **Lissi a Sparkasse** na testování jejich interoperability mezi peněženkami a ekosystémy. Je to doklad probíhající spolupráce, **nikoli veřejná testovací zpráva s doloženými výsledky jednotlivých scénářů**.

Vývoj zapadá do evropského pilotního projektu **APTITUDE**, navazujícího na zkušenosti s projektem NOBID. BANCOMAT zároveň v říjnu 2026 představil širší návrh sdílené infrastruktury EUDI Wallet pro italské banky, vydavatele atestací a ověřovatele. Tyto aktivity spolu souvisejí, ale test interoperability credentialů **není totožný** s testem zúčtování plateb ani s komerčním spuštěním navrhované infrastruktury.

> **Poznámka k ověření zdroje:** Text zprávy nazvané „BANCOMAT and Lissi: Joint Interoperability Testing“ nebyl při přípravě tohoto draftu přímo dohledán. Konkrétní výsledek, rozsah a datum případného úspěšného dokončení testů proto nejsou potvrzeny. Technické části níže vysvětlují, **co a jak by takové testování mělo ověřovat**, nikoli jakou přesně konfiguraci BANCOMAT a Lissi skutečně použily.

## Proč je to důležité

[[EUDIW]] je evropský model pro vydávání, uchovávání a předkládání digitálních dokladů a elektronických potvrzení atributů. U plateb není zajímavé jen prokázání totožnosti pomocí [[PID]], ale také práce s dalšími credentialy: například potvrzením vztahu zákazníka k bance, oprávněním použít platební nástroj nebo atestací umožňující konkrétní způsob autentizace.

Takový credential nemusí vydávat stát. Může jít o [[EAA]] vydanou bankou nebo jiným oprávněným poskytovatelem podle příslušných pravidel ekosystému. **Technická ověřitelnost a právní kvalifikace ale nejsou totéž:** podepsaná bankovní atestace není automaticky [[QEAA]] a nepředstavuje sama o sobě důkaz splnění PSD2 SCA.

U přeshraničního využití se navíc oddělují tři nezávisle implementované komponenty:

1. **Vydavatel (issuer)** – vytvoří credential, stanoví jeho význam, platnost a případné podmínky použití.
2. **Peněženka** – credential přijme, bezpečně uloží a podle pravidel jej předloží.
3. **[[RP|Spoléhající strana]] / [[Verifier|ověřovatel]]** – vyžádá konkrétní informace a ověří prezentaci i důvěryhodnost vydavatele.

Aby tento řetězec fungoval napříč výrobci a členskými státy, nestačí pouze použít shodný formát dat.

## Jak by měl interoperabilní tok technicky fungovat

Následující schéma je **referenční model podle standardů**, nikoli potvrzený záznam konkrétního testu BANCOMAT–Lissi:

```text
Vydavatel bankovního credentialu (např. BANCOMAT)
             |
             | 1. Credential Offer + OpenID4VCI
             v
       EUDI Wallet (např. Lissi)
             |
             | 2. Uložení credentialu a vazba na držitele
             |
             | 3. OpenID4VP request od ověřovatele
             v
      Banka / obchodník / služba (verifier)
             |
             | 4. Ověření podpisu, držitele,
             |    stavu a důvěry vydavatele
             v
      Výsledek pro konkrétní obchodní proces
```

### 1. Vydání: [[OID4VCI]]

Pro vydávání credentialů do peněženky slouží **OpenID for Verifiable Credential Issuance 1.0**. Běžný proces zahrnuje nabídku credentialu (*Credential Offer*), autorizaci, získání přístupového tokenu a požadavek na vydání credentialu. Standard připouští různé autorizační postupy; z veřejných informací nevyplývá, který byl použit v konkrétních testech.

Vydavatel a peněženka musí souhlasit na typu a formátu credentialu, metadatech vydavatele a podporovaných kryptografických algoritmech. V relevantních scénářích musí peněženka také prokázat autenticitu své instance a ochranu klíčového materiálu. Architektura ARF rozlišuje [[WIA]] (*Wallet Instance Attestation*) a [[KA]] (*Key Attestation*); jejich přesná aplikace se řídí příslušným profilem a požadavky na daný credential.

Lissi ve své veřejné dokumentaci uvádí podporu [[OID4VCI]] 1.0 včetně *Authorization Code* a *Pre-Authorized Code* flow a formátu [[SD-JWT-VC]].

### 2. Předložení: [[OID4VP]] a dotaz DCQL

Ověřovatel v protokolu **OpenID for Verifiable Presentations 1.0** připraví požadavek na předložení credentialu. Pomocí *Digital Credentials Query Language* (DCQL) vymezí požadované typy credentialů a atributy.

Peněženka vyhodnotí, zda odpovídající credential má, zohlední podmínky zpřístupnění a uživateli představí požadavek. Odpověď může obsahovat selektivně zveřejněné atributy a kryptografický důkaz držení odpovídajícího klíče. Ověřovatel následně kontroluje zejména podpis vydavatele, platnost a případnou revokaci, prokázání držení klíče a vazbu prezentace na svůj požadavek (například přes `nonce`).

U vzdálené prezentace je třeba odlišovat podporu základního protokolu od konkrétního bezpečnostního profilu, důvěryhodnosti protistrany a pravidel daného bankovního scénáře.

### 3. Důvěra a stav credentialu

Úspěšné kryptografické ověření podpisu **samo neodpovídá** na otázku, zda ověřovatel smí danému vydavateli důvěřovat v požadované roli. ARF 3.0.0 počítá s národními *Trusted Lists* a seznamy [[LoTE]] podle příslušných ETSI specifikací.

V produkčním scénáři je třeba řešit také registraci a oprávnění [[RP]], autentizaci její technické instance a význam požadovaných údajů. V architektuře jsou relevantní zejména [[WRPAC]] a [[WRPRC]] a související validační a registrační infrastruktura. Přesný trust profil pilotního testu ale z dostupných informací neznáme.

## Co je navíc nutné pro autorizaci platby

**Prokázání identity, držení bankovního credentialu a schválení konkrétní platby jsou různé bezpečnostní operace.** PSD2 SCA požaduje příslušné autentizační faktory a pro vzdálené elektronické platby i *dynamic linking*: autentizační kód musí být svázán s konkrétní částkou a příjemcem.

[[OID4VP]] 1.0 obsahuje rozšíření `transaction_data`, kterým může ověřovatel do žádosti vložit strukturované údaje o schvalované operaci. Peněženka musí podporovat příslušný typ transakčních dat, umět jej správně zobrazit a vytvořit kryptografickou vazbu mezi prezentací a transakcí. U kryptograficky vázaného [[SD-JWT-VC]] lze využít například *Key Binding JWT* a hash transakčních dat.

Specifikace **TS12 – Strong Customer Authentication Implementation with the Wallet** doplňuje evropský profil pro platební případy použití. Právě v této vrstvě je nutné ověřovat, zda bankovní atestace skutečně opravňuje konkrétní typ operace, jaké jsou požadované autentizační faktory a jak se výsledek předává poskytovateli platebních služeb.

To však **neznamená**, že BANCOMAT a Lissi v oznámeném testu již úspěšně ověřily `transaction_data`, dynamic linking nebo kompletní soulad s PSD2. Pro takové tvrzení by byla potřeba konkrétní testovací matice a její výsledky.

## Co by měla doložit kvalitní zpráva o testech

Pro technické posouzení interoperabilního testu by bylo vhodné zveřejnit alespoň:

- **Rozsah:** které verze walletu, issueru a verifieru byly testovány; zda šlo o vydání, prezentaci, nebo celý platební scénář.
- **Formáty a profily:** zda šlo o [[SD-JWT-VC]] či mdoc, jakou verzi OpenID protokolů a jaký bezpečnostní profil implementace použily.
- **Trust:** jak se ověřovala identita vydavatele a [[RP]], jaké trust anchory a případné registrační certifikáty byly použity.
- **Bezpečnost:** holder binding, ochrana proti replay, revokace, selektivní zveřejnění, chování při nepodporovaném typu credentialu.
- **Autorizace plateb:** zda se zkoušely `transaction_data`, konkrétní částka a příjemce, požadavky TS12 a odpovědnost poskytovatele platebních služeb.
- **Výsledky:** úspěšné i neúspěšné kombinace, známá omezení a reprodukovatelná testovací evidence.

Toto rozlišení odpovídá i evropskému pojetí testování: **konformance** ověřuje chování vůči specifikaci, zatímco **interoperabilita** ověřuje, zda nezávislé implementace skutečně spolupracují. Jedno automaticky nedokazuje druhé, natož kompletní regulatorní soulad.

## Závěr

Spolupráce BANCOMAT a Lissi je zajímavá především jako **ověření přenositelnosti bankovních a platebně orientovaných atestací mezi nezávislými implementacemi**, nikoli jako demonstrace další platební aplikace. Ukazuje praktický směr evropské digitální identity: credential vydaný jedním hráčem může být využit jiným subjektem, pokud se shodnou na protokolech, datové sémantice, důvěře a pravidlech použití.

Zda konkrétní testy již prokázaly plný konec–konec scénář včetně SCA a autorizace platby, z dosud dohledaných podkladů **nelze potvrdit**. Toto je hlavní hranice mezi doloženou novinkou a její technickou interpretací.

## Zdroje a další čtení

- [Veřejné vyjádření Emiliana Sparaca k testování BANCOMAT, Lissi a Sparkasse (komentář na LinkedIn)](https://www.linkedin.com/posts/brunellalupano_eu-digital-identity-activity-7495364679293222913-ikv_)
- [BANCOMAT: návrh EUDIW Italia, kontext NOBID/APTITUDE a bankovní infrastruktury (19. 10. 2026)](https://www.pagamentidigitali.it/esperti-e-analisti/bancomat-punta-sul-framework-eudiw-italia-identita-digitale-pagamenti-e-nuovi-modelli-di-ricavo/)
- [EUDI Wallet Architecture and Reference Framework 3.0.0 (21. 7. 2026)](https://eudi.dev/3.0.0/)
- [EUDI Wallet – přehled technických specifikací](https://eudi.dev/latest/technical-specifications/)
- [TS12: Strong Customer Authentication Implementation with the Wallet](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/blob/main/docs/technical-specifications/ts12-electronic-payments-SCA-implementation-with-wallet.md)
- [OpenID4VCI 1.0](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html)
- [OpenID4VP 1.0](https://openid.net/specs/openid-4-verifiable-presentations-1_0-final.html)
- [Lissi Wallet – podporované technické specifikace](https://docs.wallet.lissi.id/home/technical-specifications)
- [EU Digital Identity Wallet Launchpad – model konformačních a interoperabilních testů](https://ec.europa.eu/digital-building-blocks/sites/spaces/EUDIGITALIDENTITYWALLET/pages/989397497/Launchpad%2BTesting%2B2026)

---

*Redakční kontrola před publikací: doplnit primární URL zprávy „BANCOMAT and Lissi: Joint Interoperability Testing“, ověřit datum, účastníky, přesný rozsah a výsledky testů; případně aktualizovat úvod a závěr. Článek je záměrně veden jako draft.*
