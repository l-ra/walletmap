# Instrukce pro agenty (WalletMap.eu)

Tento soubor popisuje pravidla repozitáře, která musí agent dodržovat při generování nebo úpravě obsahu.

## Zkratky ve Markdownu (povinné)

WalletMap používá **centrální slovník zkratek** a syntaxi `[[ZKRATKA]]`. Každá zkratka ze slovníku v textu **musí** být takto označena — build jinak selže.

### Syntaxe

| Zápis | Význam |
|-------|--------|
| `[[PID]]` | Zkratka ze slovníku, zobrazí se `PID` |
| `[[WRPRC\|reg. certifikát]]` | Vlastní zobrazení, slovník stále `WRPRC` |

### Povinný postup při psaní obsahu

1. **Před psaním** načti seznam zkratek z [`src/data/glossary.json`](src/data/glossary.json) (klíče objektu = platné ID).
2. **Každý výskyt** zkratek ze slovníku v prose (články, scénáře) piš jako `[[ID]]`, ne jako tučný text `**PID**` ani s ruční expanzí v závorkách.
3. **Nová zkratka** — nejdřív přidej položku do `src/data/glossary.json` (povinná pole: `abbr`, `fullName.cs`, `shortDescription`), teprve pak použij `[[NOVA_ZKRATKA]]` v Markdownu.
4. **Po úpravách** spusť `npm run build` — neznámá `[[ZKRATKA]]` způsobí chybu buildu.

### Co anotovat

- Zkratky a termíny, které **jsou ve slovníku** (EUDIW, PID, OID4VP, WRPRC, …).
- Opakované výskyty — každý výskyt označ zvlášť (`[[PID]]` … `[[PID]]`).

### Co neanotovat

- Kód, názvy polí, algoritmy: `` `ES256` ``, `` `jwk` ``, `` `cnf` ``, `` `typ: rc-wrp+jwt` ``.
- Obsah code blocků a inline kódu.
- Zkratky **mimo slovník** — nepoužívej `[[…]]`; napiš plný termín nebo běžný text.
- Frontmatter (YAML) — metadata neprocházejí glossary pluginem.
- URL a názvy externích specifikací v odkazech, pokud nejsou ve slovníku.

### Aktuální seznam zkratek (ID ve slovníku)

```
ACA, CIR, EUDIW, JWE, JWS, KA, LoTE, OID4VCI, OID4VP, PAR, PID, RP,
SD-JWT-VC, Verifier, WIA, WRPAC, WRPRC, WSCD, WUA, eIDAS
```

> Seznam se mění — vždy ověř aktuální obsah `src/data/glossary.json`.

### Příklady

**Správně:**

```markdown
Klub zahájí [[OID4VP]] transakci a ověří [[PID]] závodníka vůči [[LoTE]].
Access certifikát instance je [[WRPAC]]; registrace intended use je ve [[WRPRC]].
```

**Špatně:**

```markdown
Klub zahájí **OID4VP** transakci.
PID (Person Identification Data) slouží k ověření.
[[ES256]]  <!-- ES256 není ve slovníku -->
```

### Migrace starého obsahu

Skript `node scripts/migrate-glossary.mjs` převádí `**ZKRATKA**` → `[[ZKRATKA]]` pro zkratky ve slovníku. Po ručních úpravách spusť build.

### Související soubory

| Soubor | Účel |
|--------|------|
| [`src/data/glossary.json`](src/data/glossary.json) | Slovník — jediný zdroj pravdy |
| [`src/plugins/remark-glossary.ts`](src/plugins/remark-glossary.ts) | Transformace `[[…]]` při buildu |
| [`docs/zkratky.md`](docs/zkratky.md) | Podrobný popis pro autory |
| [`src/pages/slovnik-zkratek/`](src/pages/slovnik-zkratek/) | Veřejná stránka se seznamem |

## Obsah projektu

- **Články:** `src/content/articles/*.md`
- **Scénáře:** `src/content/scenarios/*.md` (frontmatter dle `src/content/config.ts`)
- **Jazyk obsahu:** čeština
- **Build:** Astro 5, statický web; `npm run build`

## Obecná pravidla

- Minimální rozsah změn — neměň nesouvisející soubory.
- Konvence repozitáře: existující styl Markdownu, `<details>` pro prohloubení, frontmatter dle schématu.
- Po editaci obsahu se zkratkami vždy ověř build.
