#!/usr/bin/env node
/**
 * Fetch regional kit prices (GBP, USD, EUR) from Games Workshop storefronts.
 * Loads data/retail-kit-data.json, migrates price -> prices.GBP, fetches USD/EUR,
 * then overwrites retail-kit-data.json with full prices.
 *
 * Usage: npm run update:kit-prices
 */

import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const RETAIL_FILE = path.join(DATA_DIR, "retail-kit-data.json");

const REGIONS = [
  { code: "GBP" as const, base: "https://www.games-workshop.com/en-GB/" },
  { code: "USD" as const, base: "https://www.games-workshop.com/en-US/" },
  { code: "EUR" as const, base: "https://www.games-workshop.com/en-EU/" },
] as const;

const DELAY_MS_MIN = 500;
const DELAY_MS_MAX = 700;
const FETCH_TIMEOUT_MS = 15000;

type Prices = { GBP: number | null; USD: number | null; EUR: number | null };
type KitEntry = { models: number; price?: number; prices?: Prices };
type FactionEntry = { mappings: Record<string, string>; kits: Record<string, KitEntry> };
type RetailData = Record<string, FactionEntry>;

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function randomDelay(): Promise<void> {
  const ms = DELAY_MS_MIN + Math.random() * (DELAY_MS_MAX - DELAY_MS_MIN);
  return delay(ms);
}

async function fetchWithTimeout(url: string, timeout = FETCH_TIMEOUT_MS): Promise<Response> {
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

/** Search __NEXT_DATA__ recursively for product.price, sellingPrice, or price.value. */
function findPriceInNextData(obj: unknown): number | null {
  if (obj === null || typeof obj !== "object") return null;
  const o = obj as Record<string, unknown>;
  if (typeof o.price === "number" && o.price > 0) return o.price;
  if (typeof o.sellingPrice === "number" && o.sellingPrice > 0) return o.sellingPrice;
  const priceObj = o.price as Record<string, unknown> | undefined;
  if (priceObj && typeof priceObj === "object" && typeof priceObj.value === "number" && priceObj.value > 0) {
    return priceObj.value as number;
  }
  for (const v of Object.values(o)) {
    const found = findPriceInNextData(v);
    if (found != null) return found;
  }
  return null;
}

function parsePriceFromHtml(html: string): number | null {
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) return null;
  try {
    const nextData = JSON.parse(match[1]);
    const price = findPriceInNextData(nextData);
    if (price != null && price > 0) return Math.round(price * 100) / 100;
  } catch {
    // ignore
  }
  return null;
}

async function fetchPriceForRegion(slug: string, regionCode: "GBP" | "USD" | "EUR"): Promise<number | null> {
  const base = REGIONS.find((r) => r.code === regionCode)!.base;
  const url = `${base}${slug}`;
  console.log(`Fetching ${regionCode}: ${url}`);
  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) return null;
    const html = await res.text();
    return parsePriceFromHtml(html);
  } catch {
    console.warn(`Failed fetch: ${url}`);
    return null;
  }
}

/** Migrate kit entry: { models, price } -> { models, prices: { GBP, USD: null, EUR: null } }. */
function migrateKitEntry(entry: KitEntry): { models: number; prices: Prices } {
  const models = typeof entry.models === "number" ? entry.models : 1;
  if (entry.prices && typeof entry.prices.GBP === "number") {
    return {
      models,
      prices: {
        GBP: entry.prices.GBP,
        USD: entry.prices.USD ?? null,
        EUR: entry.prices.EUR ?? null,
      },
    };
  }
  const gbp = typeof entry.price === "number" && entry.price > 0 ? entry.price : null;
  return {
    models,
    prices: { GBP: gbp, USD: null, EUR: null },
  };
}

/** Migrate full retail data to prices shape. */
function migrateRetailData(data: RetailData): RetailData {
  const out: RetailData = {};
  for (const [factionKey, faction] of Object.entries(data)) {
    if (!faction || typeof faction !== "object") continue;
    const kits: Record<string, { models: number; prices: Prices }> = {};
    const rawKits = faction.kits ?? {};
    for (const [slug, entry] of Object.entries(rawKits)) {
      kits[slug] = migrateKitEntry(entry);
    }
    out[factionKey] = {
      mappings: faction.mappings ?? {},
      kits,
    };
  }
  return out;
}

async function main(): Promise<void> {
  console.log("Fetch regional kit prices — loading retail-kit-data.json...\n");

  const raw = fs.readFileSync(RETAIL_FILE, "utf8");
  let data: RetailData = JSON.parse(raw);
  data = migrateRetailData(data);

  const uniqueSlugs = new Set<string>();
  for (const faction of Object.values(data)) {
    for (const slug of Object.keys(faction.kits || {})) {
      uniqueSlugs.add(slug);
    }
  }

  const slugPrices = new Map<string, { USD: number | null; EUR: number | null }>();

  for (const slug of uniqueSlugs) {
    await randomDelay();
    const usd = await fetchPriceForRegion(slug, "USD");
    await randomDelay();
    const eur = await fetchPriceForRegion(slug, "EUR");

    slugPrices.set(slug, { USD: usd, EUR: eur });
  }

  for (const faction of Object.values(data)) {
    if (!faction.kits) continue;
    for (const slug of Object.keys(faction.kits)) {
      const cached = slugPrices.get(slug);
      const entry = faction.kits[slug];
      if (cached) {
        entry.prices = {
          GBP: entry.prices?.GBP ?? null,
          USD: cached.USD,
          EUR: cached.EUR,
        };
      }
    }
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(RETAIL_FILE, JSON.stringify(data, null, 2), "utf8");
  console.log(`\nWrote ${RETAIL_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
