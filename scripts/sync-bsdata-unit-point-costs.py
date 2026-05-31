#!/usr/bin/env python3
"""Sync unit_point_costs seed data from local BSData catalogs."""

from __future__ import annotations

import argparse
import json
import re
from collections import OrderedDict
from pathlib import Path
from typing import Iterable

from bsdata_expected_counts import (
    BsDataIndex,
    expected_unit_point_costs,
)

DEFAULT_BSDATA_ROOT = Path("/Users/mikeearley/code/wh40k-10e")
REPO_ROOT = Path(__file__).resolve().parents[1]
DATA_ROOT = REPO_ROOT / "db/seed_config/seed/data"
OUTPUT_PATH = DATA_ROOT / "unit_point_costs.data.ts"
SHARD_ROOT = DATA_ROOT / "unit_point_costs/10e"
LEGACY_UNIT_DATASHEET_ROOT = DATA_ROOT / "unit_datasheets"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bsdata-root", default=str(DEFAULT_BSDATA_ROOT))
    args = parser.parse_args()

    index = BsDataIndex(Path(args.bsdata_root))
    expected_records = expected_unit_point_costs(index, REPO_ROOT)
    records_by_slug: "OrderedDict[str, dict[str, str | int]]" = OrderedDict()

    for record in expected_records:
        records_by_slug.setdefault(str(record["unit_point_cost_slug"]), record)

    previous_count = (
        count_seed_records(OUTPUT_PATH)
        + count_seed_records(SHARD_ROOT)
        + count_seed_records(LEGACY_UNIT_DATASHEET_ROOT)
    )
    groups = group_records_by_owner(records_by_slug.values())
    write_sharded_files(groups)
    remove_legacy_unit_point_cost_files()

    print(
        {
            "unit_point_costs": len(records_by_slug),
            "previous_unit_point_costs": previous_count,
            "faction_memberships": len(expected_records),
            "shards": len(groups),
        },
    )


def group_records_by_owner(
    records: Iterable[dict[str, str | int]],
) -> "OrderedDict[str, list[dict[str, str | int]]]":
    groups: "OrderedDict[str, list[dict[str, str | int]]]" = OrderedDict()

    for record in records:
        owner_slug = str(record["source_owner_slug"])
        groups.setdefault(owner_slug, []).append(record)

    return OrderedDict(sorted(groups.items()))


def count_seed_records(path: Path) -> int:
    if not path.exists():
        return 0

    if path.is_file():
        return len(re.findall(r"UnitPointCostConfig = \{", path.read_text()))

    return sum(count_seed_records(file_path) for file_path in path.rglob("*.data.ts"))


def write_sharded_files(
    groups: "OrderedDict[str, list[dict[str, str | int]]]",
) -> None:
    SHARD_ROOT.mkdir(parents=True, exist_ok=True)

    for existing_path in SHARD_ROOT.glob("*.data.ts"):
        existing_path.unlink()

    for owner_slug, records in groups.items():
        (SHARD_ROOT / f"{owner_slug}.data.ts").write_text(
            render_shard_file(owner_slug, records),
        )

    (SHARD_ROOT / "_index.unit_point_costs.data.ts").write_text(
        render_edition_index(groups),
    )
    (SHARD_ROOT.parent / "_index.unit_point_costs.data.ts").write_text(
        'export * from "./10e/_index.unit_point_costs.data";\n',
    )
    OUTPUT_PATH.write_text(render_root_file())


def remove_legacy_unit_point_cost_files() -> None:
    if not LEGACY_UNIT_DATASHEET_ROOT.exists():
        return

    for path in LEGACY_UNIT_DATASHEET_ROOT.glob("*/*_unit_point_costs.data.ts"):
        path.unlink()


def render_root_file() -> str:
    return "\n".join(
        [
            'import type { SeedDataset } from "../../types/_index.types";',
            'import { unitPointCosts10e } from "./unit_point_costs/10e/_index.unit_point_costs.data";',
            "",
            "/**",
            " * Typed seed dataset for the `unit_point_costs` table.",
            " */",
            'export const unitPointCostsDataset: SeedDataset<"unit_point_costs"> = {',
            '  table: "unit_point_costs",',
            "  records: [...unitPointCosts10e],",
            "};",
            "",
        ],
    )


def render_shard_file(
    owner_slug: str,
    records: list[dict[str, str | int]],
) -> str:
    const_names = [
        f"{identifier_pascal_case(str(record['unit_point_cost_slug']))}PointCost"
        for record in records
    ]
    dataset_name = f"{identifier_camel_case(owner_slug)}UnitPointCosts10e"

    lines = [
        "import type {",
        "  SeedDataset,",
        "  UnitPointCostConfig,",
        '} from "../../../../types/_index.types";',
        'import { gameEditionId, rulesSourceId, unitId, unitPointCostId } from "../../../ids";',
        "",
        "/**",
        f" * 10th edition unit point cost rows owned by `{owner_slug}`.",
        " * Generated from BSData point cost values and modifiers.",
        " */",
        "",
    ]

    for record, const_name in zip(records, const_names, strict=True):
        lines.extend(
            [
                f"export const {const_name}: UnitPointCostConfig = {{",
                f'  id: unitPointCostId("{record["unit_point_cost_slug"]}"),',
                f'  unit_point_cost_slug: "{record["unit_point_cost_slug"]}",',
                f'  unit_id: unitId("{record["unit_slug"]}"),',
                '  game_edition_id: gameEditionId("10e"),',
                f'  rules_source_id: rulesSourceId("{record["rules_source_slug"]}"),',
                f'  minimum_model_count: {record["minimum_model_count"]},',
                f'  maximum_model_count: {record["maximum_model_count"]},',
                f'  unit_points: {record["unit_points"]},',
                '  effective_date: new Date("2024-01-01"),',
                "  superseded_date: null,",
                "};",
                "",
                "",
            ],
        )

    lines.extend(
        [
            f'export const {dataset_name}: SeedDataset<"unit_point_costs"> = {{',
            '  table: "unit_point_costs",',
            "  records: [",
        ],
    )
    lines.extend(f"    {const_name}," for const_name in const_names)
    lines.extend(
        [
            "  ] satisfies UnitPointCostConfig[],",
            "};",
            "",
        ],
    )

    return "\n".join(lines)


def render_edition_index(
    groups: "OrderedDict[str, list[dict[str, str | int]]]",
) -> str:
    imports = [
        'import type { UnitPointCostConfig } from "../../../../types/_index.types";',
    ]
    dataset_names = []

    for owner_slug in groups:
        dataset_name = f"{identifier_camel_case(owner_slug)}UnitPointCosts10e"
        dataset_names.append(dataset_name)
        imports.append(f'import {{ {dataset_name} }} from "./{owner_slug}.data";')

    lines = [
        *imports,
        "",
        "export const unitPointCosts10e = [",
    ]
    lines.extend(f"  ...{dataset_name}.records," for dataset_name in dataset_names)
    lines.extend(
        [
            "] satisfies UnitPointCostConfig[];",
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
