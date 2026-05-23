from __future__ import annotations

import re
from typing import Any

from ..common import normalize_slug
from ..data.loaders import (
    canonical_rules_faction_slugs as _canonical_rules_faction_slugs_data,
    canonical_rules_source_slugs as _canonical_rules_source_slugs_data,
    space_marine_chapter_source_names as _space_marine_chapter_source_names_data,
)


def _classify_rules_source_type(book_name: str, kind: str, source_url: str | None) -> str:
    value = normalize_slug(" ".join(part for part in [book_name, kind, source_url or ""] if part))
    if "munitorum_field_manual" in value:
        return "munitorum_field_manual"
    if "balance_dataslate" in value:
        return "balance_dataslate"
    if "legends" in value or "warhammer_legends" in value:
        return "legends"
    if normalize_slug(kind) == "white_dwarf":
        return "white_dwarf"
    if normalize_slug(kind) == "boxset":
        return "boxset"
    if "combat_patrol" in value:
        return "combat_patrol"
    if "faction_pack" in value or normalize_slug(kind) == "faction_pack":
        return "faction_pack"
    if "chapter_approved_tournament_companion" in value:
        return "chapter_approved_tournament_companion"
    if normalize_slug(kind) == "codex_supplement":
        return "codex_supplement"
    if normalize_slug(kind) == "codex":
        return "codex"
    if normalize_slug(kind) in {"expansion", "campaign_book"}:
        return normalize_slug(kind)
    if normalize_slug(kind) == "rulebook":
        return "online"
    return "other"


def _rules_faction_slug_for_source(
    candidate: Any, default_rules_faction_slug: str | None
) -> str | None:
    source_name_slug = normalize_slug(candidate.source_book_name)
    if candidate.rules_source_type in {"faction_pack", "codex_supplement", "legends"}:
        for chapter_slug, chapter_name in _space_marine_chapter_source_names_data().items():
            if source_name_slug == normalize_slug(chapter_name) or source_name_slug.endswith(
                f"_{chapter_slug}"
            ):
                return _canonical_rules_faction_slug(chapter_slug)
    return _canonical_rules_faction_slug(default_rules_faction_slug)


def _canonical_rules_faction_slug(slug: str | None) -> str | None:
    if slug is None:
        return None
    return _canonical_rules_faction_slugs_data().get(slug, slug)


def _rules_source_slug(
    *, source_type: str, book_name: str, edition: str, version_slug: str | None
) -> str:
    edition_part = edition
    name_slug = normalize_slug(book_name)
    if source_type in {"balance_dataslate", "munitorum_field_manual"}:
        base = f"{source_type}_{edition_part}"
    elif name_slug.startswith(source_type):
        base = f"{name_slug}_{edition_part}"
    else:
        base = f"{source_type}_{name_slug}_{edition_part}"
    return f"{base}_{version_slug}" if version_slug else base


def _rules_source_name(*, source_type: str, book_name: str) -> str:
    if source_type == "faction_pack":
        return f"Faction Pack: {book_name}"
    return book_name


def _rules_source_version_slug(version: str | None) -> str | None:
    if not version:
        return None
    version_slug = normalize_slug(version)
    if re.match(r"^\d", version_slug):
        return f"v{version_slug}"
    return version_slug


def _rules_faction_source_semantics(candidate: Any) -> tuple[str, str]:
    if candidate.rules_source_type == "munitorum_field_manual":
        return "points", "global"
    if candidate.rules_source_type == "balance_dataslate":
        return "errata_faq", "global"
    if candidate.rules_source_type == "chapter_approved_tournament_companion":
        return "base_sizes", "global"
    if candidate.rules_source_type == "combat_patrol":
        return "combat_patrol", "exclusive"
    if candidate.rules_source_type in {"faction_pack", "codex_supplement"}:
        return "errata_faq", "exclusive"
    if candidate.rules_source_type in {"expansion", "campaign_book"}:
        return "supplement", "global"
    if candidate.rules_source_type == "codex":
        return "primary", "exclusive"
    return "supplement", "exclusive"
