from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

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


@dataclass(frozen=True)
class AbilityCandidate:
    id: str | None
    id_key: str
    ability_slug: str
    ability_name: str
    ability_type: str
    created_at: str
    updated_at: str | None


@dataclass(frozen=True)
class UnitAbilityCandidate:
    id: str | None
    unit_id: str | None
    unit_slug: str
    ability_id: str | None
    ability_slug: str
    game_edition_id: str | None
    game_edition_slug: str
    rules_source_id: str | None
    rules_source_slug: str | None
    rules_text: str
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

    if kind != "abilities":
        raise ValueError(f"Unsupported normalize kind: {kind}")

    abilities, unit_abilities = _extract_abilities(
        manifest_data, include_unit_abilities=include_unit_abilities
    )
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
            "unit_abilities": [candidate.__dict__ for candidate in unit_abilities],
        },
    )
    write_json(output_path, payload)

    if emit_seed_ts:
        seed_output = output_path.with_suffix(".seed-snippets.ts")
        seed_output.write_text(_ability_seed_snippets(abilities), encoding="utf-8")

    return output_path


def _extract_abilities(
    manifest_data: dict[str, Any], *, include_unit_abilities: bool
) -> tuple[list[AbilityCandidate], list[UnitAbilityCandidate]]:
    ability_by_slug: dict[str, AbilityCandidate] = {}
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
            ability_slug = normalize_slug(parsed["ability_name"])
            if not ability_slug:
                continue
            if ability_slug not in ability_by_slug:
                ability_by_slug[ability_slug] = AbilityCandidate(
                    id=None,
                    id_key=ability_slug,
                    ability_slug=ability_slug,
                    ability_name=parsed["ability_name"],
                    ability_type=parsed["ability_type"],
                    created_at=created_at,
                    updated_at=None,
                )
            if include_unit_abilities:
                unit_abilities.append(
                    UnitAbilityCandidate(
                        id=None,
                        unit_id=None,
                        unit_slug=unit_slug,
                        ability_id=None,
                        ability_slug=ability_slug,
                        game_edition_id=None,
                        game_edition_slug=edition,
                        rules_source_id=None,
                        rules_source_slug=None,
                        rules_text=parsed["rules_text"],
                        effective_date=None,
                        superseded_date=None,
                        created_at=created_at,
                        updated_at=None,
                    )
                )

    return (
        sorted(ability_by_slug.values(), key=lambda item: (item.ability_type, item.ability_slug)),
        sorted(unit_abilities, key=lambda item: (item.unit_slug, item.ability_slug)),
    )


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
                    f'  id: abilityId("{ability.id_key}"),',
                    f'  ability_slug: "{ability.ability_slug}",',
                    f'  ability_name: "{ability.ability_name}",',
                    f'  ability_type: "{ability.ability_type}",',
                    "};",
                    "",
                ]
            )
        )
    return "\n".join(blocks)
