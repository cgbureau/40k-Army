from __future__ import annotations

import time
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse

from .common import (
    BASE_URL,
    DEFAULT_USER_AGENT,
    cache_path_for_url,
    dataclass_dict,
    edition_path,
    extract_links,
    fetch_cached,
    generated_output_path,
    import_paths,
    manifest_payload,
    normalize_slug,
    parse_sitemap_locations,
    write_json,
)

WARHAMMER_40000_DOWNLOADS_URL = (
    "https://www.warhammer-community.com/en-gb/downloads/warhammer-40000/"
)


@dataclass(frozen=True)
class CollectedPage:
    page_kind: str
    url: str
    cache_path: str
    cache_hit: bool
    faction_slug: str | None = None


def get_sitemap_locations(
    *,
    edition: str,
    work_root: str | None = None,
    refresh: bool = False,
    user_agent: str = DEFAULT_USER_AGENT,
) -> tuple[list[str], CollectedPage]:
    paths = import_paths(work_root)
    path_segment = edition_path(edition)
    sitemap_url = f"{BASE_URL}/{path_segment}/SiteMap.xml"
    sitemap_text, sitemap_cache, sitemap_hit = fetch_cached(
        sitemap_url,
        cache_root=paths.cache_root,
        refresh=refresh,
        user_agent=user_agent,
    )
    return (
        parse_sitemap_locations(sitemap_text),
        CollectedPage(
            page_kind="sitemap",
            url=sitemap_url,
            cache_path=str(sitemap_cache),
            cache_hit=sitemap_hit,
        ),
    )


def list_faction_slugs(
    *,
    edition: str,
    work_root: str | None = None,
    refresh: bool = False,
    user_agent: str = DEFAULT_USER_AGENT,
) -> list[str]:
    locations, _ = get_sitemap_locations(
        edition=edition,
        work_root=work_root,
        refresh=refresh,
        user_agent=user_agent,
    )
    path_segment = edition_path(edition)
    prefix = f"{BASE_URL}/{path_segment}/factions/"
    faction_slugs: set[str] = set()
    for location in locations:
        if not location.startswith(prefix):
            continue
        tail = location[len(prefix) :].strip("/")
        if tail and "/" not in tail:
            faction_slugs.add(tail)
    return sorted(faction_slugs)


def collect_wahapedia_data(
    *,
    kind: str,
    edition: str,
    faction: str | None = None,
    work_root: str | None = None,
    output: str | None = None,
    refresh: bool = False,
    limit: int | None = None,
    throttle_seconds: float = 0.2,
    max_workers: int = 4,
    user_agent: str = DEFAULT_USER_AGENT,
    command: str = "",
) -> Path:
    """Collect Wahapedia pages into an external cache and write a manifest.

    The manifest intentionally stores cache paths and metadata. Raw HTML remains
    in the cache root, which defaults outside this repository.
    """

    paths = import_paths(work_root)
    path_segment = edition_path(edition)
    locations, sitemap_page = get_sitemap_locations(
        edition=edition,
        work_root=work_root,
        refresh=refresh,
        user_agent=user_agent,
    )

    pages: list[CollectedPage] = [sitemap_page]

    target_urls: list[tuple[str, str, str | None]] = []
    if kind in {"unit-abilities", "units"}:
        if not faction:
            raise ValueError(f"{kind} collection requires --faction")
        faction_slug = normalize_slug(faction).replace("_", "-")
        faction_index_url = _find_faction_index_url(locations, path_segment, faction_slug)
        faction_html, faction_cache, faction_hit = fetch_cached(
            faction_index_url,
            cache_root=paths.cache_root,
            refresh=refresh,
            user_agent=user_agent,
        )
        pages.append(
            CollectedPage(
                page_kind="faction-index",
                url=faction_index_url,
                cache_path=str(faction_cache),
                cache_hit=faction_hit,
                faction_slug=faction_slug,
            )
        )
        target_urls = [
            ("unit-datasheet", url, faction_slug)
            for url in _discover_faction_unit_urls(
                faction_html=faction_html,
                faction_index_url=faction_index_url,
                sitemap_locations=locations,
                path_segment=path_segment,
                faction_slug=faction_slug,
            )
        ]
    elif kind == "faction":
        if not faction:
            raise ValueError("faction collection requires --faction")
        faction_slug = normalize_slug(faction).replace("_", "-")
        target_urls = [
            (
                "faction-index",
                _find_faction_index_url(locations, path_segment, faction_slug),
                faction_slug,
            )
        ]
    elif kind == "rules-sources":
        target_urls = [("warhammer-community-downloads", WARHAMMER_40000_DOWNLOADS_URL, None)]
        if faction:
            faction_slug = normalize_slug(faction).replace("_", "-")
            target_urls.append(
                (
                    "faction-index",
                    _find_faction_index_url(locations, path_segment, faction_slug),
                    faction_slug,
                )
            )
    elif kind == "core-rules":
        target_urls = [("core-rules", f"{BASE_URL}/{path_segment}/the-rules/core-rules/", None)]
    else:
        raise ValueError(f"Unsupported collect kind: {kind}")

    if limit is not None:
        target_urls = target_urls[:limit]

    def collect_page(page: tuple[str, str, str | None]) -> CollectedPage:
        page_kind, url, faction_slug = page
        html, cache_path, cache_hit = fetch_cached(
            url,
            cache_root=paths.cache_root,
            refresh=refresh,
            user_agent=user_agent,
        )
        if max_workers <= 1 and not cache_hit and throttle_seconds > 0:
            time.sleep(throttle_seconds)
        return CollectedPage(
            page_kind=page_kind,
            url=url,
            cache_path=str(cache_path),
            cache_hit=cache_hit,
            faction_slug=faction_slug,
        )

    worker_count = max(1, min(max_workers, len(target_urls) or 1))
    if worker_count == 1:
        pages.extend(collect_page(page) for page in target_urls)
    else:
        with ThreadPoolExecutor(max_workers=worker_count) as executor:
            pages.extend(executor.map(collect_page, target_urls))

    output_path = (
        Path(output).expanduser()
        if output
        else generated_output_path(
            paths.output_root,
            stage="manifest",
            kind=kind,
            edition=edition,
            faction=faction,
        )
    )
    write_json(
        output_path,
        manifest_payload(
            command=command,
            stage="collect",
            kind=kind,
            edition=edition,
            faction=faction,
            cache_root=str(paths.cache_root),
            output_root=str(paths.output_root),
            page_count=len(pages),
            target_limit=limit,
            pages=[dataclass_dict(page) for page in pages],
        ),
    )
    return output_path


def _find_faction_index_url(
    locations: list[str], path_segment: str, faction_slug: str
) -> str:
    prefixes = [
        f"{BASE_URL}/{path_segment}/factions/{faction_slug}/",
        f"{BASE_URL}/{path_segment}/factions/{faction_slug}",
    ]
    for prefix in prefixes:
        for location in locations:
            if location == prefix:
                return location
    raise ValueError(f"Could not find faction index in sitemap: {faction_slug}")


def _discover_faction_unit_urls(
    *,
    faction_html: str,
    faction_index_url: str,
    sitemap_locations: list[str],
    path_segment: str,
    faction_slug: str,
) -> list[str]:
    base_prefix = f"/{path_segment}/factions/{faction_slug}/"
    sitemap_set = set(sitemap_locations)
    discovered: set[str] = set()

    for link in extract_links(faction_html, faction_index_url):
        parsed = urlparse(link)
        if parsed.netloc and parsed.netloc != urlparse(BASE_URL).netloc:
            continue
        if not parsed.path.startswith(base_prefix):
            continue
        if parsed.path.rstrip("/") == base_prefix.rstrip("/"):
            continue
        clean = f"{BASE_URL}{parsed.path}"
        if clean in sitemap_set or f"{clean}/" in sitemap_set:
            discovered.add(clean)

    return sorted(discovered)


def planned_cache_path(url: str, *, work_root: str | None = None) -> Path:
    return cache_path_for_url(import_paths(work_root).cache_root, url)
