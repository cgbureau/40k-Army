#!/usr/bin/env python3
"""Sync leader_eligibility_keywords seed data from BSData predicate targets."""

from __future__ import annotations

import argparse
import re
from collections import OrderedDict
from pathlib import Path
from typing import Iterable

from bsdata_expected_counts import (
    BsDataIndex,
    expected_leader_eligibility_keywords,
)

DEFAULT_BSDATA_ROOT = Path("/Users/mikeearley/code/wh40k-10e")
REPO_ROOT = Path(__file__).resolve().parents[1]
DATA_ROOT = REPO_ROOT / "db/seed_config/seed/data"
OUTPUT_PATH = DATA_ROOT / "leader_eligibility_keywords.data.ts"
SHARD_ROOT = DATA_ROOT / "leader_eligibility_keywords/10e"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bsdata-root", default=str(DEFAULT_BSDATA_ROOT))
    args = parser.parse_args()

    index = BsDataIndex(Path(args.bsdata_root))
    expected_records = expected_leader_eligibility_keywords(index, REPO_ROOT)
    records_by_slug: "OrderedDict[str, dict[str, str]]" = OrderedDict()

    for record in expected_records:
        records_by_slug.setdefault(record["leader_eligibility_keyword_slug"], record)

    previous_count = count_seed_records(OUTPUT_PATH) + count_seed_records(
        SHARD_ROOT,
    )
    groups = group_records_by_owner(records_by_slug.values())
    write_sharded_files(groups)
    OUTPUT_PATH.write_text(render_root_file())

    print(
        {
            "leader_eligibility_keywords": sum(
                len(records) for records in groups.values()
            ),
            "previous_leader_eligibility_keywords": previous_count,
            "faction_memberships": len(expected_records),
            "shards": len(groups),
        },
    )


def group_records_by_owner(
    records: Iterable[dict[str, str]],
) -> "OrderedDict[str, list[dict[str, str]]]":
    groups: "OrderedDict[str, list[dict[str, str]]]" = OrderedDict()

    for record in records:
        owner_slug = record["source_owner_slug"]
        groups.setdefault(owner_slug, []).append(record)

    return OrderedDict(sorted(groups.items()))


def count_seed_records(path: Path) -> int:
    if not path.exists():
        return 0

    if path.is_file():
        return len(re.findall(r"LeaderEligibilityKeywordConfig = \{", path.read_text()))

    return sum(count_seed_records(file_path) for file_path in path.glob("*.data.ts"))


def write_sharded_files(
    groups: "OrderedDict[str, list[dict[str, str]]]",
) -> None:
    SHARD_ROOT.mkdir(parents=True, exist_ok=True)

    for existing_path in SHARD_ROOT.glob("*.data.ts"):
        existing_path.unlink()

    for owner_slug, records in groups.items():
        (SHARD_ROOT / f"{owner_slug}.data.ts").write_text(
            render_shard_file(owner_slug, records),
        )

    (SHARD_ROOT / "_index.leader_eligibility_keywords.data.ts").write_text(
        render_edition_index(groups),
    )
    (SHARD_ROOT.parent / "_index.leader_eligibility_keywords.data.ts").write_text(
        'export * from "./10e/_index.leader_eligibility_keywords.data";\n',
    )


def render_root_file() -> str:
    return "\n".join(
        [
            'import type { SeedDataset } from "../../types/_index.types";',
            'import { leaderEligibilityKeywords10e } from "./leader_eligibility_keywords/10e/_index.leader_eligibility_keywords.data";',
            "",
            "/**",
            " * Typed seed dataset for the `leader_eligibility_keywords` table.",
            " */",
            'export const leaderEligibilityKeywordsDataset: SeedDataset<"leader_eligibility_keywords"> = {',
            '  table: "leader_eligibility_keywords",',
            "  records: [...leaderEligibilityKeywords10e],",
            "};",
            "",
        ],
    )


def render_shard_file(owner_slug: str, records: list[dict[str, str]]) -> str:
    const_names = [
        f"{identifier_pascal_case(record['leader_eligibility_keyword_slug'])}LeaderEligibilityKeyword"
        for record in records
    ]
    dataset_name = f"{identifier_camel_case(owner_slug)}LeaderEligibilityKeywords10e"

    lines = [
        "import type {",
        "  LeaderEligibilityKeywordConfig,",
        "  SeedDataset,",
        '} from "../../../../types/_index.types";',
        'import { keywordId, leaderEligibilityId, leaderEligibilityKeywordId } from "../../../ids";',
        "",
        "/**",
        f" * 10th edition leader eligibility keyword rows owned by `{owner_slug}`.",
        " * Generated from BSData keyword-predicate Leader targets.",
        " */",
        "",
    ]

    for record, const_name in zip(records, const_names, strict=True):
        lines.extend(
            [
                f"export const {const_name}: LeaderEligibilityKeywordConfig = {{",
                f'  id: leaderEligibilityKeywordId("{record["leader_eligibility_keyword_slug"]}"),',
                f'  leader_eligibility_id: leaderEligibilityId("{record["leader_eligibility_slug"]}"),',
                f'  keyword_id: keywordId("{record["keyword_slug"]}"),',
                "};",
                "",
                "",
            ],
        )

    lines.extend(
        [
            f'export const {dataset_name}: SeedDataset<"leader_eligibility_keywords"> = {{',
            '  table: "leader_eligibility_keywords",',
            "  records: [",
        ],
    )
    lines.extend(f"    {const_name}," for const_name in const_names)
    lines.extend(
        [
            "  ] satisfies LeaderEligibilityKeywordConfig[],",
            "};",
            "",
        ],
    )

    return "\n".join(lines)


def render_edition_index(
    groups: "OrderedDict[str, list[dict[str, str]]]",
) -> str:
    imports = [
        'import type { LeaderEligibilityKeywordConfig } from "../../../../types/_index.types";',
    ]
    dataset_names = []

    for owner_slug in groups:
        dataset_name = f"{identifier_camel_case(owner_slug)}LeaderEligibilityKeywords10e"
        dataset_names.append(dataset_name)
        imports.append(f'import {{ {dataset_name} }} from "./{owner_slug}.data";')

    lines = [
        *imports,
        "",
        "export const leaderEligibilityKeywords10e = [",
    ]
    lines.extend(f"  ...{dataset_name}.records," for dataset_name in dataset_names)
    lines.extend(
        [
            "] satisfies LeaderEligibilityKeywordConfig[];",
            "",
        ],
    )

    return "\n".join(lines)


def identifier_pascal_case(slug: str) -> str:
    parts = re.findall(r"[a-zA-Z0-9]+", slug)
    identifier = "".join(part[:1].upper() + part[1:] for part in parts)

    if not identifier or identifier[0].isdigit():
        return f"Seed{identifier}"

    return identifier


def identifier_camel_case(slug: str) -> str:
    identifier = identifier_pascal_case(slug)
    return identifier[:1].lower() + identifier[1:]


if __name__ == "__main__":
    main()
