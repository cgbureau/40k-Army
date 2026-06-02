from __future__ import annotations

import argparse
from pathlib import Path

from .applyer import REPO_ROOT, apply_normalized_kit_contents
from .importer import DEFAULT_SOURCES, import_kit_content_sources
from .normalizer import normalize_imported_sources


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", default=str(REPO_ROOT))
    args = parser.parse_args()

    imported_sources = import_kit_content_sources(DEFAULT_SOURCES)
    normalized_contents = normalize_imported_sources(imported_sources)
    apply_normalized_kit_contents(normalized_contents, Path(args.repo_root))

    print(
        {
            "sources": len(imported_sources),
            "kits": len(normalized_contents),
            "kit_units": sum(len(content.kit_units) for content in normalized_contents),
        },
    )


if __name__ == "__main__":
    main()
