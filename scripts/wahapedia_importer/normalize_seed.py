from __future__ import annotations

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

ABILITY_TYPES = {"core", "faction", "datasheet", "wargear", "other"}
RULE_KEYWORD_SLUGS = {"battleline", "dedicated_transport", "epic_hero"}
FACTION_KEYWORD_SLUGS = {
    "aeldari",
    "adeptus_astartes",
    "chaos",
    "imperium",
    "orks",
    "tyranids",
}

EXCLUDED_ABILITY_SLUGS = {
    "designers_note",
    "designer_note",
}

CANONICAL_ABILITY_ALIASES = {
    "cherubs": "cherub",
}

TEN_E_CODEX_FACTIONS = {
    "adepta_sororitas": "Adepta Sororitas",
    "adeptus_custodes": "Adeptus Custodes",
    "adeptus_mechanicus": "Adeptus Mechanicus",
    "aeldari": "Aeldari",
    "astra_militarum": "Astra Militarum",
    "chaos_knights": "Chaos Knights",
    "chaos_space_marines": "Chaos Space Marines",
    "drukhari": "Drukhari",
    "emperors_children": "Emperor's Children",
    "genestealer_cults": "Genestealer Cults",
    "grey_knights": "Grey Knights",
    "imperial_agents": "Imperial Agents",
    "imperial_knights": "Imperial Knights",
    "leagues_of_votann": "Leagues of Votann",
    "necrons": "Necrons",
    "orks": "Orks",
    "space_marines": "Space Marines",
    "tau_empire": "T'au Empire",
    "thousand_sons": "Thousand Sons",
    "tyranids": "Tyranids",
}

SPACE_MARINE_CODEX_SUPPLEMENTS = {
    "black_templars": "Black Templars",
    "blood_angels": "Blood Angels",
    "dark_angels": "Dark Angels",
    "space_wolves": "Space Wolves",
}

SPACE_MARINE_CHAPTER_SOURCE_NAMES = {
    "black_templars": "Black Templars",
    "blood_angels": "Blood Angels",
    "dark_angels": "Dark Angels",
    "deathwatch": "Deathwatch",
    "space_wolves": "Space Wolves",
}

CANONICAL_RULES_FACTION_SLUGS = {
    "emperor_s_children": "emperors_children",
    "t_au_empire": "tau_empire",
}

CANONICAL_RULES_SOURCE_SLUGS = {
    "faction_pack_adeptus_titanicus_10e_v1_0": "faction_pack_adeptus_titanicus_forge_world_10e_v1_0",
    "codex_unaligned_forces_10e": "legends_unaligned_forces_10e",
}


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

    if kind not in {"abilities", "keywords", "rules-sources", "faction-data"}:
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
            "rules_faction_units": [
                candidate.__dict__ for candidate in rules_faction_units
            ],
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
    candidate: RulesSourceCandidate, default_rules_faction_slug: str | None
) -> str | None:
    source_name_slug = normalize_slug(candidate.source_book_name)
    if candidate.rules_source_type in {"faction_pack", "codex_supplement", "legends"}:
        for chapter_slug, chapter_name in SPACE_MARINE_CHAPTER_SOURCE_NAMES.items():
            if source_name_slug == normalize_slug(chapter_name) or source_name_slug.endswith(
                f"_{chapter_slug}"
            ):
                return _canonical_rules_faction_slug(chapter_slug)
    return _canonical_rules_faction_slug(default_rules_faction_slug)


def _canonical_rules_faction_slug(slug: str | None) -> str | None:
    if slug is None:
        return None
    return CANONICAL_RULES_FACTION_SLUGS.get(slug, slug)


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


def _rules_faction_source_semantics(candidate: RulesSourceCandidate) -> tuple[str, str]:
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
    import json

    return json.dumps(value, ensure_ascii=True)
