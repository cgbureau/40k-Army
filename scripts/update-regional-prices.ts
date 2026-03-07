#!/usr/bin/env node
/**
 * Regional price scraper for Games Workshop storefronts.
 * Fetches GBP (UK), USD (US), EUR (EU) from GW product pages.
 * Output: data/units.json with prices object per unit.
 * Failures: data/scrape_errors.log
 *
 * Usage: npm run update:regional-prices
 */

import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const ARMY_FILE = path.join(DATA_DIR, "army-data-no-legends.json");
const UNITS_OUTPUT = path.join(DATA_DIR, "units.json");
const SCRAPE_ERRORS_LOG = path.join(DATA_DIR, "scrape_errors.log");

const REGIONS = [
  { code: "GBP" as const, base: "https://www.games-workshop.com/en-GB/" },
  { code: "USD" as const, base: "https://www.games-workshop.com/en-US/" },
  { code: "EUR" as const, base: "https://www.games-workshop.com/en-EU/" },
] as const;

const DELAY_MS_MIN = 500;
const DELAY_MS_MAX = 1000;

type ArmyData = {
  factions: Record<
    string,
    { name: string; units: Array<{ id: string; name: string; points: number; models_per_box?: number | null; box_price?: number | null }> }
  >;
};

type KitMappings = Record<string, string>;

type RegionalPrices = { GBP?: number; USD?: number; EUR?: number };

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function randomDelay(): Promise<void> {
  const ms = DELAY_MS_MIN + Math.random() * (DELAY_MS_MAX - DELAY_MS_MIN);
  return delay(ms);
}

async function fetchWithTimeout(url: string, timeout = 15000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; GW-Price-Scraper/1.0)" },
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

/** Derive GW product path from faction key and kit slug. */
function getGwProductPath(factionKey: string, kitSlug: string): string {
  const factionSlug = factionKey.replace(/_/g, "-");
  const k = kitSlug.trim();
  if (k.startsWith(factionSlug + "-") || k.startsWith(factionSlug.replace(/s$/, "") + "-")) {
    return k;
  }
  return `${factionSlug}-${k}`;
}

/** Extract numeric price from GW product page HTML (JSON-LD, then __NEXT_DATA__ / regex fallback). */
function parsePriceFromHtml(html: string, regionCode: string): number | null {
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonLdMatch) {
    try {
      const data = JSON.parse(jsonLdMatch[1]);
      const price = data?.offers?.price ?? data?.offers?.[0]?.price;
      const numericPrice = typeof price === "number" ? price : parseFloat(String(price ?? ""));
      if (Number.isFinite(numericPrice) && numericPrice > 0) {
        return Math.round(numericPrice * 100) / 100;
      }
    } catch {
      // fall through to __NEXT_DATA__ and regex
    }
  }

  const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (nextDataMatch) {
    try {
      const data = JSON.parse(nextDataMatch[1]);
      const price = findPriceInObject(data, regionCode);
      if (price != null && price > 0) return price;
      const fromProps = getPriceFromNextProps(data);
      if (fromProps != null && fromProps > 0) return fromProps;
    } catch {
      // fall through to regex
    }
  }

  const symbols: Record<string, string> = { GBP: "£", USD: "\\$", EUR: "€" };
  const sym = symbols[regionCode] ?? "£";
  const regex = new RegExp(`${sym}\\s*([\\d,.]+)|(?:price|value)[^\\d]*([\\d,.]+)`, "i");
  const m = html.match(regex);
  if (m) {
    const raw = (m[1] || m[2] || "").replace(/,/g, "");
    const n = parseFloat(raw);
    if (Number.isFinite(n) && n > 0) return Math.round(n * 100) / 100;
  }
  return null;
}

function getPriceFromNextProps(obj: unknown): number | null {
  const o = obj as Record<string, unknown> | null;
  if (!o || typeof o !== "object") return null;
  const props = o.props as Record<string, unknown> | undefined;
  const pageProps = props?.pageProps as Record<string, unknown> | undefined;
  const product = pageProps?.product ?? pageProps?.data ?? pageProps;
  if (product && typeof product === "object") {
    const p = product as Record<string, unknown>;
    if (typeof p.price === "number" && p.price > 0) return p.price;
    if (typeof p.sellingPrice === "number" && p.sellingPrice > 0) return p.sellingPrice;
    const priceObj = p.price as Record<string, unknown> | undefined;
    if (priceObj && typeof priceObj.value === "number") return priceObj.value as number;
  }
  return findPriceInObject(o, "");
}

function findPriceInObject(obj: unknown, regionCode: string): number | null {
  if (obj === null || typeof obj !== "object") return null;
  const o = obj as Record<string, unknown>;
  if (typeof o.price === "number" && o.price > 0) return o.price;
  if (typeof o.value === "number" && o.value > 0) return o.value;
  if (o.currency === regionCode && typeof o.amount === "number") return o.amount;
  for (const v of Object.values(o)) {
    const found = findPriceInObject(v, regionCode);
    if (found != null) return found;
  }
  return null;
}

async function fetchProductPrice(url: string, regionCode: string): Promise<number | null> {
  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) return null;
    const html = await res.text();
    return parsePriceFromHtml(html, regionCode);
  } catch {
    console.warn(`Failed fetch: ${url}`);
    return null;
  }
}

function loadArmyData(): ArmyData {
  const raw = fs.readFileSync(ARMY_FILE, "utf8");
  return JSON.parse(raw);
}

function loadKitMappings(factionSlug: string): KitMappings {
  const file = path.join(DATA_DIR, "kit-mappings", `${factionSlug}.json`);
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

function appendError(logPath: string, message: string): void {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logPath, line, "utf8");
}

async function main(): Promise<void> {
  console.log("Regional price scraper — loading dataset...\n");

  const armyData = loadArmyData();
  const factionKeys = Object.keys(armyData.factions || {}).sort();

  const errors: string[] = [];
  const priceCache = new Map<string, RegionalPrices>();

  const uniqueProducts: Array<{ factionKey: string; kitSlug: string; gwPath: string }> = [];
  for (const factionKey of factionKeys) {
    const slug = factionKey.replace(/_/g, "-");
    const mappings = loadKitMappings(slug);
    const seen = new Set<string>();
    for (const kitSlug of Object.values(mappings)) {
      const key = `${factionKey}:${kitSlug}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const gwPath = getGwProductPath(factionKey, kitSlug);
      uniqueProducts.push({ factionKey, kitSlug, gwPath });
    }
  }

  console.log(`Unique products to fetch: ${uniqueProducts.length}\n`);

  for (const { factionKey, kitSlug, gwPath } of uniqueProducts) {
    const cacheKey = `${factionKey}:${kitSlug}`;
    const prices: RegionalPrices = {};

    for (const region of REGIONS) {
      const url = `${region.base}${gwPath}`;
      await randomDelay();
      console.log(`Fetching ${region.code}: ${url}`);
      const value = await fetchProductPrice(url, region.code);
      if (value != null && value > 0) {
        prices[region.code] = value;
      } else {
        const msg = `No valid ${region.code} price: ${url} (${factionKey} / ${kitSlug})`;
        errors.push(msg);
        appendError(SCRAPE_ERRORS_LOG, msg);
      }
    }

    priceCache.set(cacheKey, prices);
  }

  const unitsOut: Array<{
    factionKey: string;
    factionName: string;
    id: string;
    name: string;
    points: number;
    models_per_box: number | null;
    box_price: number | null;
    prices: RegionalPrices;
  }> = [];

  for (const factionKey of factionKeys) {
    const faction = armyData.factions[factionKey];
    if (!faction || !Array.isArray(faction.units)) continue;

    const slug = factionKey.replace(/_/g, "-");
    const mappings = loadKitMappings(slug);

    for (const unit of faction.units) {
      const kitSlug = mappings[unit.id];
      const cacheKey = kitSlug ? `${factionKey}:${kitSlug}` : null;
      const prices: RegionalPrices = cacheKey ? priceCache.get(cacheKey) || {} : {};

      unitsOut.push({
        factionKey,
        factionName: faction.name || factionKey,
        id: unit.id,
        name: unit.name,
        points: unit.points,
        models_per_box: unit.models_per_box ?? null,
        box_price: unit.box_price ?? null,
        prices,
      });
    }
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(UNITS_OUTPUT, JSON.stringify({ units: unitsOut }, null, 2), "utf8");
  console.log(`Wrote ${UNITS_OUTPUT}\n`);

  const withGbp = unitsOut.filter((u) => u.prices.GBP != null && u.prices.GBP > 0).length;
  const withUsd = unitsOut.filter((u) => u.prices.USD != null && u.prices.USD > 0).length;
  const withEur = unitsOut.filter((u) => u.prices.EUR != null && u.prices.EUR > 0).length;

  console.log("--- Summary ---");
  console.log(`Units processed: ${unitsOut.length}`);
  console.log(`GBP prices:      ${withGbp}`);
  console.log(`USD prices:      ${withUsd}`);
  console.log(`EUR prices:      ${withEur}`);
  console.log(`Failures:        ${errors.length}`);
  if (errors.length > 0) {
    console.log(`\nErrors logged to: ${SCRAPE_ERRORS_LOG}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
