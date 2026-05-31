#!/usr/bin/env python3
"""Sync unit_profiles and unit_profile_stats seed data from local BSData catalogs."""

from __future__ import annotations

import argparse
import json
import re
from collections import OrderedDict
from pathlib import Path
from typing import Iterable

from bsdata_expected_counts import (
    BsDataIndex,
    expected_unit_profile_stats,
    expected_unit_profiles,
)

DEFAULT_BSDATA_ROOT = Path("/Users/mikeearley/code/wh40k-10e")
REPO_ROOT = Path(__file__).resolve().parents[1]
DATA_ROOT = REPO_ROOT / "db/seed_config/seed/data"
UNIT_PROFILES_OUTPUT_PATH = DATA_ROOT / "unit_profiles.data.ts"
UNIT_PROFILES_SHARD_ROOT = DATA_ROOT / "unit_profiles/10e"
UNIT_PROFILE_STATS_OUTPUT_PATH = DATA_ROOT / "unit_profile_stats.data.ts"
UNIT_PROFILE_STATS_SHARD_ROOT = DATA_ROOT / "unit_profile_stats/10e"
LEGACY_UNIT_DATASHEET_ROOT = DATA_ROOT / "unit_datasheets"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bsdata-root", default=str(DEFAULT_BSDATA_ROOT))
    args = parser.parse_args()

    index = BsDataIndex(Path(args.bsdata_root))
    expected_profile_records = expected_unit_profiles(index, REPO_ROOT)
    expected_stat_records = expected_unit_profile_stats(index, REPO_ROOT)
    profiles_by_slug: "OrderedDict[str, dict[str, object]]" = OrderedDict()
    stats_by_slug: "OrderedDict[str, dict[str, object]]" = OrderedDict()

    for record in expected_profile_records:
        profiles_by_slug.setdefault(str(record["unit_profile_slug"]), record)

    for record in expected_stat_records:
        stats_by_slug.setdefault(str(record["unit_profile_stat_slug"]), record)

    previous_profile_count = (
        count_seed_records(UNIT_PROFILES_OUTPUT_PATH, "UnitProfileConfig")
        + count_seed_records(UNIT_PROFILES_SHARD_ROOT, "UnitProfileConfig")
        + count_seed_records(LEGACY_UNIT_DATASHEET_ROOT, "UnitProfileConfig")
    )
    previous_stat_count = (
        count_seed_records(UNIT_PROFILE_STATS_OUTPUT_PATH, "UnitProfileStatConfig")
        + count_seed_records(UNIT_PROFILE_STATS_SHARD_ROOT, "UnitProfileStatConfig")
        + count_seed_records(LEGACY_UNIT_DATASHEET_ROOT, "UnitProfileStatConfig")
    )

    profile_groups = group_records_by_owner(profiles_by_slug.values())
    stat_groups = group_records_by_owner(stats_by_slug.values())
    write_profile_files(profile_groups)
    write_stat_files(stat_groups)
    remove_legacy_unit_profile_files()

    print(
        {
            "unit_profiles": len(profiles_by_slug),
            "previous_unit_profiles": previous_profile_count,
            "unit_profile_faction_memberships": len(expected_profile_records),
            "unit_profile_stats": len(stats_by_slug),
            "previous_unit_profile_stats": previous_stat_count,
            "unit_profile_stat_faction_memberships": len(expected_stat_records),
            "profile_shards": len(profile_groups),
            "stat_shards": len(stat_groups),
        },
    )


def group_records_by_owner(
    records: Iterable[dict[str, object]],
) -> "OrderedDict[str, list[dict[str, object]]]":
    groups: "OrderedDict[str, list[dict[str, object]]]" = OrderedDict()

    for record in records:
        owner_slug = str(record["source_owner_slug"])
        groups.setdefault(owner_slug, []).append(record)

    return OrderedDict(sorted(groups.items()))


def count_seed_records(path: Path, config_name: str) -> int:
    if not path.exists():
        return 0

    if path.is_file():
        return len(re.findall(fr"{config_name} = \{{", path.read_text()))

    return sum(
        count_seed_records(file_path, config_name)
        for file_path in path.rglob("*.data.ts")
    )


def write_profile_files(
    groups: "OrderedDict[str, list[dict[str, object]]]",
) -> None:
    UNIT_PROFILES_SHARD_ROOT.mkdir(parents=True, exist_ok=True)

    for existing_path in UNIT_PROFILES_SHARD_ROOT.glob("*.data.ts"):
        existing_path.unlink()

    for owner_slug, records in groups.items():
        (UNIT_PROFILES_SHARD_ROOT / f"{owner_slug}.data.ts").write_text(
            render_profile_shard_file(owner_slug, records),
        )

    (UNIT_PROFILES_SHARD_ROOT / "_index.unit_profiles.data.ts").write_text(
        render_profile_edition_index(groups),
    )
    (UNIT_PROFILES_SHARD_ROOT.parent / "_index.unit_profiles.data.ts").write_text(
        'export * from "./10e/_index.unit_profiles.data";\n',
    )
    UNIT_PROFILES_OUTPUT_PATH.write_text(render_profile_root_file())


def write_stat_files(
    groups: "OrderedDict[str, list[dict[str, object]]]",
) -> None:
    UNIT_PROFILE_STATS_SHARD_ROOT.mkdir(parents=True, exist_ok=True)

    for existing_path in UNIT_PROFILE_STATS_SHARD_ROOT.glob("*.data.ts"):
        existing_path.unlink()

    for owner_slug, records in groups.items():
        (UNIT_PROFILE_STATS_SHARD_ROOT / f"{owner_slug}.data.ts").write_text(
            render_stat_shard_file(owner_slug, records),
        )

    (UNIT_PROFILE_STATS_SHARD_ROOT / "_index.unit_profile_stats.data.ts").write_text(
        render_stat_edition_index(groups),
    )
    (
        UNIT_PROFILE_STATS_SHARD_ROOT.parent / "_index.unit_profile_stats.data.ts"
    ).write_text(
        'export * from "./10e/_index.unit_profile_stats.data";\n',
    )
    UNIT_PROFILE_STATS_OUTPUT_PATH.write_text(render_stat_root_file())


def remove_legacy_unit_profile_files() -> None:
    if not LEGACY_UNIT_DATASHEET_ROOT.exists():
        return

    for path in LEGACY_UNIT_DATASHEET_ROOT.glob("*/*_unit_profiles.data.ts"):
        path.unlink()

    for path in LEGACY_UNIT_DATASHEET_ROOT.glob("*/*_unit_profile_stats.data.ts"):
        path.unlink()


def render_profile_root_file() -> str:
    return "\n".join(
        [
            'import type { SeedDataset } from "../../types/_index.types";',
            'import { unitProfiles10e } from "./unit_profiles/10e/_index.unit_profiles.data";',
            "",
            "/**",
            " * Typed seed dataset for the `unit_profiles` table.",
            " */",
            'export const unitProfilesDataset: SeedDataset<"unit_profiles"> = {',
            '  table: "unit_profiles",',
            "  records: [...unitProfiles10e],",
            "};",
            "",
        ],
    )


def render_stat_root_file() -> str:
    return "\n".join(
        [
            'import type { SeedDataset } from "../../types/_index.types";',
            'import { unitProfileStats10e } from "./unit_profile_stats/10e/_index.unit_profile_stats.data";',
            "",
            "/**",
            " * Typed seed dataset for the `unit_profile_stats` table.",
            " */",
            'export const unitProfileStatsDataset: SeedDataset<"unit_profile_stats"> = {',
            '  table: "unit_profile_stats",',
            "  records: [...unitProfileStats10e],",
            "};",
            "",
        ],
    )


def render_profile_shard_file(
    owner_slug: str,
    records: list[dict[str, object]],
) -> str:
    const_names = [
        f"{identifier_pascal_case(str(record['unit_profile_slug']))}UnitProfile"
        for record in records
    ]
    dataset_name = f"{identifier_camel_case(owner_slug)}UnitProfiles10e"

    lines = [
        "import type {",
        "  SeedDataset,",
        "  UnitProfileConfig,",
        '} from "../../../../types/_index.types";',
        'import { gameEditionId, rulesSourceId, unitId, unitProfileId } from "../../../ids";',
        "",
        "/**",
        f" * 10th edition unit profile rows owned by `{owner_slug}`.",
        " * Generated from BSData Unit profiles.",
        " */",
        "",
    ]

    for record, const_name in zip(records, const_names, strict=True):
        lines.extend(
            [
                f"export const {const_name}: UnitProfileConfig = {{",
                f'  id: unitProfileId({ts_string(str(record["unit_profile_slug"]))}),',
                f'  unit_profile_slug: {ts_string(str(record["unit_profile_slug"]))},',
                f'  unit_profile_name: {ts_string(str(record["unit_profile_name"]))},',
                '  game_edition_id: gameEditionId("10e"),',
                f'  unit_id: unitId({ts_string(str(record["unit_slug"]))}),',
                "  model_id: null,",
                f'  rules_source_id: rulesSourceId({ts_string(str(record["rules_source_slug"]))}),',
                "  effective_date: null,",
                "  superseded_date: null,",
                "};",
                "",
                "",
            ],
        )

    lines.extend(render_dataset(dataset_name, "unit_profiles", const_names, "UnitProfileConfig"))

    return "\n".join(lines)


def render_stat_shard_file(
    owner_slug: str,
    records: list[dict[str, object]],
) -> str:
    const_names = [
        f"{identifier_pascal_case(str(record['unit_profile_stat_slug']))}UnitProfileStat"
        for record in records
    ]
    dataset_name = f"{identifier_camel_case(owner_slug)}UnitProfileStats10e"

    lines = [
        "import type {",
        "  SeedDataset,",
        "  UnitProfileStatConfig,",
        '} from "../../../../types/_index.types";',
        'import { unitProfileId, unitProfileStatId } from "../../../ids";',
        "",
        "/**",
        f" * 10th edition unit profile stat rows owned by `{owner_slug}`.",
        " * Generated from BSData Unit profile characteristics.",
        " */",
        "",
    ]

    for record, const_name in zip(records, const_names, strict=True):
        lines.extend(
            [
                f"export const {const_name}: UnitProfileStatConfig = {{",
                f'  id: unitProfileStatId({ts_string(str(record["unit_profile_stat_slug"]))}),',
                f'  unit_profile_id: unitProfileId({ts_string(str(record["unit_profile_slug"]))}),',
                f'  stat_key: {ts_string(str(record["stat_key"]))},',
                f'  stat_value: {ts_string(str(record["stat_value"]))},',
                "};",
                "",
                "",
            ],
        )

    lines.extend(
        render_dataset(
            dataset_name,
            "unit_profile_stats",
            const_names,
            "UnitProfileStatConfig",
        ),
    )

    return "\n".join(lines)


def render_profile_edition_index(
    groups: "OrderedDict[str, list[dict[str, object]]]",
) -> str:
    imports = [
        'import type { UnitProfileConfig } from "../../../../types/_index.types";',
    ]
    dataset_names = []

    for owner_slug in groups:
        dataset_name = f"{identifier_camel_case(owner_slug)}UnitProfiles10e"
        dataset_names.append(dataset_name)
        imports.append(f'import {{ {dataset_name} }} from "./{owner_slug}.data";')

    lines = [
        *imports,
        "",
        "export const unitProfiles10e = [",
    ]
    lines.extend(f"  ...{dataset_name}.records," for dataset_name in dataset_names)
    lines.extend(
        [
            "] satisfies UnitProfileConfig[];",
            "",
        ],
    )

    return "\n".join(lines)


def render_stat_edition_index(
    groups: "OrderedDict[str, list[dict[str, object]]]",
) -> str:
    imports = [
        'import type { UnitProfileStatConfig } from "../../../../types/_index.types";',
    ]
    dataset_names = []

    for owner_slug in groups:
        dataset_name = f"{identifier_camel_case(owner_slug)}UnitProfileStats10e"
        dataset_names.append(dataset_name)
        imports.append(f'import {{ {dataset_name} }} from "./{owner_slug}.data";')

    lines = [
        *imports,
        "",
        "export const unitProfileStats10e = [",
    ]
    lines.extend(f"  ...{dataset_name}.records," for dataset_name in dataset_names)
    lines.extend(
        [
            "] satisfies UnitProfileStatConfig[];",
            "",
        ],
    )

    return "\n".join(lines)


def render_dataset(
    dataset_name: str,
    table_name: str,
    const_names: list[str],
    config_name: str,
) -> list[str]:
    lines = [
        f'export const {dataset_name}: SeedDataset<"{table_name}"> = {{',
        f'  table: "{table_name}",',
        "  records: [",
    ]
    lines.extend(f"    {const_name}," for const_name in const_names)
    lines.extend(
        [
            f"  ] satisfies {config_name}[],",
            "};",
            "",
        ],
    )
    return lines


def ts_string(value: str) -> str:
    return json.dumps(value)


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
