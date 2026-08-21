---
title: "Jaké atestace lze v EUDI Wallet vydávat — vazby, jednorázovost a omezená audience"
description: "Mapa stupňů volnosti při vydávání PID a EAA: právní kategorie, user/device binding, jednorázové použití, omezení audience a bezpečnostní vlastnosti — ukázané na konkrétních use case až na úroveň claimů a protokolů."
pubDate: 2026-08-21
tags: [eidas, eudiw, eaa, qeaa, vazby, oid4vci, sd-jwt-vc, atestace]
draft: false
---

Vydavatel v ekosystému [[EUDIW]] nenastavuje jen „jaká data budou v průkazu“. Každá atestace je kombinací **právní kategorie**, **vazby na osobu a zařízení**, **pravidel opakovaného použití** a **omezení, kdo ji smí přijmout**. Tento článek nejdřív vypíše tyto stupně volnosti a potom na konkrétních situacích ukáže, **který problém které nastavení řeší** — až na úroveň claimů, metadat a protokolů.

Rozlišujeme dvě vrstvy, které se v praxi často slévají do slova „atestace“:

| Vrstva | Co atestuje | Kdo vydává | Příklad |
|--------|-------------|------------|---------|
| **Atestace atributů** | vlastnosti **subjektu** (osoba, členství, oprávnění) | PID Provider, poskytovatel [[QEAA]] / [[PuB-EAA]] / nevázané [[EAA]] | [[PID]], klubový průkaz, diplom, startovní lístek |
| **Atestace peněženky** | vlastnosti **instance a klíčů** | Wallet Provider | [[WIA]], [[KA]] (společně [[WUA]]) |

Zbytek textu se zabývá první vrstvou — co lze vydat **do** peněženky. Druhá vrstva je nástrojem, kterým vydavatel vynucuje bezpečnostní vlastnosti té první.

Právní kotvy: nařízení [[eIDAS]] 2.0 ((EU) 2024/1183), prováděcí nařízení (EU) 2024/2977 a 2024/2979 ve znění (EU) 2026/1731, (EU) 2025/1569 ve znění 2026/1735. Technicky ARF 3.0.0 (červenec 2026), ETSI TS 119 472-1/3, TS3 ([[WUA]]), [[OID4VCI]] a [[OID4VP]].

## Mapa stupňů volnosti

Níže je přehled os, které vydavatel skládá nezávisle (s výhradami — např. [[PID]] *musí* být device-bound). Nejde o menu „vyber jednu položku“, ale o **kombinaci**.

### 1. Právní kategorie

| Kategorie | Vydavatel | Právní účinek | Typická data |
|-----------|-----------|---------------|--------------|
| [[PID]] | PID Provider (členský stát) | elektronická identifikace, LoA **high** | jméno, datum narození, státní příslušnost |
| [[QEAA]] | QTSP | ekvivalent listiny s kvalifikovaným podpisem / pečetí (příloha V) | diplom, licence, notářská atestace |
| [[PuB-EAA]] | orgán veřejné správy nebo subjekt jejím jménem | ekvivalent úředního výpisu z autentického zdroje (příloha VII) | bydliště, oprávnění, doklady z registru |
| nevázaná [[EAA]] | TSP / soukromý vydavatel | účinek podle smlouvy, rulebooku a důvěry [[RP]] | členský průkaz, vstupenka, zaměstnanecký badge |

Nevázaná [[EAA]] **nemá** unijní povinnost uznání. Důvěra plyne z rulebooku odvětví, registrace vydavatele a z toho, zda ji konkrétní [[RP]] přijme.

### 2. Formát (realizace datového modelu)

ETSI TS 119 472-1 definuje sémantiku jednou a čtyři syntaxe:

| Formát | Role v [[EUDIW]] | Poznámka k omezením použití |
|--------|------------------|------------------------------|
| [[SD-JWT-VC]] (`dc+sd-jwt`) | hlavní formát pro vzdálené toky | **neobsahuje** claim audience (viz osa 8) |
| ISO/IEC mdoc (18013-5 / 23220) | proximity + distanční mdoc | audience **také ne**; `oneTime` jako CBOR prvek |
| JSON-LD W3C VC | alternativní profil | audience ne; `oneTime` boolean |
| X.509 Attribute Certificate | mimo hlavní wallet toky | **jediný** profil, který smí nést audience v certifikátu |

Modelový klub i většina evropských rulebooků dnes počítají s [[SD-JWT-VC]] a mdoc.

### 3. Vazba na subjekt (user / holder binding)

*Komu atributy patří — a jak to ověřovatel pozná.*

| Režim | Co je v atestaci | Kdy dává smysl |
|-------|------------------|----------------|
| **Identifikátor subjektu** | `sub` / národní identifikátor | [[QEAA]] a [[PuB-EAA]] *musí* mít identifikátor **nebo** jasně označený pseudonym |
| **Pseudonym** | `also_known_as` / `sub_aka` | opakovaný vztah k jedné [[RP]] bez globálního ID |
| **Claim binding** | atributy samy identifikují osobu (jméno + datum narození) | doklad, který má fungovat i bez kryptografického klíče |
| **Key binding** | `cnf` s veřejným klíčem držitele | device-bound atestace; důkaz držení při prezentaci |
| **Bez vazby na osobu** | jen atribut („věk ≥ 18“), bez `sub` | nevázaná [[EAA]]; u [[QEAA]]/[[PuB-EAA]] zakázáno |

ETSI (EAA-4.5): key binding **má být**; v odůvodněných případech stačí claim binding nebo přímá identifikace subjektu.

### 4. Vazba na zařízení (device binding)

*Z kterého hardware smí držitel atestaci předložit.*

| Režim | Technicky | Důsledek |
|-------|-----------|----------|
| **Device-bound na [[WSCD]]** | `cnf` + [[KA]] s `key_storage: iso_18045_high` | nelze zkopírovat na jiný telefon; povinné u [[PID]] |
| **Device-bound na keystore** | `cnf` + [[KA]] s nižší úrovní (`moderate` … `basic`) | stále vázáno na zařízení, nižší odolnost vůči útoku |
| **Non-device-bound** | bez `cnf`, bez [[KA]] | lze exportovat v migračním objektu; [[RP]] může kopii zneužít |

[[WIA]] se posílá **vždy** (i u non-device-bound). [[KA]] jen u device-bound. Prováděcí nařízení 2026/1731 to kodifikuje jako TR-WIA-1 / TR_KA-1 / TR_KA-1.1.

ARF ISSU_27: poskytovatel atestací **má** device binding implementovat; u ISO mdoc je povinný (mdoc authentication). U [[PID]] je povinný vždy (ISSU_17, čl. 3 odst. 5 IR 2024/2977).

### 5. Bezpečnostní vlastnosti úložiště a autentizace uživatele

Při vydání je signalizuje [[KA]]; při prezentaci je vynucuje [[WSCD]] / keystore.

| Claim v [[KA]] | Stupně (OpenID4VCI Appendix D.2 / ISO 18045) | Co řeší |
|----------------|-----------------------------------------------|---------|
| `key_storage` | `iso_18045_high` / `moderate` / `enhanced-basic` / `basic` / `none` | odolnost úložiště soukromého klíče (AVA_VAN.5 … žádná certifikace) |
| `user_authentication` | stejná škála | jak silně musí uživatel odemknout klíč před podpisem prezentace |

U [[PID]] a kritických aktiv platí WIAM_14: [[WSCD]] autentizuje uživatele na **LoA high**, než provede kryptografickou operaci s klíčem. U atestací s úrovní High totéž (WIAM_14b), ale už se nemluví o LoA — ten termín je v [[eIDAS]] vyhrazen elektronickým identifikačním prostředkům, tedy [[PID]].

Odemčení nižších atestací stačí OS multi-faktor (WIAM_15) a volitelný PIN peněženky (WIAM_15b).

### 6. Kolikrát smí peněženka tutéž *technickou* atestaci ukázat

ARF ISSU_37–57 a `credential_reuse_policy` v ETSI TS 119 472-3. Cíl je **unlinkabilita mezi [[RP]]**, ne „lístek na jeden koncert“.

| Metoda | Chování peněženky | Parametry metadat |
|--------|-------------------|-------------------|
| **A — once-only** | dávka unikátních instancí; každou ukáže **jednou** | `batch_size`, `reissue_trigger_unused` |
| **B — limited-time** | jedna instance, opakovaně do `exp` | `reissue_trigger_lifetime_left` |
| **C — rotating-batch** | dávka v náhodném pořadí, po vyčerpání znovu od začátku | `batch_size` + lifetime trigger |
| **D — per-relying-party** | jiná instance každé [[RP]]; téže [[RP]] smí znovu tutéž | mix A (mezi RP) a B (uvnitř RP) |

Peněženka **musí** umět A a B; C a D jsou volitelné. Vydavatel v metadatech uvede aspoň A **nebo** B, seřazené podle preference. [[WIA]]/[[KA]] samy používají metodu A (každá se smí odeslat jen jednou).

### 7. Signál jednorázového použití (`oneTime`)

Samostatná osa — **není totéž** jako metoda A.

| | Metoda A (`once_only`) | Claim `oneTime` |
|--|------------------------|-----------------|
| Kde žije | metadata vydavatele + chování peněženky | **uvnitř** atestace |
| Koho váže | peněženku (kterou instanci vybere) | [[RP]] / [[Verifier\|ověřovatele]] |
| Význam | každá technická instance jen jednou, kvůli linkabilitě | „použij jednou a **neuchovávej**“ |
| Fallback | offline se spadne na metodu B | žádný — jde o závazek příjemce |

V [[SD-JWT-VC]] je `oneTime` claim s JSON `null` (přítomnost = platnost omezení). V mdoc boolean v namespace `org.etsi.01947201.010101`. V X.509 AC rozšíření `etsi-eaaOneTimeUse`.

### 8. Omezení audience (kdo smí atestaci přijmout)

Tři různé mechanismy, které se nesmějí zaměňovat:

```text
1. Audience v atestaci (ETSI 4.2.9.2)
   „tento artefakt je určen jen těmto RP / skupinám RP“
        │
        ├── X.509 AC: targetInformation (RFC 5755)
        └── SD-JWT VC, mdoc, JSON-LD: ZAKÁZÁNO
            (náhrada: embedded disclosure policy + registrace RP)

2. Audience prezentace (KB-JWT / mdoc session)
   „tento konkrétní důkaz držení je pro tebe, teď, s tímto nonce“
        └── aud + nonce v key-binding JWT — vždy u device-bound prezentace

3. Audience chováním peněženky (metoda D)
   „každé RP jiná technická instance“
        └── unlinkabilita, ne zákaz předložení jiné RP
```

K tomu wallet politika z [[WRPRC]]: peněženka varuje / blokuje, když [[RP]] žádá atributy mimo registrované intended use. To omezuje **dotaz**, ne vydaný artefakt.

### 9. Platnost a revokace

| Mechanismus | Kdy |
|-------------|-----|
| **Administrativní platnost** (`adm_nbf` / `adm_exp`, nebo atributy `valid_from`) | „diplom platí od promocí“, „členství do 31. 12.“ |
| **Technická platnost** (`nbf` / `exp`) | jak dlouho smí peněženka artefakt předložit; u [[PID]]/[[EAA]] vždy |
| **`shortLived`** | platnost tak krátká, že se **nekontroluje revokace** (ARF: ≤ 24 h) |
| **Status list / identifier list** | povinné u ne-short-lived [[QEAA]] a [[PuB-EAA]] |
| **Žádná revokace** | nevázaná [[EAA]] — podle rulebooku |

### 10. Další osy (stručně)

- **Selektivní sdílení** — `_sd` / disclosures v [[SD-JWT-VC]], issuer-signed items v mdoc.
- **Evidence** — volitelný claim `evidence` (čím vydavatel ověřil atributy).
- **Šifrování vydání** — [[JWE]] credential response, pokud issuer vyžaduje.
- **Dávkové vydání** — více technických instancí v jednom [[OID4VCI]] credential requestu (`proofs` pole).

---

Následující kapitoly berou **konkrétní problém** a složí z os výše nastavení, které ho řeší. Technický drilldown je v `<details>`. Příklady navazují na [model střeleckého klubu](/scenare/strelecky-klub/prehled-modelu) i na běžné eIDAS scénáře mimo něj.

## 1. Totožnost závodníka — maximální vazba na osobu i zařízení

**Problém.** Klub při [registraci závodníka](/scenare/strelecky-klub/registrace-zavodnika) musí vědět, že doklad patří **této** osobě a že ho nelze opsat z screenshotu nebo z exportovaného souboru. Současně nesmí zbytečně linkovat návštěvy u jiných [[RP]].

**Nastavení.** [[PID]] (ne [[EAA]]), device-bound na [[WSCD]], user authentication LoA high, metoda A (once-only) nebo D, bez `oneTime` (klub si [[PID]] v rámci relace ověří, ale nejde o lístek „použij a smaž“), bez audience v credentialu.

```text
osa 1  PID
osa 3  key binding (cnf) + identifikační atributy
osa 4  WSCD (povinné)
osa 5  key_storage + user_authentication = iso_18045_high
osa 6  once-only (A) — každá prezentace jiná technická instance
osa 7  oneTime chybí
osa 8  audience jen v KB-JWT (relace), ne v PID
osa 9  status list + povinné sledování revokace WIA/KA každých 24 h
```

**Proč zrovna toto.** IR 2024/2977 ukládá PID Providerovi kryptografickou vazbu na wallet unit. Bez `cnf` by ověřovatel přijal kopii. Bez LoA high by to nebyl identifikační prostředek. Metoda A brání tomu, aby si dva pořadatelé závodů spojili „stejný hash PID“ napříč sezónou.

<details>
<summary>Drilldown — vydání PID ([[OID4VCI]] + TS3)</summary>

Peněženka posílá [[WIA]] v [[PAR]] a token requestu (OAuth Client Attestation) a [[KA]] v `proofs` credential requestu. Issuer ověří obě vůči Trusted List poskytovatelů peněženek a naváže `cnf` na `attested_keys[0]`.

```json
{
  "credential_configuration_id": "eu.europa.ec.eudi.pid.1",
  "proofs": {
    "jwt": [
      "eyJ0eXAiOiJvcGVuaWQ0dmNpLXByb29mK2p3dCIsImFsZyI6IkVTMjU2Iiwia2V5X2F0dGVzdGF0aW9uIjoiLi4uIn0.eyJhdWQiOiJodHRwczovL3BpZC1pc3N1ZXIuZXhhbXBsZS5jeiIsIm5vbmNlIjoiLi4uIn0.sig"
    ]
  }
}
```

Metadata vydavatele vynucují úroveň úložiště:

```json
{
  "proof_types_supported": {
    "jwt": {
      "proof_signing_alg_values_supported": ["ES256"],
      "key_attestation_required": {
        "key_storage": ["iso_18045_high"],
        "user_authentication": ["iso_18045_high"]
      }
    }
  }
}
```

Zjednodušený payload vydaného [[PID]] ([[SD-JWT-VC]]):

```json
{
  "iss": "https://pid-issuer.example.cz",
  "vct": "urn:eudi:pid:1",
  "nbf": 1781366400,
  "exp": 1781452800,
  "given_name": "Jan",
  "family_name": "Novák",
  "birth_date": "1991-04-12",
  "cnf": {
    "jwk": {
      "kty": "EC",
      "crv": "P-256",
      "x": "…",
      "y": "…"
    }
  },
  "status": {
    "status_list": {
      "idx": 412,
      "uri": "https://pid-issuer.example.cz/status/pid/7"
    }
  }
}
```

`exp` zde je **technická** platnost (často hodiny až dny, s re-issuance na pozadí). Administrativní totožnost člověka z ní neplyne.

Při prezentaci ([[OID4VP]]) peněženka přidá key-binding JWT podepsaný klíčem z `cnf`:

```json
{
  "iat": 1781367000,
  "aud": "https://verifier.walletmap-club.cz",
  "nonce": "n-0S6_WzA2Mj",
  "sd_hash": "…hash předloženého SD-JWT…"
}
```

`aud` + `nonce` vážou **tuto relaci** na klub, ne PID na klub navždy. Klub ověří podpis vůči `cnf`, čerstvost nonce, status list a (u high) že šlo o prezentaci z [[WSCD]] — implicitně, protože `cnf` bylo při vydání atestováno [[KA]].

</details>

Související scénáře: [Státní doklady](/scenare/strelecky-klub/statni-doklady-pid-zbrojak), [WIA/KA při vydání](/scenare/strelecky-klub/issuer-prohloubeni-vydavani#wua-wia-ka).

## 2. Klubový průkaz — opakovaný přístup, stále vázaný na telefon

**Problém.** Zámek střeliště ptá se na `status` a `roles` desítkykrát za sezonu, často offline. Člen nemá doklad posílat e-mailem kamarádovi. Ztráta telefonu nesmí znamenat, že kdokoli se starým souborem projde turniketem.

**Nastavení.** Nevázaná [[EAA]] (`ClubMembership`), device-bound, úroveň keystore nebo [[WSCD]] podle risk analysis klubu, **metoda B** (limited-time), bez `oneTime`, bez audience v credentialu, roční administrativní platnost + status list.

```text
osa 1  non-qualified EAA
osa 3  cnf + jméno (claim binding jako doplněk, ne náhrada)
osa 4  device-bound (cnf)
osa 5  např. key_storage high, user_authentication moderate
osa 6  limited-time (B) — totéž technické VC na každé kontrole
osa 9  Token Status List; WIA/KA chaining volitelný
```

**Proč ne metoda A.** U turniketu je žádoucí, aby si střelnice *mohla* poznat vracejícího se člena (stejný `cnf` / stejný `member_id`). Unlinkabilita mezi *různými* kluby se řeší tím, že každý klub vydává vlastní `vct`, ne dávkou PID-like instancí.

<details>
<summary>Drilldown — metadata reuse policy a vydaný ClubMembership</summary>

```json
{
  "credential_configurations_supported": {
    "club_membership_sd_jwt": {
      "format": "dc+sd-jwt",
      "vct": "urn:walletmap:club:membership:1",
      "cryptographic_binding_methods_supported": ["jwk"],
      "credential_metadata": {
        "credential_reuse_policy": {
          "id": "arf_annex_ii",
          "options": [
            {
              "details": ["limited-time"],
              "reissue_trigger_lifetime_left": 604800
            }
          ]
        }
      },
      "proof_types_supported": {
        "jwt": {
          "proof_signing_alg_values_supported": ["ES256"],
          "key_attestation_required": {
            "key_storage": ["iso_18045_high"],
            "user_authentication": ["iso_18045_moderate"]
          }
        }
      }
    }
  }
}
```

`reissue_trigger_lifetime_left: 604800` = peněženka požádá o nové vydání týden před `exp`. Členský vztah (`valid_until` 31. 12.) je **administrativní** atribut, ne JWT `exp`.

```json
{
  "iss": "https://issuer.walletmap-club.cz",
  "vct": "urn:walletmap:club:membership:1",
  "nbf": 1767225600,
  "exp": 1767830400,
  "adm_nbf": 1767225600,
  "adm_exp": 1798761599,
  "member_id": "SK-2026-0042",
  "status": "aktivní",
  "roles": ["správce střelnice"],
  "cnf": { "jwk": { "kty": "EC", "crv": "P-256", "x": "…", "y": "…" } }
}
```

Technické `exp` je týden; administrativní členství rok. Bez `cnf` by šlo průkaz přeposlat. S `cnf` zámek ověří KB-JWT; bez soukromého klíče v [[WSCD]] je soubor k ničemu.

Při [obnově peněženky](/scenare/strelecky-klub/zalohovani-a-obnova-penazenky) klub **vydá nový** průkaz s novým `cnf` a starý zrevokuje — klíče ze starého telefonu se nepřenášejí.

</details>

## 3. Věk u vstupu na akci — unlinkabilita mezi pořadateli

**Problém.** Pořadatel potřebuje „je starší 18 let“, nic víc. Dva pořadatelé, kteří si vymění logy, **nemají** poznat, že šlo o tutéž osobu. Screenshot ani kopie souboru nestačí.

**Nastavení.** Nevázaná [[EAA]] nebo [[PuB-EAA]] s jediným selektivně sdíleným atributem `age_over_18`, **bez** stabilního `sub`/`member_id` v prezentaci, device-bound, **metoda A**, bez `oneTime` (pořadatel smí výsledek kontroly zaznamenat podle vlastní politiky — omezení „neuchovávej artefakt“ by bylo `oneTime`).

Tady metoda A řeší **korelační útok**, `oneTime` by řešil **zákaz retence** u příjemce. Jsou to různé hrozby.

<details>
<summary>Drilldown — dávka once-only a herd privacy</summary>

Metadata:

```json
{
  "credential_reuse_policy": {
    "id": "arf_annex_ii",
    "options": [
      {
        "details": ["once_only"],
        "batch_size": 10,
        "reissue_trigger_unused": 2
      }
    ]
  }
}
```

Peněženka v jednom credential requestu pošle až 10 proofů (10 klíčů, 10 [[KA]]-vázaných `cnf`). Issuer vrátí 10 [[SD-JWT-VC]] se **stejnými atributy**, ale různými:

- `cnf` (jiný klíč),
- salt u každého disclosure,
- podpisem,
- `status` indexem.

ISSU_36: časová razítka v dávce nesmějí být tak přesná, aby dva ověřovatelé poznali „tyto dva tokeny vznikly ve stejné vteřině, tedy patří k sobě“ — herd privacy.

Při prezentaci peněženka vybere **ještě nepoužitou** instanci. Dojdou-li a zařízení je offline, ISSU_47 spadne na metodu B (znovu použije už použitou) a uživatele varuje.

`age_over_18` jako selektivní disclosure: v JWT zůstane jen `_sd` digest, hodnota cestuje mimo podpis v disclosure poli. [[RP]] nevidí datum narození.

</details>

## 4. Startovní lístek — jednorázovost a omezená audience

**Problém.** Lístek na Jarní pohár 2026 má platit **jen ten den**, **jen na této soutěži**, a rozhodčí si ho nemá odnést v telefonu jako trvalý doklad totožnosti závodníka. Přeposlání kamarádovi je zneužití.

Tohle je jediný běžný klubový případ, kde se osy 6, 7 a 8 **potkávají**, ale každá řeší jinou část:

| Hrozba | Osa | Nastavení |
|--------|-----|-----------|
| totéž `entry_id` u dvou rozhodčích = tracking závodníka | 6 | metoda A, nebo krátké `exp` |
| rozhodčí si lístek uloží a předkládá ho dál jako by byl držitel | 4 + 7 | device-bound `cnf` **a** `oneTime` (zákaz retence u [[RP]]) |
| lístek použit u jiného klubu / jiné soutěže | 8 | audience **nejde** dát do [[SD-JWT-VC]]; prakticky atribut `competition_id` + registrace intended use v [[WRPRC]] |

**Proč audience není claim ve [[SD-JWT-VC]].** ETSI EAA-5.2.8.1-01 výslovně zakazuje komponentu 4.2.9.2 v tomto formátu. Omezení „jen tito ověřovatelé“ se má řešit **embedded disclosure policy** a **registrací [[RP]]** (jaké `vct` a claimy smí žádat), ne polem `aud` ve vydaném VC.

`aud` v KB-JWT je zase jen relace: „podpis dnes patří rozhodčímu X“, ne „tento lístek nikdy nesmí vidět nikdo jiný“.

<details>
<summary>Drilldown — `oneTime`, `shortLived` a náhrada audience</summary>

Payload startovního lístku:

```json
{
  "iss": "https://issuer.walletmap-club.cz",
  "vct": "urn:walletmap:club:entry:1",
  "nbf": 1773532800,
  "exp": 1773619200,
  "oneTime": null,
  "shortLived": null,
  "competition_id": "COMP-CZ-260315",
  "discipline": "IPSC Production",
  "cnf": { "jwk": { "kty": "EC", "crv": "P-256", "x": "…", "y": "…" } }
}
```

Přítomnost `oneTime` (typ `null`) = „použij jednou, neuchovávej“. Přítomnost `shortLived` = netřeba status list (platnost ≤ 24 h). `competition_id` je **atribut**, ne audience: jiný klub technicky *může* lístek kryptograficky ověřit, ale nemá ho v [[WRPRC]] jako povolený `vct`, takže peněženka uživatele při cizím požadavku varuje / odmítne.

Kdyby vydavatel opravdu potřeboval audience **uvnitř artefaktu** (např. closed ecosystem mimo [[EUDIW]] toky), ETSI to umí jen v X.509 AC:

```text
id-ce-targetInformation  (RFC 5755 §4.3.2)
  Target = jména / skupiny relying parties
```

To **není** profil, se kterým klub v [[OID4VP]] počítá.

Registrace rozhodčího jako [[RP]] (zjednodušeně v [[WRPRC]]):

```json
{
  "entitlements": [
    "https://uri.etsi.org/19475/Entitlement/WalletRelyingParty"
  ],
  "credentials": [
    {
      "format": { "dc+sd-jwt": { "vct": "urn:walletmap:club:entry:1" } },
      "claims": ["competition_id", "discipline", "status"]
    }
  ]
}
```

Peněženka porovná DCQL požadavek s tímto seznamem (over-asking). To je **audience na úrovni transakce**, vynucená peněženkou, ne podpisem lístku.

</details>

Související: [Registrace na soutěž](/scenare/strelecky-klub/registrace-na-soutez), [Rozhodčí ověření](/scenare/strelecky-klub/rozhodci-overeni-zavodnika).

## 5. Stále stejná banka, cizí obchody ne — metoda D

**Problém.** Banka chce poznat vracejícího se klienta (SCA, limit převodu). Obchodní rejstřík, e-shop a banka si **nemají** spojit tutéž technickou atestaci. Uživatel nemá spravovat „dávky“ ručně.

**Nastavení.** Device-bound [[PID]] nebo [[QEAA]] KYC, **metoda D** (per-relying-party): každé [[RP]] jiná instance; téže bance smí peněženka ukázat znovu tutéž (uvnitř RP jako metoda B).

```text
osa 6  D = A mezi RP + B uvnitř jedné RP
osa 8  není audience v credentialu; „přiřazení RP“ drží peněženka
```

Peněženka si pamatuje mapu `RP-id → instance` (ISSU_57, identifikátor [[RP]] z presentation requestu / [[WRPAC]]). Uživatel to nevidí (ISSU_41).

<details>
<summary>Drilldown — preference metod v metadatech</summary>

```json
{
  "credential_reuse_policy": {
    "id": "arf_annex_ii",
    "options": [
      {
        "details": ["per-relying-party", "once_only"],
        "batch_size": 8,
        "reissue_trigger_unused": 2,
        "reissue_trigger_lifetime_left": 86400
      }
    ]
  }
}
```

ISSU_40: pole `details` je seřazené podle preference vydavatele. Peněženka, která D umí, použije D; peněženka jen s A a B použije `once_only`. Proto musí být v seznamu vždy A nebo B jako fallback.

Metoda C (rotating-batch) je kompromis: snižuje jistotu korelace, ale tutéž instanci časem znovu použije. Hodí se, když dávka A je drahá (HSM, kiosk) a D peněženka ještě neumí.

</details>

## 6. Diplom a zbrojní oprávnění — [[QEAA]] versus [[PuB-EAA]]

**Problém A.** Univerzita potřebuje, aby diplom **platil u soudu a u zaměstnavatele v jiném členském státě**, i když ho absolvent ukáže z jiného zařízení nebo (výjimečně) mimo peněženku.

**Problém B.** Stát potřebuje, aby zbrojní oprávnění vycházelo z **autentického zdroje**, šlo ho odejmout, a nešlo ho poslat e-mailem kamarádovi na střelnici.

Obě jsou „silné“ atestace, ale skládají osy jinak.

| | Diplom ([[QEAA]]) | Zbrojní oprávnění ([[PuB-EAA]]) |
|--|-------------------|----------------------------------|
| Vydavatel | QTSP / univerzita jako kvalifikovaná služba | veřejný orgán / destinovaný subjekt |
| Identita subjektu | povinný `sub` nebo označený pseudonym | totéž (příloha VII) |
| Podpis | kvalifikovaný podpis / pečeť | certifikát veřejného vydavatele |
| Device binding | **může** být claim-bound (přenositelnost) | **má** být device-bound (zneužití zbraně) |
| `oneTime` | ne — diplom se předkládá opakovaně | ne |
| Status | povinný, pokud není `shortLived` | povinný, pokud není `shortLived` |
| Audience | ne v [[SD-JWT-VC]]; zaměstnavatel se registruje jako [[RP]] | totéž |

**Claim binding bez `cnf`.** ETSI výslovně počítá s tím, že některé [[EAA]] vážou atributy na osobu jménem a datem narození, ne klíčem. Pak odpadá [[KA]], prezentace **nemá** KB-JWT a [[RP]] **může** artefakt zkopírovat (ARF RPA_12: peněženka má uživatele varovat). U diplomu to může být přijatelné — kopie ověřeného diplomu existuje i na papíře. U zbrojního oprávnění ne.

<details>
<summary>Drilldown — povinné prvky QEAA v SD-JWT VC</summary>

Příloha V [[eIDAS]] + ETSI TS 119 472-1 klauzule 5:

```json
{
  "iss": "https://qtsp.univerzita.example",
  "vct": "urn:eudi:diploma:1",
  "category": "urn:etsi:esi:eaa:eu:qualified",
  "sub": "did:example:jan-novak",
  "nbf": 1577836800,
  "exp": 1893456000,
  "adm_nbf": 1577836800,
  "degree": "Ing.",
  "field": "informatika",
  "status": {
    "type": "TokenStatusList",
    "purpose": "revocation",
    "index": 88,
    "uri": "https://qtsp.univerzita.example/status/diploma"
  }
}
```

- `category` odlišuje [[QEAA]] od nevázané [[EAA]] (`urn:etsi:esi:eaa:eu:pub` u [[PuB-EAA]]).
- Bez `cnf` je to claim-bound diplom; s `cnf` device-bound verze do peněženky.
- Podpis JWT musí být kvalifikovaný; v hlavičce řetěz ke kvalifikovanému certifikátu (příloha V písm. g, h).
- Chybí-li `shortLived`, `status` je povinný (QEAA-5.2.10.2-01).

Zbrojní oprávnění v modelu klubu je [[PuB-EAA]] (ne QTSP). Klub ho při registraci závodníka **požaduje** jako [[RP]], nevydává ho — viz [státní doklady](/scenare/strelecky-klub/statni-doklady-pid-zbrojak).

</details>

## 7. Autorizace platby — audience relace a dynamické svázání částky

**Problém.** Banka musí splnit SCA: něco, co uživatel **má** (zařízení), a něco, co **je / zná** (biometrie / PIN), plus **dynamic linking** (podpis patří *této* částce a *tomuto* příjemci, ne replay včerejší prezentace).

**Nastavení.** Device-bound atestace (osa 4–5) + **presentation audience** (osa 8.2), ne issuance audience. `oneTime` může banka chtít jako zákaz retence VP, ale jádro je KB-JWT.

```text
OID4VP request
  nonce, client_id, transaction_data (částka, IBAN)
        │
        ▼
Wallet: user auth na WSCD (WIAM_14 / 14b)
        │
        ▼
KB-JWT: aud = banka, nonce = výzva, sd_hash, transaction_data hash
```

Replay na jinou [[RP]] selže na `aud`. Replay později selže na `nonce`. Změna částky po podpisu selže na vázaných transaction data. To **není** `oneTime` ve vydaném VC a **není** EAA audience.

<details>
<summary>Drilldown — co je v prezentaci, ne ve vydané atestaci</summary>

Vydaná atestace (třeba bankovní SCA credential) vypadá jako běžné device-bound [[SD-JWT-VC]] s `cnf`. Až **prezentace** nese omezení audience:

```json
{
  "iat": 1781367000,
  "aud": "https://bank.example/oid4vp",
  "nonce": "b4d8c0e1",
  "sd_hash": "…",
  "transaction_data_hashes": [
    "sha256-of-amount-and-payee"
  ]
}
```

[[OID4VP]] request zároveň nese identifikaci [[RP]] ([[WRPAC]] podpis requestu). Peněženka ukáže uživateli částku; souhlas odemkne [[WSCD]]. Bez device binding by SCA neměla faktor držení.

</details>

## 8. Atestace bez vazby na zařízení — když kopírovatelnost *je* vlastnost

**Problém.** Potvrzení o zaplaceném startovném má jít přeposlat účetní, nebo diplom má přežít výměnu telefonu bez čekání na univerzitu. Device binding by tady **vadil**.

**Nastavení.** Non-device-bound nevázaná [[EAA]]: bez `cnf`, bez [[KA]], [[WIA]] stále povinná (integrita instance při *vydání*). Metoda B. Peněženka při prezentaci upozorní, že [[RP]] může artefakt zkopírovat (RPA_12).

```text
TR-WIA-1   WIA ano
TR_KA-1.1  KA ne — non-device-bound
ISSU_27    výjimka z doporučeného device binding, podložená rizikem
```

Obnova: celý obsah cestuje v migračním objektu (TS10). Ověřovatel **nemá** KB-JWT — důvěřuje podpisu issueru a případnému status listu, ne důkazu držení klíče.

To je vědomý trade-off: přenositelnost výměnou za možnost replay třetí stranou.

## Srovnání: který problém které nastavení řeší

| Problém | Primární osa | Typické nastavení |
|---------|--------------|-------------------|
| Opsaný soubor / screenshot jako „doklad“ | 4 device binding | `cnf` + [[KA]] + KB-JWT |
| Cizí člověk s ukradeným odemčeným telefonem | 5 user authentication | [[WSCD]] LoA/level high |
| Korelace návštěv u různých [[RP]] | 6 reuse A/C/D | once-only dávka, různé `cnf` |
| [[RP]] si artefakt nechá a hraje si na držitele | 7 `oneTime` + osa 4 | zákaz retence **a** nefunkční kopie bez klíče |
| Atestace jen pro jednu soutěž / jednu [[RP]] | 8 (náhrady) | `vct` + [[WRPRC]] intended use; u X.509 `targetInformation` |
| Dynamic linking platby | 8 prezentace | `aud` + `nonce` + transaction data v KB-JWT |
| Okamžité zneplatnění (vyloučení, ztráta zbraně) | 9 | status list; ne `shortLived` |
| Offline turniket bez status check | 9 | `shortLived` ≤ 24 h **nebo** stažený status list |
| Právní ekvivalence listiny v EU | 1 | [[QEAA]] / [[PuB-EAA]], ne nevázaná [[EAA]] |
| Přeposlání účetní, záloha souboru | 4 off | non-device-bound, varování RPA_12 |
| Vydání do kompromitované aplikace | [[WIA]] | Client Attestation + `client_status` |
| Vydání do slabého keystore | [[KA]] | `key_storage` / `user_authentication` v metadatech |

## Co z toho plyne pro vydavatele

1. **Nezačínejte formátem, ale hrozbou.** Stejný `vct` může být once-only nebo limited-time podle toho, zda [[RP]] mají koludovat, nebo poznávat vracejícího se člena.
2. **`oneTime` ≠ once-only.** První váže příjemce, druhé peněženku. Startovní lístek často chce obojí; [[PID]] chce druhé, ne první.
3. **Audience ve [[SD-JWT-VC]] neexistuje.** Očekávání „lístek jde ověřit jen u nás“ splňte registrací [[RP]], atributem (`competition_id`) a případně metodou D — ne claimem `aud` ve vydaném VC.
4. **Device binding je implicitní zákaz exportu.** Kdo ho zapne, musí umět [nové vydání po ztrátě zařízení](/scenare/strelecky-klub/zalohovani-a-obnova-penazenky).
5. **[[WIA]]/[[KA]] nejsou náhradou právní kategorie.** Říkají, *jak bezpečná je peněženka*, ne *zda jde o kvalifikovanou atestaci*.

## Zdroje

- [Nařízení (EU) 2024/1183](https://eur-lex.europa.eu/eli/reg/2024/1183/oj) — [[eIDAS]] 2.0, přílohy V a VII
- [Prováděcí nařízení (EU) 2024/2977](https://eur-lex.europa.eu/eli/reg_impl/2024/2977/oj) ve znění [2026/1731](https://eur-lex.europa.eu/eli/reg_impl/2026/1731/oj) — [[PID]] a [[EAA]] vydávané do peněženky; TR-WIA / TR_KA
- [Prováděcí nařízení (EU) 2025/1569](https://eur-lex.europa.eu/eli/reg_impl/2025/1569/oj) — [[QEAA]] a [[PuB-EAA]]
- [ARF 3.0.0](https://eudi.dev/latest/) — ISSU_17/27 (device binding), ISSU_37–57 (metody A–D), WIAM_14–15 (user authentication), VCR_01 (revokace / short-lived)
- [ETSI TS 119 472-1 V1.2.1](https://www.etsi.org/deliver/etsi_ts/119400_119499/11947201/01.02.01_60/ts_11947201v010201p.pdf) — sémantika audience, `oneTime`, key binding; profily [[SD-JWT-VC]] / mdoc / X.509
- [ETSI TS 119 472-3](https://www.etsi.org/deliver/etsi_ts/119400_119499/11947203/01.01.01_60/ts_11947203v010101p.pdf) — `credential_reuse_policy`
- [TS3 — Wallet Unit Attestation](https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/blob/main/docs/technical-specifications/ts3-wallet-unit-attestation.md) — [[WIA]] a [[KA]]

---

*Poslední aktualizace: 21. srpna 2026. Vychází z ARF 3.0.0 a publikovaných prováděcích předpisů; u novelizací IR ověřte consolidované znění na EUR-Lexu.*
