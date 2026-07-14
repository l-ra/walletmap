---
title: "Vítejte v publikacích WalletMap"
description: "Ukázkový článek — šablona pro budoucí publikace o evropské digitální identitě."
pubDate: 2026-07-13
tags: [walletmap, uvod]
draft: false
---

Toto je ukázkový článek generovaný z Markdownu. Skutečný obsah přidáte vytvořením
nového souboru ve složce `src/content/articles/`.

## Jak přidat článek

1. Vytvořte soubor `src/content/articles/nazev-clanku.md`
2. Doplňte frontmatter (title, pubDate, tags, …)
3. Napište obsah v Markdownu
4. Spusťte `npm run build` nebo `npm run deploy`

## Zkratky v textu

Zkratky ze slovníku pište jako `[[PID]]`, `[[OID4VP]]` atd. (soubor `src/data/glossary.json` v repozitáři). Tučný text `**PID**` nebo ruční expanze v závorkách nepoužívejte — tooltip a modal na webu vycházejí ze slovníku. Podrobná pravidla pro autory: `docs/zkratky.md` a `AGENTS.md`. Přehled na webu: [Slovník zkratek](/slovnik-zkratek).

## Strukturovaná data

Data z `src/data/*.json` můžete načíst v Astro šablonách a generovat tabulky,
katalogy nebo později interaktivní komponenty.

```astro
---
import wallets from '../../data/wallets.json';
---
```

Soubor `wallets.json` zatím neexistuje — přidáte ho, až budete mít data připravená.
