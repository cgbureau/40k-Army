#!/usr/bin/env python3
"""Sync and shard core 10e unit and detachment seed datasets from BSData."""

from __future__ import annotations

import hashlib
import json
import os
import re
from collections import Counter, OrderedDict
from pathlib import Path
from typing import Iterable

from bsdata_expected_counts import (
    BsDataIndex,
    DEFAULT_RULES_SOURCE_BY_FACTION,
    expected_rules_faction_detachments,
    expected_rules_faction_units,
    unit_source_owner_slug,
)

REPO_ROOT = Path(__file__).resolve().parents[1]
DATA_ROOT = REPO_ROOT / "db/seed_config/seed/data"
GENERATED_IDS_PATH = REPO_ROOT / "db/seed_config/seed/ids/generated_game_data.ids.ts"
DEFAULT_BSDATA_ROOT = Path(__file__).resolve().parents[1].parent / "wh40k-10e"
CROCKFORD_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"

SM_CODEX_ONLY_FACTIONS = {
    "imperial_fists",
    "iron_hands",
    "raven_guard",
    "salamanders",
    "ultramarines",
    "white_scars",
}


def main() -> None:
    bsdata_root = Path(os.environ.get("BSDATA_40K_ROOT", str(DEFAULT_BSDATA_ROOT)))
    index = BsDataIndex(bsdata_root)

    expected_unit_memberships = expected_rules_faction_units(index, REPO_ROOT)
    expected_detachment_memberships = expected_rules_faction_detachments(index)

    current_units = read_current_units()
    current_pair_sources = read_current_rules_faction_unit_sources()
    source_by_faction = default_rules_source_by_faction(current_pair_sources)
    source_by_detachment = read_current_rules_source_by_detachment()

    unit_records = build_unit_records(current_units, expected_unit_memberships)
    rules_faction_unit_records = build_rules_faction_unit_records(
        expected_unit_memberships,
        current_pair_sources,
        source_by_faction,
    )
    detachment_records = build_detachment_records(
        expected_detachment_memberships,
        source_by_detachment,
    )
    rules_faction_detachment_records = build_rules_faction_detachment_records(
        expected_detachment_memberships,
    )

    write_units(unit_records)
    write_rules_faction_units(rules_faction_unit_records)
    write_detachments(detachment_records)
    write_rules_faction_detachments(rules_faction_detachment_records)
    sync_generated_ids(
        unit_slugs=set(unit_records),
        rules_faction_unit_slugs=set(rules_faction_unit_records),
        detachment_slugs=set(detachment_records),
        rules_faction_detachment_slugs=set(rules_faction_detachment_records),
    )

    print(
        json.dumps(
            {
                "units": len(unit_records),
                "rules_faction_units": len(rules_faction_unit_records),
                "detachments": len(detachment_records),
                "rules_faction_detachments": len(rules_faction_detachment_records),
            },
            sort_keys=True,
        ),
    )


def read_current_units() -> dict[str, dict[str, str | bool | None]]:
    records: dict[str, dict[str, str | bool | None]] = {}

    for source in table_sources("units"):
        for block in re.findall(
            r"export const \w+Unit: UnitConfig = \{(.*?)\n\};",
            source,
            flags=re.S,
        ):
            slug = required_match(r'unit_slug: "([^"]+)"', block)
            records[slug] = {
                "unit_slug": slug,
                "unit_name": json.loads(required_match(r"unit_name: (\".*?\"),", block, re.S)),
                "is_legends": required_match(r"is_legends: (true|false)", block) == "true",
                "wahapedia_url": parse_nullable_string_field(block, "wahapedia_url"),
            }

    return records


def read_current_rules_faction_unit_sources() -> dict[str, str]:
    sources: dict[str, str] = {}

    for source in table_sources("rules_faction_units"):
        for block in re.findall(
            r"export const \w+RulesFactionUnit: RulesFactionUnitConfig = \{(.*?)\n\};",
            source,
            flags=re.S,
        ):
            slug = required_match(r'rules_faction_unit_slug: "([^"]+)"', block)
            rules_source_slug = required_match(
                r'rules_source_id: rulesSourceId\("([^"]+)"\)',
                block,
            )
            sources[slug] = rules_source_slug

    return sources


def read_current_rules_source_by_detachment() -> dict[str, str]:
    sources: dict[str, str] = {}

    for source in table_sources("detachments"):
        for block in re.findall(
            r"export const \w+Detachment: DetachmentConfig = \{(.*?)\n\};",
            source,
            flags=re.S,
        ):
            slug = required_match(r'detachment_slug: "([^"]+)"', block)
            rules_source_slug = required_match(
                r'rules_source_id: rulesSourceId\("([^"]+)"\)',
                block,
            )
            sources[slug] = rules_source_slug

    return sources


def table_sources(table_name: str) -> list[str]:
    sources: list[str] = []
    root_file = DATA_ROOT / f"{table_name}.data.ts"
    shard_root = DATA_ROOT / table_name

    if root_file.exists():
        sources.append(root_file.read_text())

    if shard_root.exists():
        for path in sorted(shard_root.rglob("*.data.ts")):
            if path.name.startswith("_index."):
                continue
            sources.append(path.read_text())

    return sources


def parse_nullable_string_field(block: str, field_name: str) -> str | None:
    value = required_match(rf"{field_name}:\s*(?:\n\s*)?(null|\".*?\"),", block, re.S)
    if value == "null":
        return None
    return json.loads(value)


def build_unit_records(
    current_units: dict[str, dict[str, str | bool | None]],
    expected_memberships: list[dict[str, str]],
) -> "OrderedDict[str, dict[str, str | bool | None]]":
    unit_records: dict[str, dict[str, str | bool | None]] = {
        slug: dict(record) for slug, record in current_units.items()
    }
    owner_by_unit = unit_owner_by_slug(expected_memberships)

    for record in expected_memberships:
        slug = record["unit_slug"]
        unit_records.setdefault(
            slug,
            {
                "unit_slug": slug,
                "unit_name": record["unit_name"],
                "is_legends": "Legends" in record["unit_name"],
                "wahapedia_url": None,
            },
        )

    for slug, record in unit_records.items():
        record["source_owner_slug"] = owner_by_unit.get(
            slug,
            infer_owner_from_wahapedia_url(record.get("wahapedia_url")),
        )

    return OrderedDict(sorted(unit_records.items()))


def unit_owner_by_slug(
    expected_memberships: list[dict[str, str]],
) -> dict[str, str]:
    owners: dict[str, str] = {}

    for record in expected_memberships:
        unit_slug = record["unit_slug"]
        owners.setdefault(
            unit_slug,
            unit_source_owner_slug(
                unit_slug,
                record["source_file"],
                record["rules_faction_slug"],
            ),
        )

    return owners


def infer_owner_from_wahapedia_url(value: str | bool | None) -> str:
    if not isinstance(value, str):
        return "legacy_unmapped"

    match = re.search(r"/factions/([^/]+)/", value)
    if not match:
        return "legacy_unmapped"

    return match.group(1).replace("-", "_").replace("t_au", "tau")


def build_rules_faction_unit_records(
    expected_memberships: list[dict[str, str]],
    current_pair_sources: dict[str, str],
    source_by_faction: dict[str, str],
) -> "OrderedDict[str, dict[str, str]]":
    records: dict[str, dict[str, str]] = {}

    for record in expected_memberships:
        slug = f'{record["rules_faction_slug"]}__{record["unit_slug"]}'
        records[slug] = {
            "rules_faction_unit_slug": slug,
            "rules_faction_slug": record["rules_faction_slug"],
            "unit_slug": record["unit_slug"],
            "unit_access_type": record["unit_access_type"],
            "rules_source_slug": rules_source_for_unit_membership(
                record,
                slug,
                current_pair_sources,
                source_by_faction,
            ),
        }

    return OrderedDict(sorted(records.items()))


def rules_source_for_unit_membership(
    record: dict[str, str],
    slug: str,
    current_pair_sources: dict[str, str],
    source_by_faction: dict[str, str],
) -> str:
    if "rules_source_slug" in record:
        return record["rules_source_slug"]

    if slug in current_pair_sources:
        return current_pair_sources[slug]

    if (
        record["source_file"] == "Imperium - Space Marines.cat"
        or record["rules_faction_slug"] in SM_CODEX_ONLY_FACTIONS
    ):
        return "faction_pack_space_marines_10e_v1_8"

    return source_by_faction.get(
        record["rules_faction_slug"],
        DEFAULT_RULES_SOURCE_BY_FACTION[record["rules_faction_slug"]],
    )


def default_rules_source_by_faction(current_pair_sources: dict[str, str]) -> dict[str, str]:
    counts: dict[str, Counter[str]] = {}

    for slug, source in current_pair_sources.items():
        faction_slug = slug.split("__", 1)[0]
        counts.setdefault(faction_slug, Counter())[source] += 1

    return {
        faction_slug: source_counts.most_common(1)[0][0]
        for faction_slug, source_counts in counts.items()
    }


def build_detachment_records(
    expected_memberships: list[dict[str, str]],
    source_by_detachment: dict[str, str],
) -> "OrderedDict[str, dict[str, str]]":
    records: dict[str, dict[str, str]] = {}

    for membership in expected_memberships:
        slug = membership["detachment_slug"]
        records.setdefault(
            slug,
            {
                "detachment_slug": slug,
                "detachment_name": membership["detachment_name"],
                "rules_source_slug": source_by_detachment.get(
                    slug,
                    membership["rules_source_slug"],
                ),
                "source_owner_slug": membership["rules_faction_slug"],
            },
        )

    return OrderedDict(sorted(records.items()))


def build_rules_faction_detachment_records(
    expected_memberships: list[dict[str, str]],
) -> "OrderedDict[str, dict[str, str]]":
    records: dict[str, dict[str, str]] = {}

    for membership in expected_memberships:
        slug = f'{membership["rules_faction_slug"]}__{membership["detachment_slug"]}'
        records[slug] = {
            "rules_faction_detachment_slug": slug,
            "rules_faction_slug": membership["rules_faction_slug"],
            "detachment_slug": membership["detachment_slug"],
            "detachment_access_type": membership["detachment_access_type"],
        }

    return OrderedDict(sorted(records.items()))


def write_units(records: "OrderedDict[str, dict[str, str | bool | None]]") -> None:
    groups = group_by(records.values(), "source_owner_slug")
    write_sharded_dataset(
        table_name="units",
        groups=groups,
        root_import='import { units10e } from "./units/10e/_index.units.data";',
        root_records="records: [...units10e],",
        config_name="UnitConfig",
        dataset_name_suffix="Units10e",
        aggregate_name="units10e",
        shard_renderer=render_units_shard,
        root_comment="Typed seed dataset for the `units` table.",
        edition=True,
    )


def write_rules_faction_units(records: "OrderedDict[str, dict[str, str]]") -> None:
    groups = group_by(records.values(), "rules_faction_slug")
    write_sharded_dataset(
        table_name="rules_faction_units",
        groups=groups,
        root_import='import { rulesFactionUnits10e } from "./rules_faction_units/10e/_index.rules_faction_units.data";',
        root_records="records: [...rulesFactionUnits10e],",
        config_name="RulesFactionUnitConfig",
        dataset_name_suffix="RulesFactionUnits10e",
        aggregate_name="rulesFactionUnits10e",
        shard_renderer=render_rules_faction_units_shard,
        root_comment="Typed seed dataset for the `rules_faction_units` table.",
        edition=True,
    )


def write_detachments(records: "OrderedDict[str, dict[str, str]]") -> None:
    groups = group_by(records.values(), "source_owner_slug")
    write_sharded_dataset(
        table_name="detachments",
        groups=groups,
        root_import='import { detachments10e } from "./detachments/10e/_index.detachments.data";',
        root_records="records: [...detachments10e],",
        config_name="DetachmentConfig",
        dataset_name_suffix="Detachments10e",
        aggregate_name="detachments10e",
        shard_renderer=render_detachments_shard,
        root_comment="Typed seed dataset for the `detachments` table.",
        edition=True,
    )


def write_rules_faction_detachments(
    records: "OrderedDict[str, dict[str, str]]",
) -> None:
    groups = group_by(records.values(), "rules_faction_slug")
    write_sharded_dataset(
        table_name="rules_faction_detachments",
        groups=groups,
        root_import='import { rulesFactionDetachments10e } from "./rules_faction_detachments/10e/_index.rules_faction_detachments.data";',
        root_records="records: [...rulesFactionDetachments10e],",
        config_name="RulesFactionDetachmentConfig",
        dataset_name_suffix="RulesFactionDetachments10e",
        aggregate_name="rulesFactionDetachments10e",
        shard_renderer=render_rules_faction_detachments_shard,
        root_comment="Typed seed dataset for the `rules_faction_detachments` table.",
        edition=True,
    )


def group_by(
    records: Iterable[dict[str, str | bool | None]],
    key: str,
) -> "OrderedDict[str, list[dict[str, str | bool | None]]]":
    groups: dict[str, list[dict[str, str | bool | None]]] = {}

    for record in records:
        groups.setdefault(str(record[key]), []).append(record)

    return OrderedDict(sorted(groups.items()))


def write_sharded_dataset(
    *,
    table_name: str,
    groups: "OrderedDict[str, list[dict[str, str | bool | None]]]",
    root_import: str,
    root_records: str,
    config_name: str,
    dataset_name_suffix: str,
    aggregate_name: str,
    shard_renderer,
    root_comment: str,
    edition: bool,
) -> None:
    root_file = DATA_ROOT / f"{table_name}.data.ts"
    shard_root = DATA_ROOT / table_name / "10e" if edition else DATA_ROOT / table_name
    shard_root.mkdir(parents=True, exist_ok=True)

    for existing_path in shard_root.glob("*.data.ts"):
        existing_path.unlink()

    dataset_names: list[str] = []
    for owner_slug, records in groups.items():
        dataset_name = f"{identifier_camel_case(owner_slug)}{dataset_name_suffix}"
        dataset_names.append(dataset_name)
        (shard_root / f"{owner_slug}.data.ts").write_text(
            shard_renderer(owner_slug, dataset_name, records),
        )

    (shard_root / f"_index.{table_name}.data.ts").write_text(
        render_index_file(
            table_name=table_name,
            config_name=config_name,
            aggregate_name=aggregate_name,
            owner_slugs=list(groups),
            dataset_names=dataset_names,
            depth=4 if edition else 3,
        ),
    )
    if edition:
        (shard_root.parent / f"_index.{table_name}.data.ts").write_text(
            f'export * from "./10e/_index.{table_name}.data";\n',
        )

    root_file.write_text(
        "\n".join(
            [
                'import type { SeedDataset } from "../../types/_index.types";',
                root_import,
                "",
                "/**",
                f" * {root_comment}",
                " */",
                f'export const {dataset_root_name(table_name)}Dataset: SeedDataset<"{table_name}"> = {{',
                f'  table: "{table_name}",',
                f"  {root_records}",
                "};",
                "",
            ],
        ),
    )


def render_index_file(
    *,
    table_name: str,
    config_name: str,
    aggregate_name: str,
    owner_slugs: list[str],
    dataset_names: list[str],
    depth: int,
) -> str:
    prefix = "../" * depth
    imports = [f'import type {{ {config_name} }} from "{prefix}types/_index.types";']
    imports.extend(
        f'import {{ {dataset_name} }} from "./{owner_slug}.data";'
        for owner_slug, dataset_name in zip(owner_slugs, dataset_names, strict=True)
    )
    lines = [*imports, "", f"export const {aggregate_name} = ["]
    lines.extend(f"  ...{dataset_name}.records," for dataset_name in dataset_names)
    lines.extend([f"] satisfies {config_name}[];", ""])
    return "\n".join(lines)


def render_units_shard(
    owner_slug: str,
    dataset_name: str,
    records: list[dict[str, str | bool | None]],
) -> str:
    const_names = [f"{identifier_pascal_case(str(record['unit_slug']))}Unit" for record in records]
    lines = [
        "import type { SeedDataset, UnitConfig } from \"../../../../types/_index.types\";",
        'import { unitId } from "../../../ids";',
        "",
        "/**",
        f" * 10th edition unit rows owned by `{owner_slug}`.",
        " */",
        "",
    ]
    for record, const_name in zip(records, const_names, strict=True):
        lines.extend(
            [
                f"export const {const_name}: UnitConfig = {{",
                f'  id: unitId("{record["unit_slug"]}"),',
                f'  unit_name: {ts_string(str(record["unit_name"]))},',
                f'  unit_slug: "{record["unit_slug"]}",',
                f'  is_legends: {str(bool(record["is_legends"])).lower()},',
                f'  wahapedia_url: {ts_string(record["wahapedia_url"])},',
                "};",
                "",
                "",
            ],
        )
    lines.extend(render_dataset(dataset_name, "units", const_names, "UnitConfig"))
    return "\n".join(lines)


def render_rules_faction_units_shard(
    owner_slug: str,
    dataset_name: str,
    records: list[dict[str, str | bool | None]],
) -> str:
    const_names = [
        f"{identifier_pascal_case(str(record['rules_faction_unit_slug']))}RulesFactionUnit"
        for record in records
    ]
    lines = [
        "import type {",
        "  RulesFactionUnitConfig,",
        "  SeedDataset,",
        '} from "../../../../types/_index.types";',
        "import {",
        "  rulesFactionId,",
        "  rulesFactionUnitId,",
        "  rulesSourceId,",
        "  unitId,",
        '} from "../../../ids";',
        "",
        "/**",
        f" * 10th edition rules faction unit rows for `{owner_slug}`.",
        " */",
        "",
    ]
    for record, const_name in zip(records, const_names, strict=True):
        lines.extend(
            [
                f"export const {const_name}: RulesFactionUnitConfig = {{",
                f'  id: rulesFactionUnitId("{record["rules_faction_unit_slug"]}"),',
                f'  rules_faction_unit_slug: "{record["rules_faction_unit_slug"]}",',
                f'  rules_faction_id: rulesFactionId("{record["rules_faction_slug"]}"),',
                f'  unit_id: unitId("{record["unit_slug"]}"),',
                f'  unit_access_type: "{record["unit_access_type"]}",',
                f'  rules_source_id: rulesSourceId("{record["rules_source_slug"]}"),',
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
            "rules_faction_units",
            const_names,
            "RulesFactionUnitConfig",
        ),
    )
    return "\n".join(lines)


def render_detachments_shard(
    owner_slug: str,
    dataset_name: str,
    records: list[dict[str, str | bool | None]],
) -> str:
    const_names = [
        f"{identifier_pascal_case(str(record['detachment_slug']))}Detachment"
        for record in records
    ]
    lines = [
        "import type { DetachmentConfig, SeedDataset } from \"../../../../types/_index.types\";",
        'import { detachmentId, rulesSourceId } from "../../../ids";',
        "",
        "/**",
        f" * 10th edition detachment rows owned by `{owner_slug}`.",
        " */",
        "",
    ]
    for record, const_name in zip(records, const_names, strict=True):
        lines.extend(
            [
                f"export const {const_name}: DetachmentConfig = {{",
                f'  id: detachmentId("{record["detachment_slug"]}"),',
                f'  detachment_name: {ts_string(str(record["detachment_name"]))},',
                f'  detachment_slug: "{record["detachment_slug"]}",',
                f'  rules_source_id: rulesSourceId("{record["rules_source_slug"]}"),',
                "};",
                "",
                "",
            ],
        )
    lines.extend(render_dataset(dataset_name, "detachments", const_names, "DetachmentConfig"))
    return "\n".join(lines)


def render_rules_faction_detachments_shard(
    owner_slug: str,
    dataset_name: str,
    records: list[dict[str, str | bool | None]],
) -> str:
    const_names = [
        f"{identifier_pascal_case(str(record['rules_faction_detachment_slug']))}RulesFactionDetachment"
        for record in records
    ]
    lines = [
        "import type {",
        "  RulesFactionDetachmentConfig,",
        "  SeedDataset,",
        '} from "../../../../types/_index.types";',
        'import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";',
        "",
        "/**",
        f" * 10th edition rules faction detachment rows for `{owner_slug}`.",
        " */",
        "",
    ]
    for record, const_name in zip(records, const_names, strict=True):
        lines.extend(
            [
                f"export const {const_name}: RulesFactionDetachmentConfig = {{",
                f'  id: rulesFactionDetachmentId("{record["rules_faction_detachment_slug"]}"),',
                f'  rules_faction_id: rulesFactionId("{record["rules_faction_slug"]}"),',
                f'  detachment_id: detachmentId("{record["detachment_slug"]}"),',
                f'  detachment_access_type: "{record["detachment_access_type"]}",',
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
            "rules_faction_detachments",
            const_names,
            "RulesFactionDetachmentConfig",
        ),
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
    lines.extend([f"  ] satisfies {config_name}[],", "};", ""])
    return lines


def dataset_root_name(table_name: str) -> str:
    return {
        "detachments": "detachments",
        "rules_faction_detachments": "rulesFactionDetachments",
        "rules_faction_units": "rulesFactionUnits",
        "units": "units",
    }[table_name]


def sync_generated_ids(
    *,
    unit_slugs: set[str],
    rules_faction_unit_slugs: set[str],
    detachment_slugs: set[str],
    rules_faction_detachment_slugs: set[str],
) -> None:
    text = GENERATED_IDS_PATH.read_text()

    unit_ids = parse_seed_ids(text, "unitSeedIds", "UnitSeedSlug", quoted=False)
    for slug in unit_slugs:
        unit_ids.setdefault(slug, stable_id(f"unit:{slug}"))

    rules_faction_unit_ids = parse_seed_ids(
        text,
        "rulesFactionUnitSeedIds",
        "RulesFactionUnitSeedSlug",
        quoted=True,
    )
    rules_faction_unit_ids = {
        slug: value
        for slug, value in rules_faction_unit_ids.items()
        if slug in rules_faction_unit_slugs
    }
    for slug in rules_faction_unit_slugs:
        rules_faction_unit_ids.setdefault(slug, stable_id(f"rules_faction_unit:{slug}"))

    detachment_ids = parse_seed_ids(
        text,
        "detachmentSeedIds",
        "DetachmentSeedSlug",
        quoted=True,
    )
    detachment_ids = {
        slug: value for slug, value in detachment_ids.items() if slug in detachment_slugs
    }
    for slug in detachment_slugs:
        detachment_ids.setdefault(slug, stable_id(f"detachment:{slug}"))

    rules_faction_detachment_ids = parse_seed_ids(
        text,
        "rulesFactionDetachmentSeedIds",
        "RulesFactionDetachmentSeedSlug",
        quoted=True,
    )
    rules_faction_detachment_ids = {
        slug: value
        for slug, value in rules_faction_detachment_ids.items()
        if slug in rules_faction_detachment_slugs
    }
    for slug in rules_faction_detachment_slugs:
        rules_faction_detachment_ids.setdefault(
            slug,
            stable_id(f"rules_faction_detachment:{slug}"),
        )

    text = replace_type_union(text, "UnitSeedSlug", sorted(unit_ids))
    text = replace_record_object(
        text,
        "unitSeedIds",
        "UnitSeedSlug",
        render_seed_id_lines(unit_ids, quoted=False),
    )
    text = replace_type_union(text, "RulesFactionUnitSeedSlug", sorted(rules_faction_unit_ids))
    text = replace_record_object(
        text,
        "rulesFactionUnitSeedIds",
        "RulesFactionUnitSeedSlug",
        render_seed_id_lines(rules_faction_unit_ids, quoted=True),
    )
    text = replace_type_union(text, "DetachmentSeedSlug", sorted(detachment_ids))
    text = replace_record_object(
        text,
        "detachmentSeedIds",
        "DetachmentSeedSlug",
        render_seed_id_lines(detachment_ids, quoted=True),
    )
    text = replace_type_union(
        text,
        "RulesFactionDetachmentSeedSlug",
        sorted(rules_faction_detachment_ids),
    )
    text = replace_record_object(
        text,
        "rulesFactionDetachmentSeedIds",
        "RulesFactionDetachmentSeedSlug",
        render_seed_id_lines(rules_faction_detachment_ids, quoted=True),
    )

    GENERATED_IDS_PATH.write_text(text)


def parse_seed_ids(
    text: str,
    object_name: str,
    type_name: str,
    *,
    quoted: bool,
) -> dict[str, str]:
    block = required_match(
        rf"const {object_name}: Record<\s*{type_name},\s*string\s*> = \{{\n(.*?)\n\}};",
        text,
        re.S,
    )
    if quoted:
        return dict(re.findall(r'  "([^"]+)": "([^"]+)",', block))
    return dict(re.findall(r"  ([a-zA-Z0-9_]+): \"([^\"]+)\",", block))


def replace_type_union(text: str, type_name: str, slugs: list[str]) -> str:
    pattern = re.compile(rf"type {type_name} =\n(?:  \| \"[^\"]+\"\n)*  \| \"[^\"]+\";")
    replacement = f"type {type_name} =\n" + "\n".join(
        f'  | "{slug}"' for slug in slugs
    ) + ";"
    return pattern.sub(replacement, text, count=1)


def replace_record_object(
    text: str,
    object_name: str,
    type_name: str,
    lines: str,
) -> str:
    pattern = re.compile(
        rf"const {object_name}: Record<\s*{type_name},\s*string\s*> = \{{\n.*?\n\}};",
        flags=re.S,
    )
    replacement = f"const {object_name}: Record<{type_name}, string> = {{\n{lines}\n}};"
    return pattern.sub(replacement, text, count=1)


def render_seed_id_lines(seed_ids: dict[str, str], *, quoted: bool) -> str:
    if quoted:
        return "\n".join(f'  "{slug}": "{seed_ids[slug]}",' for slug in sorted(seed_ids))
    return "\n".join(f'  {slug}: "{seed_ids[slug]}",' for slug in sorted(seed_ids))


def ts_string(value: str | bool | None) -> str:
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
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


def stable_id(value: str) -> str:
    digest = hashlib.sha256(value.encode("utf8")).digest()
    number = int.from_bytes(digest, "big")
    chars: list[str] = []
    for _ in range(23):
        number, remainder = divmod(number, len(CROCKFORD_ALPHABET))
        chars.append(CROCKFORD_ALPHABET[remainder])
    return "01K" + "".join(chars)


def required_match(pattern: str, value: str, flags: int = 0) -> str:
    match = re.search(pattern, value, flags=flags)
    if not match:
        raise ValueError(f"Could not match pattern: {pattern}")
    return match.group(1)


if __name__ == "__main__":
    main()
