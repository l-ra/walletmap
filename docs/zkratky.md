# Zkratky v obsahu WalletMap.eu

Texty na webu používají **anotované zkratky** — čtenář uvidí plný název (tooltip) a může otevřít detail ze slovníku (modal). Tento dokument popisuje, jak zkratky správně psát v Markdownu.

## Rychlý start

1. Ověř, že zkratka existuje v [`src/data/glossary.json`](../src/data/glossary.json).
2. V textu napiš `[[ZKRATKA]]` místo `**ZKRATKA**` nebo „ZKRATKA (dlouhý název…)“.
3. Spusť `npm run build` — neplatná zkratka build zastaví.

Veřejný přehled: [/slovnik-zkratek](https://walletmap.eu/slovnik-zkratek)

## Syntaxe

```markdown
Peněženka ověřuje [[WRPRC]] vůči [[LoTE]].

Volitelně vlastní zobrazení:
Registrace proběhne přes [[WRPRC|registrační certifikát]].
```

## Přidání nové zkratky

Do `src/data/glossary.json` přidej objekt s klíčem = ID (např. `"FOO"`):

```json
"FOO": {
  "abbr": "FOO",
  "fullName": {
    "cs": "Plný název v češtině",
    "en": "Full English name"
  },
  "shortDescription": "Jedna věta pro tooltip a seznam.",
  "longDescription": "Delší popis pro modal.\n\nVíce odstavců oddělených prázdným řádkem.",
  "tags": ["kategorie"],
  "related": ["JINA_ZKRATKA"],
  "sources": [
    { "label": "Norma nebo spec", "url": "https://…" }
  ]
}
```

Povinná pole: `abbr`, `fullName.cs`, `shortDescription`.

Poté v Markdownu použij `[[FOO]]`.

## Kdy zkratku anotovat

| Ano | Ne |
|-----|-----|
| Termín ze slovníku v běžném textu | Inline kód a code bloky |
| Opakované výskyty stejné zkratky | Technické identifikátory mimo slovník (`ES256`, `JWT`) |
| Tabulky a seznamy (prose) | YAML frontmatter |
| | Ruční expanze v závorkách — slovník expanzi nahrazuje |

## Chování na webu

- **Počítač:** najetí myší nebo focus → tooltip s plným názvem → „Více informací“ → modal.
- **Mobil:** klepnutí na zkratku → tooltip → modal.
- **Slovník:** stránka `/slovnik-zkratek` s odkazy do kapitol, kde se zkratka vyskytuje (generuje se při buildu).

## Nástroje

```bash
# Převod starého **ZKRATKA** → [[ZKRATKA]] ve src/content/
node scripts/migrate-glossary.mjs

# Ověření
npm run build
```

## Pro agenty (AI)

Podrobná pravidla pro generování obsahu: [`AGENTS.md`](../AGENTS.md).
