from __future__ import annotations

import hashlib
import json
import re
import subprocess
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen
from xml.etree import ElementTree

BASE_URL = "https://wahapedia.ru"
DEFAULT_USER_AGENT = "40kArmyImporter/0.1 (+local data import; respectful cache)"
DEFAULT_WORK_ROOT = Path.home() / "code" / "ai-team-projects" / "40karmy" / "wahapedia"

EDITION_PATHS = {
    "10e": "wh40k10ed",
    "11e": "wh40k11ed",
}

DISALLOWED_EDITIONS = {"8e", "9e"}


class WahapediaImportError(RuntimeError):
    pass


class TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"br", "p", "div", "li", "tr", "h1", "h2", "h3", "h4"}:
            self.parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in {"p", "div", "li", "tr", "h1", "h2", "h3", "h4", "table"}:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        value = data.strip()
        if value:
            self.parts.append(value)

    def text(self) -> str:
        text = " ".join(self.parts)
        text = re.sub(r"[ \t\r\f\v]+", " ", text)
        text = re.sub(r"\s*\n\s*", "\n", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        return unescape(text).strip()


@dataclass(frozen=True)
class ImportPaths:
    work_root: Path
    cache_root: Path
    output_root: Path


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def normalize_slug(value: str) -> str:
    value = value.strip().lower()
    value = value.replace("&", " and ")
    value = re.sub(r"['’`]", "", value)
    value = re.sub(r'["“”]', "", value)
    value = re.sub(r"[^a-z0-9]+", "_", value)
    return re.sub(r"_+", "_", value).strip("_")


def display_name_from_slug(slug: str) -> str:
    return " ".join(part.capitalize() for part in slug.split("_"))


def edition_path(edition: str) -> str:
    if edition in DISALLOWED_EDITIONS:
        raise WahapediaImportError(
            f"{edition} is disallowed by Wahapedia robots.txt for generic user agents"
        )
    try:
        return EDITION_PATHS[edition]
    except KeyError as exc:
        raise WahapediaImportError(
            f"Unsupported edition {edition!r}; add it to EDITION_PATHS after verifying robots.txt"
        ) from exc


def import_paths(work_root: str | None) -> ImportPaths:
    root = Path(work_root).expanduser() if work_root else DEFAULT_WORK_ROOT
    return ImportPaths(
        work_root=root,
        cache_root=root / "cache",
        output_root=root / "outputs",
    )


def generated_output_path(
    output_root: Path,
    *,
    stage: str,
    kind: str,
    edition: str,
    faction: str | None = None,
) -> Path:
    parts = [edition]
    if faction:
        parts.append(normalize_slug(faction).replace("_", "-"))
    filename = f"{kind}.{stage}.json"
    return output_root.joinpath(*parts, filename)


def write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def fetch_text(url: str, *, user_agent: str = DEFAULT_USER_AGENT, timeout: int = 30) -> str:
    curl = [
        "curl",
        "--fail",
        "--location",
        "--silent",
        "--show-error",
        "--compressed",
        "--connect-timeout",
        "10",
        "--max-time",
        str(timeout),
        "--user-agent",
        user_agent,
        url,
    ]
    try:
        result = subprocess.run(curl, check=True, capture_output=True, timeout=timeout + 5)
        return result.stdout.decode("utf-8", errors="replace").lstrip("\ufeff")
    except FileNotFoundError:
        request = Request(url, headers={"User-Agent": user_agent})
        with urlopen(request, timeout=timeout) as response:
            charset = response.headers.get_content_charset() or "utf-8"
            return response.read().decode(charset, errors="replace").lstrip("\ufeff")
    except subprocess.TimeoutExpired as exc:
        raise WahapediaImportError(f"Timed out fetching {url}") from exc
    except subprocess.CalledProcessError as exc:
        message = exc.stderr.decode("utf-8", errors="replace").strip()
        raise WahapediaImportError(f"Failed fetching {url}: {message}") from exc


def cache_path_for_url(cache_root: Path, url: str) -> Path:
    parsed = urlparse(url)
    suffix = Path(parsed.path).suffix or ".html"
    digest = hashlib.sha256(url.encode("utf-8")).hexdigest()[:16]
    clean_path = parsed.path.strip("/").replace("/", "__") or "index"
    return cache_root / f"{clean_path}__{digest}{suffix}"


def fetch_cached(
    url: str,
    *,
    cache_root: Path,
    refresh: bool = False,
    user_agent: str = DEFAULT_USER_AGENT,
) -> tuple[str, Path, bool]:
    cache_path = cache_path_for_url(cache_root, url)
    if cache_path.exists() and not refresh:
        return cache_path.read_text(encoding="utf-8"), cache_path, True

    text = fetch_text(url, user_agent=user_agent)
    cache_path.parent.mkdir(parents=True, exist_ok=True)
    cache_path.write_text(text, encoding="utf-8")
    return text, cache_path, False


def html_to_text(html: str) -> str:
    parser = TextExtractor()
    parser.feed(html)
    return parser.text()


def extract_links(html: str, base_url: str) -> list[str]:
    links: list[str] = []
    for match in re.finditer(r"""href=["']([^"']+)["']""", html, flags=re.IGNORECASE):
        href = unescape(match.group(1))
        if href.startswith("#") or href.startswith("javascript:"):
            continue
        links.append(urljoin(base_url, href))
    return sorted(set(links))


def parse_sitemap_locations(xml_text: str) -> list[str]:
    root = ElementTree.fromstring(xml_text)
    locations: list[str] = []
    for loc in root.findall(".//{*}loc"):
        if loc.text:
            locations.append(loc.text.strip())
    return sorted(set(locations))


def manifest_payload(**kwargs: Any) -> dict[str, Any]:
    return {"generated_at": now_iso(), **kwargs}


def dataclass_dict(value: Any) -> dict[str, Any]:
    return asdict(value)
