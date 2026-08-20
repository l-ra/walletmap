---
title: "Legislativní harmonogram EUDIW — termíny nařízení a prováděcích předpisů"
description: "Přehled klíčových termínů z nařízení eIDAS 2.0 (EU 2024/1183) a prováděcích předpisů: od účinnosti technických specifikací po povinnost nabídnout peněženku a akceptovat ji u relying parties."
pubDate: 2026-08-20
tags: [eidas, eudiw, legislativa, harmonogram, rp, pid]
draft: false
---

Evropský rámec digitální identity ([[eIDAS]] 2.0, nařízení (EU) 2024/1183) nestanoví jen *co* má [[EUDIW]] umět, ale i *kdy*. Většina praktických termínů se odvíjí od **účinnosti klíčových prováděcích předpisů k peněžence** — to je právní kotva, od které běží 24měsíční a 36měsíční lhůty.

Tento článek shrnuje harmonogram tak, jak vyplývá z nařízení a zveřejněných prováděcích předpisů v Úředním věstníku EU. U termínů „přijetí“ jde o datum publikace v Úř. věstníku (případně účinnost D+20); u termínů „splnění povinnosti“ vycházíme z článků samotného nařízení.

## Kotva časové osy: 24. prosince 2024

Dne **4. prosince 2024** Komise publikovala v Úř. věstníku první balík prováděcích předpisů k peněžence (mj. IR (EU) 2024/2977, 2979, 2980, 2981, 2982). Všechny nabývají účinnosti **20. den po publikaci**, tedy **24. prosince 2024**.

Od tohoto data se počítají:

| Termín | Právní základ | Co se týká |
|--------|---------------|------------|
| **24. 12. 2026** | čl. 5a odst. 1 nařízení (EU) 2024/1183 | Každý členský stát musí nabídnout **alespoň jednu certifikovanou** [[EUDIW]] občanům, rezidentům a právnickým osobám (24 měsíců od účinnosti IR podle čl. 5a odst. 23 a 5c odst. 6). |
| **24. 12. 2027** | čl. 5f odst. 2 | Soukromé [[RP\|spolehlivé strany]] v regulovaných odvětvích (bankovnictví, energie, zdravotnictví, telekomunikace, doprava, vzdělávání aj.) a subjekty mimo mikro-/malé podniky, které **musí** používat silnou autentizaci, musí na **dobrovolnou žádost uživatele** akceptovat [[EUDIW]] (36 měsíců od účinnosti týchž IR). |
| **24. 12. 2027** | čl. 5f odst. 3 | Velmi velké online platformy (VLOP dle DSA) musí u autentizace uživatelů rovněž umožnit použití [[EUDIW]] — opět jen na žádost uživatele a v rozsahu nezbytných dat. |

> **Poznámka:** Komise termíny popisuje i jako „konec 2026“ resp. „konec 2027“. Kalendářní datum **24. prosince** odpovídá přesnému výpočtu 24/36 měsíců od 24. 12. 2024.

## Přehled termínů podle fáze

### 1. Základní nařízení (2024)

| Datum | Událost |
|-------|---------|
| **30. 4. 2024** | Publikace nařízení (EU) 2024/1183 v Úř. věstníku — evropský rámec digitální identity a [[EUDIW]]. |
| **20. 5. 2024** | Účinnost nařízení (20. den po publikaci). |
| **21. 11. 2024** | Legislativní lhůta pro Komisi k přijetí klíčových prováděcích předpisů k peněžence (čl. 5a odst. 23, 5b odst. 11, 5c odst. 6 aj.). |

### 2. První balík prováděcích předpisů k peněžence (2024)

Přijaty **28. 11. 2024**, publikovány **4. 12. 2024**, účinnost **24. 12. 2024**:

| IR | Téma |
|----|------|
| **2024/2977** | [[PID]] a elektronické atestace atributů vydávané do peněženky |
| **2024/2979** | Integrita a základní funkce peněženky |
| **2024/2982** | Protokoly a rozhraní ([[OID4VCI]], [[OID4VP]], mazání dat, hlášení) |
| **2024/2981** | Certifikace peněženek |
| **2024/2980** | Notifikace ekosystému (registry [[RP]], poskytovatelé, validace) |

Tyto akty převádějí požadavky nařízení do závazných technických specifikací. ARF zůstává informativní referenční rámec; **právně závazné jsou právě tyto IR**.

### 3. Registrace relying parties a důvěryhodné služby (2025)

| Datum | IR / událost | Co se týká |
|-------|--------------|------------|
| **6. 5. 2025** (publikace 7. 5., účinnost **27. 5. 2025**) | **2025/848** | Pravidla registrace wallet-[[RP]] — národní registry, proces registrace, vazba na [[WRPRC]]. |
| **29. 7. 2025** (publikace 30. 7., účinnost **19. 8. 2025**) | Balík 7 IR pro QTSP | Nové/konsolidované požadavky na kvalifikované důvěryhodné služby (mj. ověřování identity při vydávání certifikátů a kvalifikovaných atestací — **2025/1566**, kvalifikované atestace atributů — **2025/1569**, správa vzdálených QSCD — **2025/1567**, zahájení poskytování QTSP — **2025/1572**). |
| **19. 8. 2026** | Aplikace vybraných ustanovení | Např. čl. 6–9 IR 2025/1569 (kvalifikované atestace), IR 2025/1572 (oznámení záměru poskytovat QTSP). |
| **19. 8. 2027** | Aplikace dalších ustanovení | Např. IR 2025/1566 (identity proofing dle ETSI TS 119 461), IR 2025/1567 (správa vzdálených podpisových zařízení). |

### 4. Doplňující specifikace peněženky (2026)

| Datum | IR | Co se týká |
|-------|-----|------------|
| **7. 4. 2026** (publikace 8. 4., účinnost **28. 4. 2026**) | **2026/798** | Vzdálený onboarding uživatelů na [[EUDIW]] — kombinace eID na úrovni substantial + doplňkové procedury pro dosažení úrovně **high** (čl. 5a odst. 24). |
| **21. 5. 2026** | — | Lhůta pro zprávu Komise o přezkumu uplatňování nařízení (čl. 49). |
| **15. 7. 2026** (publikace 22. 7., účinnost **11. 8. 2026**) | **2026/1730**, **2026/1731**, **2026/1735** | Aktualizace technických standardů vůči vývoji ARF — registrace [[RP]] (1730/848), specifikace peněženky (1731 mění 2024/2977–2982), kvalifikované atestace (1735). |

Prováděcí předpisy se průběžně **novelizují** (typicky 1× ročně), aby reflektovaly ARF a ETSI/OpenID specifikace. To nemění hlavní termíny 2026/2027, ale implementátoři musí sledovat consolidované znění IR.

## Povinnosti mimo „tvrdé“ kalendářní milníky

Některé povinnosti nejsou vázány na 24/36měsíční lhůty, ale platí souběžně s dostupností peněženek:

| Povinnost | Právní základ | Vysvětlení |
|-----------|---------------|------------|
| Akceptace [[EUDIW]] ve veřejném sektoru | čl. 5f odst. 1 | Kde stát vyžaduje elektronickou identifikaci k online službě veřejné správy, musí akceptovat i peněženku. |
| Registrace [[RP]] | čl. 5b | Subjekt, který chce spoléhat na peněženku, se registruje v členském státě sídla — před praktickou integrací (typicky [[OID4VP]] + [[WRPRC]]). |
| Kvalifikovaný elektronický podpis zdarma | čl. 5a odst. 5 | Peněženka musí umožnit vytváření QES pro **nepředprofesionální** účely; stát může stanovit přiměřená omezení. |
| Dobrovolnost pro uživatele | čl. 5a odst. 15 | Použití peněženky není povinné; služby musí zůstat dostupné i jinými prostředky. |

## Co z harmonogramu plyne pro praxi

```text
2024 ──► IR k peněžence (účinnost 24. 12.)
           │
           ├── 24 měsíců ──► státy nabídnou EUDIW (24. 12. 2026)
           │
           └── 36 měsíců ──► regulované RP + VLOP akceptují (24. 12. 2027)
```

1. **Poskytovatelé peněženek** (stát nebo certifikovaný soukromý subjekt) staví proti IR 2024/2977–2982 a jejich novelizacím; certifikace dle 2024/2981.
2. **Vydavatelé [[PID]] a atestací** se řídí IR k datovým formátům a protokolům ([[OID4VCI]]); onboarding dle IR 2026/798.
3. **[[Verifier\|Ověřovatelé]] / [[RP]]** v regulovaných sektorech plánují integraci nejpozději s ročním předstihem před 24. 12. 2027 — registrace dle 2025/848, technicky [[WRPRC]]/[[WRPAC]] a [[OID4VP]].

## Omezení a nejistoty

- **Rozdílná připravenost členských států** — právní termín 24. 12. 2026 je jednotný, ale reálné nasazení se v jednotlivých zemích liší (piloty, postupné rollouty).
- **Aktualizace IR** — technické specifikace se mění; sledujte consolidované znění na EUR-Lexu a týdenní vývoj ARF na WalletMap.
- **Výjimky** — mikro- a malé podniky nejsou v čl. 5f odst. 2 zahrnuty; u veřejného sektoru platí čl. 5f odst. 1 bez 36měsíční lhůty.

## Zdroje

- [Nařízení (EU) 2024/1183](https://eur-lex.europa.eu/eli/reg/2024/1183/oj) — eIDAS 2.0 / evropský rámec digitální identity
- [IR (EU) 2024/2977–2982](https://digital-strategy.ec.europa.eu/en/library/implementing-regulation-european-digital-identity-wallets) — první balík specifikací peněženky (prosinec 2024)
- [IR (EU) 2025/848](https://eur-lex.europa.eu/eli/reg_impl/2025/848/oj) — registrace wallet-RP
- [IR (EU) 2026/798](https://eur-lex.europa.eu/eli/reg_impl/2026/798/oj) — vzdálený onboarding
- [Portál EUDI Wallet](https://digital-identity-wallet.europa.eu/) — strategie a implementace

---

*Poslední aktualizace: 20. srpna 2026. Harmonogram vychází z publikovaných textů v Úř. věstníku EU; u novelizací prováděcích předpisů doporučujeme ověřit aktuální consolidované znění.*
