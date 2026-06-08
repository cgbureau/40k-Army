#!/usr/bin/env python3
"""
Parse completed sections of docs/kit_unit_status.md and generate typed TypeScript
dataset entries for kit_units.

A "completed" section is one where the "Models (Manually Added)" and
"Warhammer Kit URL (Manually Added)" columns have real data (not "—" or empty).

Usage:
  python3 scripts/parse-kit-unit-status.py
  python3 scripts/parse-kit-unit-status.py --dry-run   # print what would be generated, no writes

Outputs:
  db/seed_config/seed/data/kit_units/markdown/{faction}.data.ts
  db/seed_config/seed/data/kit_units/markdown/_index.data.ts
  data/kit_unit_status_review.json   (unresolved rows for manual triage)
  Also patches generated_game_data.ids.ts to add new KitUnitSeedSlug entries + ULIDs.

npm script:
  npm run data:parse-kit-unit-status
"""
from __future__ import annotations

import json
import os
import random
import re
import sys
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Literal

# ─── Paths ────────────────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).resolve().parent.parent
KIT_UNIT_STATUS_MD = REPO_ROOT / "docs/kit_unit_status.md"
KIT_UNITS_MARKDOWN_DIR = REPO_ROOT / "db/seed_config/seed/data/kit_units/markdown"
GENERATED_IDS = REPO_ROOT / "db/seed_config/seed/ids/generated_game_data.ids.ts"
REVIEW_LOG = REPO_ROOT / "data/kit_unit_status_review.json"

# ─── ULID ─────────────────────────────────────────────────────────────────────

_ULID_CHARS = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"

def _new_ulid() -> str:
    ts = int(time.time() * 1000)
    rand = random.getrandbits(80)
    val = (ts << 80) | rand
    result = []
    for _ in range(26):
        result.append(_ULID_CHARS[val & 31])
        val >>= 5
    return "".join(reversed(result))

# ─── Data model ───────────────────────────────────────────────────────────────

ComponentType = Literal["complete_unit", "alternate_build", "partial_unit", "upgrade_component"]
SourceKind = Literal["games_workshop_product_page"]

@dataclass
class KitUnitEntry:
    kit_unit_slug: str      # e.g. "adepta_sororitas_arco_flagellants__arco_flagellants__complete_unit"
    kit_slug: str           # e.g. "adepta_sororitas_arco_flagellants"
    unit_slug: str          # e.g. "arco_flagellants"
    unit_count: int
    model_count: int
    component_type: ComponentType
    source_url: str
    source_text: str
    faction_slug: str       # e.g. "adepta_sororitas"

@dataclass
class ReviewEntry:
    faction_slug: str
    kit_name: str
    unit_name: str
    models_text: str
    url: str
    notes: str
    reason: str             # why it went to review

# ─── Slug helpers ─────────────────────────────────────────────────────────────

def _to_snake(text: str) -> str:
    """Naive text → snake_case: lowercase, collapse non-alnum to underscore."""
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    text = text.strip("_")
    return text


def _normalize_for_match(text: str) -> str:
    """Aggressively normalize for fuzzy matching: strip punctuation, lowercase."""
    text = text.lower()
    # Remove common noise words
    text = re.sub(r"\b(the|of|and|in|with|a|an|pattern|variant|sodality|legio)\b", " ", text)
    text = re.sub(r"[^a-z0-9]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _slug_words(slug: str) -> set[str]:
    return set(slug.replace("_", " ").split())


def _jaccard(words_a: set[str], words_b: set[str]) -> float:
    intersection = len(words_a & words_b)
    union = len(words_a | words_b)
    return intersection / union if union else 0.0


def _char_overlap(a: str, b: str) -> float:
    """Character trigram overlap for catching typos like 'Canonness' vs 'canoness'."""
    def trigrams(s: str) -> set[str]:
        return {s[i:i+3] for i in range(len(s) - 2)} if len(s) >= 3 else {s}
    ta, tb = trigrams(a), trigrams(b)
    union = len(ta | tb)
    return len(ta & tb) / union if union else 0.0


def _key_words(norm: str) -> set[str]:
    """Extract meaningful discriminative words (longer than 3 chars)."""
    return {w for w in norm.split() if len(w) > 3}


# Common faction/generic words to exclude from distinctiveness checks
_FACTION_WORDS = {
    "adepta", "adeptus", "sororitas", "custodes", "astartes", "chaos",
    "space", "marine", "marines", "imperial", "guard", "squad", "team",
    "kill", "combat", "patrol", "patrol", "regiment", "force", "detachment",
}


def _distinctive_words(norm: str) -> set[str]:
    """Words that are meaningful for matching (long + not faction-generic)."""
    return {w for w in norm.split() if len(w) > 3 and w not in _FACTION_WORDS}


def _match_kit_slug(kit_name: str, available_kit_slugs: list[str], faction_prefix: str = "") -> str | None:
    """Fuzzy-match a markdown kit name to the closest KitSeedSlug.

    Strategy:
      1. Same-faction slugs: Jaccard >= 0.40 AND at least one distinctive word must overlap
         (prevents "Zephyrim Squad" → "repentia_squad" type mistakes)
      2. Cross-faction slugs: Jaccard >= 0.70 (strict)
    """
    norm = _normalize_for_match(kit_name)
    norm_words = set(norm.split())
    distinct = _distinctive_words(norm)

    # Extract the key faction word (e.g. "sororitas", "custodes") for broader matching.
    # This handles mis-prefixed slugs like "adeptus_sororitas_imagifier" when faction is "adepta_sororitas".
    faction_key = faction_prefix.split("_")[-1] if faction_prefix else ""

    def _is_same_faction(slug: str) -> bool:
        if not faction_prefix:
            return False
        return slug.startswith(faction_prefix) or (faction_key and f"_{faction_key}_" in f"_{slug}_")

    # Separate same-faction vs cross-faction
    faction_slugs = [s for s in available_kit_slugs if _is_same_faction(s)]
    other_slugs = [s for s in available_kit_slugs if s not in faction_slugs]

    def score_slug(slug: str) -> tuple[float, bool]:
        """Returns (jaccard_score, has_distinctive_word_overlap)."""
        slug_norm = _normalize_for_match(slug.replace("_", " "))
        slug_words = set(slug_norm.split())
        slug_distinct = _distinctive_words(slug_norm)
        jac = _jaccard(norm_words, slug_words)
        distinct_overlap = bool(distinct & slug_distinct)
        # Bonus if all distinctive kit words appear in slug
        if distinct and distinct.issubset(slug_words):
            jac += 0.20
        return jac, distinct_overlap

    # Check faction-specific slugs first
    best_faction: tuple[float, str] | None = None
    for slug in faction_slugs:
        s, has_distinct = score_slug(slug)
        # Require both threshold AND distinctive word overlap (unless kit has no distinctive words)
        if has_distinct or not distinct:
            if best_faction is None or s > best_faction[0]:
                best_faction = (s, slug)

    if best_faction and best_faction[0] >= 0.40:
        return best_faction[1]

    # No cross-faction fallback — a kit that doesn't match a same-faction slug
    # goes to the review log rather than getting a wrong-faction match.
    return None


def _match_unit_slug(unit_name: str, available_unit_slugs: list[str]) -> str | None:
    """Fuzzy-match a markdown unit name to the closest UnitSeedSlug.

    Uses both word-level Jaccard and character trigrams to handle typos.
    """
    norm = _normalize_for_match(unit_name)
    norm_words = set(norm.split())

    best_slug: str | None = None
    best_score = 0.0

    for slug in available_unit_slugs:
        slug_norm = _normalize_for_match(slug.replace("_", " "))
        slug_words = set(slug_norm.split())

        word_score = _jaccard(norm_words, slug_words)
        # For single-word unit names (canoness/canonness typo), use char trigrams
        char_score = _char_overlap(norm.replace(" ", ""), slug_norm.replace(" ", ""))
        score = max(word_score, char_score * 0.85)

        if score > best_score:
            best_score = score
            best_slug = slug

    if best_score >= 0.45:
        return best_slug
    return None

# ─── Component type inference ──────────────────────────────────────────────────

def _infer_component_type(unit_name: str, notes: str) -> ComponentType:
    """Infer component_type from the unit name and notes columns."""
    unit_lower = unit_name.lower()
    notes_lower = notes.lower()

    if unit_lower.startswith("partial kit:"):
        return "partial_unit"

    if "alternate build" in notes_lower:
        return "alternate_build"

    return "complete_unit"


def _strip_partial_prefix(unit_name: str) -> str:
    """Strip 'Partial Kit: ...' prefix from unit name."""
    m = re.match(r"^partial kit:\s*(.+)$", unit_name, re.IGNORECASE)
    if m:
        return m.group(1).strip()
    return unit_name

# ─── Model count extraction ────────────────────────────────────────────────────

def _extract_model_count(models_text: str) -> int:
    """Extract total model count from models text like '10x Arco-Flagellants, 1x Incensor Cherub'."""
    # Sum all NxFoo patterns; if multiple alternatives ('or'), take first branch
    first_alt = models_text.split(" or ")[0].strip()
    # Extract all counts
    counts = re.findall(r"(\d+)\s*x\s+", first_alt, re.IGNORECASE)
    if counts:
        return sum(int(c) for c in counts)
    # Fallback: if we can't parse, return 1
    return 1

# ─── Markdown parser ──────────────────────────────────────────────────────────

@dataclass
class MarkdownRow:
    kit_name: str
    unit_name: str
    prices: str
    models_text: str
    url: str
    notes: str

def _parse_table_row(line: str) -> list[str] | None:
    """Parse a markdown table row into cells. Returns None for separator rows."""
    line = line.strip()
    if not line.startswith("|"):
        return None
    # Skip separator rows (---|---)
    if re.match(r"^\|[-:\s|]+\|$", line):
        return None
    cells = [c.strip() for c in line.split("|")]
    # Remove leading/trailing empty strings from split
    if cells and cells[0] == "":
        cells = cells[1:]
    if cells and cells[-1] == "":
        cells = cells[:-1]
    return cells


def _is_completed_row(cells: list[str]) -> bool:
    """A row is 'completed' if its models and URL cells have real data."""
    if len(cells) < 6:
        return False
    models = cells[3].strip()
    url = cells[4].strip()
    # Skip if models or url is missing / placeholder
    skip_markers = {"—", "", "-", "n/a", "see notes", "see notes below table"}
    return (
        models.lower() not in skip_markers
        and url.lower() not in skip_markers
        and url.startswith("http")
    )


def _parse_section(lines: list[str]) -> list[MarkdownRow]:
    """Parse kit rows from the '### ... Kits' table in a section."""
    rows: list[MarkdownRow] = []
    in_table = False

    for line in lines:
        stripped = line.strip()

        # Detect entry into the main Kits table (not the "Units with no kit data" table)
        if re.match(r"###.*Kits\s*$", stripped, re.IGNORECASE):
            in_table = True
            continue

        # Detect exit: another heading
        if stripped.startswith("###") and in_table:
            in_table = False
            continue
        if stripped.startswith("##") and in_table:
            in_table = False
            continue

        if not in_table:
            continue

        # Skip heading-style paragraph lines (non-table content)
        if not stripped.startswith("|"):
            continue

        cells = _parse_table_row(stripped)
        if cells is None:
            continue
        if len(cells) < 5:
            continue

        kit_name = cells[0].strip()
        unit_name = cells[1].strip()
        prices = cells[2].strip() if len(cells) > 2 else ""
        models = cells[3].strip() if len(cells) > 3 else ""
        url = cells[4].strip() if len(cells) > 4 else ""
        notes = cells[5].strip() if len(cells) > 5 else ""

        # Skip header row
        if kit_name.lower() in {"kit", ""}:
            continue

        rows.append(MarkdownRow(
            kit_name=kit_name,
            unit_name=unit_name,
            prices=prices,
            models_text=models,
            url=url,
            notes=notes,
        ))

    return rows


def parse_completed_factions(md_path: Path) -> dict[str, list[MarkdownRow]]:
    """
    Parse kit_unit_status.md and return {faction_slug: [rows]} for completed factions.
    A faction is 'completed' if its Kits table has rows with actual models + URL data.
    """
    content = md_path.read_text(encoding="utf-8")
    lines = content.split("\n")

    # Split into faction sections by ## headings
    factions: dict[str, list[str]] = {}
    current_faction: str | None = None
    current_lines: list[str] = []

    for line in lines:
        m = re.match(r"^## (.+)$", line.strip())
        if m:
            if current_faction:
                factions[current_faction] = current_lines
            faction_name = m.group(1).strip()
            current_faction = faction_name
            current_lines = []
        else:
            current_lines.append(line)

    if current_faction:
        factions[current_faction] = current_lines

    result: dict[str, list[MarkdownRow]] = {}

    for faction_name, section_lines in factions.items():
        # Skip header-only sections
        if faction_name.lower() in {"number of kits", "kit & unit status by faction"}:
            continue

        rows = _parse_section(section_lines)
        if not rows:
            continue

        # Check if this section is "completed" — at least one row has real data
        completed_rows = [r for r in rows if _is_completed_row([
            r.kit_name, r.unit_name, r.prices, r.models_text, r.url, r.notes
        ])]
        if not completed_rows:
            continue

        faction_slug = _to_snake(faction_name)
        result[faction_slug] = completed_rows

    return result

# ─── Load existing slugs from IDs file ────────────────────────────────────────

def _extract_slug_set(content: str, type_name: str) -> set[str]:
    """Extract the set of slugs from a 'type FooSlug = ...' union in the IDs file."""
    pattern = rf"type {re.escape(type_name)} =\n(.*?)(?=\nexport const )"
    m = re.search(pattern, content, re.DOTALL)
    if not m:
        return set()
    return set(re.findall(r'"([^"]+)"', m.group(1)))


def _extract_slug_map(content: str, var_name: str) -> dict[str, str]:
    """Extract the {slug: ulid} map from 'const fooIds: Record<...> = {...}'."""
    pattern = rf"const {re.escape(var_name)}: Record<[^>]+> = \{{(.*?)\}};"
    m = re.search(pattern, content, re.DOTALL)
    if not m:
        return {}
    pairs = re.findall(r'"([^"]+)":\s*"([^"]+)"', m.group(1))
    return dict(pairs)


def load_existing_ids(ids_path: Path) -> tuple[set[str], set[str], dict[str, str]]:
    """
    Returns:
      kit_slugs: set of KitSeedSlug values
      unit_slugs: set of UnitSeedSlug values
      kit_unit_map: {slug: ulid} of existing KitUnitSeedSlug entries
    """
    content = ids_path.read_text(encoding="utf-8")
    kit_slugs = _extract_slug_set(content, "KitSeedSlug")
    unit_slugs = _extract_slug_set(content, "UnitSeedSlug")
    kit_unit_map = _extract_slug_map(content, "kitUnitSeedIds")
    return kit_slugs, unit_slugs, kit_unit_map

# ─── Update generated_game_data.ids.ts ────────────────────────────────────────

def update_ids_file(ids_path: Path, new_entries: dict[str, str]) -> None:
    """
    Patch the KitUnitSeedSlug type union and kitUnitSeedIds map with new entries.
    new_entries: {slug: ulid}
    """
    if not new_entries:
        return

    content = ids_path.read_text(encoding="utf-8")

    # Find the KitUnitSeedSlug type union and extend it.
    # The union can end in either  "..."\n; or "...";
    type_pattern = r"(type KitUnitSeedSlug =\n)((?:  \| \"[^\"]+\"\n?)*?)(;)"
    type_match = re.search(type_pattern, content, re.DOTALL)
    if not type_match:
        # Handle the "never" case
        never_pattern = r"type KitUnitSeedSlug = never;"
        never_match = re.search(never_pattern, content)
        if never_match:
            existing_slugs: set[str] = set()
            # Build fresh union
            slug_lines = "\n".join(f'  | "{slug}"' for slug in sorted(new_entries.keys()))
            replacement = f"type KitUnitSeedSlug =\n{slug_lines};"
            content = content.replace("type KitUnitSeedSlug = never;", replacement)
        else:
            raise RuntimeError("Could not find KitUnitSeedSlug type in IDs file")
    else:
        existing_union = type_match.group(2)
        existing_slugs = set(re.findall(r'"([^"]+)"', existing_union))
        added_slugs = {slug for slug in new_entries if slug not in existing_slugs}
        if added_slugs:
            new_lines = "\n".join(f'  | "{slug}"' for slug in sorted(added_slugs))
            # Replace the last existing entry's trailing semicolon-less newline with the additions
            # Strip trailing newline from existing union to cleanly append
            clean_union = existing_union.rstrip("\n")
            # If last line had no trailing newline (e.g. ends with `"...";`), separate cleanly
            new_union = clean_union + "\n" + new_lines + "\n"
            content = content[: type_match.start(2)] + new_union + content[type_match.start(3) :]

    # Find the kitUnitSeedIds map and extend it
    map_pattern = r"(const kitUnitSeedIds: Record<KitUnitSeedSlug, string> = \{)(.*?)(\};)"
    map_match = re.search(map_pattern, content, re.DOTALL)
    if not map_match:
        raise RuntimeError("Could not find kitUnitSeedIds map in IDs file")

    existing_map_content = map_match.group(2)
    existing_map_slugs = set(re.findall(r'"([^"]+)":', existing_map_content))
    added_entries = {slug: ulid for slug, ulid in new_entries.items() if slug not in existing_map_slugs}

    if added_entries:
        new_lines = "\n".join(f'  "{slug}": "{ulid}",' for slug, ulid in sorted(added_entries.items()))
        # Add after existing entries (before closing brace)
        existing_trimmed = existing_map_content.rstrip()
        if existing_trimmed:
            new_map_content = existing_map_content.rstrip() + "\n" + new_lines + "\n"
        else:
            new_map_content = "\n" + new_lines + "\n"
        content = (
            content[: map_match.start(2)]
            + new_map_content
            + content[map_match.start(3) :]
        )

    ids_path.write_text(content, encoding="utf-8")

# ─── TypeScript codegen ────────────────────────────────────────────────────────

def _ts_variable_name(kit_unit_slug: str) -> str:
    """Convert a kit_unit slug to a PascalCase TS variable name."""
    parts = kit_unit_slug.split("__")
    # Combine all parts, title-case each word
    combined = "_".join(parts)
    words = combined.split("_")
    pascal = "".join(w.capitalize() for w in words if w)
    return pascal + "KitUnit"


def _render_kit_unit_ts(entry: KitUnitEntry) -> str:
    """Render a single KitUnitConfig TypeScript const declaration."""
    var_name = _ts_variable_name(entry.kit_unit_slug)
    source_text_escaped = entry.source_text.replace('"', '\\"')
    return f'''\
export const {var_name}: KitUnitConfig = {{
  id: kitUnitId("{entry.kit_unit_slug}"),
  kit_id: kitId("{entry.kit_slug}"),
  unit_id: unitId("{entry.unit_slug}"),
  unit_count: {entry.unit_count},
  model_count: {entry.model_count},
  component_type: "{entry.component_type}",
  source_kind: "games_workshop_product_page",
  source_url: "{entry.source_url}",
  source_text: "{source_text_escaped}",
  review_status: "needs_review",
  effective_date: null,
  superseded_date: null,
}};'''


def _render_faction_file(faction_slug: str, entries: list[KitUnitEntry]) -> str:
    """Render a complete per-faction TypeScript dataset file."""
    dataset_export_name = f"kitUnitsMarkdown{_pascal(faction_slug)}Dataset"

    const_blocks = "\n\n".join(_render_kit_unit_ts(e) for e in entries)
    record_names = "\n".join(f"    {_ts_variable_name(e.kit_unit_slug)}," for e in entries)

    return f'''\
import type {{
  KitUnitConfig,
  SeedDataset,
}} from "../../../../types/_index.types";
import {{ kitId, kitUnitId, unitId }} from "../../../ids";

/**
 * Kit-to-unit entries parsed from docs/kit_unit_status.md for {faction_slug}.
 * Generated by scripts/parse-kit-unit-status.py.
 * review_status: "needs_review" — verify model counts, component_type, and unit matches.
 */

{const_blocks}

export const {dataset_export_name}: SeedDataset<"kit_units"> = {{
  table: "kit_units",
  records: [
{record_names}
  ] satisfies KitUnitConfig[],
}};
'''


def _pascal(snake: str) -> str:
    return "".join(w.capitalize() for w in snake.split("_"))


def _render_index_file(faction_slugs: list[str]) -> str:
    """Render _index.data.ts that re-exports all faction datasets."""
    imports = "\n".join(
        f'import {{ kitUnitsMarkdown{_pascal(s)}Dataset }} from "./{s}.data";'
        for s in faction_slugs
    )
    exports = "\n".join(f"  kitUnitsMarkdown{_pascal(s)}Dataset," for s in faction_slugs)
    return f'''\
/**
 * Aggregated kit_units dataset from docs/kit_unit_status.md (parsed factions).
 * Generated by scripts/parse-kit-unit-status.py.
 */

{imports}

export const kitUnitsMarkdownDatasets = [
{exports}
];
'''

# ─── Main processing ───────────────────────────────────────────────────────────

def process(dry_run: bool = False) -> None:
    print("Loading existing slugs from generated_game_data.ids.ts…")
    kit_slugs, unit_slugs, existing_kit_unit_map = load_existing_ids(GENERATED_IDS)
    print(f"  Kit slugs: {len(kit_slugs)}")
    print(f"  Unit slugs: {len(unit_slugs)}")
    print(f"  Existing kit_unit slugs: {len(existing_kit_unit_map)}")

    kit_slug_list = sorted(kit_slugs)
    unit_slug_list = sorted(unit_slugs)

    print(f"\nParsing {KIT_UNIT_STATUS_MD}…")
    factions = parse_completed_factions(KIT_UNIT_STATUS_MD)
    print(f"  Completed factions found: {sorted(factions.keys())}")

    # Collect output
    faction_entries: dict[str, list[KitUnitEntry]] = {}
    review_entries: list[dict] = []
    new_kit_unit_slugs: dict[str, str] = {}  # slug → ulid (only freshly minted)

    for faction_slug, rows in sorted(factions.items()):
        print(f"\n── {faction_slug} ({len(rows)} rows) ──")
        entries: list[KitUnitEntry] = []

        for row in rows:
            kit_name = row.kit_name.strip()
            unit_name = row.unit_name.strip()

            # Skip non-kit rows
            unit_lower = unit_name.lower()
            if unit_lower in {"", "multi-unit"} or unit_lower.startswith("n/a"):
                review_entries.append({
                    "faction": faction_slug, "kit": kit_name, "unit": unit_name,
                    "models": row.models_text, "url": row.url, "notes": row.notes,
                    "reason": f"skip_unit_name:{unit_lower or 'empty'}",
                })
                print(f"  SKIP  [{kit_name}] → {unit_name!r} (multi-unit or empty)")
                continue

            # Determine component_type (before stripping "Partial Kit:" prefix)
            component_type = _infer_component_type(unit_name, row.notes)
            unit_name_clean = _strip_partial_prefix(unit_name)

            # Skip if models text is missing
            models_text = row.models_text.strip()
            if not models_text or models_text.lower() in {"—", "see notes", "see notes below table"}:
                review_entries.append({
                    "faction": faction_slug, "kit": kit_name, "unit": unit_name,
                    "models": models_text, "url": row.url, "notes": row.notes,
                    "reason": "no_models_text",
                })
                print(f"  SKIP  [{kit_name}] → missing models text")
                continue

            # Match kit slug — prefer same-faction slugs
            kit_slug = _match_kit_slug(kit_name, kit_slug_list, faction_prefix=faction_slug)
            if not kit_slug:
                review_entries.append({
                    "faction": faction_slug, "kit": kit_name, "unit": unit_name,
                    "models": models_text, "url": row.url, "notes": row.notes,
                    "reason": "no_kit_slug_match",
                })
                print(f"  MISS  kit [{kit_name}] → no match")
                continue

            # Match unit slug
            unit_slug = _match_unit_slug(unit_name_clean, unit_slug_list)
            if not unit_slug:
                review_entries.append({
                    "faction": faction_slug, "kit": kit_name, "unit": unit_name,
                    "models": models_text, "url": row.url, "notes": row.notes,
                    "reason": "no_unit_slug_match",
                    "kit_slug_found": kit_slug,
                })
                print(f"  MISS  unit [{unit_name_clean}] for kit [{kit_slug}] → no match")
                continue

            # Build kit_unit slug
            kit_unit_slug = f"{kit_slug}__{unit_slug}__{component_type}"

            # Get or mint ULID
            if kit_unit_slug in existing_kit_unit_map:
                ulid = existing_kit_unit_map[kit_unit_slug]
            elif kit_unit_slug in new_kit_unit_slugs:
                ulid = new_kit_unit_slugs[kit_unit_slug]
            else:
                ulid = _new_ulid()
                new_kit_unit_slugs[kit_unit_slug] = ulid

            model_count = _extract_model_count(models_text)
            unit_count = 1  # always 1 unit per kit_unit entry

            entry = KitUnitEntry(
                kit_unit_slug=kit_unit_slug,
                kit_slug=kit_slug,
                unit_slug=unit_slug,
                unit_count=unit_count,
                model_count=model_count,
                component_type=component_type,
                source_url=row.url,
                source_text=models_text,
                faction_slug=faction_slug,
            )
            entries.append(entry)
            print(f"  OK    [{kit_slug}] → [{unit_slug}] ({component_type}, {model_count} models)")

        if entries:
            faction_entries[faction_slug] = entries

    # ── Summary ──────────────────────────────────────────────────────────────
    total_entries = sum(len(e) for e in faction_entries.values())
    print(f"\n{'DRY RUN — ' if dry_run else ''}Results:")
    print(f"  Generated entries: {total_entries}")
    print(f"  New kit_unit slugs: {len(new_kit_unit_slugs)}")
    print(f"  Review entries: {len(review_entries)}")

    if dry_run:
        print("\nDry run — no files written.")
        _dump_review(review_entries, dry_run=True)
        return

    # ── Write files ───────────────────────────────────────────────────────────
    KIT_UNITS_MARKDOWN_DIR.mkdir(parents=True, exist_ok=True)

    # Patch IDs file first
    if new_kit_unit_slugs:
        print(f"\nPatching {GENERATED_IDS} with {len(new_kit_unit_slugs)} new slugs…")
        update_ids_file(GENERATED_IDS, new_kit_unit_slugs)

    # Write per-faction files
    for faction_slug, entries in sorted(faction_entries.items()):
        out_path = KIT_UNITS_MARKDOWN_DIR / f"{faction_slug}.data.ts"
        content = _render_faction_file(faction_slug, entries)
        out_path.write_text(content, encoding="utf-8")
        print(f"  Wrote {out_path.relative_to(REPO_ROOT)} ({len(entries)} entries)")

    # Write index file
    if faction_entries:
        index_path = KIT_UNITS_MARKDOWN_DIR / "_index.data.ts"
        index_content = _render_index_file(sorted(faction_entries.keys()))
        index_path.write_text(index_content, encoding="utf-8")
        print(f"  Wrote {index_path.relative_to(REPO_ROOT)}")

    # Write review log
    _dump_review(review_entries, dry_run=False)

    print("\nDone. Next steps:")
    print("  1. Review data/kit_unit_status_review.json for unresolved rows")
    print("  2. Add markdown dataset to kit_units.data.ts aggregation")
    print("  3. Run npm test to verify")


def _dump_review(entries: list[dict], dry_run: bool) -> None:
    if not entries:
        return
    if dry_run:
        print("\nReview entries (dry run):")
        for e in entries:
            print(f"  [{e['reason']}] {e['faction']} / {e['kit']} / {e['unit']}")
    else:
        REVIEW_LOG.parent.mkdir(parents=True, exist_ok=True)
        REVIEW_LOG.write_text(json.dumps(entries, indent=2, ensure_ascii=False) + "\n")
        print(f"  Wrote review log: {REVIEW_LOG.relative_to(REPO_ROOT)} ({len(entries)} entries)")

# ─── CLI ───────────────────────────────────────────────────────────────────────

def main() -> None:
    dry_run = "--dry-run" in sys.argv
    process(dry_run=dry_run)


if __name__ == "__main__":
    main()
