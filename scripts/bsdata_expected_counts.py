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

DETACHMENT_SLUG_ALIASES = {
    "haloscreed_battleclade_detachment": "haloscreed_battle_clade_detachment",
    "needga_rd_oathband_detachment": "needgard_oathband_detachment",
    "d_lve_assault_shift_detachment": "dalve_assault_shift_detachment",
}

LEADER_TARGET_SLUG_ALIASES = {
    "legionaires": "legionaries",
    "plague_bearers": "plaguebearers",
    "raiders": "red_corsairs_raiders",
    "storm_guardian": "storm_guardians",
    "sternguard_veterans_squad": "sternguard_veteran_squad",
    "sword_brethren": "sword_brethren_squad",
    "traitor_guardsman_squad": "traitor_guardsmen_squad",
}


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

    seed_unit_slugs = load_seed_unit_slugs(Path(args.repo_root))
    result = {
        slug: expected_counts_for_sources(index, sources, seed_unit_slugs)
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
                            "rules_source_slug": DEFAULT_RULES_SOURCE_BY_FACTION[
                                faction_slug
                            ],
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
        r"\s+(?:This model|This unit|You can|If you|If a|While this model|In addition)\b",
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
