#!/usr/bin/env python3
"""Sync units and rules_faction_units seed data against BSData memberships."""

from __future__ import annotations

import hashlib
import json
import os
import re
import subprocess
from collections import Counter
from pathlib import Path

from bsdata_expected_counts import (
    BsDataIndex,
    expected_rules_faction_units,
)

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_BSDATA_ROOT = Path("/Users/mikeearley/code/wh40k-10e")
UNITS_PATH = REPO_ROOT / "db/seed_config/seed/data/units.data.ts"
RULES_FACTION_UNITS_PATH = (
    REPO_ROOT / "db/seed_config/seed/data/rules_faction_units.data.ts"
)
GENERATED_IDS_PATH = REPO_ROOT / "db/seed_config/seed/ids/generated_game_data.ids.ts"

CROCKFORD_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"


def main() -> None:
    bsdata_root = Path(
        os.environ.get("BSDATA_40K_ROOT", str(DEFAULT_BSDATA_ROOT)),
    )
    index = BsDataIndex(bsdata_root)
    expected_records = expected_rules_faction_units(index, REPO_ROOT)

    unit_slugs = current_unit_slugs()
    unit_const_names = current_const_names(UNITS_PATH, "Unit")
    rules_faction_unit_const_names = current_const_names(
        RULES_FACTION_UNITS_PATH,
        "RulesFactionUnit",
    )
    rules_source_by_faction = default_rules_source_by_faction()

    missing_units = {
        record["unit_slug"]: record
        for record in expected_records
        if record["unit_slug"] not in unit_slugs
    }
    expected_pairs = {
        f'{record["rules_faction_slug"]}__{record["unit_slug"]}': record
        for record in expected_records
    }
    current_pairs = current_rules_faction_unit_slugs()
    missing_pairs = {
        slug: record
        for slug, record in expected_pairs.items()
        if slug not in current_pairs
    }
    extra_pairs = current_pairs - set(expected_pairs)

    sync_units_file(missing_units, unit_const_names)
    sync_rules_faction_units_file(
        expected_pairs,
        missing_pairs,
        extra_pairs,
        rules_faction_unit_const_names,
        rules_source_by_faction,
    )
    sync_generated_ids(unit_slugs | set(missing_units), set(expected_pairs))

    print(
        json.dumps(
            {
                "added_units": len(missing_units),
                "added_rules_faction_units": len(missing_pairs),
                "removed_rules_faction_units": len(extra_pairs),
            },
            sort_keys=True,
        ),
    )


def current_unit_slugs() -> set[str]:
    return set(re.findall(r'unit_slug: "([^"]+)"', UNITS_PATH.read_text()))


def current_rules_faction_unit_slugs() -> set[str]:
    return set(
        re.findall(
            r'rules_faction_unit_slug: "([^"]+)"',
            RULES_FACTION_UNITS_PATH.read_text(),
        ),
    )


def current_const_names(path: Path, suffix: str) -> dict[str, str]:
    text = path.read_text()
    const_names: dict[str, str] = {}

    for match in re.finditer(
        rf"export const (\w+{suffix}): .*? =\s*\{{(.*?)\n\s*\}};",
        text,
        flags=re.S,
    ):
        body = match.group(2)
        slug_match = re.search(rf'{slug_field_for_suffix(suffix)}: "([^"]+)"', body)
        if slug_match:
            const_names[slug_match.group(1)] = match.group(1)

    return const_names


def slug_field_for_suffix(suffix: str) -> str:
    if suffix == "Unit":
        return "unit_slug"
    if suffix == "RulesFactionUnit":
        return "rules_faction_unit_slug"
    raise ValueError(f"Unsupported suffix: {suffix}")


def default_rules_source_by_faction() -> dict[str, str]:
    counts: dict[str, Counter[str]] = {}
    text = RULES_FACTION_UNITS_PATH.read_text()

    for block in re.findall(
        r"export const .*?RulesFactionUnit: RulesFactionUnitConfig = \{(.*?)\n\};",
        text,
        flags=re.S,
    ):
        faction = required_match(
            r'rules_faction_id: rulesFactionId\("([^"]+)"\)',
            block,
        )
        source = required_match(r'rules_source_id: rulesSourceId\("([^"]+)"\)', block)
        counts.setdefault(faction, Counter())[source] += 1

    return {
        faction: source_counts.most_common(1)[0][0]
        for faction, source_counts in counts.items()
    }


def sync_units_file(
    missing_units: dict[str, dict[str, str]],
    const_names: dict[str, str],
) -> None:
    text = UNITS_PATH.read_text()
    new_blocks: list[str] = []

    for slug, record in sorted(missing_units.items()):
        const_name = unit_const_name(slug)
        const_names[slug] = const_name
        new_blocks.append(render_unit_block(const_name, slug, record["unit_name"]))

    if new_blocks:
        text = text.replace(
            "\nexport const unitsDataset: SeedDataset<\"units\"> = {",
            "\n".join(new_blocks)
            + "\nexport const unitsDataset: SeedDataset<\"units\"> = {",
        )

    text = replace_dataset_records(text, "units", sorted(const_names.values()))
    UNITS_PATH.write_text(text)


def sync_rules_faction_units_file(
    expected_pairs: dict[str, dict[str, str]],
    missing_pairs: dict[str, dict[str, str]],
    extra_pairs: set[str],
    const_names: dict[str, str],
    rules_source_by_faction: dict[str, str],
) -> None:
    text = RULES_FACTION_UNITS_PATH.read_text()

    for slug in sorted(extra_pairs):
        const_name = const_names.pop(slug)
        text = remove_const_block(text, const_name, "RulesFactionUnit")

    new_blocks: list[str] = []
    for slug, record in sorted(missing_pairs.items()):
        const_name = rules_faction_unit_const_name(slug)
        const_names[slug] = const_name
        rules_source_slug = rules_source_for_record(record, rules_source_by_faction)
        new_blocks.append(
            render_rules_faction_unit_block(
                const_name,
                slug,
                record["rules_faction_slug"],
                record["unit_slug"],
                record["unit_access_type"],
                rules_source_slug,
            ),
        )

    if new_blocks:
        text = text.replace(
            "\nexport const rulesFactionUnitsDataset: SeedDataset<\"rules_faction_units\"> = {",
            "\n".join(new_blocks)
            + "\nexport const rulesFactionUnitsDataset: SeedDataset<\"rules_faction_units\"> = {",
        )

    text = sync_rules_faction_unit_metadata(
        text,
        expected_pairs,
        const_names,
        rules_source_by_faction,
    )
    text = replace_dataset_records(
        text,
        "rulesFactionUnits",
        sorted(const_names.values()),
    )
    RULES_FACTION_UNITS_PATH.write_text(text)


def sync_rules_faction_unit_metadata(
    text: str,
    expected_pairs: dict[str, dict[str, str]],
    const_names: dict[str, str],
    rules_source_by_faction: dict[str, str],
) -> str:
    for slug, record in sorted(expected_pairs.items()):
        if "rules_source_slug" not in record:
            continue

        const_name = const_names[slug]
        rules_source_slug = rules_source_for_record(record, rules_source_by_faction)
        replacement = render_rules_faction_unit_block(
            const_name,
            slug,
            record["rules_faction_slug"],
            record["unit_slug"],
            record["unit_access_type"],
            rules_source_slug,
        )
        pattern = re.compile(
            rf"\nexport const {const_name}: RulesFactionUnitConfig =\s*\{{.*?\n\s*\}};\n",
            flags=re.S,
        )
        text = pattern.sub(replacement, text, count=1)

    return text


def sync_generated_ids(
    unit_slugs: set[str],
    expected_rules_faction_unit_slugs: set[str],
) -> None:
    text = GENERATED_IDS_PATH.read_text()

    unit_ids = parse_unit_seed_ids(text)
    for slug in unit_slugs:
        unit_ids.setdefault(slug, stable_id(f"unit:{slug}"))

    rules_faction_unit_ids = parse_rules_faction_unit_seed_ids(text)
    rules_faction_unit_ids = {
        slug: value
        for slug, value in rules_faction_unit_ids.items()
        if slug in expected_rules_faction_unit_slugs
    }
    for slug in expected_rules_faction_unit_slugs:
        rules_faction_unit_ids.setdefault(slug, stable_id(f"rules_faction_unit:{slug}"))

    text = replace_type_union(
        text,
        "UnitSeedSlug",
        sorted(unit_ids),
    )
    text = replace_record_object(
        text,
        "unitSeedIds",
        "UnitSeedSlug",
        render_unit_seed_id_lines(unit_ids),
    )
    text = replace_type_union(
        text,
        "RulesFactionUnitSeedSlug",
        sorted(rules_faction_unit_ids),
    )
    text = replace_record_object(
        text,
        "rulesFactionUnitSeedIds",
        "RulesFactionUnitSeedSlug",
        render_rules_faction_unit_seed_id_lines(rules_faction_unit_ids),
    )

    GENERATED_IDS_PATH.write_text(text)


def replace_dataset_records(text: str, dataset_name: str, const_names: list[str]) -> str:
    pattern = re.compile(
        rf"export const {dataset_name}Dataset: SeedDataset<\"[^\"]+\"> = \{{\n"
        r"(?:  table: \"[^\"]+\",\n)?"
        r"  records: \[\n"
        r".*?"
        r"  \] satisfies [^,]+,\n"
        r"\};",
        flags=re.S,
    )
    match = pattern.search(text)
    if not match:
        raise ValueError(f"Could not locate {dataset_name}Dataset records")

    record_type = "UnitConfig" if dataset_name == "units" else "RulesFactionUnitConfig"
    replacement = (
        match.group(0).split("  records: [\n", 1)[0]
        + "  records: [\n"
        + "".join(f"    {const_name},\n" for const_name in const_names)
        + f"  ] satisfies {record_type}[],\n"
        + "};"
    )
    return text[: match.start()] + replacement + text[match.end() :]


def remove_const_block(text: str, const_name: str, suffix: str) -> str:
    pattern = re.compile(
        rf"\nexport const {const_name}: {suffix}Config =\s*\{{.*?\n\s*\}};\n",
        flags=re.S,
    )
    return pattern.sub("\n", text, count=1)


def render_unit_block(const_name: str, slug: str, unit_name: str) -> str:
    is_legends = "Legends" in unit_name
    return (
        f"\nexport const {const_name}: UnitConfig = {{\n"
        f"  id: unitId(\"{slug}\"),\n"
        f"  unit_name: {json.dumps(unit_name)},\n"
        f"  unit_slug: \"{slug}\",\n"
        f"  is_legends: {str(is_legends).lower()},\n"
        "  wahapedia_url: null,\n"
        "};\n"
    )


def render_rules_faction_unit_block(
    const_name: str,
    slug: str,
    faction_slug: str,
    unit_slug: str,
    access_type: str,
    rules_source_slug: str,
) -> str:
    return (
        f"\nexport const {const_name}: RulesFactionUnitConfig = {{\n"
        f"  id: rulesFactionUnitId(\"{slug}\"),\n"
        f"  rules_faction_unit_slug: \"{slug}\",\n"
        f"  rules_faction_id: rulesFactionId(\"{faction_slug}\"),\n"
        f"  unit_id: unitId(\"{unit_slug}\"),\n"
        f"  unit_access_type: \"{access_type}\",\n"
        f"  rules_source_id: rulesSourceId(\"{rules_source_slug}\"),\n"
        "  effective_date: null,\n"
        "  superseded_date: null,\n"
        "};\n"
    )


def rules_source_for_record(
    record: dict[str, str],
    rules_source_by_faction: dict[str, str],
) -> str:
    if "rules_source_slug" in record:
        return record["rules_source_slug"]

    if (
        record["source_file"] == "Imperium - Space Marines.cat"
        or record["rules_faction_slug"] in {"imperial_fists", "iron_hands", "raven_guard", "salamanders", "ultramarines", "white_scars"}
    ):
        return "faction_pack_space_marines_10e_v1_8"

    return rules_source_by_faction[record["rules_faction_slug"]]


def parse_unit_seed_ids(text: str) -> dict[str, str]:
    block = required_match(
        r"const unitSeedIds: Record<UnitSeedSlug, string> = \{\n(.*?)\n\};",
        text,
        re.S,
    )
    return dict(re.findall(r'  ([a-zA-Z0-9_]+): "([^"]+)",', block))


def parse_rules_faction_unit_seed_ids(text: str) -> dict[str, str]:
    block = required_match(
        r"const rulesFactionUnitSeedIds: Record<RulesFactionUnitSeedSlug, string> = \{\n(.*?)\n\};",
        text,
        re.S,
    )
    return dict(re.findall(r'  "([^"]+)": "([^"]+)",', block))


def replace_type_union(text: str, type_name: str, slugs: list[str]) -> str:
    pattern = re.compile(rf"type {type_name} =\n(?:  \| \"[^\"]+\"\n)*  \| \"[^\"]+\";")
    replacement = (
        f"type {type_name} =\n"
        + "\n".join(f'  | "{slug}"' for slug in slugs)
        + ";"
    )
    return pattern.sub(replacement, text, count=1)


def replace_record_object(
    text: str,
    object_name: str,
    type_name: str,
    lines: str,
) -> str:
    pattern = re.compile(
        rf"const {object_name}: Record<{type_name}, string> = \{{\n.*?\n\}};",
        flags=re.S,
    )
    replacement = f"const {object_name}: Record<{type_name}, string> = {{\n{lines}\n}};"
    return pattern.sub(replacement, text, count=1)


def render_unit_seed_id_lines(seed_ids: dict[str, str]) -> str:
    return "\n".join(f'  {slug}: "{seed_ids[slug]}",' for slug in sorted(seed_ids))


def render_rules_faction_unit_seed_id_lines(seed_ids: dict[str, str]) -> str:
    return "\n".join(f'  "{slug}": "{seed_ids[slug]}",' for slug in sorted(seed_ids))


def unit_const_name(slug: str) -> str:
    return f"{pascal_case(slug)}Unit"


def rules_faction_unit_const_name(slug: str) -> str:
    return f"{pascal_case(slug)}RulesFactionUnit"


def pascal_case(slug: str) -> str:
    return "".join(part.capitalize() for part in slug.split("_"))


def stable_id(value: str) -> str:
    digest = hashlib.sha256(value.encode("utf8")).digest()
    number = int.from_bytes(digest, "big")
    chars: list[str] = []
    for _ in range(23):
        number, remainder = divmod(number, len(CROCKFORD_ALPHABET))
        chars.append(CROCKFORD_ALPHABET[remainder])
    return "01K" + "".join(chars)


def required_match(
    pattern: str,
    value: str,
    flags: int = 0,
) -> str:
    match = re.search(pattern, value, flags=flags)
    if not match:
        raise ValueError(f"Could not match pattern: {pattern}")
    return match.group(1)


if __name__ == "__main__":
    main()
