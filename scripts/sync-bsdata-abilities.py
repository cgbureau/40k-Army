#!/usr/bin/env python3
"""Sync abilities and unit_abilities seed data from local BSData catalogs."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from collections import OrderedDict
from pathlib import Path
from typing import Iterable

from bsdata_expected_counts import (
    BsDataIndex,
    expected_abilities,
    expected_unit_abilities,
)

DEFAULT_BSDATA_ROOT = Path(__file__).resolve().parents[1].parent / "wh40k-10e"
REPO_ROOT = Path(__file__).resolve().parents[1]
DATA_ROOT = REPO_ROOT / "db/seed_config/seed/data"
ABILITY_IDS_PATH = REPO_ROOT / "db/seed_config/seed/ids/reference_data/abilities.ids.ts"
ABILITIES_OUTPUT_PATH = DATA_ROOT / "abilities.data.ts"
ABILITIES_SHARD_ROOT = DATA_ROOT / "abilities/10e"
UNIT_ABILITIES_OUTPUT_PATH = DATA_ROOT / "unit_abilities.data.ts"
UNIT_ABILITIES_SHARD_ROOT = DATA_ROOT / "unit_abilities/10e"
CROCKFORD_BASE32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bsdata-root", default=str(DEFAULT_BSDATA_ROOT))
    args = parser.parse_args()

    index = BsDataIndex(Path(args.bsdata_root))
    ability_records = expected_abilities(index, REPO_ROOT)
    unit_ability_memberships = expected_unit_abilities(index, REPO_ROOT)
    unit_ability_records = unique_records_by_slug(
        unit_ability_memberships,
        "unit_ability_slug",
    )
    previous_counts = {
        "abilities": count_seed_records(ABILITIES_OUTPUT_PATH, "AbilityConfig")
        + count_seed_records(ABILITIES_SHARD_ROOT, "AbilityConfig"),
        "unit_abilities": count_seed_records(
            UNIT_ABILITIES_OUTPUT_PATH,
            "UnitAbilityConfig",
        )
        + count_seed_records(UNIT_ABILITIES_SHARD_ROOT, "UnitAbilityConfig"),
    }

    write_ability_ids(ability_records)
    write_ability_files(group_records_by_owner(ability_records))
    write_unit_ability_files(group_records_by_owner(unit_ability_records))

    print(
        {
            "abilities": len(ability_records),
            "previous_abilities": previous_counts["abilities"],
            "unit_abilities": len(unit_ability_records),
            "previous_unit_abilities": previous_counts["unit_abilities"],
            "unit_ability_faction_memberships": len(unit_ability_memberships),
            "ability_shards": len(group_records_by_owner(ability_records)),
            "unit_ability_shards": len(group_records_by_owner(unit_ability_records)),
        },
    )


def unique_records_by_slug(
    records: Iterable[dict[str, str]],
    slug_key: str,
) -> list[dict[str, str]]:
    records_by_slug: "OrderedDict[str, dict[str, str]]" = OrderedDict()

    for record in records:
        records_by_slug.setdefault(str(record[slug_key]), record)

    return sorted(
        records_by_slug.values(),
        key=lambda record: (record["source_owner_slug"], record[slug_key]),
    )


def group_records_by_owner(
    records: Iterable[dict[str, str]],
) -> "OrderedDict[str, list[dict[str, str]]]":
    groups: "OrderedDict[str, list[dict[str, str]]]" = OrderedDict()

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


def write_ability_ids(records: list[dict[str, str]]) -> None:
    existing_ids = parse_existing_seed_ids(ABILITY_IDS_PATH.read_text())
    sorted_records = sorted(records, key=lambda record: record["ability_slug"])
    union_lines = "\n".join(
        f'  | "{record["ability_slug"]}"' for record in sorted_records
    )
    id_lines = "\n".join(
        f'  {record["ability_slug"]}: "{existing_ids.get(record["ability_slug"], deterministic_ulid("ability", record["ability_slug"]))}",'
        for record in sorted_records
    )

    ABILITY_IDS_PATH.write_text(
        "\n".join(
            [
                "/**",
                " * Fixed ULIDs for canonical ability seed types.",
                " *",
                " * The values were generated once and then checked in so repeated seed runs use",
                " * the same primary keys. Do not replace these with runtime `ulid()` calls.",
                " */",
                "",
                "type AbilitySeedType =",
                f"{union_lines};",
                "",
                "const abilitySeedIds: Record<AbilitySeedType, string> = {",
                id_lines,
                "};",
                "",
                "export const abilityId = (type: AbilitySeedType): string => {",
                "  return abilitySeedIds[type];",
                "};",
                "",
            ],
        ),
    )


def parse_existing_seed_ids(source: str) -> dict[str, str]:
    block_match = re.search(
        r"const abilitySeedIds: Record<[^>]+, string> = \{(?P<body>.*?)\};",
        source,
        flags=re.DOTALL,
    )
    if not block_match:
        return {}

    return {
        match.group(1): match.group(2)
        for match in re.finditer(
            r'^\s*([A-Za-z0-9_]+):\s*"([^"]+)",',
            block_match.group("body"),
            flags=re.MULTILINE,
        )
    }


def deterministic_ulid(namespace: str, seed: str) -> str:
    digest = hashlib.sha256(f"{namespace}:{seed}".encode("utf-8")).digest()
    value = int.from_bytes(digest, "big")
    chars: list[str] = []

    for _ in range(23):
        chars.append(CROCKFORD_BASE32[value & 31])
        value >>= 5

    return "01K" + "".join(reversed(chars))


def write_ability_files(
    groups: "OrderedDict[str, list[dict[str, str]]]",
) -> None:
    ABILITIES_SHARD_ROOT.mkdir(parents=True, exist_ok=True)

    for existing_path in ABILITIES_SHARD_ROOT.glob("*.data.ts"):
        existing_path.unlink()

    for owner_slug, records in groups.items():
        (ABILITIES_SHARD_ROOT / f"{owner_slug}.data.ts").write_text(
            render_ability_shard_file(owner_slug, records),
        )

    (ABILITIES_SHARD_ROOT / "_index.abilities.data.ts").write_text(
        render_ability_edition_index(groups),
    )
    (ABILITIES_SHARD_ROOT.parent / "_index.abilities.data.ts").write_text(
        'export * from "./10e/_index.abilities.data";\n',
    )
    ABILITIES_OUTPUT_PATH.write_text(render_ability_root_file())


def write_unit_ability_files(
    groups: "OrderedDict[str, list[dict[str, str]]]",
) -> None:
    UNIT_ABILITIES_SHARD_ROOT.mkdir(parents=True, exist_ok=True)

    for existing_path in UNIT_ABILITIES_SHARD_ROOT.glob("*.data.ts"):
        existing_path.unlink()

    for owner_slug, records in groups.items():
        (UNIT_ABILITIES_SHARD_ROOT / f"{owner_slug}.data.ts").write_text(
            render_unit_ability_shard_file(owner_slug, records),
        )

    (UNIT_ABILITIES_SHARD_ROOT / "_index.unit_abilities.data.ts").write_text(
        render_unit_ability_edition_index(groups),
    )
    (
        UNIT_ABILITIES_SHARD_ROOT.parent / "_index.unit_abilities.data.ts"
    ).write_text(
        'export * from "./10e/_index.unit_abilities.data";\n',
    )
    UNIT_ABILITIES_OUTPUT_PATH.write_text(render_unit_ability_root_file())


def render_ability_root_file() -> str:
    return "\n".join(
        [
            'import type { SeedDataset } from "../../types/_index.types";',
            'import { abilities10e } from "./abilities/10e/_index.abilities.data";',
            "",
            "/**",
            " * Typed seed dataset for the `abilities` table.",
            " */",
            'export const abilitiesDataset: SeedDataset<"abilities"> = {',
            '  table: "abilities",',
            "  records: [...abilities10e],",
            "};",
            "",
        ],
    )


def render_unit_ability_root_file() -> str:
    return "\n".join(
        [
            'import type { SeedDataset } from "../../types/_index.types";',
            'import { unitAbilities10e } from "./unit_abilities/10e/_index.unit_abilities.data";',
            "",
            "/**",
            " * Typed seed dataset for the `unit_abilities` table.",
            " */",
            'export const unitAbilitiesDataset: SeedDataset<"unit_abilities"> = {',
            '  table: "unit_abilities",',
            "  records: [...unitAbilities10e],",
            "};",
            "",
        ],
    )


def render_ability_shard_file(
    owner_slug: str,
    records: list[dict[str, str]],
) -> str:
    const_names = [
        f"{identifier_pascal_case(record['ability_slug'])}Ability"
        for record in records
    ]
    dataset_name = f"{identifier_camel_case(owner_slug)}Abilities10e"

    lines = [
        "import type {",
        "  AbilityConfig,",
        "  SeedDataset,",
        '} from "../../../../types/_index.types";',
        'import { abilityId } from "../../../ids";',
        "",
        "/**",
        f" * 10th edition ability rows owned by `{owner_slug}`.",
        " * Generated from BSData ability profiles.",
        " */",
        "",
    ]

    for record, const_name in zip(records, const_names, strict=True):
        lines.extend(
            [
                f"export const {const_name}: AbilityConfig = {{",
                f'  id: abilityId({ts_string(record["ability_slug"])}),',
                f'  ability_slug: {ts_string(record["ability_slug"])},',
                f'  ability_name: {ts_string(record["ability_name"])},',
                f'  ability_type: {ts_string(record["ability_type"])},',
                "};",
                "",
                "",
            ],
        )

    lines.extend(render_dataset(dataset_name, "abilities", const_names, "AbilityConfig"))

    return "\n".join(lines)


def render_unit_ability_shard_file(
    owner_slug: str,
    records: list[dict[str, str]],
) -> str:
    const_names = [
        f"{identifier_pascal_case(record['unit_ability_slug'])}UnitAbility"
        for record in records
    ]
    dataset_name = f"{identifier_camel_case(owner_slug)}UnitAbilities10e"

    lines = [
        "import type {",
        "  SeedDataset,",
        "  UnitAbilityConfig,",
        '} from "../../../../types/_index.types";',
        'import { abilityId, gameEditionId, rulesSourceId, unitAbilityId, unitId } from "../../../ids";',
        "",
        "/**",
        f" * 10th edition unit ability rows owned by `{owner_slug}`.",
        " * Generated from BSData ability profiles.",
        " */",
        "",
    ]

    for record, const_name in zip(records, const_names, strict=True):
        lines.extend(
            [
                f"export const {const_name}: UnitAbilityConfig = {{",
                f'  id: unitAbilityId({ts_string(record["unit_ability_slug"])}),',
                f'  unit_id: unitId({ts_string(record["unit_slug"])}),',
                f'  ability_id: abilityId({ts_string(record["ability_slug"])}),',
                '  game_edition_id: gameEditionId("10e"),',
                f'  rules_source_id: rulesSourceId({ts_string(record["rules_source_slug"])}),',
                f'  rules_text: {ts_string(record["rules_text"])},',
                "  effective_date: null,",
                "  superseded_date: null,",
                "};",
                "",
                "",
            ],
        )

    lines.extend(
        render_dataset(
            dataset_name,
            "unit_abilities",
            const_names,
            "UnitAbilityConfig",
        ),
    )

    return "\n".join(lines)


def render_ability_edition_index(
    groups: "OrderedDict[str, list[dict[str, str]]]",
) -> str:
    imports = [
        'import type { AbilityConfig } from "../../../../types/_index.types";',
    ]
    dataset_names = []

    for owner_slug in groups:
        dataset_name = f"{identifier_camel_case(owner_slug)}Abilities10e"
        dataset_names.append(dataset_name)
        imports.append(f'import {{ {dataset_name} }} from "./{owner_slug}.data";')

    lines = [
        *imports,
        "",
        "export const abilities10e = [",
    ]
    lines.extend(f"  ...{dataset_name}.records," for dataset_name in dataset_names)
    lines.extend(
        [
            "] satisfies AbilityConfig[];",
            "",
        ],
    )

    return "\n".join(lines)


def render_unit_ability_edition_index(
    groups: "OrderedDict[str, list[dict[str, str]]]",
) -> str:
    imports = [
        'import type { UnitAbilityConfig } from "../../../../types/_index.types";',
    ]
    dataset_names = []

    for owner_slug in groups:
        dataset_name = f"{identifier_camel_case(owner_slug)}UnitAbilities10e"
        dataset_names.append(dataset_name)
        imports.append(f'import {{ {dataset_name} }} from "./{owner_slug}.data";')

    lines = [
        *imports,
        "",
        "export const unitAbilities10e = [",
    ]
    lines.extend(f"  ...{dataset_name}.records," for dataset_name in dataset_names)
    lines.extend(
        [
            "] satisfies UnitAbilityConfig[];",
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
