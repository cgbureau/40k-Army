#!/usr/bin/env python3
"""Sync detachments and rules_faction_detachments against BSData."""

from __future__ import annotations

import hashlib
import json
import os
import re
from pathlib import Path

from bsdata_expected_counts import (
    BsDataIndex,
    expected_rules_faction_detachments,
)

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_BSDATA_ROOT = Path("/Users/mikeearley/code/wh40k-10e")
DETACHMENTS_PATH = REPO_ROOT / "db/seed_config/seed/data/detachments.data.ts"
RULES_FACTION_DETACHMENTS_PATH = (
    REPO_ROOT / "db/seed_config/seed/data/rules_faction_detachments.data.ts"
)
GENERATED_IDS_PATH = REPO_ROOT / "db/seed_config/seed/ids/generated_game_data.ids.ts"

CROCKFORD_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"


def main() -> None:
    bsdata_root = Path(
        os.environ.get("BSDATA_40K_ROOT", str(DEFAULT_BSDATA_ROOT)),
    )
    index = BsDataIndex(bsdata_root)
    expected_records = expected_rules_faction_detachments(index)

    existing_detachment_slugs = current_detachment_slugs()
    existing_pair_slugs = current_rules_faction_detachment_slugs()
    existing_source_by_detachment = current_rules_source_by_detachment()

    expected_detachments = expected_detachments_by_slug(
        expected_records,
        existing_source_by_detachment,
    )
    expected_pairs = {
        f'{record["rules_faction_slug"]}__{record["detachment_slug"]}': record
        for record in expected_records
    }

    write_detachments_file(expected_detachments)
    write_rules_faction_detachments_file(expected_pairs)
    sync_generated_ids(set(expected_detachments), set(expected_pairs))

    print(
        json.dumps(
            {
                "added_detachments": len(set(expected_detachments) - existing_detachment_slugs),
                "removed_detachments": len(existing_detachment_slugs - set(expected_detachments)),
                "added_rules_faction_detachments": len(
                    set(expected_pairs) - existing_pair_slugs,
                ),
                "removed_rules_faction_detachments": len(
                    existing_pair_slugs - set(expected_pairs),
                ),
            },
            sort_keys=True,
        ),
    )


def current_detachment_slugs() -> set[str]:
    return set(re.findall(r'detachment_slug: "([^"]+)"', DETACHMENTS_PATH.read_text()))


def current_rules_faction_detachment_slugs() -> set[str]:
    return set(
        re.findall(
            r'rulesFactionDetachmentId\("([^"]+)"\)',
            RULES_FACTION_DETACHMENTS_PATH.read_text(),
        ),
    )


def current_rules_source_by_detachment() -> dict[str, str]:
    source_by_detachment: dict[str, str] = {}
    text = DETACHMENTS_PATH.read_text()

    for block in re.findall(
        r"export const .*?Detachment: DetachmentConfig = \{(.*?)\n\};",
        text,
        flags=re.S,
    ):
        detachment_slug = required_match(r'detachment_slug: "([^"]+)"', block)
        rules_source_slug = required_match(
            r'rules_source_id: rulesSourceId\("([^"]+)"\)',
            block,
        )
        source_by_detachment[detachment_slug] = rules_source_slug

    return source_by_detachment


def expected_detachments_by_slug(
    expected_records: list[dict[str, str]],
    existing_source_by_detachment: dict[str, str],
) -> dict[str, dict[str, str]]:
    detachments: dict[str, dict[str, str]] = {}

    for record in expected_records:
        slug = record["detachment_slug"]
        detachments.setdefault(
            slug,
            {
                "detachment_slug": slug,
                "detachment_name": record["detachment_name"],
                "rules_source_slug": existing_source_by_detachment.get(
                    slug,
                    record["rules_source_slug"],
                ),
            },
        )

    return dict(sorted(detachments.items()))


def write_detachments_file(detachments: dict[str, dict[str, str]]) -> None:
    const_names = {
        slug: detachment_const_name(slug)
        for slug in detachments
    }
    blocks = [
        render_detachment_block(const_names[slug], record)
        for slug, record in detachments.items()
    ]

    DETACHMENTS_PATH.write_text(
        "\n".join(
            [
                'import type { DetachmentConfig, SeedDataset } from "../../types/_index.types";',
                'import { detachmentId, rulesSourceId } from "../ids";',
                "",
                "/**",
                " * Typed seed dataset for the `detachments` table.",
                " * Generated from BSData detachment choices.",
                " */",
                *blocks,
                "export const detachmentsDataset: SeedDataset<\"detachments\"> = {",
                '  table: "detachments",',
                "  records: [",
                *[f"    {const_names[slug]}," for slug in detachments],
                "  ] satisfies DetachmentConfig[],",
                "};",
                "",
            ],
        ),
    )


def write_rules_faction_detachments_file(
    expected_pairs: dict[str, dict[str, str]],
) -> None:
    const_names = {
        slug: rules_faction_detachment_const_name(slug)
        for slug in expected_pairs
    }
    blocks = [
        render_rules_faction_detachment_block(const_names[slug], slug, record)
        for slug, record in expected_pairs.items()
    ]

    RULES_FACTION_DETACHMENTS_PATH.write_text(
        "\n".join(
            [
                "import type {",
                "  RulesFactionDetachmentConfig,",
                "  SeedDataset,",
                '} from "../../types/_index.types";',
                'import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../ids";',
                "",
                "/**",
                " * Typed seed dataset for the `rules_faction_detachments` table.",
                " * Generated from BSData detachment choices.",
                " */",
                *blocks,
                "export const rulesFactionDetachmentsDataset: SeedDataset<\"rules_faction_detachments\"> = {",
                '  table: "rules_faction_detachments",',
                "  records: [",
                *[f"    {const_names[slug]}," for slug in sorted(expected_pairs)],
                "  ] satisfies RulesFactionDetachmentConfig[],",
                "};",
                "",
            ],
        ),
    )


def render_detachment_block(const_name: str, record: dict[str, str]) -> str:
    return (
        f"\nexport const {const_name}: DetachmentConfig = {{\n"
        f'  id: detachmentId("{record["detachment_slug"]}"),\n'
        f'  detachment_name: {json.dumps(record["detachment_name"])},\n'
        f'  detachment_slug: "{record["detachment_slug"]}",\n'
        f'  rules_source_id: rulesSourceId("{record["rules_source_slug"]}"),\n'
        "};\n"
    )


def render_rules_faction_detachment_block(
    const_name: str,
    slug: str,
    record: dict[str, str],
) -> str:
    return (
        f"\nexport const {const_name}: RulesFactionDetachmentConfig = {{\n"
        f'  id: rulesFactionDetachmentId("{slug}"),\n'
        f'  rules_faction_id: rulesFactionId("{record["rules_faction_slug"]}"),\n'
        f'  detachment_id: detachmentId("{record["detachment_slug"]}"),\n'
        f'  detachment_access_type: "{record["detachment_access_type"]}",\n'
        "  effective_date: null,\n"
        "  superseded_date: null,\n"
        "};\n"
    )


def sync_generated_ids(
    expected_detachment_slugs: set[str],
    expected_rules_faction_detachment_slugs: set[str],
) -> None:
    text = GENERATED_IDS_PATH.read_text()

    detachment_ids = parse_seed_ids(text, "detachmentSeedIds", "DetachmentSeedSlug")
    detachment_ids = {
        slug: value
        for slug, value in detachment_ids.items()
        if slug in expected_detachment_slugs
    }
    for slug in expected_detachment_slugs:
        detachment_ids.setdefault(slug, stable_id(f"detachment:{slug}"))

    rules_faction_detachment_ids = parse_seed_ids(
        text,
        "rulesFactionDetachmentSeedIds",
        "RulesFactionDetachmentSeedSlug",
    )
    rules_faction_detachment_ids = {
        slug: value
        for slug, value in rules_faction_detachment_ids.items()
        if slug in expected_rules_faction_detachment_slugs
    }
    for slug in expected_rules_faction_detachment_slugs:
        rules_faction_detachment_ids.setdefault(
            slug,
            stable_id(f"rules_faction_detachment:{slug}"),
        )

    text = replace_type_union(text, "DetachmentSeedSlug", sorted(detachment_ids))
    text = replace_record_object(
        text,
        "detachmentSeedIds",
        "DetachmentSeedSlug",
        render_seed_id_lines(detachment_ids),
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
        render_seed_id_lines(rules_faction_detachment_ids),
    )

    GENERATED_IDS_PATH.write_text(text)


def parse_seed_ids(text: str, object_name: str, type_name: str) -> dict[str, str]:
    block = required_match(
        rf"const {object_name}: Record<\s*{type_name},\s*string\s*> = \{{\n(.*?)\n\}};",
        text,
        re.S,
    )
    seed_ids: dict[str, str] = {}

    for match in re.finditer(
        r'  (?:"([^"]+)"|([a-zA-Z0-9_]+)):\s*(?:"([^"]+)"|\n\s*"([^"]+)"),',
        block,
    ):
        slug = match.group(1) or match.group(2)
        seed_ids[slug] = match.group(3) or match.group(4)

    return seed_ids


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
        rf"const {object_name}: Record<\s*{type_name},\s*string\s*> = \{{\n.*?\n\}};",
        flags=re.S,
    )
    replacement = f"const {object_name}: Record<{type_name}, string> = {{\n{lines}\n}};"
    return pattern.sub(replacement, text, count=1)


def render_seed_id_lines(seed_ids: dict[str, str]) -> str:
    return "\n".join(
        f'  "{slug}": "{seed_ids[slug]}",'
        for slug in sorted(seed_ids)
    )


def detachment_const_name(slug: str) -> str:
    return f"{identifier_pascal_case(slug)}Detachment"


def rules_faction_detachment_const_name(slug: str) -> str:
    return f"{identifier_pascal_case(slug)}RulesFactionDetachment"


def identifier_pascal_case(slug: str) -> str:
    value = "".join(part.capitalize() for part in slug.split("_"))

    if not value or not re.match(r"[A-Za-z_$]", value[0]):
        value = f"Seed{value}"

    return value


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
