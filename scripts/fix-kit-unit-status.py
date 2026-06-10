#!/usr/bin/env python3
"""
fix-kit-unit-status.py

Phase 1: Build faction-unique unit sets from BSData .cat files
Phase 2: Build kit-name set from algolia_object_ids.json + md Kits tables
Phase 3: Scrape GW shop category pages (cached)
Phase 4: Update docs/kit_unit_status.md
"""

import json
import re
import time
import os
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.error import URLError

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
REPO = Path("/Users/mikeearley/code/40karmy")
BSDATA = Path("/Users/mikeearley/code/wh40k-10e")
MD_PATH = REPO / "docs/kit_unit_status.md"
ALGOLIA_PATH = REPO / "data/prices/algolia_object_ids.json"
GW_CACHE_PATH = REPO / "data/gw_shop_kits_cache.json"

# ---------------------------------------------------------------------------
# Factions to SKIP (already manually completed)
# ---------------------------------------------------------------------------
SKIP_SECTIONS = {"Adepta Sororitas", "Adeptus Custodes", "Black Templars", "Blood Angels"}

# ---------------------------------------------------------------------------
# Phase 1: BSData parsing
# ---------------------------------------------------------------------------

FACTION_CAT_MAP = {
    "dark_angels": "Imperium - Dark Angels.cat",
    "deathwatch": "Imperium - Deathwatch.cat",
    "grey_knights": "Imperium - Grey Knights.cat",
    "imperial_fists": "Imperium - Imperial Fists.cat",
    "iron_hands": "Imperium - Iron Hands.cat",
    "raven_guard": "Imperium - Raven Guard.cat",
    "salamanders": "Imperium - Salamanders.cat",
    "space_wolves": "Imperium - Space Wolves.cat",
    "ultramarines": "Imperium - Ultramarines.cat",
    "white_scars": "Imperium - White Scars.cat",
    "adeptus_mechanicus": "Imperium - Adeptus Mechanicus.cat",
    "aeldari": "Aeldari - Craftworlds.cat",
    "astra_militarum": "Imperium - Astra Militarum.cat",
    "chaos_daemons": "Chaos - Chaos Daemons.cat",
    "chaos_knights": "Chaos - Chaos Knights.cat",
    "chaos_space_marines": "Chaos - Chaos Space Marines.cat",
    "death_guard": "Chaos - Death Guard.cat",
    "drukhari": "Aeldari - Drukhari.cat",
    "emperors_children": "Chaos - Emperor's Children.cat",
    "genestealer_cults": "Genestealer Cults.cat",
    "imperial_agents": "Imperium - Agents of the Imperium.cat",
    "imperial_knights": "Imperium - Imperial Knights.cat",
    "leagues_of_votann": "Leagues of Votann.cat",
    "necrons": "Necrons.cat",
    "orks": "Orks.cat",
    "space_marines": "Imperium - Space Marines.cat",
    "thousand_sons": "Chaos - Thousand Sons.cat",
    "world_eaters": "Chaos - World Eaters.cat",
    "tau_empire": "T'au Empire.cat",
    "tyranids": "Tyranids.cat",
}

SM_SUBFACTIONS = {
    "dark_angels", "deathwatch", "grey_knights", "imperial_fists",
    "iron_hands", "raven_guard", "salamanders", "space_wolves",
    "ultramarines", "white_scars",
}

def parse_cat_units(cat_path: Path, include_models: bool = False) -> set:
    """Return set of unit names from a .cat file.

    For the base Space Marines and most factions: type='unit', not hidden.
    For SM sub-factions: also include type='model' from sharedSelectionEntries
    (those are the unique named characters, stored as models not units in BSData).
    When include_models=True, we collect both type='unit' and type='model' entries
    from sharedSelectionEntries that are not hidden and not type='upgrade'.
    """
    if not cat_path.exists():
        return None  # signal file not found
    try:
        tree = ET.parse(cat_path)
        root = tree.getroot()
    except ET.ParseError as e:
        print(f"  ERROR parsing {cat_path.name}: {e}", file=sys.stderr)
        return set()

    # BSData XML uses namespaces
    ns = ""
    tag = root.tag
    if tag.startswith("{"):
        ns = tag[: tag.index("}") + 1]

    units = set()
    # Always collect type='unit' selectionEntries
    for se in root.iter(f"{ns}selectionEntry"):
        if se.get("type") != "unit":
            continue
        if se.get("hidden") == "true":
            continue
        name = se.get("name", "")
        if name:
            units.add(name)

    if include_models:
        # Also collect type='model' from sharedSelectionEntries (faction-unique named characters)
        for sse_container in root.iter(f"{ns}sharedSelectionEntries"):
            for se in sse_container:
                if se.get("type") not in ("unit", "model"):
                    continue
                if se.get("hidden") == "true":
                    continue
                name = se.get("name", "")
                if name:
                    units.add(name)

    return units


def build_faction_units() -> dict:
    faction_units = {}
    missing = []
    for slug, fname in FACTION_CAT_MAP.items():
        cat_path = BSDATA / fname
        # SM sub-factions store unique named characters as type='model', include them
        include_models = slug in SM_SUBFACTIONS
        result = parse_cat_units(cat_path, include_models=include_models)
        if result is None:
            missing.append(fname)
            faction_units[slug] = set()
        else:
            faction_units[slug] = result
            print(f"  {slug}: {len(result)} units from {fname}")
    if missing:
        print(f"\nMISSING BSData files: {missing}\n", file=sys.stderr)
    return faction_units, missing


# ---------------------------------------------------------------------------
# Normalization helpers
# ---------------------------------------------------------------------------

def normalize(name: str) -> str:
    """Lowercase, strip punctuation, collapse spaces."""
    name = name.lower()
    name = re.sub(r"[^\w\s]", "", name)
    name = re.sub(r"\s+", " ", name).strip()
    return name


def fuzzy_match(unit_name: str, kit_names_normalized: set) -> str | None:
    """Return matched kit name string if fuzzy match, else None."""
    u = normalize(unit_name)
    if len(u) < 5:
        return None
    for kit_norm, kit_orig in kit_names_normalized:
        # substring check (at least 5 chars)
        if len(u) >= 5 and (u in kit_norm or kit_norm in u):
            return kit_orig
        # Jaccard on words
        u_words = set(u.split())
        k_words = set(kit_norm.split())
        if u_words and k_words:
            inter = u_words & k_words
            union = u_words | k_words
            jaccard = len(inter) / len(union)
            if jaccard >= 0.6:
                return kit_orig
    return None


# ---------------------------------------------------------------------------
# Phase 2: Build kit names from algolia + md Kits tables
# ---------------------------------------------------------------------------

def build_kit_names_from_algolia() -> set:
    if not ALGOLIA_PATH.exists():
        print(f"  algolia file not found: {ALGOLIA_PATH}", file=sys.stderr)
        return set()
    with open(ALGOLIA_PATH) as f:
        data = json.load(f)
    names = set()
    if isinstance(data, list):
        for entry in data:
            if isinstance(entry, dict) and "name" in entry:
                names.add(entry["name"])
    elif isinstance(data, dict):
        for entry in data.values():
            if isinstance(entry, dict) and "name" in entry:
                names.add(entry["name"])
    print(f"  algolia kit names: {len(names)}")
    return names


def build_kit_names_from_md(md_text: str) -> set:
    """Extract Kit column values from ### * Kits tables."""
    names = set()
    # Match lines inside kit tables (first column)
    # Table rows look like: | Kit Name | ...
    in_kits_section = False
    for line in md_text.splitlines():
        if re.match(r"^###\s+.+\s+Kits\s*$", line):
            in_kits_section = True
            continue
        if re.match(r"^###\s+", line) and "Kits" not in line:
            in_kits_section = False
            continue
        if re.match(r"^##\s+", line):
            in_kits_section = False
            continue
        if in_kits_section and line.startswith("|") and not line.startswith("| ---") and not line.startswith("| Kit"):
            parts = line.split("|")
            if len(parts) >= 2:
                kit_name = parts[1].strip()
                if kit_name and not kit_name.startswith("---"):
                    names.add(kit_name)
    print(f"  md kits table names: {len(names)}")
    return names


# ---------------------------------------------------------------------------
# Phase 3: Scrape GW shop pages
# ---------------------------------------------------------------------------

GW_SHOP_URLS = {
    "dark_angels": "https://www.warhammer.com/en-US/shop/warhammer-40000/space-marines/dark-angels",
    "deathwatch": "https://www.warhammer.com/en-US/shop/warhammer-40000/space-marines/deathwatch",
    "grey_knights": "https://www.warhammer.com/en-US/shop/warhammer-40000/space-marines/grey-knights",
    "imperial_fists": "https://www.warhammer.com/en-US/shop/warhammer-40000/space-marines/imperial-fists",
    "iron_hands": "https://www.warhammer.com/en-US/shop/warhammer-40000/space-marines/iron-hands",
    "raven_guard": "https://www.warhammer.com/en-US/shop/warhammer-40000/space-marines/raven-guard",
    "salamanders": "https://www.warhammer.com/en-US/shop/warhammer-40000/space-marines/salamanders",
    "space_wolves": "https://www.warhammer.com/en-US/shop/warhammer-40000/space-marines/space-wolves",
    "ultramarines": "https://www.warhammer.com/en-US/shop/warhammer-40000/space-marines/ultramarines",
    "white_scars": "https://www.warhammer.com/en-US/shop/warhammer-40000/space-marines/white-scars",
    "space_marines": "https://www.warhammer.com/en-US/shop/warhammer-40000/space-marines",
    "aeldari": "https://www.warhammer.com/en-US/shop/warhammer-40000/xenos-armies/aeldari",
    "adeptus_mechanicus": "https://www.warhammer.com/en-US/shop/warhammer-40000/armies-of-the-imperium/adeptus-mechanicus",
    "astra_militarum": "https://www.warhammer.com/en-US/shop/warhammer-40000/armies-of-the-imperium/astra-militarum",
    "chaos_daemons": "https://www.warhammer.com/en-US/shop/warhammer-40000/armies-of-chaos/chaos-daemons",
    "chaos_knights": "https://www.warhammer.com/en-US/shop/warhammer-40000/armies-of-chaos/chaos-knights",
    "chaos_space_marines": "https://www.warhammer.com/en-US/shop/warhammer-40000/armies-of-chaos/chaos-space-marines",
    "death_guard": "https://www.warhammer.com/en-US/shop/warhammer-40000/armies-of-chaos/death-guard",
    "drukhari": "https://www.warhammer.com/en-US/shop/warhammer-40000/xenos-armies/drukhari",
    "emperors_children": "https://www.warhammer.com/en-US/shop/warhammer-40000/armies-of-chaos/emperors-children",
    "genestealer_cults": "https://www.warhammer.com/en-US/shop/warhammer-40000/xenos-armies/genestealer-cults",
    "imperial_agents": "https://www.warhammer.com/en-US/shop/warhammer-40000/armies-of-the-imperium/imperial-agents",
    "imperial_knights": "https://www.warhammer.com/en-US/shop/warhammer-40000/armies-of-the-imperium/imperial-knights",
    "leagues_of_votann": "https://www.warhammer.com/en-US/shop/warhammer-40000/xenos-armies/leagues-of-votann",
    "necrons": "https://www.warhammer.com/en-US/shop/warhammer-40000/xenos-armies/necrons",
    "orks": "https://www.warhammer.com/en-US/shop/warhammer-40000/xenos-armies/orks",
    "thousand_sons": "https://www.warhammer.com/en-US/shop/warhammer-40000/armies-of-chaos/thousand-sons",
    "world_eaters": "https://www.warhammer.com/en-US/shop/warhammer-40000/armies-of-chaos/world-eaters",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}


def extract_product_names_from_html(html: str) -> list:
    names = []
    # Try JSON-LD first
    for m in re.finditer(r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', html, re.DOTALL | re.IGNORECASE):
        try:
            data = json.loads(m.group(1))
            if isinstance(data, dict):
                items = data.get("itemListElement", []) or [data]
            elif isinstance(data, list):
                items = data
            else:
                items = []
            for item in items:
                if isinstance(item, dict):
                    n = item.get("name") or (item.get("item") or {}).get("name")
                    if n:
                        names.append(n)
        except Exception:
            pass

    # Fallback: product title h2/h3 tags
    if not names:
        for m in re.finditer(r'<h[23][^>]*class="[^"]*product[^"]*"[^>]*>(.*?)</h[23]>', html, re.DOTALL | re.IGNORECASE):
            text = re.sub(r"<[^>]+>", "", m.group(1)).strip()
            if text:
                names.append(text)

    # Also try data-product-name or aria-label patterns
    for m in re.finditer(r'data-product-title="([^"]+)"', html):
        names.append(m.group(1))
    for m in re.finditer(r'"productName"\s*:\s*"([^"]+)"', html):
        names.append(m.group(1))
    # Try common GW site patterns
    for m in re.finditer(r'"name"\s*:\s*"([^"]+Warhammer[^"]*|[^"]*40[,\s]?000[^"]*)"', html):
        names.append(m.group(1))

    return list(set(names))


def scrape_gw_shop_pages() -> dict:
    """Returns {slug: [product_name, ...]}. Uses cache if available."""
    if GW_CACHE_PATH.exists():
        print(f"  Using GW shop cache: {GW_CACHE_PATH}")
        with open(GW_CACHE_PATH) as f:
            return json.load(f)

    cache = {}
    for slug, url in GW_SHOP_URLS.items():
        print(f"  Scraping {slug}: {url}")
        try:
            req = Request(url, headers=HEADERS)
            with urlopen(req, timeout=15) as resp:
                html = resp.read().decode("utf-8", errors="replace")
            names = extract_product_names_from_html(html)
            cache[slug] = names
            print(f"    -> {len(names)} product names found")
        except URLError as e:
            print(f"    ERROR: {e}", file=sys.stderr)
            cache[slug] = []
        time.sleep(2)

    with open(GW_CACHE_PATH, "w") as f:
        json.dump(cache, f, indent=2)
    print(f"  Cache saved to {GW_CACHE_PATH}")
    return cache


# ---------------------------------------------------------------------------
# Phase 4: Parse and update kit_unit_status.md
# ---------------------------------------------------------------------------

# Map markdown section headings to faction slugs
SECTION_TO_SLUG = {
    "Dark Angels": "dark_angels",
    "Deathwatch": "deathwatch",
    "Grey Knights": "grey_knights",
    "Imperial Fists": "imperial_fists",
    "Iron Hands": "iron_hands",
    "Raven Guard": "raven_guard",
    "Salamanders": "salamanders",
    "Space Wolves": "space_wolves",
    "Ultramarines": "ultramarines",
    "White Scars": "white_scars",
    "Adeptus Mechanicus": "adeptus_mechanicus",
    "Aeldari": "aeldari",
    "Astra Militarum": "astra_militarum",
    "Chaos Daemons": "chaos_daemons",
    "Chaos Knights": "chaos_knights",
    "Chaos Space Marines": "chaos_space_marines",
    "Death Guard": "death_guard",
    "Drukhari": "drukhari",
    "Emperor's Children": "emperors_children",
    "Genestealer Cults": "genestealer_cults",
    "Imperial Agents": "imperial_agents",
    "Imperial Knights": "imperial_knights",
    "Leagues of Votann": "leagues_of_votann",
    "Necrons": "necrons",
    "Orks": "orks",
    "Space Marines": "space_marines",
    "T'au Empire": "tau_empire",
    "Thousand Sons": "thousand_sons",
    "Tyranids": "tyranids",
    "World Eaters": "world_eaters",
}


def get_unit_name_from_row(row: str) -> str:
    """Extract unit name from a markdown table row (first column)."""
    parts = row.split("|")
    if len(parts) >= 2:
        raw = parts[1].strip()
        # Strip markdown link, bold, italic
        raw = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", raw)
        raw = re.sub(r"[*_`]", "", raw)
        # Strip (Legends) / [Legends] suffix for matching
        raw = re.sub(r"\s*[\[(]Legends[\])]", "", raw, flags=re.IGNORECASE)
        raw = re.sub(r"\s*[\[(]Crucible[\])]", "", raw, flags=re.IGNORECASE)
        return raw.strip()
    return ""


def process_md(
    md_text: str,
    faction_units: dict,
    kit_names_normalized: set,
) -> tuple:
    """
    Process the markdown text.
    Returns (new_text, stats_dict).
    stats_dict: {section: {removed: int, flagged: int}}
    """
    lines = md_text.splitlines(keepends=True)
    output = []
    stats = {}

    current_section = None
    current_slug = None
    in_no_kit_table = False
    in_skip_section = False

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.rstrip("\n")

        # Detect ## section heading
        m2 = re.match(r"^## (.+)$", stripped)
        if m2:
            current_section = m2.group(1).strip()
            current_slug = SECTION_TO_SLUG.get(current_section)
            in_no_kit_table = False
            in_skip_section = current_section in SKIP_SECTIONS
            output.append(line)
            i += 1
            continue

        # Detect ### heading
        m3 = re.match(r"^### (.+)$", stripped)
        if m3:
            heading = m3.group(1).strip()
            in_no_kit_table = bool(re.search(r"Units with no kit data", heading))
            output.append(line)
            i += 1
            continue

        # If we're in a skip section, just copy
        if in_skip_section:
            output.append(line)
            i += 1
            continue

        # If we're in a "no kit" table and it's a data row
        if in_no_kit_table and stripped.startswith("|") and not stripped.startswith("| ---") and not re.match(r"^\| \*?\*?Unit", stripped):
            unit_name = get_unit_name_from_row(stripped)
            if not unit_name or unit_name.startswith("---"):
                output.append(line)
                i += 1
                continue

            # Initialize stats
            if current_section not in stats:
                stats[current_section] = {"removed": 0, "flagged": 0}

            removed = False

            # For SM sub-factions: filter out units not in faction's unique set
            if current_slug in SM_SUBFACTIONS:
                faction_set = faction_units.get(current_slug, set())
                # Check if unit name matches any faction-unique unit
                # Strip Legends/Crucible from BSData names too
                faction_set_normalized = set()
                for u in faction_set:
                    clean = re.sub(r"\s*[\[(](Legends|Crucible)[\])]", "", u, flags=re.IGNORECASE).strip()
                    faction_set_normalized.add(clean)

                # Does this unit appear in the sub-faction's unique set?
                if unit_name not in faction_set_normalized:
                    # Not unique to this sub-faction — remove
                    stats[current_section]["removed"] += 1
                    removed = True

            if not removed:
                # Check fuzzy match against known kits
                matched_kit = fuzzy_match(unit_name, kit_names_normalized)
                if matched_kit:
                    stats[current_section]["flagged"] += 1
                    # Add comment after the row
                    output.append(line.rstrip("\n") + f" <!-- HAS KIT: {matched_kit} -->\n")
                    i += 1
                    continue

            if not removed:
                output.append(line)
            i += 1
            continue

        output.append(line)
        i += 1

    return "".join(output), stats


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("=== Phase 1: Parsing BSData .cat files ===")
    faction_units, missing_files = build_faction_units()

    print("\n=== Phase 2: Building kit name set ===")
    with open(MD_PATH) as f:
        md_text = f.read()

    kit_names = set()
    kit_names |= build_kit_names_from_algolia()
    kit_names |= build_kit_names_from_md(md_text)

    print("\n=== Phase 3: Scraping GW shop pages ===")
    gw_cache = scrape_gw_shop_pages()
    for slug, names in gw_cache.items():
        for n in names:
            kit_names.add(n)
    print(f"  Total kit names (all sources): {len(kit_names)}")

    # Build normalized set of (normalized_name, original_name) tuples
    kit_names_normalized = set()
    for k in kit_names:
        if k and len(k) >= 5:
            kit_names_normalized.add((normalize(k), k))

    print("\n=== Phase 4: Updating kit_unit_status.md ===")
    new_text, stats = process_md(md_text, faction_units, kit_names_normalized)

    with open(MD_PATH, "w") as f:
        f.write(new_text)

    print("\n=== Summary ===")
    if missing_files:
        print(f"Missing BSData files: {missing_files}")
    for section, s in sorted(stats.items()):
        if s["removed"] > 0 or s["flagged"] > 0:
            print(f"  {section}: removed={s['removed']}, flagged={s['flagged']}")

    print("\nDone.")


if __name__ == "__main__":
    main()
