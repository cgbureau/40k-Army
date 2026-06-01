#!/usr/bin/env python3
"""Sync weapons, weapon_profiles, and weapon_profile_keywords from BSData."""

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
    expected_weapon_profile_keywords,
    expected_weapon_profiles,
    expected_weapons,
)

DEFAULT_BSDATA_ROOT = Path(__file__).resolve().parents[1].parent / "wh40k-10e"
REPO_ROOT = Path(__file__).resolve().parents[1]
DATA_ROOT = REPO_ROOT / "db/seed_config/seed/data"
KEYWORD_IDS_PATH = DATA_ROOT.parent / "ids/reference_data/keywords.ids.ts"
KEYWORDS_PATH = DATA_ROOT / "keywords.data.ts"
WEAPONS_OUTPUT_PATH = DATA_ROOT / "weapons.data.ts"
WEAPONS_SHARD_ROOT = DATA_ROOT / "weapons"
WEAPON_PROFILES_OUTPUT_PATH = DATA_ROOT / "weapon_profiles.data.ts"
WEAPON_PROFILES_SHARD_ROOT = DATA_ROOT / "weapon_profiles/10e"
WEAPON_PROFILE_KEYWORDS_OUTPUT_PATH = DATA_ROOT / "weapon_profile_keywords.data.ts"
WEAPON_PROFILE_KEYWORDS_SHARD_ROOT = DATA_ROOT / "weapon_profile_keywords/10e"

GENERATED_KEYWORD_START = "// BEGIN BSData weapon keyword records"
GENERATED_KEYWORD_END = "// END BSData weapon keyword records"
GENERATED_KEYWORD_RECORDS_START = "    // BEGIN BSData weapon keyword dataset records"
GENERATED_KEYWORD_RECORDS_END = "    // END BSData weapon keyword dataset records"
GENERATED_KEYWORD_TYPE_START = "  // BEGIN BSData weapon keyword type records"
GENERATED_KEYWORD_TYPE_END = "  // END BSData weapon keyword type records"
GENERATED_KEYWORD_ID_START = "  // BEGIN BSData weapon keyword id records"
GENERATED_KEYWORD_ID_END = "  // END BSData weapon keyword id records"
CROCKFORD_BASE32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bsdata-root", default=str(DEFAULT_BSDATA_ROOT))
    args = parser.parse_args()

    index = BsDataIndex(Path(args.bsdata_root))
    weapon_records = expected_weapons(index, REPO_ROOT)
    weapon_profile_records = expected_weapon_profiles(index, REPO_ROOT)
    weapon_profile_keyword_records = expected_weapon_profile_keywords(index, REPO_ROOT)
    keyword_records = weapon_keyword_records(weapon_profile_keyword_records)

    previous_counts = {
        "weapons": count_seed_records(WEAPONS_OUTPUT_PATH, "WeaponConfig")
        + count_seed_records(WEAPONS_SHARD_ROOT, "WeaponConfig"),
        "weapon_profiles": count_seed_records(
            WEAPON_PROFILES_OUTPUT_PATH,
            "WeaponProfileConfig",
        )
        + count_seed_records(WEAPON_PROFILES_SHARD_ROOT, "WeaponProfileConfig"),
        "weapon_profile_keywords": count_seed_records(
            WEAPON_PROFILE_KEYWORDS_OUTPUT_PATH,
            "WeaponProfileKeywordConfig",
        )
        + count_seed_records(
            WEAPON_PROFILE_KEYWORDS_SHARD_ROOT,
            "WeaponProfileKeywordConfig",
        ),
    }

    ensure_weapon_keyword_ids(keyword_records)
    ensure_weapon_keywords(keyword_records)
    write_weapon_files(group_records_by_owner(weapon_records))
    write_weapon_profile_files(group_records_by_owner(weapon_profile_records))
    write_weapon_profile_keyword_files(
        group_records_by_owner(weapon_profile_keyword_records),
    )

    print(
        {
            "weapons": len(weapon_records),
            "previous_weapons": previous_counts["weapons"],
            "weapon_profiles": len(weapon_profile_records),
            "previous_weapon_profiles": previous_counts["weapon_profiles"],
            "weapon_profile_keywords": len(weapon_profile_keyword_records),
            "previous_weapon_profile_keywords": previous_counts[
                "weapon_profile_keywords"
            ],
            "weapon_keywords": len(keyword_records),
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


def weapon_keyword_records(
    weapon_profile_keyword_records: list[dict[str, str | None]],
) -> list[dict[str, str]]:
    records_by_slug: "OrderedDict[str, dict[str, str]]" = OrderedDict()

    for record in weapon_profile_keyword_records:
        keyword_slug = str(record["keyword_slug"])
        records_by_slug.setdefault(
            keyword_slug,
            {
                "keyword_slug": keyword_slug,
                "keyword_name": str(record["keyword_name"]),
            },
        )

    return sorted(records_by_slug.values(), key=lambda record: record["keyword_slug"])


def ensure_weapon_keywords(records: list[dict[str, str]]) -> None:
    source = KEYWORDS_PATH.read_text()
    source = remove_generated_keyword_block(source)
    existing_slugs = set(re.findall(r'keyword_slug: "([^"]+)"', source))
    new_records = [
        record for record in records if record["keyword_slug"] not in existing_slugs
    ]

    if not new_records:
        KEYWORDS_PATH.write_text(source)
        return

    const_names = [
        f"{identifier_pascal_case(record['keyword_slug'])}WeaponKeyword"
        for record in new_records
    ]
    block_lines = [
        GENERATED_KEYWORD_START,
        "",
    ]

    for record, const_name in zip(new_records, const_names, strict=True):
        block_lines.extend(
            [
                f"export const {const_name}: KeywordConfig = {{",
                f'  id: keywordId({ts_string(record["keyword_slug"])}),',
                f'  keyword_slug: {ts_string(record["keyword_slug"])},',
                f'  keyword_name: {ts_string(record["keyword_name"])},',
                '  keyword_type: "weapon",',
                "};",
                "",
            ],
        )

    block_lines.append(GENERATED_KEYWORD_END)
    block = "\n".join(block_lines)
    source = source.replace(
        "export const keywordsDataset",
        f"{block}\n\nexport const keywordsDataset",
    )

    records_block = "\n".join(
        [
            GENERATED_KEYWORD_RECORDS_START,
            *(f"    {const_name}," for const_name in const_names),
            GENERATED_KEYWORD_RECORDS_END,
        ],
    )
    source = source.replace(
        "  ] satisfies KeywordConfig[],",
        f"{records_block}\n  ] satisfies KeywordConfig[],",
        1,
    )

    KEYWORDS_PATH.write_text(source)


def ensure_weapon_keyword_ids(records: list[dict[str, str]]) -> None:
    source = KEYWORD_IDS_PATH.read_text()
    existing_ids = parse_existing_keyword_ids(source)
    source = remove_generated_keyword_id_blocks(source)
    existing_slugs = set(re.findall(r'\|\s+"([^"]+)"', source))
    new_records = [
        record for record in records if record["keyword_slug"] not in existing_slugs
    ]

    if not new_records:
        KEYWORD_IDS_PATH.write_text(source)
        return

    type_block = "\n".join(
        [
            GENERATED_KEYWORD_TYPE_START,
            *(
                f'  | "{record["keyword_slug"]}"'
                for record in new_records
            ),
            GENERATED_KEYWORD_TYPE_END,
        ],
    )
    id_block = "\n".join(
        [
            GENERATED_KEYWORD_ID_START,
            *(
                f'  {record["keyword_slug"]}: "{existing_ids.get(record["keyword_slug"], deterministic_ulid("keyword", record["keyword_slug"]))}",'
                for record in new_records
            ),
            GENERATED_KEYWORD_ID_END,
        ],
    )
    source = source.replace(
        ";\n\nconst keywordSeedIds",
        f"\n{type_block}\n;\n\nconst keywordSeedIds",
        1,
    )
    source = source.replace(
        "};\n\nexport const keywordId",
        f"{id_block}\n}};\n\nexport const keywordId",
        1,
    )
    KEYWORD_IDS_PATH.write_text(source)


def remove_generated_keyword_block(source: str) -> str:
    pattern = (
        rf"\n?{re.escape(GENERATED_KEYWORD_START)}[\s\S]*?"
        rf"{re.escape(GENERATED_KEYWORD_END)}\n\n?"
    )
    source = re.sub(pattern, "\n", source)
    records_pattern = (
        rf"\n?{re.escape(GENERATED_KEYWORD_RECORDS_START)}[\s\S]*?"
        rf"{re.escape(GENERATED_KEYWORD_RECORDS_END)}\n?"
    )
    source = re.sub(records_pattern, "", source)

    return source


def remove_generated_keyword_id_blocks(source: str) -> str:
    type_pattern = (
        rf"\n?{re.escape(GENERATED_KEYWORD_TYPE_START)}[\s\S]*?"
        rf"{re.escape(GENERATED_KEYWORD_TYPE_END)}\n?"
    )
    id_pattern = (
        rf"\n?{re.escape(GENERATED_KEYWORD_ID_START)}[\s\S]*?"
        rf"{re.escape(GENERATED_KEYWORD_ID_END)}\n?"
    )
    source = re.sub(type_pattern, "\n", source)
    source = re.sub(id_pattern, "", source)

    return source


def parse_existing_keyword_ids(source: str) -> dict[str, str]:
    block_match = re.search(
        r"const keywordSeedIds: Record<[^>]+, string> = \{(?P<body>.*?)\};",
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


def write_weapon_files(
    groups: "OrderedDict[str, list[dict[str, object]]]",
) -> None:
    WEAPONS_SHARD_ROOT.mkdir(parents=True, exist_ok=True)

    for existing_path in WEAPONS_SHARD_ROOT.glob("*.data.ts"):
        existing_path.unlink()

    for owner_slug, records in groups.items():
        (WEAPONS_SHARD_ROOT / f"{owner_slug}.data.ts").write_text(
            render_weapon_shard_file(owner_slug, records),
        )

    (WEAPONS_SHARD_ROOT / "_index.weapons.data.ts").write_text(
        render_weapon_index(groups),
    )
    WEAPONS_OUTPUT_PATH.write_text(render_weapon_root_file())


def write_weapon_profile_files(
    groups: "OrderedDict[str, list[dict[str, object]]]",
) -> None:
    WEAPON_PROFILES_SHARD_ROOT.mkdir(parents=True, exist_ok=True)

    for existing_path in WEAPON_PROFILES_SHARD_ROOT.glob("*.data.ts"):
        existing_path.unlink()

    for owner_slug, records in groups.items():
        (WEAPON_PROFILES_SHARD_ROOT / f"{owner_slug}.data.ts").write_text(
            render_weapon_profile_shard_file(owner_slug, records),
        )

    (WEAPON_PROFILES_SHARD_ROOT / "_index.weapon_profiles.data.ts").write_text(
        render_weapon_profile_edition_index(groups),
    )
    (
        WEAPON_PROFILES_SHARD_ROOT.parent / "_index.weapon_profiles.data.ts"
    ).write_text('export * from "./10e/_index.weapon_profiles.data";\n')
    WEAPON_PROFILES_OUTPUT_PATH.write_text(render_weapon_profile_root_file())


def write_weapon_profile_keyword_files(
    groups: "OrderedDict[str, list[dict[str, object]]]",
) -> None:
    WEAPON_PROFILE_KEYWORDS_SHARD_ROOT.mkdir(parents=True, exist_ok=True)

    for existing_path in WEAPON_PROFILE_KEYWORDS_SHARD_ROOT.glob("*.data.ts"):
        existing_path.unlink()

    for owner_slug, records in groups.items():
        (
            WEAPON_PROFILE_KEYWORDS_SHARD_ROOT / f"{owner_slug}.data.ts"
        ).write_text(
            render_weapon_profile_keyword_shard_file(owner_slug, records),
        )

    (
        WEAPON_PROFILE_KEYWORDS_SHARD_ROOT
        / "_index.weapon_profile_keywords.data.ts"
    ).write_text(render_weapon_profile_keyword_edition_index(groups))
    (
        WEAPON_PROFILE_KEYWORDS_SHARD_ROOT.parent
        / "_index.weapon_profile_keywords.data.ts"
    ).write_text('export * from "./10e/_index.weapon_profile_keywords.data";\n')
    WEAPON_PROFILE_KEYWORDS_OUTPUT_PATH.write_text(
        render_weapon_profile_keyword_root_file(),
    )


def render_weapon_root_file() -> str:
    return "\n".join(
        [
            'import type { SeedDataset } from "../../types/_index.types";',
            'import { weapons } from "./weapons/_index.weapons.data";',
            "",
            "/**",
            " * Typed seed dataset for the `weapons` table.",
            " */",
            'export const weaponsDataset: SeedDataset<"weapons"> = {',
            '  table: "weapons",',
            "  records: [...weapons],",
            "};",
            "",
        ],
    )


def render_weapon_profile_root_file() -> str:
    return "\n".join(
        [
            'import type { SeedDataset } from "../../types/_index.types";',
            'import { weaponProfiles10e } from "./weapon_profiles/10e/_index.weapon_profiles.data";',
            "",
            "/**",
            " * Typed seed dataset for the `weapon_profiles` table.",
            " */",
            'export const weaponProfilesDataset: SeedDataset<"weapon_profiles"> = {',
            '  table: "weapon_profiles",',
            "  records: [...weaponProfiles10e],",
            "};",
            "",
        ],
    )


def render_weapon_profile_keyword_root_file() -> str:
    return "\n".join(
        [
            'import type { SeedDataset } from "../../types/_index.types";',
            'import { weaponProfileKeywords10e } from "./weapon_profile_keywords/10e/_index.weapon_profile_keywords.data";',
            "",
            "/**",
            " * Typed seed dataset for the `weapon_profile_keywords` table.",
            " */",
            'export const weaponProfileKeywordsDataset: SeedDataset<"weapon_profile_keywords"> = {',
            '  table: "weapon_profile_keywords",',
            "  records: [...weaponProfileKeywords10e],",
            "};",
            "",
        ],
    )


def render_weapon_shard_file(
    owner_slug: str,
    records: list[dict[str, object]],
) -> str:
    const_names = [
        f"{identifier_pascal_case(str(record['weapon_slug']))}Weapon"
        for record in records
    ]
    dataset_name = f"{identifier_camel_case(owner_slug)}Weapons"

    lines = [
        "import type {",
        "  SeedDataset,",
        "  WeaponConfig,",
        '} from "../../../types/_index.types";',
        'import { weaponId } from "../../ids";',
        "",
        "/**",
        f" * Weapon rows owned by `{owner_slug}`.",
        " * Generated from BSData weapon profiles.",
        " */",
        "",
    ]

    for record, const_name in zip(records, const_names, strict=True):
        lines.extend(
            [
                f"export const {const_name}: WeaponConfig = {{",
                f'  id: weaponId({ts_string(str(record["weapon_slug"]))}),',
                f'  weapon_slug: {ts_string(str(record["weapon_slug"]))},',
                f'  weapon_name: {ts_string(str(record["weapon_name"]))},',
                f'  weapon_type: {ts_string(str(record["weapon_type"]))},',
                "};",
                "",
                "",
            ],
        )

    lines.extend(render_dataset(dataset_name, "weapons", const_names, "WeaponConfig"))

    return "\n".join(lines)


def render_weapon_profile_shard_file(
    owner_slug: str,
    records: list[dict[str, object]],
) -> str:
    const_names = [
        f"{identifier_pascal_case(str(record['weapon_profile_slug']))}WeaponProfile"
        for record in records
    ]
    dataset_name = f"{identifier_camel_case(owner_slug)}WeaponProfiles10e"

    lines = [
        "import type {",
        "  SeedDataset,",
        "  WeaponProfileConfig,",
        '} from "../../../../types/_index.types";',
        'import { gameEditionId, rulesSourceId, weaponId, weaponProfileId } from "../../../ids";',
        "",
        "/**",
        f" * 10th edition weapon profile rows owned by `{owner_slug}`.",
        " * Generated from BSData weapon profiles.",
        " */",
        "",
    ]

    for record, const_name in zip(records, const_names, strict=True):
        lines.extend(
            [
                f"export const {const_name}: WeaponProfileConfig = {{",
                f'  id: weaponProfileId({ts_string(str(record["weapon_profile_slug"]))}),',
                f'  weapon_profile_slug: {ts_string(str(record["weapon_profile_slug"]))},',
                f'  weapon_id: weaponId({ts_string(str(record["weapon_slug"]))}),',
                '  game_edition_id: gameEditionId("10e"),',
                f'  rules_source_id: rulesSourceId({ts_string(str(record["rules_source_slug"]))}),',
                f'  range: {ts_string(str(record["range"]))},',
                f'  attacks: {ts_string(str(record["attacks"]))},',
                f'  skill: {ts_string(str(record["skill"]))},',
                f'  strength: {ts_string(str(record["strength"]))},',
                f'  armor_penetration: {record["armor_penetration"]},',
                f'  damage: {ts_string(str(record["damage"]))},',
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
            "weapon_profiles",
            const_names,
            "WeaponProfileConfig",
        ),
    )

    return "\n".join(lines)


def render_weapon_profile_keyword_shard_file(
    owner_slug: str,
    records: list[dict[str, object]],
) -> str:
    const_names = [
        f"{identifier_pascal_case(str(record['weapon_profile_keyword_slug']))}WeaponProfileKeyword"
        for record in records
    ]
    dataset_name = f"{identifier_camel_case(owner_slug)}WeaponProfileKeywords10e"

    lines = [
        "import type {",
        "  SeedDataset,",
        "  WeaponProfileKeywordConfig,",
        '} from "../../../../types/_index.types";',
        'import { keywordId, weaponProfileId, weaponProfileKeywordId } from "../../../ids";',
        "",
        "/**",
        f" * 10th edition weapon profile keyword rows owned by `{owner_slug}`.",
        " * Generated from BSData weapon profile keywords.",
        " */",
        "",
    ]

    for record, const_name in zip(records, const_names, strict=True):
        keyword_parameter = record["keyword_parameter"]
        lines.extend(
            [
                f"export const {const_name}: WeaponProfileKeywordConfig = {{",
                f'  id: weaponProfileKeywordId({ts_string(str(record["weapon_profile_keyword_slug"]))}),',
                f'  weapon_profile_id: weaponProfileId({ts_string(str(record["weapon_profile_slug"]))}),',
                f'  keyword_id: keywordId({ts_string(str(record["keyword_slug"]))}),',
                f"  keyword_parameter: {ts_string(str(keyword_parameter)) if keyword_parameter is not None else 'null'},",
                "};",
                "",
                "",
            ],
        )

    lines.extend(
        render_dataset(
            dataset_name,
            "weapon_profile_keywords",
            const_names,
            "WeaponProfileKeywordConfig",
        ),
    )

    return "\n".join(lines)


def render_weapon_index(
    groups: "OrderedDict[str, list[dict[str, object]]]",
) -> str:
    imports = [
        'import type { WeaponConfig } from "../../../types/_index.types";',
    ]
    dataset_names = []

    for owner_slug in groups:
        dataset_name = f"{identifier_camel_case(owner_slug)}Weapons"
        dataset_names.append(dataset_name)
        imports.append(f'import {{ {dataset_name} }} from "./{owner_slug}.data";')

    lines = [
        *imports,
        "",
        "export const weapons = [",
    ]
    lines.extend(f"  ...{dataset_name}.records," for dataset_name in dataset_names)
    lines.extend(
        [
            "] satisfies WeaponConfig[];",
            "",
        ],
    )

    return "\n".join(lines)


def render_weapon_profile_edition_index(
    groups: "OrderedDict[str, list[dict[str, object]]]",
) -> str:
    imports = [
        'import type { WeaponProfileConfig } from "../../../../types/_index.types";',
    ]
    dataset_names = []

    for owner_slug in groups:
        dataset_name = f"{identifier_camel_case(owner_slug)}WeaponProfiles10e"
        dataset_names.append(dataset_name)
        imports.append(f'import {{ {dataset_name} }} from "./{owner_slug}.data";')

    lines = [
        *imports,
        "",
        "export const weaponProfiles10e = [",
    ]
    lines.extend(f"  ...{dataset_name}.records," for dataset_name in dataset_names)
    lines.extend(
        [
            "] satisfies WeaponProfileConfig[];",
            "",
        ],
    )

    return "\n".join(lines)


def render_weapon_profile_keyword_edition_index(
    groups: "OrderedDict[str, list[dict[str, object]]]",
) -> str:
    imports = [
        'import type { WeaponProfileKeywordConfig } from "../../../../types/_index.types";',
    ]
    dataset_names = []

    for owner_slug in groups:
        dataset_name = f"{identifier_camel_case(owner_slug)}WeaponProfileKeywords10e"
        dataset_names.append(dataset_name)
        imports.append(f'import {{ {dataset_name} }} from "./{owner_slug}.data";')

    lines = [
        *imports,
        "",
        "export const weaponProfileKeywords10e = [",
    ]
    lines.extend(f"  ...{dataset_name}.records," for dataset_name in dataset_names)
    lines.extend(
        [
            "] satisfies WeaponProfileKeywordConfig[];",
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
