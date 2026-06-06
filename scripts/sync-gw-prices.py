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
KITS_GLOB = str(REPO_ROOT / "db/seed_config/seed/data/kits/**/*.ts")

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


# ---------------------------------------------------------------------------
# Playwright helpers
# ---------------------------------------------------------------------------

def make_browser_context(pw, headed: bool = False):
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


def warm_up_browser(page) -> None:
    """Navigate to GW homepage to pass WAF challenge."""
    print("  Warming up browser (GW homepage)...")
    page.goto(f"{BASE_URL}/en-GB", wait_until="domcontentloaded", timeout=25000)
    time.sleep(5)


def is_waf_blocked(page) -> bool:
    """Check if the page is showing a WAF challenge instead of real content."""
    title = page.title()
    url = page.url
    return (
        "Human Verification" in title
        or "awswaf" in page.content().lower()[:500]
        or page.content().count("__NEXT_DATA__") == 0 and page.content().count("<a ") < 5
    )


def collect_product_slugs_from_page(page, category_path: str) -> list[str]:
    """
    Navigate to a GW category page and collect all product page slugs.
    Returns slugs (the path segment after /shop/).
    """
    url = f"{BASE_URL}/en-GB/{category_path}"
    resp = page.goto(url, wait_until="domcontentloaded", timeout=30000)
    if resp.status not in (200, 304):
        return []

    time.sleep(8)

    if is_waf_blocked(page):
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

    # Extract href attributes from page source
    content = page.content()
    hrefs = re.findall(r'href="(/en-GB/shop/[^"?#]+)"', content)
    unique_hrefs = list(dict.fromkeys(hrefs))

    # Filter out navigation links, keep product slugs
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


def fetch_product_page(
    page,
    slug: str,
    locale: str = "en-GB",
    delay_range: tuple[float, float] = (2.0, 4.0),
) -> dict | None:
    """
    Navigate to a product page and extract product_code + price.
    Returns dict with fields or None if page fails.
    """
    url = f"{BASE_URL}/{locale}/shop/{slug}"
    try:
        resp = page.goto(url, wait_until="domcontentloaded", timeout=25000)
        if resp.status not in (200, 304):
            return None

        time.sleep(random.uniform(1.5, 3.0))

        nd_text = page.evaluate(
            '() => { const el = document.getElementById("__NEXT_DATA__"); return el ? el.textContent : null; }'
        )
        if not nd_text:
            return None

        currency = extract_locale_currency_from_next_data(nd_text)
        prices = extract_prices_from_next_data(nd_text, currency)
        product_code = extract_product_code_from_next_data(nd_text)

        all_codes = extract_product_codes_from_next_data(nd_text) if nd_text else []

        if not prices:
            return {"product_code": product_code, "all_codes": all_codes, "price": None, "currency": currency, "status": "no_price"}

        main_price, main_currency = prices[0]
        return {
            "product_code": product_code,
            "all_codes": all_codes,
            "price": main_price,
            "currency": main_currency,
            "locale": locale,
            "fetched_at": datetime.now(timezone.utc).isoformat(),
            "status": "ok",
        }

    except Exception as e:
        print(f"    Error fetching {slug} ({locale}): {e}")
        return None
    finally:
        time.sleep(random.uniform(*delay_range))


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

    MAP_BATCH = 6  # Fresh browser context every N slugs to avoid WAF session blocks

    for batch_start in range(0, len(slugs_needing_code), MAP_BATCH):
        batch = slugs_needing_code[batch_start: batch_start + MAP_BATCH]
        with sync_playwright() as pw:
            browser, ctx = make_browser_context(pw, headed=True)
            page = ctx.new_page()
            warm_up_browser(page)

            for i, slug in enumerate(batch):
                overall_i = batch_start + i + 1
                print(f"  [{overall_i}/{len(slugs_needing_code)}] {slug}")
                result = fetch_product_page(page, slug, "en-GB")
                if result:
                    # Primary product code is the first one in the page data
                    # Only check first 3 codes to avoid picking related-product codes
                    nd_text_codes = result.get("all_codes", [result.get("product_code")])
                    first_codes = nd_text_codes[:3]
                    matched_code = next((c for c in first_codes if c and c in kits_by_code_map), None)
                    primary_code = nd_text_codes[0] if nd_text_codes else None
                    catalog["slugs"][slug]["product_code"] = primary_code
                    if result.get("price") is not None:
                        catalog["slugs"][slug].setdefault("prices", {})["en-GB"] = {
                            "price": result["price"],
                            "currency": result["currency"],
                            "fetched_at": result["fetched_at"],
                        }
                    kit = kits_by_code_map.get(matched_code) if matched_code else None
                    print(f"    code={primary_code}, price={result.get('price')} {result.get('currency')}, kit={kit['seed_slug'] if kit else 'NOT MATCHED'}")
                else:
                    print(f"    FAILED")
                    catalog["slugs"][slug]["product_code"] = "FETCH_FAILED"

                save_slug_catalog(catalog)

            browser.close()
        time.sleep(random.uniform(8.0, 15.0))  # Longer pause between browser sessions

    matched = sum(
        1 for s, d in catalog["slugs"].items()
        if d.get("product_code") and d["product_code"] in kits_by_code_map
    )
    print(f"  Done. {matched} slugs matched to seed kits.")


# ---------------------------------------------------------------------------
# Phase 3: Fetch all locales for matched kits
# ---------------------------------------------------------------------------

def phase_prices(args, catalog: dict, kits_by_code_map: dict[str, dict], prices_cache: dict) -> None:
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

    PRICES_BATCH = 8  # Fresh browser every N fetches to avoid WAF blocking

    for batch_start in range(0, len(kits_to_fetch), PRICES_BATCH):
        batch = kits_to_fetch[batch_start: batch_start + PRICES_BATCH]
        with sync_playwright() as pw:
            browser, ctx = make_browser_context(pw, headed=True)
            page = ctx.new_page()
            warm_up_browser(page)

            for i, (seed_slug, gw_slug, locale) in enumerate(batch):
                overall_i = batch_start + i + 1
                key = prices_key(seed_slug, locale)
                code = seed_to_code.get(seed_slug)
                print(f"  [{overall_i}/{len(kits_to_fetch)}] {seed_slug} ({locale})")
                result = fetch_product_page(page, gw_slug, locale)
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
                    print(f"    {result['price']} {result['currency']}")
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
        time.sleep(random.uniform(8.0, 15.0))

    successful = sum(1 for v in prices_cache.values() if v.get("price") is not None)
    print(f"  Done. Cache: {len(prices_cache)} entries, {successful} with prices.")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Sync GW regional kit prices")
    parser.add_argument("--crawl", action="store_true", help="Phase 1: crawl category pages for product slugs")
    parser.add_argument("--name-match", action="store_true", help="Phase 1b: name-match GW slugs to seed kits (no network)")
    parser.add_argument("--map", action="store_true", help="Phase 2: fetch product pages to match via product codes")
    parser.add_argument("--prices", action="store_true", help="Phase 3: fetch locale prices for all matched kits")
    parser.add_argument("--all", action="store_true", help="Run all phases")
    parser.add_argument("--limit", type=int, default=None, help="Limit items per phase (for testing)")
    parser.add_argument("--locale", type=str, default=None, help="Only fetch this locale (phase 3)")
    args = parser.parse_args()

    if not any([args.crawl, getattr(args, "name_match", False), args.map, args.prices, args.all]):
        parser.print_help()
        return

    print("Loading kit data...")
    kits = load_kits()
    by_code = kits_by_code(kits)
    print(f"  {len(kits)} kits, {len(by_code)} with gw_product_code")

    catalog = load_slug_catalog()
    prices_cache = load_prices_cache()
    print(f"  Slug catalog: {len(catalog['slugs'])} slugs, {len(catalog['crawled_categories'])} categories crawled")
    print(f"  Prices cache: {len(prices_cache)} entries")

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
        phase_prices(args, catalog, by_code, prices_cache)

    print("\nDone. Run scripts/sync-gw-prices-apply.py to write seed rows.")


if __name__ == "__main__":
    main()
