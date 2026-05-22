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
RULES_SOURCES_IDS_PATH = (
    REPO_ROOT
    / "db"
    / "seed_config"
    / "seed"
    / "ids"
    / "rules_sources"
    / "10e"
    / "generated.rules_sources.ids.ts"
)
RULES_SOURCES_INDEX_IDS_PATH = (
    REPO_ROOT
    / "db"
    / "seed_config"
    / "seed"
    / "ids"
    / "rules_sources"
    / "10e"
    / "_index.rules_sources.ids.ts"
)
RULES_FACTION_SOURCE_IDS_PATH = (
    REPO_ROOT / "db" / "seed_config" / "seed" / "ids" / "factions" / "factions.ids.ts"
)
RULES_SOURCES_DATA_DIR = (
    REPO_ROOT / "db" / "seed_config" / "seed" / "data" / "rules_sources" / "10e"
)
RULES_SOURCES_DATA_PATH = RULES_SOURCES_DATA_DIR / "generated.rules_sources.data.ts"
RULES_SOURCES_INDEX_DATA_PATH = RULES_SOURCES_DATA_DIR / "_index.rules_sources.data.ts"
RULES_FACTION_SOURCES_DATA_DIR = (
    REPO_ROOT / "db" / "seed_config" / "seed" / "data" / "rules_faction_sources" / "10e"
)
RULES_FACTION_SOURCES_DATA_PATH = (
    RULES_FACTION_SOURCES_DATA_DIR / "generated.rules_faction_sources.data.ts"
)
RULES_FACTION_SOURCES_INDEX_DATA_PATH = (
    RULES_FACTION_SOURCES_DATA_DIR / "_index.rules_faction_sources.data.ts"
)
GENERATED_GAME_DATA_IDS_PATH = (
    REPO_ROOT / "db" / "seed_config" / "seed" / "ids" / "generated_game_data.ids.ts"
)
SEED_IDS_INDEX_PATH = REPO_ROOT / "db" / "seed_config" / "seed" / "ids.ts"
DETACHMENTS_DATA_PATH = REPO_ROOT / "db" / "seed_config" / "seed" / "data" / "detachments.data.ts"
RULES_FACTION_DETACHMENTS_DATA_PATH = (
    REPO_ROOT / "db" / "seed_config" / "seed" / "data" / "rules_faction_detachments.data.ts"
)
UNITS_DATA_PATH = REPO_ROOT / "db" / "seed_config" / "seed" / "data" / "units.data.ts"
RULES_FACTION_UNITS_DATA_PATH = (
    REPO_ROOT / "db" / "seed_config" / "seed" / "data" / "rules_faction_units.data.ts"
)
KIT_UNITS_DATA_PATH = REPO_ROOT / "db" / "seed_config" / "seed" / "data" / "kit_units.data.ts"
KIT_UNIT_PRICE_ALLOCATIONS_DATA_PATH = (
    REPO_ROOT
    / "db"
    / "seed_config"
    / "seed"
    / "data"
    / "kit_unit_price_allocations.data.ts"
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
    allocation_ratio: str
    reference_price: str | None
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
        "rulesSource",
    )
    existing_rules_faction_source_ids = _parse_existing_seed_ids_from_paths(
        REPO_ROOT / "db" / "seed_config" / "seed" / "ids" / "factions",
        "rulesFactionSource",
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
        "generatedGameData",
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
        "generatedGameData",
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
                allocation_ratio=str(item["allocation_ratio"]),
                reference_price=(
                    None if item.get("reference_price") is None else str(item["reference_price"])
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
        "generatedGameData",
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
                rules_source_version=_extract_nullable_ts_field(block, "rules_source_version"),
                rules_source_version_slug=_extract_nullable_ts_field(
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


def _parse_existing_seed_ids_from_paths(root: Path, namespace: str) -> dict[str, str]:
    ids: dict[str, str] = {}
    if not root.exists():
        return ids
    for path in sorted(root.rglob("*.ts")):
        for key, value in re.findall(
            r"([a-zA-Z0-9_]+(?:__[a-zA-Z0-9_]+)*):\s*\"([0-9A-HJKMNP-TV-Z]{26})\"",
            path.read_text(encoding="utf-8"),
        ):
            ids.setdefault(key, value)
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


def _replace_or_append_seed_id_block(
    text: str, block: str, type_name: str, function_name: str
) -> str:
    pattern = re.compile(
        rf"type {type_name} =.*?export const {function_name} = "
        rf"\([^)]*\): string => \{{\n\s*return .*?\n\}};",
        flags=re.DOTALL,
    )
    if pattern.search(text):
        return pattern.sub(block, text)
    return _append_text_block(text, block)


def _extract_seed_id_block(text: str, function_name: str) -> str | None:
    pattern = re.compile(
        rf"type [A-Za-z0-9]+ =.*?export const {function_name} = "
        r"\([^)]*\): string => \{\n\s*return .*?\n\};",
        flags=re.DOTALL,
    )
    match = pattern.search(text)
    return match.group(0) if match else None


def _extract_seed_id_keys(text: str, type_name: str) -> list[str]:
    pattern = re.compile(
        rf"type {type_name} =(?P<body>.*?);\n\nconst ",
        flags=re.DOTALL,
    )
    match = pattern.search(text)
    if not match:
        return []
    return re.findall(r'"([^"]+)"', match.group("body"))


def _append_text_block(text: str, block: str) -> str:
    if not text.strip():
        return block
    return f"{text.rstrip()}\n\n{block}"


def _render_seed_id_block(
    *,
    type_name: str,
    const_name: str,
    function_name: str,
    namespace: str,
    keys: list[str],
    existing_ids: dict[str, str],
) -> str:
    if keys:
        type_block = f"type {type_name} =\n" + "\n".join(f'  | "{key}"' for key in keys) + ";"
    else:
        type_block = f"type {type_name} = never;"
    id_lines = "\n".join(
        f'  "{key}": "{existing_ids.get(key, _deterministic_ulid(namespace, key))}",'
        for key in keys
    )
    return "\n".join(
        [
            type_block,
            "",
            f"const {const_name}: Record<{type_name}, string> = {{",
            id_lines,
            "};",
            "",
            f"export const {function_name} = (slug: {type_name}): string => {{",
            f"  return {const_name}[slug];",
            "};",
        ]
    )


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
                f"  allocation_ratio: {_ts_string(record.allocation_ratio)},",
                f"  reference_price: {_nullable_ts_string(record.reference_price)},",
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
    name = "".join(part.capitalize() for part in re.split(r"_+", slug)) + suffix
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


def _extract_nullable_ts_field(block: str, field_name: str) -> str | None:
    return _extract_ts_field(block, field_name)


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
    order = {
        "codex": 0,
        "codex_supplement": 1,
        "faction_pack": 2,
        "combat_patrol": 3,
        "munitorum_field_manual": 4,
        "balance_dataslate": 5,
        "chapter_approved_tournament_companion": 6,
        "legends": 7,
        "white_dwarf": 8,
        "boxset": 9,
        "expansion": 10,
        "campaign_book": 11,
        "other": 99,
    }
    return order.get(source_type, 98)


def _deterministic_ulid(namespace: str, seed: str) -> str:
    digest = hashlib.sha256(f"{namespace}:{seed}".encode("utf-8")).digest()
    value = int.from_bytes(digest, "big")
    chars: list[str] = []
    for _ in range(23):
        chars.append(CROCKFORD_BASE32[value & 31])
        value >>= 5
    return "01K" + "".join(reversed(chars))
