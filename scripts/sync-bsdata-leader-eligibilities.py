#!/usr/bin/env python3
"""Sync leader_eligibilities seed data from local BSData catalogs."""

from __future__ import annotations

import argparse
import re
from collections import OrderedDict
from pathlib import Path

from bsdata_expected_counts import (
    BsDataIndex,
    expected_leader_eligibilities,
)

DEFAULT_BSDATA_ROOT = Path("/Users/mikeearley/code/wh40k-10e")
REPO_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = REPO_ROOT / "db/seed_config/seed/data/leader_eligibilities.data.ts"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bsdata-root", default=str(DEFAULT_BSDATA_ROOT))
    args = parser.parse_args()

    index = BsDataIndex(Path(args.bsdata_root))
    expected_records = expected_leader_eligibilities(index, REPO_ROOT)
    records_by_slug: "OrderedDict[str, dict[str, str | None]]" = OrderedDict()

    for record in expected_records:
        records_by_slug.setdefault(record["leader_eligibility_slug"], record)

    previous_count = count_seed_records(OUTPUT_PATH)
    OUTPUT_PATH.write_text(render_file(list(records_by_slug.values())))

    print(
        {
            "leader_eligibilities": len(records_by_slug),
            "previous_leader_eligibilities": previous_count,
            "faction_memberships": len(expected_records),
        },
    )


def count_seed_records(path: Path) -> int:
    if not path.exists():
        return 0

    return len(re.findall(r"LeaderEligibilityConfig = \{", path.read_text()))


def render_file(records: list[dict[str, str | None]]) -> str:
    const_names = [
        f"{identifier_pascal_case(str(record['leader_eligibility_slug']))}LeaderEligibility"
        for record in records
    ]

    lines = [
        "import type {",
        "  LeaderEligibilityConfig,",
        "  SeedDataset,",
        '} from "../../types/_index.types";',
        'import { gameEditionId, leaderEligibilityId, rulesSourceId, unitId } from "../ids";',
        "",
        "/**",
        " * Typed seed dataset for the `leader_eligibilities` table.",
        " * Generated from BSData Leader ability profiles.",
        " */",
        "",
    ]

    for record, const_name in zip(records, const_names, strict=True):
        target_unit_slug = record["target_unit_slug"]
        target_unit_id = (
            f'unitId("{target_unit_slug}")'
            if target_unit_slug is not None
            else "null"
        )
        lines.extend(
            [
                f"export const {const_name}: LeaderEligibilityConfig = {{",
                f'  id: leaderEligibilityId("{record["leader_eligibility_slug"]}"),',
                f'  leader_unit_id: unitId("{record["leader_unit_slug"]}"),',
                f"  target_unit_id: {target_unit_id},",
                '  game_edition_id: gameEditionId("10e"),',
                f'  rules_source_id: rulesSourceId("{record["rules_source_slug"]}"),',
                "};",
                "",
                "",
            ],
        )

    lines.extend(
        [
            'export const leaderEligibilitiesDataset: SeedDataset<"leader_eligibilities"> = {',
            '  table: "leader_eligibilities",',
            "  records: [",
        ],
    )
    lines.extend(f"    {const_name}," for const_name in const_names)
    lines.extend(
        [
            "  ] satisfies LeaderEligibilityConfig[],",
            "};",
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


if __name__ == "__main__":
    main()
