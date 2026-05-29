from __future__ import annotations

import json
import re
from dataclasses import dataclass
from html import unescape
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from .common import (
    display_name_from_slug,
    generated_output_path,
    html_to_text,
    import_paths,
    manifest_payload,
    now_iso,
    normalize_slug,
    read_json,
    write_json,
)
from .data.loaders import (
    ability_types as _load_ability_types,
    canonical_ability_aliases as _load_canonical_ability_aliases,
    canonical_rules_faction_slugs as _load_canonical_rules_faction_slugs,
    canonical_rules_source_slugs as _load_canonical_rules_source_slugs,
    excluded_ability_slugs as _load_excluded_ability_slugs,
    faction_keyword_slugs as _load_faction_keyword_slugs,
    rule_keyword_slugs as _load_rule_keyword_slugs,
    space_marine_chapter_source_names as _load_space_marine_chapter_source_names,
    space_marine_codex_supplements as _load_space_marine_codex_supplements,
    ten_e_codex_factions as _load_ten_e_codex_factions,
)
from .parsers.datasheet import (
    parse_composition,
    parse_led_by,
    parse_model_profiles,
    parse_unit_name,
    parse_weapons,
)
from .normalizers.rules_sources import (
    _canonical_rules_faction_slug,
    _classify_rules_source_type,
    _rules_faction_slug_for_source,
    _rules_faction_source_semantics,
    _rules_source_name,
    _rules_source_slug,
    _rules_source_version_slug,
)

ABILITY_TYPES: set[str] = _load_ability_types()
RULE_KEYWORD_SLUGS: set[str] = _load_rule_keyword_slugs()
FACTION_KEYWORD_SLUGS: set[str] = _load_faction_keyword_slugs()
EXCLUDED_ABILITY_SLUGS: set[str] = _load_excluded_ability_slugs()
CANONICAL_ABILITY_ALIASES: dict[str, str] = _load_canonical_ability_aliases()
TEN_E_CODEX_FACTIONS: dict[str, str] = _load_ten_e_codex_factions()
SPACE_MARINE_CODEX_SUPPLEMENTS: dict[str, str] = _load_space_marine_codex_supplements()
SPACE_MARINE_CHAPTER_SOURCE_NAMES: dict[str, str] = _load_space_marine_chapter_source_names()
CANONICAL_RULES_FACTION_SLUGS: dict[str, str] = _load_canonical_rules_faction_slugs()
CANONICAL_RULES_SOURCE_SLUGS: dict[str, str] = _load_canonical_rules_source_slugs()


@dataclass(frozen=True)
class AbilityCandidate:
    seed_id_key: str
    ability_slug: str
    ability_name: str
    ability_type: str
    aliases: list[str]
    source_names: list[str]
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class UnitAbilityCandidate:
    unit_slug: str
    ability_slug: str
    source_ability_name: str
    game_edition_slug: str
    rules_source_slug: str | None
    rules_text: str
    effective_date: str | None
    superseded_date: str | None
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class KeywordCandidate:
    seed_id_key: str
    keyword_slug: str
    keyword_name: str
    keyword_type: str
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class RulesSourceCandidate:
    seed_id_key: str
    rules_source_slug: str
    rules_source_name: str
    rules_source_type: str
    rules_source_version: str | None
    rules_source_version_slug: str | None
    release_date: str | None
    superseded_date: str | None
    game_edition_slug: str
    source_url: str | None
    source_book_name: str
    source_kind: str
    source_origin: str
    last_update_label: str | None
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class RulesFactionSourceCandidate:
    seed_id_key: str
    rules_faction_slug: str
    rules_source_slug: str
    source_relationship: str
    source_scope: str
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class DetachmentCandidate:
    seed_id_key: str
    detachment_slug: str
    detachment_name: str
    rules_source_slug: str
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class RulesFactionDetachmentCandidate:
    seed_id_key: str
    rules_faction_slug: str
    detachment_slug: str
    detachment_access_type: str | None
    effective_date: str | None
    superseded_date: str | None
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class UnitCandidate:
    seed_id_key: str
    unit_slug: str
    unit_name: str
    wahapedia_url: str
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class RulesFactionUnitCandidate:
    seed_id_key: str
    rules_faction_unit_slug: str
    rules_faction_slug: str
    unit_slug: str
    unit_access_type: str | None
    rules_source_slug: str
    effective_date: str | None
    superseded_date: str | None
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class KitUnitCandidate:
    seed_id_key: str
    kit_unit_slug: str
    kit_slug: str
    unit_slug: str
    unit_count: int
    model_count: int
    component_type: str
    effective_date: str | None
    superseded_date: str | None
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class KitUnitPriceAllocationCandidate:
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
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class ModelCandidate:
    seed_id_key: str
    model_slug: str
    model_name: str
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class UnitModelCandidate:
    seed_id_key: str
    unit_slug: str
    model_slug: str
    min_count: int
    max_count: int
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class UnitProfileCandidate:
    seed_id_key: str
    unit_profile_slug: str
    unit_profile_name: str
    unit_slug: str
    model_slug: str | None
    game_edition_slug: str
    rules_source_slug: str | None
    stats: dict[str, str]
    effective_date: str | None
    superseded_date: str | None
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class UnitPointCostCandidate:
    seed_id_key: str
    unit_point_cost_slug: str
    unit_slug: str
    game_edition_slug: str
    rules_source_slug: str | None
    model_count: int
    points: int
    effective_date: str | None
    superseded_date: str | None
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class UnitSelectionLimitCandidate:
    seed_id_key: str
    unit_slug: str
    game_edition_slug: str
    min_models: int
    max_models: int
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class WeaponCandidate:
    seed_id_key: str
    weapon_slug: str
    weapon_name: str
    weapon_type: str
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class WeaponProfileCandidate:
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
    keywords: list[dict[str, str | None]]
    effective_date: str | None
    superseded_date: str | None
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class UnitWeaponCandidate:
    seed_id_key: str
    unit_slug: str
    model_slug: str | None
    weapon_profile_slug: str
    game_edition_slug: str
    rules_source_slug: str | None
    is_default: bool
    effective_date: str | None
    superseded_date: str | None
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class LeaderEligibilityCandidate:
    seed_id_key: str
    leader_unit_slug: str
    target_unit_slug: str
    game_edition_slug: str
    rules_source_slug: str | None
    is_legends: bool
    created_at: str
    updated_at: str | None


def normalize_wahapedia_manifest(
    *,
    manifest: str,
    kind: str,
    output: str | None = None,
    work_root: str | None = None,
    emit_seed_ts: bool = False,
    include_unit_abilities: bool = False,
    command: str = "",
) -> Path:
    manifest_path = Path(manifest).expanduser()
    manifest_data = read_json(manifest_path)
    paths = import_paths(work_root)

    if kind not in {
        "abilities",
        "keywords",
        "rules-sources",
        "faction-data",
        "kit-units",
        "kit-unit-price-allocations",
        "unit-datasheets",
    }:
        raise ValueError(f"Unsupported normalize kind: {kind}")

    abilities: list[AbilityCandidate] = []
    unit_abilities: list[UnitAbilityCandidate] = []
    keywords: list[KeywordCandidate] = []
    rules_sources: list[RulesSourceCandidate] = []
    rules_faction_sources: list[RulesFactionSourceCandidate] = []
    detachments: list[DetachmentCandidate] = []
    rules_faction_detachments: list[RulesFactionDetachmentCandidate] = []
    units: list[UnitCandidate] = []
    rules_faction_units: list[RulesFactionUnitCandidate] = []
    kit_units: list[KitUnitCandidate] = []
    kit_unit_price_allocations: list[KitUnitPriceAllocationCandidate] = []
    models: list[ModelCandidate] = []
    unit_models: list[UnitModelCandidate] = []
    unit_profiles: list[UnitProfileCandidate] = []
    unit_point_costs: list[UnitPointCostCandidate] = []
    unit_selection_limits: list[UnitSelectionLimitCandidate] = []
    weapons: list[WeaponCandidate] = []
    weapon_profiles: list[WeaponProfileCandidate] = []
    unit_weapons: list[UnitWeaponCandidate] = []
    leader_eligibilities: list[LeaderEligibilityCandidate] = []
    if kind == "abilities":
        abilities, unit_abilities = _extract_abilities(
            manifest_data, include_unit_abilities=include_unit_abilities
        )
    if kind == "keywords":
        keywords = _extract_keywords(manifest_data)
    if kind == "rules-sources":
        rules_sources, rules_faction_sources = _extract_rules_sources(manifest_data)
    if kind == "faction-data":
        (
            detachments,
            rules_faction_detachments,
            units,
            rules_faction_units,
        ) = _extract_faction_data(manifest_data)
    if kind == "kit-units":
        kit_units = _extract_kit_units(manifest_data)
    if kind == "kit-unit-price-allocations":
        kit_unit_price_allocations = _extract_kit_unit_price_allocations(manifest_data)
    if kind == "unit-datasheets":
        (
            models,
            unit_models,
            unit_profiles,
            unit_point_costs,
            unit_selection_limits,
            weapons,
            weapon_profiles,
            unit_weapons,
            leader_eligibilities,
        ) = _extract_unit_datasheets(manifest_data)
    output_path = (
        Path(output).expanduser()
        if output
        else generated_output_path(
            paths.output_root,
            stage="normalized",
            kind=kind,
            edition=manifest_data["edition"],
            faction=manifest_data.get("faction"),
        )
    )
    payload = manifest_payload(
        command=command,
        stage="normalize",
        kind=kind,
        source_manifest=str(manifest_path),
        edition=manifest_data["edition"],
        faction=manifest_data.get("faction"),
        records={
            "abilities": [candidate.__dict__ for candidate in abilities],
            "keywords": [candidate.__dict__ for candidate in keywords],
            "rules_sources": [candidate.__dict__ for candidate in rules_sources],
            "rules_faction_sources": [
                candidate.__dict__ for candidate in rules_faction_sources
            ],
            "unit_abilities": [candidate.__dict__ for candidate in unit_abilities],
            "detachments": [candidate.__dict__ for candidate in detachments],
            "rules_faction_detachments": [
                candidate.__dict__ for candidate in rules_faction_detachments
            ],
            "units": [candidate.__dict__ for candidate in units],
            "rules_faction_units": [candidate.__dict__ for candidate in rules_faction_units],
            "kit_units": [candidate.__dict__ for candidate in kit_units],
            "kit_unit_price_allocations": [
                candidate.__dict__ for candidate in kit_unit_price_allocations
            ],
            "models": [candidate.__dict__ for candidate in models],
            "unit_models": [candidate.__dict__ for candidate in unit_models],
            "unit_profiles": [candidate.__dict__ for candidate in unit_profiles],
            "unit_point_costs": [candidate.__dict__ for candidate in unit_point_costs],
            "unit_selection_limits": [candidate.__dict__ for candidate in unit_selection_limits],
            "weapons": [candidate.__dict__ for candidate in weapons],
            "weapon_profiles": [candidate.__dict__ for candidate in weapon_profiles],
            "unit_weapons": [candidate.__dict__ for candidate in unit_weapons],
            "leader_eligibilities": [candidate.__dict__ for candidate in leader_eligibilities],
        },
        metadata={
            "curated_input_required": kind
            in {"kit-units", "kit-unit-price-allocations"},
            "notes": _normalization_notes(
                kind=kind,
                kit_units=kit_units,
                kit_unit_price_allocations=kit_unit_price_allocations,
            ),
        },
    )
    write_json(output_path, payload)

    if emit_seed_ts and kind == "abilities":
        seed_output = output_path.with_suffix(".seed-snippets.ts")
        seed_output.write_text(_ability_seed_snippets(abilities), encoding="utf-8")
    if emit_seed_ts and kind == "keywords":
        seed_output = output_path.with_suffix(".seed-snippets.ts")
        seed_output.write_text(_keyword_seed_snippets(keywords), encoding="utf-8")

    return output_path


def _extract_unit_datasheets(
    manifest_data: dict[str, Any],
) -> tuple[
    list[ModelCandidate],
    list[UnitModelCandidate],
    list[UnitProfileCandidate],
    list[UnitPointCostCandidate],
    list[UnitSelectionLimitCandidate],
    list[WeaponCandidate],
    list[WeaponProfileCandidate],
    list[UnitWeaponCandidate],
    list[LeaderEligibilityCandidate],
]:
    """Extract all unit-datasheet data from cached unit pages in the manifest.

    One HTTP page → many output records across nine target tables. The manifest
    must have been produced by a collect run with kind=units or kind=unit-abilities
    so that unit-datasheet pages are present.
    """
    created_at = now_iso()
    edition = manifest_data["edition"]
    edition_slug = _edition_slug_from_number(edition)
    faction_slug = (
        normalize_slug(manifest_data["faction"]).replace("_", "-")
        if manifest_data.get("faction")
        else None
    )

    models_by_slug: dict[str, ModelCandidate] = {}
    unit_models_by_key: dict[str, UnitModelCandidate] = {}
    unit_profiles_by_slug: dict[str, UnitProfileCandidate] = {}
    unit_point_costs_by_slug: dict[str, UnitPointCostCandidate] = {}
    unit_selection_limits_by_key: dict[str, UnitSelectionLimitCandidate] = {}
    weapons_by_slug: dict[str, WeaponCandidate] = {}
    weapon_profiles_by_slug: dict[str, WeaponProfileCandidate] = {}
    unit_weapons_by_key: dict[str, UnitWeaponCandidate] = {}
    leader_eligibilities_by_key: dict[str, LeaderEligibilityCandidate] = {}

    for page in manifest_data.get("pages", []):
        if page.get("page_kind") != "unit-datasheet":
            continue
        html = Path(page["cache_path"]).read_text(encoding="utf-8")
        url = page["url"]

        raw_unit_name = parse_unit_name(html) or _display_name_from_url(url)
        unit_slug = normalize_slug(raw_unit_name)
        rules_source_slug = _parse_datasheet_rules_source_slug(
            html=html,
            edition=edition,
            fallback_faction_slug=faction_slug or unit_slug,
        )

        # --- composition, selection limits, point costs ---
        comp = parse_composition(html)
        configs = comp["configs"]
        equipment = comp["equipment"]  # {model_name: [weapon_name, ...]}
        point_costs = comp["point_costs"]

        # Build per-model min/max counts across configurations
        # e.g. configs=[{Runtherd:1, Gretchin:10}, {Runtherd:2, Gretchin:20}]
        # → Runtherd: min=1 max=2, Gretchin: min=10 max=20
        model_min_max: dict[str, tuple[int, int]] = {}
        for cfg in configs:
            for model_name, count in cfg["model_counts"].items():
                slug = normalize_slug(model_name)
                prev_min, prev_max = model_min_max.get(slug, (count, count))
                model_min_max[slug] = (min(prev_min, count), max(prev_max, count))

        for model_name, (mn, mx) in model_min_max.items():
            model_slug = normalize_slug(model_name)
            models_by_slug.setdefault(
                model_slug,
                ModelCandidate(
                    seed_id_key=model_slug,
                    model_slug=model_slug,
                    model_name=model_name,
                    created_at=created_at,
                    updated_at=None,
                ),
            )
            um_key = f"{unit_slug}__{model_slug}"
            unit_models_by_key.setdefault(
                um_key,
                UnitModelCandidate(
                    seed_id_key=um_key,
                    unit_slug=unit_slug,
                    model_slug=model_slug,
                    min_count=mn,
                    max_count=mx,
                    created_at=created_at,
                    updated_at=None,
                ),
            )

        if configs:
            all_counts = [cfg["total_models"] for cfg in configs]
            limit_key = f"{unit_slug}__{edition_slug}"
            unit_selection_limits_by_key.setdefault(
                limit_key,
                UnitSelectionLimitCandidate(
                    seed_id_key=limit_key,
                    unit_slug=unit_slug,
                    game_edition_slug=edition_slug,
                    min_models=min(all_counts),
                    max_models=max(all_counts),
                    created_at=created_at,
                    updated_at=None,
                ),
            )

        for cost in point_costs:
            cost_slug = f"{unit_slug}__{edition_slug}__{cost['model_count']}m"
            unit_point_costs_by_slug.setdefault(
                cost_slug,
                UnitPointCostCandidate(
                    seed_id_key=cost_slug,
                    unit_point_cost_slug=cost_slug,
                    unit_slug=unit_slug,
                    game_edition_slug=edition_slug,
                    rules_source_slug=rules_source_slug,
                    model_count=cost["model_count"],
                    points=cost["points"],
                    effective_date=None,
                    superseded_date=None,
                    created_at=created_at,
                    updated_at=None,
                ),
            )

        # --- unit profiles (stat blocks) ---
        profiles = parse_model_profiles(html)
        for profile in profiles:
            model_name = profile["model_name"].title()
            model_slug = normalize_slug(model_name)
            profile_slug = f"{unit_slug}__{model_slug}__{edition_slug}"
            unit_profiles_by_slug.setdefault(
                profile_slug,
                UnitProfileCandidate(
                    seed_id_key=profile_slug,
                    unit_profile_slug=profile_slug,
                    unit_profile_name=f"{raw_unit_name} — {model_name}",
                    unit_slug=unit_slug,
                    model_slug=model_slug if len(profiles) > 1 else None,
                    game_edition_slug=edition_slug,
                    rules_source_slug=rules_source_slug,
                    stats=profile["stats"],
                    effective_date=None,
                    superseded_date=None,
                    created_at=created_at,
                    updated_at=None,
                ),
            )

        # --- weapons ---
        parsed_weapons = parse_weapons(html)
        for w in parsed_weapons:
            weapon_slug = normalize_slug(w["weapon_name"])
            weapon_profile_slug = f"{weapon_slug}__{edition_slug}"
            if rules_source_slug:
                weapon_profile_slug = f"{weapon_slug}__{edition_slug}__{normalize_slug(rules_source_slug)}"

            weapons_by_slug.setdefault(
                weapon_slug,
                WeaponCandidate(
                    seed_id_key=weapon_slug,
                    weapon_slug=weapon_slug,
                    weapon_name=w["weapon_name"],
                    weapon_type=w["weapon_type"],
                    created_at=created_at,
                    updated_at=None,
                ),
            )
            weapon_profiles_by_slug.setdefault(
                weapon_profile_slug,
                WeaponProfileCandidate(
                    seed_id_key=weapon_profile_slug,
                    weapon_profile_slug=weapon_profile_slug,
                    weapon_slug=weapon_slug,
                    game_edition_slug=edition_slug,
                    rules_source_slug=rules_source_slug,
                    range=w["range"],
                    attacks=w["attacks"],
                    skill=w["skill"],
                    strength=w["strength"],
                    armor_penetration=w["armor_penetration"],
                    damage=w["damage"],
                    keywords=w["keywords"],
                    effective_date=None,
                    superseded_date=None,
                    created_at=created_at,
                    updated_at=None,
                ),
            )

            # Match weapon to model via equipment assignment dict
            assigned_model_slug: str | None = None
            for model_name_raw, weapon_names in equipment.items():
                if any(normalize_slug(wn) == weapon_slug for wn in weapon_names):
                    assigned_model_slug = normalize_slug(model_name_raw)
                    break

            uw_key = f"{unit_slug}__{assigned_model_slug or 'all'}__{weapon_profile_slug}"
            unit_weapons_by_key.setdefault(
                uw_key,
                UnitWeaponCandidate(
                    seed_id_key=uw_key,
                    unit_slug=unit_slug,
                    model_slug=assigned_model_slug,
                    weapon_profile_slug=weapon_profile_slug,
                    game_edition_slug=edition_slug,
                    rules_source_slug=rules_source_slug,
                    is_default=True,
                    effective_date=None,
                    superseded_date=None,
                    created_at=created_at,
                    updated_at=None,
                ),
            )

        # --- leader eligibility (LED BY) ---
        for leader in parse_led_by(html):
            leader_slug = normalize_slug(leader["leader_unit_name"])
            le_key = f"{leader_slug}__{unit_slug}"
            leader_eligibilities_by_key.setdefault(
                le_key,
                LeaderEligibilityCandidate(
                    seed_id_key=le_key,
                    leader_unit_slug=leader_slug,
                    target_unit_slug=unit_slug,
                    game_edition_slug=edition_slug,
                    rules_source_slug=rules_source_slug,
                    is_legends=leader["is_legends"],
                    created_at=created_at,
                    updated_at=None,
                ),
            )

    def _sort(d: dict) -> list:
        return sorted(d.values(), key=lambda c: c.seed_id_key)

    return (
        _sort(models_by_slug),
        _sort(unit_models_by_key),
        _sort(unit_profiles_by_slug),
        _sort(unit_point_costs_by_slug),
        _sort(unit_selection_limits_by_key),
        _sort(weapons_by_slug),
        _sort(weapon_profiles_by_slug),
        _sort(unit_weapons_by_key),
        _sort(leader_eligibilities_by_key),
    )


def _display_name_from_url(url: str) -> str:
    tail = url.rstrip("/").split("/")[-1]
    return tail.replace("-", " ").title()


def _extract_kit_units(manifest_data: dict[str, Any]) -> list[KitUnitCandidate]:
    records = _curated_records(manifest_data, "kit_units")
    created_at = now_iso()
    candidates: list[KitUnitCandidate] = []
    for item in records:
        kit_slug = _required_slug(item, "kit_slug")
        unit_slug = _required_slug(item, "unit_slug")
        kit_unit_slug = _optional_slug(item, "kit_unit_slug") or f"{kit_slug}__{unit_slug}"
        component_type = normalize_slug(str(item.get("component_type") or "complete_unit"))
        candidates.append(
            KitUnitCandidate(
                seed_id_key=item.get("seed_id_key") or f"{kit_slug}__{unit_slug}__{component_type}",
                kit_unit_slug=kit_unit_slug,
                kit_slug=kit_slug,
                unit_slug=unit_slug,
                unit_count=_required_int(item, "unit_count"),
                model_count=_required_int(item, "model_count"),
                component_type=component_type,
                effective_date=item.get("effective_date"),
                superseded_date=item.get("superseded_date"),
                created_at=item.get("created_at") or created_at,
                updated_at=item.get("updated_at"),
            )
        )
    return sorted(candidates, key=lambda item: item.seed_id_key)


def _extract_kit_unit_price_allocations(
    manifest_data: dict[str, Any],
) -> list[KitUnitPriceAllocationCandidate]:
    records = _curated_records(manifest_data, "kit_unit_price_allocations")
    created_at = now_iso()
    candidates: list[KitUnitPriceAllocationCandidate] = []
    for item in records:
        kit_slug = _required_slug(item, "kit_slug")
        unit_slug = _required_slug(item, "unit_slug")
        allocation_basis = normalize_slug(str(item.get("allocation_basis") or "manual"))
        reference_currency = item.get("reference_currency")
        slug_parts = [
            kit_slug,
            unit_slug,
            allocation_basis,
            normalize_slug(str(reference_currency)) if reference_currency else None,
        ]
        allocation_slug = _optional_slug(item, "kit_unit_price_allocation_slug") or "__".join(
            part for part in slug_parts if part
        )
        candidates.append(
            KitUnitPriceAllocationCandidate(
                seed_id_key=item.get("seed_id_key") or allocation_slug,
                kit_unit_price_allocation_slug=allocation_slug,
                kit_slug=kit_slug,
                unit_slug=unit_slug,
                allocation_ratio=float(item["allocation_ratio"]),
                reference_price=(
                    None if item.get("reference_price") is None else float(item["reference_price"])
                ),
                reference_currency=(
                    None if reference_currency is None else str(reference_currency).strip().lower()
                ),
                allocation_basis=allocation_basis,
                effective_date=item.get("effective_date"),
                superseded_date=item.get("superseded_date"),
                created_at=item.get("created_at") or created_at,
                updated_at=item.get("updated_at"),
            )
        )
    return sorted(candidates, key=lambda item: item.seed_id_key)


def _curated_records(manifest_data: dict[str, Any], record_key: str) -> list[dict[str, Any]]:
    records = manifest_data.get(record_key)
    if records is None and isinstance(manifest_data.get("records"), dict):
        records = manifest_data["records"].get(record_key)
    if records is None:
        return []
    if not isinstance(records, list):
        raise ValueError(f"Curated input field {record_key} must be a list")
    return records


def _normalization_notes(
    *,
    kind: str,
    kit_units: list[KitUnitCandidate],
    kit_unit_price_allocations: list[KitUnitPriceAllocationCandidate],
) -> list[str]:
    if kind == "kit-units" and not kit_units:
        return [
            "No curated records were supplied; Wahapedia datasheets are not used to infer purchasable kit-to-unit mappings."
        ]
    if kind == "kit-unit-price-allocations" and not kit_unit_price_allocations:
        return [
            "No curated records were supplied; Wahapedia data is not used to infer kit prices, SKUs, product URLs, bundles, or price allocation."
        ]
    return []


def _required_slug(item: dict[str, Any], key: str) -> str:
    value = _optional_slug(item, key)
    if not value:
        raise ValueError(f"Curated record is missing required slug field {key}")
    return value


def _optional_slug(item: dict[str, Any], key: str) -> str | None:
    value = item.get(key)
    if value is None:
        return None
    return normalize_slug(str(value))


def _optional_int(item: dict[str, Any], key: str) -> int | None:
    value = item.get(key)
    if value is None:
        return None
    return int(value)


def _required_int(item: dict[str, Any], key: str) -> int:
    value = _optional_int(item, key)
    if value is None:
        raise ValueError(f"Curated record is missing required integer field {key}")
    return value


def _extract_abilities(
    manifest_data: dict[str, Any], *, include_unit_abilities: bool
) -> tuple[list[AbilityCandidate], list[UnitAbilityCandidate]]:
    ability_by_slug: dict[str, AbilityCandidate] = {}
    ability_aliases: dict[str, set[str]] = {}
    ability_source_names: dict[str, set[str]] = {}
    unit_abilities: list[UnitAbilityCandidate] = []
    edition = manifest_data["edition"]
    created_at = now_iso()

    for page in manifest_data.get("pages", []):
        if page.get("page_kind") != "unit-datasheet":
            continue
        html = Path(page["cache_path"]).read_text(encoding="utf-8")
        text = html_to_text(html)
        unit_slug = _unit_slug_from_url(page["url"])
        for parsed in _parse_datasheet_abilities(text):
            source_ability_name = parsed["ability_name"]
            raw_slug = normalize_slug(source_ability_name)
            ability_slug = _canonical_ability_slug(raw_slug)
            if not _is_seedable_slug(ability_slug) or ability_slug in EXCLUDED_ABILITY_SLUGS:
                continue
            ability_aliases.setdefault(ability_slug, set())
            ability_source_names.setdefault(ability_slug, set()).add(source_ability_name)
            if raw_slug != ability_slug:
                ability_aliases[ability_slug].add(raw_slug)
            if ability_slug not in ability_by_slug:
                ability_by_slug[ability_slug] = AbilityCandidate(
                    seed_id_key=ability_slug,
                    ability_slug=ability_slug,
                    ability_name=_canonical_ability_name(source_ability_name, ability_slug),
                    ability_type=parsed["ability_type"],
                    aliases=[],
                    source_names=[],
                    created_at=created_at,
                    updated_at=None,
                )
            if include_unit_abilities:
                unit_abilities.append(
                    UnitAbilityCandidate(
                        unit_slug=unit_slug,
                        ability_slug=ability_slug,
                        source_ability_name=source_ability_name,
                        game_edition_slug=edition,
                        rules_source_slug=None,
                        rules_text=parsed["rules_text"],
                        effective_date=None,
                        superseded_date=None,
                        created_at=created_at,
                        updated_at=None,
                    )
                )

    abilities = [
        AbilityCandidate(
            seed_id_key=candidate.seed_id_key,
            ability_slug=candidate.ability_slug,
            ability_name=candidate.ability_name,
            ability_type=candidate.ability_type,
            aliases=sorted(ability_aliases.get(candidate.ability_slug, set())),
            source_names=sorted(ability_source_names.get(candidate.ability_slug, set())),
            created_at=candidate.created_at,
            updated_at=candidate.updated_at,
        )
        for candidate in ability_by_slug.values()
    ]

    return (
        sorted(abilities, key=lambda item: (item.ability_type, item.ability_slug)),
        sorted(unit_abilities, key=lambda item: (item.unit_slug, item.ability_slug)),
    )


def _extract_keywords(manifest_data: dict[str, Any]) -> list[KeywordCandidate]:
    keyword_by_slug: dict[str, KeywordCandidate] = {}
    created_at = now_iso()

    for page in manifest_data.get("pages", []):
        if page.get("page_kind") != "unit-datasheet":
            continue
        html = Path(page["cache_path"]).read_text(encoding="utf-8")
        text = html_to_text(html)
        for parsed in _parse_datasheet_keywords(text):
            keyword_slug = normalize_slug(parsed["keyword_name"])
            if not keyword_slug or keyword_slug in keyword_by_slug:
                continue
            keyword_by_slug[keyword_slug] = KeywordCandidate(
                seed_id_key=keyword_slug,
                keyword_slug=keyword_slug,
                keyword_name=parsed["keyword_name"],
                keyword_type=parsed["keyword_type"],
                created_at=created_at,
                updated_at=None,
            )

    return sorted(
        keyword_by_slug.values(),
        key=lambda item: (item.keyword_type, item.keyword_slug),
    )


def _extract_rules_sources(
    manifest_data: dict[str, Any],
) -> tuple[list[RulesSourceCandidate], list[RulesFactionSourceCandidate]]:
    source_by_slug: dict[str, RulesSourceCandidate] = {}
    faction_source_by_key: dict[str, RulesFactionSourceCandidate] = {}
    observed_factions: set[str] = set()
    created_at = now_iso()
    edition = manifest_data["edition"]
    faction_slug = (
        normalize_slug(manifest_data["faction"]).replace("_", "-")
        if manifest_data.get("faction")
        else None
    )
    rules_faction_slug = _canonical_rules_faction_slug(
        faction_slug.replace("-", "_") if faction_slug else None
    )

    for page in manifest_data.get("pages", []):
        if page.get("page_kind") != "faction-index":
            continue
        html = Path(page["cache_path"]).read_text(encoding="utf-8")
        for row in _parse_wahapedia_books_table(html):
            if row.get("edition") and _edition_slug_from_number(row["edition"]) != edition:
                continue
            candidate = _rules_source_from_book_row(row, edition=edition, created_at=created_at)
            if not candidate:
                continue
            source_by_slug.setdefault(candidate.rules_source_slug, candidate)
            link_faction_slug = _rules_faction_slug_for_source(candidate, rules_faction_slug)
            if link_faction_slug:
                observed_factions.add(link_faction_slug)
                relationship, scope = _rules_faction_source_semantics(candidate)
                link_slug = f"{link_faction_slug}__{candidate.rules_source_slug}"
                faction_source_by_key.setdefault(
                    link_slug,
                    RulesFactionSourceCandidate(
                        seed_id_key=link_slug,
                        rules_faction_slug=link_faction_slug,
                        rules_source_slug=candidate.rules_source_slug,
                        source_relationship=relationship,
                        source_scope=scope,
                        created_at=created_at,
                        updated_at=None,
                    ),
                )

    for inferred_faction_slug in sorted({rules_faction_slug, *observed_factions} - {None}):
        _add_inferred_rules_sources(
            source_by_slug=source_by_slug,
            faction_source_by_key=faction_source_by_key,
            rules_faction_slug=inferred_faction_slug,
            edition=edition,
            created_at=created_at,
        )

    return (
        sorted(source_by_slug.values(), key=lambda item: item.rules_source_slug),
        sorted(faction_source_by_key.values(), key=lambda item: item.seed_id_key),
    )


def _extract_faction_data(
    manifest_data: dict[str, Any],
) -> tuple[
    list[DetachmentCandidate],
    list[RulesFactionDetachmentCandidate],
    list[UnitCandidate],
    list[RulesFactionUnitCandidate],
]:
    created_at = now_iso()
    edition = manifest_data["edition"]
    faction_slug = (
        normalize_slug(manifest_data["faction"]).replace("_", "-")
        if manifest_data.get("faction")
        else None
    )
    rules_faction_slug = _canonical_rules_faction_slug(
        faction_slug.replace("-", "_") if faction_slug else None
    )
    if not rules_faction_slug:
        return ([], [], [], [])

    faction_html = ""
    for page in manifest_data.get("pages", []):
        if page.get("page_kind") == "faction-index":
            faction_html = Path(page["cache_path"]).read_text(encoding="utf-8")
            break

    detachment_source_slug = _default_detachment_source_slug(
        faction_html=faction_html,
        edition=edition,
        rules_faction_slug=rules_faction_slug,
    )
    detachments_by_slug: dict[str, DetachmentCandidate] = {}
    rules_faction_detachments_by_slug: dict[str, RulesFactionDetachmentCandidate] = {}
    if detachment_source_slug:
        for detachment_name in _parse_faction_detachment_names(faction_html):
            detachment_slug = normalize_slug(detachment_name)
            detachments_by_slug.setdefault(
                detachment_slug,
                DetachmentCandidate(
                    seed_id_key=detachment_slug,
                    detachment_slug=detachment_slug,
                    detachment_name=detachment_name,
                    rules_source_slug=detachment_source_slug,
                    created_at=created_at,
                    updated_at=None,
                ),
            )
            link_slug = f"{rules_faction_slug}__{detachment_slug}"
            rules_faction_detachments_by_slug.setdefault(
                link_slug,
                RulesFactionDetachmentCandidate(
                    seed_id_key=link_slug,
                    rules_faction_slug=rules_faction_slug,
                    detachment_slug=detachment_slug,
                    detachment_access_type="exclusive",
                    effective_date=None,
                    superseded_date=None,
                    created_at=created_at,
                    updated_at=None,
                ),
            )

    units_by_slug: dict[str, UnitCandidate] = {}
    rules_faction_units_by_slug: dict[str, RulesFactionUnitCandidate] = {}
    for page in manifest_data.get("pages", []):
        if page.get("page_kind") != "unit-datasheet":
            continue
        html = Path(page["cache_path"]).read_text(encoding="utf-8")
        unit_name = _parse_datasheet_unit_name(html) or display_name_from_slug(
            _unit_slug_from_url(page["url"])
        )
        unit_slug = normalize_slug(unit_name)
        rules_source_slug = _parse_datasheet_rules_source_slug(
            html=html,
            edition=edition,
            fallback_faction_slug=rules_faction_slug,
        )
        if not rules_source_slug:
            rules_source_slug = detachment_source_slug or f"codex_{rules_faction_slug}_{edition}"
        units_by_slug.setdefault(
            unit_slug,
            UnitCandidate(
                seed_id_key=unit_slug,
                unit_slug=unit_slug,
                unit_name=unit_name,
                wahapedia_url=page["url"],
                created_at=created_at,
                updated_at=None,
            ),
        )
        link_slug = f"{rules_faction_slug}__{unit_slug}"
        rules_faction_units_by_slug.setdefault(
            link_slug,
            RulesFactionUnitCandidate(
                seed_id_key=link_slug,
                rules_faction_unit_slug=link_slug,
                rules_faction_slug=rules_faction_slug,
                unit_slug=unit_slug,
                unit_access_type="exclusive",
                rules_source_slug=rules_source_slug,
                effective_date=None,
                superseded_date=None,
                created_at=created_at,
                updated_at=None,
            ),
        )

    return (
        sorted(detachments_by_slug.values(), key=lambda item: item.detachment_slug),
        sorted(
            rules_faction_detachments_by_slug.values(),
            key=lambda item: item.seed_id_key,
        ),
        sorted(units_by_slug.values(), key=lambda item: item.unit_slug),
        sorted(rules_faction_units_by_slug.values(), key=lambda item: item.seed_id_key),
    )


def _parse_faction_detachment_names(html: str) -> list[str]:
    names: set[str] = set()
    for match in re.finditer(
        r'<div class="detachName">(?P<name>.*?)</div>',
        html,
        flags=re.DOTALL,
    ):
        name = _clean_html_cell(match.group("name"))
        if name:
            names.add(name)
    return sorted(names)


def _default_detachment_source_slug(
    *, faction_html: str, edition: str, rules_faction_slug: str
) -> str | None:
    if rules_faction_slug in SPACE_MARINE_CODEX_SUPPLEMENTS:
        return f"codex_supplement_{rules_faction_slug}_{edition}"
    if rules_faction_slug in TEN_E_CODEX_FACTIONS:
        return f"codex_{rules_faction_slug}_{edition}"
    faction_pack_slugs: list[str] = []
    for row in _parse_wahapedia_books_table(faction_html):
        candidate = _rules_source_from_book_row(row, edition=edition, created_at=now_iso())
        if candidate and candidate.rules_source_type == "faction_pack":
            faction_pack_slugs.append(candidate.rules_source_slug)
    if faction_pack_slugs:
        return sorted(faction_pack_slugs)[-1]
    return None


def _parse_datasheet_unit_name(html: str) -> str | None:
    match = re.search(
        r'<div class="dsH2Header">\s*<div>(?P<name>.*?)</div>',
        html,
        flags=re.DOTALL,
    )
    if not match:
        return None
    return _clean_html_cell(match.group("name"))


def _parse_datasheet_rules_source_slug(
    *, html: str, edition: str, fallback_faction_slug: str
) -> str | None:
    match = re.search(
        r'class="tooltip logo3"\s+title="(?P<title>[^"]+)"',
        html,
        flags=re.IGNORECASE,
    )
    if not match:
        return None
    title = _clean_html_cell(match.group("title"))
    source_name = title.split(" (", 1)[0]
    version_match = re.search(r"version\s+([^)]+)", title, flags=re.IGNORECASE)
    version_slug = _rules_source_version_slug(version_match.group(1)) if version_match else None
    source_type = _classify_rules_source_type(source_name, "", None)
    if source_type == "other" and source_name.startswith("Faction Pack."):
        source_type = "faction_pack"
    source_name = source_name.replace("Faction Pack. ", "").strip()
    if source_type == "faction_pack":
        return _canonical_rules_source_slug(
            _rules_source_slug(
                source_type=source_type,
                book_name=source_name,
                edition=edition,
                version_slug=version_slug,
            )
        )
    if source_type == "legends" and "warhammer legends" in normalize_slug(title):
        return _canonical_rules_source_slug(
            _rules_source_slug(
                source_type="faction_pack",
                book_name=source_name,
                edition=edition,
                version_slug=version_slug,
            )
        )
    return _canonical_rules_source_slug(f"codex_{fallback_faction_slug}_{edition}")


def _canonical_rules_source_slug(slug: str) -> str:
    return CANONICAL_RULES_SOURCE_SLUGS.get(slug, slug)


def _parse_wahapedia_books_table(html: str) -> list[dict[str, str | None]]:
    start = html.find('<a name="Books"')
    if start < 0:
        return []
    table_start = html.find("<table", start)
    table_end = html.find("</tbody></table>", table_start)
    if table_start < 0 or table_end < 0:
        return []
    table_html = html[table_start:table_end]
    rows: list[dict[str, str | None]] = []
    current_book: str | None = None
    current_kind: str | None = None

    for row_match in re.finditer(r"<tr\b[^>]*>(?P<row>.*?)</tr>", table_html, flags=re.DOTALL):
        row_html = row_match.group("row")
        cells = [
            _clean_html_cell(match.group("cell"))
            for match in re.finditer(r"<td\b[^>]*>(?P<cell>.*?)</td>", row_html, flags=re.DOTALL)
        ]
        if not cells:
            continue
        if "book_tight" in row_match.group(0):
            current_book = cells[0]
            continue
        if cells[0].lower() == "book" or "Show History" in cells[0]:
            continue

        source_url = _extract_first_href(row_html)
        if len(cells) >= 5 and cells[0]:
            current_book = cells[0]
            current_kind = cells[1]
            rows.append(
                {
                    "book_name": current_book,
                    "kind": current_kind,
                    "edition": cells[2],
                    "version": cells[3],
                    "last_update": cells[4],
                    "source_url": source_url,
                    "historical": "false",
                }
            )
        elif len(cells) >= 4 and current_book:
            rows.append(
                {
                    "book_name": current_book,
                    "kind": current_kind,
                    "edition": cells[-3],
                    "version": cells[-2],
                    "last_update": cells[-1],
                    "source_url": source_url,
                    "historical": "true",
                }
            )

    return rows


def _rules_source_from_book_row(
    row: dict[str, str | None], *, edition: str, created_at: str
) -> RulesSourceCandidate | None:
    book_name = row.get("book_name") or ""
    kind = row.get("kind") or ""
    version = row.get("version") or None
    if not book_name:
        return None
    source_type = _classify_rules_source_type(book_name, kind, row.get("source_url"))
    version_slug = _rules_source_version_slug(version)
    rules_source_slug = _rules_source_slug(
        source_type=source_type,
        book_name=book_name,
        edition=edition,
        version_slug=version_slug,
    )
    rules_source_name = _rules_source_name(source_type=source_type, book_name=book_name)
    return RulesSourceCandidate(
        seed_id_key=rules_source_slug,
        rules_source_slug=rules_source_slug,
        rules_source_name=rules_source_name,
        rules_source_type=source_type,
        rules_source_version=f"v{version}" if version and re.match(r"^\d", version) else version,
        rules_source_version_slug=version_slug,
        release_date=None,
        superseded_date=None,
        game_edition_slug=edition,
        source_url=row.get("source_url"),
        source_book_name=book_name,
        source_kind=kind,
        source_origin="wahapedia_books_table",
        last_update_label=row.get("last_update"),
        created_at=created_at,
        updated_at=None,
    )


def _add_inferred_rules_sources(
    *,
    source_by_slug: dict[str, RulesSourceCandidate],
    faction_source_by_key: dict[str, RulesFactionSourceCandidate],
    rules_faction_slug: str,
    edition: str,
    created_at: str,
) -> None:
    if edition != "10e":
        return

    if rules_faction_slug in TEN_E_CODEX_FACTIONS:
        source = _inferred_rules_source(
            source_type="codex",
            source_name=f"Codex: {TEN_E_CODEX_FACTIONS[rules_faction_slug]}",
            source_slug=f"codex_{rules_faction_slug}_{edition}",
            edition=edition,
            created_at=created_at,
        )
        source_by_slug.setdefault(source.rules_source_slug, source)
        _add_inferred_faction_source(
            faction_source_by_key,
            rules_faction_slug=rules_faction_slug,
            rules_source_slug=source.rules_source_slug,
            relationship="primary",
            scope="exclusive",
            created_at=created_at,
        )

    if rules_faction_slug in SPACE_MARINE_CODEX_SUPPLEMENTS:
        space_marines_codex = _inferred_rules_source(
            source_type="codex",
            source_name="Codex: Space Marines",
            source_slug=f"codex_space_marines_{edition}",
            edition=edition,
            created_at=created_at,
        )
        source_by_slug.setdefault(space_marines_codex.rules_source_slug, space_marines_codex)
        _add_inferred_faction_source(
            faction_source_by_key,
            rules_faction_slug=rules_faction_slug,
            rules_source_slug=space_marines_codex.rules_source_slug,
            relationship="primary",
            scope="shared_base",
            created_at=created_at,
        )

        supplement = _inferred_rules_source(
            source_type="codex_supplement",
            source_name=f"Codex Supplement: {SPACE_MARINE_CODEX_SUPPLEMENTS[rules_faction_slug]}",
            source_slug=f"codex_supplement_{rules_faction_slug}_{edition}",
            edition=edition,
            created_at=created_at,
        )
        source_by_slug.setdefault(supplement.rules_source_slug, supplement)
        _add_inferred_faction_source(
            faction_source_by_key,
            rules_faction_slug=rules_faction_slug,
            rules_source_slug=supplement.rules_source_slug,
            relationship="supplement",
            scope="exclusive",
            created_at=created_at,
        )


def _inferred_rules_source(
    *,
    source_type: str,
    source_name: str,
    source_slug: str,
    edition: str,
    created_at: str,
) -> RulesSourceCandidate:
    return RulesSourceCandidate(
        seed_id_key=source_slug,
        rules_source_slug=source_slug,
        rules_source_name=source_name,
        rules_source_type=source_type,
        rules_source_version=None,
        rules_source_version_slug=None,
        release_date=None,
        superseded_date=None,
        game_edition_slug=edition,
        source_url=None,
        source_book_name=source_name,
        source_kind="Inferred",
        source_origin="inferred",
        last_update_label=None,
        created_at=created_at,
        updated_at=None,
    )


def _add_inferred_faction_source(
    faction_source_by_key: dict[str, RulesFactionSourceCandidate],
    *,
    rules_faction_slug: str,
    rules_source_slug: str,
    relationship: str,
    scope: str,
    created_at: str,
) -> None:
    link_slug = f"{rules_faction_slug}__{rules_source_slug}"
    faction_source_by_key.setdefault(
        link_slug,
        RulesFactionSourceCandidate(
            seed_id_key=link_slug,
            rules_faction_slug=rules_faction_slug,
            rules_source_slug=rules_source_slug,
            source_relationship=relationship,
            source_scope=scope,
            created_at=created_at,
            updated_at=None,
        ),
    )



def _edition_slug_from_number(value: str) -> str:
    value = value.strip().lower()
    return value if value.endswith("e") else f"{value}e"


def _clean_html_cell(value: str) -> str:
    value = re.sub(r"<script\b.*?</script>", " ", value, flags=re.DOTALL | re.IGNORECASE)
    value = re.sub(r"<style\b.*?</style>", " ", value, flags=re.DOTALL | re.IGNORECASE)
    value = re.sub(r"<[^>]+>", " ", value)
    value = unescape(value)
    value = re.sub(r"\s+", " ", value)
    return value.strip(" \u00a0")


def _extract_first_href(value: str) -> str | None:
    match = re.search(r"""href=["']([^"']+)["']""", value, flags=re.IGNORECASE)
    if not match:
        return None
    href = unescape(match.group(1))
    if href.startswith("//"):
        return f"https:{href}"
    if href.startswith("/"):
        return f"https://wahapedia.ru{href}"
    if urlparse(href).scheme:
        return href
    return None


def _parse_datasheet_keywords(text: str) -> list[dict[str, str]]:
    stratagems_start = text.find("STRATAGEMS")
    datasheet_text = text[:stratagems_start] if stratagems_start >= 0 else text
    parsed: list[dict[str, str]] = []
    for keyword_name in _extract_keyword_section(
        datasheet_text, r"(?<!FACTION )KEYWORDS:", r"FACTION KEYWORDS:"
    ):
        keyword_slug = normalize_slug(keyword_name)
        parsed.append(
            {
                "keyword_name": keyword_name,
                "keyword_type": _classify_keyword_type(keyword_slug),
            }
        )
    for keyword_name in _extract_keyword_section(datasheet_text, r"FACTION KEYWORDS:", r"$"):
        parsed.append({"keyword_name": keyword_name, "keyword_type": "faction"})
    return parsed


def _classify_keyword_type(keyword_slug: str) -> str:
    if keyword_slug in RULE_KEYWORD_SLUGS:
        return "rules"
    if keyword_slug in FACTION_KEYWORD_SLUGS:
        return "faction"
    return "unit"


def _extract_keyword_section(text: str, start_pattern: str, end_pattern: str) -> list[str]:
    start_match = re.search(start_pattern, text)
    if not start_match:
        return []
    end_match = re.search(end_pattern, text[start_match.end() :])
    end = start_match.end() + end_match.start() if end_match else len(text)
    section = text[start_match.end() : end].strip()
    if not section:
        return []
    section = re.sub(r"\s+", " ", section)
    return [
        _clean_keyword_name(value)
        for value in section.split(",")
        if _clean_keyword_name(value)
    ]


def _clean_keyword_name(value: str) -> str:
    value = value.strip(" .")
    return re.sub(r"\s+", " ", value).title()


def _parse_datasheet_abilities(text: str) -> list[dict[str, str]]:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    parsed: list[dict[str, str]] = []
    in_abilities = False
    current_type = "datasheet"

    for line in lines:
        upper = line.upper()
        if upper == "ABILITIES":
            in_abilities = True
            current_type = "datasheet"
            continue
        if not in_abilities:
            continue
        if upper in {
            "UNIT COMPOSITION",
            "WARGEAR OPTIONS",
            "KEYWORDS",
            "FACTION KEYWORDS",
            "DAMAGED",
            "LEADER",
        }:
            break
        if upper == "WARGEAR ABILITIES":
            current_type = "wargear"
            continue

        label_match = re.match(r"^(CORE|FACTION):\s*(.+)$", line, flags=re.IGNORECASE)
        if label_match:
            ability_type = label_match.group(1).lower()
            for name in _split_ability_list(label_match.group(2)):
                parsed.append(
                    {
                        "ability_name": name,
                        "ability_type": _normalize_ability_type(ability_type),
                        "rules_text": "",
                    }
                )
            continue

        named_match = re.match(r"^([^:]{2,80}):\s*(.+)$", line)
        if named_match:
            name = named_match.group(1).strip()
            if _looks_like_ability_name(name):
                parsed.append(
                    {
                        "ability_name": name,
                        "ability_type": _normalize_ability_type(current_type),
                        "rules_text": named_match.group(2).strip(),
                    }
                )

    return parsed


def _split_ability_list(value: str) -> list[str]:
    return [
        _clean_ability_name(part)
        for part in re.split(r",|;", value)
        if _clean_ability_name(part)
    ]


def _clean_ability_name(value: str) -> str:
    value = re.sub(r"\([^)]*\)", "", value)
    value = value.strip(" .")
    return re.sub(r"\s+", " ", value)


def _looks_like_ability_name(value: str) -> bool:
    if len(value) > 80:
        return False
    return not bool(re.search(r"\b(if|when|until|select|each|one|this)\b", value, re.I))


def _normalize_ability_type(value: str) -> str:
    slug = normalize_slug(value)
    return slug if slug in ABILITY_TYPES else "other"


def _canonical_ability_slug(slug: str) -> str:
    return CANONICAL_ABILITY_ALIASES.get(slug, slug)


def _is_seedable_slug(slug: str) -> bool:
    return bool(slug and re.search(r"[a-z]", slug))


def _canonical_ability_name(source_name: str, ability_slug: str) -> str:
    if normalize_slug(source_name) == ability_slug:
        return source_name
    return display_name_from_slug(ability_slug)


def _unit_slug_from_url(url: str) -> str:
    tail = url.rstrip("/").split("/")[-1]
    return normalize_slug(tail)


def _ability_seed_snippets(abilities: list[AbilityCandidate]) -> str:
    blocks = [
        "/* Generated review snippets. Review before pasting into seed files. */",
        "",
    ]
    for ability in abilities:
        const_name = "".join(part.capitalize() for part in ability.ability_slug.split("_"))
        if not const_name:
            const_name = display_name_from_slug(ability.ability_slug).replace(" ", "")
        blocks.append(
            "\n".join(
                [
                    f"export const {const_name}Ability: AbilityConfig = {{",
                    f'  id: abilityId("{ability.seed_id_key}"),',
                    f'  ability_slug: "{ability.ability_slug}",',
                    f"  ability_name: {_ts_string(ability.ability_name)},",
                    f'  ability_type: "{ability.ability_type}",',
                    "};",
                    "",
                ]
            )
        )
    return "\n".join(blocks)


def _keyword_seed_snippets(keywords: list[KeywordCandidate]) -> str:
    blocks = [
        "/* Generated review snippets. Review before pasting into seed files. */",
        "",
    ]
    for keyword in keywords:
        const_name = "".join(part.capitalize() for part in keyword.keyword_slug.split("_"))
        blocks.append(
            "\n".join(
                [
                    f"export const {const_name}Keyword: KeywordConfig = {{",
                    f'  id: keywordId("{keyword.seed_id_key}"),',
                    f'  keyword_slug: "{keyword.keyword_slug}",',
                    f"  keyword_name: {_ts_string(keyword.keyword_name)},",
                    f'  keyword_type: "{keyword.keyword_type}",',
                    "};",
                    "",
                ]
            )
        )
    return "\n".join(blocks)


def _ts_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=True)
