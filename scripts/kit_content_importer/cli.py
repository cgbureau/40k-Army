from __future__ import annotations

import argparse
from pathlib import Path

from .applyer import REPO_ROOT, apply_normalized_kit_contents
from .importer import DEFAULT_SOURCES, import_kit_content_sources, import_tcgcsv_rows
from .normalizer import normalize_imported_sources, normalize_tcgcsv_rows


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", default=str(REPO_ROOT))
    parser.add_argument("--tcgcsv-root", default=None)
    args = parser.parse_args()

    imported_sources = import_kit_content_sources(DEFAULT_SOURCES)
    imported_tcgcsv_rows = import_tcgcsv_rows(
        Path(args.tcgcsv_root) if args.tcgcsv_root else None,
    )
    normalized_contents = normalize_imported_sources(imported_sources)
    normalized_tcgcsv_contents = normalize_tcgcsv_rows(imported_tcgcsv_rows)
    all_contents = [*normalized_contents, *normalized_tcgcsv_contents]
    apply_normalized_kit_contents(all_contents, Path(args.repo_root))

    print(
        {
            "sources": len(imported_sources),
            "tcgcsv_rows": len(imported_tcgcsv_rows),
            "kits": len(all_contents),
            "kit_units": sum(len(content.kit_units) for content in normalized_contents),
            "kit_prices": sum(len(content.kit_prices) for content in normalized_tcgcsv_contents),
        },
    )


if __name__ == "__main__":
    main()
