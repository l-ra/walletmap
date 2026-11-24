# EUDI Wallet — finální verze 2

Lokální HTML prezentace pro dva devadesátiminutové výukové bloky. Finální verze 2 obsahuje odladěný obsah, projekční layouty, speaker notes, presenter view, synchronizované projekční okno a tři interaktivní protokolové laboratoře.

- plná hloubka: 78 slidů, 180 minut čistého výkladu
- pouze jádro: 61 slidů, přibližně 140 minut čistého výkladu

## Spuštění

Přímo otevřít `index.html` jako soubor nestačí, protože prezentace používá JavaScript moduly. V adresáři `EUDIW` proto spusťte:

```bash
python3 serve.py
```

Launcher vytvoří předvídatelné virtuální prostředí `EUDIW/.venv`, při dalších spuštěních je znovu použije a podle změn `requirements.txt` automaticky nainstaluje nebo aktualizuje závislosti. Prezentace potom běží na `http://127.0.0.1:8080/`.

Užitečné přepínače:

```bash
python3 serve.py --open-browser          # spustí server a otevře prohlížeč
python3 serve.py --port 9000             # použije jiný port
python3 serve.py --update-deps           # vynutí aktualizaci závislostí
python3 serve.py --remove-venv           # odstraní EUDIW/.venv a skončí
```

Server ukončíte pomocí `Ctrl+C`. Virtuální prostředí je lokální provozní artefakt a je uvedené v `.gitignore`.

## Ovládání

- `←` / `→`, `PageUp` / `PageDown`: pohyb mezi slidy
- `N`: poznámky lektora včetně zdrojů
- `D`: plná hloubka / pouze jádro
- `O`: přehled slidů s odhadem času
- `Home` / `End`: první / poslední slide
- `F`: zapnout nebo ukončit celou obrazovku
- `Presenter`: otevře samostatný režim pro lektora

Režimy lze otevřít i přímo: `?depth=core` a `?notes=1`.

Všechny zavedené zkratky mají při najetí myší stručné vysvětlení. Ukázky JSON, HTTP a dalších zpráv používají syntaktické zvýraznění.

Interaktivní detailní slajdy umožňují:

- vystavit demonstrativní SD-JWT skutečnými dočasnými P-256 klíči, měnit disclosures, sledovat přepočet KB-JWT a rozbalit celý compact do barevně rozlišených klikacích částí s dekódováním;
- krokovat OID4VP přes redirect, DC API same-device, DC API cross-device i nedoporučený přímý QR;
- krokovat OID4VCI pro Authorization Code i Pre-Authorized Code a pro same-device i cross-device start.

Klávesová navigace je při práci s tlačítky, formulářovými poli a editovatelným payloadem potlačena, aby šipky neposunuly celý deck.

## Presenter view

Presenter view otevřete tlačítkem `Presenter` v prezentaci nebo přímo na `http://127.0.0.1:8080/presenter.html`. V lektorském okně je velký aktuální slide, menší náhled následujícího slidu, poznámky, zdroje a odhad zbývajícího obsahu. Oba náhledy se překreslují při ovládání tlačítky, klávesami, z jiného okna i při navigaci pomocí fragmentu `#slide-N`.

Tlačítko `Otevřít projekci` založí druhé synchronizované okno bez ovládacích prvků. Přesuňte je na projektor a v projekčním okně stiskněte `F` nebo tlačítko `Spustit celou obrazovku`. Posun se synchronizuje oběma směry také s původním oknem prezentace; vložený náhled dalšího slidu zůstává záměrně o jeden slide napřed. Všechna okna musí být otevřená ze stejné adresy serveru, například `127.0.0.1:8080`.

Odpočet celého bloku nastavíte tlačítkem `Začínáme (+90 min)` nebo zadáním konkrétního času konce. Presenter současně automaticky odpočítává doporučený čas aktuálního slidu. Kliknutím na tento dílčí čas jej restartujete. Posledních třicet sekund se zvýrazní a po vypršení se zobrazí přesčas.

Kontrola dat a časů: `node validate.mjs`. Pokud na výchozím portu 8080 běží lokální server a je dostupný Google Chrome, lze spustit i renderovací kontrolu: `node browser-smoke.mjs`. Ta projde všechny slajdy, presenter/projection synchronizaci a všechny větve interaktivních laboratoří včetně dekodéru tokenu, vnitřního scrollování a kontroly skrytého přetečení.

## Pracovní předpoklad o publiku

Studenti znají HTTP, JSON a princip asymetrické kryptografie. OIDC, OID4VP, OID4VCI, SD-JWT VC a mdoc se vysvětlují od přehledu až po reprezentativní zprávy na drátě. Uvedené JSON a CBOR příklady jsou záměrně zkrácené, ale zachovávají význam polí a vazby mezi zprávami.

## Verze zdrojů

Obsah odpovídá stavu k 24. 11. 2026. Základ tvoří ARF 3.0.0, OpenID4VP 1.0 Final, OpenID4VCI 1.0 Final, RFC 9901, aktuální EUDI technické specifikace a referenční implementace. Pracovní návrhy jsou v prezentaci výslovně označeny.

Diagramy založené na ARF jsou pro projekci překreslené do čitelnější podoby; zdroj je uveden v poznámkách příslušných slidů.
