#!/usr/bin/env python3
"""
Fetch GW regional kit prices via Playwright.

Strategy:
  Phase 1 (--crawl):  Crawl GW faction category pages to discover product slugs.
                      Saves to data/prices/gw_slug_catalog.json.
  Phase 2 (--map):    Fetch en-GB product pages to extract product codes + GBP price.
                      Builds gw_product_code → gw_slug mapping.
                      Saves to data/prices/gw_slug_catalog.json (updated).
  Phase 3 (--prices): Fetch all locales for kits matched to seed slugs.
                      Saves to data/prices/gw_prices_cache.json.

All phases are resumable — already-fetched entries are skipped.

Usage:
  python scripts/sync-gw-prices.py --crawl [--limit N]
  python scripts/sync-gw-prices.py --map [--limit N]
  python scripts/sync-gw-prices.py --prices [--locale LOCALE] [--limit N]
  python scripts/sync-gw-prices.py --all      # run all phases sequentially
  npm run data:sync-gw-prices

Price cache format (gw_prices_cache.json):
  {"{seed_slug}.{locale}": {"price": 38.00, "currency": "GBP", ...}}

Locales / markets:
  en-GB → uk_en      (GBP)
  en-AU → australia_en (AUD)
  en-CA → canada_en  (CAD)
  en-US → us_en      (USD, verification only — TCGCSV already covers this)
  en-EU → eu_en      (EUR)
  de-CH → switzerland_en (CHF)
  en-PL → poland_pl  (PLN)
  en-NZ → new_zealand_en (NZD)
  en-JP → japan_en   (JPY)
"""

from __future__ import annotations

import argparse
import glob
import json
import random
import re
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import unquote

REPO_ROOT = Path(__file__).resolve().parent.parent
SLUG_CATALOG_FILE = REPO_ROOT / "data/prices/gw_slug_catalog.json"
PRICES_CACHE_FILE = REPO_ROOT / "data/prices/gw_prices_cache.json"
COMPOSITION_CACHE_FILE = REPO_ROOT / "data/prices/gw_composition_cache.json"
COMPOSITION_REVIEW_FILE = REPO_ROOT / "data/prices/gw_composition_review.json"
KITS_GLOB = str(REPO_ROOT / "db/seed_config/seed/data/kits/**/*.ts")
UNIT_MODELS_GLOB = str(REPO_ROOT / "db/seed_config/seed/data/unit_models/**/*.ts")

BASE_URL = "https://www.warhammer.com"

# GW category pages to crawl for product slugs.
# Each entry is a path under /en-GB/ that lists product tiles.
GW_CATEGORY_PATHS = [
    # Warhammer 40,000
    "shop/warhammer-40000/space-marines",
    "shop/warhammer-40000/space-marines/black-templars",
    "shop/warhammer-40000/space-marines/blood-angels",
    "shop/warhammer-40000/space-marines/dark-angels",
    "shop/warhammer-40000/space-marines/deathwatch",
    "shop/warhammer-40000/space-marines/grey-knights",
    "shop/warhammer-40000/space-marines/imperial-fists",
    "shop/warhammer-40000/space-marines/iron-hands",
    "shop/warhammer-40000/space-marines/raven-guard",
    "shop/warhammer-40000/space-marines/salamanders",
    "shop/warhammer-40000/space-marines/space-wolves",
    "shop/warhammer-40000/space-marines/ultramarines",
    "shop/warhammer-40000/space-marines/white-scars",
    "shop/warhammer-40000/armies-of-the-imperium/adepta-sororitas",
    "shop/warhammer-40000/armies-of-the-imperium/adeptus-custodes",
    "shop/warhammer-40000/armies-of-the-imperium/adeptus-mechanicus",
    "shop/warhammer-40000/armies-of-the-imperium/astra-militarum",
    "shop/warhammer-40000/armies-of-the-imperium/imperial-agents",
    "shop/warhammer-40000/armies-of-the-imperium/leagues-of-votann",
    "shop/warhammer-40000/chaos/chaos-space-marines",
    "shop/warhammer-40000/chaos/death-guard",
    "shop/warhammer-40000/chaos/emperors-children",
    "shop/warhammer-40000/chaos/thousand-sons",
    "shop/warhammer-40000/chaos/world-eaters",
    "shop/warhammer-40000/chaos/chaos-knights",
    "shop/warhammer-40000/chaos/daemons",
    "shop/warhammer-40000/xenos-armies/aeldari",
    "shop/warhammer-40000/xenos-armies/drukhari",
    "shop/warhammer-40000/xenos-armies/genestealer-cults",
    "shop/warhammer-40000/xenos-armies/necrons",
    "shop/warhammer-40000/xenos-armies/orks",
    "shop/warhammer-40000/xenos-armies/t-au-empire",
    "shop/warhammer-40000/xenos-armies/tau-empire",  # alternate URL used by GW
    "shop/warhammer-40000/xenos-armies/tyranids",
    "shop/warhammer-40000/xenos-armies/votann",
    # Imperial Knights / Chaos Knights
    "shop/warhammer-40000/armies-of-the-imperium/imperial-knights",
    # Age of Sigmar (if needed in future)
    # "shop/age-of-sigmar",
]

LOCALES = [
    "en-GB",  # GBP
    "en-AU",  # AUD
    "en-CA",  # CAD
    "en-EU",  # EUR
    "de-CH",  # CHF
    "en-PL",  # PLN
    "en-NZ",  # NZD
    "en-JP",  # JPY
]

LOCALE_TO_MARKET: dict[str, dict[str, str]] = {
    "en-GB": {"price_market_slug": "uk_en",          "currency": "gbp"},
    "en-AU": {"price_market_slug": "australia_en",   "currency": "aud"},
    "en-CA": {"price_market_slug": "canada_en",      "currency": "cad"},
    "en-EU": {"price_market_slug": "eu_en",          "currency": "eur"},
    "de-CH": {"price_market_slug": "switzerland_en", "currency": "chf"},
    "en-PL": {"price_market_slug": "poland_pl",      "currency": "pln"},
    "en-NZ": {"price_market_slug": "new_zealand_en", "currency": "nzd"},
    "en-JP": {"price_market_slug": "japan_en",       "currency": "jpy"},
}

# Category URL fragments that indicate a navigation/category link (not a product)
CATEGORY_FRAGMENTS = [
    "warhammer-40000", "age-of-sigmar", "the-horus-heresy", "the-old-world",
    "middle-earth", "other-games", "kill-team", "space-marines", "armies-of",
    "xenos-armies", "chaos", "start-here", "pre-order", "new-release",
    "back-in-stock", "terrain", "gaming-rules", "unit-type", "ways-to-play",
    "explore", "rule", "black-library-novel", "cart", "help", "store-finder",
    "delivery", "legal", "online-only", "available-while",
]


# ---------------------------------------------------------------------------
# Kit loader
# ---------------------------------------------------------------------------

def load_kits() -> list[dict]:
    kits: list[dict] = []
    for filepath in glob.glob(KITS_GLOB, recursive=True):
        content = Path(filepath).read_text()
        blocks = re.split(r"\nexport const ", content)
        for block in blocks[1:]:
            seed_m = re.search(r'id:\s*kitId\("([^"]+)"\)', block)
            slug_m = re.search(r'kit_slug:\s*"([^"]+)"', block)
            name_m = re.search(r'(?:kit_name|display_name):\s*"([^"]+)"', block)
            code_m = re.search(r'gw_product_code:\s*(?:"([^"]+)"|null)', block)
            if seed_m and slug_m:
                gw_code = code_m.group(1) if code_m and code_m.group(1) else None
                kits.append({
                    "seed_slug": seed_m.group(1),
                    "kit_slug": slug_m.group(1),
                    "kit_name": name_m.group(1) if name_m else "",
                    "gw_product_code": gw_code,
                })
    return kits


def kits_by_code(kits: list[dict]) -> dict[str, dict]:
    return {k["gw_product_code"]: k for k in kits if k["gw_product_code"]}


def kits_by_slug(kits: list[dict]) -> dict[str, dict]:
    """Normalize kit_slug for fuzzy name matching against GW product slugs."""
    result = {}
    for k in kits:
        slug = k["kit_slug"]
        norm = slug.lower().replace("-", "_")
        result[norm] = k
        # Also index with common typo fixes
        fixed = norm.replace("commmand", "command")
        if fixed != norm:
            result[fixed] = k
    return result


def normalize_gw_slug_for_matching(gw_slug: str) -> str:
    """Normalize a GW product slug to match against kit_slug."""
    s = re.sub(r"-20\d{2}(-eng|-ENG|-en|-EN)?$", "", gw_slug)
    return s.lower().replace("-", "_").replace(" ", "_")


_FACTION_PREFIXES = [
    "necrons_", "space_marines_", "aeldari_", "craftworlds_",
    "orks_", "tyranids_", "tau_empire_", "t_au_empire_", "tau_",
    "chaos_space_marines_", "drukhari_", "adeptus_mechanicus_",
    "thousand_sons_", "death_guard_", "world_eaters_", "emperors_children_",
    "chaos_daemons_", "genestealer_cults_", "adepta_sororitas_",
    "adeptus_custodes_", "sisters_of_battle_", "imperial_guard_",
    "astra_militarum_", "leagues_of_votann_", "blood_angels_",
    "dark_angels_", "space_wolves_", "deathwatch_", "grey_knights_",
    "black_templars_", "ultramarines_", "salamanders_", "iron_hands_",
    "white_scars_", "raven_guard_", "imperial_fists_",
]


def name_match_gw_slug(gw_slug: str, kit_norm_map: dict[str, dict]) -> dict | None:
    """Try to match a GW slug to a seed kit by name normalization."""
    n = normalize_gw_slug_for_matching(gw_slug)

    # Try without and with year preserved
    candidates = [n]
    year_m = re.search(r"-20\d{2}$", gw_slug)
    if year_m:
        n_with_year = n + "_" + year_m.group(0).lstrip("-")
        candidates.append(n_with_year)

    for candidate in candidates:
        if candidate in kit_norm_map:
            return kit_norm_map[candidate]

    # Try stripping faction prefix
    for prefix in _FACTION_PREFIXES:
        if n.startswith(prefix):
            stripped = n[len(prefix):]
            if stripped in kit_norm_map:
                return kit_norm_map[stripped]
            short = prefix.rstrip("s_") + "_"
            if short != prefix and (short + stripped) in kit_norm_map:
                return kit_norm_map[short + stripped]

    # Try matching when kit slug is a compound of the GW slug
    # e.g. "necron_doom_scythe" matches "necron_doom_scythe_night_scythe"
    compound_matches = [
        kit for norm_k, kit in kit_norm_map.items()
        if norm_k.startswith(n + "_") and not norm_k.endswith("_repackage")
        and norm_k.count("_") <= n.count("_") + 2  # at most 2 extra words
    ]
    if len(compound_matches) == 1:
        return compound_matches[0]

    return None


# ---------------------------------------------------------------------------
# Catalog (slug discovery + product code mapping)
# ---------------------------------------------------------------------------

def load_slug_catalog() -> dict:
    """
    Catalog format:
    {
        "crawled_categories": [...],           # category paths already crawled
        "slugs": {"Necrons-Illuminor-Szeras-2020": {"product_code": "99120110049", "prices": {...}}},
    }
    """
    if SLUG_CATALOG_FILE.exists():
        return json.loads(SLUG_CATALOG_FILE.read_text())
    return {"crawled_categories": [], "slugs": {}}


def save_slug_catalog(catalog: dict) -> None:
    SLUG_CATALOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    SLUG_CATALOG_FILE.write_text(json.dumps(catalog, indent=2, ensure_ascii=False))


# ---------------------------------------------------------------------------
# Prices cache
# ---------------------------------------------------------------------------

def load_prices_cache() -> dict:
    if PRICES_CACHE_FILE.exists():
        return json.loads(PRICES_CACHE_FILE.read_text())
    return {}


def save_prices_cache(cache: dict) -> None:
    PRICES_CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
    PRICES_CACHE_FILE.write_text(json.dumps(cache, indent=2, ensure_ascii=False))


def prices_key(seed_slug: str, locale: str) -> str:
    return f"{seed_slug}.{locale}"


# ---------------------------------------------------------------------------
# Price extraction from __NEXT_DATA__
# ---------------------------------------------------------------------------

def extract_prices_from_next_data(nd_text: str, expected_currency: str | None = None) -> list[tuple[float, str]]:
    """
    Extract (amount, currency_code) pairs from centAmount price objects in Next.js data.
    Returns unique price values in descending order (main product price is typically highest/first).
    """
    pattern = r'"centAmount":\s*(\d+),\s*"currencyCode":\s*"([A-Z]{3})",\s*"fractionDigits":\s*(\d+)'
    matches = re.findall(pattern, nd_text)
    seen: set[tuple[float, str]] = set()
    results: list[tuple[float, str]] = []
    for ca, cc, fd in matches:
        if expected_currency and cc != expected_currency:
            continue
        amount = int(ca) / (10 ** int(fd))
        if (amount, cc) not in seen and amount > 0:
            seen.add((amount, cc))
            results.append((amount, cc))
    return sorted(results, reverse=True)  # highest first = main product price


def extract_product_codes_from_next_data(nd_text: str) -> list[str]:
    codes = re.findall(r'"9912\d{7}"', nd_text)
    return list(dict.fromkeys(c.strip('"') for c in codes))


def extract_product_code_from_next_data(nd_text: str) -> str | None:
    codes = extract_product_codes_from_next_data(nd_text)
    return codes[0] if codes else None


def extract_locale_currency_from_next_data(nd_text: str) -> str | None:
    m = re.search(r'"currency":\s*"([A-Z]{3})"', nd_text)
    return m.group(1) if m else None


def extract_composition_from_next_data(nd_text: str) -> dict | None:
    """
    Extract kit composition data from __NEXT_DATA__ attributesRaw.

    Returns dict with:
      long_description: str  — full HTML description including "This set builds..." section
      features: list[str]    — bullet-point feature strings
      pim_key: str | None    — product code from pimKey attribute (more reliable than regex)

    Returns None if no attributesRaw can be found.
    """
    try:
        nd = json.loads(nd_text)
        attrs_raw = (
            nd.get("props", {})
            .get("pageProps", {})
            .get("context", {})
            .get("productInformation", {})
            .get("inStore", {})
            .get("product", {})
            .get("masterData", {})
            .get("current", {})
            .get("masterVariant", {})
            .get("attributesRaw", [])
        )
    except (json.JSONDecodeError, AttributeError):
        return None

    if not attrs_raw:
        return None

    attr_map = {a["name"]: a["value"] for a in attrs_raw if isinstance(a, dict)}

    # longDescription is locale-keyed: {"en-US": "..."}
    long_desc_raw = attr_map.get("longDescription")
    long_description: str | None = None
    if isinstance(long_desc_raw, dict):
        long_description = long_desc_raw.get("en-US") or long_desc_raw.get("en-GB")
    elif isinstance(long_desc_raw, str):
        long_description = long_desc_raw or None

    # features is a list of locale-keyed dicts: [{"en-US": "..."}, ...]
    features_raw = attr_map.get("features", [])
    features: list[str] = []
    for f in features_raw:
        if isinstance(f, dict):
            text = f.get("en-US") or f.get("en-GB") or ""
        elif isinstance(f, str):
            text = f
        else:
            text = ""
        if text:
            features.append(text)

    # pimKey is the product code — more direct than regex scanning
    pim_key_raw = attr_map.get("pimKey")
    pim_key: str | None = str(pim_key_raw) if pim_key_raw else None

    # Product name from masterData.current.name
    product_name: str | None = (
        nd.get("props", {})
        .get("pageProps", {})
        .get("context", {})
        .get("productInformation", {})
        .get("inStore", {})
        .get("product", {})
        .get("masterData", {})
        .get("current", {})
        .get("name")
    )

    if not long_description and not features and not product_name:
        return None

    return {
        "long_description": long_description,
        "features": features,
        "pim_key": pim_key,
        "product_name": product_name,
    }


# ---------------------------------------------------------------------------
# Composition cache
# ---------------------------------------------------------------------------

def load_composition_cache() -> dict:
    if COMPOSITION_CACHE_FILE.exists():
        return json.loads(COMPOSITION_CACHE_FILE.read_text())
    return {}


def save_composition_cache(cache: dict) -> None:
    COMPOSITION_CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
    COMPOSITION_CACHE_FILE.write_text(json.dumps(cache, indent=2, ensure_ascii=False))


def load_composition_review() -> dict:
    if COMPOSITION_REVIEW_FILE.exists():
        return json.loads(COMPOSITION_REVIEW_FILE.read_text())
    return {}


def save_composition_review(review: dict) -> None:
    COMPOSITION_REVIEW_FILE.parent.mkdir(parents=True, exist_ok=True)
    COMPOSITION_REVIEW_FILE.write_text(json.dumps(review, indent=2, ensure_ascii=False))


# ---------------------------------------------------------------------------
# Unit models loader (for single-model inference)
# ---------------------------------------------------------------------------

def load_unit_models() -> dict[str, list[tuple[int, int]]]:
    """
    Returns: {unit_slug: [(min_count, max_count), ...]} for all unit_model entries.
    Used to infer whether a kit builds a definitively single-model unit.
    """
    unit_models: dict[str, list[tuple[int, int]]] = {}
    for filepath in glob.glob(UNIT_MODELS_GLOB, recursive=True):
        content = Path(filepath).read_text()
        # Match unit_id, minimum_model_count, maximum_model_count blocks
        # Each UnitModelConfig block has these three fields
        blocks = re.findall(
            r'unit_id:\s*unitId\("([^"]+)"\).*?minimum_model_count:\s*(\d+).*?maximum_model_count:\s*(\d+)',
            content,
            re.DOTALL,
        )
        for unit_slug, mn, mx in blocks:
            if unit_slug not in unit_models:
                unit_models[unit_slug] = []
            unit_models[unit_slug].append((int(mn), int(mx)))
    return unit_models


def single_model_units(unit_models: dict[str, list[tuple[int, int]]]) -> set[str]:
    """Unit slugs where every model entry has min=max=1 (exactly one model)."""
    return {
        slug for slug, entries in unit_models.items()
        if entries and all(mn == 1 and mx == 1 for mn, mx in entries)
    }


_UNIT_SLUG_PREFIXES = [
    "space_marines_", "necrons_", "blood_angels_", "dark_angels_",
    "space_wolves_", "black_templars_", "adepta_sororitas_",
    "adeptus_mechanicus_", "adeptus_custodes_", "aeldari_",
    "genestealer_cults_", "grey_knights_", "chaos_space_marines_",
    "death_guard_", "thousand_sons_", "world_eaters_", "emperors_children_",
    "tyranids_", "orks_", "tau_empire_", "drukhari_", "astra_militarum_",
    "imperial_knights_", "chaos_knights_", "necron_", "deathwatch_",
    "ultramarines_", "salamanders_", "iron_hands_", "white_scars_",
    "raven_guard_", "imperial_fists_", "leagues_of_votann_",
    "chaos_daemons_", "imperial_agents_",
]

# Kit slug fragments that also strip "primaris_" sub-prefix after faction strip
_PRIMARIS_STRIP = "primaris_"


def kit_slug_to_unit_candidates(kit_seed_slug: str) -> list[str]:
    """Generate candidate unit_slugs from a kit seed_slug by stripping faction prefixes."""
    candidates = [kit_seed_slug]
    stripped = kit_seed_slug
    for prefix in _UNIT_SLUG_PREFIXES:
        if kit_seed_slug.startswith(prefix):
            stripped = kit_seed_slug[len(prefix):]
            candidates.append(stripped)
            # Also try stripping an additional "primaris_" sub-prefix
            if stripped.startswith(_PRIMARIS_STRIP):
                candidates.append(stripped[len(_PRIMARIS_STRIP):])
            break
    return candidates


def infer_unit_slug(kit_seed_slug: str, all_unit_slugs: set[str]) -> str | None:
    """Return the best matching unit_slug for a kit, or None if ambiguous."""
    for candidate in kit_slug_to_unit_candidates(kit_seed_slug):
        if candidate in all_unit_slugs:
            return candidate
    return None


# ---------------------------------------------------------------------------
# HTML composition extraction (for legacy GW pages)
# ---------------------------------------------------------------------------

# Patterns that indicate the composition section of a product page
_NX_PATTERN = re.compile(r"[–\-]\s*(\d+)\s*[xX]\s+([^\n<]{3,80})")
_SET_BUILDS_PATTERN = re.compile(
    r"(?:This (?:set|box(?:ed set)?|kit) (?:builds|contains|includes)[^.]{0,200}?)"
    r"(?:[–\-]\s*\d+\s*[xX]\s+[^\n<]{3,80})",
    re.DOTALL,
)
_COMPRISES_PATTERN = re.compile(
    r"This kit comprises.*?(\d+)[^.]*?(?:plastic|resin|metal)\s+(?:components?|parts?|pieces?)",
    re.DOTALL | re.IGNORECASE,
)


def strip_html_to_text(html: str) -> str:
    """Strip HTML tags and decode entities to plain text."""
    from html import unescape
    import codecs
    # Decode unicode escapes like < → <
    try:
        html = codecs.decode(html, "unicode_escape") if "\\u00" in html else html
    except Exception:
        pass
    # Normalise line breaks
    text = re.sub(r"<br\s*/?>", "\n", html, flags=re.IGNORECASE)
    text = re.sub(r"</(?:p|li|div|tr)[^>]*>", "\n", text, flags=re.IGNORECASE)
    # Remove remaining tags
    text = re.sub(r"<[^>]+>", " ", text)
    text = unescape(text)
    # Collapse horizontal whitespace but keep newlines
    text = re.sub(r"[ \t]+", " ", text)
    return text


def extract_nx_items_from_html(html: str) -> list[tuple[int, str]]:
    """
    Extract (quantity, name) tuples from a GW product description HTML fragment.

    Should be called on the product description section only (not the full page)
    to avoid false matches from related product tiles or carousels.
    """
    text = strip_html_to_text(html)

    items = []
    for m in _NX_PATTERN.finditer(text):
        qty = int(m.group(1))
        name = m.group(2).strip().rstrip(".,;:")
        # Must look like a unit/model name: reasonable length, no leftover HTML
        if len(name) < 3 or len(name) > 80:
            continue
        if "<" in name or ">" in name or "\\" in name:
            continue
        lower = name.lower()
        # Filter out non-unit lines (bases, components, transfers, sprues, etc.)
        if any(w in lower for w in [
            "base", "transfer", "sprue", "component", "part", "piece",
            "citadel", "round", "oval", "hex", "flying", "stem",
            "instruction", "sheet", "token", "card", "dice", "ruler",
        ]):
            continue
        items.append((qty, name))

    return items


def extract_product_description_from_html(html: str) -> str | None:
    """
    Pull only the product description section from a GW page (legacy or Next.js).

    GW legacy pages embed the description in a known div. We deliberately only
    extract that section — not the full page — to avoid picking up Nx patterns
    from related product tiles, carousels, or other page furniture.
    """
    # GW legacy pages: productView-description or similar
    patterns = [
        # Legacy BigCommerce-style GW pages
        r'<div[^>]+class="[^"]*productView-description[^"]*"[^>]*>(.*?)</div\s*>',
        r'<div[^>]+class="[^"]*product-description[^"]*"[^>]*>(.*?)</div\s*>',
        r'<div[^>]+id="[^"]*product-description[^"]*"[^>]*>(.*?)</div\s*>',
        # Next.js rendered pages sometimes use article or section
        r'<article[^>]*>(.*?)</article>',
        # Generic prose containers
        r'<div[^>]+class="[^"]*prose[^"]*"[^>]*>(.*?)</div\s*>',
    ]
    for pattern in patterns:
        m = re.search(pattern, html, re.DOTALL | re.IGNORECASE)
        if m:
            content = m.group(1)
            # Must be substantial and contain at least one sentence
            if len(content) > 150 and "." in content:
                return content

    # Fallback: look for any div that contains "This set builds" or "This kit comprises"
    # anchor text — only take the surrounding container
    anchor_m = re.search(
        r'(<div[^>]*>(?:(?!</div>).){0,500}?(?:This (?:set|box|kit) (?:builds|contains|comprises))'
        r'(?:(?!</div>).){0,2000}?</div>)',
        html,
        re.DOTALL | re.IGNORECASE,
    )
    if anchor_m:
        return anchor_m.group(1)

    return None


def has_structured_nx(long_description: str | None) -> bool:
    """True if the long_description already has '– Nx Unit' composition lines."""
    if not long_description:
        return False
    return bool(_NX_PATTERN.search(long_description))


# ---------------------------------------------------------------------------
# Playwright helpers
# ---------------------------------------------------------------------------

def make_browser_context(pw, headed: bool = True):
    browser = pw.chromium.launch(
        headless=not headed,
        args=["--disable-blink-features=AutomationControlled", "--no-sandbox", "--disable-dev-shm-usage"],
    )
    ctx = browser.new_context(
        user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        viewport={"width": 1440, "height": 900},
    )
    ctx.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    return browser, ctx


def warm_up_browser(page) -> str | None:
    """
    Navigate to GW homepage to pass WAF/QueueIT challenge and extract buildId.
    Returns the Next.js buildId needed for /_next/data/ API calls.

    GW uses AWS WAF + QueueIT during high-traffic events (e.g. new edition launches).
    QueueIT does a proof-of-work JS challenge then redirects — we wait up to 45s for it.
    """
    print("  Warming up browser (GW homepage)...")
    for locale in ("en-GB", "en-US"):
        try:
            page.goto(f"{BASE_URL}/{locale}", wait_until="domcontentloaded", timeout=30000)

            # Wait up to 45s for QueueIT / WAF redirect to complete and real page to load
            deadline = time.time() + 45
            build_id = None
            while time.time() < deadline:
                time.sleep(3)
                url = page.url
                # Still on queue page — keep waiting for redirect
                if "queue." in url or "awswaf" in url:
                    continue
                # Try to get buildId from __NEXT_DATA__
                nd_text = page.evaluate(
                    '() => { const el = document.getElementById("__NEXT_DATA__"); return el ? el.textContent : null; }'
                )
                if nd_text:
                    nd = json.loads(nd_text)
                    build_id = nd.get("buildId")
                    if build_id:
                        break
                # Fallback: scan page source
                content = page.content()
                m = re.search(r'"buildId"\s*:\s*"([A-Za-z0-9_-]{8,})"', content)
                if m:
                    build_id = m.group(1)
                    break

            if build_id:
                print(f"  Build ID: {build_id} (via {locale})")
                return build_id

        except Exception as e:
            print(f"  Warm-up attempt ({locale}) failed: {e}")
            continue

    print("  Warning: could not extract buildId (site may be in queue/WAF mode)")
    return None


def is_waf_blocked_response(data: dict) -> bool:
    """Check if the API response indicates a WAF block rather than real data."""
    if not data or "pageProps" not in data:
        return True
    return False


def fetch_product_data_via_api(
    page,
    slug: str,
    locale: str,
    build_id: str,
    delay_range: tuple[float, float] = (0.5, 1.5),
) -> dict | None:
    """
    Fetch product data via the Next.js JSON API endpoint.

    Uses page.evaluate(fetch(...)) — reuses the current browser session's WAF
    cookie without triggering a full page navigation. Much faster than page.goto().

    URL pattern: /_next/data/{buildId}/{locale}/shop/{slug}.json?slug=shop&slug={slug}

    The API response is { pageProps: { context: { productInformation: {...} } } }
    We wrap it as { props: { pageProps: ... } } to match our existing extraction
    functions which expect the full __NEXT_DATA__ shape.
    """
    api_url = f"{BASE_URL}/_next/data/{build_id}/{locale}/shop/{slug}.json?slug=shop&slug={slug}"
    try:
        result = page.evaluate(f"""
        async () => {{
            try {{
                const resp = await fetch("{api_url}", {{
                    headers: {{
                        "x-nextjs-data": "1",
                        "accept": "*/*"
                    }}
                }});
                if (!resp.ok) return {{ _error: resp.status, _url: resp.url }};
                return await resp.json();
            }} catch(e) {{
                return {{ _error: e.message }};
            }}
        }}
        """)

        if not result or result.get("_error"):
            err = result.get("_error") if result else "null response"
            print(f"    API error for {slug} ({locale}): {err}")
            return None

        if is_waf_blocked_response(result):
            print(f"    WAF block detected for {slug} ({locale})")
            return None

        # Wrap to match __NEXT_DATA__ shape expected by extraction functions
        nd_text = json.dumps({"props": result})

        currency = extract_locale_currency_from_next_data(nd_text)
        prices = extract_prices_from_next_data(nd_text, currency)
        all_codes = extract_product_codes_from_next_data(nd_text)

        # Composition only for en-GB (same content across locales, no need to re-fetch)
        composition = extract_composition_from_next_data(nd_text) if locale == "en-GB" else None

        # pimKey from composition is the cleanest product code
        product_code = (
            composition["pim_key"] if composition and composition.get("pim_key")
            else (all_codes[0] if all_codes else None)
        )

        if not prices:
            return {
                "product_code": product_code,
                "all_codes": all_codes,
                "price": None,
                "currency": currency,
                "composition": composition,
                "status": "no_price",
            }

        main_price, main_currency = prices[0]
        return {
            "product_code": product_code,
            "all_codes": all_codes,
            "price": main_price,
            "currency": main_currency,
            "locale": locale,
            "composition": composition,
            "fetched_at": datetime.now(timezone.utc).isoformat(),
            "status": "ok",
        }

    except Exception as e:
        print(f"    Error fetching {slug} ({locale}): {e}")
        return None
    finally:
        time.sleep(random.uniform(*delay_range))


def collect_product_slugs_from_page(page, category_path: str) -> list[str]:
    """
    Navigate to a GW category page and collect all product page slugs.
    Still uses page.goto() — category pages need full render for lazy-loaded tiles.
    Returns slugs (the path segment after /shop/).
    """
    url = f"{BASE_URL}/en-GB/{category_path}"
    resp = page.goto(url, wait_until="domcontentloaded", timeout=30000)
    if resp.status not in (200, 304):
        return []

    time.sleep(8)

    title = page.title()
    if "Human Verification" in title or page.content().count("__NEXT_DATA__") == 0:
        print("    WAF challenge detected — re-warming browser...")
        warm_up_browser(page)
        resp = page.goto(url, wait_until="domcontentloaded", timeout=30000)
        if resp.status not in (200, 304):
            return []
        time.sleep(8)

    # Scroll to trigger lazy loading
    for _ in range(40):
        page.evaluate("window.scrollBy(0, 500)")
        time.sleep(0.25)
    time.sleep(4)

    content = page.content()
    hrefs = re.findall(r'href="(/en-GB/shop/[^"?#]+)"', content)
    unique_hrefs = list(dict.fromkeys(hrefs))

    product_slugs = []
    for href in unique_hrefs:
        slug_parts = href.replace("/en-GB/shop/", "").split("/")
        if len(slug_parts) != 1:
            continue
        slug = unquote(slug_parts[0])
        if any(frag in slug.lower() for frag in CATEGORY_FRAGMENTS):
            continue
        product_slugs.append(slug)

    return product_slugs


# ---------------------------------------------------------------------------
# Phase 1: Crawl category pages for slugs
# ---------------------------------------------------------------------------

def phase_crawl(args, catalog: dict) -> None:
    print("\n=== Phase 1: Crawl category pages for product slugs ===")
    already_crawled = set(catalog["crawled_categories"])
    to_crawl = [p for p in GW_CATEGORY_PATHS if p not in already_crawled]
    if args.limit:
        to_crawl = to_crawl[:args.limit]

    if not to_crawl:
        print("  All categories already crawled.")
        return

    SESSION_BATCH = 4  # Fresh browser session every N categories to avoid WAF

    from playwright.sync_api import sync_playwright
    new_slugs = 0

    for batch_start in range(0, len(to_crawl), SESSION_BATCH):
        batch = to_crawl[batch_start: batch_start + SESSION_BATCH]
        with sync_playwright() as pw:
            browser, ctx = make_browser_context(pw, headed=True)
            page = ctx.new_page()
            warm_up_browser(page)

            for i, cat_path in enumerate(batch):
                overall_i = batch_start + i + 1
                print(f"  [{overall_i}/{len(to_crawl)}] {cat_path}")
                slugs = collect_product_slugs_from_page(page, cat_path)
                print(f"    Found {len(slugs)} product slugs")

                for slug in slugs:
                    if slug not in catalog["slugs"]:
                        catalog["slugs"][slug] = {"product_code": None, "prices": {}}
                        new_slugs += 1

                catalog["crawled_categories"].append(cat_path)
                save_slug_catalog(catalog)
                time.sleep(random.uniform(4.0, 7.0))

            browser.close()
        time.sleep(5)  # Brief pause between browser sessions

    total_slugs = len(catalog["slugs"])
    print(f"  Done. {new_slugs} new slugs added. Total: {total_slugs} slugs.")


# ---------------------------------------------------------------------------
# Phase 1b: Name-based slug→kit matching (no network requests)
# ---------------------------------------------------------------------------

def phase_name_match(catalog: dict, kits: list[dict]) -> None:
    print("\n=== Phase 1b: Name-based GW slug → kit matching ===")
    kit_norm_map = kits_by_slug(kits)
    matched = 0
    for gw_slug, data in catalog["slugs"].items():
        if data.get("name_matched_seed_slug"):
            continue
        kit = name_match_gw_slug(gw_slug, kit_norm_map)
        if kit:
            data["name_matched_seed_slug"] = kit["seed_slug"]
            data["name_matched_kit_slug"] = kit["kit_slug"]
            matched += 1
    save_slug_catalog(catalog)
    total_name = sum(1 for d in catalog["slugs"].values() if d.get("name_matched_seed_slug"))
    print(f"  Matched {matched} new slugs. Total name-matched: {total_name}")


# ---------------------------------------------------------------------------
# Phase 2: Fetch en-GB for each slug to get product_code + GBP price
# ---------------------------------------------------------------------------

def phase_map(args, catalog: dict, kits_by_code_map: dict[str, dict]) -> None:
    print("\n=== Phase 2: Fetch product pages (en-GB) to map codes → slugs ===")
    slugs_needing_code = [
        s for s, data in catalog["slugs"].items()
        if data.get("product_code") is None or data.get("product_code") == "FETCH_FAILED"
    ]
    if args.limit:
        slugs_needing_code = slugs_needing_code[:args.limit]

    if not slugs_needing_code:
        print("  All slugs already have product codes.")
        return

    print(f"  {len(slugs_needing_code)} slugs to fetch")

    from playwright.sync_api import sync_playwright

    # Each browser session can handle many more slugs now — API calls instead of page navigations
    MAP_BATCH = 60

    for batch_start in range(0, len(slugs_needing_code), MAP_BATCH):
        batch = slugs_needing_code[batch_start: batch_start + MAP_BATCH]
        with sync_playwright() as pw:
            browser, ctx = make_browser_context(pw, headed=True)
            page = ctx.new_page()
            build_id = warm_up_browser(page)

            if not build_id:
                print("  ERROR: could not get buildId — skipping batch")
                browser.close()
                continue

            for i, slug in enumerate(batch):
                overall_i = batch_start + i + 1
                print(f"  [{overall_i}/{len(slugs_needing_code)}] {slug}")
                result = fetch_product_data_via_api(page, slug, "en-GB", build_id)
                if result:
                    pim_code = result.get("product_code")
                    nd_text_codes = result.get("all_codes", [])
                    first_codes = ([pim_code] + [c for c in nd_text_codes[:3] if c != pim_code]) if pim_code else nd_text_codes[:3]
                    matched_code = next((c for c in first_codes if c and c in kits_by_code_map), None)
                    primary_code = pim_code or (nd_text_codes[0] if nd_text_codes else None)
                    catalog["slugs"][slug]["product_code"] = primary_code
                    if result.get("price") is not None:
                        catalog["slugs"][slug].setdefault("prices", {})["en-GB"] = {
                            "price": result["price"],
                            "currency": result["currency"],
                            "fetched_at": result["fetched_at"],
                        }
                    if result.get("composition"):
                        catalog["slugs"][slug]["composition"] = result["composition"]
                    kit = kits_by_code_map.get(matched_code) if matched_code else None
                    has_comp = "✓" if result.get("composition") else "✗"
                    print(f"    code={primary_code}, price={result.get('price')} {result.get('currency')}, comp={has_comp}, kit={kit['seed_slug'] if kit else 'NOT MATCHED'}")
                else:
                    print(f"    FAILED")
                    catalog["slugs"][slug]["product_code"] = "FETCH_FAILED"

                save_slug_catalog(catalog)

            browser.close()
        time.sleep(random.uniform(3.0, 6.0))

    matched = sum(
        1 for s, d in catalog["slugs"].items()
        if d.get("product_code") and d["product_code"] in kits_by_code_map
    )
    print(f"  Done. {matched} slugs matched to seed kits.")


# ---------------------------------------------------------------------------
# Phase 3: Fetch all locales for matched kits
# ---------------------------------------------------------------------------

def phase_prices(args, catalog: dict, kits_by_code_map: dict[str, dict], prices_cache: dict, composition_cache: dict) -> None:
    print("\n=== Phase 3: Fetch locale prices for matched kits ===")

    locales = [args.locale] if args.locale else LOCALES

    # Build mapping: seed_slug → gw_slug from BOTH product-code matches AND name matches
    seed_to_gw_slug: dict[str, str] = {}
    seed_to_code: dict[str, str | None] = {}

    for gw_slug, data in catalog["slugs"].items():
        code = data.get("product_code")
        if code and code in kits_by_code_map:
            seed_slug = kits_by_code_map[code]["seed_slug"]
            seed_to_gw_slug[seed_slug] = gw_slug
            seed_to_code[seed_slug] = code

    for gw_slug, data in catalog["slugs"].items():
        name_slug = data.get("name_matched_seed_slug")
        if name_slug and name_slug not in seed_to_gw_slug:
            seed_to_gw_slug[name_slug] = gw_slug
            seed_to_code.setdefault(name_slug, None)

    print(f"  {len(seed_to_gw_slug)} kits have matched GW slugs (code + name)")

    # Copy already-fetched en-GB prices from catalog to prices_cache
    for gw_slug, data in catalog["slugs"].items():
        code = data.get("product_code")
        name_slug = data.get("name_matched_seed_slug")
        seed_slug = (kits_by_code_map[code]["seed_slug"] if code and code in kits_by_code_map else name_slug)
        if not seed_slug:
            continue
        for locale, price_data in data.get("prices", {}).items():
            key = prices_key(seed_slug, locale)
            if key not in prices_cache and price_data.get("price") is not None:
                prices_cache[key] = {
                    "price": price_data["price"],
                    "currency": price_data["currency"],
                    "locale": locale,
                    "gw_slug": gw_slug,
                    "gw_product_code": code,
                    "source": "gw_direct",
                    "fetched_at": price_data["fetched_at"],
                }

    save_prices_cache(prices_cache)

    # All locales needed (including en-GB for name-matched kits that skipped phase 2)
    kits_to_fetch = []
    for seed_slug, gw_slug in seed_to_gw_slug.items():
        for locale in locales:
            key = prices_key(seed_slug, locale)
            if key not in prices_cache:
                kits_to_fetch.append((seed_slug, gw_slug, locale))

    if args.limit:
        kits_to_fetch = kits_to_fetch[:args.limit]

    if not kits_to_fetch:
        print("  All locale prices already cached.")
        return

    print(f"  {len(kits_to_fetch)} (kit, locale) pairs remaining")

    from playwright.sync_api import sync_playwright

    # API calls instead of page navigations — large batches are fine now
    PRICES_BATCH = 120

    for batch_start in range(0, len(kits_to_fetch), PRICES_BATCH):
        batch = kits_to_fetch[batch_start: batch_start + PRICES_BATCH]
        with sync_playwright() as pw:
            browser, ctx = make_browser_context(pw, headed=True)
            page = ctx.new_page()
            build_id = warm_up_browser(page)

            if not build_id:
                print("  ERROR: could not get buildId — skipping batch")
                browser.close()
                continue

            for i, (seed_slug, gw_slug, locale) in enumerate(batch):
                overall_i = batch_start + i + 1
                key = prices_key(seed_slug, locale)
                code = seed_to_code.get(seed_slug)
                print(f"  [{overall_i}/{len(kits_to_fetch)}] {seed_slug} ({locale})")
                result = fetch_product_data_via_api(page, gw_slug, locale, build_id)
                if result and result.get("price") is not None:
                    prices_cache[key] = {
                        "price": result["price"],
                        "currency": result["currency"],
                        "locale": locale,
                        "gw_slug": gw_slug,
                        "gw_product_code": code,
                        "source": "gw_direct",
                        "fetched_at": result["fetched_at"],
                    }
                    # Capture composition once per kit from the en-GB page
                    if locale == "en-GB" and result.get("composition") and seed_slug not in composition_cache:
                        composition_cache[seed_slug] = {
                            "gw_slug": gw_slug,
                            "gw_product_code": code,
                            "fetched_at": result["fetched_at"],
                            **result["composition"],
                        }
                        save_composition_cache(composition_cache)
                    has_comp = "✓" if result.get("composition") else ""
                    print(f"    {result['price']} {result['currency']} {has_comp}")
                else:
                    prices_cache[key] = {
                        "price": None,
                        "locale": locale,
                        "gw_slug": gw_slug,
                        "source": "gw_direct_failed",
                        "fetched_at": datetime.now(timezone.utc).isoformat(),
                    }
                    print(f"    FAILED")

                save_prices_cache(prices_cache)

            browser.close()
        time.sleep(random.uniform(3.0, 6.0))

    successful = sum(1 for v in prices_cache.values() if v.get("price") is not None)
    print(f"  Done. Cache: {len(prices_cache)} entries, {successful} with prices.")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def phase_composition_backfill(args, catalog: dict, kits_by_code_map: dict[str, dict], composition_cache: dict) -> None:
    """
    Phase 4 (--composition-backfill): Re-visit en-GB product pages for kits that
    already have prices cached but are missing composition data. Runs one locale
    (en-GB) only, skips kits already in composition_cache.
    """
    print("\n=== Phase 4: Backfill composition data for already-priced kits ===")

    # Build seed_slug → gw_slug mapping (same as phase 3)
    seed_to_gw_slug: dict[str, str] = {}
    for gw_slug, data in catalog["slugs"].items():
        code = data.get("product_code")
        if code and code in kits_by_code_map:
            seed_to_gw_slug[kits_by_code_map[code]["seed_slug"]] = gw_slug
    for gw_slug, data in catalog["slugs"].items():
        name_slug = data.get("name_matched_seed_slug")
        if name_slug and name_slug not in seed_to_gw_slug:
            seed_to_gw_slug[name_slug] = gw_slug

    # Also pull composition from already-fetched catalog entries (no network needed)
    pulled = 0
    for gw_slug, data in catalog["slugs"].items():
        comp = data.get("composition")
        if not comp:
            continue
        code = data.get("product_code")
        name_slug = data.get("name_matched_seed_slug")
        seed_slug = (kits_by_code_map[code]["seed_slug"] if code and code in kits_by_code_map else name_slug)
        if seed_slug and seed_slug not in composition_cache:
            composition_cache[seed_slug] = {
                "gw_slug": gw_slug,
                "gw_product_code": code,
                "fetched_at": data.get("prices", {}).get("en-GB", {}).get("fetched_at", ""),
                **comp,
            }
            pulled += 1
    if pulled:
        save_composition_cache(composition_cache)
        print(f"  Pulled {pulled} composition entries from existing catalog data (no network).")

    kits_needing_composition = [
        (seed_slug, gw_slug)
        for seed_slug, gw_slug in seed_to_gw_slug.items()
        if seed_slug not in composition_cache
    ]

    if args.limit:
        kits_needing_composition = kits_needing_composition[:args.limit]

    if not kits_needing_composition:
        print("  All matched kits already have composition data.")
        return

    print(f"  {len(kits_needing_composition)} kits need composition fetch (en-GB only)")

    from playwright.sync_api import sync_playwright
    COMP_BATCH = 100

    for batch_start in range(0, len(kits_needing_composition), COMP_BATCH):
        batch = kits_needing_composition[batch_start: batch_start + COMP_BATCH]
        with sync_playwright() as pw:
            browser, ctx = make_browser_context(pw, headed=True)
            page = ctx.new_page()
            build_id = warm_up_browser(page)

            if not build_id:
                print("  ERROR: could not get buildId — skipping batch")
                browser.close()
                continue

            for i, (seed_slug, gw_slug) in enumerate(batch):
                overall_i = batch_start + i + 1
                code = catalog["slugs"].get(gw_slug, {}).get("product_code")
                print(f"  [{overall_i}/{len(kits_needing_composition)}] {seed_slug}")
                result = fetch_product_data_via_api(page, gw_slug, "en-GB", build_id)
                if result and result.get("composition"):
                    composition_cache[seed_slug] = {
                        "gw_slug": gw_slug,
                        "gw_product_code": code,
                        "fetched_at": result.get("fetched_at", datetime.now(timezone.utc).isoformat()),
                        **result["composition"],
                    }
                    save_composition_cache(composition_cache)
                    print(f"    ✓ composition captured")
                else:
                    print(f"    ✗ no composition data")

            browser.close()
        time.sleep(random.uniform(3.0, 6.0))

    print(f"  Done. Composition cache: {len(composition_cache)} entries.")


def phase_direct_fetch(args, catalog: dict, kits: list[dict], kits_by_code_map: dict[str, dict],
                       prices_cache: dict, composition_cache: dict) -> None:
    """
    Phase 2b (--direct-fetch): For seed kits that have a gw_product_code but no prices yet,
    try fetching their GW product page directly using the kit's own slug with year suffixes.

    GW product URLs follow the pattern: {kit-slug}-{YYYY} (e.g. space-marine-razorback-2020).
    We try the kit_slug with years 2019–2026 and no suffix, verify the returned pimKey matches
    the expected product code, then add the slug to the catalog and fetch all locale prices.

    This reaches kits that aren't listed on the category pages we crawled (older kits, limited
    releases, etc.) without needing to visit every category page.
    """
    print("\n=== Phase 2b: Direct slug fetch for unmatched product-coded kits ===")

    # Build set of already-priced seed slugs
    priced_slugs = {k.split(".")[0] for k, v in prices_cache.items() if v.get("price") is not None}

    # Also consider kits that are matched in the catalog (even if en-GB price is cached via catalog)
    catalog_matched_codes: set[str] = set()
    for data in catalog["slugs"].values():
        code = data.get("product_code")
        if code and code in kits_by_code_map:
            catalog_matched_codes.add(code)

    unpriced_kits = [
        k for k in kits
        if k["gw_product_code"]
        and k["seed_slug"] not in priced_slugs
        and k["gw_product_code"] not in catalog_matched_codes
    ]

    if args.limit:
        unpriced_kits = unpriced_kits[:args.limit]

    if not unpriced_kits:
        print("  All product-coded kits already priced.")
        return

    print(f"  {len(unpriced_kits)} kits with product codes but no prices")

    # Year suffixes to try, newest first (most likely to still be the current listing)
    YEAR_SUFFIXES = ["", "-2025", "-2026", "-2024", "-2023", "-2022", "-2021", "-2020", "-2019"]
    LOCALES_FOR_PRICES = LOCALES  # fetch all locales once matched

    from playwright.sync_api import sync_playwright
    DIRECT_BATCH = 80  # Large batch — API calls are fast

    # We process kits in batches (one browser session per batch)
    # Within each session: for each kit try slug variants until pimKey matches,
    # then fetch all locale prices immediately while session is warm.
    kit_batches = [unpriced_kits[i:i+DIRECT_BATCH] for i in range(0, len(unpriced_kits), DIRECT_BATCH)]

    total_found = 0
    total_kits = len(unpriced_kits)

    for batch_idx, batch in enumerate(kit_batches):
        with sync_playwright() as pw:
            browser, ctx = make_browser_context(pw, headed=True)
            page = ctx.new_page()
            build_id = warm_up_browser(page)

            if not build_id:
                print("  ERROR: could not get buildId — skipping batch")
                browser.close()
                continue

            for kit_offset, kit in enumerate(batch):
                overall_i = batch_idx * DIRECT_BATCH + kit_offset + 1
                seed_slug = kit["seed_slug"]
                expected_code = kit["gw_product_code"]
                # GW URL slug: kit_slug uses hyphens already
                base_slug = kit["kit_slug"]  # e.g. "space-marine-razorback"

                print(f"  [{overall_i}/{total_kits}] {seed_slug} (code: {expected_code})")

                # Faction prefixes GW often drops from URL slugs (e.g. "necron-" from kit_slug)
                _URL_PREFIXES = [
                    "necron-", "necrons-", "space-marine-", "space-marines-", "aeldari-",
                    "craftworlds-", "orks-", "tyranids-", "tau-empire-", "t-au-empire-",
                    "chaos-space-marines-", "drukhari-", "dark-eldar-", "adeptus-mechanicus-",
                    "thousand-sons-", "death-guard-", "world-eaters-", "emperors-children-",
                    "chaos-daemons-", "genestealer-cults-", "adepta-sororitas-", "sisters-of-battle-",
                    "adeptus-custodes-", "astra-militarum-", "imperial-guard-",
                    "leagues-of-votann-", "blood-angels-", "dark-angels-", "space-wolves-",
                    "deathwatch-", "grey-knights-", "black-templars-", "ultramarines-",
                    "salamanders-", "iron-hands-", "white-scars-", "raven-guard-", "imperial-fists-",
                ]

                def slug_candidates(base: str) -> list[str]:
                    """
                    Generate slug variants to try: base + stripped prefixes,
                    each in lowercase and TitleCase, × year suffixes.
                    """
                    bases = [base]
                    for prefix in _URL_PREFIXES:
                        if base.startswith(prefix):
                            bases.append(base[len(prefix):])
                    seen: set[str] = set()
                    out: list[str] = []
                    for b in bases:
                        title = "-".join(w.capitalize() for w in b.split("-"))
                        for suffix in YEAR_SUFFIXES:
                            for variant in (b + suffix, title + suffix):
                                if variant not in seen:
                                    seen.add(variant)
                                    out.append(variant)
                    return out

                def names_match(kit_name: str, product_name: str) -> bool:
                    """Fuzzy name check: normalize both and require significant overlap."""
                    def norm(s: str) -> set[str]:
                        return set(re.sub(r"[^a-z0-9 ]", "", s.lower()).split()) - {
                            "the", "of", "and", "a", "an", "warhammer", "40000", "40k",
                            "miniature", "miniatures", "plastic", "resin", "set", "squad",
                        }
                    kit_words = norm(kit_name)
                    prod_words = norm(product_name)
                    if not kit_words or not prod_words:
                        return False
                    overlap = len(kit_words & prod_words)
                    return overlap >= max(1, min(len(kit_words), len(prod_words)) - 1)

                matched_slug: str | None = None
                for candidate in slug_candidates(base_slug):
                    result = fetch_product_data_via_api(page, candidate, "en-GB", build_id,
                                                        delay_range=(0.3, 0.8))
                    if not result:
                        continue

                    comp = result.get("composition")
                    pim = comp.get("pim_key") if comp else None
                    all_codes = result.get("all_codes", [])

                    # Accept if: product code matches (confident) OR product name is a strong match
                    code_match = (pim == expected_code or expected_code in all_codes)
                    product_name = (comp or {}).get("product_name") or ""
                    name_ok = bool(product_name) and names_match(kit["kit_name"], product_name)
                    if code_match or name_ok:
                        matched_slug = candidate
                        match_basis = "code" if code_match else f"name '{product_name}'"
                        print(f"    ✓ matched via slug '{candidate}' ({match_basis})")
                        # Store the live pimKey in catalog (may differ from stale seed code)
                        live_code = pim or expected_code
                        if candidate not in catalog["slugs"]:
                            catalog["slugs"][candidate] = {}
                        catalog["slugs"][candidate]["product_code"] = live_code
                        if result.get("price") is not None:
                            catalog["slugs"][candidate].setdefault("prices", {})["en-GB"] = {
                                "price": result["price"],
                                "currency": result["currency"],
                                "fetched_at": result["fetched_at"],
                            }
                        if comp:
                            catalog["slugs"][candidate]["composition"] = comp
                        save_slug_catalog(catalog)

                        # Store en-GB price
                        key_gb = prices_key(seed_slug, "en-GB")
                        if key_gb not in prices_cache and result.get("price") is not None:
                            prices_cache[key_gb] = {
                                "price": result["price"],
                                "currency": result["currency"],
                                "locale": "en-GB",
                                "gw_slug": candidate,
                                "gw_product_code": expected_code,
                                "source": "gw_direct",
                                "fetched_at": result["fetched_at"],
                            }
                            save_prices_cache(prices_cache)

                        # Store composition
                        if comp and seed_slug not in composition_cache:
                            composition_cache[seed_slug] = {
                                "gw_slug": candidate,
                                "gw_product_code": expected_code,
                                "fetched_at": result.get("fetched_at", ""),
                                **comp,
                            }
                            save_composition_cache(composition_cache)

                        break

                if not matched_slug:
                    print(f"    ✗ no slug match for code {expected_code}")
                    continue

                total_found += 1

                # Fetch remaining locales
                for locale in LOCALES:
                    if locale == "en-GB":
                        continue
                    key = prices_key(seed_slug, locale)
                    if key in prices_cache:
                        continue
                    result = fetch_product_data_via_api(page, matched_slug, locale, build_id,
                                                        delay_range=(0.3, 0.8))
                    if result and result.get("price") is not None:
                        prices_cache[key] = {
                            "price": result["price"],
                            "currency": result["currency"],
                            "locale": locale,
                            "gw_slug": matched_slug,
                            "gw_product_code": expected_code,
                            "source": "gw_direct",
                            "fetched_at": result["fetched_at"],
                        }
                        print(f"    {locale}: {result['price']} {result['currency']}")
                    else:
                        prices_cache[key] = {
                            "price": None,
                            "locale": locale,
                            "gw_slug": matched_slug,
                            "source": "gw_direct_failed",
                            "fetched_at": datetime.now(timezone.utc).isoformat(),
                        }
                    save_prices_cache(prices_cache)

            browser.close()
        time.sleep(random.uniform(3.0, 6.0))

    print(f"\n  Done. Found slugs for {total_found}/{total_kits} kits.")


def phase_composition_scrape(
    args,
    catalog: dict,
    composition_cache: dict,
) -> None:
    """
    Phase 5 (--composition-scrape): Fill in composition data for kits that don't
    yet have a structured '– Nx Unit' breakdown in their long_description.

    Strategy per kit:
      1. Skip if long_description already has '– Nx' lines (already done).
      2. If the kit maps to a definitively single-model unit (all unit_model
         entries have min=max=1), tag it as auto-inferred — no network call needed.
      3. Otherwise, fetch the full GW product page HTML (handles both Next.js and
         legacy pages) and parse it for '– Nx' composition lines.
      4. If found → update the composition cache with the structured data.
      5. If not found → write to gw_composition_review.json for manual review.

    Respects --limit N for testing.
    """
    print("\n=== Phase 5: Composition HTML scrape for unstructured kits ===")

    # Load unit model data for single-model inference
    print("  Loading unit model data...")
    unit_models_map = load_unit_models()
    single_models = single_model_units(unit_models_map)
    all_unit_slugs = set(unit_models_map.keys())
    print(f"  {len(unit_models_map)} units, {len(single_models)} definitively single-model")

    # Build slug → gw_slug lookup from catalog
    seed_slug_to_gw_slug: dict[str, str] = {}
    for gw_slug, entry in catalog["slugs"].items():
        ss = entry.get("seed_slug") if isinstance(entry, dict) else None
        if ss:
            seed_slug_to_gw_slug[ss] = gw_slug

    review = load_composition_review()

    # Identify kits needing work
    pending = []
    auto_inferred = []

    for seed_slug, comp_data in composition_cache.items():
        ld = comp_data.get("long_description") or ""

        # Already has structured data
        if has_structured_nx(ld):
            continue

        # Already in review queue
        if seed_slug in review:
            continue

        # Check if single-model unit can be auto-inferred
        unit_slug = infer_unit_slug(seed_slug, all_unit_slugs)
        if unit_slug and unit_slug in single_models:
            auto_inferred.append((seed_slug, unit_slug))
            continue

        # Needs HTML fetch
        gw_slug = seed_slug_to_gw_slug.get(seed_slug) or comp_data.get("gw_slug")
        pending.append((seed_slug, comp_data, gw_slug, unit_slug))

    print(f"  Already structured: {sum(1 for d in composition_cache.values() if has_structured_nx(d.get('long_description') or ''))}")
    print(f"  Auto-inferred (single-model): {len(auto_inferred)}")
    print(f"  Already in review queue: {sum(1 for s in composition_cache if s in review)}")
    print(f"  Need HTML fetch: {len(pending)}")

    # Write auto-inferred entries to composition cache
    for seed_slug, unit_slug in auto_inferred:
        if "auto_unit_slug" not in composition_cache.get(seed_slug, {}):
            composition_cache[seed_slug]["auto_unit_slug"] = unit_slug
            composition_cache[seed_slug]["auto_model_count"] = 1
            composition_cache[seed_slug]["composition_source"] = "unit_model_inferred"
            print(f"  ✓ auto-inferred: {seed_slug} → {unit_slug} (1 model)")
    save_composition_cache(composition_cache)

    if not pending:
        print("  Nothing to fetch.")
        return

    if args.limit:
        pending = pending[:args.limit]

    print(f"\n  Fetching HTML for {len(pending)} kits (slow — one page at a time)...")

    from playwright.sync_api import sync_playwright
    PAGE_BATCH = 30  # New browser session every N pages

    kit_batches = [pending[i:i+PAGE_BATCH] for i in range(0, len(pending), PAGE_BATCH)]
    found_count = 0
    review_count = 0

    for batch_idx, batch in enumerate(kit_batches):
        print(f"\n  [Batch {batch_idx+1}/{len(kit_batches)}] Starting browser session...")
        with sync_playwright() as pw:
            browser, ctx = make_browser_context(pw, headed=True)
            page = ctx.new_page()

            build_id = warm_up_browser(page)
            if not build_id:
                print("  WARN: Could not get buildId — will fall back to direct page.goto()")

            for i, (seed_slug, comp_data, gw_slug, unit_slug) in enumerate(batch):
                global_i = batch_idx * PAGE_BATCH + i + 1
                print(f"  [{global_i}/{len(pending)}] {seed_slug}")

                html_content: str | None = None
                source_url: str | None = None

                # Try Next.js API first (if we have a slug and buildId)
                if gw_slug and build_id:
                    # Try en-GB API
                    api_url = f"{BASE_URL}/_next/data/{build_id}/en-GB/shop/{gw_slug}.json?slug=shop&slug={gw_slug}"
                    try:
                        result = page.evaluate(f"""
                        async () => {{
                            try {{
                                const resp = await fetch("{api_url}", {{
                                    headers: {{"x-nextjs-data": "1", "accept": "*/*"}}
                                }});
                                if (!resp.ok) return {{_error: resp.status}};
                                return await resp.json();
                            }} catch(e) {{ return {{_error: e.message}}; }}
                        }}
                        """)
                        if result and not result.get("_error"):
                            nd_text = json.dumps({"props": result})
                            comp = extract_composition_from_next_data(nd_text)
                            if comp and comp.get("long_description"):
                                ld = comp["long_description"]
                                if has_structured_nx(ld):
                                    # Great — update the cache and move on
                                    composition_cache[seed_slug].update(comp)
                                    composition_cache[seed_slug]["composition_source"] = "nextjs_api"
                                    save_composition_cache(composition_cache)
                                    items = extract_nx_items_from_html(ld)
                                    print(f"    ✓ via Next.js API — {len(items)} unit line(s)")
                                    found_count += 1
                                    time.sleep(random.uniform(0.5, 1.5))
                                    continue
                                else:
                                    html_content = ld  # use what we got, fall through to HTML parse
                    except Exception as e:
                        print(f"    Next.js API error: {e}")

                # Fetch full HTML page (handles legacy GW pages)
                if gw_slug:
                    # Try en-US (more stable URL pattern for legacy pages)
                    for locale_prefix in ["en-US", "en-GB"]:
                        product_url = f"{BASE_URL}/{locale_prefix}/shop/{gw_slug}"
                        try:
                            raw_html = page.evaluate(f"""
                            async () => {{
                                try {{
                                    const resp = await fetch("{product_url}", {{
                                        headers: {{
                                            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                                            "accept-language": "en-US,en;q=0.9"
                                        }}
                                    }});
                                    if (!resp.ok) return {{_error: resp.status}};
                                    return await resp.text();
                                }} catch(e) {{ return {{_error: e.message}}; }}
                            }}
                            """)
                            if isinstance(raw_html, str) and len(raw_html) > 500:
                                html_content = raw_html
                                source_url = product_url
                                break
                        except Exception:
                            continue

                # Parse HTML for composition — scope to description section only.
                # Never fall back to the full page — doing so picks up Nx patterns
                # from related product tiles, carousels, and other page furniture.
                found_items: list[tuple[int, str]] = []
                if html_content:
                    if source_url:
                        # Full page HTML: must isolate the product description section
                        scoped = extract_product_description_from_html(html_content)
                        if scoped:
                            found_items = extract_nx_items_from_html(scoped)
                        # else: scoped is None → no structured section found → review
                    else:
                        # Already a description fragment (e.g., longDescription from API)
                        found_items = extract_nx_items_from_html(html_content)

                if found_items:
                    # Build structured long_description update
                    lines = "\n".join(f"– {qty}x {name}" for qty, name in found_items)
                    composition_cache[seed_slug]["structured_items"] = [
                        {"qty": qty, "name": name} for qty, name in found_items
                    ]
                    composition_cache[seed_slug]["composition_source"] = "html_parsed"
                    if source_url:
                        composition_cache[seed_slug]["html_source_url"] = source_url
                    save_composition_cache(composition_cache)
                    print(f"    ✓ parsed from HTML — {len(found_items)} item(s): {found_items[:3]}")
                    found_count += 1
                else:
                    # Add to manual review queue
                    review[seed_slug] = {
                        "seed_slug": seed_slug,
                        "gw_slug": gw_slug,
                        "unit_slug_candidate": unit_slug,
                        "product_name": comp_data.get("product_name"),
                        "features": comp_data.get("features", []),
                        "gw_url": f"{BASE_URL}/en-US/shop/{gw_slug}" if gw_slug else None,
                        "status": "needs_review",
                        "notes": None,
                    }
                    save_composition_review(review)
                    print(f"    → added to review queue (no structured data found)")
                    review_count += 1

                time.sleep(random.uniform(1.5, 3.0))

            browser.close()
        time.sleep(random.uniform(3.0, 6.0))

    print(f"\n  Done. Found: {found_count}, Added to review: {review_count}, Auto-inferred: {len(auto_inferred)}")
    print(f"  Review file: {COMPOSITION_REVIEW_FILE}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Sync GW regional kit prices")
    parser.add_argument("--crawl", action="store_true", help="Phase 1: crawl category pages for product slugs")
    parser.add_argument("--name-match", action="store_true", help="Phase 1b: name-match GW slugs to seed kits (no network)")
    parser.add_argument("--map", action="store_true", help="Phase 2: fetch product pages to match via product codes")
    parser.add_argument("--prices", action="store_true", help="Phase 3: fetch locale prices for all matched kits")
    parser.add_argument("--direct-fetch", action="store_true", help="Phase 2b: directly fetch unmatched kits by constructing their GW slug")
    parser.add_argument("--composition-backfill", action="store_true", help="Phase 4: backfill composition data for already-priced kits")
    parser.add_argument("--composition-scrape", action="store_true", help="Phase 5: fetch full HTML for kits missing structured composition; writes review queue")
    parser.add_argument("--all", action="store_true", help="Run all phases")
    parser.add_argument("--limit", type=int, default=None, help="Limit items per phase (for testing)")
    parser.add_argument("--locale", type=str, default=None, help="Only fetch this locale (phase 3)")
    args = parser.parse_args()

    if not any([args.crawl, getattr(args, "name_match", False), args.map, args.prices,
                getattr(args, "direct_fetch", False), getattr(args, "composition_backfill", False),
                getattr(args, "composition_scrape", False), args.all]):
        parser.print_help()
        return

    print("Loading kit data...")
    kits = load_kits()
    by_code = kits_by_code(kits)
    print(f"  {len(kits)} kits, {len(by_code)} with gw_product_code")

    catalog = load_slug_catalog()
    prices_cache = load_prices_cache()
    composition_cache = load_composition_cache()
    print(f"  Slug catalog: {len(catalog['slugs'])} slugs, {len(catalog['crawled_categories'])} categories crawled")
    print(f"  Prices cache: {len(prices_cache)} entries")
    print(f"  Composition cache: {len(composition_cache)} entries")

    if args.all or args.crawl:
        phase_crawl(args, catalog)
        catalog = load_slug_catalog()

    if args.all or getattr(args, "name_match", False):
        phase_name_match(catalog, kits)
        catalog = load_slug_catalog()

    if args.all or args.map:
        phase_map(args, catalog, by_code)
        catalog = load_slug_catalog()

    if args.all or args.prices:
        phase_prices(args, catalog, by_code, prices_cache, composition_cache)

    if args.all or getattr(args, "direct_fetch", False):
        phase_direct_fetch(args, catalog, kits, by_code, prices_cache, composition_cache)
        catalog = load_slug_catalog()

    if args.all or getattr(args, "composition_backfill", False):
        phase_composition_backfill(args, catalog, by_code, composition_cache)

    if getattr(args, "composition_scrape", False):
        composition_cache = load_composition_cache()
        phase_composition_scrape(args, catalog, composition_cache)

    print("\nDone. Run scripts/sync-gw-prices-apply.py to write seed rows.")


if __name__ == "__main__":
    main()
