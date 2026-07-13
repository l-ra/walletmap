# WalletMap.eu

Mapa evropské digitální identity — technologická a uživatelská mapa EU Digital Identity Wallet.

## O projektu

WalletMap.eu si klade za cíl vytvořit centrální, otevřený a přehledný zdroj informací o evropské peněžence digitální identity. Projekt pokrývá:

- **Technologickou mapu** — standardy (EBSI, OIDC4VP, SD-JWT, ISO 18013-5), protokoly a architektury
- **Katalog implementací** — přehled wallet řešení napříč členskými státy EU
- **Certifikaci a soulad** — eIDAS 2.0, certifikační schémata, bezpečnostní audity
- **Uživatelskou zkušenost** — best practices pro UX, onboarding a přístupnost

## Vývoj

Projekt používá [Astro](https://astro.build) jako statický generátor.

```bash
npm install
npm run dev      # lokální náhled na http://localhost:4321
npm run build    # sestavení do dist/
npm run preview  # náhled sestaveného webu
```

### Struktura

```
public/index.html          landing page (beze změny, kopíruje se do dist/)
src/content/articles/      články v Markdownu
src/data/                  strukturovaná data (JSON/YAML)
src/layouts/               šablony stránek
src/pages/                 generované routy (např. /clanky/)
scripts/deploy.sh          publikace přes rsync
deploy/deploy.env.example  šablona konfigurace pro deploy
deploy/deploy.env          lokální konfigurace (gitignored)
```

### Přidání článku

Vytvořte soubor `src/content/articles/nazev.md` s frontmatter:

```yaml
---
title: "Nadpis článku"
description: "Krátký popis"
pubDate: 2026-07-13
tags: [eidas, standardy]
draft: false
---

Obsah v Markdownu…
```

## Publikace

Web se publikuje rsyncem z `dist/` na server s Apache httpd. Lokální konfigurace je v repozitáři, ale git ji ignoruje:

```bash
cp deploy/deploy.env.example deploy/deploy.env
# upravte deploy/deploy.env podle potřeby
npm run deploy   # build + rsync s --delete (přesný obraz)
```

Vlastní cesta ke konfiguračnímu souboru:

```bash
WALLETMAP_DEPLOY_ENV=/cesta/k/jiny.env npm run deploy
```

Pro CI/CD pipeline (bez souboru, jen proměnné prostředí):

```bash
DEPLOY_HOST=example.org \
DEPLOY_PATH=/var/www/htdocs \
DEPLOY_USER=deploy \
npm run deploy:rsync
```

## Plán

1. **Research** — analýza standardů a implementací
2. **Struktura mapy** — návrh taxonomie a vrstev
3. **Data & vizualizace** — interaktivní grafové zobrazení
4. **Live mapa** — veřejné spuštění

## Licence

CC BY-SA 4.0
