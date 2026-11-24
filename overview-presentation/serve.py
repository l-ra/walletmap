#!/usr/bin/env python3
"""Create/reuse a local virtual environment and serve the EUDIW presentation."""

from __future__ import annotations

import argparse
import hashlib
import http.server
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import threading
import venv
import webbrowser


ROOT = Path(__file__).resolve().parent
VENV_DIR = ROOT / ".venv"
REQUIREMENTS = ROOT / "requirements.txt"
STATE_FILE = VENV_DIR / ".eudiw-environment.json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Spustí lokální server prezentace v opakovaně použitelném EUDIW/.venv."
    )
    parser.add_argument("--host", default="127.0.0.1", help="Adresa serveru (výchozí: 127.0.0.1).")
    parser.add_argument("--port", type=int, default=8080, help="Port serveru (výchozí: 8080).")
    parser.add_argument(
        "--open-browser",
        action="store_true",
        help="Po spuštění otevře prezentaci ve výchozím prohlížeči.",
    )
    parser.add_argument(
        "--update-deps",
        action="store_true",
        help="Vynutí aktualizaci balíčků podle requirements.txt.",
    )
    parser.add_argument(
        "--remove-venv",
        action="store_true",
        help="Bezpečně odstraní EUDIW/.venv a skončí.",
    )
    return parser.parse_args()


def venv_python() -> Path:
    if os.name == "nt":
        return VENV_DIR / "Scripts" / "python.exe"
    return VENV_DIR / "bin" / "python"


def is_inside_managed_venv() -> bool:
    try:
        return Path(sys.prefix).resolve() == VENV_DIR.resolve()
    except OSError:
        return False


def remove_venv() -> None:
    resolved_root = ROOT.resolve()
    if VENV_DIR.name != ".venv" or VENV_DIR.parent.resolve() != resolved_root:
        raise RuntimeError(f"Odmítnuto odstranění neočekávané cesty: {VENV_DIR}")
    if VENV_DIR.is_symlink():
        VENV_DIR.unlink()
    elif VENV_DIR.exists():
        shutil.rmtree(VENV_DIR)
    print(f"Virtuální prostředí bylo odstraněno: {VENV_DIR}")


def create_venv() -> None:
    print(f"Vytvářím virtuální prostředí: {VENV_DIR}", flush=True)
    venv.EnvBuilder(with_pip=True, clear=False).create(VENV_DIR)


def existing_python_version(python: Path) -> tuple[int, int] | None:
    try:
        value = subprocess.check_output(
            [str(python), "-c", "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')"],
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
        major, minor = value.split(".", maxsplit=1)
        return int(major), int(minor)
    except (OSError, subprocess.CalledProcessError, ValueError):
        return None


def ensure_venv() -> Path:
    python = venv_python()
    expected = (sys.version_info.major, sys.version_info.minor)
    actual = existing_python_version(python) if python.exists() else None

    if actual is None:
        if VENV_DIR.exists():
            print("Existující .venv je neúplný; vytvářím jej znovu.", flush=True)
            remove_venv()
        create_venv()
    elif actual != expected:
        print(
            f".venv používá Python {actual[0]}.{actual[1]}, launcher {expected[0]}.{expected[1]}; "
            "vytvářím kompatibilní prostředí znovu.",
            flush=True,
        )
        remove_venv()
        create_venv()
    else:
        print(f"Používám existující virtuální prostředí: {VENV_DIR}", flush=True)

    return venv_python()


def requirements_hash() -> str:
    if not REQUIREMENTS.exists():
        return "missing"
    return hashlib.sha256(REQUIREMENTS.read_bytes()).hexdigest()


def has_runtime_dependencies() -> bool:
    if not REQUIREMENTS.exists():
        return False
    for line in REQUIREMENTS.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if stripped and not stripped.startswith("#"):
            return True
    return False


def load_state() -> dict[str, object]:
    try:
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def sync_dependencies(force: bool) -> None:
    digest = requirements_hash()
    state = load_state()
    python_version = f"{sys.version_info.major}.{sys.version_info.minor}"
    changed = state.get("requirements_sha256") != digest or state.get("python") != python_version

    if force or changed:
        if has_runtime_dependencies():
            print("Instaluji/aktualizuji závislosti podle requirements.txt…", flush=True)
            subprocess.run(
                [sys.executable, "-m", "pip", "install", "--upgrade", "-r", str(REQUIREMENTS)],
                check=True,
            )
        else:
            print("Prezentace nyní nemá externí Python závislosti; není co instalovat.", flush=True)
        STATE_FILE.write_text(
            json.dumps(
                {"requirements_sha256": digest, "python": python_version},
                indent=2,
                ensure_ascii=False,
            )
            + "\n",
            encoding="utf-8",
        )
    else:
        print("Závislosti odpovídají requirements.txt; instalaci přeskakuji.", flush=True)


class PresentationServer(http.server.ThreadingHTTPServer):
    daemon_threads = True
    allow_reuse_address = True


def serve(host: str, port: int, open_browser: bool) -> None:
    handler = lambda *args, **kwargs: http.server.SimpleHTTPRequestHandler(  # noqa: E731
        *args, directory=str(ROOT), **kwargs
    )
    try:
        server = PresentationServer((host, port), handler)
    except OSError as exc:
        raise SystemExit(f"Server nelze spustit na {host}:{port}: {exc}") from exc

    display_host = "127.0.0.1" if host in {"0.0.0.0", "::"} else host
    url = f"http://{display_host}:{server.server_port}/"
    print(f"EUDI Wallet prezentace běží na {url}")
    print("Server ukončíte pomocí Ctrl+C.")

    if open_browser:
        threading.Timer(0.35, lambda: webbrowser.open(url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer ukončen.")
    finally:
        server.server_close()


def main() -> None:
    args = parse_args()

    if args.remove_venv:
        remove_venv()
        return

    if not is_inside_managed_venv():
        python = ensure_venv()
        os.execv(str(python), [str(python), str(Path(__file__).resolve()), *sys.argv[1:]])

    sync_dependencies(args.update_deps)
    serve(args.host, args.port, args.open_browser)


if __name__ == "__main__":
    main()
