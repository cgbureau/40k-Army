from __future__ import annotations

import csv
import os
from collections.abc import Callable, Iterable
from pathlib import Path
from urllib.request import Request, urlopen

from .models import ImportedKitContentSource, ImportedTcgCsvRow, KitContentSource


REPO_ROOT = Path(__file__).resolve().parents[2]
TCGCSV_SOURCE_FILES: dict[str, str] = {
    "big_box_games": "WarhammerBigBoxGamesProductsAndPrices.csv",
    "plastic_box_sets": "WarhammerPlasticBoxSetsProductsAndPrices.csv",
    "plastic_clampacks": "WarhammerPlasticClampacksProductsAndPrices.csv",
}


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


def default_tcgcsv_root(repo_root: Path = REPO_ROOT) -> Path | None:
    env_root = os.environ.get("TCGCSV_40K_ROOT")
    if env_root:
        return Path(env_root)

    sibling_memory_root = repo_root.parent / "ai-team-projects/40karmy/TCG_CSV_files"
    if sibling_memory_root.exists():
        return sibling_memory_root

    return None


def import_tcgcsv_rows(tcgcsv_root: Path | None = None) -> list[ImportedTcgCsvRow]:
    source_root = tcgcsv_root or default_tcgcsv_root()
    if source_root is None or not source_root.exists():
        return []

    imported_rows: list[ImportedTcgCsvRow] = []

    for source_kind, file_name in TCGCSV_SOURCE_FILES.items():
        source_path = source_root / file_name
        if not source_path.exists():
            continue

        with source_path.open(newline="", encoding="utf-8-sig") as handle:
            for row in csv.DictReader(handle):
                if row.get("extGameSeries") != "Warhammer: 40K":
                    continue

                imported_rows.append(
                    ImportedTcgCsvRow(
                        source_file=file_name,
                        source_kind=source_kind,
                        row={key: value or "" for key, value in row.items()},
                    ),
                )

    return imported_rows
