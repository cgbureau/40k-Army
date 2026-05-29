from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from .common import read_json
from .data.loaders import source_type_order_map
from .writers.seed_workspace import (
    ABILITIES_DATA_PATH,
    ABILITY_IDS_PATH,
    ABILITY_TYPE_ORDER,
    CROCKFORD_BASE32,
    DETACHMENTS_DATA_PATH,
    GENERATED_GAME_DATA_IDS_PATH,
    KIT_UNIT_PRICE_ALLOCATIONS_DATA_PATH,
    KIT_UNITS_DATA_PATH,
    KEYWORD_IDS_PATH,
    KEYWORDS_DATA_PATH,
    REPO_ROOT,
    RULES_FACTION_DETACHMENTS_DATA_PATH,
    RULES_FACTION_SOURCE_IDS_PATH,
    RULES_FACTION_SOURCES_DATA_DIR,
    RULES_FACTION_SOURCES_DATA_PATH,
    RULES_FACTION_SOURCES_INDEX_DATA_PATH,
    RULES_FACTION_UNITS_DATA_PATH,
    RULES_SOURCES_DATA_DIR,
    RULES_SOURCES_DATA_PATH,
    RULES_SOURCES_IDS_PATH,
    RULES_SOURCES_INDEX_DATA_PATH,
    RULES_SOURCES_INDEX_IDS_PATH,
    SEED_IDS_INDEX_PATH,
    TS_STRING_PATTERN,
    UNITS_DATA_PATH,
    _append_text_block,
    _deterministic_ulid,
    _extract_seed_id_block,
    _extract_seed_id_keys,
    _parse_existing_seed_ids,
    _parse_existing_seed_ids_from_paths,
    _render_seed_id_block,
    _replace_or_append_seed_id_block,
)


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


@dataclass(frozen=True)
class RulesSourceSeedRecord:
    seed_id_key: str
    rules_source_slug: str
    rules_source_name: str
    rules_source_type: str
    rules_source_version: str | None
    rules_source_version_slug: str | None
    release_date: str | None
    superseded_date: str | None
    game_edition_slug: str


@dataclass(frozen=True)
class RulesFactionSourceSeedRecord:
    seed_id_key: str
    rules_faction_slug: str
    rules_source_slug: str
    source_relationship: str
    source_scope: str


@dataclass(frozen=True)
class DetachmentSeedRecord:
    seed_id_key: str
    detachment_slug: str
    detachment_name: str
    rules_source_slug: str


@dataclass(frozen=True)
class RulesFactionDetachmentSeedRecord:
    seed_id_key: str
    rules_faction_slug: str
    detachment_slug: str
    detachment_access_type: str | None
    effective_date: str | None
    superseded_date: str | None


@dataclass(frozen=True)
class UnitSeedRecord:
    seed_id_key: str
    unit_slug: str
    unit_name: str
    is_legends: bool
    wahapedia_url: str


@dataclass(frozen=True)
class RulesFactionUnitSeedRecord:
    seed_id_key: str
    rules_faction_unit_slug: str
    rules_faction_slug: str
    unit_slug: str
    unit_access_type: str | None
    rules_source_slug: str
    effective_date: str | None
    superseded_date: str | None


@dataclass(frozen=True)
class KitUnitSeedRecord:
    seed_id_key: str
    kit_unit_slug: str
    kit_slug: str
    unit_slug: str
    unit_count: int
    model_count: int
    component_type: str
    effective_date: str | None
    superseded_date: str | None


@dataclass(frozen=True)
class KitUnitPriceAllocationSeedRecord:
    seed_id_key: str
    kit_unit_price_allocation_slug: str
    kit_slug: str
    unit_slug: str
    allocation_ratio: float
    reference_price: float | None
    reference_currency: str | None
    allocation_basis: str
    effective_date: str | None
    superseded_date: str | None


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


def apply_rules_sources_seed(*, normalized: list[str]) -> list[Path]:
    payloads = [
        _latest_payload(read_json(path))
        for path in _normalized_paths(normalized, "rules-sources.normalized.json")
    ]
    rules_source_records = _merge_existing_rules_source_data(
        [
            record
            for payload in payloads
            for record in _rules_source_records_from_payload(payload)
        ]
    )
    rules_faction_source_records = _merge_existing_rules_faction_source_data(
        [
            record
            for payload in payloads
            for record in _rules_faction_source_records_from_payload(payload)
        ]
    )

    existing_rules_source_ids = _parse_existing_seed_ids_from_paths(
        REPO_ROOT / "db" / "seed_config" / "seed" / "ids" / "rules_sources",
    )
    existing_rules_faction_source_ids = _parse_existing_seed_ids_from_paths(
        REPO_ROOT / "db" / "seed_config" / "seed" / "ids" / "factions",
    )

    _write_rules_source_ids_file(rules_source_records, existing_rules_source_ids)
    _write_rules_sources_index_ids_file()
    _write_rules_sources_data_file(rules_source_records)
    _write_rules_sources_index_data_file()
    _write_rules_faction_source_ids_block(
        rules_faction_source_records, existing_rules_faction_source_ids
    )
    _write_rules_faction_sources_data_file(rules_faction_source_records)
    _write_rules_faction_sources_index_data_file()
    return [
        RULES_SOURCES_IDS_PATH,
        RULES_SOURCES_INDEX_IDS_PATH,
        RULES_SOURCES_DATA_PATH,
        RULES_SOURCES_INDEX_DATA_PATH,
        RULES_FACTION_SOURCE_IDS_PATH,
        RULES_FACTION_SOURCES_DATA_PATH,
        RULES_FACTION_SOURCES_INDEX_DATA_PATH,
    ]


def apply_faction_data_seed(*, normalized: list[str]) -> list[Path]:
    payloads = [
        _latest_payload(read_json(path))
        for path in _normalized_paths(normalized, "faction-data.normalized.json")
    ]
    detachments = _unique_by_slug(
        [
            DetachmentSeedRecord(
                seed_id_key=item.get("seed_id_key") or item["detachment_slug"],
                detachment_slug=item["detachment_slug"],
                detachment_name=item["detachment_name"],
                rules_source_slug=item["rules_source_slug"],
            )
            for payload in payloads
            for item in payload["records"]["detachments"]
        ],
        "detachment_slug",
    )
    rules_faction_detachments = _unique_by_slug(
        [
            RulesFactionDetachmentSeedRecord(
                seed_id_key=item.get("seed_id_key")
                or f'{item["rules_faction_slug"]}__{item["detachment_slug"]}',
                rules_faction_slug=item["rules_faction_slug"],
                detachment_slug=item["detachment_slug"],
                detachment_access_type=item.get("detachment_access_type"),
                effective_date=item.get("effective_date"),
                superseded_date=item.get("superseded_date"),
            )
            for payload in payloads
            for item in payload["records"]["rules_faction_detachments"]
        ],
        "seed_id_key",
    )
    units = _unique_by_slug(
        [
            UnitSeedRecord(
                seed_id_key=item.get("seed_id_key") or item["unit_slug"],
                unit_slug=item["unit_slug"],
                unit_name=item["unit_name"],
                is_legends=item.get("is_legends", False),
                wahapedia_url=item["wahapedia_url"],
            )
            for payload in payloads
            for item in payload["records"]["units"]
        ],
        "unit_slug",
    )
    rules_faction_units = _unique_by_slug(
        [
            RulesFactionUnitSeedRecord(
                seed_id_key=item.get("seed_id_key") or item["rules_faction_unit_slug"],
                rules_faction_unit_slug=item["rules_faction_unit_slug"],
                rules_faction_slug=item["rules_faction_slug"],
                unit_slug=item["unit_slug"],
                unit_access_type=item.get("unit_access_type"),
                rules_source_slug=item["rules_source_slug"],
                effective_date=item.get("effective_date"),
                superseded_date=item.get("superseded_date"),
            )
            for payload in payloads
            for item in payload["records"]["rules_faction_units"]
        ],
        "seed_id_key",
    )
    existing_ids = _parse_existing_seed_ids_from_paths(
        REPO_ROOT / "db" / "seed_config" / "seed" / "ids",
    )
    _write_generated_game_data_ids_file(
        detachments,
        rules_faction_detachments,
        units,
        rules_faction_units,
        existing_ids,
    )
    _ensure_generated_game_data_ids_export()
    _write_detachments_data_file(detachments)
    _write_rules_faction_detachments_data_file(rules_faction_detachments)
    _write_units_data_file(units)
    _write_rules_faction_units_data_file(rules_faction_units)
    return [
        GENERATED_GAME_DATA_IDS_PATH,
        SEED_IDS_INDEX_PATH,
        DETACHMENTS_DATA_PATH,
        RULES_FACTION_DETACHMENTS_DATA_PATH,
        UNITS_DATA_PATH,
        RULES_FACTION_UNITS_DATA_PATH,
    ]


def apply_kit_units_seed(*, normalized: list[str]) -> list[Path]:
    payloads = [
        _latest_payload(read_json(path))
        for path in _normalized_paths(normalized, "kit-units.normalized.json")
    ]
    records = _unique_by_slug(
        [
            KitUnitSeedRecord(
                seed_id_key=item.get("seed_id_key") or item["kit_unit_slug"],
                kit_unit_slug=item["kit_unit_slug"],
                kit_slug=item["kit_slug"],
                unit_slug=item["unit_slug"],
                unit_count=item["unit_count"],
                model_count=item["model_count"],
                component_type=item["component_type"],
                effective_date=item.get("effective_date"),
                superseded_date=item.get("superseded_date"),
            )
            for payload in payloads
            for item in payload["records"]["kit_units"]
        ],
        "seed_id_key",
    )
    existing_ids = _parse_existing_seed_ids_from_paths(
        REPO_ROOT / "db" / "seed_config" / "seed" / "ids",
    )
    _write_generated_kit_data_ids_blocks(
        kit_slugs=[record.kit_slug for record in records],
        kit_units=records,
        price_allocations=None,
        existing_ids=existing_ids,
    )
    _ensure_generated_game_data_ids_export()
    _write_kit_units_data_file(records)
    return [GENERATED_GAME_DATA_IDS_PATH, SEED_IDS_INDEX_PATH, KIT_UNITS_DATA_PATH]


def apply_kit_unit_price_allocations_seed(*, normalized: list[str]) -> list[Path]:
    payloads = [
        _latest_payload(read_json(path))
        for path in _normalized_paths(
            normalized, "kit-unit-price-allocations.normalized.json"
        )
    ]
    records = _unique_by_slug(
        [
            KitUnitPriceAllocationSeedRecord(
                seed_id_key=item.get("seed_id_key")
                or item["kit_unit_price_allocation_slug"],
                kit_unit_price_allocation_slug=item[
                    "kit_unit_price_allocation_slug"
                ],
                kit_slug=item["kit_slug"],
                unit_slug=item["unit_slug"],
                allocation_ratio=float(item["allocation_ratio"]),
                reference_price=(
                    None if item.get("reference_price") is None else float(item["reference_price"])
                ),
                reference_currency=item.get("reference_currency"),
                allocation_basis=item["allocation_basis"],
                effective_date=item.get("effective_date"),
                superseded_date=item.get("superseded_date"),
            )
            for payload in payloads
            for item in payload["records"]["kit_unit_price_allocations"]
        ],
        "seed_id_key",
    )
    existing_ids = _parse_existing_seed_ids_from_paths(
        REPO_ROOT / "db" / "seed_config" / "seed" / "ids",
    )
    _write_generated_kit_data_ids_blocks(
        kit_slugs=[record.kit_slug for record in records],
        kit_units=None,
        price_allocations=records,
        existing_ids=existing_ids,
    )
    _ensure_generated_game_data_ids_export()
    _write_kit_unit_price_allocations_data_file(records)
    return [
        GENERATED_GAME_DATA_IDS_PATH,
        SEED_IDS_INDEX_PATH,
        KIT_UNIT_PRICE_ALLOCATIONS_DATA_PATH,
    ]


def _latest_payload(data: Any) -> dict[str, Any]:
    if isinstance(data, list):
        if not data:
            raise ValueError("Normalized JSON array is empty")
        data = data[-1]
    if not isinstance(data, dict):
        raise ValueError("Normalized JSON must be an object or non-empty array of objects")
    return data


def _normalized_paths(values: list[str], filename: str) -> list[Path]:
    paths: list[Path] = []
    for value in values:
        path = Path(value).expanduser()
        if path.is_dir():
            paths.extend(sorted(path.rglob(filename)))
        else:
            paths.append(path)
    if not paths:
        raise ValueError(f"No normalized files found for {filename}")
    return paths


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


def _rules_source_records_from_payload(payload: dict[str, Any]) -> list[RulesSourceSeedRecord]:
    try:
        candidates = payload["records"]["rules_sources"]
    except KeyError as exc:
        raise ValueError("Normalized JSON does not contain records.rules_sources") from exc

    records: list[RulesSourceSeedRecord] = []
    for candidate in candidates:
        slug = candidate["rules_source_slug"]
        records.append(
            RulesSourceSeedRecord(
                seed_id_key=candidate.get("seed_id_key") or slug,
                rules_source_slug=slug,
                rules_source_name=candidate["rules_source_name"],
                rules_source_type=candidate["rules_source_type"],
                rules_source_version=candidate.get("rules_source_version"),
                rules_source_version_slug=candidate.get("rules_source_version_slug"),
                release_date=candidate.get("release_date"),
                superseded_date=candidate.get("superseded_date"),
                game_edition_slug=candidate["game_edition_slug"],
            )
        )
    return records


def _rules_faction_source_records_from_payload(
    payload: dict[str, Any],
) -> list[RulesFactionSourceSeedRecord]:
    try:
        candidates = payload["records"]["rules_faction_sources"]
    except KeyError as exc:
        raise ValueError("Normalized JSON does not contain records.rules_faction_sources") from exc

    records: list[RulesFactionSourceSeedRecord] = []
    for candidate in candidates:
        seed_id_key = candidate.get("seed_id_key")
        rules_faction_slug = candidate["rules_faction_slug"]
        rules_source_slug = candidate["rules_source_slug"]
        records.append(
            RulesFactionSourceSeedRecord(
                seed_id_key=seed_id_key or f"{rules_faction_slug}__{rules_source_slug}",
                rules_faction_slug=rules_faction_slug,
                rules_source_slug=rules_source_slug,
                source_relationship=candidate["source_relationship"],
                source_scope=candidate["source_scope"],
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


def _merge_existing_rules_source_data(
    new_records: list[RulesSourceSeedRecord],
) -> list[RulesSourceSeedRecord]:
    merged: dict[str, RulesSourceSeedRecord] = {}

    for path in sorted(RULES_SOURCES_DATA_DIR.rglob("*.data.ts")):
        if path.name.startswith("_index") or path.name.startswith("generated."):
            continue
        text = path.read_text(encoding="utf-8")
        for block in re.findall(r"\{\s*id:\s*rulesSourceId\(.*?\n\s*\}", text, flags=re.DOTALL):
            slug = _extract_ts_field(block, "rules_source_slug")
            name = _extract_ts_field(block, "rules_source_name")
            source_type = _extract_ts_field(block, "rules_source_type")
            edition_slug = _extract_call_arg(block, "gameEditionId")
            if not slug or not name or not source_type or not edition_slug:
                continue
            merged[slug] = RulesSourceSeedRecord(
                seed_id_key=slug,
                rules_source_slug=slug,
                rules_source_name=name,
                rules_source_type=source_type,
                rules_source_version=_extract_ts_field(block, "rules_source_version"),
                rules_source_version_slug=_extract_ts_field(
                    block, "rules_source_version_slug"
                ),
                release_date=_extract_nullable_date_field(block, "release_date"),
                superseded_date=_extract_nullable_date_field(block, "superseded_date"),
                game_edition_slug=edition_slug,
            )

    for record in new_records:
        merged.setdefault(record.rules_source_slug, record)

    return sorted(
        merged.values(),
        key=lambda item: (
            item.game_edition_slug,
            _rules_source_type_order(item.rules_source_type),
            item.rules_source_slug,
        ),
    )


def _merge_existing_rules_faction_source_data(
    new_records: list[RulesFactionSourceSeedRecord],
) -> list[RulesFactionSourceSeedRecord]:
    merged: dict[str, RulesFactionSourceSeedRecord] = {}

    for path in sorted(RULES_FACTION_SOURCES_DATA_DIR.rglob("*.data.ts")):
        if path.name.startswith("_index") or path.name.startswith("generated."):
            continue
        text = path.read_text(encoding="utf-8")
        for block in re.findall(
            r"\{\s*id:\s*rulesFactionSourceId\(.*?\n\s*\}", text, flags=re.DOTALL
        ):
            seed_id_key = _extract_call_arg(block, "rulesFactionSourceId")
            faction_slug = _extract_call_arg(block, "rulesFactionId")
            source_slug = _extract_call_arg(block, "rulesSourceId")
            relationship = _extract_ts_field(block, "source_relationship")
            scope = _extract_ts_field(block, "source_scope")
            if not seed_id_key or not faction_slug or not source_slug or not relationship or not scope:
                continue
            merged[seed_id_key] = RulesFactionSourceSeedRecord(
                seed_id_key=seed_id_key,
                rules_faction_slug=faction_slug,
                rules_source_slug=source_slug,
                source_relationship=relationship,
                source_scope=scope,
            )

    for record in new_records:
        merged.setdefault(record.seed_id_key, record)

    return sorted(
        merged.values(),
        key=lambda item: (item.rules_faction_slug, item.rules_source_slug),
    )



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


def _write_rules_source_ids_file(
    records: list[RulesSourceSeedRecord], existing_ids: dict[str, str]
) -> None:
    RULES_SOURCES_IDS_PATH.parent.mkdir(parents=True, exist_ok=True)
    id_lines = "\n".join(
        f'  {record.seed_id_key}: "{existing_ids.get(record.seed_id_key, _deterministic_ulid("rulesSource", record.seed_id_key))}",'
        for record in records
    )
    RULES_SOURCES_IDS_PATH.write_text(
        "\n".join(
            [
                "/**",
                " * Fixed ULIDs for generated rules source seed records.",
                " *",
                " * Generated from normalized Wahapedia rules-source candidates.",
                " */",
                "export const generated10eRulesSourceSeedIds = {",
                id_lines,
                "} as const;",
                "",
            ]
        ),
        encoding="utf-8",
    )


def _write_rules_sources_index_ids_file() -> None:
    RULES_SOURCES_INDEX_IDS_PATH.write_text(
        "\n".join(
            [
                'import { generated10eRulesSourceSeedIds } from "./generated.rules_sources.ids";',
                "",
                "const rulesSourceSeedIds = {",
                "  ...generated10eRulesSourceSeedIds,",
                "};",
                "",
                "export type RulesSourceSeedSlug = keyof typeof rulesSourceSeedIds;",
                "",
                "export const rulesSourceId = (slug: RulesSourceSeedSlug): string => {",
                "  return rulesSourceSeedIds[slug];",
                "};",
                "",
            ]
        ),
        encoding="utf-8",
    )


def _write_rules_sources_data_file(records: list[RulesSourceSeedRecord]) -> None:
    const_names = [_rules_source_const_name(record.rules_source_slug) for record in records]
    blocks = [
        'import type { RulesSourceConfig } from "../../../../types/_index.types";',
        'import { gameEditionId, rulesSourceId } from "../../../ids";',
        "",
        "/**",
        " * Generated concrete, versionable rules publications for 10th edition.",
        " */",
        "",
    ]
    for record, const_name in zip(records, const_names, strict=True):
        blocks.append(_render_rules_source_const(record, const_name))
        blocks.append("")

    record_lines = "\n".join(f"  {const_name}," for const_name in const_names)
    blocks.extend(
        [
            "export const generated10eRulesSources = [",
            record_lines,
            "] satisfies RulesSourceConfig[];",
            "",
        ]
    )
    RULES_SOURCES_DATA_PATH.write_text("\n".join(blocks), encoding="utf-8")


def _write_rules_sources_index_data_file() -> None:
    RULES_SOURCES_INDEX_DATA_PATH.write_text(
        "\n".join(
            [
                'import type { RulesSourceConfig } from "../../../../types/_index.types";',
                'import { generated10eRulesSources } from "./generated.rules_sources.data";',
                "",
                "export const rulesSources10e = [",
                "  ...generated10eRulesSources,",
                "] satisfies RulesSourceConfig[];",
                "",
            ]
        ),
        encoding="utf-8",
    )


def _write_rules_faction_source_ids_block(
    records: list[RulesFactionSourceSeedRecord], existing_ids: dict[str, str]
) -> None:
    ids_text = RULES_FACTION_SOURCE_IDS_PATH.read_text(encoding="utf-8")
    block = _render_rules_faction_source_ids_block(records, existing_ids)
    pattern = re.compile(
        r"type RulesFactionSourceSeedSlug =.*?export const rulesFactionSourceId = \(\n  slug: RulesFactionSourceSeedSlug,\n\): string => \{\n  return rulesFactionSourceSeedIds\[slug\];\n\};",
        flags=re.DOTALL,
    )
    if not pattern.search(ids_text):
        raise ValueError("Could not find rules faction source seed ID block")
    RULES_FACTION_SOURCE_IDS_PATH.write_text(pattern.sub(block, ids_text), encoding="utf-8")


def _render_rules_faction_source_ids_block(
    records: list[RulesFactionSourceSeedRecord], existing_ids: dict[str, str]
) -> str:
    if records:
        union_lines = "\n".join(f'  | "{record.seed_id_key}"' for record in records)
        type_block = f"type RulesFactionSourceSeedSlug =\n{union_lines};"
    else:
        type_block = "type RulesFactionSourceSeedSlug = never;"
    id_lines = "\n".join(
        f'  {record.seed_id_key}: "{existing_ids.get(record.seed_id_key, _deterministic_ulid("rulesFactionSource", record.seed_id_key))}",'
        for record in records
    )
    return "\n".join(
        [
            type_block,
            "",
            "const rulesFactionSourceSeedIds: Record<RulesFactionSourceSeedSlug, string> = {",
            id_lines,
            "};",
            "",
            "export const rulesFactionSourceId = (",
            "  slug: RulesFactionSourceSeedSlug,",
            "): string => {",
            "  return rulesFactionSourceSeedIds[slug];",
            "};",
        ]
    )


def _write_rules_faction_sources_data_file(
    records: list[RulesFactionSourceSeedRecord],
) -> None:
    const_names = [
        _rules_faction_source_const_name(record.seed_id_key) for record in records
    ]
    blocks = [
        'import type { RulesFactionSourceConfig } from "../../../../types/_index.types";',
        'import { rulesFactionId, rulesFactionSourceId, rulesSourceId } from "../../../ids";',
        "",
        "/**",
        " * Generated source applicability by rules faction for 10th edition.",
        " */",
        "",
    ]
    for record, const_name in zip(records, const_names, strict=True):
        blocks.append(_render_rules_faction_source_const(record, const_name))
        blocks.append("")

    record_lines = "\n".join(f"  {const_name}," for const_name in const_names)
    blocks.extend(
        [
            "export const generated10eRulesFactionSources = [",
            record_lines,
            "] satisfies RulesFactionSourceConfig[];",
            "",
        ]
    )
    RULES_FACTION_SOURCES_DATA_PATH.write_text("\n".join(blocks), encoding="utf-8")


def _write_rules_faction_sources_index_data_file() -> None:
    RULES_FACTION_SOURCES_INDEX_DATA_PATH.write_text(
        "\n".join(
            [
                'import type { RulesFactionSourceConfig } from "../../../../types/_index.types";',
                'import { generated10eRulesFactionSources } from "./generated.rules_faction_sources.data";',
                "",
                "export const rulesFactionSources10e = [",
                "  ...generated10eRulesFactionSources,",
                "] satisfies RulesFactionSourceConfig[];",
                "",
            ]
        ),
        encoding="utf-8",
    )


def _write_generated_game_data_ids_file(
    detachments: list[DetachmentSeedRecord],
    rules_faction_detachments: list[RulesFactionDetachmentSeedRecord],
    units: list[UnitSeedRecord],
    rules_faction_units: list[RulesFactionUnitSeedRecord],
    existing_ids: dict[str, str],
) -> None:
    GENERATED_GAME_DATA_IDS_PATH.parent.mkdir(parents=True, exist_ok=True)
    existing_text = (
        GENERATED_GAME_DATA_IDS_PATH.read_text(encoding="utf-8")
        if GENERATED_GAME_DATA_IDS_PATH.exists()
        else ""
    )
    blocks = [
        _render_seed_id_block(
            type_name="DetachmentSeedSlug",
            const_name="detachmentSeedIds",
            function_name="detachmentId",
            namespace="detachment",
            keys=[item.seed_id_key for item in detachments],
            existing_ids=existing_ids,
        ),
        _render_seed_id_block(
            type_name="RulesFactionDetachmentSeedSlug",
            const_name="rulesFactionDetachmentSeedIds",
            function_name="rulesFactionDetachmentId",
            namespace="rulesFactionDetachment",
            keys=[item.seed_id_key for item in rules_faction_detachments],
            existing_ids=existing_ids,
        ),
        _render_seed_id_block(
            type_name="UnitSeedSlug",
            const_name="unitSeedIds",
            function_name="unitId",
            namespace="unit",
            keys=[item.seed_id_key for item in units],
            existing_ids=existing_ids,
        ),
        _render_seed_id_block(
            type_name="RulesFactionUnitSeedSlug",
            const_name="rulesFactionUnitSeedIds",
            function_name="rulesFactionUnitId",
            namespace="rulesFactionUnit",
            keys=[item.seed_id_key for item in rules_faction_units],
            existing_ids=existing_ids,
        ),
    ]
    for function_name in ("kitId", "kitUnitId", "kitUnitPriceAllocationId"):
        existing_block = _extract_seed_id_block(existing_text, function_name)
        if existing_block:
            blocks.append(existing_block)
    GENERATED_GAME_DATA_IDS_PATH.write_text("\n\n".join(blocks) + "\n", encoding="utf-8")


def _ensure_generated_game_data_ids_export() -> None:
    export_line = 'export * from "./ids/generated_game_data.ids";'
    text = SEED_IDS_INDEX_PATH.read_text(encoding="utf-8")
    if export_line not in text:
        SEED_IDS_INDEX_PATH.write_text(f"{text.rstrip()}\n{export_line}\n", encoding="utf-8")


def _write_generated_kit_data_ids_blocks(
    *,
    kit_slugs: list[str],
    kit_units: list[KitUnitSeedRecord] | None,
    price_allocations: list[KitUnitPriceAllocationSeedRecord] | None,
    existing_ids: dict[str, str],
) -> None:
    GENERATED_GAME_DATA_IDS_PATH.parent.mkdir(parents=True, exist_ok=True)
    text = (
        GENERATED_GAME_DATA_IDS_PATH.read_text(encoding="utf-8")
        if GENERATED_GAME_DATA_IDS_PATH.exists()
        else ""
    )
    if kit_slugs or "export const kitId" not in text:
        kit_id_keys = sorted(set(kit_slugs) | set(_extract_seed_id_keys(text, "KitSeedSlug")))
        text = _replace_or_append_seed_id_block(
            text,
            _render_seed_id_block(
                type_name="KitSeedSlug",
                const_name="kitSeedIds",
                function_name="kitId",
                namespace="kit",
                keys=kit_id_keys,
                existing_ids=existing_ids,
            ),
            "KitSeedSlug",
            "kitId",
        )
    if kit_units is not None:
        text = _replace_or_append_seed_id_block(
            text,
            _render_seed_id_block(
                type_name="KitUnitSeedSlug",
                const_name="kitUnitSeedIds",
                function_name="kitUnitId",
                namespace="kitUnit",
                keys=[item.seed_id_key for item in kit_units],
                existing_ids=existing_ids,
            ),
            "KitUnitSeedSlug",
            "kitUnitId",
        )
    elif "export const kitUnitId" not in text:
        text = _append_text_block(
            text,
            _render_seed_id_block(
                type_name="KitUnitSeedSlug",
                const_name="kitUnitSeedIds",
                function_name="kitUnitId",
                namespace="kitUnit",
                keys=[],
                existing_ids=existing_ids,
            ),
        )

    if price_allocations is not None:
        text = _replace_or_append_seed_id_block(
            text,
            _render_seed_id_block(
                type_name="KitUnitPriceAllocationSeedSlug",
                const_name="kitUnitPriceAllocationSeedIds",
                function_name="kitUnitPriceAllocationId",
                namespace="kitUnitPriceAllocation",
                keys=[item.seed_id_key for item in price_allocations],
                existing_ids=existing_ids,
            ),
            "KitUnitPriceAllocationSeedSlug",
            "kitUnitPriceAllocationId",
        )
    elif "export const kitUnitPriceAllocationId" not in text:
        text = _append_text_block(
            text,
            _render_seed_id_block(
                type_name="KitUnitPriceAllocationSeedSlug",
                const_name="kitUnitPriceAllocationSeedIds",
                function_name="kitUnitPriceAllocationId",
                namespace="kitUnitPriceAllocation",
                keys=[],
                existing_ids=existing_ids,
            ),
        )
    GENERATED_GAME_DATA_IDS_PATH.write_text(text.rstrip() + "\n", encoding="utf-8")


def _write_kit_units_data_file(records: list[KitUnitSeedRecord]) -> None:
    const_names = [_const_name(item.seed_id_key, "KitUnit") for item in records]
    blocks = [
        'import type { KitUnitConfig, SeedDataset } from "../../types/_index.types";',
    ]
    if records:
        blocks.extend(['import { kitId, kitUnitId, unitId } from "../ids";', ""])
    else:
        blocks.append("")
    blocks.extend(
        [
        "/**",
        " * Curated kit-to-unit mapping seed scaffold.",
        " * Wahapedia does not provide reliable purchasable kit packaging data.",
        " */",
        "",
        ]
    )
    for record, const_name in zip(records, const_names, strict=True):
        blocks.extend(
            [
                f"export const {const_name}: KitUnitConfig = {{",
                f'  id: kitUnitId("{record.seed_id_key}"),',
                f'  kit_id: kitId("{record.kit_slug}"),',
                f'  unit_id: unitId("{record.unit_slug}"),',
                f"  unit_count: {record.unit_count},",
                f"  model_count: {record.model_count},",
                f'  component_type: "{record.component_type}",',
                f"  effective_date: {_nullable_date(record.effective_date)},",
                f"  superseded_date: {_nullable_date(record.superseded_date)},",
                "};",
                "",
            ]
        )
    blocks.extend(
        [
            'export const kitUnitsDataset: SeedDataset<"kit_units"> = {',
            '  table: "kit_units",',
            "  records: [",
            "\n".join(f"    {name}," for name in const_names),
            "  ] satisfies KitUnitConfig[],",
            "};",
            "",
        ]
    )
    KIT_UNITS_DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    KIT_UNITS_DATA_PATH.write_text("\n".join(blocks), encoding="utf-8")


def _write_kit_unit_price_allocations_data_file(
    records: list[KitUnitPriceAllocationSeedRecord],
) -> None:
    const_names = [
        _const_name(item.seed_id_key, "KitUnitPriceAllocation") for item in records
    ]
    blocks = [
        (
            'import type { KitUnitPriceAllocationConfig, SeedDataset } '
            'from "../../types/_index.types";'
        ),
    ]
    if records:
        blocks.extend(
            ['import { kitId, kitUnitPriceAllocationId, unitId } from "../ids";', ""]
        )
    else:
        blocks.append("")
    blocks.extend(
        [
        "/**",
        " * Curated kit-unit price allocation seed scaffold.",
        " * Wahapedia does not provide kit prices, SKUs, product URLs, bundles, or allocations.",
        " */",
        "",
        ]
    )
    for record, const_name in zip(records, const_names, strict=True):
        blocks.extend(
            [
                f"export const {const_name}: KitUnitPriceAllocationConfig = {{",
                f'  id: kitUnitPriceAllocationId("{record.seed_id_key}"),',
                f'  kit_id: kitId("{record.kit_slug}"),',
                f'  unit_id: unitId("{record.unit_slug}"),',
                f"  allocation_ratio: {record.allocation_ratio},",
                f"  reference_price: {record.reference_price if record.reference_price is not None else 'null'},",
                f"  reference_currency: {_nullable_ts_string(record.reference_currency)},",
                f'  allocation_basis: "{record.allocation_basis}",',
                f"  effective_date: {_nullable_date(record.effective_date)},",
                f"  superseded_date: {_nullable_date(record.superseded_date)},",
                "};",
                "",
            ]
        )
    blocks.extend(
        [
            (
                'export const kitUnitPriceAllocationsDataset: '
                'SeedDataset<"kit_unit_price_allocations"> = {'
            ),
            '  table: "kit_unit_price_allocations",',
            "  records: [",
            "\n".join(f"    {name}," for name in const_names),
            "  ] satisfies KitUnitPriceAllocationConfig[],",
            "};",
            "",
        ]
    )
    KIT_UNIT_PRICE_ALLOCATIONS_DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    KIT_UNIT_PRICE_ALLOCATIONS_DATA_PATH.write_text(
        "\n".join(blocks), encoding="utf-8"
    )


def _write_detachments_data_file(records: list[DetachmentSeedRecord]) -> None:
    const_names = [_const_name(item.detachment_slug, "Detachment") for item in records]
    blocks = [
        'import type { DetachmentConfig, SeedDataset } from "../../types/_index.types";',
        'import { detachmentId, rulesSourceId } from "../ids";',
        "",
        "/**",
        " * Typed seed dataset for the `detachments` table.",
        " * Generated from normalized Wahapedia faction data.",
        " */",
        "",
    ]
    for record, const_name in zip(records, const_names, strict=True):
        blocks.extend(
            [
                f"export const {const_name}: DetachmentConfig = {{",
                f'  id: detachmentId("{record.seed_id_key}"),',
                f"  detachment_name: {_ts_string(record.detachment_name)},",
                f'  detachment_slug: "{record.detachment_slug}",',
                f'  rules_source_id: rulesSourceId("{record.rules_source_slug}"),',
                "};",
                "",
            ]
        )
    blocks.extend(
        [
            'export const detachmentsDataset: SeedDataset<"detachments"> = {',
            '  table: "detachments",',
            "  records: [",
            "\n".join(f"    {name}," for name in const_names),
            "  ] satisfies DetachmentConfig[],",
            "};",
            "",
        ]
    )
    DETACHMENTS_DATA_PATH.write_text("\n".join(blocks), encoding="utf-8")


def _write_rules_faction_detachments_data_file(
    records: list[RulesFactionDetachmentSeedRecord],
) -> None:
    const_names = [_const_name(item.seed_id_key, "RulesFactionDetachment") for item in records]
    blocks = [
        'import type { RulesFactionDetachmentConfig, SeedDataset } from "../../types/_index.types";',
        'import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../ids";',
        "",
        "/**",
        " * Typed seed dataset for the `rules_faction_detachments` table.",
        " * Generated from normalized Wahapedia faction data.",
        " */",
        "",
    ]
    for record, const_name in zip(records, const_names, strict=True):
        blocks.extend(
            [
                f"export const {const_name}: RulesFactionDetachmentConfig = {{",
                f'  id: rulesFactionDetachmentId("{record.seed_id_key}"),',
                f'  rules_faction_id: rulesFactionId("{record.rules_faction_slug}"),',
                f'  detachment_id: detachmentId("{record.detachment_slug}"),',
                f"  detachment_access_type: {_nullable_ts_string(record.detachment_access_type)},",
                f"  effective_date: {_nullable_date(record.effective_date)},",
                f"  superseded_date: {_nullable_date(record.superseded_date)},",
                "};",
                "",
            ]
        )
    blocks.extend(
        [
            'export const rulesFactionDetachmentsDataset: SeedDataset<"rules_faction_detachments"> = {',
            '  table: "rules_faction_detachments",',
            "  records: [",
            "\n".join(f"    {name}," for name in const_names),
            "  ] satisfies RulesFactionDetachmentConfig[],",
            "};",
            "",
        ]
    )
    RULES_FACTION_DETACHMENTS_DATA_PATH.write_text("\n".join(blocks), encoding="utf-8")


def _write_units_data_file(records: list[UnitSeedRecord]) -> None:
    const_names = [_const_name(item.unit_slug, "Unit") for item in records]
    blocks = [
        'import type { SeedDataset, UnitConfig } from "../../types/_index.types";',
        'import { unitId } from "../ids";',
        "",
        "/**",
        " * Typed seed dataset for the `units` table.",
        " * Generated from normalized Wahapedia faction data.",
        " */",
        "",
    ]
    for record, const_name in zip(records, const_names, strict=True):
        blocks.extend(
            [
                f"export const {const_name}: UnitConfig = {{",
                f'  id: unitId("{record.seed_id_key}"),',
                f"  unit_name: {_ts_string(record.unit_name)},",
                f'  unit_slug: "{record.unit_slug}",',
                f"  is_legends: {str(record.is_legends).lower()},",
                f"  wahapedia_url: {_ts_string(record.wahapedia_url)},",
                "};",
                "",
            ]
        )
    blocks.extend(
        [
            'export const unitsDataset: SeedDataset<"units"> = {',
            '  table: "units",',
            "  records: [",
            "\n".join(f"    {name}," for name in const_names),
            "  ] satisfies UnitConfig[],",
            "};",
            "",
        ]
    )
    UNITS_DATA_PATH.write_text("\n".join(blocks), encoding="utf-8")


def _write_rules_faction_units_data_file(records: list[RulesFactionUnitSeedRecord]) -> None:
    const_names = [_const_name(item.seed_id_key, "RulesFactionUnit") for item in records]
    blocks = [
        'import type { RulesFactionUnitConfig, SeedDataset } from "../../types/_index.types";',
        'import { rulesFactionId, rulesFactionUnitId, rulesSourceId, unitId } from "../ids";',
        "",
        "/**",
        " * Typed seed dataset for the `rules_faction_units` table.",
        " * Generated from normalized Wahapedia faction data.",
        " */",
        "",
    ]
    for record, const_name in zip(records, const_names, strict=True):
        blocks.extend(
            [
                f"export const {const_name}: RulesFactionUnitConfig = {{",
                f'  id: rulesFactionUnitId("{record.seed_id_key}"),',
                f'  rules_faction_unit_slug: "{record.rules_faction_unit_slug}",',
                f'  rules_faction_id: rulesFactionId("{record.rules_faction_slug}"),',
                f'  unit_id: unitId("{record.unit_slug}"),',
                f"  unit_access_type: {_nullable_ts_string(record.unit_access_type)},",
                f'  rules_source_id: rulesSourceId("{record.rules_source_slug}"),',
                f"  effective_date: {_nullable_date(record.effective_date)},",
                f"  superseded_date: {_nullable_date(record.superseded_date)},",
                "};",
                "",
            ]
        )
    blocks.extend(
        [
            'export const rulesFactionUnitsDataset: SeedDataset<"rules_faction_units"> = {',
            '  table: "rules_faction_units",',
            "  records: [",
            "\n".join(f"    {name}," for name in const_names),
            "  ] satisfies RulesFactionUnitConfig[],",
            "};",
            "",
        ]
    )
    RULES_FACTION_UNITS_DATA_PATH.write_text("\n".join(blocks), encoding="utf-8")


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


def _render_rules_source_const(record: RulesSourceSeedRecord, const_name: str) -> str:
    return "\n".join(
        [
            f"export const {const_name}: RulesSourceConfig = {{",
            f'  id: rulesSourceId("{record.seed_id_key}"),',
            f'  rules_source_slug: "{record.rules_source_slug}",',
            f"  rules_source_name: {_ts_string(record.rules_source_name)},",
            f'  rules_source_type: "{record.rules_source_type}",',
            f"  rules_source_version: {_nullable_ts_string(record.rules_source_version)},",
            f"  rules_source_version_slug: {_nullable_ts_string(record.rules_source_version_slug)},",
            f"  release_date: {_nullable_date(record.release_date)},",
            f"  superseded_date: {_nullable_date(record.superseded_date)},",
            f'  game_edition_id: gameEditionId("{record.game_edition_slug}"),',
            "};",
        ]
    )


def _render_rules_faction_source_const(
    record: RulesFactionSourceSeedRecord, const_name: str
) -> str:
    return "\n".join(
        [
            f"export const {const_name}: RulesFactionSourceConfig = {{",
            f'  id: rulesFactionSourceId("{record.seed_id_key}"),',
            f'  rules_faction_id: rulesFactionId("{record.rules_faction_slug}"),',
            f'  rules_source_id: rulesSourceId("{record.rules_source_slug}"),',
            f'  source_relationship: "{record.source_relationship}",',
            f'  source_scope: "{record.source_scope}",',
            "};",
        ]
    )


def _ability_const_name(slug: str) -> str:
    name = "".join(part.capitalize() for part in slug.split("_")) + "Ability"
    return f"Ability{name}" if name[:1].isdigit() else name


def _keyword_const_name(slug: str) -> str:
    name = "".join(part.capitalize() for part in slug.split("_")) + "Keyword"
    return f"Keyword{name}" if name[:1].isdigit() else name


def _rules_source_const_name(slug: str) -> str:
    name = "".join(part.capitalize() for part in slug.split("_")) + "RulesSource"
    return f"RulesSource{name}" if name[:1].isdigit() else name


def _rules_faction_source_const_name(slug: str) -> str:
    name = "".join(part.capitalize() for part in re.split(r"_+", slug)) + "RulesFactionSource"
    return f"RulesFactionSource{name}" if name[:1].isdigit() else name


def _const_name(slug: str, suffix: str) -> str:
    name = "".join(part.capitalize() for part in re.split(r"[_\-]+", slug)) + suffix
    return f"{suffix}{name}" if name[:1].isdigit() else name


def _ts_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=True)


def _nullable_ts_string(value: str | None) -> str:
    return "null" if value is None else _ts_string(value)



def _nullable_date(value: str | None) -> str:
    return "null" if value is None else f"new Date({_ts_string(value)})"


def _decode_ts_string(value: str) -> str:
    return json.loads(f'"{value}"')


def _is_seedable_slug(slug: str) -> bool:
    return bool(slug and re.search(r"[a-z]", slug))


def _unique_by_slug(records: list[Any], attribute: str) -> list[Any]:
    by_slug: dict[str, Any] = {}
    for record in records:
        by_slug.setdefault(getattr(record, attribute), record)
    return [by_slug[key] for key in sorted(by_slug)]


def _extract_ts_field(block: str, field_name: str) -> str | None:
    match = re.search(rf"{field_name}:\s*{TS_STRING_PATTERN}", block)
    if not match:
        return None
    return _decode_ts_string(match.group(1))



def _extract_nullable_date_field(block: str, field_name: str) -> str | None:
    match = re.search(rf"{field_name}:\s*new Date\({TS_STRING_PATTERN}\)", block)
    if not match:
        return None
    return _decode_ts_string(match.group(1))


def _extract_call_arg(block: str, function_name: str) -> str | None:
    match = re.search(rf"{function_name}\(\s*{TS_STRING_PATTERN}\s*\)", block, flags=re.DOTALL)
    if not match:
        return None
    return _decode_ts_string(match.group(1))


def _rules_source_type_order(source_type: str) -> int:
    """Return the sort position for a rules source type.

    Values are loaded from data/rules_sources.yaml (source_type_order key).
    Types absent from the map sort after all known types (returns 98).
    """
    return source_type_order_map().get(source_type, 98)




# ---------------------------------------------------------------------------
# unit-datasheets seed records
# ---------------------------------------------------------------------------

@dataclass(frozen=True)
class ModelSeedRecord:
    seed_id_key: str
    model_slug: str
    model_name: str


@dataclass(frozen=True)
class WeaponSeedRecord:
    seed_id_key: str
    weapon_slug: str
    weapon_name: str
    weapon_type: str


@dataclass(frozen=True)
class WeaponProfileSeedRecord:
    seed_id_key: str
    weapon_profile_slug: str
    weapon_slug: str
    game_edition_slug: str
    rules_source_slug: str | None
    range: str
    attacks: str
    skill: str
    strength: str
    armor_penetration: int
    damage: str


@dataclass(frozen=True)
class WeaponProfileKeywordSeedRecord:
    seed_id_key: str
    weapon_profile_slug: str
    keyword_slug: str
    keyword_parameter: str | None


@dataclass(frozen=True)
class UnitModelSeedRecord:
    seed_id_key: str
    unit_slug: str
    model_slug: str
    min_count: int
    max_count: int


@dataclass(frozen=True)
class UnitProfileSeedRecord:
    seed_id_key: str
    unit_profile_slug: str
    unit_profile_name: str
    unit_slug: str
    model_slug: str | None
    game_edition_slug: str
    rules_source_slug: str | None
    stats: dict[str, str]


@dataclass(frozen=True)
class UnitPointCostSeedRecord:
    seed_id_key: str
    unit_point_cost_slug: str
    unit_slug: str
    game_edition_slug: str
    rules_source_slug: str | None
    model_count: int
    points: int


@dataclass(frozen=True)
class UnitSelectionLimitSeedRecord:
    seed_id_key: str
    unit_slug: str
    game_edition_slug: str
    min_models: int
    max_models: int


@dataclass(frozen=True)
class UnitWeaponSeedRecord:
    seed_id_key: str
    unit_slug: str
    model_slug: str | None
    weapon_profile_slug: str
    game_edition_slug: str
    rules_source_slug: str | None
    is_default: bool


@dataclass(frozen=True)
class LeaderEligibilitySeedRecord:
    seed_id_key: str
    leader_unit_slug: str
    target_unit_slug: str
    game_edition_slug: str
    rules_source_slug: str | None
    is_legends: bool


# ---------------------------------------------------------------------------
# apply_unit_datasheets_seed — three-phase single-pass apply
# ---------------------------------------------------------------------------

def apply_unit_datasheets_seed(*, normalized: list[str]) -> list[Path]:
    """Apply unit-datasheet normalized JSONs to TypeScript seed files.

    Accepts all faction normalized files at once. Runs three internal phases:
      1. Collect & deduplicate: builds global registries for models, weapons,
         weapon_profiles, and weapon_profile_keywords across all factions.
      2. Build per-faction records: junction/unit-specific records per faction,
         referencing slugs guaranteed to exist in the global registries.
      3. Write files: 4 global files + up to 8 per-faction files × 25 factions.
    """
    paths = _normalized_paths(normalized, "unit-datasheets.normalized.json")
    payloads = [_latest_payload(read_json(p)) for p in paths]

    # --- Phase 1: global deduplication ---
    models_reg: dict[str, ModelSeedRecord] = {}
    weapons_reg: dict[str, WeaponSeedRecord] = {}
    wp_reg: dict[str, WeaponProfileSeedRecord] = {}
    wpk_reg: dict[str, WeaponProfileKeywordSeedRecord] = {}

    for payload in payloads:
        records = payload.get("records", {})

        for m in records.get("models", []):
            models_reg.setdefault(
                m["model_slug"],
                ModelSeedRecord(
                    seed_id_key=m["seed_id_key"],
                    model_slug=m["model_slug"],
                    model_name=m["model_name"],
                ),
            )

        for w in records.get("weapons", []):
            weapons_reg.setdefault(
                w["weapon_slug"],
                WeaponSeedRecord(
                    seed_id_key=w["seed_id_key"],
                    weapon_slug=w["weapon_slug"],
                    weapon_name=w["weapon_name"],
                    weapon_type=w["weapon_type"],
                ),
            )

        for wp in records.get("weapon_profiles", []):
            key = wp["weapon_profile_slug"]
            if key not in wp_reg:
                wp_reg[key] = WeaponProfileSeedRecord(
                    seed_id_key=wp["seed_id_key"],
                    weapon_profile_slug=wp["weapon_profile_slug"],
                    weapon_slug=wp["weapon_slug"],
                    game_edition_slug=wp["game_edition_slug"],
                    rules_source_slug=wp.get("rules_source_slug"),
                    range=wp["range"],
                    attacks=wp["attacks"],
                    skill=wp["skill"],
                    strength=wp["strength"],
                    armor_penetration=wp["armor_penetration"],
                    damage=wp["damage"],
                )
                for kw in wp.get("keywords", []):
                    kw_key = f"{key}__{kw['keyword_name'].replace(' ', '_')}"
                    wpk_reg.setdefault(
                        kw_key,
                        WeaponProfileKeywordSeedRecord(
                            seed_id_key=kw_key,
                            weapon_profile_slug=key,
                            keyword_slug=kw["keyword_name"].replace(" ", "_"),
                            keyword_parameter=kw.get("keyword_parameter"),
                        ),
                    )

    # --- Phase 2: per-faction records ---
    faction_records: dict[str, dict[str, list[Any]]] = {}

    for payload in payloads:
        faction = payload.get("faction") or "unknown"
        records = payload.get("records", {})

        um: list[UnitModelSeedRecord] = []
        for r in records.get("unit_models", []):
            um.append(UnitModelSeedRecord(
                seed_id_key=r["seed_id_key"],
                unit_slug=r["unit_slug"],
                model_slug=r["model_slug"],
                min_count=r["min_count"],
                max_count=r["max_count"],
            ))

        up: list[UnitProfileSeedRecord] = []
        for r in records.get("unit_profiles", []):
            up.append(UnitProfileSeedRecord(
                seed_id_key=r["seed_id_key"],
                unit_profile_slug=r["unit_profile_slug"],
                unit_profile_name=r["unit_profile_name"],
                unit_slug=r["unit_slug"],
                model_slug=r.get("model_slug"),
                game_edition_slug=r["game_edition_slug"],
                rules_source_slug=r.get("rules_source_slug"),
                stats=r.get("stats", {}),
            ))

        upc: list[UnitPointCostSeedRecord] = []
        for r in records.get("unit_point_costs", []):
            upc.append(UnitPointCostSeedRecord(
                seed_id_key=r["seed_id_key"],
                unit_point_cost_slug=r["unit_point_cost_slug"],
                unit_slug=r["unit_slug"],
                game_edition_slug=r["game_edition_slug"],
                rules_source_slug=r.get("rules_source_slug"),
                model_count=r["model_count"],
                points=r["points"],
            ))

        usl: list[UnitSelectionLimitSeedRecord] = []
        for r in records.get("unit_selection_limits", []):
            usl.append(UnitSelectionLimitSeedRecord(
                seed_id_key=r["seed_id_key"],
                unit_slug=r["unit_slug"],
                game_edition_slug=r["game_edition_slug"],
                min_models=r["min_models"],
                max_models=r["max_models"],
            ))

        uw: list[UnitWeaponSeedRecord] = []
        for r in records.get("unit_weapons", []):
            uw.append(UnitWeaponSeedRecord(
                seed_id_key=r["seed_id_key"],
                unit_slug=r["unit_slug"],
                model_slug=r.get("model_slug"),
                weapon_profile_slug=r["weapon_profile_slug"],
                game_edition_slug=r["game_edition_slug"],
                rules_source_slug=r.get("rules_source_slug"),
                is_default=r.get("is_default", True),
            ))

        le: list[LeaderEligibilitySeedRecord] = []
        for r in records.get("leader_eligibilities", []):
            le.append(LeaderEligibilitySeedRecord(
                seed_id_key=r["seed_id_key"],
                leader_unit_slug=r["leader_unit_slug"],
                target_unit_slug=r["target_unit_slug"],
                game_edition_slug=r["game_edition_slug"],
                rules_source_slug=r.get("rules_source_slug"),
                is_legends=r.get("is_legends", False),
            ))

        faction_records[faction] = {
            "unit_models": um,
            "unit_profiles": up,
            "unit_point_costs": upc,
            "unit_selection_limits": usl,
            "unit_weapons": uw,
            "leader_eligibilities": le,
        }

    # --- Phase 3: write files ---
    from .writers.seed_workspace import (
        MODELS_DATA_PATH,
        WEAPONS_DATA_PATH,
        WEAPON_PROFILES_DATA_PATH,
        WEAPON_PROFILE_KEYWORDS_DATA_PATH,
        UNIT_DATASHEETS_DATA_DIR,
    )

    written: list[Path] = []

    _write_models_data_file(sorted(models_reg.values(), key=lambda r: r.model_slug))
    written.append(MODELS_DATA_PATH)

    _write_weapons_data_file(sorted(weapons_reg.values(), key=lambda r: r.weapon_slug))
    written.append(WEAPONS_DATA_PATH)

    _write_weapon_profiles_data_file(sorted(wp_reg.values(), key=lambda r: r.weapon_profile_slug))
    written.append(WEAPON_PROFILES_DATA_PATH)

    # weapon_profile_keywords deferred — weapon keywords ([PISTOL], [TORRENT] etc.)
    # are not yet seeded into the keywords table. This file will be generated in a
    # follow-up pass once weapon keywords are added to the keyword seed data.
    # _write_weapon_profile_keywords_data_file(...)

    UNIT_DATASHEETS_DATA_DIR.mkdir(parents=True, exist_ok=True)

    for faction, tables in sorted(faction_records.items()):
        faction_dir = UNIT_DATASHEETS_DATA_DIR / faction
        faction_dir.mkdir(parents=True, exist_ok=True)

        written += _write_faction_unit_datasheets(faction, faction_dir, tables)

    return written


# ---------------------------------------------------------------------------
# Global file writers
# ---------------------------------------------------------------------------

def _write_models_data_file(records: list[ModelSeedRecord]) -> None:
    from .writers.seed_workspace import MODELS_DATA_PATH
    const_names = [_const_name(r.model_slug, "Model") for r in records]
    lines = [
        'import type { ModelConfig, SeedDataset } from "../../types/_index.types";',
        'import { modelId } from "../ids";',
        "",
        "/**",
        " * Typed seed dataset for the `models` table.",
        " * Generated from Wahapedia unit-datasheet data — deduped across all factions.",
        " */",
        "",
    ]
    for record, const_name in zip(records, const_names, strict=True):
        lines += [
            f"export const {const_name}: ModelConfig = {{",
            f'  id: modelId("{record.seed_id_key}"),',
            f"  model_slug: {_ts_string(record.model_slug)},",
            f"  model_name: {_ts_string(record.model_name)},",
            "};",
            "",
        ]
    lines += [
        'export const modelsDataset: SeedDataset<"models"> = {',
        '  table: "models",',
        "  records: [",
        *[f"    {n}," for n in const_names],
        "  ] satisfies ModelConfig[],",
        "};",
        "",
    ]
    MODELS_DATA_PATH.write_text("\n".join(lines), encoding="utf-8")


def _write_weapons_data_file(records: list[WeaponSeedRecord]) -> None:
    from .writers.seed_workspace import WEAPONS_DATA_PATH
    const_names = [_const_name(r.weapon_slug, "Weapon") for r in records]
    lines = [
        'import type { WeaponConfig, SeedDataset } from "../../types/_index.types";',
        'import { weaponId } from "../ids";',
        "",
        "/**",
        " * Typed seed dataset for the `weapons` table.",
        " * Generated from Wahapedia unit-datasheet data — deduped across all factions.",
        " */",
        "",
    ]
    for record, const_name in zip(records, const_names, strict=True):
        lines += [
            f"export const {const_name}: WeaponConfig = {{",
            f'  id: weaponId("{record.seed_id_key}"),',
            f"  weapon_slug: {_ts_string(record.weapon_slug)},",
            f"  weapon_name: {_ts_string(record.weapon_name)},",
            f'  weapon_type: "{record.weapon_type}",',
            "};",
            "",
        ]
    lines += [
        'export const weaponsDataset: SeedDataset<"weapons"> = {',
        '  table: "weapons",',
        "  records: [",
        *[f"    {n}," for n in const_names],
        "  ] satisfies WeaponConfig[],",
        "};",
        "",
    ]
    WEAPONS_DATA_PATH.write_text("\n".join(lines), encoding="utf-8")


def _write_weapon_profiles_data_file(records: list[WeaponProfileSeedRecord]) -> None:
    from .writers.seed_workspace import WEAPON_PROFILES_DATA_PATH
    const_names = [_const_name(r.weapon_profile_slug, "WeaponProfile") for r in records]
    lines = [
        'import type { WeaponProfileConfig, SeedDataset } from "../../types/_index.types";',
        'import { gameEditionId, rulesSourceId, weaponId, weaponProfileId } from "../ids";',
        "",
        "/**",
        " * Typed seed dataset for the `weapon_profiles` table.",
        " * Generated from Wahapedia unit-datasheet data — deduped across all factions.",
        " */",
        "",
    ]
    for record, const_name in zip(records, const_names, strict=True):
        rs = f'rulesSourceId("{record.rules_source_slug}")' if record.rules_source_slug else "null"
        lines += [
            f"export const {const_name}: WeaponProfileConfig = {{",
            f'  id: weaponProfileId("{record.seed_id_key}"),',
            f"  weapon_profile_slug: {_ts_string(record.weapon_profile_slug)},",
            f'  weapon_id: weaponId("{record.weapon_slug}"),',
            f'  game_edition_id: gameEditionId("{record.game_edition_slug}"),',
            f"  rules_source_id: {rs},",
            f"  range: {_ts_string(record.range)},",
            f"  attacks: {_ts_string(record.attacks)},",
            f"  skill: {_ts_string(record.skill)},",
            f"  strength: {_ts_string(record.strength)},",
            f"  armor_penetration: {record.armor_penetration},",
            f"  damage: {_ts_string(record.damage)},",
            "  effective_date: null,",
            "  superseded_date: null,",
            "};",
            "",
        ]
    lines += [
        'export const weaponProfilesDataset: SeedDataset<"weapon_profiles"> = {',
        '  table: "weapon_profiles",',
        "  records: [",
        *[f"    {n}," for n in const_names],
        "  ] satisfies WeaponProfileConfig[],",
        "};",
        "",
    ]
    WEAPON_PROFILES_DATA_PATH.write_text("\n".join(lines), encoding="utf-8")


def _write_weapon_profile_keywords_data_file(records: list[WeaponProfileKeywordSeedRecord]) -> None:
    from .writers.seed_workspace import WEAPON_PROFILE_KEYWORDS_DATA_PATH
    const_names = [_const_name(r.seed_id_key, "Wpk") for r in records]
    lines = [
        'import type { WeaponProfileKeywordConfig, SeedDataset } from "../../types/_index.types";',
        'import { keywordId, weaponProfileId, weaponProfileKeywordId } from "../ids";',
        "",
        "/**",
        " * Typed seed dataset for the `weapon_profile_keywords` table.",
        " * Generated from Wahapedia unit-datasheet data.",
        " */",
        "",
    ]
    for record, const_name in zip(records, const_names, strict=True):
        param = _nullable_ts_string(record.keyword_parameter)
        lines += [
            f"export const {const_name}: WeaponProfileKeywordConfig = {{",
            f'  id: weaponProfileKeywordId("{record.seed_id_key}"),',
            f'  weapon_profile_id: weaponProfileId("{record.weapon_profile_slug}"),',
            f'  keyword_id: keywordId("{record.keyword_slug}"),',
            f"  keyword_parameter: {param},",
            "};",
            "",
        ]
    lines += [
        'export const weaponProfileKeywordsDataset: SeedDataset<"weapon_profile_keywords"> = {',
        '  table: "weapon_profile_keywords",',
        "  records: [",
        *[f"    {n}," for n in const_names],
        "  ] satisfies WeaponProfileKeywordConfig[],",
        "};",
        "",
    ]
    WEAPON_PROFILE_KEYWORDS_DATA_PATH.write_text("\n".join(lines), encoding="utf-8")


# ---------------------------------------------------------------------------
# Per-faction file writers
# ---------------------------------------------------------------------------

def _write_faction_unit_datasheets(
    faction: str,
    faction_dir: Path,
    tables: dict[str, list[Any]],
) -> list[Path]:
    written: list[Path] = []

    writers = [
        ("unit_models",          tables["unit_models"],          _render_unit_models_file),
        ("unit_profiles",        tables["unit_profiles"],        _render_unit_profiles_file),
        ("unit_point_costs",     tables["unit_point_costs"],     _render_unit_point_costs_file),
        ("unit_weapons",         tables["unit_weapons"],         _render_unit_weapons_file),
        ("leader_eligibilities", tables["leader_eligibilities"], _render_leader_eligibilities_file),
        # unit_selection_limits not generated — that table stores game-size/keyword list-building
        # limits, not unit composition counts. Requires different source data.
    ]
    for table_name, records, renderer in writers:
        if not records:
            continue
        path = faction_dir / f"{faction}_{table_name}.data.ts"
        path.write_text(renderer(faction, records), encoding="utf-8")
        written.append(path)

    # unit_profile_stats derived from unit_profiles
    if tables["unit_profiles"]:
        path = faction_dir / f"{faction}_unit_profile_stats.data.ts"
        path.write_text(_render_unit_profile_stats_file(faction, tables["unit_profiles"]), encoding="utf-8")
        written.append(path)

    # leader_eligibility_keywords: only units that were led by named units
    # (keyword-predicate leader eligibility is not yet extracted — placeholder empty file)
    le_kw_path = faction_dir / f"{faction}_leader_eligibility_keywords.data.ts"
    le_kw_path.write_text(_render_leader_eligibility_keywords_file(faction), encoding="utf-8")
    written.append(le_kw_path)

    return written


def _render_unit_models_file(faction: str, records: list[UnitModelSeedRecord]) -> str:
    const_names = [_const_name(r.seed_id_key, "UnitModel") for r in records]
    lines = [
        'import type { UnitModelConfig, SeedDataset } from "../../../../types/_index.types";',
        'import { modelId, unitId, unitModelId } from "../../../ids";',
        "",
        f"/**",
        f" * Unit-model composition records for the {faction} faction.",
        f" * Generated from Wahapedia unit-datasheet data.",
        f" */",
        "",
    ]
    for record, const_name in zip(records, const_names, strict=True):
        lines += [
            f"export const {const_name}: UnitModelConfig = {{",
            f'  id: unitModelId("{record.seed_id_key}"),',
            f'  unit_id: unitId("{record.unit_slug}"),',
            f'  model_id: modelId("{record.model_slug}"),',
            f"  minimum_model_count: {record.min_count},",
            f"  maximum_model_count: {record.max_count},",
            "  effective_date: null,",
            "  superseded_date: null,",
            "};",
            "",
        ]
    lines += [
        f'export const {_faction_const(faction, "unitModels")}Dataset: SeedDataset<"unit_models"> = {{',
        '  table: "unit_models",',
        "  records: [",
        *[f"    {n}," for n in const_names],
        "  ] satisfies UnitModelConfig[],",
        "};",
        "",
    ]
    return "\n".join(lines)


def _render_unit_profiles_file(faction: str, records: list[UnitProfileSeedRecord]) -> str:
    # Skip profiles with no rules source — rules_source_id is not nullable in the schema.
    valid = [r for r in records if r.rules_source_slug]
    const_names = [_const_name(r.unit_profile_slug, "UnitProfile") for r in valid]
    lines = [
        'import type { UnitProfileConfig, SeedDataset } from "../../../../types/_index.types";',
        'import { gameEditionId, modelId, rulesSourceId, unitId, unitProfileId } from "../../../ids";',
        "",
        f"/**",
        f" * Unit profile stat-block records for the {faction} faction.",
        f" * Generated from Wahapedia unit-datasheet data.",
        f" */",
        "",
    ]
    for record, const_name in zip(valid, const_names, strict=True):
        model_id = f'modelId("{record.model_slug}")' if record.model_slug else "null"
        lines += [
            f"export const {const_name}: UnitProfileConfig = {{",
            f'  id: unitProfileId("{record.seed_id_key}"),',
            f"  unit_profile_slug: {_ts_string(record.unit_profile_slug)},",
            f"  unit_profile_name: {_ts_string(record.unit_profile_name)},",
            f'  unit_id: unitId("{record.unit_slug}"),',
            f"  model_id: {model_id},",
            f'  game_edition_id: gameEditionId("{record.game_edition_slug}"),',
            f'  rules_source_id: rulesSourceId("{record.rules_source_slug}"),',
            "  effective_date: null,",
            "  superseded_date: null,",
            "};",
            "",
        ]
    lines += [
        f'export const {_faction_const(faction, "unitProfiles")}Dataset: SeedDataset<"unit_profiles"> = {{',
        '  table: "unit_profiles",',
        "  records: [",
        *[f"    {n}," for n in const_names],
        "  ] satisfies UnitProfileConfig[],",
        "};",
        "",
    ]
    return "\n".join(lines)


def _render_unit_profile_stats_file(faction: str, profiles: list[UnitProfileSeedRecord]) -> str:
    # Only emit stats for profiles that have a rules source (same filter as profiles file).
    profiles = [p for p in profiles if p.rules_source_slug]
    lines = [
        'import type { UnitProfileStatConfig, SeedDataset } from "../../../../types/_index.types";',
        'import { unitProfileId, unitProfileStatId } from "../../../ids";',
        "",
        f"/**",
        f" * Unit profile stat rows for the {faction} faction.",
        f" * Generated from Wahapedia unit-datasheet data.",
        f" */",
        "",
    ]
    all_const_names: list[str] = []
    for profile in profiles:
        for stat_key, stat_value in profile.stats.items():
            stat_slug = f"{profile.unit_profile_slug}__{stat_key.lower()}"
            const_name = _const_name(stat_slug, "Stat")
            all_const_names.append(const_name)
            lines += [
                f"export const {const_name}: UnitProfileStatConfig = {{",
                f'  id: unitProfileStatId("{stat_slug}"),',
                f'  unit_profile_id: unitProfileId("{profile.seed_id_key}"),',
                f"  stat_key: {_ts_string(stat_key)},",
                f"  stat_value: {_ts_string(stat_value)},",
                "};",
                "",
            ]
    lines += [
        f'export const {_faction_const(faction, "unitProfileStats")}Dataset: SeedDataset<"unit_profile_stats"> = {{',
        '  table: "unit_profile_stats",',
        "  records: [",
        *[f"    {n}," for n in all_const_names],
        "  ] satisfies UnitProfileStatConfig[],",
        "};",
        "",
    ]
    return "\n".join(lines)


def _render_unit_point_costs_file(faction: str, records: list[UnitPointCostSeedRecord]) -> str:
    # Skip records with no rules source — rules_source_id is not nullable.
    valid = [r for r in records if r.rules_source_slug]
    const_names = [_const_name(r.seed_id_key, "PointCost") for r in valid]
    lines = [
        'import type { UnitPointCostConfig, SeedDataset } from "../../../../types/_index.types";',
        'import { gameEditionId, rulesSourceId, unitId, unitPointCostId } from "../../../ids";',
        "",
        f"/**",
        f" * Unit points costs for the {faction} faction.",
        f" * Generated from Wahapedia unit-datasheet data.",
        f" */",
        "",
    ]
    for record, const_name in zip(valid, const_names, strict=True):
        lines += [
            f"export const {const_name}: UnitPointCostConfig = {{",
            f'  id: unitPointCostId("{record.seed_id_key}"),',
            f"  unit_point_cost_slug: {_ts_string(record.unit_point_cost_slug)},",
            f'  unit_id: unitId("{record.unit_slug}"),',
            f'  game_edition_id: gameEditionId("{record.game_edition_slug}"),',
            f'  rules_source_id: rulesSourceId("{record.rules_source_slug}"),',
            f"  minimum_model_count: {record.model_count},",
            f"  maximum_model_count: {record.model_count},",
            f"  unit_points: {record.points},",
            f"  effective_date: new Date({_ts_string('2024-01-01')}),",
            "  superseded_date: null,",
            "};",
            "",
        ]
    lines += [
        f'export const {_faction_const(faction, "unitPointCosts")}Dataset: SeedDataset<"unit_point_costs"> = {{',
        '  table: "unit_point_costs",',
        "  records: [",
        *[f"    {n}," for n in const_names],
        "  ] satisfies UnitPointCostConfig[],",
        "};",
        "",
    ]
    return "\n".join(lines)


def _render_unit_selection_limits_file(faction: str, records: list[UnitSelectionLimitSeedRecord]) -> str:
    const_names = [_const_name(r.seed_id_key, "SelectionLimit") for r in records]
    lines = [
        'import type { UnitSelectionLimitConfig, SeedDataset } from "../../../../types/_index.types";',
        'import { gameEditionId, unitId, unitSelectionLimitId } from "../../../ids";',
        "",
        f"/**",
        f" * Unit selection limits for the {faction} faction.",
        f" * Generated from Wahapedia unit-datasheet data.",
        f" */",
        "",
    ]
    for record, const_name in zip(records, const_names, strict=True):
        lines += [
            f"export const {const_name}: UnitSelectionLimitConfig = {{",
            f'  id: unitSelectionLimitId("{record.seed_id_key}"),',
            f'  unit_id: unitId("{record.unit_slug}"),',
            f'  game_edition_id: gameEditionId("{record.game_edition_slug}"),',
            f"  min_models: {record.min_models},",
            f"  max_models: {record.max_models},",
            "};",
            "",
        ]
    lines += [
        f'export const {_faction_const(faction, "unitSelectionLimits")}Dataset: SeedDataset<"unit_selection_limits"> = {{',
        '  table: "unit_selection_limits",',
        "  records: [",
        *[f"    {n}," for n in const_names],
        "  ] satisfies UnitSelectionLimitConfig[],",
        "};",
        "",
    ]
    return "\n".join(lines)


def _render_unit_weapons_file(faction: str, records: list[UnitWeaponSeedRecord]) -> str:
    # Skip records with no rules source — rules_source_id is not nullable.
    valid = [r for r in records if r.rules_source_slug]
    const_names = [_const_name(r.seed_id_key, "UnitWeapon") for r in valid]
    lines = [
        'import type { UnitWeaponConfig, SeedDataset } from "../../../../types/_index.types";',
        'import { gameEditionId, modelId, rulesSourceId, unitId, unitWeaponId, weaponProfileId } from "../../../ids";',
        "",
        f"/**",
        f" * Unit weapon assignments for the {faction} faction.",
        f" * Generated from Wahapedia unit-datasheet data.",
        f" */",
        "",
    ]
    for record, const_name in zip(valid, const_names, strict=True):
        model_id = f'modelId("{record.model_slug}")' if record.model_slug else "null"
        lines += [
            f"export const {const_name}: UnitWeaponConfig = {{",
            f'  id: unitWeaponId("{record.seed_id_key}"),',
            f'  unit_id: unitId("{record.unit_slug}"),',
            f"  model_id: {model_id},",
            f'  weapon_profile_id: weaponProfileId("{record.weapon_profile_slug}"),',
            f'  game_edition_id: gameEditionId("{record.game_edition_slug}"),',
            f'  rules_source_id: rulesSourceId("{record.rules_source_slug}"),',
            f"  is_default: {str(record.is_default).lower()},",
            "  effective_date: null,",
            "  superseded_date: null,",
            "};",
            "",
        ]
    lines += [
        f'export const {_faction_const(faction, "unitWeapons")}Dataset: SeedDataset<"unit_weapons"> = {{',
        '  table: "unit_weapons",',
        "  records: [",
        *[f"    {n}," for n in const_names],
        "  ] satisfies UnitWeaponConfig[],",
        "};",
        "",
    ]
    return "\n".join(lines)


def _render_leader_eligibilities_file(faction: str, records: list[LeaderEligibilitySeedRecord]) -> str:
    # Skip records with no rules source — rules_source_id is not nullable.
    valid = [r for r in records if r.rules_source_slug]
    const_names = [_const_name(r.seed_id_key, "LeaderEligibility") for r in valid]
    lines = [
        'import type { LeaderEligibilityConfig, SeedDataset } from "../../../../types/_index.types";',
        'import { gameEditionId, leaderEligibilityId, rulesSourceId, unitId } from "../../../ids";',
        "",
        f"/**",
        f" * Leader eligibility (LED BY) records for the {faction} faction.",
        f" * Generated from Wahapedia unit-datasheet data.",
        f" */",
        "",
    ]
    for record, const_name in zip(valid, const_names, strict=True):
        lines += [
            f"export const {const_name}: LeaderEligibilityConfig = {{",
            f'  id: leaderEligibilityId("{record.seed_id_key}"),',
            f'  leader_unit_id: unitId("{record.leader_unit_slug}"),',
            f'  target_unit_id: unitId("{record.target_unit_slug}"),',
            f'  game_edition_id: gameEditionId("{record.game_edition_slug}"),',
            f'  rules_source_id: rulesSourceId("{record.rules_source_slug}"),',
            "};",
            "",
        ]
    lines += [
        f'export const {_faction_const(faction, "leaderEligibilities")}Dataset: SeedDataset<"leader_eligibilities"> = {{',
        '  table: "leader_eligibilities",',
        "  records: [",
        *[f"    {n}," for n in const_names],
        "  ] satisfies LeaderEligibilityConfig[],",
        "};",
        "",
    ]
    return "\n".join(lines)


def _render_leader_eligibility_keywords_file(faction: str) -> str:
    """Placeholder — keyword-predicate leader eligibility not yet extracted from Wahapedia."""
    lines = [
        'import type { LeaderEligibilityKeywordConfig, SeedDataset } from "../../../../types/_index.types";',
        "",
        f"/**",
        f" * Leader eligibility keyword predicates for the {faction} faction.",
        f" * Not yet extracted — populated manually or in a future importer pass.",
        f" */",
        f'export const {_faction_const(faction, "leaderEligibilityKeywords")}Dataset: SeedDataset<"leader_eligibility_keywords"> = {{',
        '  table: "leader_eligibility_keywords",',
        "  records: [] satisfies LeaderEligibilityKeywordConfig[],",
        "};",
        "",
    ]
    return "\n".join(lines)


def _faction_const(faction: str, suffix: str) -> str:
    """camelCase faction name + suffix, e.g. 'space-marines' + 'unitModels' → 'spaceMarinesUnitModels'."""
    parts = re.split(r"[-_]+", faction)
    camel = parts[0] + "".join(p.capitalize() for p in parts[1:])
    return camel + suffix[0].upper() + suffix[1:]
