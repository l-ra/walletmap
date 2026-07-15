# Plán revize: model střeleckého klubu a EUDIW

Stav ověření: 15. 7. 2026.

Tento plán vychází ze systematické kontroly 22 scénářů série `strelecky-klub` vůči eIDAS po novele (EU) 2024/1183, CIR (EU) 2025/848, ARF 2.8.0, OID4VCI/OID4VP a aktuální české úpravě zbraní. Je určen jako podklad pro schválení rozsahu následné textové revize; neprovádí žádné obsahové změny.

## Cíl revize

Udržet model jako srozumitelný průvodce typickým scénářem člena a závodníka, ale:

1. odstranit faktické chyby a zastaralé právní předpoklady,
2. jasně oddělit závazný rámec, aktuálně dostupné české služby a hypotetické modelové prvky,
3. rozlišit vzdálené a proximity prezentační toky,
4. uspořádat navigaci podle skutečné user journey.

## P0 — opravit před dalším použitím

### 1. Česká zbrojní legislativa a terminologie

**Dotčené scénáře:** `statni-doklady-pid-zbrojak.md`, `registrace-zavodnika.md`, `registrace-rp.md`, `vydani-prukazu-zavodnika.md` a návazné tabulky/JSON příklady.

Od 1. 1. 2026 zákon č. 90/2024 Sb. zrušil dosavadní fyzické zbrojní průkazy i průkazy zbraní. Rozhodující je zbrojní oprávnění a evidence v Centrálním registru zbraní. Zbrojní oprávnění je časově neomezené, takže model nemá pracovat s jeho `valid_until` ani s historickými skupinami zbrojního průkazu jako s aktuálními atributy.

**Plán změny:**

- nahradit „zbrojní průkaz“ aktuální terminologií „zbrojní oprávnění“;
- odstranit tvrzení o jeho časové platnosti;
- přepracovat model „průkazu zbraně / povolení“ podle aktuální úpravy, nikoli jako digitální kopii zrušeného fyzického dokladu;
- prověřit právní nutnost zbrojního oprávnění pro každý modelovaný typ soutěžícího: závisí na kategorii zbraně, věku, dohledu a provozním režimu střelnice, proto jej nelze univerzálně označit za povinné.

### 2. Dostupnost českých státních atestací v EUDIW

Model předpokládá, že český stát vydává do EUDIW `PID`, zbrojní oprávnění a údaje o zbrani v konkrétních formátech `dc+sd-jwt` a typech `urn:czechia:…`. Pro tyto konkrétní doklady, `vct`, claims ani issuance flow není ověřený závazný český produkční profil.

**Plán změny:**

- označit státní zbrojní credentialy, jejich formáty a claims jako hypotetický předpoklad modelu;
- doplnit alternativu, kdy zbrojní údaj v EUDIW není dostupný a klub ověřuje podmínku jiným zákonným kanálem;
- odstranit dojem, že ukázkové české URN jsou budoucí produkční identifikátory.

### 3. Důvěryhodnost státních a ne-kvalifikovaných atestací

Model nesmí ztotožňovat stát s Qualified Trust Service Providerem ani považovat [[LoTE]] za obecný trust mechanismus pro všechny typy atestací. PID Provider není z definice QTSP. Trust anchory PID Providerů jsou v LoTE; trust anchory non-qualified EAA Providerů nejsou automaticky notifikovány ani zařazeny do LoTE a musí vycházet z doménového rulebooku či jiného mechanismu.

**Plán změny:**

- rozdělit trust model pro PID, QEAA, veřejné EAA a non-qualified EAA;
- opravit formulace o roli státu a LoTE;
- vysvětlit, že důvěra pro hypotetickou zbrojní atestaci závisí na jejím budoucím právním statusu a českém rulebooku.

### 4. OID4VP versus proximity u zámků

ARF 2.8.0 rozlišuje vzdálenou prezentaci přes [[OID4VP]] a proximity prezentaci přes ISO/IEC 18013-5. Scénáře zámků nyní popisují NFC/BLE proximity jako [[OID4VP]].

**Plán změny:**

- pro každý scénář zámku explicitně zvolit remote, nebo proximity režim;
- u NFC/BLE zámků modelovat ISO/IEC 18013-5, jeho offline omezení a trust;
- u QR/deep-link webového verifieru jej popsat jako remote [[OID4VP]];
- podle rozhodnutí upravit přístupové scénáře, scénář rozhodčího, registraci RP i diagramy.

## P1 — vysoká priorita

### 5. Zpřesnit právní rámec registrace RP

Tvrzení, že se musí registrovat „každá organizace, která vyžaduje údaje z peněženky“, je příliš široké. Čl. 5b eIDAS řeší relying party, která využívá EUDIW pro veřejnou nebo soukromou službu prostřednictvím digitální interakce.

**Plán změny:**

- používat přesnou zákonnou podmínku;
- doplnit aktualizaci registračních údajů při změně účelu nebo claims;
- doplnit pozastavení či zrušení registrace a návaznou revokaci WRPAC/WRPRC.

### 6. Rozlišit WRPAC a volitelný WRPRC

WRPAC pro registrovanou RP instanci představuje povinnou část mechanismu; členský stát však může, nikoli musí, zavést vydávání [[WRPRC]].

**Plán změny:**

- sjednotit texty na dvou implementačních větvích: s WRPRC a s ověřením přes registr;
- označit české registry, endpointy, certifikáty a hostname v příkladech jako fiktivní.

### 7. Upřesnit reissuance a automatickou obnovu

OAuth refresh token v [[OID4VCI]] může obnovit autorizační kontext pro další vydání, ale standard neurčuje obchodní pravidlo „po třech závodech“ ani konkrétní metodu `reissueDocument(backgroundOnly: true)`.

**Plán změny:**

- označit pseudo-API jako ilustrativní implementační detail;
- stanovit, že vydání refresh tokenu, jeho životnost, fallback, nové ověření a notifikace jsou politikou vydavatele;
- doplnit větev, kdy obnovení vyžaduje interakci uživatele nebo nové doložení podkladů.

### 8. Sjednotit status-list a offline politiku

Jeden scénář požaduje kontrolu status listu při každé prezentaci, jiný správně pracuje s periodickou cache pro offline provoz.

**Plán změny:**

- vytvořit jednotnou politiku čerstvosti statusu podle rizika;
- stanovit pro online aplikaci, zámek a rozhodčího maximální stáří cache, postup při nedostupnosti a důsledek pro rozhodnutí;
- dále rozlišit revokaci klubového credentialu, WIA/KA a RP certifikátu.

### 9. Oddělit vstup na střeliště od oprávnění manipulovat se zbraní

`CompetitionEntry` může opravňovat ke vstupu, ale sám nedokládá zbrojní oprávnění ani bezpečné splnění podmínek pro manipulaci se zbraní.

**Plán změny:**

- vložit bezpečnostní a právní rozhodovací tabulku;
- rozdělit kontrolu vstupu, účasti na soutěži, práva manipulovat se zbraní a ověření konkrétní zbraně;
- přezkoumat, zda klubové členství samo smí otevřít prostor se zbraněmi.

## Mezery ekosystému k výslovnému vymezení rozsahu

Následující prvky není nutné všechny rozepisovat do hlavní cesty. Model má ale jasně říct, zda jsou mimo jeho rozsah, nebo zda budou doplněny:

- instalace, aktivace, aktualizace a zneplatnění Wallet Unit z pohledu Wallet Providera;
- vydání a obnova [[PID]] státem;
- konkrétní české rozhodnutí o registru RP, ACA, registraci issuerů, rulebooku pro non-qualified EAA a katalogu atestací;
- intermediary pro zámky či terminály provozované třetí stranou;
- plný offline režim pro proximity zámky;
- přeshraniční držitel a zahraniční PID Provider;
- hostující závodník bez klubového členství včetně cesty k registraci na soutěž;
- bootstrap prvního administrátora či výboru;
- GDPR provozní vrstva: právní titul, retence, minimalizace uložených výsledků, DPIA;
- incident response pro ztrátu peněženky, kompromitovaný klíč, nedostupný issuer/status list a závadu zámku.

## Navržená struktura série

Současná série kombinuje uživatelský průvodce, provozní model a hlubokou technickou specifikaci. Navržené členění:

1. **Hlavní modelová cesta**
   - Kontext a hranice modelu
   - Předpoklady: EUDIW, [[PID]] a dostupnost zbrojního údaje
   - Žádost o členství → schválení → vydání členství
   - Registrace závodníka → vydání průkazu závodníka
   - Registrace na závod → ověření rozhodčím → přístup
   - Obnova, ztráta zařízení a ukončení

2. **Provozní přílohy**
   - Role a datový model credentialů
   - Registrace vydavatele
   - Registrace RP a intended use
   - Revokace, status a offline politika
   - Zámky a intermediary

3. **Technické prohloubení**
   - [[OID4VCI]]
   - [[OID4VP]] remote a ISO proximity
   - Certifikáty, metadata a trust model
   - WIA/KA
   - Ilustrativní JSON příklady

### Navigační změny

- Přesunout scénář státních dokladů před registraci závodníka.
- Zálohování a obnovu zařadit až po prvním vydání, případně ji jasně označit jako průřezové téma.
- Opravit kolizi `order: 13` mezi `registrace-rp.md` a `typy-atributu-prukazu.md`.
- Uzavřít `prev`/`next` do jedné souvislé business cesty.
- Na začátek série vložit výrazný blok „Modelové předpoklady, nikoli stav dostupných českých služeb“.

## Doporučené pořadí realizace

1. Právně přepsat zbraňovou část a označit hypotetické státní EUDIW doklady.
2. Rozdělit vzdálené [[OID4VP]] a proximity ISO/IEC 18013-5.
3. Opravit trust model PID/QEAA/non-qualified EAA a české infrastrukturní předpoklady.
4. Sjednotit politiku status listu/cache a model obnovy.
5. Přestavět navigaci podle hlavní user journey.
6. Doplnit vybrané mezery ekosystému podle schváleného rozsahu.

## Primární zdroje

- [Nařízení eIDAS, ve znění nařízení (EU) 2024/1183](https://eur-lex.europa.eu/eli/reg/2024/1183/oj)
- [Prováděcí nařízení Komise (EU) 2025/848](https://eur-lex.europa.eu/eli/reg_impl/2025/848/oj)
- [EUDI Wallet Architecture and Reference Framework 2.8.0](https://eu-digital-identity-wallet.github.io/eudi-doc-architecture-and-reference-framework/2.8.0/architecture-and-reference-framework-main/)
- [OpenID for Verifiable Credential Issuance 1.0](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html)
- [Ministerstvo vnitra ČR — změny právní úpravy zbraní od 1. 1. 2026](https://mv.gov.cz/clanek/hlavni-zmeny-v-pravni-uprave-na-useku-zbrani-streliva-a-munice-od-1-ledna-2026)
- [DIA — EUDIW v ČR](https://eudiw.dia.gov.cz/cs)
