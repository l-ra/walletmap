#!/usr/bin/env bash
# Publikuje obsah dist/ na vzdálený server přes rsync.
#
# Konfigurace (v pořadí priority):
#   1. existující soubor deploy/deploy.env (nebo cesta v WALLETMAP_DEPLOY_ENV)
#   2. proměnné prostředí DEPLOY_HOST, DEPLOY_PATH, … (vhodné pro CI/CD pipeline)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DEPLOY_ENV="${WALLETMAP_DEPLOY_ENV:-$ROOT_DIR/deploy/deploy.env}"

if [[ -f "$DEPLOY_ENV" ]]; then
  echo "Načítám konfiguraci z: $DEPLOY_ENV"
  # shellcheck source=/dev/null
  source "$DEPLOY_ENV"
elif [[ -n "${WALLETMAP_DEPLOY_ENV:-}" ]]; then
  echo "Poznámka: $DEPLOY_ENV neexistuje, používám proměnné prostředí" >&2
else
  echo "Soubor $DEPLOY_ENV neexistuje, používám proměnné prostředí" >&2
fi

if [[ -z "${DEPLOY_HOST:-}" || -z "${DEPLOY_PATH:-}" ]]; then
  echo "Chybí povinná konfigurace: DEPLOY_HOST a DEPLOY_PATH" >&2
  echo "Nastavte je v deploy/deploy.env nebo jako proměnné prostředí." >&2
  echo "Šablona: deploy/deploy.env.example" >&2
  exit 1
fi

DIST_DIR="$ROOT_DIR/dist"
if [[ ! -d "$DIST_DIR" ]]; then
  echo "Složka dist/ neexistuje. Spusťte nejdříve: npm run build" >&2
  exit 1
fi

if [[ -n "${DEPLOY_USER:-}" ]]; then
  REMOTE="${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"
else
  REMOTE="${DEPLOY_HOST}:${DEPLOY_PATH}/"
fi

RSYNC_SSH="${RSYNC_SSH:-ssh}"
RSYNC_EXTRA_OPTS="${RSYNC_EXTRA_OPTS:-}"

echo "Publikuji $DIST_DIR/ -> $REMOTE"
echo "  (--delete: soubory na serveru, které nejsou v dist/, budou odstraněny)"

# -a  archivní režim (zachová práva, časy, …)
# -v  verbose
# -z  komprese při přenosu
# --delete  přesný obraz — smaže na cíli soubory, které v dist/ nejsou
rsync -avz --delete \
  -e "$RSYNC_SSH" \
  $RSYNC_EXTRA_OPTS \
  "$DIST_DIR/" "$REMOTE"

echo "Hotovo. Web by měl být dostupný přes Apache v DocumentRoot: $DEPLOY_PATH"
