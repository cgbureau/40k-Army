#!/usr/bin/env python3
"""Sync unit_keywords and detachment_unit_keywords from BSData."""

from __future__ import annotations

import argparse
import hashlib
import re
from collections import OrderedDict
from pathlib import Path
from typing import Iterable

from bsdata_expected_counts import (
    BsDataIndex,
    expected_detachment_unit_keywords,
    expected_keyword_records_for_unit_keyword_tables,
    expected_unit_keywords,
)

DEFAULT_BSDATA_ROOT = Path(__file__).resolve().parents[1].parent / "wh40k-10e"
REPO_ROOT = Path(__file__).resolve().parents[1]
DATA_ROOT = REPO_ROOT / "db/seed_config/seed/data"
KEYWORD_IDS_PATH = DATA_ROOT.parent / "ids/reference_data/keywords.ids.ts"
KEYWORDS_PATH = DATA_ROOT / "keywords.data.ts"
UNIT_KEYWORDS_OUTPUT_PATH = DATA_ROOT / "unit_keywords.data.ts"
UNIT_KEYWORDS_SHARD_ROOT = DATA_ROOT / "unit_keywords/10e"
DETACHMENT_UNIT_KEYWORDS_OUTPUT_PATH = DATA_ROOT / "detachment_unit_keywords.data.ts"
DETACHMENT_UNIT_KEYWORDS_SHARD_ROOT = DATA_ROOT / "detachment_unit_keywords/10e"

GENERATED_KEYWORD_START = "// BEGIN BSData unit keyword records"
GENERATED_KEYWORD_END = "// END BSData unit keyword records"
GENERATED_KEYWORD_RECORDS_START = "    // BEGIN BSData unit keyword dataset records"
GENERATED_KEYWORD_RECORDS_END = "    // END BSData unit keyword dataset records"
GENERATED_KEYWORD_TYPE_START = "  // BEGIN BSData unit keyword type records"
GENERATED_KEYWORD_TYPE_END = "  // END BSData unit keyword type records"
GENERATED_KEYWORD_ID_START = "  // BEGIN BSData unit keyword id records"
GENERATED_KEYWORD_ID_END = "  // END BSData unit keyword id records"
CROCKFORD_BASE32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bsdata-root", default=str(DEFAULT_BSDATA_ROOT))
    args = parser.parse_args()

    index = BsDataIndex(Path(args.bsdata_root))
    unit_keyword_memberships = expected_unit_keywords(index, REPO_ROOT)
    detachment_unit_keyword_memberships = expected_detachment_unit_keywords(
        index,
        REPO_ROOT,
    )
    unit_keyword_records = unique_records_by_slug(
        unit_keyword_memberships,
        "unit_keyword_slug",
    )
    detachment_unit_keyword_records = unique_records_by_slug(
        detachment_unit_keyword_memberships,
        "detachment_unit_keyword_slug",
    )
    keyword_records = expected_keyword_records_for_unit_keyword_tables(
        index,
        REPO_ROOT,
    )

    previous_counts = {
        "unit_keywords": count_seed_records(
            UNIT_KEYWORDS_OUTPUT_PATH,
            "UnitKeywordConfig",
        )
        + count_seed_records(UNIT_KEYWORDS_SHARD_ROOT, "UnitKeywordConfig"),
        "detachment_unit_keywords": count_seed_records(
            DETACHMENT_UNIT_KEYWORDS_OUTPUT_PATH,
            "DetachmentUnitKeywordConfig",
        )
        + count_seed_records(
            DETACHMENT_UNIT_KEYWORDS_SHARD_ROOT,
            "DetachmentUnitKeywordConfig",
        ),
    }

    ensure_keyword_ids(keyword_records)
    ensure_keywords(keyword_records)
    write_unit_keyword_files(group_records_by_owner(unit_keyword_records))
    write_detachment_unit_keyword_files(
        group_records_by_owner(detachment_unit_keyword_records),
    )

    print(
        {
            "unit_keywords": len(unit_keyword_records),
            "previous_unit_keywords": previous_counts["unit_keywords"],
            "unit_keyword_faction_memberships": len(unit_keyword_memberships),
            "detachment_unit_keywords": len(detachment_unit_keyword_records),
            "previous_detachment_unit_keywords": previous_counts[
                "detachment_unit_keywords"
            ],
            "detachment_unit_keyword_faction_memberships": len(
                detachment_unit_keyword_memberships,
            ),
            "keyword_reference_rows": len(keyword_records),
        },
    )


def unique_records_by_slug(
    records: Iterable[dict[str, object]],
    slug_key: str,
) -> list[dict[str, object]]:
    records_by_slug: "OrderedDict[str, dict[str, object]]" = OrderedDict()

    for record in records:
        records_by_slug.setdefault(str(record[slug_key]), record)

    return list(records_by_slug.values())


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


def ensure_keywords(records: list[dict[str, str]]) -> None:
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
        f"{identifier_pascal_case(record['keyword_slug'])}UnitKeyword"
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
                f'  keyword_type: {ts_string(record["keyword_type"])},',
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
        f"\n{records_block}\n  ] satisfies KeywordConfig[],",
        1,
    )

    KEYWORDS_PATH.write_text(source)


def ensure_keyword_ids(records: list[dict[str, str]]) -> None:
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
            *(f'  | "{record["keyword_slug"]}"' for record in new_records),
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
        f"\n{id_block}\n}};\n\nexport const keywordId",
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


def write_unit_keyword_files(
    groups: "OrderedDict[str, list[dict[str, object]]]",
) -> None:
    UNIT_KEYWORDS_SHARD_ROOT.mkdir(parents=True, exist_ok=True)

    for existing_path in UNIT_KEYWORDS_SHARD_ROOT.glob("*.data.ts"):
        existing_path.unlink()

    for owner_slug, records in groups.items():
        (UNIT_KEYWORDS_SHARD_ROOT / f"{owner_slug}.data.ts").write_text(
            render_unit_keyword_shard_file(owner_slug, records),
        )

    (UNIT_KEYWORDS_SHARD_ROOT / "_index.unit_keywords.data.ts").write_text(
        render_unit_keyword_edition_index(groups),
    )
    (UNIT_KEYWORDS_SHARD_ROOT.parent / "_index.unit_keywords.data.ts").write_text(
        'export * from "./10e/_index.unit_keywords.data";\n',
    )
    UNIT_KEYWORDS_OUTPUT_PATH.write_text(render_unit_keyword_root_file())


def write_detachment_unit_keyword_files(
    groups: "OrderedDict[str, list[dict[str, object]]]",
) -> None:
    DETACHMENT_UNIT_KEYWORDS_SHARD_ROOT.mkdir(parents=True, exist_ok=True)

    for existing_path in DETACHMENT_UNIT_KEYWORDS_SHARD_ROOT.glob("*.data.ts"):
        existing_path.unlink()

    for owner_slug, records in groups.items():
        (
            DETACHMENT_UNIT_KEYWORDS_SHARD_ROOT / f"{owner_slug}.data.ts"
        ).write_text(render_detachment_unit_keyword_shard_file(owner_slug, records))

    (
        DETACHMENT_UNIT_KEYWORDS_SHARD_ROOT
        / "_index.detachment_unit_keywords.data.ts"
    ).write_text(render_detachment_unit_keyword_edition_index(groups))
    (
        DETACHMENT_UNIT_KEYWORDS_SHARD_ROOT.parent
        / "_index.detachment_unit_keywords.data.ts"
    ).write_text('export * from "./10e/_index.detachment_unit_keywords.data";\n')
    DETACHMENT_UNIT_KEYWORDS_OUTPUT_PATH.write_text(
        render_detachment_unit_keyword_root_file(),
    )


def render_unit_keyword_root_file() -> str:
    return "\n".join(
        [
            'import type { SeedDataset } from "../../types/_index.types";',
            'import { unitKeywords10e } from "./unit_keywords/10e/_index.unit_keywords.data";',
            "",
            "/**",
            " * Typed seed dataset for the `unit_keywords` table.",
            " */",
            'export const unitKeywordsDataset: SeedDataset<"unit_keywords"> = {',
            '  table: "unit_keywords",',
            "  records: [...unitKeywords10e],",
            "};",
            "",
        ],
    )


def render_detachment_unit_keyword_root_file() -> str:
    return "\n".join(
        [
            'import type { SeedDataset } from "../../types/_index.types";',
            'import { detachmentUnitKeywords10e } from "./detachment_unit_keywords/10e/_index.detachment_unit_keywords.data";',
            "",
            "/**",
            " * Typed seed dataset for the `detachment_unit_keywords` table.",
            " */",
            'export const detachmentUnitKeywordsDataset: SeedDataset<"detachment_unit_keywords"> = {',
            '  table: "detachment_unit_keywords",',
            "  records: [...detachmentUnitKeywords10e],",
            "};",
            "",
        ],
    )


def render_unit_keyword_shard_file(
    owner_slug: str,
    records: list[dict[str, object]],
) -> str:
    const_names = [
        f"{identifier_pascal_case(str(record['unit_keyword_slug']))}UnitKeyword"
        for record in records
    ]
    dataset_name = f"{identifier_camel_case(owner_slug)}UnitKeywords10e"

    lines = [
        "import type {",
        "  SeedDataset,",
        "  UnitKeywordConfig,",
        '} from "../../../../types/_index.types";',
        "import {",
        "  gameEditionId,",
        "  keywordId,",
        "  modelId,",
        "  rulesSourceId,",
        "  unitId,",
        "  unitKeywordId,",
        '} from "../../../ids";',
        "",
        "/**",
        f" * 10th edition unit keyword rows owned by `{owner_slug}`.",
        " * Generated from BSData category links attached to unit entries.",
        " */",
        "",
    ]

    for record, const_name in zip(records, const_names, strict=True):
        model_slug = record["model_slug"]
        model_id = (
            f'modelId({ts_string(str(model_slug))})'
            if isinstance(model_slug, str) and model_slug
            else "null"
        )
        lines.extend(
            [
                f"export const {const_name}: UnitKeywordConfig = {{",
                f'  id: unitKeywordId({ts_string(str(record["unit_keyword_slug"]))}),',
                f'  unit_id: unitId({ts_string(str(record["unit_slug"]))}),',
                f'  keyword_id: keywordId({ts_string(str(record["keyword_slug"]))}),',
                f"  model_id: {model_id},",
                '  game_edition_id: gameEditionId("10e"),',
                f'  rules_source_id: rulesSourceId({ts_string(str(record["rules_source_slug"]))}),',
                "  effective_date: null,",
                "  superseded_date: null,",
                "};",
                "",
                "",
            ],
        )

    lines.extend(render_dataset(dataset_name, "unit_keywords", const_names, "UnitKeywordConfig"))

    return "\n".join(lines)


def render_detachment_unit_keyword_shard_file(
    owner_slug: str,
    records: list[dict[str, object]],
) -> str:
    const_names = [
        f"{identifier_pascal_case(str(record['detachment_unit_keyword_slug']))}DetachmentUnitKeyword"
        for record in records
    ]
    dataset_name = f"{identifier_camel_case(owner_slug)}DetachmentUnitKeywords10e"

    lines = [
        "import type {",
        "  DetachmentUnitKeywordConfig,",
        "  SeedDataset,",
        '} from "../../../../types/_index.types";',
        "import {",
        "  detachmentId,",
        "  detachmentUnitKeywordId,",
        "  keywordId,",
        "  unitId,",
        '} from "../../../ids";',
        "",
        "/**",
        f" * 10th edition detachment-granted unit keyword rows owned by `{owner_slug}`.",
        " * Generated from conservative BSData detachment rule text parsing.",
        " */",
        "",
    ]

    for record, const_name in zip(records, const_names, strict=True):
        lines.extend(
            [
                f"export const {const_name}: DetachmentUnitKeywordConfig = {{",
                f'  id: detachmentUnitKeywordId({ts_string(str(record["detachment_unit_keyword_slug"]))}),',
                f'  detachment_id: detachmentId({ts_string(str(record["detachment_slug"]))}),',
                f'  unit_id: unitId({ts_string(str(record["unit_slug"]))}),',
                f'  keyword_id: keywordId({ts_string(str(record["keyword_slug"]))}),',
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
            "detachment_unit_keywords",
            const_names,
            "DetachmentUnitKeywordConfig",
        ),
    )

    return "\n".join(lines)


def render_unit_keyword_edition_index(
    groups: "OrderedDict[str, list[dict[str, object]]]",
) -> str:
    lines: list[str] = []
    dataset_names: list[str] = []

    for owner_slug in groups:
        dataset_name = f"{identifier_camel_case(owner_slug)}UnitKeywords10e"
        dataset_names.append(dataset_name)
        lines.append(f'import {{ {dataset_name} }} from "./{owner_slug}.data";')

    lines.extend(
        [
            "",
            "export const unitKeywords10e = [",
            *(f"  ...{dataset_name}.records," for dataset_name in dataset_names),
            "];",
            "",
        ],
    )

    return "\n".join(lines)


def render_detachment_unit_keyword_edition_index(
    groups: "OrderedDict[str, list[dict[str, object]]]",
) -> str:
    lines: list[str] = []
    dataset_names: list[str] = []

    for owner_slug in groups:
        dataset_name = f"{identifier_camel_case(owner_slug)}DetachmentUnitKeywords10e"
        dataset_names.append(dataset_name)
        lines.append(f'import {{ {dataset_name} }} from "./{owner_slug}.data";')

    lines.extend(
        [
            "",
            "export const detachmentUnitKeywords10e = [",
            *(f"  ...{dataset_name}.records," for dataset_name in dataset_names),
            "];",
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
    return [
        f"export const {dataset_name}: SeedDataset<{ts_string(table_name)}> = {{",
        f'  table: {ts_string(table_name)},',
        "  records: [",
        *(f"    {const_name}," for const_name in const_names),
        f"  ] satisfies {config_name}[],",
        "};",
        "",
    ]


def identifier_pascal_case(slug: str) -> str:
    return "".join(part.capitalize() for part in re.split(r"[^A-Za-z0-9]+", slug) if part)


def identifier_camel_case(slug: str) -> str:
    pascal = identifier_pascal_case(slug)
    return pascal[:1].lower() + pascal[1:]


def ts_string(value: str) -> str:
    import json

    return json.dumps(value)


if __name__ == "__main__":
    main()
