from __future__ import annotations

import hashlib
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from .common import read_json

REPO_ROOT = Path(__file__).resolve().parents[2]
ABILITIES_DATA_PATH = REPO_ROOT / "db" / "seed_config" / "seed" / "data" / "abilities.data.ts"
KEYWORDS_DATA_PATH = REPO_ROOT / "db" / "seed_config" / "seed" / "data" / "keywords.data.ts"
ABILITY_IDS_PATH = (
    REPO_ROOT
    / "db"
    / "seed_config"
    / "seed"
    / "ids"
    / "reference_data"
    / "abilities.ids.ts"
)
KEYWORD_IDS_PATH = (
    REPO_ROOT
    / "db"
    / "seed_config"
    / "seed"
    / "ids"
    / "reference_data"
    / "keywords.ids.ts"
)

ABILITY_TYPE_ORDER = {
    "core": 0,
    "faction": 1,
    "datasheet": 2,
    "wargear": 3,
    "other": 4,
}

CROCKFORD_BASE32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
TS_STRING_PATTERN = r'"((?:\\.|[^"\\])*)"'


@dataclass(frozen=True)
class AbilitySeedRecord:
    seed_id_key: str
    ability_slug: str
    ability_name: str
    ability_type: str


@dataclass(frozen=True)
class KeywordSeedRecord:
    seed_id_key: str
    keyword_slug: str
    keyword_name: str
    keyword_type: str


def apply_abilities_seed(*, normalized: str) -> list[Path]:
    payload = _latest_payload(read_json(Path(normalized).expanduser()))
    records = _ability_records_from_payload(payload)
    existing_ids = _parse_existing_seed_ids(
        ABILITY_IDS_PATH.read_text(encoding="utf-8"), "abilitySeedIds"
    )
    merged = _merge_existing_ability_data(records)

    _write_ability_ids_file(merged, existing_ids)
    _write_abilities_data_file(merged)
    return [ABILITY_IDS_PATH, ABILITIES_DATA_PATH]


def apply_keywords_seed(*, normalized: str) -> list[Path]:
    payload = _latest_payload(read_json(Path(normalized).expanduser()))
    records = _keyword_records_from_payload(payload)
    existing_ids = _parse_existing_seed_ids(
        KEYWORD_IDS_PATH.read_text(encoding="utf-8"), "keywordSeedIds"
    )
    merged = _merge_existing_keyword_data(records)

    _write_keyword_ids_file(merged, existing_ids)
    _write_keywords_data_file(merged)
    return [KEYWORD_IDS_PATH, KEYWORDS_DATA_PATH]


def _latest_payload(data: Any) -> dict[str, Any]:
    if isinstance(data, list):
        if not data:
            raise ValueError("Normalized JSON array is empty")
        data = data[-1]
    if not isinstance(data, dict):
        raise ValueError("Normalized JSON must be an object or non-empty array of objects")
    return data


def _ability_records_from_payload(payload: dict[str, Any]) -> list[AbilitySeedRecord]:
    try:
        candidates = payload["records"]["abilities"]
    except KeyError as exc:
        raise ValueError("Normalized JSON does not contain records.abilities") from exc

    records: list[AbilitySeedRecord] = []
    for candidate in candidates:
        seed_id_key = candidate.get("seed_id_key") or candidate.get("id_key")
        ability_slug = candidate["ability_slug"]
        if not _is_seedable_slug(ability_slug):
            continue
        records.append(
            AbilitySeedRecord(
                seed_id_key=seed_id_key or ability_slug,
                ability_slug=ability_slug,
                ability_name=candidate["ability_name"],
                ability_type=candidate["ability_type"],
            )
        )
    return records


def _keyword_records_from_payload(payload: dict[str, Any]) -> list[KeywordSeedRecord]:
    try:
        candidates = payload["records"]["keywords"]
    except KeyError as exc:
        raise ValueError("Normalized JSON does not contain records.keywords") from exc

    records: list[KeywordSeedRecord] = []
    for candidate in candidates:
        seed_id_key = candidate.get("seed_id_key")
        keyword_slug = candidate["keyword_slug"]
        records.append(
            KeywordSeedRecord(
                seed_id_key=seed_id_key or keyword_slug,
                keyword_slug=keyword_slug,
                keyword_name=candidate["keyword_name"],
                keyword_type=candidate["keyword_type"],
            )
        )
    return records


def _merge_existing_ability_data(
    new_records: list[AbilitySeedRecord],
) -> list[AbilitySeedRecord]:
    ability_text = ABILITIES_DATA_PATH.read_text(encoding="utf-8")
    merged: dict[str, AbilitySeedRecord] = {}

    for match in re.finditer(
        rf"ability_slug:\s*{TS_STRING_PATTERN}.*?ability_name:\s*{TS_STRING_PATTERN}.*?ability_type:\s*{TS_STRING_PATTERN}",
        ability_text,
        flags=re.DOTALL,
    ):
        slug, name, ability_type = (_decode_ts_string(value) for value in match.groups())
        if not _is_seedable_slug(slug):
            continue
        merged[slug] = AbilitySeedRecord(
            seed_id_key=slug,
            ability_slug=slug,
            ability_name=name,
            ability_type=ability_type,
        )

    for record in new_records:
        merged.setdefault(record.ability_slug, record)

    return sorted(
        merged.values(),
        key=lambda item: (
            ABILITY_TYPE_ORDER.get(item.ability_type, 99),
            item.ability_slug,
        ),
    )


def _merge_existing_keyword_data(
    new_records: list[KeywordSeedRecord],
) -> list[KeywordSeedRecord]:
    keyword_text = KEYWORDS_DATA_PATH.read_text(encoding="utf-8")
    merged: dict[str, KeywordSeedRecord] = {}

    for match in re.finditer(
        rf"keyword_slug:\s*{TS_STRING_PATTERN}.*?keyword_name:\s*{TS_STRING_PATTERN}.*?keyword_type:\s*{TS_STRING_PATTERN}",
        keyword_text,
        flags=re.DOTALL,
    ):
        slug, name, keyword_type = (_decode_ts_string(value) for value in match.groups())
        merged[slug] = KeywordSeedRecord(
            seed_id_key=slug,
            keyword_slug=slug,
            keyword_name=name,
            keyword_type=keyword_type,
        )

    for record in new_records:
        merged.setdefault(record.keyword_slug, record)

    return sorted(merged.values(), key=lambda item: (item.keyword_type, item.keyword_slug))


def _parse_existing_seed_ids(ids_text: str, const_name: str) -> dict[str, str]:
    block_match = re.search(
        rf"const {const_name}: Record<[^>]+, string> = \{{(?P<body>.*?)\}};",
        ids_text,
        flags=re.DOTALL,
    )
    if not block_match:
        return {}

    ids: dict[str, str] = {}
    for key, value in re.findall(
        r"([a-zA-Z0-9_]+):\s*\"([0-9A-HJKMNP-TV-Z]{26})\"",
        block_match.group("body"),
    ):
        ids[key] = value
    return ids


def _write_ability_ids_file(records: list[AbilitySeedRecord], existing_ids: dict[str, str]) -> None:
    ids_text = ABILITY_IDS_PATH.read_text(encoding="utf-8")
    ability_block = _render_ability_ids_block(records, existing_ids)
    pattern = re.compile(
        r"/\*\*\n \* Fixed ULIDs for canonical ability seed types\..*?export const abilityId = \(type: AbilitySeedType\): string => \{\n  return abilitySeedIds\[type\];\n\};",
        flags=re.DOTALL,
    )
    if not pattern.search(ids_text):
        raise ValueError("Could not find ability seed ID block in abilities.ids.ts")
    ABILITY_IDS_PATH.write_text(pattern.sub(ability_block, ids_text), encoding="utf-8")


def _write_keyword_ids_file(records: list[KeywordSeedRecord], existing_ids: dict[str, str]) -> None:
    KEYWORD_IDS_PATH.write_text(_render_keyword_ids_block(records, existing_ids), encoding="utf-8")


def _render_ability_ids_block(
    records: list[AbilitySeedRecord], existing_ids: dict[str, str]
) -> str:
    union_lines = "\n".join(f'  | "{record.seed_id_key}"' for record in records)
    id_lines = "\n".join(
        f'  {record.seed_id_key}: "{existing_ids.get(record.seed_id_key, _deterministic_ulid("ability", record.seed_id_key))}",'
        for record in records
    )
    return "\n".join(
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
        ]
    )


def _render_keyword_ids_block(
    records: list[KeywordSeedRecord], existing_ids: dict[str, str]
) -> str:
    if records:
        union_lines = "\n".join(f'  | "{record.seed_id_key}"' for record in records)
        type_block = f"type KeywordSeedType =\n{union_lines};"
    else:
        type_block = "type KeywordSeedType = never;"
    id_lines = "\n".join(
        f'  {record.seed_id_key}: "{existing_ids.get(record.seed_id_key, _deterministic_ulid("keyword", record.seed_id_key))}",'
        for record in records
    )
    return "\n".join(
        [
            "/**",
            " * Fixed ULIDs for canonical keyword seed types.",
            " *",
            " * The values are generated once and then checked in so repeated seed runs use",
            " * the same primary keys. Do not replace these with runtime `ulid()` calls.",
            " */",
            "",
            type_block,
            "",
            "const keywordSeedIds: Record<KeywordSeedType, string> = {",
            id_lines,
            "};",
            "",
            "export const keywordId = (type: KeywordSeedType): string => {",
            "  return keywordSeedIds[type];",
            "};",
            "",
        ]
    )


def _write_abilities_data_file(records: list[AbilitySeedRecord]) -> None:
    const_names = [_ability_const_name(record.ability_slug) for record in records]
    blocks = [
        'import type { AbilityConfig, SeedDataset } from "../../types/_index.types";',
        'import { abilityId } from "../ids";',
        "",
        "/**",
        " * Typed seed dataset for the `abilities` table.",
        " * Generated from normalized Wahapedia ability candidates.",
        " */",
        "",
    ]
    for record, const_name in zip(records, const_names, strict=True):
        blocks.append(_render_ability_const(record, const_name))
        blocks.append("")

    record_lines = "\n".join(f"    {const_name}," for const_name in const_names)
    blocks.extend(
        [
            'export const abilitiesDataset: SeedDataset<"abilities"> = {',
            '  table: "abilities",',
            "  records: [",
            record_lines,
            "  ] satisfies AbilityConfig[],",
            "};",
            "",
        ]
    )
    ABILITIES_DATA_PATH.write_text("\n".join(blocks), encoding="utf-8")


def _write_keywords_data_file(records: list[KeywordSeedRecord]) -> None:
    const_names = [_keyword_const_name(record.keyword_slug) for record in records]
    blocks = [
        'import type { KeywordConfig, SeedDataset } from "../../types/_index.types";',
        'import { keywordId } from "../ids";',
        "",
        "/**",
        " * Typed seed dataset for the `keywords` table.",
        " * Generated from normalized Wahapedia keyword candidates.",
        " */",
        "",
    ]
    for record, const_name in zip(records, const_names, strict=True):
        blocks.append(_render_keyword_const(record, const_name))
        blocks.append("")

    record_lines = "\n".join(f"    {const_name}," for const_name in const_names)
    blocks.extend(
        [
            'export const keywordsDataset: SeedDataset<"keywords"> = {',
            '  table: "keywords",',
            "  records: [",
            record_lines,
            "  ] satisfies KeywordConfig[],",
            "};",
            "",
        ]
    )
    KEYWORDS_DATA_PATH.write_text("\n".join(blocks), encoding="utf-8")


def _render_ability_const(record: AbilitySeedRecord, const_name: str) -> str:
    return "\n".join(
        [
            f"export const {const_name}: AbilityConfig = {{",
            f'  id: abilityId("{record.seed_id_key}"),',
            f'  ability_slug: "{record.ability_slug}",',
            f"  ability_name: {_ts_string(record.ability_name)},",
            f'  ability_type: "{record.ability_type}",',
            "};",
        ]
    )


def _render_keyword_const(record: KeywordSeedRecord, const_name: str) -> str:
    return "\n".join(
        [
            f"export const {const_name}: KeywordConfig = {{",
            f'  id: keywordId("{record.seed_id_key}"),',
            f'  keyword_slug: "{record.keyword_slug}",',
            f"  keyword_name: {_ts_string(record.keyword_name)},",
            f'  keyword_type: "{record.keyword_type}",',
            "};",
        ]
    )


def _ability_const_name(slug: str) -> str:
    name = "".join(part.capitalize() for part in slug.split("_")) + "Ability"
    return f"Ability{name}" if name[:1].isdigit() else name


def _keyword_const_name(slug: str) -> str:
    name = "".join(part.capitalize() for part in slug.split("_")) + "Keyword"
    return f"Keyword{name}" if name[:1].isdigit() else name


def _ts_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=True)


def _decode_ts_string(value: str) -> str:
    return json.loads(f'"{value}"')


def _is_seedable_slug(slug: str) -> bool:
    return bool(slug and re.search(r"[a-z]", slug))


def _deterministic_ulid(namespace: str, seed: str) -> str:
    digest = hashlib.sha256(f"{namespace}:{seed}".encode("utf-8")).digest()
    value = int.from_bytes(digest, "big")
    chars: list[str] = []
    for _ in range(23):
        chars.append(CROCKFORD_BASE32[value & 31])
        value >>= 5
    return "01K" + "".join(reversed(chars))
