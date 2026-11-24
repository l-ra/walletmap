---
title: "EUDI Wallet na dvou zařízeních: potřebujeme Digital Credentials API?"
description: "Cross-device prezentace, ochrana proti phishingu, proximity check a možnosti použití OpenID4VP bez Digital Credentials API po změně evropských technických požadavků v roce 2026."
pubDate: 2026-11-24
tags: [eudiw, oid4vp, arf, digital-credentials-api, bezpecnost, standardy]
draft: false
---

Uživatel otevře internetové bankovnictví na počítači, naskenuje telefonem QR kód a v evropské peněžence digitální identity potvrdí předání údajů. Na první pohled jde o přirozený způsob přihlášení. Co se ale stane, pokud QR kód nevygeneroval prohlížeč uživatele, nýbrž vzdálený útočník?

Právě tento problém vysvětluje, proč evropské technické specifikace upřednostňují Digital Credentials API pro prezentaci mezi zařízeními. Současně však existují legitimní scénáře, kdy musí být možné předložit údaje či autorizovat operaci na jiném místě, než kde byla zahájena.

**Digital Credentials API není univerzální podmínkou každé prezentace z peněženky. Cross-device prezentace bez něj ovšem není rovnocennou bezpečnostní alternativou a její interoperabilita není garantována.** Červencová změna prováděcích nařízení v roce 2026 je v tomto ohledu důležitá.

## 1. Dvě nezávislé dimenze prezentace

Při návrhu integrace [[EUDIW]] je potřeba oddělit dvě otázky:

- **Same-device vs. cross-device:** zda aplikace žádající o údaje a peněženka běží na stejném zařízení.
- **Redirect vs. mediating API:** jakým mechanismem je peněženka vyvolána a jak je prezentace předána zpět.

Digital Credentials API (DC API) je rozhraní mezi webovou aplikací, prohlížečem, operačním systémem a peněženkou. Není náhradou za [[OID4VP]], který nadále definuje požadavek na credential, jeho prezentaci a kryptografické důkazy. Při použití DC API se mění způsob zprostředkování protokolu a jeho vazba na kontext aplikace.

| Varianta vzdálené prezentace | DC API | Kontrola fyzické blízkosti |
| --- | --- | --- |
| Same-device redirect | Nepotřebuje | Není relevantní |
| Same-device mediating API | Ano nebo ekvivalentní platformové rozhraní | Není relevantní |
| Cross-device redirect | Nepotřebuje | Není inherentní vlastností protokolu |
| Cross-device mediating API | Ano nebo ekvivalentní platformové rozhraní | Vyžadována evropským profilem |

Vedle těchto vzdálených toků existuje lokální prezentace podle ISO/IEC 18013-5, například kontrola mobilního řidičského průkazu čtečkou. Tu nelze zaměňovat za vzdálenou webovou prezentaci s kontrolou blízkosti telefonu a počítače.

## 2. Proč nestačí podepsaný požadavek a QR kód

Klasický cross-device redirect flow používá QR kód jako nosič požadavku nebo odkazu na něj. Peněženka získá požadavek, provede jeho validaci, vyžádá souhlas uživatele a odešle prezentaci serveru.

```text
Počítač / prohlížeč       Server služby
       | --------------------> | zahájení relace
       | <-------------------- | QR kód
       |
       | optické načtení QR
       v
Peněženka v telefonu --------> | prezentace
       |                       |
Počítač <--------------------- | výsledek relace
```

Problém spočívá v posledním kroku. Server sice ověřil prezentaci, ale z pouhého načtení QR kódu nepozná, zda peněženka patří osobě ovládající původní prohlížeč.

Při útoku typu session fixation může být požadavek přenesen do jiného kontextu a schválen skutečným držitelem credentialu. Legitimní služba následně přiřadí výsledek autentizace nesprávné relaci. Podrobně tento problém popisuje [OpenID4VP 1.0, kapitola 14.2](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#name-session-fixation).

Ani platný certifikát [[WRPAC]], jednorázový nonce, šifrovaná odpověď nebo kryptografický holder binding samy o sobě neprokazují, že původní prohlížeč ovládá držitel peněženky. Každý z těchto mechanismů chrání jinou vlastnost transakce.

## 3. Jak pomáhá Digital Credentials API

Při využití DC API požadavek zprostředkovává důvěryhodná vrstva prohlížeče a platformy. Peněženka může získat informaci o webovém originu, která nevychází pouze ze samotného požadavku služby. [[OID4VP]] v příloze A definuje způsob použití protokolu nad tímto rozhraním.

U cross-device varianty evropský profil navíc vyžaduje ověření fyzické blízkosti zařízení prostřednictvím zabezpečeného lokálního komunikačního kanálu. Praktickou realizací může být Bluetooth Low Energy. QR kód může být součástí inicializace i zde, ale není jediným bezpečnostním mechanismem.

Kontrola blízkosti omezuje útoky založené na vzdáleném přenosu požadavku. Nejde o přesné měření vzdálenosti ani o náhradu všech ostatních kontrol. Nadále je nutné ověřovat identitu služby, požadované atributy, čerstvost prezentace a její kryptografickou vazbu na požadavek.

## 4. Co skutečně vyžadují evropská pravidla

Prováděcí nařízení Komise (EU) [2026/1731](https://eur-lex.europa.eu/legal-content/CS/TXT/?uri=CELEX%3A32026R1731) ze dne 15. července 2026 mění mimo jiné technické požadavky nařízení 2024/2982. Pro vzdálenou prezentaci upravuje aplikaci specifikace ETSI TS 119 472-2 V1.2.1.

Podstatný je bod `OIDFVP-HAIP-SUPPORT-03`. Zatímco původní profil ETSI formuloval omezení cross-device redirectů přísněji, evropské nařízení používá formulaci **should not**, nikoli **shall not**.

Poznámka 3 u tohoto požadavku zároveň upozorňuje na možnost útoků typu session fixation, přisuzuje jejich mitigaci spoléhajícím se stranám a výslovně říká, že samotná implementace tohoto mechanismu nemá vést k nesouladu.

Důsledky jsou následující:

- Peněženka může cross-device redirect implementovat, ale nejde o doporučený mechanismus.
- Spoléhající se strana nemůže předpokládat, že jej budou podporovat všechny evropské peněženky.
- Pokud jej [[RP]] použije, odpovídá za řešení souvisejících bezpečnostních rizik.
- Bod `OIDFVP-HAIP-ADD-API-05` nadále vyžaduje proximity check pro cross-device prezentaci prostřednictvím mediating API.

Nejde tedy o výjimku, která by umožňovala vypnout proximity check uvnitř standardního evropského cross-device toku přes DC API. Jde o možnost použít odlišný, nedoporučený mechanismus prezentace.

Je důležité rozlišovat technickou možnost v základním protokolu, požadavky evropského profilu a další povinnosti konkrétního sektoru. Samotná přípustnost mechanismu ještě neznamená, že konkrétní autentizační nebo autorizační řešení splňuje všechny požadavky na bezpečnost.

## 5. Same-device bez DC API zůstává standardní možností

[OpenID4VC HAIP 1.0, kapitola 5.1](https://openid.net/specs/openid4vc-high-assurance-interoperability-profile-1_0.html#section-5.1) stanovuje pro redirect-based prezentaci podporu same-device toku na obou stranách. Vyvolání peněženky může být provedeno například pomocí dohodnutého URI schématu nebo platformou podporovaného odkazu.

Požadavek musí být podepsaný, odpověď využívá režim `direct_post.jwt` a po odeslání prezentace se peněženka vrátí na adresu `redirect_uri`. Služba nesmí prezentaci akceptovat, jestliže návrat nenastane nebo dorazí do jiné uživatelské relace.

Tím vzniká vazba na kontext, ve kterém byl požadavek zahájen. Nejde pouze o technický callback pro zobrazení výsledku. Je součástí bezpečnostního modelu. Peněženku lze tedy pro same-device autentizaci využít i na platformách, kde DC API není dostupné, pokud jsou splněny ostatní požadavky.

## 6. Kdy dává cross-device bez proximity checku smysl

HAIP v kapitole 5.1 doporučuje u redirectů zůstat u same-device varianty, pokud ověřovatel potřebuje session binding k ochraně proti phishingu. Rozhodujícím kritériem proto není druh credentialu, ale význam výsledku prezentace pro původní relaci.

Následující příklady představují architektonickou interpretaci, nikoli legislativní seznam povolených výjimek.

| Use case | Posouzení cross-device redirectu bez proximity checku |
| --- | --- |
| Přihlášení do bankovnictví nebo portálu veřejné správy | Nevhodné jako samostatný autentizační mechanismus. |
| Ověření věku pro okamžité odemknutí služby | Rizikové, protože oprávnění získá původní relace. |
| Předložení diplomu do existujícího spisu | Potenciálně vhodné při nezávislé identifikaci a vazbě na spis. |
| Doložení profesní kvalifikace zaměstnavateli | Potenciálně vhodné, pokud se kontroluje vztah držitele k případu. |
| Asynchronní sběr atestací | Potenciálně vhodné, pokud výsledek nevytváří neoprávněnou autentizovanou relaci. |
| Vzdálená autorizace konkrétní operace | Podmíněně vhodné při nezávislé autentizaci, vazbě na operaci a splnění sektorových pravidel. |

Ani u doložení diplomu nestačí jen říci, že nejde o přihlášení. Pokud prezentace umožňuje vydat oprávnění jiné osobě, přetrvává obdobný problém. Stejně tak prezentace [[PID]] nemusí vždy sloužit k autentizaci relace — může být podkladem pro jiný, samostatně zabezpečený proces.

### Vzdálené schválení není totéž co vzdálené přihlášení

[RFC 10027](https://datatracker.ietf.org/doc/html/rfc10027), publikované v srpnu 2026 jako Best Current Practice, rozebírá i situace, kdy iniciátor a autorizující osoba záměrně nejsou na stejném místě. Příkladem je schvalování platby primárním držitelem karty, kterou inicioval sekundární držitel.

Takový proces potřebuje jinou bezpečnostní architekturu než běžné přihlášení: nezávislou identifikaci účastníků, ověření jejich oprávnění, jednoznačnou vazbu na schvalovanou operaci a ochranu proti záměně jejího kontextu. U konkrétních operací mohou být relevantní také [transakční data v OpenID4VP](/clanky/transaction-data-sca-qes/).

Krátká platnost požadavku, nonce nebo transakční limity jsou doplňkové kontroly; samy nenahrazují vazbu relace ani nezajišťují odolnost proti phishingu. RFC nepředstavuje právní výjimku z evropských požadavků.

## 7. Dopady na návrh verifieru

Pro univerzální integraci je vhodné podporovat mediating API jako preferovaný mechanismus a same-device redirect jako standardní alternativu. Cross-device redirect bez kontroly blízkosti by měl být povolen jen pro explicitně posouzené obchodní procesy, nikoli automaticky při nedostupnosti DC API.

```text
Požadavek na prezentaci
  |
  +-- Mediating API dostupné a vhodné?
  |     +-- ano: použít API; cross-device s proximity checkem
  |
  +-- Same-device redirect možný?
  |     +-- ano: použít redirect s vazbou na relaci
  |
  +-- Cross-device redirect:
        +-- podporuje jej peněženka?
        +-- připouští jej bezpečnostní politika use case?
        +-- jsou zajištěny nezávislé kontroly?
              +-- ano: provést prezentaci
              +-- ne: nabídnout jiný bezpečný postup
```

Nedostupnost Bluetooth, nepodporovaný prohlížeč či odmítnutí kontroly blízkosti nesmí automaticky vést k oslabení autentizačního mechanismu. Z pohledu interoperability musí služba počítat s tím, že volitelný redirect nemusí být podporován a uživateli nabídnout vhodnou alternativu.

## Závěr

Digital Credentials API řeší u evropské peněženky nejen uživatelský komfort, ale především bezpečné zprostředkování prezentace. V cross-device scénáři evropský profil k tomu přidává kontrolu blízkosti zařízení.

Červencová úprava evropských technických pravidel v roce 2026 přitom ponechává prostor pro cross-device redirect bez povinného proximity checku. Nezaručuje jeho dostupnost ve všech peněženkách a neodstraňuje rizika spojená s přenosem požadavku. Pro běžnou autentizaci je preferovaný tok s mediating API, zatímco skutečně vzdálené předkládání atestací a autorizace konkrétních operací mohou vyžadovat jiný bezpečnostní model.

## Zdroje a technické specifikace

Stav k 24. listopadu 2026.

- [Architecture and Reference Framework — kapitola 4, remote presentation flows](https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework/blob/main/docs/main/04-high-level-architecture.md).
- [Prováděcí nařízení Komise (EU) 2026/1731](https://eur-lex.europa.eu/legal-content/CS/TXT/?uri=CELEX%3A32026R1731) — úpravy ETSI profilu, zejména požadavky `OIDFVP-HAIP-SUPPORT-03` a `OIDFVP-HAIP-ADD-API-05`.
- [ETSI TS 119 472-2 V1.2.1](https://www.etsi.org/deliver/etsi_ts/119400_119499/11947202/01.02.01_60/ts_11947202v010201p.pdf) — kapitoly 6.2, 6.4 a 6.5.
- [OpenID4VC HAIP 1.0](https://openid.net/specs/openid4vc-high-assurance-interoperability-profile-1_0.html) — kapitoly 5.1, 5.2 a 9.1.
- [OpenID4VP 1.0](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html) — kapitoly 8.2, 14.2 a příloha A.
- [W3C Digital Credentials API](https://www.w3.org/TR/digital-credentials/).
- [RFC 10027 — Best Current Practice for Security of Cross-Device Flows](https://datatracker.ietf.org/doc/html/rfc10027) — zejména kapitola 6.
