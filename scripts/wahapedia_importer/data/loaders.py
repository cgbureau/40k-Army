from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Any

import yaml

_DATA_DIR = Path(__file__).resolve().parent


def _load_yaml(filename: str) -> dict[str, Any]:
    path = _DATA_DIR / filename
    return yaml.safe_load(path.read_text(encoding="utf-8")) or {}


@lru_cache(maxsize=None)
def load_rules_factions() -> dict[str, Any]:
    """Return the parsed rules_factions.yaml data."""
    return _load_yaml("rules_factions.yaml")


@lru_cache(maxsize=None)
def load_rules_sources() -> dict[str, Any]:
    """Return the parsed rules_sources.yaml data."""
    return _load_yaml("rules_sources.yaml")


# ---------------------------------------------------------------------------
# Typed accessors used by normalize_seed.py
# ---------------------------------------------------------------------------

def ten_e_codex_factions() -> dict[str, str]:
    return dict(load_rules_factions()["ten_e_codex_factions"])


def space_marine_codex_supplements() -> dict[str, str]:
    return dict(load_rules_factions()["space_marine_codex_supplements"])


def space_marine_chapter_source_names() -> dict[str, str]:
    return dict(load_rules_factions()["space_marine_chapter_source_names"])


def canonical_rules_faction_slugs() -> dict[str, str]:
    return dict(load_rules_factions()["canonical_rules_faction_slugs"])


def canonical_rules_source_slugs() -> dict[str, str]:
    return dict(load_rules_sources()["canonical_rules_source_slugs"])


def ability_types() -> set[str]:
    return set(load_rules_sources()["ability_types"])


def rule_keyword_slugs() -> set[str]:
    return set(load_rules_sources()["rule_keyword_slugs"])


def faction_keyword_slugs() -> set[str]:
    return set(load_rules_sources()["faction_keyword_slugs"])


def excluded_ability_slugs() -> set[str]:
    return set(load_rules_sources()["excluded_ability_slugs"])


def canonical_ability_aliases() -> dict[str, str]:
    return dict(load_rules_sources()["canonical_ability_aliases"])


def source_type_order_map() -> dict[str, int]:
    """Return source type sort order from rules_sources.yaml.

    Lower values sort first. Types absent from the map get order 98.
    """
    raw: dict[str, int] = load_rules_sources().get("source_type_order") or {}
    return dict(raw)
