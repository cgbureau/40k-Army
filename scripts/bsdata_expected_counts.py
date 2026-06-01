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

PRIMARY_CATALOG_BY_FACTION = {
    "aeldari": "Aeldari - Craftworlds.cat",
    "chaos_daemons": "Chaos - Chaos Daemons.cat",
    "chaos_knights": "Chaos - Chaos Knights.cat",
    "imperial_knights": "Imperium - Imperial Knights.cat",
}

SPACE_MARINE_PRIMARY_CATALOG_BY_FACTION = {
    "space_marines": "Imperium - Space Marines.cat",
    "black_templars": "Imperium - Black Templars.cat",
    "blood_angels": "Imperium - Blood Angels.cat",
    "dark_angels": "Imperium - Dark Angels.cat",
    "deathwatch": "Imperium - Deathwatch.cat",
    "imperial_fists": "Imperium - Imperial Fists.cat",
    "iron_hands": "Imperium - Iron Hands.cat",
    "raven_guard": "Imperium - Raven Guard.cat",
    "salamanders": "Imperium - Salamanders.cat",
    "space_wolves": "Imperium - Space Wolves.cat",
    "ultramarines": "Imperium - Ultramarines.cat",
    "white_scars": "Imperium - White Scars.cat",
}

DEFAULT_RULES_SOURCE_BY_FACTION = {
    "adepta_sororitas": "codex_adepta_sororitas_10e",
    "adeptus_custodes": "codex_adeptus_custodes_10e",
    "adeptus_mechanicus": "codex_adeptus_mechanicus_10e",
    "astra_militarum": "codex_astra_militarum_10e",
    "grey_knights": "codex_grey_knights_10e",
    "imperial_agents": "codex_imperial_agents_10e",
    "imperial_knights": "codex_imperial_knights_10e",
    "space_marines": "codex_space_marines_10e",
    "black_templars": "codex_space_marines_10e",
    "blood_angels": "codex_space_marines_10e",
    "dark_angels": "codex_space_marines_10e",
    "deathwatch": "codex_space_marines_10e",
    "imperial_fists": "codex_space_marines_10e",
    "iron_hands": "codex_space_marines_10e",
    "raven_guard": "codex_space_marines_10e",
    "salamanders": "codex_space_marines_10e",
    "space_wolves": "codex_space_marines_10e",
    "ultramarines": "codex_space_marines_10e",
    "white_scars": "codex_space_marines_10e",
    "chaos_daemons": "faction_pack_chaos_daemons_10e_v1_2",
    "chaos_knights": "codex_chaos_knights_10e",
    "chaos_space_marines": "codex_chaos_space_marines_10e",
    "death_guard": "faction_pack_death_guard_10e_v1_1",
    "emperors_children": "codex_emperors_children_10e",
    "thousand_sons": "codex_thousand_sons_10e",
    "world_eaters": "faction_pack_world_eaters_10e_v1_1",
    "aeldari": "codex_aeldari_10e",
    "drukhari": "codex_drukhari_10e",
    "genestealer_cults": "codex_genestealer_cults_10e",
    "leagues_of_votann": "codex_leagues_of_votann_10e",
    "necrons": "codex_necrons_10e",
    "orks": "codex_orks_10e",
    "tau_empire": "codex_tau_empire_10e",
    "tyranids": "codex_tyranids_10e",
}

RULES_SOURCE_BY_CATALOG_FILE = {
    "Imperium - Space Marines.cat": "codex_space_marines_10e",
    "Imperium - Black Templars.cat": "codex_supplement_black_templars_10e",
    "Imperium - Blood Angels.cat": "codex_supplement_blood_angels_10e",
    "Imperium - Dark Angels.cat": "codex_supplement_dark_angels_10e",
    "Imperium - Deathwatch.cat": "faction_pack_deathwatch_10e_v1_2",
    "Imperium - Space Wolves.cat": "codex_supplement_space_wolves_10e",
}

OWNER_SLUG_BY_CATALOG_FILE = {
    "Aeldari - Craftworlds.cat": "aeldari",
    "Aeldari - Drukhari.cat": "drukhari",
    "Chaos - Chaos Daemons Library.cat": "chaos_daemons",
    "Chaos - Chaos Space Marines.cat": "chaos_space_marines",
    "Chaos - Death Guard.cat": "death_guard",
    "Chaos - Emperor's Children.cat": "emperors_children",
    "Chaos - Thousand Sons.cat": "thousand_sons",
    "Chaos - World Eaters.cat": "world_eaters",
    "Genestealer Cults.cat": "genestealer_cults",
    "Imperium - Adepta Sororitas.cat": "adepta_sororitas",
    "Imperium - Adeptus Custodes.cat": "adeptus_custodes",
    "Imperium - Adeptus Mechanicus.cat": "adeptus_mechanicus",
    "Imperium - Agents of the Imperium.cat": "imperial_agents",
    "Imperium - Astra Militarum.cat": "astra_militarum",
    "Imperium - Black Templars.cat": "black_templars",
    "Imperium - Blood Angels.cat": "blood_angels",
    "Imperium - Dark Angels.cat": "dark_angels",
    "Imperium - Deathwatch.cat": "deathwatch",
    "Imperium - Grey Knights.cat": "grey_knights",
    "Imperium - Imperial Fists.cat": "imperial_fists",
    "Imperium - Iron Hands.cat": "iron_hands",
    "Imperium - Raven Guard.cat": "raven_guard",
    "Imperium - Salamanders.cat": "salamanders",
    "Imperium - Space Marines.cat": "space_marines",
    "Imperium - Space Wolves.cat": "space_wolves",
    "Imperium - Ultramarines.cat": "ultramarines",
    "Imperium - White Scars.cat": "white_scars",
    "Leagues of Votann.cat": "leagues_of_votann",
    "Necrons.cat": "necrons",
    "Orks.cat": "orks",
    "T'au Empire.cat": "tau_empire",
    "Tyranids.cat": "tyranids",
}

DETACHMENT_SLUG_ALIASES = {
    "haloscreed_battleclade_detachment": "haloscreed_battle_clade_detachment",
    "needga_rd_oathband_detachment": "needgard_oathband_detachment",
    "d_lve_assault_shift_detachment": "dalve_assault_shift_detachment",
}

LEADER_TARGET_SLUG_ALIASES = {
    "legionaires": "legionaries",
    "plague_bearers": "plaguebearers",
    "raiders": "red_corsairs_raiders",
    "acolyte_hybrids_with_handflamers": "acolyte_hybrids_with_hand_flamers",
    "storm_guardian": "storm_guardians",
    "sternguard_veterans_squad": "sternguard_veteran_squad",
    "sword_brethren": "sword_brethren_squad",
    "traitor_guardsman_squad": "traitor_guardsmen_squad",
    "wolfguard_headtakers": "wolf_guard_headtakers",
}

UNIT_MEMBERSHIP_OVERRIDES = {
    # BSData currently exposes Ferren Areios from the base Space Marines catalog,
    # but the character is an Ultramarines Legends datasheet rather than a
    # generic Adeptus Astartes unit shared by every Space Marine chapter.
    "ferren_areios": {
        "faction_slugs": {"ultramarines"},
        "rules_source_slug": "legends_ultramarines_10e",
        "source_owner_slug": "ultramarines",
        "unit_access_type": "exclusive",
    },
}

LEADER_TARGET_KEYWORD_ALIASES = {
    "acolyte_hybrids": ["acolyte_hybrids"],
    "astra_militarum_battleline": ["astra_militarum", "battleline"],
    "electro_priests": ["electro_priests"],
    "emperors_children_terminator_squad": ["emperors_children", "terminator_squad"],
    "imperium_battleline_infantry": ["imperium", "battleline", "infantry"],
    "kataphrons": ["kataphron"],
    "tacticus": ["tacticus"],
}

CHAOS_DAEMON_GOD_KEYWORDS = {"khorne", "nurgle", "slaanesh", "tzeentch"}


class BsDataIndex:
    def __init__(self, root: Path) -> None:
        self.root = root
        self.catalogs_by_file: dict[str, ET.Element] = {}
        self.catalog_ids_by_file: dict[str, str] = {}
        self.selection_entries_by_id: dict[str, ET.Element] = {}
        self.selection_entry_groups_by_id: dict[str, ET.Element] = {}

        for path in sorted(root.glob("*.cat")):
            catalogue = ET.parse(path).getroot()
            self.catalogs_by_file[path.name] = catalogue
            self.catalog_ids_by_file[path.name] = catalogue.attrib["id"]

            for entry in catalogue.findall(".//bs:selectionEntry", BS_NS):
                entry_id = entry.attrib.get("id")
                if entry_id:
                    self.selection_entries_by_id[entry_id] = entry

            for group in catalogue.findall(".//bs:selectionEntryGroup", BS_NS):
                group_id = group.attrib.get("id")
                if group_id:
                    self.selection_entry_groups_by_id[group_id] = group

    def catalogue(self, filename: str) -> ET.Element:
        return self.catalogs_by_file[filename]

    def catalogue_id(self, filename: str) -> str:
        return self.catalog_ids_by_file[filename]

    def resolve_selection_entry(self, target_id: str | None) -> ET.Element | None:
        if not target_id:
            return None
        return self.selection_entries_by_id.get(target_id)

    def resolve_selection_entry_group(self, target_id: str | None) -> ET.Element | None:
        if not target_id:
            return None
        return self.selection_entry_groups_by_id.get(target_id)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bsdata-root", required=True)
    parser.add_argument(
        "--emit-rules-faction-units",
        action="store_true",
        help="Emit expected rules_faction_units memberships instead of counts.",
    )
    parser.add_argument(
        "--emit-rules-faction-detachments",
        action="store_true",
        help="Emit expected rules_faction_detachments memberships instead of counts.",
    )
    parser.add_argument(
        "--emit-leader-eligibilities",
        action="store_true",
        help="Emit expected leader_eligibilities memberships instead of counts.",
    )
    parser.add_argument(
        "--emit-leader-eligibility-keywords",
        action="store_true",
        help="Emit expected leader_eligibility_keywords memberships instead of counts.",
    )
    parser.add_argument(
        "--emit-unit-models",
        action="store_true",
        help="Emit expected unit_models memberships instead of counts.",
    )
    parser.add_argument(
        "--emit-models",
        action="store_true",
        help="Emit expected global models derived from BSData unit model selections.",
    )
    parser.add_argument(
        "--emit-unit-point-costs",
        action="store_true",
        help="Emit expected unit_point_costs memberships instead of counts.",
    )
    parser.add_argument(
        "--emit-unit-profiles",
        action="store_true",
        help="Emit expected unit_profiles memberships instead of counts.",
    )
    parser.add_argument(
        "--emit-unit-profile-stats",
        action="store_true",
        help="Emit expected unit_profile_stats memberships instead of counts.",
    )
    parser.add_argument(
        "--emit-unit-weapons",
        action="store_true",
        help="Emit expected unit_weapons memberships instead of counts.",
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
    if args.emit_rules_faction_detachments:
        records = expected_rules_faction_detachments(index)
        print(json.dumps(records, sort_keys=True))
        return
    if args.emit_leader_eligibilities:
        records = expected_leader_eligibilities(index, Path(args.repo_root))
        print(json.dumps(records, sort_keys=True))
        return
    if args.emit_leader_eligibility_keywords:
        records = expected_leader_eligibility_keywords(index, Path(args.repo_root))
        print(json.dumps(records, sort_keys=True))
        return
    if args.emit_unit_models:
        records = expected_unit_models(index, Path(args.repo_root))
        print(json.dumps(records, sort_keys=True))
        return
    if args.emit_models:
        records = expected_models(index, Path(args.repo_root))
        print(json.dumps(records, sort_keys=True))
        return
    if args.emit_unit_point_costs:
        records = expected_unit_point_costs(index, Path(args.repo_root))
        print(json.dumps(records, sort_keys=True))
        return
    if args.emit_unit_profiles:
        records = expected_unit_profiles(index, Path(args.repo_root))
        print(json.dumps(records, sort_keys=True))
        return
    if args.emit_unit_profile_stats:
        records = expected_unit_profile_stats(index, Path(args.repo_root))
        print(json.dumps(records, sort_keys=True))
        return
    if args.emit_unit_weapons:
        records = expected_unit_weapons(index, Path(args.repo_root))
        print(json.dumps(records, sort_keys=True))
        return

    seed_unit_slugs = load_seed_unit_slugs(Path(args.repo_root))
    result = {
        slug: expected_counts_for_sources(index, slug, sources, seed_unit_slugs)
        for slug, sources in CATALOG_SOURCES.items()
    }
    detachment_counts = expected_rules_faction_detachment_counts(index)
    for slug, count in detachment_counts.items():
        result[slug]["rules_faction_detachments"] = count
    leader_eligibility_counts = expected_leader_eligibility_counts(
        index,
        Path(args.repo_root),
    )
    for slug, count in leader_eligibility_counts.items():
        result[slug]["leader_eligibilities"] = count
    leader_eligibility_keyword_counts = expected_leader_eligibility_keyword_counts(
        index,
        Path(args.repo_root),
    )
    for slug, count in leader_eligibility_keyword_counts.items():
        result[slug]["leader_eligibility_keywords"] = count
    unit_model_counts = expected_unit_model_counts(index, Path(args.repo_root))
    for slug, count in unit_model_counts.items():
        result[slug]["unit_models"] = count
    model_counts = expected_model_counts(index, Path(args.repo_root))
    for slug, count in model_counts.items():
        result[slug]["models"] = count
    unit_point_cost_counts = expected_unit_point_cost_counts(index, Path(args.repo_root))
    for slug, count in unit_point_cost_counts.items():
        result[slug]["unit_point_costs"] = count
    unit_profile_counts = expected_unit_profile_counts(index, Path(args.repo_root))
    for slug, count in unit_profile_counts.items():
        result[slug]["unit_profiles"] = count
    unit_profile_stat_counts = expected_unit_profile_stat_counts(
        index,
        Path(args.repo_root),
    )
    for slug, count in unit_profile_stat_counts.items():
        result[slug]["unit_profile_stats"] = count
    unit_weapon_counts = expected_unit_weapon_counts(index, Path(args.repo_root))
    for slug, count in unit_weapon_counts.items():
        result[slug]["unit_weapons"] = count
    print(json.dumps(result, sort_keys=True))


def expected_counts_for_sources(
    index: BsDataIndex,
    faction_slug: str,
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
            if not include_unit_for_faction(key, faction_slug):
                continue
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


def expected_unit_model_counts(
    index: BsDataIndex,
    repo_root: Path,
) -> dict[str, int]:
    counts = {slug: 0 for slug in CATALOG_SOURCES}

    for record in expected_unit_models(index, repo_root):
        counts[record["rules_faction_slug"]] += 1

    return counts


def expected_model_counts(
    index: BsDataIndex,
    repo_root: Path,
) -> dict[str, int]:
    model_slugs_by_faction: dict[str, set[str]] = {
        slug: set() for slug in CATALOG_SOURCES
    }

    for record in expected_unit_models(index, repo_root):
        model_slugs_by_faction[record["rules_faction_slug"]].add(
            record["model_slug"],
        )

    return {
        faction_slug: len(model_slugs)
        for faction_slug, model_slugs in model_slugs_by_faction.items()
    }


def expected_unit_models(
    index: BsDataIndex,
    repo_root: Path,
) -> list[dict[str, str | int]]:
    seed_unit_slugs = load_seed_unit_slugs(repo_root)
    records: list[dict[str, str | int]] = []

    for faction_slug, sources in CATALOG_SOURCES.items():
        unit_entries: "OrderedDict[str, UnitEntry]" = OrderedDict()

        for mode, filename in sources:
            for entry in source_unit_entries(index, mode, filename):
                unit_slug = seed_unit_slug(entry.name, seed_unit_slugs)
                if not include_unit_for_faction(unit_slug, faction_slug):
                    continue
                unit_entries[unit_slug] = entry

        for unit_slug, entry in unit_entries.items():
            model_records = model_records_for_unit(entry.element, entry.name)
            for model_record in with_unit_model_slugs(unit_slug, model_records):
                records.append(
                    {
                        "rules_faction_slug": faction_slug,
                        "unit_slug": unit_slug,
                        "unit_model_slug": model_record["unit_model_slug"],
                        "model_slug": model_record["model_slug"],
                        "model_name": model_record["model_name"],
                        "minimum_model_count": model_record["minimum_model_count"],
                        "maximum_model_count": model_record["maximum_model_count"],
                        "source_owner_slug": unit_source_owner_slug(
                            unit_slug,
                            entry.source_file,
                            faction_slug,
                        ),
                        "source_file": entry.source_file,
                        "source_mode": entry.source_mode,
                        "bsdata_unit_name": entry.name,
                        "bsdata_model_name": model_record["bsdata_model_name"],
                        "bsdata_model_id": model_record["bsdata_model_id"],
                    },
                )

    return sorted(
        records,
        key=lambda record: (
            str(record["rules_faction_slug"]),
            str(record["unit_model_slug"]),
        ),
    )


def expected_models(
    index: BsDataIndex,
    repo_root: Path,
) -> list[dict[str, str]]:
    records_by_slug: "OrderedDict[str, dict[str, str]]" = OrderedDict()

    for record in expected_unit_models(index, repo_root):
        model_slug = str(record["model_slug"])
        records_by_slug.setdefault(
            model_slug,
            {
                "model_slug": model_slug,
                "model_name": str(record["model_name"]),
                "source_owner_slug": str(record["source_owner_slug"]),
            },
        )

    return sorted(
        records_by_slug.values(),
        key=lambda record: (record["source_owner_slug"], record["model_slug"]),
    )


def expected_unit_point_cost_counts(
    index: BsDataIndex,
    repo_root: Path,
) -> dict[str, int]:
    counts = {slug: 0 for slug in CATALOG_SOURCES}

    for record in expected_unit_point_costs(index, repo_root):
        counts[record["rules_faction_slug"]] += 1

    return counts


def expected_unit_point_costs(
    index: BsDataIndex,
    repo_root: Path,
) -> list[dict[str, str | int]]:
    seed_unit_slugs = load_seed_unit_slugs(repo_root)
    records: list[dict[str, str | int]] = []

    for faction_slug, sources in CATALOG_SOURCES.items():
        unit_entries: "OrderedDict[str, UnitEntry]" = OrderedDict()

        for mode, filename in sources:
            for entry in source_unit_entries(index, mode, filename):
                unit_slug = seed_unit_slug(entry.name, seed_unit_slugs)
                if not include_unit_for_faction(unit_slug, faction_slug):
                    continue
                unit_entries[unit_slug] = entry

        for unit_slug, entry in unit_entries.items():
            for cost_record in point_cost_records_for_unit(entry.element):
                records.append(
                    {
                        "rules_faction_slug": faction_slug,
                        "unit_slug": unit_slug,
                        "unit_point_cost_slug": (
                            f"{unit_slug}__10e__{cost_record['model_count']}m"
                        ),
                        "minimum_model_count": cost_record["model_count"],
                        "maximum_model_count": cost_record["model_count"],
                        "unit_points": cost_record["unit_points"],
                        "rules_source_slug": unit_rules_source_slug(
                            unit_slug,
                            entry.source_file,
                            faction_slug,
                        ),
                        "source_owner_slug": unit_source_owner_slug(
                            unit_slug,
                            entry.source_file,
                            faction_slug,
                        ),
                        "source_file": entry.source_file,
                        "source_mode": entry.source_mode,
                        "bsdata_unit_name": entry.name,
                        "bsdata_cost_kind": cost_record["cost_kind"],
                    },
                )

    return sorted(
        records,
        key=lambda record: (
            str(record["rules_faction_slug"]),
            str(record["unit_point_cost_slug"]),
        ),
    )


def expected_unit_profile_counts(
    index: BsDataIndex,
    repo_root: Path,
) -> dict[str, int]:
    counts = {slug: 0 for slug in CATALOG_SOURCES}

    for record in expected_unit_profiles(index, repo_root):
        counts[record["rules_faction_slug"]] += 1

    return counts


def expected_unit_profiles(
    index: BsDataIndex,
    repo_root: Path,
) -> list[dict[str, str | int | None]]:
    return [
        {
            key: value
            for key, value in record.items()
            if key != "stat_records"
        }
        for record in expected_unit_profiles_with_stats(index, repo_root)
    ]


def expected_unit_profiles_with_stats(
    index: BsDataIndex,
    repo_root: Path,
) -> list[dict[str, object]]:
    records: list[dict[str, object]] = []

    for faction_slug, unit_slug, entry in expected_unit_entry_records(index, repo_root):
        for profile_record in unit_profile_records_for_unit(unit_slug, entry):
            records.append(
                {
                    **profile_record,
                    "rules_faction_slug": faction_slug,
                    "unit_slug": unit_slug,
                    "rules_source_slug": unit_rules_source_slug(
                        unit_slug,
                        entry.source_file,
                        faction_slug,
                    ),
                    "source_owner_slug": unit_source_owner_slug(
                        unit_slug,
                        entry.source_file,
                        faction_slug,
                    ),
                    "source_file": entry.source_file,
                    "source_mode": entry.source_mode,
                    "bsdata_unit_name": entry.name,
                },
            )

    return sorted(
        records,
        key=lambda record: (
            str(record["rules_faction_slug"]),
            str(record["unit_profile_slug"]),
        ),
    )


def expected_unit_profile_stat_counts(
    index: BsDataIndex,
    repo_root: Path,
) -> dict[str, int]:
    counts = {slug: 0 for slug in CATALOG_SOURCES}

    for record in expected_unit_profile_stats(index, repo_root):
        counts[record["rules_faction_slug"]] += 1

    return counts


def expected_unit_profile_stats(
    index: BsDataIndex,
    repo_root: Path,
) -> list[dict[str, str]]:
    records: list[dict[str, str]] = []

    for profile_record in expected_unit_profiles_with_stats(index, repo_root):
        for stat_record in profile_record["stat_records"]:
            records.append(
                {
                    **stat_record,
                    "rules_faction_slug": str(profile_record["rules_faction_slug"]),
                    "unit_profile_slug": str(profile_record["unit_profile_slug"]),
                    "unit_slug": str(profile_record["unit_slug"]),
                    "source_owner_slug": str(profile_record["source_owner_slug"]),
                    "source_file": str(profile_record["source_file"]),
                    "source_mode": str(profile_record["source_mode"]),
                    "bsdata_unit_name": str(profile_record["bsdata_unit_name"]),
                    "bsdata_profile_name": str(profile_record["bsdata_profile_name"]),
                },
            )

    return sorted(
        records,
        key=lambda record: (
            record["rules_faction_slug"],
            record["unit_profile_stat_slug"],
        ),
    )


def expected_unit_weapon_counts(
    index: BsDataIndex,
    repo_root: Path,
) -> dict[str, int]:
    counts = {slug: 0 for slug in CATALOG_SOURCES}

    for record in expected_unit_weapons(index, repo_root):
        counts[record["rules_faction_slug"]] += 1

    return counts


def expected_unit_weapons(
    index: BsDataIndex,
    repo_root: Path,
) -> list[dict[str, str]]:
    seed_weapon_profile_slugs = load_seed_weapon_profile_slugs(repo_root)
    weapon_profile_slugs_by_weapon = weapon_profile_slugs_by_weapon_slug(
        seed_weapon_profile_slugs,
    )
    records: list[dict[str, str]] = []

    for faction_slug, unit_slug, entry in expected_unit_entry_records(index, repo_root):
        rules_source_slug = unit_rules_source_slug(
            unit_slug,
            entry.source_file,
            faction_slug,
        )
        source_owner_slug = unit_source_owner_slug(
            unit_slug,
            entry.source_file,
            faction_slug,
        )
        for weapon_record in unit_weapon_records_for_unit(
            unit_slug,
            entry,
            rules_source_slug,
            source_owner_slug,
            seed_weapon_profile_slugs,
            weapon_profile_slugs_by_weapon,
        ):
            records.append(
                {
                    **weapon_record,
                    "rules_faction_slug": faction_slug,
                    "unit_slug": unit_slug,
                    "rules_source_slug": rules_source_slug,
                    "source_owner_slug": source_owner_slug,
                    "source_file": entry.source_file,
                    "source_mode": entry.source_mode,
                    "bsdata_unit_name": entry.name,
                },
            )

    return sorted(
        records,
        key=lambda record: (
            record["rules_faction_slug"],
            record["unit_weapon_slug"],
        ),
    )


def unit_weapon_records_for_unit(
    unit_slug: str,
    entry: UnitEntry,
    rules_source_slug: str,
    source_owner_slug: str,
    seed_weapon_profile_slugs: set[str],
    weapon_profile_slugs_by_weapon: dict[str, list[str]],
) -> list[dict[str, str]]:
    profiles = [
        profile
        for profile in entry.element.findall(".//bs:profile", BS_NS)
        if profile.attrib.get("typeName") in WEAPON_PROFILE_TYPES
    ]
    duplicate_counts: dict[str, int] = {}
    resolved_profiles: list[dict[str, str]] = []

    for profile in profiles:
        weapon_name = profile.attrib.get("name", "")
        weapon_slug = normalize_slug(weapon_name)
        weapon_profile_slug = seed_weapon_profile_slug(
            weapon_slug,
            rules_source_slug,
            source_owner_slug,
            seed_weapon_profile_slugs,
            weapon_profile_slugs_by_weapon,
        )
        duplicate_counts[weapon_profile_slug] = (
            duplicate_counts.get(weapon_profile_slug, 0) + 1
        )
        resolved_profiles.append(
            {
                "weapon_slug": weapon_slug,
                "weapon_profile_slug": weapon_profile_slug,
                "weapon_type": weapon_type_for_profile(profile),
                "bsdata_weapon_name": weapon_name,
                "bsdata_weapon_profile_id": profile.attrib.get("id", ""),
            },
        )

    records: list[dict[str, str]] = []
    duplicate_indices: dict[str, int] = {}
    for profile_record in resolved_profiles:
        weapon_profile_slug = profile_record["weapon_profile_slug"]
        unit_weapon_slug = f"{unit_slug}__{weapon_profile_slug}"

        if duplicate_counts[weapon_profile_slug] > 1:
            duplicate_indices[weapon_profile_slug] = (
                duplicate_indices.get(weapon_profile_slug, 0) + 1
            )
            suffix = (
                normalize_slug(profile_record["bsdata_weapon_profile_id"])
                or str(duplicate_indices[weapon_profile_slug])
            )
            unit_weapon_slug = f"{unit_weapon_slug}__{suffix}"

        records.append(
            {
                **profile_record,
                "unit_weapon_slug": unit_weapon_slug,
            },
        )

    return records


def seed_weapon_profile_slug(
    weapon_slug: str,
    rules_source_slug: str,
    source_owner_slug: str,
    seed_weapon_profile_slugs: set[str],
    weapon_profile_slugs_by_weapon: dict[str, list[str]],
) -> str:
    exact_slug = f"{weapon_slug}__10e__{rules_source_slug}"
    if exact_slug in seed_weapon_profile_slugs:
        return exact_slug

    candidates = weapon_profile_slugs_by_weapon.get(weapon_slug, [])
    if not candidates:
        return exact_slug

    owner_phrase = source_owner_slug
    owner_matches = [
        candidate
        for candidate in candidates
        if owner_phrase in candidate.split("__10e__", 1)[1]
    ]
    if owner_matches:
        return owner_matches[0]

    return candidates[0]


def weapon_profile_slugs_by_weapon_slug(
    seed_weapon_profile_slugs: set[str],
) -> dict[str, list[str]]:
    by_weapon_slug: dict[str, list[str]] = {}

    for weapon_profile_slug in sorted(seed_weapon_profile_slugs):
        weapon_slug = weapon_profile_slug.split("__10e__", 1)[0]
        by_weapon_slug.setdefault(weapon_slug, []).append(weapon_profile_slug)

    return by_weapon_slug


def weapon_type_for_profile(profile: ET.Element) -> str:
    if profile.attrib.get("typeName") == "Melee Weapons":
        return "melee"

    return "ranged"


def expected_unit_entry_records(
    index: BsDataIndex,
    repo_root: Path,
) -> Iterable[tuple[str, str, UnitEntry]]:
    seed_unit_slugs = load_seed_unit_slugs(repo_root)

    for faction_slug, sources in CATALOG_SOURCES.items():
        unit_entries: "OrderedDict[str, UnitEntry]" = OrderedDict()

        for mode, filename in sources:
            for entry in source_unit_entries(index, mode, filename):
                unit_slug = seed_unit_slug(entry.name, seed_unit_slugs)
                if not include_unit_for_faction(unit_slug, faction_slug):
                    continue
                unit_entries[unit_slug] = entry

        for unit_slug, entry in unit_entries.items():
            yield faction_slug, unit_slug, entry


def unit_profile_records_for_unit(
    unit_slug: str,
    entry: UnitEntry,
) -> list[dict[str, str | list[dict[str, str]] | None]]:
    profiles = [
        profile
        for profile in entry.element.findall(".//bs:profile", BS_NS)
        if profile.attrib.get("typeName") == "Unit"
    ]
    duplicate_counts: dict[str, int] = {}

    for profile in profiles:
        profile_slug = normalize_slug(profile.attrib.get("name", entry.name))
        duplicate_counts[profile_slug] = duplicate_counts.get(profile_slug, 0) + 1

    records: list[dict[str, str | list[dict[str, str]] | None]] = []
    for index, profile in enumerate(profiles, start=1):
        bsdata_profile_name = profile.attrib.get("name", entry.name)
        profile_slug = normalize_slug(bsdata_profile_name)
        unit_profile_slug = f"{unit_slug}__10e__{profile_slug}"

        if duplicate_counts[profile_slug] > 1:
            suffix = normalize_slug(profile.attrib.get("id", "")) or str(index)
            unit_profile_slug = f"{unit_profile_slug}__{suffix}"

        records.append(
            {
                "unit_profile_slug": unit_profile_slug,
                "unit_profile_name": (
                    f"{display_unit_name(entry.name)} - "
                    f"{display_model_name(bsdata_profile_name)}"
                ),
                "model_slug": None,
                "bsdata_profile_name": bsdata_profile_name,
                "bsdata_profile_id": profile.attrib.get("id", ""),
                "stat_records": characteristic_records_for_profile(
                    profile,
                    unit_profile_slug,
                ),
            },
        )

    return records


def characteristic_records_for_profile(
    profile: ET.Element,
    unit_profile_slug: str,
) -> list[dict[str, str]]:
    characteristics = profile.findall(".//bs:characteristic", BS_NS)
    duplicate_counts: dict[str, int] = {}

    for characteristic in characteristics:
        stat_slug = normalize_slug(characteristic.attrib.get("name", "stat"))
        duplicate_counts[stat_slug] = duplicate_counts.get(stat_slug, 0) + 1

    records: list[dict[str, str]] = []
    for index, characteristic in enumerate(characteristics, start=1):
        raw_stat_key = characteristic.attrib.get("name", "Stat")
        stat_slug = normalize_slug(raw_stat_key)
        unit_profile_stat_slug = f"{unit_profile_slug}__{stat_slug}"

        if duplicate_counts[stat_slug] > 1:
            suffix = normalize_slug(characteristic.attrib.get("typeId", "")) or str(index)
            unit_profile_stat_slug = f"{unit_profile_stat_slug}__{suffix}"

        records.append(
            {
                "unit_profile_stat_slug": unit_profile_stat_slug,
                "stat_key": display_stat_key(raw_stat_key),
                "stat_value": clean_bsdata_text(characteristic.text or ""),
                "bsdata_characteristic_name": raw_stat_key,
                "bsdata_characteristic_type_id": characteristic.attrib.get("typeId", ""),
            },
        )

    return records


def display_stat_key(stat_key: str) -> str:
    return {
        "LD": "Ld",
        "SV": "Sv",
    }.get(stat_key, stat_key)


def point_cost_records_for_unit(entry: ET.Element) -> list[dict[str, str | int]]:
    min_model_count, max_model_count = unit_model_count_bounds(entry)
    raw_records: list[dict[str, str | int]] = []
    seen_values: set[int] = set()

    for cost in entry.findall(".//bs:cost", BS_NS):
        if cost.attrib.get("name") != "pts" or cost.attrib.get("value") is None:
            continue
        unit_points = int(float(cost.attrib["value"]))
        if unit_points in seen_values:
            continue
        seen_values.add(unit_points)
        raw_records.append(
            {
                "model_count": min_model_count,
                "unit_points": unit_points,
                "cost_kind": "cost",
            },
        )

    thresholds = point_modifier_thresholds(entry)
    for index, modifier in enumerate(point_modifiers(entry)):
        unit_points = int(float(modifier.attrib["value"]))
        if unit_points in seen_values:
            continue
        seen_values.add(unit_points)
        raw_records.append(
            {
                "model_count": model_count_for_point_modifier(
                    modifier,
                    thresholds,
                    max_model_count,
                    index,
                ),
                "unit_points": unit_points,
                "cost_kind": modifier.attrib.get("type", "modifier"),
            },
        )

    return with_unique_point_cost_model_counts(raw_records)


def point_modifiers(entry: ET.Element) -> list[ET.Element]:
    return [
        modifier
        for modifier in entry.findall(".//bs:modifier", BS_NS)
        if (
            modifier.attrib.get("field") == POINTS_FIELD_ID
            and modifier.attrib.get("value") is not None
        )
    ]


def point_modifier_thresholds(entry: ET.Element) -> list[int]:
    thresholds: set[int] = set()

    for modifier in point_modifiers(entry):
        threshold = point_modifier_threshold(modifier)
        if threshold is not None:
            thresholds.add(threshold)

    return sorted(thresholds)


def point_modifier_threshold(modifier: ET.Element) -> int | None:
    for condition in modifier.findall(".//bs:condition", BS_NS):
        if (
            condition.attrib.get("field") == "selections"
            and condition.attrib.get("value") is not None
        ):
            return int(float(condition.attrib["value"]))

    return None


def model_count_for_point_modifier(
    modifier: ET.Element,
    thresholds: list[int],
    max_model_count: int,
    index: int,
) -> int:
    threshold = point_modifier_threshold(modifier)
    if threshold is None:
        return max_model_count + index

    condition_type = ""
    condition = modifier.find(".//bs:condition", BS_NS)
    if condition is not None:
        condition_type = condition.attrib.get("type", "")

    if condition_type == "equalTo":
        return threshold
    if condition_type in {"lessThan", "atMost"}:
        return max(1, threshold - 1)

    higher_thresholds = [value for value in thresholds if value > threshold]
    if higher_thresholds:
        return higher_thresholds[0] - 1

    return max_model_count


def with_unique_point_cost_model_counts(
    records: list[dict[str, str | int]],
) -> list[dict[str, str | int]]:
    used_counts: set[int] = set()
    results: list[dict[str, str | int]] = []

    for index, record in enumerate(records):
        model_count = int(record["model_count"])
        while model_count in used_counts:
            model_count += 1
        used_counts.add(model_count)
        results.append({**record, "model_count": model_count})

    return results


def unit_model_count_bounds(entry: ET.Element) -> tuple[int, int]:
    if entry.attrib.get("type") == "model":
        return (1, 1)

    model_entries = [
        model
        for model in entry.findall(".//bs:selectionEntry", BS_NS)
        if model.attrib.get("type") == "model"
    ]
    if not model_entries:
        return (1, 1)

    min_count = sum(
        selection_count_with_default(model, "min", default=0)
        for model in model_entries
    )
    max_count = sum(
        selection_count_with_default(model, "max", default=0)
        for model in model_entries
    )

    return (max(1, min_count), max(max_count, min_count, 1))


def model_records_for_unit(
    entry: ET.Element,
    fallback_model_name: str,
) -> list[dict[str, str | int]]:
    if entry.attrib.get("type") == "model":
        return [model_record_from_selection(entry, fallback_model_name)]

    records = [
        model_record_from_selection(model, model.attrib["name"])
        for model in entry.findall(".//bs:selectionEntry", BS_NS)
        if model.attrib.get("type") == "model" and model.attrib.get("name")
    ]

    return records or [model_record_from_selection(entry, fallback_model_name)]


def model_record_from_selection(
    selection: ET.Element,
    model_name: str,
) -> dict[str, str | int]:
    return {
        "model_slug": normalize_slug(model_name),
        "model_name": display_model_name(model_name),
        "minimum_model_count": selection_count(selection, "min"),
        "maximum_model_count": selection_count(selection, "max"),
        "bsdata_model_name": model_name,
        "bsdata_model_id": selection.attrib.get("id", ""),
    }


def with_unit_model_slugs(
    unit_slug: str,
    model_records: list[dict[str, str | int]],
) -> list[dict[str, str | int]]:
    duplicate_counts: dict[str, int] = {}
    for record in model_records:
        model_slug = str(record["model_slug"])
        duplicate_counts[model_slug] = duplicate_counts.get(model_slug, 0) + 1

    results: list[dict[str, str | int]] = []
    for index, record in enumerate(model_records, start=1):
        model_slug = str(record["model_slug"])
        unit_model_slug = f"{unit_slug}__{model_slug}"
        if duplicate_counts[model_slug] > 1:
            bsdata_model_id = str(record["bsdata_model_id"])
            suffix = normalize_slug(bsdata_model_id) or str(index)
            unit_model_slug = f"{unit_model_slug}__{suffix}"

        results.append({**record, "unit_model_slug": unit_model_slug})

    return results


def selection_count(selection: ET.Element, count_type: str) -> int:
    return selection_count_with_default(selection, count_type, default=1)


def selection_count_with_default(
    selection: ET.Element,
    count_type: str,
    *,
    default: int,
) -> int:
    for constraint in selection.findall("./bs:constraints/bs:constraint", BS_NS):
        if (
            constraint.attrib.get("type") == count_type
            and constraint.attrib.get("field") == "selections"
            and constraint.attrib.get("value") is not None
        ):
            return int(float(constraint.attrib["value"]))

    return default


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
            if not include_unit_for_faction(unit_slug, faction_slug):
                continue

            record = {
                "rules_faction_slug": faction_slug,
                "unit_slug": unit_slug,
                "unit_name": display_unit_name(entry.name),
                "bsdata_unit_name": entry.name,
                "unit_access_type": unit_access_type(
                    unit_slug,
                    faction_slug,
                    entry.source_file,
                ),
                "source_file": entry.source_file,
                "source_mode": entry.source_mode,
            }
            rules_source_override = unit_rules_source_override(unit_slug)
            if rules_source_override is not None:
                record["rules_source_slug"] = rules_source_override

            records.append(
                record,
            )

    return sorted(
        records,
        key=lambda record: (record["rules_faction_slug"], record["unit_slug"]),
    )


def expected_rules_faction_detachment_counts(index: BsDataIndex) -> dict[str, int]:
    counts = {slug: 0 for slug in CATALOG_SOURCES}

    for record in expected_rules_faction_detachments(index):
        counts[record["rules_faction_slug"]] += 1

    return counts


def expected_rules_faction_detachments(index: BsDataIndex) -> list[dict[str, str]]:
    records: list[dict[str, str]] = []

    for faction_slug, sources in CATALOG_SOURCES.items():
        detachment_entries: "OrderedDict[str, dict[str, str]]" = OrderedDict()
        primary_filename = primary_catalog_filename(faction_slug, sources)

        for mode, filename in sources:
            for entry in source_detachment_entries(
                index,
                filename=filename,
                primary_filename=primary_filename,
            ):
                detachment_slug = seed_detachment_slug(entry["detachment_name"])
                detachment_entries[detachment_slug] = {
                    "rules_faction_slug": faction_slug,
                    "detachment_slug": detachment_slug,
                    "detachment_name": display_detachment_name(
                        entry["detachment_name"],
                    ),
                    "detachment_access_type": detachment_access_type(
                        faction_slug,
                        entry,
                        index.catalogue_id(primary_filename),
                    ),
                    "rules_source_slug": DEFAULT_RULES_SOURCE_BY_FACTION[
                        faction_slug
                    ],
                    "source_file": filename,
                    "source_mode": mode,
                    "bsdata_detachment_name": entry["detachment_name"],
                }

        records.extend(detachment_entries.values())

    return sorted(
        records,
        key=lambda record: (
            record["rules_faction_slug"],
            record["detachment_slug"],
        ),
    )


def expected_leader_eligibility_counts(
    index: BsDataIndex,
    repo_root: Path,
) -> dict[str, int]:
    counts = {slug: 0 for slug in CATALOG_SOURCES}

    for record in expected_leader_eligibilities(index, repo_root):
        counts[record["rules_faction_slug"]] += 1

    return counts


def expected_leader_eligibilities(
    index: BsDataIndex,
    repo_root: Path,
) -> list[dict[str, str | None]]:
    seed_unit_slugs = load_seed_unit_slugs(repo_root)
    records: list[dict[str, str | None]] = []

    for faction_slug, sources in CATALOG_SOURCES.items():
        faction_records: "OrderedDict[str, dict[str, str | None]]" = OrderedDict()

        for mode, filename in sources:
            for entry in source_unit_entries(index, mode, filename):
                leader_unit_slug = seed_unit_slug(entry.name, seed_unit_slugs)
                if not include_unit_for_faction(leader_unit_slug, faction_slug):
                    continue

                for profile in entry.element.findall(".//bs:profile", BS_NS):
                    if (
                        profile.attrib.get("name") != "Leader"
                        or profile.attrib.get("typeName") != "Abilities"
                    ):
                        continue

                    for target_name in leader_target_names(profile):
                        target_unit_slug = leader_target_unit_slug(
                            target_name,
                            seed_unit_slugs,
                        )
                        target_kind = (
                            "unit"
                            if target_unit_slug is not None
                            else "keyword_predicate"
                        )
                        target_slug = (
                            target_unit_slug
                            if target_unit_slug is not None
                            else f"keyword_{normalize_slug(target_name)}"
                        )
                        leader_eligibility_slug = (
                            f"{leader_unit_slug}__{target_slug}"
                        )

                        faction_records[leader_eligibility_slug] = {
                            "rules_faction_slug": faction_slug,
                            "leader_eligibility_slug": leader_eligibility_slug,
                            "leader_unit_slug": leader_unit_slug,
                            "target_unit_slug": target_unit_slug,
                            "target_kind": target_kind,
                            "target_text": display_leader_target_name(target_name),
                            "rules_source_slug": unit_rules_source_slug(
                                leader_unit_slug,
                                filename,
                                faction_slug,
                            ),
                            "source_owner_slug": unit_source_owner_slug(
                                leader_unit_slug,
                                filename,
                                faction_slug,
                            ),
                            "source_file": filename,
                            "source_mode": mode,
                            "bsdata_leader_name": entry.name,
                            "bsdata_target_name": target_name,
                        }

        records.extend(faction_records.values())

    return sorted(
        records,
        key=lambda record: (
            str(record["rules_faction_slug"]),
            str(record["leader_eligibility_slug"]),
        ),
    )


def expected_leader_eligibility_keyword_counts(
    index: BsDataIndex,
    repo_root: Path,
) -> dict[str, int]:
    counts = {slug: 0 for slug in CATALOG_SOURCES}

    for record in expected_leader_eligibility_keywords(index, repo_root):
        counts[record["rules_faction_slug"]] += 1

    return counts


def expected_leader_eligibility_keywords(
    index: BsDataIndex,
    repo_root: Path,
) -> list[dict[str, str]]:
    seed_keyword_slugs = load_seed_keyword_slugs(repo_root)
    records: list[dict[str, str]] = []

    for record in expected_leader_eligibilities(index, repo_root):
        if record["target_kind"] != "keyword_predicate":
            continue

        keyword_slugs = leader_target_keyword_slugs(record, seed_keyword_slugs)
        for keyword_slug in keyword_slugs:
            leader_eligibility_slug = str(record["leader_eligibility_slug"])
            records.append(
                {
                    "rules_faction_slug": str(record["rules_faction_slug"]),
                    "leader_eligibility_slug": leader_eligibility_slug,
                    "leader_eligibility_keyword_slug": (
                        f"{leader_eligibility_slug}__{keyword_slug}"
                    ),
                    "keyword_slug": keyword_slug,
                    "source_owner_slug": str(record["source_owner_slug"]),
                    "target_text": str(record["target_text"]),
                },
            )

    return sorted(
        records,
        key=lambda record: (
            record["rules_faction_slug"],
            record["leader_eligibility_keyword_slug"],
        ),
    )


def leader_target_keyword_slugs(
    record: dict[str, str | None],
    seed_keyword_slugs: set[str],
) -> list[str]:
    leader_unit_slug = str(record["leader_unit_slug"])
    target_slug = str(record["leader_eligibility_slug"]).split("__keyword_", 1)[1]

    if leader_unit_slug == "daemonic_charioteer_crucible":
        god_keyword = daemon_god_keyword(target_slug)
        if god_keyword:
            return ["mounted", "daemon", god_keyword]

    if leader_unit_slug == "daemonic_herald_crucible":
        god_keyword = daemon_god_keyword(target_slug)
        if god_keyword:
            return ["infantry", "daemon", god_keyword]

    keyword_slugs = LEADER_TARGET_KEYWORD_ALIASES.get(target_slug)
    if keyword_slugs is None and target_slug in seed_keyword_slugs:
        keyword_slugs = [target_slug]

    if keyword_slugs is None:
        return []

    return [
        keyword_slug
        for keyword_slug in keyword_slugs
        if keyword_slug in seed_keyword_slugs
    ]


def daemon_god_keyword(target_slug: str) -> str | None:
    for god_keyword in CHAOS_DAEMON_GOD_KEYWORDS:
        if target_slug == god_keyword or target_slug.endswith(f"_{god_keyword}"):
            return god_keyword

    return None


def rules_source_slug_for_catalog_file(filename: str, faction_slug: str) -> str:
    return RULES_SOURCE_BY_CATALOG_FILE.get(
        filename,
        DEFAULT_RULES_SOURCE_BY_FACTION[faction_slug],
    )


def source_owner_slug_for_catalog_file(filename: str, faction_slug: str) -> str:
    return OWNER_SLUG_BY_CATALOG_FILE.get(filename, faction_slug)


def include_unit_for_faction(unit_slug: str, faction_slug: str) -> bool:
    override = UNIT_MEMBERSHIP_OVERRIDES.get(unit_slug)
    if not override:
        return True

    return faction_slug in override["faction_slugs"]


def unit_access_type(unit_slug: str, faction_slug: str, filename: str) -> str:
    override = UNIT_MEMBERSHIP_OVERRIDES.get(unit_slug)
    if override and "unit_access_type" in override:
        return str(override["unit_access_type"])

    if filename == "Imperium - Space Marines.cat" and faction_slug != "space_marines":
        return "shared"

    return "exclusive"


def unit_rules_source_slug(unit_slug: str, filename: str, faction_slug: str) -> str:
    override = unit_rules_source_override(unit_slug)
    if override is not None:
        return override

    return rules_source_slug_for_catalog_file(filename, faction_slug)


def unit_rules_source_override(unit_slug: str) -> str | None:
    override = UNIT_MEMBERSHIP_OVERRIDES.get(unit_slug)
    if override and "rules_source_slug" in override:
        return str(override["rules_source_slug"])

    return None


def unit_source_owner_slug(unit_slug: str, filename: str, faction_slug: str) -> str:
    override = UNIT_MEMBERSHIP_OVERRIDES.get(unit_slug)
    if override and "source_owner_slug" in override:
        return str(override["source_owner_slug"])

    return source_owner_slug_for_catalog_file(filename, faction_slug)


def leader_target_names(profile: ET.Element) -> list[str]:
    description = " ".join(
        characteristic.text or ""
        for characteristic in profile.findall(".//bs:characteristic", BS_NS)
        if characteristic.attrib.get("name") == "Description"
    )
    description = clean_bsdata_text(description, collapse_whitespace=False)

    match = re.search(
        r"following units?:\s*(.*)",
        description,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if not match:
        return []

    raw_list = match.group(1).strip()
    bullet_items = leader_bullet_items(raw_list)
    if bullet_items:
        return bullet_items

    return leader_inline_items(raw_list)


def leader_bullet_items(raw_list: str) -> list[str]:
    items: list[str] = []
    started = False

    for line in raw_list.splitlines():
        stripped = line.strip()
        if not stripped:
            continue

        bullet_match = re.match(r"^(?:[-•■])\s*(.+)$", stripped)
        if bullet_match:
            started = True
            item = clean_leader_target_name(bullet_match.group(1))
            if item:
                items.append(item)
            continue

        if started:
            break

    return items


def leader_inline_items(raw_list: str) -> list[str]:
    text = re.split(
        r"\s+\*?(?:This model|This unit|You can|If you|If a|While this model|In addition)\b",
        raw_list,
        maxsplit=1,
    )[0]
    text = re.split(r"\n\s*\n", text, maxsplit=1)[0]
    text = re.sub(r"\([^)]*\)", "", text)
    text = text.replace(";", ",")

    if "\n" in text:
        text = text.replace("\n", ",")

    parts = [clean_leader_target_name(part) for part in text.split(",")]
    return [part for part in parts if part]


def clean_bsdata_text(text: str, *, collapse_whitespace: bool = True) -> str:
    text = text.replace("\xa0", " ")
    text = re.sub(r"\^\^|\*\*", "", text)
    text = text.replace("■", "\n■")
    text = text.replace("•", "\n•")
    if collapse_whitespace:
        text = re.sub(r"\s+", " ", text)
    return text.strip()


def clean_leader_target_name(name: str) -> str:
    name = clean_bsdata_text(name)
    name = re.sub(r"\([^)]*\)", "", name)
    name = name.strip(" .,:;*-")
    return re.sub(r"\s+", " ", name).strip()


def leader_target_unit_slug(
    target_name: str,
    seed_unit_slugs: set[str],
) -> str | None:
    target_slug = seed_unit_slug(target_name, seed_unit_slugs)
    target_slug = LEADER_TARGET_SLUG_ALIASES.get(target_slug, target_slug)

    if target_slug in seed_unit_slugs:
        return target_slug

    return None


def display_leader_target_name(name: str) -> str:
    if name.isupper():
        return name.title()

    return name


def source_detachment_entries(
    index: BsDataIndex,
    *,
    filename: str,
    primary_filename: str,
) -> list[dict[str, str]]:
    catalogue = index.catalogue(filename)
    primary_catalogue_id = index.catalogue_id(primary_filename)
    entries: list[dict[str, str]] = []

    for group in catalogue.findall(".//bs:selectionEntryGroup", BS_NS):
        if group.attrib.get("name") in {"Detachment", "Detachments"}:
            entries.extend(
                detachment_entries_from_group(
                    group,
                    filename,
                    primary_catalogue_id,
                ),
            )

    for link in catalogue.findall("./bs:entryLinks/bs:entryLink", BS_NS):
        if "Detach" not in link.attrib.get("name", ""):
            continue

        if link.attrib.get("type") == "selectionEntry":
            entry = index.resolve_selection_entry(link.attrib.get("targetId"))
            if entry is not None:
                entries.extend(
                    detachment_entries_from_entry(
                        index,
                        entry,
                        filename,
                        primary_catalogue_id,
                    ),
                )
        elif link.attrib.get("type") == "selectionEntryGroup":
            group = index.resolve_selection_entry_group(link.attrib.get("targetId"))
            if group is not None:
                entries.extend(
                    detachment_entries_from_group(
                        group,
                        filename,
                        primary_catalogue_id,
                    ),
                )

    unique_entries: "OrderedDict[str, dict[str, str]]" = OrderedDict()
    for entry in entries:
        unique_entries[seed_detachment_slug(entry["detachment_name"])] = entry

    return list(unique_entries.values())


def detachment_entries_from_entry(
    index: BsDataIndex,
    entry: ET.Element,
    source_file: str,
    primary_catalogue_id: str,
) -> list[dict[str, str]]:
    entries: list[dict[str, str]] = []

    for link in entry.findall(".//bs:entryLink", BS_NS):
        if link.attrib.get("type") != "selectionEntryGroup":
            continue

        group = index.resolve_selection_entry_group(link.attrib.get("targetId"))
        if group is not None:
            entries.extend(
                detachment_entries_from_group(
                    group,
                    source_file,
                    primary_catalogue_id,
                ),
            )

    for group in entry.findall(".//bs:selectionEntryGroup", BS_NS):
        if group.attrib.get("name") in {"Detachment", "Detachments"}:
            entries.extend(
                detachment_entries_from_group(
                    group,
                    source_file,
                    primary_catalogue_id,
                ),
            )

    return entries


def detachment_entries_from_group(
    group: ET.Element,
    source_file: str,
    primary_catalogue_id: str,
) -> list[dict[str, str]]:
    entries: list[dict[str, str]] = []

    for entry in group.findall("./bs:selectionEntries/bs:selectionEntry", BS_NS):
        if entry.attrib.get("type") != "upgrade":
            continue
        if is_hidden_for_primary_catalogue(entry, primary_catalogue_id):
            continue

        entries.append(
            {
                "detachment_name": entry.attrib["name"],
                "source_file": source_file,
                "visibility": detachment_visibility(entry, primary_catalogue_id),
            },
        )

    return entries


def is_hidden_for_primary_catalogue(
    entry: ET.Element,
    primary_catalogue_id: str,
) -> bool:
    if entry.attrib.get("hidden") == "true":
        return True

    for modifier in entry.findall("./bs:modifiers/bs:modifier", BS_NS):
        if (
            modifier.attrib.get("field") != "hidden"
            or modifier.attrib.get("value") != "true"
        ):
            continue

        conditions = modifier.findall(".//bs:condition", BS_NS)
        if not conditions:
            return True

        condition_values = [
            condition_matches_primary_catalogue(condition, primary_catalogue_id)
            for condition in conditions
        ]
        if condition_values and all(condition_values):
            return True

    return False


def condition_matches_primary_catalogue(
    condition: ET.Element,
    primary_catalogue_id: str,
) -> bool:
    condition_type = condition.attrib.get("type")
    child_id = condition.attrib.get("childId")

    if condition_type == "instanceOf":
        return child_id == primary_catalogue_id
    if condition_type == "notInstanceOf":
        return child_id != primary_catalogue_id

    return False


def detachment_visibility(
    entry: ET.Element,
    primary_catalogue_id: str,
) -> str:
    for modifier in entry.findall("./bs:modifiers/bs:modifier", BS_NS):
        if (
            modifier.attrib.get("field") != "hidden"
            or modifier.attrib.get("value") != "true"
        ):
            continue

        for condition in modifier.findall(".//bs:condition", BS_NS):
            if (
                condition.attrib.get("type") == "notInstanceOf"
                and condition.attrib.get("childId") == primary_catalogue_id
            ):
                return "primary_only"

    return "generic"


def detachment_access_type(
    faction_slug: str,
    entry: dict[str, str],
    primary_catalogue_id: str,
) -> str:
    if (
        entry["source_file"] == "Imperium - Space Marines.cat"
        and faction_slug != "space_marines"
        and entry["visibility"] != "primary_only"
    ):
        return "shared"

    return "exclusive"


def primary_catalog_filename(
    faction_slug: str,
    sources: list[tuple[str, str]],
) -> str:
    if faction_slug in SPACE_MARINE_PRIMARY_CATALOG_BY_FACTION:
        return SPACE_MARINE_PRIMARY_CATALOG_BY_FACTION[faction_slug]

    return PRIMARY_CATALOG_BY_FACTION.get(faction_slug, sources[0][1])


def seed_detachment_slug(name: str) -> str:
    slug = f"{normalize_slug(name)}_detachment"
    return DETACHMENT_SLUG_ALIASES.get(slug, slug)


def display_detachment_name(name: str) -> str:
    if name.endswith(" Detachment"):
        return name

    return f"{name} Detachment"


def load_seed_unit_slugs(repo_root: Path) -> set[str]:
    units_path = repo_root / "db/seed_config/seed/data/units.data.ts"
    units_root = repo_root / "db/seed_config/seed/data/units"
    sources: list[str] = []

    if units_path.exists():
        sources.append(units_path.read_text())

    if units_root.exists():
        for path in sorted(units_root.rglob("*.data.ts")):
            if path.name.startswith("_index."):
                continue
            sources.append(path.read_text())

    return set(re.findall(r'unit_slug: "([^"]+)"', "\n".join(sources)))


def load_seed_keyword_slugs(repo_root: Path) -> set[str]:
    keywords_path = repo_root / "db/seed_config/seed/data/keywords.data.ts"
    if not keywords_path.exists():
        return set()

    return set(
        re.findall(r'keyword_slug: "([^"]+)"', keywords_path.read_text()),
    )


def load_seed_weapon_profile_slugs(repo_root: Path) -> set[str]:
    weapon_profiles_path = (
        repo_root / "db/seed_config/seed/data/weapon_profiles.data.ts"
    )
    if not weapon_profiles_path.exists():
        return set()

    return set(
        re.findall(
            r'weapon_profile_slug: "([^"]+)"',
            weapon_profiles_path.read_text(),
        ),
    )


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


def display_model_name(name: str) -> str:
    return re.sub(r"\s*\[Legends\]\s*$", " (Legends)", name).strip()


if __name__ == "__main__":
    main()
