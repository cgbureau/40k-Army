#!/usr/bin/env python3
"""
Apply GW regional prices from the cache to typed kit_price seed rows.

Reads data/prices/gw_prices_cache.json (built by sync-gw-prices.py) and
generates:
  db/seed_config/seed/data/kit_prices/gw/all.data.ts
  db/seed_config/seed/ids/generated_game_data.ids.ts (updated)

Price ID pattern:  {seed_slug}__gw_{currency}
Price source:      "gw_direct"

Usage:
  python scripts/sync-gw-prices-apply.py [--dry-run]
  npm run data:apply-gw-prices
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
PRICES_CACHE_FILE = REPO_ROOT / "data/prices/gw_prices_cache.json"
GW_OUTPUT_FILE = REPO_ROOT / "db/seed_config/seed/data/kit_prices/gw/all.data.ts"
KIT_PRICES_ROOT_PATH = REPO_ROOT / "db/seed_config/seed/data/kit_prices.data.ts"
GENERATED_IDS_PATH = REPO_ROOT / "db/seed_config/seed/ids/generated_game_data.ids.ts"

CROCKFORD_BASE32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"

LOCALE_TO_MARKET: dict[str, dict[str, str]] = {
    "en-GB": {"price_market_slug": "uk_en",          "currency": "gbp"},
    "en-AU": {"price_market_slug": "australia_en",   "currency": "aud"},
    "en-CA": {"price_market_slug": "canada_en",      "currency": "cad"},
    "en-EU": {"price_market_slug": "eu_en",          "currency": "eur"},
    "de-CH": {"price_market_slug": "switzerland_en", "currency": "chf"},
    "en-PL": {"price_market_slug": "poland_pl",      "currency": "pln"},
    "en-NZ": {"price_market_slug": "new_zealand_en", "currency": "nzd"},
    "en-JP": {"price_market_slug": "japan_en",       "currency": "jpy"},
    "en-US": {"price_market_slug": "us_en",          "currency": "usd"},
}


# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------

def deterministic_ulid(namespace: str, seed: str) -> str:
    digest = hashlib.sha256(f"{namespace}:{seed}".encode("utf-8")).digest()
    value = int.from_bytes(digest, "big")
    chars: list[str] = []
    for _ in range(23):
        chars.append(CROCKFORD_BASE32[value & 31])
        value >>= 5
    return "01K" + "".join(reversed(chars))


def to_pascal_case(slug: str) -> str:
    """Convert seed_slug to PascalCase for TypeScript const name."""
    return "".join(part.capitalize() for part in slug.replace("-", "_").split("_"))


def read_existing_record_values(text: str, const_name: str) -> dict[str, str]:
    pattern = re.compile(
        rf"const {const_name}: Record<[\s\S]*?>\s*=\s*\{{(?P<body>.*?)\n\}};",
        flags=re.DOTALL,
    )
    match = pattern.search(text)
    if not match:
        return {}
    values: dict[str, str] = {}
    for entry in re.finditer(r'"([^"]+)":\s*"([^"]+)"', match.group("body")):
        values[entry.group(1)] = entry.group(2)
    return values


def rewrite_kit_price_id_section(
    text: str,
    all_slugs: list[str],
    namespace: str = "kit_price_id",
) -> str:
    """
    Update both the KitPriceSeedSlug union type and kitPriceSeedIds Record
    in the generated IDs file, preserving existing ULID values.
    This mirrors the pattern used by sync-legacy-prices.py.
    """
    type_name = "KitPriceSeedSlug"
    const_name = "kitPriceSeedIds"

    existing = read_existing_record_values(text, const_name)

    # Build full mapping: preserve existing ULIDs, generate new ones
    mapping = {
        slug: existing.get(slug) or deterministic_ulid(namespace, slug)
        for slug in all_slugs
    }

    # Rewrite type union
    type_pattern = re.compile(rf"type {type_name} =(?P<body>.*?);", flags=re.DOTALL)
    type_match = type_pattern.search(text)
    if not type_match:
        raise ValueError(f"Missing {type_name} type in generated IDs file")

    type_replacement = (
        f"type {type_name} =\n"
        + "\n".join(f'  | "{slug}"' for slug in all_slugs)
        + ";"
    )
    text = text[: type_match.start()] + type_replacement + text[type_match.end():]

    # Rewrite Record const
    record_pattern = re.compile(
        rf"const {const_name}: Record<[\s\S]*?>\s*=\s*\{{.*?\n\}};",
        flags=re.DOTALL,
    )
    record_match = record_pattern.search(text)
    if not record_match:
        raise ValueError(f"Missing {const_name} const in generated IDs file")

    record_lines = "\n".join(f'  "{slug}": "{mapping[slug]}",' for slug in all_slugs)
    record_replacement = (
        f"const {const_name}: Record<{type_name}, string> = {{\n"
        + record_lines
        + "\n};"
    )
    text = text[: record_match.start()] + record_replacement + text[record_match.end():]

    # Remove any stale standalone kitPriceId Record that may have been appended
    stale_pattern = re.compile(
        r"\n\nconst kitPriceId: Record<string, string> = \{.*?\n\};\n?",
        flags=re.DOTALL,
    )
    text = stale_pattern.sub("", text)

    return text


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Apply GW prices cache to seed rows")
    parser.add_argument("--dry-run", action="store_true", help="Print stats without writing files")
    args = parser.parse_args()

    if not PRICES_CACHE_FILE.exists():
        print(f"Error: {PRICES_CACHE_FILE} not found. Run sync-gw-prices.py first.")
        sys.exit(1)

    cache = json.loads(PRICES_CACHE_FILE.read_text())
    print(f"Cache entries: {len(cache)}")

    # Filter to entries with actual prices
    valid_entries = {
        key: val for key, val in cache.items()
        if val.get("price") is not None and val.get("locale") in LOCALE_TO_MARKET
    }

    # Build en-GB reference prices for sanity checking
    gbp_by_seed: dict[str, float] = {}
    for key, val in valid_entries.items():
        seed_slug, locale = key.rsplit(".", 1)
        if locale == "en-GB" and val.get("price"):
            gbp_by_seed[seed_slug] = val["price"]

    # Drop entries where price is anomalously low vs GBP (< 40% ratio for non-JPY)
    # This catches cases where GW returns a related/cheaper product's price
    dropped = 0
    filtered_entries = {}
    for key, val in valid_entries.items():
        seed_slug, locale = key.rsplit(".", 1)
        currency = LOCALE_TO_MARKET[locale]["currency"]
        gbp = gbp_by_seed.get(seed_slug)
        price = val["price"]
        if gbp and currency not in ("jpy",):
            ratio = price / gbp
            if ratio < 0.4:
                print(f"  Dropping anomalous {locale} price for {seed_slug}: {price} {currency.upper()} vs £{gbp} (ratio {ratio:.2f})")
                dropped += 1
                continue
        filtered_entries[key] = val

    if dropped:
        print(f"  Dropped {dropped} anomalous entries.")
    valid_entries = filtered_entries

    print(f"Valid price entries: {len(valid_entries)}")

    # Build TypeScript rows
    rows: list[dict] = []
    for key, val in sorted(valid_entries.items()):
        seed_slug, locale = key.rsplit(".", 1)
        market = LOCALE_TO_MARKET[locale]
        price_market_slug = market["price_market_slug"]
        currency = market["currency"]
        id_slug = f"{seed_slug}__gw_{currency}"
        price_str = f"{val['price']:.2f}"

        rows.append({
            "id_slug": id_slug,
            "seed_slug": seed_slug,
            "price_market_slug": price_market_slug,
            "currency": currency,
            "price": price_str,
            "const_name": f"{to_pascal_case(seed_slug)}Gw{currency.capitalize()}KitPrice",
            "gw_slug": val.get("gw_slug", ""),
            "fetched_at": val.get("fetched_at", ""),
        })

    print(f"Kit price rows to generate: {len(rows)}")
    by_seed = {}
    for r in rows:
        by_seed.setdefault(r["seed_slug"], []).append(r["currency"])
    print(f"Unique seed kits with GW prices: {len(by_seed)}")

    if args.dry_run:
        print("\nDry run — no files written.")
        print("\nSample rows:")
        for r in rows[:5]:
            print(f"  {r['id_slug']}: {r['price']} {r['currency'].upper()}")
        return

    # Generate TypeScript output file
    ts_rows = []
    for r in rows:
        ts_rows.append(f"""
export const {r["const_name"]}: KitPriceConfig = {{
  id: kitPriceId("{r["id_slug"]}"),
  kit_id: kitId("{r["seed_slug"]}"),
  price_market_id: priceMarketId("{r["price_market_slug"]}"),
  currency: "{r["currency"]}",
  price: "{r["price"]}",
  price_source: "gw_direct",
  price_source_url: null,
  observed_date: null,
  superseded_date: null,
}};""")

    dataset_const_items = "\n".join(
        f"    {r['const_name']}," for r in rows
    )

    ts_content = f"""import type {{
  KitPriceConfig,
  SeedDataset,
}} from "../../../../types/_index.types";
import {{ kitId, kitPriceId, priceMarketId }} from "../../../ids";

/**
 * Regional kit price rows sourced directly from GW product pages.
 * Generated by scripts/sync-gw-prices-apply.py.
 */
{"".join(ts_rows)}

export const gwImportedKitPricesDataset: SeedDataset<"kit_prices"> = {{
  table: "kit_prices",
  records: [
{dataset_const_items}
  ],
}};
"""

    GW_OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    GW_OUTPUT_FILE.write_text(ts_content)
    print(f"\nWrote {len(rows)} rows to {GW_OUTPUT_FILE.relative_to(REPO_ROOT)}")

    # Update kit_prices.data.ts to include GW dataset
    kit_prices_text = KIT_PRICES_ROOT_PATH.read_text()
    if "gwImportedKitPricesDataset" not in kit_prices_text:
        # Add import
        old_import = 'import { legacyImportedKitPricesDataset } from "./kit_prices/legacy/all.data";'
        new_import = (
            'import { legacyImportedKitPricesDataset } from "./kit_prices/legacy/all.data";\n'
            'import { gwImportedKitPricesDataset } from "./kit_prices/gw/all.data";'
        )
        kit_prices_text = kit_prices_text.replace(old_import, new_import)

        # Add to records array
        old_records = "...legacyImportedKitPricesDataset.records,"
        new_records = (
            "...legacyImportedKitPricesDataset.records,\n"
            "    ...gwImportedKitPricesDataset.records,"
        )
        kit_prices_text = kit_prices_text.replace(old_records, new_records)
        KIT_PRICES_ROOT_PATH.write_text(kit_prices_text)
        print(f"Updated {KIT_PRICES_ROOT_PATH.relative_to(REPO_ROOT)}")

    # Update generated IDs — merge existing slugs (tcgcsv + legacy) with new GW slugs
    ids_text = GENERATED_IDS_PATH.read_text()
    existing_slugs = read_existing_record_values(ids_text, "kitPriceSeedIds")
    new_gw_slugs = {r["id_slug"] for r in rows}
    added = len(new_gw_slugs - set(existing_slugs))

    # All slugs = existing (tcgcsv + legacy) + new GW slugs, sorted
    all_slugs = sorted(set(existing_slugs) | new_gw_slugs)

    ids_text = rewrite_kit_price_id_section(ids_text, all_slugs)
    GENERATED_IDS_PATH.write_text(ids_text)
    print(f"Added {added} new kitPriceId slugs to generated_game_data.ids.ts")
    print(f"\nTotal kit_price IDs: {len(all_slugs)}")

    print("\nNext: run `npx tsc --noEmit && npm run db:validate` to verify.")


if __name__ == "__main__":
    main()
