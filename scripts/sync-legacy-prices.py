#!/usr/bin/env python3
"""
Sync legacy regional kit price observations into typed kit_price seed rows.

Matches typed kits (from the seed) against legacy price observations
(data/normalized/legacy-kits/price_observations.json) using exact kit_slug
and exact display_name lookups. For each matched kit, generates kit_price
rows for GBP, EUR, AUD, CAD, CHF, and PLN currencies, each tagged with the
correct price_market_id.

Output:
  db/seed_config/seed/data/kit_prices/legacy/all.data.ts
  db/seed_config/seed/ids/generated_game_data.ids.ts  (updated)
  db/seed_config/seed/data/kit_prices.data.ts         (updated)

Usage:
  python scripts/sync-legacy-prices.py
  npm run data:sync-legacy-prices
"""

from __future__ import annotations

import glob
import hashlib
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_ROOT = REPO_ROOT / "db/seed_config/seed/data"
GENERATED_IDS_PATH = REPO_ROOT / "db/seed_config/seed/ids/generated_game_data.ids.ts"
LEGACY_PRICES_OUTPUT = DATA_ROOT / "kit_prices/legacy/all.data.ts"
KIT_PRICES_ROOT_PATH = DATA_ROOT / "kit_prices.data.ts"
LEGACY_PRICE_OBSERVATIONS = REPO_ROOT / "data/normalized/legacy-kits/price_observations.json"
LEGACY_PRODUCTS = REPO_ROOT / "data/normalized/legacy-kits/products.json"

CROCKFORD_BASE32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"

# Maps legacy currency code → (price_market_slug, currency_label)
CURRENCY_TO_MARKET: dict[str, tuple[str, str]] = {
    "gbp": ("uk_en", "gbp"),
    "eur": ("eu_en", "eur"),
    "aud": ("australia_en", "aud"),
    "cad": ("canada_en", "cad"),
    "chf": ("switzerland_en", "chf"),
    "pln": ("poland_pl", "pln"),
}


# ---------------------------------------------------------------------------
# ID utilities (mirrors applyer.py)
# ---------------------------------------------------------------------------

def deterministic_ulid(namespace: str, seed: str) -> str:
    digest = hashlib.sha256(f"{namespace}:{seed}".encode("utf-8")).digest()
    value = int.from_bytes(digest, "big")
    chars: list[str] = []
    for _ in range(23):
        chars.append(CROCKFORD_BASE32[value & 31])
        value >>= 5
    return "01K" + "".join(reversed(chars))


def read_existing_record_values(text: str, const_name: str) -> dict[str, str]:
    pattern = re.compile(
        rf"const {const_name}: Record<[\s\S]*?>\s*=\s*\{{(?P<body>.*?)\n\}};",
        flags=re.DOTALL,
    )
    match = pattern.search(text)
    if not match:
        return {}
    values: dict[str, str] = {}
    for entry in re.finditer(r'["\']?([^"\'\s:]+)["\']?:\s*"([^"]+)"', match.group("body")):
        values[entry.group(1)] = entry.group(2)
    return values


def record_type_name(const_name: str) -> str:
    # Convert kitPriceSeedIds → KitPriceSeedSlug
    base = const_name.removesuffix("Ids")
    return base[0].upper() + base[1:] + "Slug"


def rewrite_id_section(
    *,
    text: str,
    type_name: str,
    const_name: str,
    namespace: str,
    keys: list[str],
) -> str:
    existing_values = read_existing_record_values(text, const_name)
    type_pattern = re.compile(rf"type {type_name} =(?P<body>.*?);", flags=re.DOTALL)
    record_pattern = re.compile(
        rf"const {const_name}: Record<[\s\S]*?>\s*=\s*\{{(?P<body>.*?)\n\}};",
        flags=re.DOTALL,
    )
    type_match = type_pattern.search(text)
    record_match = record_pattern.search(text)

    if not type_match or not record_match:
        raise ValueError(f"Missing {type_name}/{const_name} ID section")

    if keys:
        type_replacement = (
            f"type {type_name} =\n"
            + "\n".join(f'  | "{key}"' for key in keys)
            + ";"
        )
    else:
        type_replacement = f"type {type_name} = never;"

    record_lines = [
        f'  "{key}": "{existing_values.get(key) or deterministic_ulid(namespace, key)}",'
        for key in keys
    ]
    record_replacement = (
        f"const {const_name}: Record<{record_type_name(const_name)}, string> = {{\n"
        + "\n".join(record_lines)
        + ("\n" if record_lines else "")
        + "};"
    )

    text = text[: type_match.start()] + type_replacement + text[type_match.end() :]
    record_match = record_pattern.search(text)
    if not record_match:
        raise ValueError(f"Missing rewritten {const_name} record")
    return text[: record_match.start()] + record_replacement + text[record_match.end() :]


# ---------------------------------------------------------------------------
# TypeScript helpers
# ---------------------------------------------------------------------------

def ts_string(value: str) -> str:
    return json.dumps(value)


def identifier_pascal_case(slug: str) -> str:
    return "".join(part.capitalize() for part in re.split(r"[_\-\s]+", slug))


# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------

def load_typed_kits() -> dict[str, dict]:
    """Return {kit_slug_kebab: {seed_slug, display_name}} from all typed kit data files."""
    result: dict[str, dict] = {}
    pattern = str(REPO_ROOT / "db/seed_config/seed/data/kits/**/*.data.ts")
    for path in glob.glob(pattern, recursive=True):
        content = Path(path).read_text(encoding="utf-8")
        kit_slugs = re.findall(r'kit_slug: "([^"]+)"', content)
        seed_slugs = re.findall(r'kitId\("([^"]+)"\)', content)
        display_names = re.findall(r'display_name: "([^"]+)"', content)
        for i, (ks, ss) in enumerate(zip(kit_slugs, seed_slugs)):
            dn = display_names[i] if i < len(display_names) else ""
            result[ks] = {"seed_slug": ss, "display_name": dn}
    return result


def load_legacy_prices() -> dict[str, dict[str, float]]:
    """Return {kit_slug_kebab: {currency: price}} from price_observations.json."""
    with LEGACY_PRICE_OBSERVATIONS.open(encoding="utf-8") as f:
        observations = json.load(f)
    result: dict[str, dict[str, float]] = {}
    for obs in observations:
        slug = obs["kit_slug"]
        cur = obs["currency"]
        if cur in CURRENCY_TO_MARKET:
            result.setdefault(slug, {})[cur] = obs["price"]
    return result


def load_legacy_display_name_index() -> dict[str, str]:
    """Return {display_name_lower: kit_slug_kebab} from products.json."""
    with LEGACY_PRODUCTS.open(encoding="utf-8") as f:
        products = json.load(f)
    return {
        p["display_name"].lower(): p["kit_slug"]
        for p in products
        if p.get("display_name")
    }


# ---------------------------------------------------------------------------
# Matching
# ---------------------------------------------------------------------------

def match_typed_to_legacy(
    typed: dict[str, dict],
    legacy_prices: dict[str, dict[str, float]],
    legacy_dn_index: dict[str, str],
) -> list[dict]:
    """
    For each typed kit that has legacy price data, return a match record.
    Prefers exact kit_slug match; falls back to exact display_name match.
    """
    matches = []
    for kit_slug, info in typed.items():
        legacy_slug = None
        match_method = None

        if kit_slug in legacy_prices:
            legacy_slug = kit_slug
            match_method = "slug"
        elif info["display_name"]:
            dn_lower = info["display_name"].lower()
            if dn_lower in legacy_dn_index:
                candidate = legacy_dn_index[dn_lower]
                if candidate in legacy_prices:
                    legacy_slug = candidate
                    match_method = "display_name"

        if legacy_slug:
            matches.append({
                "kit_slug": kit_slug,
                "seed_slug": info["seed_slug"],
                "display_name": info["display_name"],
                "legacy_slug": legacy_slug,
                "match_method": match_method,
                "prices": legacy_prices[legacy_slug],
            })

    return sorted(matches, key=lambda m: m["seed_slug"])


# ---------------------------------------------------------------------------
# TypeScript generation
# ---------------------------------------------------------------------------

def render_legacy_prices_file(matches: list[dict]) -> str:
    const_names = []
    const_blocks = []

    for m in matches:
        seed_slug = m["seed_slug"]
        for cur, (market_slug, _) in sorted(CURRENCY_TO_MARKET.items()):
            price_val = m["prices"].get(cur)
            if price_val is None:
                continue
            seed_id_key = f"{seed_slug}__legacy_{cur}"
            const_name = f"{identifier_pascal_case(seed_id_key)}KitPrice"
            const_names.append(const_name)
            price_str = f"{price_val:.2f}" if isinstance(price_val, float) and price_val != int(price_val) else str(int(price_val)) if price_val == int(price_val) else f"{price_val}"
            # Format price with 2 decimal places always
            price_str = f"{float(price_val):.2f}"
            const_blocks.append(
                f"export const {const_name}: KitPriceConfig = {{\n"
                f"  id: kitPriceId({ts_string(seed_id_key)}),\n"
                f"  kit_id: kitId({ts_string(seed_slug)}),\n"
                f"  price_market_id: priceMarketId({ts_string(market_slug)}),\n"
                f"  currency: {ts_string(cur)},\n"
                f"  price: {ts_string(price_str)},\n"
                f"  price_source: \"legacy_data_kits\",\n"
                f"  price_source_url: null,\n"
                f"  observed_date: null,\n"
                f"  superseded_date: null,\n"
                f"}};"
            )

    dataset_records = "\n".join(
        f"    ...{name}," if False else f"    {name},"
        for name in const_names
    )

    lines = [
        "import type {",
        "  KitPriceConfig,",
        "  SeedDataset,",
        '} from "../../../../types/_index.types";',
        'import { kitId, kitPriceId, priceMarketId } from "../../../ids";',
        "",
        "/**",
        " * Regional (non-USD) kit price rows sourced from legacy kit catalog data.",
        " * Generated by scripts/sync-legacy-prices.py.",
        " */",
        "",
        *[block + "\n" for block in const_blocks],
        "",
        "export const legacyImportedKitPricesDataset: SeedDataset<\"kit_prices\"> = {",
        '  table: "kit_prices",',
        "  records: [",
        *[f"    {name}," for name in const_names],
        "  ] satisfies KitPriceConfig[],",
        "};",
        "",
    ]
    return "\n".join(lines)


def collect_seed_id_keys(matches: list[dict]) -> list[str]:
    keys = []
    for m in matches:
        seed_slug = m["seed_slug"]
        for cur in sorted(CURRENCY_TO_MARKET.keys()):
            if cur in m["prices"]:
                keys.append(f"{seed_slug}__legacy_{cur}")
    return keys


# ---------------------------------------------------------------------------
# ID file update
# ---------------------------------------------------------------------------

def update_ids_file(new_legacy_keys: list[str]) -> None:
    text = GENERATED_IDS_PATH.read_text(encoding="utf-8")

    # Collect existing kit_price keys so we don't drop them
    existing = read_existing_record_values(text, "kitPriceSeedIds")
    existing_keys = list(existing.keys())

    # Merge: existing first, then any new keys that aren't already present
    existing_set = set(existing_keys)
    merged_keys = existing_keys + [k for k in new_legacy_keys if k not in existing_set]

    text = rewrite_id_section(
        text=text,
        type_name="KitPriceSeedSlug",
        const_name="kitPriceSeedIds",
        namespace="kit_price",
        keys=merged_keys,
    )
    GENERATED_IDS_PATH.write_text(text, encoding="utf-8")


# ---------------------------------------------------------------------------
# kit_prices.data.ts update
# ---------------------------------------------------------------------------

def update_kit_prices_root(already_has_legacy: bool) -> None:
    text = KIT_PRICES_ROOT_PATH.read_text(encoding="utf-8")
    if 'legacyImportedKitPricesDataset' in text:
        return  # already wired

    # Add import line after existing tcgCsv import
    text = text.replace(
        'import { tcgCsvImportedKitPricesDataset } from "./kit_prices/tcgcsv/_index.data";',
        'import { tcgCsvImportedKitPricesDataset } from "./kit_prices/tcgcsv/_index.data";\n'
        'import { legacyImportedKitPricesDataset } from "./kit_prices/legacy/all.data";',
    )
    # Add spread into records array
    text = text.replace(
        "    ...tcgCsvImportedKitPricesDataset.records,",
        "    ...tcgCsvImportedKitPricesDataset.records,\n    ...legacyImportedKitPricesDataset.records,",
    )
    KIT_PRICES_ROOT_PATH.write_text(text, encoding="utf-8")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    print("Loading typed kits from seed data…")
    typed = load_typed_kits()
    print(f"  Typed kits: {len(typed)}")

    print("Loading legacy price observations…")
    legacy_prices = load_legacy_prices()
    legacy_dn_index = load_legacy_display_name_index()
    print(f"  Legacy kit slugs with non-USD prices: {len(legacy_prices)}")

    print("Matching typed kits to legacy prices…")
    matches = match_typed_to_legacy(typed, legacy_prices, legacy_dn_index)

    slug_matches = sum(1 for m in matches if m["match_method"] == "slug")
    dn_matches = sum(1 for m in matches if m["match_method"] == "display_name")
    total_rows = sum(
        sum(1 for cur in CURRENCY_TO_MARKET if cur in m["prices"])
        for m in matches
    )
    print(f"  Matched: {len(matches)} kits ({slug_matches} by slug, {dn_matches} by display name)")
    print(f"  Price rows to generate: {total_rows}")

    print(f"Writing {LEGACY_PRICES_OUTPUT.relative_to(REPO_ROOT)}…")
    LEGACY_PRICES_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    LEGACY_PRICES_OUTPUT.write_text(
        render_legacy_prices_file(matches), encoding="utf-8"
    )

    print(f"Updating {GENERATED_IDS_PATH.relative_to(REPO_ROOT)}…")
    new_keys = collect_seed_id_keys(matches)
    update_ids_file(new_keys)

    print(f"Updating {KIT_PRICES_ROOT_PATH.relative_to(REPO_ROOT)}…")
    update_kit_prices_root(already_has_legacy=False)

    print(f"\nDone. {total_rows} legacy regional price rows generated across {len(matches)} kits.")
    print("Breakdown by currency:")
    for cur in sorted(CURRENCY_TO_MARKET.keys()):
        market_slug, _ = CURRENCY_TO_MARKET[cur]
        count = sum(1 for m in matches if cur in m["prices"])
        print(f"  {cur} ({market_slug}): {count} rows")


if __name__ == "__main__":
    main()
