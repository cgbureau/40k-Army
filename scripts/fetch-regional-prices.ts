#!/usr/bin/env node
/**
 * Populate USD and EUR for each kit in data/kits/*.json.
 * USD: fetched from gamersguildaz.com search HTML; EUR: GBP × 1.25; GBP unchanged.
 *
 * Usage: npm run update:regional-prices
 */

import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const KITS_DIR = path.join(DATA_DIR, "kits");

const DELAY_MS_MIN = 500;
const DELAY_MS_MAX = 800;
const FETCH_TIMEOUT_MS = 15000;

type KitEntry = {
  models: number;
  prices: { GBP: number | null; USD: number | null; EUR: number | null };
};

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
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Upgrade-Insecure-Requests": "1",
      },
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Fetch Gamers Guild AZ search page for slug and extract USD price.
 * Selects the price closest to expected USD (GBP × 1.25); if no GBP, uses first non-zero price.
 */
async function fetchUsdPrice(slug: string, gbp: number | null): Promise<number | null> {
  const url = `https://gamersguildaz.com/search?q=${encodeURIComponent(slug)}`;
  console.log(`Fetching USD: ${url}`);
  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) return null;
    const html = await res.text();
    const matches = [...html.matchAll(/\$([0-9]+\.[0-9]+)/g)];
    const prices = matches
      .map(m => parseFloat(m[1]))
      .filter(p => p > 0);

    let usd: number | null = null;
    if (prices.length > 0) {
      const expected = gbp != null ? gbp * 1.25 : null;
      if (expected != null) {
        usd = prices.reduce<number | null>((closest, current) => {
          if (closest == null) return current;
          const d1 = Math.abs(current - expected);
          const d2 = Math.abs(closest - expected);
          return d1 < d2 ? current : closest;
        }, null);
      } else {
        usd = prices[0];
      }
    }

    if (usd == null) {
      console.warn(`No USD price found for: ${url}`);
    }
    return usd;
  } catch (err) {
    console.warn(`Failed fetch: ${url}`, err instanceof Error ? err.message : String(err));
    return null;
  }
}

async function main(): Promise<void> {
  console.log("Fetch regional prices — loading data/kits/*.json\n");

  const files = fs.readdirSync(KITS_DIR).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    console.log("No kit files found.");
    return;
  }

  const kitDataByFile = new Map<string, Record<string, KitEntry>>();
  const allSlugs = new Set<string>();
  const slugToGbp = new Map<string, number | null>();

  for (const file of files) {
    const filePath = path.join(KITS_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, KitEntry>;
    kitDataByFile.set(file, data);
    for (const slug of Object.keys(data)) {
      if (data[slug]?.prices) {
        allSlugs.add(slug);
        if (!slugToGbp.has(slug)) slugToGbp.set(slug, data[slug].prices.GBP ?? null);
      }
    }
  }

  const usdCache = new Map<string, number | null>();

  for (const slug of allSlugs) {
    await randomDelay();
    const gbp = slugToGbp.get(slug) ?? null;
    const usd = await fetchUsdPrice(slug, gbp);
    usdCache.set(slug, usd);
  }

  for (const [file, data] of kitDataByFile) {
    let updated = false;
    for (const slug of Object.keys(data)) {
      if (!data[slug].prices) continue;
      const usd = usdCache.get(slug);
      if (usd != null) {
        data[slug].prices.USD = usd;
        updated = true;
      }
      const gbp = data[slug].prices.GBP;
      data[slug].prices.EUR = gbp != null ? Number((gbp * 1.25).toFixed(2)) : null;
      updated = true;
    }
    const filePath = path.join(KITS_DIR, file);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
    console.log(`Wrote ${filePath}`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
