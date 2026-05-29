from __future__ import annotations

import hashlib
import re
from pathlib import Path

# ---------------------------------------------------------------------------
# Repository root
# ---------------------------------------------------------------------------

# This file lives at scripts/wahapedia_importer/writers/seed_workspace.py,
# which is 3 levels below the repo root.
REPO_ROOT = Path(__file__).resolve().parents[3]

if not (REPO_ROOT / "db").is_dir():
    raise RuntimeError(
        f"REPO_ROOT resolved to {REPO_ROOT!r}, which does not contain a 'db/' directory. "
        "Check that writers/seed_workspace.py is at the correct depth in the repository."
    )

# ---------------------------------------------------------------------------
# Path constants
# ---------------------------------------------------------------------------

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

# unit-datasheets global output paths
SEED_DATA_DIR = REPO_ROOT / "db" / "seed_config" / "seed" / "data"
MODELS_DATA_PATH = SEED_DATA_DIR / "models.data.ts"
WEAPONS_DATA_PATH = SEED_DATA_DIR / "weapons.data.ts"
WEAPON_PROFILES_DATA_PATH = SEED_DATA_DIR / "weapon_profiles.data.ts"
WEAPON_PROFILE_KEYWORDS_DATA_PATH = SEED_DATA_DIR / "weapon_profile_keywords.data.ts"

# unit-datasheets per-faction data lives under data/unit_datasheets/{faction}/
UNIT_DATASHEETS_DATA_DIR = SEED_DATA_DIR / "unit_datasheets"

# ---------------------------------------------------------------------------
# ID allocation helpers
# ---------------------------------------------------------------------------

CROCKFORD_BASE32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
TS_STRING_PATTERN = r'"((?:\\.|[^"\\])*)"'

ABILITY_TYPE_ORDER = {
    "core": 0,
    "faction": 1,
    "datasheet": 2,
    "wargear": 3,
    "other": 4,
}


def _deterministic_ulid(namespace: str, seed: str) -> str:
    digest = hashlib.sha256(f"{namespace}:{seed}".encode("utf-8")).digest()
    value = int.from_bytes(digest, "big")
    chars: list[str] = []
    for _ in range(23):
        chars.append(CROCKFORD_BASE32[value & 31])
        value >>= 5
    return "01K" + "".join(reversed(chars))


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


def _parse_existing_seed_ids_from_paths(root: Path) -> dict[str, str]:
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


def _extract_seed_id_block(text: str, function_name: str) -> str | None:
    pattern = re.compile(
        rf"type [A-Za-z0-9]+ =.*?export const {function_name} = "
        r"\([^)]*\): string => \{\n\s*return .*?\n\};",
        flags=re.DOTALL,
    )
    match = pattern.search(text)
    return match.group(0) if match else None


def _append_text_block(text: str, block: str) -> str:
    if not text.strip():
        return block
    return f"{text.rstrip()}\n\n{block}"


def _extract_seed_id_keys(text: str, type_name: str) -> list[str]:
    pattern = re.compile(
        rf"type {type_name} =(?P<body>.*?);\n\nconst ",
        flags=re.DOTALL,
    )
    match = pattern.search(text)
    if not match:
        return []
    return re.findall(r'"([^"]+)"', match.group("body"))


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
