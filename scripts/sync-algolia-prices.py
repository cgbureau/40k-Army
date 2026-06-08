#!/usr/bin/env python3
"""
Sync GW kit prices from Algolia — fast, reliable, no browser required.

Games Workshop uses Algolia (app: M5ZIQZNQ2H) for their product search backend,
with per-locale indexes named `prod-lazarus-product-{locale}`.

Workflow:
  Phase 1 (--build-id-map): For each kit with a gw_slug, search Algolia en-US
    to find the matching objectID. Stores in data/prices/algolia_object_ids.json.

  Phase 2 (--fetch-prices): For each locale, batch-query Algolia using objectIDs
    to fetch live prices. Updates data/prices/gw_prices_cache.json.

  Phase 3 (run sync-gw-prices-apply.py): Converts cache to typed seed rows.

Usage:
  python3 scripts/sync-algolia-prices.py --build-id-map
  python3 scripts/sync-algolia-prices.py --fetch-prices
  python3 scripts/sync-algolia-prices.py --build-id-map --fetch-prices  # both
  python3 scripts/sync-algolia-prices.py --status  # show current state

  npm run data:sync-algolia-prices:build-id-map
  npm run data:sync-algolia-prices:fetch-prices
"""
from __future__ import annotations

import json
import re
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

# ─── Paths ────────────────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).resolve().parent.parent
COMPOSITION_CACHE = REPO_ROOT / "data/prices/gw_composition_cache.json"
PRICES_CACHE = REPO_ROOT / "data/prices/gw_prices_cache.json"
ALGOLIA_OBJECT_IDS = REPO_ROOT / "data/prices/algolia_object_ids.json"

# ─── Algolia constants ─────────────────────────────────────────────────────────

ALGOLIA_APP_ID = "M5ZIQZNQ2H"
ALGOLIA_API_KEY = "92c6a8254f9d34362df8e6d96475e5d8"  # Public search-only key from GW website JS

# Locale → Algolia index name, currency, price_market_slug
# These match the `gw_region_selector` + locale from price_markets.data.ts
LOCALE_MARKETS = [
    # locale          algolia_index                        currency  market_slug
    ("en-US", "prod-lazarus-product-en-us", "USD",     "us_en"),
    ("en-GB", "prod-lazarus-product-en-gb", "GBP",     "uk_en"),
    ("en-EU", "prod-lazarus-product-en-eu", "EUR",     "eu_en"),
    ("en-AU", "prod-lazarus-product-en-au", "AUD",     "australia_en"),
    ("en-CA", "prod-lazarus-product-en-ca", "CAD",     "canada_en"),
    ("en-NZ", "prod-lazarus-product-en-nz", "NZD",     "new_zealand_en"),
    ("en-PL", "prod-lazarus-product-en-pl", "PLN",     "poland_pl"),
    ("de-CH", "prod-lazarus-product-de-ch", "CHF",     "switzerland_en"),
    ("en-JP", "prod-lazarus-product-en-jp", "JPY",     "japan_en"),
]

# Primary discovery index (en-US) used to find objectIDs
DISCOVERY_INDEX = "prod-lazarus-product-en-us"

# Batch size for multi-query requests
BATCH_SIZE = 20

# Delay between API calls (be gentle)
CALL_DELAY_S = 0.2

# ─── Algolia API helpers ───────────────────────────────────────────────────────

def _algolia_request(path: str, body: dict | None = None) -> dict:
    """Make a GET or POST request to the Algolia API."""
    url = f"https://{ALGOLIA_APP_ID}-dsn.algolia.net{path}"
    data = json.dumps(body).encode() if body is not None else None
    method = "POST" if data else "GET"
    req = urllib.request.Request(
        url, data=data,
        headers={
            "x-algolia-application-id": ALGOLIA_APP_ID,
            "x-algolia-api-key": ALGOLIA_API_KEY,
            "content-type": "application/json",
        },
        method=method,
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"  HTTP {e.code} on {path}: {e.reason}", file=sys.stderr)
        raise


def algolia_search(index: str, query: str, n: int = 5) -> list[dict]:
    """Text search within an index."""
    result = _algolia_request(
        f"/1/indexes/{index}/query",
        {"query": query, "hitsPerPage": n, "attributesToRetrieve": ["slug", "price", "name", "objectID", "ctPrice"]},
    )
    return result.get("hits", [])


def algolia_multi_query(requests: list[dict]) -> list[dict]:
    """Batch query: list of {indexName, params} → list of results."""
    result = _algolia_request("/1/indexes/*/queries", {"requests": requests})
    return result.get("results", [])


# ─── Slug → name conversion ────────────────────────────────────────────────────

def slug_to_search_query(gw_slug: str) -> str:
    """Convert a GW product slug to a human-readable search query.

    e.g. 'Primaris-Chaplain-on-Bike-2020' → 'Primaris Chaplain on Bike'
         'Tyrannocyte' → 'Tyrannocyte'
    """
    name = re.sub(r"-\d{4}$", "", gw_slug)   # strip trailing year
    name = name.replace("-", " ")
    return name


# ─── Phase 1: Build objectID map ──────────────────────────────────────────────

def load_object_ids() -> dict[str, dict]:
    """Load existing objectID map (seed_slug → {objectID, gw_slug, name, ...})."""
    if ALGOLIA_OBJECT_IDS.exists():
        return json.loads(ALGOLIA_OBJECT_IDS.read_text())
    return {}


def save_object_ids(data: dict) -> None:
    ALGOLIA_OBJECT_IDS.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


def find_best_match(hits: list[dict], expected_slug: str) -> dict | None:
    """Find the best-matching hit for an expected GW slug.

    Priority:
      1. Exact slug match (case-insensitive)
      2. First hit (Algolia's relevance-ranked top result)
    """
    expected_lower = expected_slug.lower()
    for hit in hits:
        if hit.get("slug", "").lower() == expected_lower:
            return hit
    if hits:
        return hits[0]
    return None


def build_id_map(force: bool = False) -> dict[str, dict]:
    """Search Algolia en-US for each kit in the composition cache to find objectIDs."""
    composition = json.loads(COMPOSITION_CACHE.read_text())
    existing = load_object_ids()

    to_resolve = []
    for seed_slug, data in composition.items():
        gw_slug = data.get("gw_slug", "")
        if not gw_slug:
            continue
        if seed_slug in existing and not force:
            continue  # already resolved
        to_resolve.append((seed_slug, gw_slug))

    if not to_resolve:
        print(f"All {len(existing)} kits already resolved. Pass --force to re-run.")
        return existing

    print(f"Resolving {len(to_resolve)} kits in Algolia {DISCOVERY_INDEX}…")
    resolved = 0
    failed = 0

    for i, (seed_slug, gw_slug) in enumerate(to_resolve, 1):
        query = slug_to_search_query(gw_slug)
        try:
            hits = algolia_search(DISCOVERY_INDEX, query, n=5)
            match = find_best_match(hits, gw_slug)
            if match:
                existing[seed_slug] = {
                    "objectID": match["objectID"],
                    "gw_slug": match.get("slug", gw_slug),
                    "name": match.get("name", ""),
                    "usd_price": match.get("price"),
                    "resolved_at": datetime.now(timezone.utc).isoformat(),
                }
                resolved += 1
                status = "✓"
                if match.get("slug", "").lower() != gw_slug.lower():
                    status = "≈"  # fuzzy match
                print(f"  [{i}/{len(to_resolve)}] {status} {seed_slug}")
                print(f"    query: {query!r} → slug={match.get('slug')!r} id={match.get('objectID')}")
            else:
                existing[seed_slug] = {
                    "objectID": None,
                    "gw_slug": gw_slug,
                    "name": None,
                    "usd_price": None,
                    "resolved_at": datetime.now(timezone.utc).isoformat(),
                    "error": "no_hits",
                }
                failed += 1
                print(f"  [{i}/{len(to_resolve)}] ✗ {seed_slug} (no hits for {query!r})")
        except Exception as e:
            print(f"  [{i}/{len(to_resolve)}] ERROR {seed_slug}: {e}")
            failed += 1

        # Save after each successful batch
        if i % 10 == 0:
            save_object_ids(existing)
        time.sleep(CALL_DELAY_S)

    save_object_ids(existing)
    print(f"\nResolved: {resolved}, Failed: {failed}")
    print(f"Object ID map saved to {ALGOLIA_OBJECT_IDS}")
    return existing


# ─── Phase 2: Fetch prices ─────────────────────────────────────────────────────

def load_prices_cache() -> dict[str, dict]:
    if PRICES_CACHE.exists():
        return json.loads(PRICES_CACHE.read_text())
    return {}


def save_prices_cache(data: dict) -> None:
    PRICES_CACHE.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


def fetch_prices_for_locale(
    locale: str,
    index: str,
    currency: str,
    market_slug: str,
    object_id_map: dict[str, dict],
    prices_cache: dict,
) -> int:
    """Fetch prices for all kits from a single Algolia locale index.
    Returns number of prices updated."""
    # Build list of kits that have objectIDs
    kits_with_ids = [
        (seed_slug, entry["objectID"])
        for seed_slug, entry in object_id_map.items()
        if entry.get("objectID")
    ]

    if not kits_with_ids:
        print(f"  {locale}: no objectIDs to fetch")
        return 0

    updated = 0
    now = datetime.now(timezone.utc).isoformat()

    # Process in batches
    for batch_start in range(0, len(kits_with_ids), BATCH_SIZE):
        batch = kits_with_ids[batch_start : batch_start + BATCH_SIZE]

        requests = [
            {
                "indexName": index,
                "params": (
                    f"query=&"
                    f"filters=objectID%3A{obj_id}&"
                    f"hitsPerPage=1&"
                    f"attributesToRetrieve=slug,price,ctPrice,name,isInStock"
                ),
            }
            for _, obj_id in batch
        ]

        try:
            results = algolia_multi_query(requests)
        except Exception as e:
            print(f"  {locale} batch error: {e}", file=sys.stderr)
            time.sleep(1)
            continue

        for (seed_slug, obj_id), result in zip(batch, results):
            hits = result.get("hits", [])
            if not hits:
                continue  # product not available in this locale

            hit = hits[0]
            price = hit.get("price")
            if price is None:
                continue

            cache_key = f"{seed_slug}.{locale}"
            prices_cache[cache_key] = {
                "price": float(price),
                "currency": currency,
                "locale": locale,
                "gw_slug": hit.get("slug", ""),
                "source": "algolia",
                "market_slug": market_slug,
                "is_in_stock": hit.get("isInStock", True),
                "fetched_at": now,
            }
            updated += 1

        time.sleep(CALL_DELAY_S)

    return updated


def fetch_all_prices(locales: list[tuple] | None = None) -> None:
    """Fetch prices for all locales from Algolia."""
    object_id_map = load_object_ids()
    if not object_id_map:
        print("ERROR: No objectID map found. Run --build-id-map first.")
        sys.exit(1)

    resolved_count = sum(1 for v in object_id_map.values() if v.get("objectID"))
    print(f"Loaded objectID map: {resolved_count} kits with IDs")

    prices_cache = load_prices_cache()
    print(f"Loaded prices cache: {len(prices_cache)} existing entries")

    markets = locales or LOCALE_MARKETS
    total_updated = 0

    for locale, index, currency, market_slug in markets:
        print(f"\n  {locale} ({currency}) → {index}…", flush=True)
        n = fetch_prices_for_locale(locale, index, currency, market_slug, object_id_map, prices_cache)
        print(f"    Updated {n} prices")
        total_updated += n

    save_prices_cache(prices_cache)
    print(f"\nTotal updated: {total_updated}")
    print(f"Cache size: {len(prices_cache)} entries")
    print(f"Saved to {PRICES_CACHE}")
    print("\nNext: run python3 scripts/sync-gw-prices-apply.py to generate seed rows")


# ─── Status ───────────────────────────────────────────────────────────────────

def show_status() -> None:
    """Show current state of the objectID map and prices cache."""
    # Object ID map
    if ALGOLIA_OBJECT_IDS.exists():
        oid_map = json.loads(ALGOLIA_OBJECT_IDS.read_text())
        resolved = sum(1 for v in oid_map.values() if v.get("objectID"))
        unresolved = sum(1 for v in oid_map.values() if not v.get("objectID"))
        print(f"objectID map: {resolved} resolved, {unresolved} unresolved (total {len(oid_map)})")
        if unresolved:
            print("  Unresolved kits:")
            for slug, data in oid_map.items():
                if not data.get("objectID"):
                    print(f"    {slug}: gw_slug={data.get('gw_slug')!r} error={data.get('error')}")
    else:
        print("objectID map: not built yet (run --build-id-map)")

    # Prices cache
    if PRICES_CACHE.exists():
        cache = json.loads(PRICES_CACHE.read_text())
        by_locale: dict[str, int] = {}
        by_source: dict[str, int] = {}
        for key, entry in cache.items():
            locale = key.split(".")[-1]
            by_locale[locale] = by_locale.get(locale, 0) + 1
            src = entry.get("source", "unknown")
            by_source[src] = by_source.get(src, 0) + 1
        print(f"\nPrices cache: {len(cache)} entries")
        print("  By locale:")
        for locale, n in sorted(by_locale.items()):
            print(f"    {locale}: {n}")
        print("  By source:")
        for src, n in sorted(by_source.items()):
            print(f"    {src}: {n}")
    else:
        print("Prices cache: not built yet")

    # Composition cache
    if COMPOSITION_CACHE.exists():
        comp = json.loads(COMPOSITION_CACHE.read_text())
        print(f"\nComposition cache: {len(comp)} kits")


# ─── CLI ───────────────────────────────────────────────────────────────────────

def main() -> None:
    args = sys.argv[1:]

    if "--status" in args:
        show_status()
        return

    if not args or args == ["--help"]:
        print(__doc__)
        return

    force = "--force" in args
    do_build = "--build-id-map" in args
    do_fetch = "--fetch-prices" in args

    if do_build:
        print("=== Phase 1: Build objectID map ===")
        build_id_map(force=force)

    if do_fetch:
        print("\n=== Phase 2: Fetch prices from Algolia ===")
        fetch_all_prices()

    if not do_build and not do_fetch:
        print("No action specified. Use --build-id-map, --fetch-prices, or --status.")
        print(__doc__)


if __name__ == "__main__":
    main()
