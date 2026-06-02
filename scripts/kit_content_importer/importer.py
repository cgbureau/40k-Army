from __future__ import annotations

from collections.abc import Callable, Iterable
from urllib.request import Request, urlopen

from .models import ImportedKitContentSource, KitContentSource


DEFAULT_SOURCES: tuple[KitContentSource, ...] = (
    KitContentSource(
        faction_slug="black_templars",
        kit_slug="combat-patrol-black-templars-2025",
        source_kind="miniset",
        url="https://miniset.net/sets/gw-99120101428?language=en",
    ),
)


def fetch_text(url: str) -> str:
    request = Request(
        url,
        headers={
            "Accept": "text/html,application/xhtml+xml",
            "User-Agent": "40karmy kit content importer",
        },
    )

    with urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8")


def import_kit_content_sources(
    sources: Iterable[KitContentSource] = DEFAULT_SOURCES,
    fetcher: Callable[[str], str] = fetch_text,
) -> list[ImportedKitContentSource]:
    return [
        ImportedKitContentSource(source=source, body=fetcher(source.url))
        for source in sources
    ]
