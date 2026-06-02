from __future__ import annotations

import argparse
from pathlib import Path

from .applyer import REPO_ROOT, apply_normalized_countries
from .importer import import_country_batches
from .normalizer import normalize_country_batches


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", default=str(REPO_ROOT))
    args = parser.parse_args()

    imported_batches = import_country_batches()
    normalized_countries = normalize_country_batches(imported_batches)
    apply_normalized_countries(normalized_countries, Path(args.repo_root))

    print(
        {
            "source": "restcountries_v4",
            "batches": len(imported_batches),
            "countries": len(normalized_countries),
        },
    )


if __name__ == "__main__":
    main()
