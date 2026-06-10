#!/usr/bin/env python3
"""
Parse completed sections of docs/kit_unit_status.md and generate typed TypeScript
dataset entries for kit_units.

The URL column in each row contains a tinyurl that redirects to the GW product page.
That URL's path segment IS the kit's GW slug, which we normalize to a seed slug.
For kits not yet in KitSeedSlug, we add them (new ULID generated).

A "completed" section is one where the "Models (Manually Added)" and
"Warhammer Kit URL (Manually Added)" columns have real data (not "—" or empty).

Usage:
  python3 scripts/parse-kit-unit-status.py
  python3 scripts/parse-kit-unit-status.py --dry-run   # print plan, no writes
  python3 scripts/parse-kit-unit-status.py --no-resolve  # skip URL resolution (use cache only)

npm scripts:
  npm run data:parse-kit-unit-status
  npm run data:parse-kit-unit-status:dry-run
"""
from __future__ import annotations

import json
import random
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Literal

# ─── Paths ────────────────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).resolve().parent.parent
KIT_UNIT_STATUS_MD = REPO_ROOT / "docs/kit_unit_status.md"
KIT_UNITS_MARKDOWN_DIR = REPO_ROOT / "db/seed_config/seed/data/kit_units/markdown"
GENERATED_IDS = REPO_ROOT / "db/seed_config/seed/ids/generated_game_data.ids.ts"
ALGOLIA_OBJECT_IDS = REPO_ROOT / "data/prices/algolia_object_ids.json"
URL_CACHE = REPO_ROOT / "data/kit_unit_url_cache.json"
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

# ─── Types ────────────────────────────────────────────────────────────────────

ComponentType = Literal["complete_unit", "alternate_build", "partial_unit", "upgrade_component"]

# ─── URL resolution ────────────────────────────────────────────────────────────

def _resolve_redirect(url: str) -> str | None:
    """Follow redirects until we reach a warhammer.com URL, then stop without loading the page."""
    result: list[str] = []

    class _StopAtWarhammer(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            if "warhammer.com" in newurl.lower():
                result.append(newurl)
                return None  # stop — raises HTTPError with this as Location
            return super().redirect_request(req, fp, code, msg, headers, newurl)

    opener = urllib.request.build_opener(_StopAtWarhammer())
    try:
        resp = opener.open(url, timeout=10)
        return resp.url
    except urllib.error.HTTPError as e:
        if result:
            return result[0]
        return e.headers.get("Location")
    except Exception:
        return None


def load_url_cache() -> dict[str, str]:
    if URL_CACHE.exists():
        return json.loads(URL_CACHE.read_text())
    return {}


def save_url_cache(cache: dict[str, str]) -> None:
    URL_CACHE.parent.mkdir(parents=True, exist_ok=True)
    URL_CACHE.write_text(json.dumps(cache, indent=2, ensure_ascii=False) + "\n")


_GW_DIRECT_RE = re.compile(r"https?://www\.warhammer\.com/[^/]+/shop/", re.IGNORECASE)


def resolve_urls(urls: list[str], dry_run: bool = False, no_resolve: bool = False) -> dict[str, str]:
    """Resolve a list of URLs (with caching). Returns {original_url: resolved_url}.

    Direct GW product URLs are used as-is without any HTTP request — the slug
    is already in the URL path so resolution is unnecessary.
    """
    cache = load_url_cache()
    result: dict[str, str] = {}
    to_fetch = []

    for url in urls:
        if _GW_DIRECT_RE.match(url):
            result[url] = url  # already a GW URL, no redirect needed
        elif url in cache:
            result[url] = cache[url]
        else:
            to_fetch.append(url)

    if to_fetch and not dry_run and not no_resolve:
        print(f"  Resolving {len(to_fetch)} new URLs (cached: {len(result)})…")
        for url in to_fetch:
            resolved = _resolve_redirect(url)
            if resolved:
                cache[url] = resolved
                result[url] = resolved
                print(f"    {url} → {resolved}")
            else:
                print(f"    {url} → FAILED")
            time.sleep(0.1)  # polite delay
        save_url_cache(cache)
    elif to_fetch and (dry_run or no_resolve):
        print(f"  Skipping resolution of {len(to_fetch)} uncached URLs (dry-run/no-resolve mode)")
        for url in to_fetch:
            result[url] = ""

    return result

# ─── GW slug → seed slug ───────────────────────────────────────────────────────

def _gw_url_to_gw_slug(url: str) -> str | None:
    """Extract the product slug from a GW URL path segment.

    e.g. 'https://www.warhammer.com/en-US/shop/Adepta-Sororitas-Arco-Flagellants-2020'
         → 'Adepta-Sororitas-Arco-Flagellants-2020'
    """
    # Match /shop/<slug> or /products/<slug> patterns
    m = re.search(r"/(?:shop|products?)/([^/?#]+)", url, re.IGNORECASE)
    if m:
        return m.group(1)
    return None


def _gw_slug_to_seed_slug(gw_slug: str) -> str:
    """Normalize a GW product slug to a kit seed slug.

    'Adepta-Sororitas-Arco-Flagellants-2020' → 'adepta_sororitas_arco_flagellants'
    'adeptus-custodes-blade-champion-2022'   → 'adeptus_custodes_blade_champion'
    'Sisters-Of-Silence-2017'               → 'sisters_of_silence'
    """
    slug = re.sub(r"-\d{4}$", "", gw_slug)  # strip trailing year
    slug = slug.lower()
    slug = re.sub(r"[^a-z0-9]+", "_", slug)
    slug = slug.strip("_")
    return slug


def build_gw_slug_reverse_map(algolia_ids_path: Path) -> dict[str, str]:
    """Build {normalized_gw_slug: seed_slug} from algolia_object_ids.json.

    This gives us the canonical seed_slug for kits that are already in the price system.
    """
    if not algolia_ids_path.exists():
        return {}
    data = json.loads(algolia_ids_path.read_text())
    reverse: dict[str, str] = {}
    for seed_slug, entry in data.items():
        gw_slug = entry.get("gw_slug", "")
        if gw_slug:
            norm = _gw_slug_to_seed_slug(gw_slug)
            reverse[norm] = seed_slug
    return reverse

# ─── Load existing slugs from IDs file ────────────────────────────────────────

def _extract_slug_set(content: str, type_name: str) -> set[str]:
    pattern = rf"type {re.escape(type_name)} =\n(.*?)(?=\nexport const )"
    m = re.search(pattern, content, re.DOTALL)
    if not m:
        return set()
    return set(re.findall(r'"([^"]+)"', m.group(1)))


def _extract_slug_map(content: str, var_name: str) -> dict[str, str]:
    pattern = rf"const {re.escape(var_name)}: Record<[^>]+> = \{{(.*?)\}};"
    m = re.search(pattern, content, re.DOTALL)
    if not m:
        return {}
    return dict(re.findall(r'"([^"]+)":\s*"([^"]+)"', m.group(1)))


def load_existing_ids(ids_path: Path) -> tuple[set[str], set[str], dict[str, str], dict[str, str]]:
    """Returns: kit_slugs, unit_slugs, kit_slug_id_map, kit_unit_id_map."""
    content = ids_path.read_text(encoding="utf-8")
    kit_slugs = _extract_slug_set(content, "KitSeedSlug")
    unit_slugs = _extract_slug_set(content, "UnitSeedSlug")
    kit_slug_id_map = _extract_slug_map(content, "kitSeedIds")
    kit_unit_id_map = _extract_slug_map(content, "kitUnitSeedIds")
    return kit_slugs, unit_slugs, kit_slug_id_map, kit_unit_id_map

# ─── Patch generated_game_data.ids.ts ─────────────────────────────────────────

def _patch_type_union(content: str, type_name: str, new_slugs: set[str]) -> str:
    """Add slugs to a TypeScript type union (handles the ending `...";` pattern)."""
    # Try union form first
    type_pattern = rf"(type {re.escape(type_name)} =\n)((?:  \| \"[^\"]+\"\n?)*?)(;)"
    m = re.search(type_pattern, content, re.DOTALL)
    if m:
        existing = set(re.findall(r'"([^"]+)"', m.group(2)))
        added = sorted(new_slugs - existing)
        if not added:
            return content
        new_lines = "\n".join(f'  | "{s}"' for s in added)
        clean = m.group(2).rstrip("\n")
        new_union = clean + "\n" + new_lines + "\n"
        return content[: m.start(2)] + new_union + content[m.start(3) :]

    # Try "never" form
    never_m = re.search(rf"type {re.escape(type_name)} = never;", content)
    if never_m and new_slugs:
        slug_lines = "\n".join(f'  | "{s}"' for s in sorted(new_slugs))
        replacement = f"type {type_name} =\n{slug_lines};"
        return content.replace(f"type {type_name} = never;", replacement)

    return content


def _patch_id_map(content: str, var_name: str, new_entries: dict[str, str]) -> str:
    """Add entries to a TypeScript Record map."""
    map_pattern = rf"(const {re.escape(var_name)}: Record<[^>]+> = \{{)(.*?)(\}};)"
    m = re.search(map_pattern, content, re.DOTALL)
    if not m:
        return content
    existing = set(re.findall(r'"([^"]+)":', m.group(2)))
    added = {k: v for k, v in new_entries.items() if k not in existing}
    if not added:
        return content
    new_lines = "\n".join(f'  "{k}": "{v}",' for k, v in sorted(added.items()))
    existing_content = m.group(2).rstrip()
    new_map = (existing_content + "\n" + new_lines + "\n") if existing_content else ("\n" + new_lines + "\n")
    return content[: m.start(2)] + new_map + content[m.start(3) :]


def update_ids_file(
    ids_path: Path,
    new_kit_slugs: dict[str, str],       # slug → ulid
    new_kit_unit_slugs: dict[str, str],  # slug → ulid
) -> None:
    if not new_kit_slugs and not new_kit_unit_slugs:
        return
    content = ids_path.read_text(encoding="utf-8")
    if new_kit_slugs:
        content = _patch_type_union(content, "KitSeedSlug", set(new_kit_slugs))
        content = _patch_id_map(content, "kitSeedIds", new_kit_slugs)
    if new_kit_unit_slugs:
        content = _patch_type_union(content, "KitUnitSeedSlug", set(new_kit_unit_slugs))
        content = _patch_id_map(content, "kitUnitSeedIds", new_kit_unit_slugs)
    ids_path.write_text(content, encoding="utf-8")

# ─── Unit slug matching ────────────────────────────────────────────────────────

def _normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"\b(the|of|and|in|with|a|an)\b", " ", text)
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def _jaccard(a: set, b: set) -> float:
    union = len(a | b)
    return len(a & b) / union if union else 0.0


def _char_trigrams(s: str) -> set[str]:
    return {s[i:i+3] for i in range(len(s) - 2)} if len(s) >= 3 else {s}


def match_unit_slug(unit_name: str, available_unit_slugs: list[str]) -> str | None:
    """Fuzzy-match a unit name to the closest UnitSeedSlug using word Jaccard + char trigrams."""
    norm = _normalize(unit_name)
    norm_words = set(norm.split())

    best_slug: str | None = None
    best_score = 0.0

    for slug in available_unit_slugs:
        slug_norm = _normalize(slug.replace("_", " "))
        slug_words = set(slug_norm.split())

        word_score = _jaccard(norm_words, slug_words)
        char_score = _jaccard(
            _char_trigrams(norm.replace(" ", "")),
            _char_trigrams(slug_norm.replace(" ", ""))
        ) * 0.85

        score = max(word_score, char_score)
        if score > best_score:
            best_score = score
            best_slug = slug

    return best_slug if best_score >= 0.45 else None

# ─── Component type ────────────────────────────────────────────────────────────

def infer_component_type(unit_name: str, notes: str) -> ComponentType:
    u = unit_name.lower()
    n = notes.lower()
    if u.startswith("partial kit:"):
        return "partial_unit"
    if u.startswith("upgrade:"):
        return "upgrade_component"
    if "alternate build" in n:
        return "alternate_build"
    return "complete_unit"


def strip_unit_prefix(unit_name: str) -> str:
    """Strip 'partial kit:' or 'upgrade:' prefix before unit slug matching."""
    m = re.match(r"^(?:partial kit|upgrade):\s*(.+)$", unit_name, re.IGNORECASE)
    return m.group(1).strip() if m else unit_name

# ─── Model count ──────────────────────────────────────────────────────────────

def extract_model_count(models_text: str) -> int:
    first_alt = models_text.split(" or ")[0].strip()
    counts = re.findall(r"(\d+)\s*x\s+", first_alt, re.IGNORECASE)
    return sum(int(c) for c in counts) if counts else 1

# ─── Markdown parser ──────────────────────────────────────────────────────────

class Row:
    def __init__(self, kit: str, unit: str, prices: str, models: str, url: str, notes: str):
        self.kit = kit.strip()
        self.unit = unit.strip()
        self.prices = prices.strip()
        self.models = models.strip()
        self.url = url.strip()
        self.notes = notes.strip()


def _parse_table_row(line: str) -> list[str] | None:
    line = line.strip()
    if not line.startswith("|"):
        return None
    if re.match(r"^\|[-:\s|]+\|$", line):
        return None
    cells = [c.strip() for c in line.split("|")]
    cells = [c for c in cells if c != "" or len(cells) > 2]
    # strip empty leading/trailing from split
    while cells and cells[0] == "":
        cells.pop(0)
    while cells and cells[-1] == "":
        cells.pop()
    return cells


def _row_is_complete(row: Row) -> bool:
    skip = {"—", "", "-", "see notes", "see notes below table"}
    return (
        row.models.lower() not in skip
        and row.url.lower() not in skip
        and row.url.startswith("http")
    )


def parse_completed_factions(md_path: Path) -> dict[str, list[Row]]:
    content = md_path.read_text(encoding="utf-8")
    lines = content.split("\n")

    sections: dict[str, list[str]] = {}
    cur_faction: str | None = None
    cur_lines: list[str] = []

    for line in lines:
        m = re.match(r"^## (.+)$", line.strip())
        if m:
            if cur_faction:
                sections[cur_faction] = cur_lines
            cur_faction = m.group(1).strip()
            cur_lines = []
        else:
            cur_lines.append(line)
    if cur_faction:
        sections[cur_faction] = cur_lines

    result: dict[str, list[Row]] = {}
    for faction_name, section_lines in sections.items():
        if faction_name.lower() in {"number of kits"}:
            continue

        rows = _parse_section(section_lines)
        complete = [r for r in rows if _row_is_complete(r)]
        if not complete:
            continue

        faction_slug = _to_snake(faction_name)
        result[faction_slug] = complete

    return result


def _parse_section(lines: list[str]) -> list[Row]:
    rows: list[Row] = []
    in_kits_table = False

    for line in lines:
        s = line.strip()

        if re.match(r"###.*Kits\s*$", s, re.IGNORECASE):
            in_kits_table = True
            continue
        if s.startswith("###") and in_kits_table:
            in_kits_table = False
            continue
        if s.startswith("##") and in_kits_table:
            in_kits_table = False
            continue

        if not in_kits_table or not s.startswith("|"):
            continue

        cells = _parse_table_row(s)
        if not cells or len(cells) < 5:
            continue
        if cells[0].lower() in {"kit", ""}:
            continue

        rows.append(Row(
            kit=cells[0],
            unit=cells[1] if len(cells) > 1 else "",
            prices=cells[2] if len(cells) > 2 else "",
            models=cells[3] if len(cells) > 3 else "",
            url=cells[4] if len(cells) > 4 else "",
            notes=cells[5] if len(cells) > 5 else "",
        ))

    return rows


def _to_snake(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    return text.strip("_")

# ─── TypeScript codegen ────────────────────────────────────────────────────────

def _pascal(snake: str) -> str:
    return "".join(w.capitalize() for w in snake.split("_"))


def _ts_var_name(kit_unit_slug: str) -> str:
    parts = kit_unit_slug.split("__")
    combined = "_".join(parts)
    return _pascal(combined) + "KitUnit"


def _render_entry(
    kit_unit_slug: str,
    kit_slug: str,
    unit_slug: str,
    unit_count: int,
    model_count: int,
    component_type: ComponentType,
    source_url: str,
    source_text: str,
) -> str:
    var = _ts_var_name(kit_unit_slug)
    text = source_text.replace('"', '\\"')
    return f"""\
export const {var}: KitUnitConfig = {{
  id: kitUnitId("{kit_unit_slug}"),
  kit_id: kitId("{kit_slug}"),
  unit_id: unitId("{unit_slug}"),
  unit_count: {unit_count},
  model_count: {model_count},
  component_type: "{component_type}",
  source_kind: "games_workshop_product_page",
  source_url: "{source_url}",
  source_text: "{text}",
  review_status: "needs_review",
  effective_date: null,
  superseded_date: null,
}};"""


def _render_faction_file(faction_slug: str, entries: list[dict]) -> str:
    dataset_name = f"kitUnitsMarkdown{_pascal(faction_slug)}Dataset"
    blocks = "\n\n".join(
        _render_entry(
            e["kit_unit_slug"], e["kit_slug"], e["unit_slug"],
            e["unit_count"], e["model_count"], e["component_type"],
            e["source_url"], e["source_text"],
        )
        for e in entries
    )
    records = "\n".join(f"    {_ts_var_name(e['kit_unit_slug'])}," for e in entries)
    return f"""\
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

{blocks}

export const {dataset_name}: SeedDataset<"kit_units"> = {{
  table: "kit_units",
  records: [
{records}
  ] satisfies KitUnitConfig[],
}};
"""


def _render_index_file(faction_slugs: list[str]) -> str:
    imports = "\n".join(
        f'import {{ kitUnitsMarkdown{_pascal(s)}Dataset }} from "./{s}.data";'
        for s in faction_slugs
    )
    exports = "\n".join(f"  kitUnitsMarkdown{_pascal(s)}Dataset," for s in faction_slugs)
    return f"""\
/**
 * Aggregated kit_units dataset from docs/kit_unit_status.md (parsed factions).
 * Generated by scripts/parse-kit-unit-status.py.
 */

{imports}

export const kitUnitsMarkdownDatasets = [
{exports}
];
"""

# ─── Main ─────────────────────────────────────────────────────────────────────

def process(dry_run: bool = False, no_resolve: bool = False) -> None:
    print("Loading existing IDs…")
    kit_slugs, unit_slugs, kit_slug_id_map, kit_unit_id_map = load_existing_ids(GENERATED_IDS)
    print(f"  Kit slugs: {len(kit_slugs)}, Unit slugs: {len(unit_slugs)}, Kit-unit slugs: {len(kit_unit_id_map)}")

    print("Loading Algolia GW-slug reverse map…")
    gw_reverse = build_gw_slug_reverse_map(ALGOLIA_OBJECT_IDS)
    print(f"  {len(gw_reverse)} reverse entries")

    print(f"\nParsing {KIT_UNIT_STATUS_MD}…")
    factions = parse_completed_factions(KIT_UNIT_STATUS_MD)
    print(f"  Completed factions: {sorted(factions.keys())}")

    # Collect all URLs to resolve
    all_urls = list({r.url for rows in factions.values() for r in rows if r.url.startswith("http")})
    print(f"\nResolving {len(all_urls)} unique URLs…")
    url_map = resolve_urls(all_urls, dry_run=dry_run, no_resolve=no_resolve)

    # Track new slugs to add
    new_kit_slugs: dict[str, str] = {}       # kit_slug → ulid
    new_kit_unit_slugs: dict[str, str] = {}  # kit_unit_slug → ulid

    # Accumulate output
    faction_entries: dict[str, list[dict]] = {}
    review: list[dict] = []

    unit_slug_list = sorted(unit_slugs)

    for faction_slug, rows in sorted(factions.items()):
        print(f"\n── {faction_slug} ({len(rows)} rows) ──")
        entries: list[dict] = []

        for row in rows:
            unit_name = row.unit.strip()
            unit_lower = unit_name.lower()

            # Skip non-unit rows
            if unit_lower in {"", "multi-unit"} or unit_lower.startswith("n/a"):
                review.append({"faction": faction_slug, "kit": row.kit, "unit": unit_name,
                                "models": row.models, "url": row.url, "notes": row.notes,
                                "reason": f"skip:{unit_lower or 'empty'}"})
                print(f"  SKIP  {row.kit!r} / {unit_name!r}")
                continue

            # Skip if no URL
            if not row.url.startswith("http"):
                review.append({"faction": faction_slug, "kit": row.kit, "unit": unit_name,
                                "models": row.models, "url": row.url, "notes": row.notes,
                                "reason": "no_url"})
                print(f"  SKIP  {row.kit!r} — no URL")
                continue

            # Resolve URL → GW slug → kit seed slug
            resolved_url = url_map.get(row.url, "")
            if not resolved_url:
                review.append({"faction": faction_slug, "kit": row.kit, "unit": unit_name,
                                "models": row.models, "url": row.url, "notes": row.notes,
                                "reason": "url_unresolved"})
                print(f"  SKIP  {row.kit!r} — URL not resolved (run without --no-resolve)")
                continue

            gw_slug = _gw_url_to_gw_slug(resolved_url)
            if not gw_slug:
                review.append({"faction": faction_slug, "kit": row.kit, "unit": unit_name,
                                "models": row.models, "url": row.url, "notes": row.notes,
                                "reason": "gw_slug_not_extracted", "resolved_url": resolved_url})
                print(f"  MISS  {row.kit!r} — cannot extract slug from {resolved_url!r}")
                continue

            candidate_slug = _gw_slug_to_seed_slug(gw_slug)

            # Try the algolia reverse map first (most authoritative)
            kit_slug = gw_reverse.get(candidate_slug)
            # If not found, check if candidate is already in KitSeedSlug
            if not kit_slug and candidate_slug in kit_slugs:
                kit_slug = candidate_slug
            # If still not found, this is a new kit — register it
            if not kit_slug:
                kit_slug = candidate_slug
                if kit_slug not in new_kit_slugs and kit_slug not in kit_slug_id_map:
                    new_kit_slugs[kit_slug] = _new_ulid()
                    print(f"  NEW   kit slug: {kit_slug!r} (from {gw_slug!r})")

            # Determine component_type
            component_type = infer_component_type(unit_name, row.notes)
            unit_name_clean = strip_unit_prefix(unit_name)

            # Match unit slug
            unit_slug = match_unit_slug(unit_name_clean, unit_slug_list)
            if not unit_slug:
                review.append({"faction": faction_slug, "kit": row.kit, "unit": unit_name,
                                "models": row.models, "url": row.url, "notes": row.notes,
                                "reason": "no_unit_slug_match",
                                "kit_slug": kit_slug, "resolved_url": resolved_url})
                print(f"  MISS  unit {unit_name_clean!r} — no unit slug match (kit: {kit_slug})")
                continue

            # Build kit_unit slug
            kit_unit_slug = f"{kit_slug}__{unit_slug}__{component_type}"

            # Get or mint ULID
            if kit_unit_slug in kit_unit_id_map:
                ulid = kit_unit_id_map[kit_unit_slug]
            elif kit_unit_slug in new_kit_unit_slugs:
                ulid = new_kit_unit_slugs[kit_unit_slug]
            else:
                ulid = _new_ulid()
                new_kit_unit_slugs[kit_unit_slug] = ulid

            model_count = extract_model_count(row.models)

            # Skip duplicate kit_unit slugs within the same faction
            seen_kit_unit_slugs = {e["kit_unit_slug"] for e in entries}
            if kit_unit_slug in seen_kit_unit_slugs:
                print(f"  DUP   [{kit_unit_slug}] — duplicate within faction, skipping")
                continue

            entries.append({
                "kit_unit_slug": kit_unit_slug,
                "kit_slug": kit_slug,
                "unit_slug": unit_slug,
                "unit_count": 1,
                "model_count": model_count,
                "component_type": component_type,
                "source_url": row.url,
                "source_text": row.models,
            })
            print(f"  OK    [{kit_slug}] → [{unit_slug}] ({component_type}, {model_count})")

        if entries:
            faction_entries[faction_slug] = entries

    # ── Summary ──────────────────────────────────────────────────────────────
    total = sum(len(e) for e in faction_entries.values())
    prefix = "DRY RUN — " if dry_run else ""
    print(f"\n{prefix}Results:")
    print(f"  Generated entries:    {total}")
    print(f"  New kit slugs:        {len(new_kit_slugs)}")
    print(f"  New kit_unit slugs:   {len(new_kit_unit_slugs)}")
    print(f"  Review entries:       {len(review)}")

    if dry_run:
        print("\nDry run — no files written.")
        if review:
            print("\nReview entries:")
            for r in review:
                print(f"  [{r['reason']}] {r['faction']} / {r['kit']!r} / {r['unit']!r}")
        return

    # ── Write ─────────────────────────────────────────────────────────────────
    # Patch IDs file
    if new_kit_slugs or new_kit_unit_slugs:
        print(f"\nPatching {GENERATED_IDS.name}…")
        update_ids_file(GENERATED_IDS, new_kit_slugs, new_kit_unit_slugs)

    # Write per-faction TypeScript files
    KIT_UNITS_MARKDOWN_DIR.mkdir(parents=True, exist_ok=True)
    for faction_slug, entries in sorted(faction_entries.items()):
        out = KIT_UNITS_MARKDOWN_DIR / f"{faction_slug}.data.ts"
        out.write_text(_render_faction_file(faction_slug, entries), encoding="utf-8")
        print(f"  Wrote {out.relative_to(REPO_ROOT)} ({len(entries)} entries)")

    if faction_entries:
        idx = KIT_UNITS_MARKDOWN_DIR / "_index.data.ts"
        idx.write_text(_render_index_file(sorted(faction_entries.keys())), encoding="utf-8")
        print(f"  Wrote {idx.relative_to(REPO_ROOT)}")

    # Write review log
    REVIEW_LOG.parent.mkdir(parents=True, exist_ok=True)
    REVIEW_LOG.write_text(json.dumps(review, indent=2, ensure_ascii=False) + "\n")
    print(f"  Wrote {REVIEW_LOG.relative_to(REPO_ROOT)} ({len(review)} entries)")

    print("\nDone. Next:")
    print("  1. Review data/kit_unit_status_review.json for any missed unit slug matches")
    print("  2. Verify generated TypeScript compiles: npx tsc --noEmit")
    print("  3. Run tests: npx vitest run")


def main() -> None:
    args = sys.argv[1:]
    dry_run = "--dry-run" in args
    no_resolve = "--no-resolve" in args
    process(dry_run=dry_run, no_resolve=no_resolve)


if __name__ == "__main__":
    main()
