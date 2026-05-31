#!/usr/bin/env python3
"""Emit BSData-derived expected dataset inventory counts as JSON."""

from __future__ import annotations

import argparse
import json
import re
from collections import OrderedDict
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable
from xml.etree import ElementTree as ET

from wahapedia_importer.common import normalize_slug

BS_NS = {"bs": "http://www.battlescribe.net/schema/catalogueSchema"}
POINTS_FIELD_ID = "51b2-306e-1021-d207"
UNIT_SELECTION_TYPES = {"model", "unit"}
WEAPON_PROFILE_TYPES = {"Melee Weapons", "Ranged Weapons"}


@dataclass(frozen=True)
class UnitEntry:
    name: str
    element: ET.Element
    source_file: str
    source_mode: str


@dataclass(frozen=True)
class UnitMetrics:
    unit_models: int
    unit_point_costs: int
    unit_profile_stats: int
    unit_profiles: int
    unit_weapons: int
    models: frozenset[str]


SPACE_MARINE_BASE_SOURCE = [("shared", "Imperium - Space Marines.cat")]

UNIT_SLUG_ALIASES = {
    "hellblade": "hell_blade",
    "hellblade_legends": "hell_blade",
    "jakhal": "jakhals",
    "piranha": "piranhas",
}

CATALOG_SOURCES: dict[str, list[tuple[str, str]]] = {
    "adepta_sororitas": [("shared", "Imperium - Adepta Sororitas.cat")],
    "adeptus_custodes": [("shared", "Imperium - Adeptus Custodes.cat")],
    "adeptus_mechanicus": [("shared", "Imperium - Adeptus Mechanicus.cat")],
    "astra_militarum": [("entry_links", "Imperium - Astra Militarum.cat")],
    "grey_knights": [("shared", "Imperium - Grey Knights.cat")],
    "imperial_agents": [("shared", "Imperium - Agents of the Imperium.cat")],
    "imperial_knights": [("shared", "Imperium - Imperial Knights - Library.cat")],
    "space_marines": SPACE_MARINE_BASE_SOURCE,
    "black_templars": SPACE_MARINE_BASE_SOURCE + [("shared", "Imperium - Black Templars.cat")],
    "blood_angels": SPACE_MARINE_BASE_SOURCE + [("shared", "Imperium - Blood Angels.cat")],
    "dark_angels": SPACE_MARINE_BASE_SOURCE + [("shared", "Imperium - Dark Angels.cat")],
    "deathwatch": SPACE_MARINE_BASE_SOURCE + [("shared", "Imperium - Deathwatch.cat")],
    "imperial_fists": SPACE_MARINE_BASE_SOURCE + [("shared", "Imperium - Imperial Fists.cat")],
    "iron_hands": SPACE_MARINE_BASE_SOURCE + [("shared", "Imperium - Iron Hands.cat")],
    "raven_guard": SPACE_MARINE_BASE_SOURCE + [("shared", "Imperium - Raven Guard.cat")],
    "salamanders": SPACE_MARINE_BASE_SOURCE + [("shared", "Imperium - Salamanders.cat")],
    "space_wolves": SPACE_MARINE_BASE_SOURCE + [("shared", "Imperium - Space Wolves.cat")],
    "ultramarines": SPACE_MARINE_BASE_SOURCE + [("shared", "Imperium - Ultramarines.cat")],
    "white_scars": SPACE_MARINE_BASE_SOURCE + [("shared", "Imperium - White Scars.cat")],
    "chaos_daemons": [("shared", "Chaos - Chaos Daemons Library.cat")],
    "chaos_knights": [("shared", "Chaos - Chaos Knights Library.cat")],
    "chaos_space_marines": [("shared", "Chaos - Chaos Space Marines.cat")],
    "death_guard": [("shared", "Chaos - Death Guard.cat")],
    "emperors_children": [("shared", "Chaos - Emperor's Children.cat")],
    "thousand_sons": [("shared", "Chaos - Thousand Sons.cat")],
    "world_eaters": [("shared", "Chaos - World Eaters.cat")],
    "aeldari": [("entry_links", "Aeldari - Craftworlds.cat")],
    "drukhari": [("entry_links", "Aeldari - Drukhari.cat")],
    "genestealer_cults": [("shared", "Genestealer Cults.cat")],
    "leagues_of_votann": [("shared", "Leagues of Votann.cat")],
    "necrons": [("shared", "Necrons.cat")],
    "orks": [("shared", "Orks.cat")],
    "tau_empire": [("shared", "T'au Empire.cat")],
    "tyranids": [("entry_links", "Tyranids.cat")],
}


class BsDataIndex:
    def __init__(self, root: Path) -> None:
        self.root = root
        self.catalogs_by_file: dict[str, ET.Element] = {}
        self.selection_entries_by_id: dict[str, ET.Element] = {}

        for path in sorted(root.glob("*.cat")):
            catalogue = ET.parse(path).getroot()
            self.catalogs_by_file[path.name] = catalogue

            for entry in catalogue.findall(".//bs:selectionEntry", BS_NS):
                entry_id = entry.attrib.get("id")
                if entry_id:
                    self.selection_entries_by_id[entry_id] = entry

    def catalogue(self, filename: str) -> ET.Element:
        return self.catalogs_by_file[filename]

    def resolve_selection_entry(self, target_id: str | None) -> ET.Element | None:
        if not target_id:
            return None
        return self.selection_entries_by_id.get(target_id)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bsdata-root", required=True)
    parser.add_argument(
        "--emit-rules-faction-units",
        action="store_true",
        help="Emit expected rules_faction_units memberships instead of counts.",
    )
    parser.add_argument(
        "--repo-root",
        default=str(Path(__file__).resolve().parents[1]),
        help="Repository root used to load current seed unit slugs for slug aliases.",
    )
    args = parser.parse_args()

    index = BsDataIndex(Path(args.bsdata_root))
    if args.emit_rules_faction_units:
        records = expected_rules_faction_units(index, Path(args.repo_root))
        print(json.dumps(records, sort_keys=True))
        return

    seed_unit_slugs = load_seed_unit_slugs(Path(args.repo_root))
    result = {
        slug: expected_counts_for_sources(index, sources, seed_unit_slugs)
        for slug, sources in CATALOG_SOURCES.items()
    }
    print(json.dumps(result, sort_keys=True))


def expected_counts_for_sources(
    index: BsDataIndex,
    sources: list[tuple[str, str]],
    seed_unit_slugs: set[str] | None = None,
) -> dict[str, int]:
    unit_entries: "OrderedDict[str, UnitEntry]" = OrderedDict()

    for mode, filename in sources:
        for entry in source_unit_entries(index, mode, filename):
            key = (
                seed_unit_slug(entry.name, seed_unit_slugs)
                if seed_unit_slugs
                else normalize_name(entry.name)
            )
            unit_entries[key] = entry

    unit_metrics = [metrics_for_unit(entry.element, entry.name) for entry in unit_entries.values()]
    model_names = set[str]()
    for metrics in unit_metrics:
        model_names.update(metrics.models)

    return {
        "rules_faction_units": len(unit_entries),
        "unit_models": sum(metrics.unit_models for metrics in unit_metrics),
        "unit_point_costs": sum(metrics.unit_point_costs for metrics in unit_metrics),
        "unit_profile_stats": sum(metrics.unit_profile_stats for metrics in unit_metrics),
        "unit_profiles": sum(metrics.unit_profiles for metrics in unit_metrics),
        "unit_weapons": sum(metrics.unit_weapons for metrics in unit_metrics),
        "models": len(model_names),
    }


def source_unit_entries(
    index: BsDataIndex,
    mode: str,
    filename: str,
) -> Iterable[UnitEntry]:
    catalogue = index.catalogue(filename)

    if mode == "shared":
        shared_entries = catalogue.find("bs:sharedSelectionEntries", BS_NS)
        if shared_entries is None:
            return []

        return [
            UnitEntry(
                name=entry.attrib["name"],
                element=entry,
                source_file=filename,
                source_mode=mode,
            )
            for entry in shared_entries.findall("bs:selectionEntry", BS_NS)
            if entry.attrib.get("type") in UNIT_SELECTION_TYPES
        ]

    if mode == "entry_links":
        linked_units: list[UnitEntry] = []
        for link in catalogue.findall("./bs:entryLinks/bs:entryLink", BS_NS):
            if link.attrib.get("type") != "selectionEntry":
                continue

            entry = index.resolve_selection_entry(link.attrib.get("targetId"))
            if entry is None or entry.attrib.get("type") not in UNIT_SELECTION_TYPES:
                continue

            linked_units.append(
                UnitEntry(
                    name=link.attrib.get("name", entry.attrib["name"]),
                    element=entry,
                    source_file=filename,
                    source_mode=mode,
                ),
            )

        return linked_units

    raise ValueError(f"Unsupported BSData source mode: {mode}")


def metrics_for_unit(entry: ET.Element, fallback_model_name: str) -> UnitMetrics:
    model_names = model_names_for_unit(entry, fallback_model_name)
    unit_profiles = [
        profile
        for profile in entry.findall(".//bs:profile", BS_NS)
        if profile.attrib.get("typeName") == "Unit"
    ]
    weapon_profiles = [
        profile
        for profile in entry.findall(".//bs:profile", BS_NS)
        if profile.attrib.get("typeName") in WEAPON_PROFILE_TYPES
    ]

    return UnitMetrics(
        unit_models=len(model_names),
        unit_point_costs=count_point_cost_rows(entry),
        unit_profile_stats=sum(count_characteristics(profile) for profile in unit_profiles),
        unit_profiles=len(unit_profiles),
        unit_weapons=len(weapon_profiles),
        models=frozenset(model_names),
    )


def model_names_for_unit(entry: ET.Element, fallback_model_name: str) -> list[str]:
    if entry.attrib.get("type") == "model":
        return [fallback_model_name]

    model_names = [
        model.attrib["name"]
        for model in entry.findall(".//bs:selectionEntry", BS_NS)
        if model.attrib.get("type") == "model" and model.attrib.get("name")
    ]

    return model_names or [fallback_model_name]


def count_point_cost_rows(entry: ET.Element) -> int:
    point_values = set[str]()

    for cost in entry.findall(".//bs:cost", BS_NS):
        if cost.attrib.get("name") == "pts" and cost.attrib.get("value") is not None:
            point_values.add(cost.attrib["value"])

    for modifier in entry.findall(".//bs:modifier", BS_NS):
        if (
            modifier.attrib.get("field") == POINTS_FIELD_ID
            and modifier.attrib.get("value") is not None
        ):
            point_values.add(modifier.attrib["value"])

    return len(point_values)


def count_characteristics(profile: ET.Element) -> int:
    return len(profile.findall(".//bs:characteristic", BS_NS))


def normalize_name(name: str) -> str:
    return " ".join(name.split())


def expected_rules_faction_units(
    index: BsDataIndex,
    repo_root: Path,
) -> list[dict[str, str]]:
    seed_unit_slugs = load_seed_unit_slugs(repo_root)
    records: list[dict[str, str]] = []

    for faction_slug, sources in CATALOG_SOURCES.items():
        unit_entries: "OrderedDict[str, UnitEntry]" = OrderedDict()

        for mode, filename in sources:
            for entry in source_unit_entries(index, mode, filename):
                unit_slug = seed_unit_slug(entry.name, seed_unit_slugs)
                unit_entries[unit_slug] = entry

        for unit_slug, entry in unit_entries.items():
            access_type = (
                "shared"
                if entry.source_file == "Imperium - Space Marines.cat"
                and faction_slug != "space_marines"
                else "exclusive"
            )
            records.append(
                {
                    "rules_faction_slug": faction_slug,
                    "unit_slug": unit_slug,
                    "unit_name": display_unit_name(entry.name),
                    "bsdata_unit_name": entry.name,
                    "unit_access_type": access_type,
                    "source_file": entry.source_file,
                    "source_mode": entry.source_mode,
                },
            )

    return sorted(
        records,
        key=lambda record: (record["rules_faction_slug"], record["unit_slug"]),
    )


def load_seed_unit_slugs(repo_root: Path) -> set[str]:
    units_path = repo_root / "db/seed_config/seed/data/units.data.ts"
    if not units_path.exists():
        return set()

    return set(re.findall(r'unit_slug: "([^"]+)"', units_path.read_text()))


def seed_unit_slug(name: str, seed_unit_slugs: set[str]) -> str:
    is_legends = "[Legends]" in name
    base_name = re.sub(r"\s*\[Legends\]\s*$", "", name).strip()
    raw_slug = normalize_slug(base_name)
    candidates: list[str] = []

    if is_legends:
        candidates.extend([f"{raw_slug}_legends", f"{raw_slug}_legendary"])

    candidates.append(raw_slug)

    for candidate in unit_slug_variants(candidates):
        if candidate in seed_unit_slugs:
            return candidate

    return unit_slug_variants(candidates)[0]


def unit_slug_variants(candidates: list[str]) -> list[str]:
    variants: list[str] = []

    for candidate in candidates:
        for variant in spelling_variants(candidate):
            variants.append(UNIT_SLUG_ALIASES.get(variant, variant))

    return list(OrderedDict.fromkeys(variants))


def spelling_variants(slug: str) -> list[str]:
    variants = [slug]
    if "armor" in slug:
        variants.append(slug.replace("armor", "armour"))
    if "defense" in slug:
        variants.append(slug.replace("defense", "defence"))
    return variants


def display_unit_name(name: str) -> str:
    return re.sub(r"\s*\[Legends\]\s*$", " (Legends)", name).strip()


if __name__ == "__main__":
    main()
