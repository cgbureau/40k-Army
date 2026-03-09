#!/usr/bin/env node
/**
 * Fetches the complete Warhammer 40K unit dataset from Wahapedia (10th edition)
 * and regenerates data/army-data-no-legends.json.
 *
 * Usage: node scripts/fetch-wahapedia-units.js
 *        npm run fetch-units
 *
 * Does NOT modify: kit-mappings, kits, build-all-factions.js
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const BASE_URL = "https://wahapedia.ru/wh40k10ed";
const DATA_DIR = path.join(__dirname, "..", "data");
const OUTPUT_FILE = path.join(DATA_DIR, "army-data-no-legends.json");
const USER_AGENT = "Mozilla/5.0 (compatible; 40kArmy/1.0)";

/** Allowed Role values for battlefield units (case-insensitive). */
const ALLOWED_ROLES = new Set([
  "hq",
  "battleline",
  "troops",
  "elites",
  "fast attack",
  "heavy support",
  "dedicated transport",
  "flyer",
  "lord of war",
  "fortification",
  "character",
  "characters",
  "epic hero",
  "epic heroes",
  "other",
]);

/** Exclude rows whose Role includes any of these (case-insensitive). */
const EXCLUDED_ROLE_SUBSTRINGS = [
  "wargear",
  "weapon",
  "ability",
  "enhancement",
  "upgrade",
  "spell",
  "army rule",
];

/** Factions to exclude (other game systems / narrative content). Not included in output. */
const EXCLUDED_FACTION_SLUGS = new Set([
  "adeptus_titanicus",
  "unaligned_forces",
  "unbound_adversaries",
]);

function slugify(text) {
  return (text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

/** True if the Role column indicates a valid battlefield unit. */
function isAllowedRole(role) {
  const r = (role || "").trim().toLowerCase();
  if (!r) return false;
  const excluded = EXCLUDED_ROLE_SUBSTRINGS.some((term) => r.includes(term));
  if (excluded) return false;
  return ALLOWED_ROLES.has(r);
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { "User-Agent": USER_AGENT } },
      (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`${url} returned ${res.statusCode}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve(Buffer.concat(chunks).toString("utf8").replace(/^\uFEFF/, ""))
        );
      }
    );
    req.on("error", reject);
  });
}

function parsePipeCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const header = lines[0].split("|").map((h) => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split("|");
    const row = {};
    header.forEach((h, j) => {
      if (h && parts[j] !== undefined) row[h] = parts[j].trim();
    });
    rows.push(row);
  }
  return rows;
}

/** Parse Datasheets.csv; 'legend' column can contain pipes, so we parse by fixed column positions from end. */
function parseDatasheetsCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split("|");
    if (parts.length < 14) continue;
    const link = parts[parts.length - 2]?.trim() || "";
    const damaged_description = parts[parts.length - 3]?.trim() || "";
    const damaged_w = parts[parts.length - 4]?.trim() || "";
    const leader_footer = parts[parts.length - 5]?.trim() || "";
    const leader_head = parts[parts.length - 6]?.trim() || "";
    const virtual = parts[parts.length - 7]?.trim() || "";
    const transport = parts[parts.length - 8]?.trim() || "";
    const loadout = parts[parts.length - 9]?.trim() || "";
    const role = parts[parts.length - 10]?.trim() || "";
    const legend = parts.slice(4, parts.length - 10).join("|").trim();
    rows.push({
      id: parts[0]?.trim() || "",
      name: parts[1]?.trim() || "",
      faction_id: parts[2]?.trim() || "",
      source_id: parts[3]?.trim() || "",
      legend,
      role,
      loadout,
      transport,
      virtual,
      leader_head,
      leader_footer,
      damaged_w,
      damaged_description,
      link,
    });
  }
  return rows;
}

/** Extract points from PriceTag elements within UNIT COMPOSITION section; return minimum. */
function parsePointsFromHtml(html) {
  const start = html.indexOf("UNIT COMPOSITION");
  if (start === -1) return null;
  const section = html.substring(start, start + 1000);
  const regex = /PriceTag">(\d+)/g;
  const values = [];
  let m;
  while ((m = regex.exec(section)) !== null) {
    const n = parseInt(m[1], 10);
    if (Number.isFinite(n)) values.push(n);
  }
  if (values.length === 0) return null;
  return Math.min(...values);
}

module.exports.parsePointsFromHtml = parsePointsFromHtml;

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const THROTTLE_MS = 150;
const PROGRESS_INTERVAL = 50;

async function main() {
  console.log("Fetching Wahapedia 10th edition data...\n");

  const factionsText = await fetchText(`${BASE_URL}/Factions.csv`);
  const factionsRows = parsePipeCsv(factionsText);
  const factionIdToName = {};
  factionsRows.forEach((r) => {
    if (r.id && r.name) factionIdToName[r.id] = r.name;
  });

  const datasheetsText = await fetchText(`${BASE_URL}/Datasheets.csv`);
  let datasheets = parseDatasheetsCsv(datasheetsText);
  if (datasheets.length === 0) {
    datasheets = parsePipeCsv(datasheetsText);
  }
  console.log(`Loaded ${factionsRows.length} factions, ${datasheets.length} datasheets.`);

  /** Faction slug (from Wahapedia name) -> { name, units }. Exclude non–40K factions. */
  const byFaction = {};
  const skippedFactions = new Set();
  factionsRows.forEach((r) => {
    if (!r.id || !r.name) return;
    const slug = slugify(r.name);
    if (!slug) return;
    if (EXCLUDED_FACTION_SLUGS.has(slug)) {
      skippedFactions.add(slug);
      return;
    }
    if (!byFaction[slug]) byFaction[slug] = { name: r.name, units: [] };
  });

  const seenIds = new Set();
  const skipPointScrape = process.env.SKIP_SCRAPE_POINTS !== "0";
  if (skipPointScrape)
    console.log("Skipping point scrape (set SKIP_SCRAPE_POINTS=0 to fetch points from each datasheet page).\n");

  /** Build list of units to add (same filters + dedupe). */
  const unitsToProcess = [];
  for (const row of datasheets) {
    const factionName = factionIdToName[row.faction_id];
    if (!factionName) continue;
    const factionSlug = slugify(factionName);
    if (!factionSlug || !byFaction[factionSlug]) continue;
    if (!isAllowedRole(row.role)) continue;
    const name = (row.name || "").trim();
    if (!name) continue;
    const isLegends =
      /\[Legends?\]|Legends? unit|legend\s+unit/i.test(name) ||
      (row.role && /legend/i.test(row.role));
    const id = slugify(name);
    const dedupeKey = `${factionSlug}:${id}`;
    if (!id || seenIds.has(dedupeKey)) continue;
    seenIds.add(dedupeKey);
    unitsToProcess.push({ row, factionSlug, name, id, isLegends });
  }

  const totalUnitsToProcess = unitsToProcess.length;

  for (let i = 0; i < unitsToProcess.length; i++) {
    const { row, factionSlug, name, id, isLegends } = unitsToProcess[i];
    let points = 0;
    if (!skipPointScrape && row.link) {
      try {
        const html = await fetchText(row.link);
        const p = parsePointsFromHtml(html);
        if (p != null) points = p;
        else console.error("Could not parse points: " + name);
      } catch (e) {
        console.error("Could not parse points: " + name);
      }
      await delay(THROTTLE_MS);
      if ((i + 1) % PROGRESS_INTERVAL === 0) {
        console.log("Processed " + (i + 1) + " / " + totalUnitsToProcess + " units");
      }
    }

    byFaction[factionSlug].units.push({
      id,
      name,
      points,
      is_legends: !!isLegends,
    });
  }

  for (const slug of Object.keys(byFaction)) {
    byFaction[slug].units.sort((a, b) => a.name.localeCompare(b.name, "en"));
  }

  const output = { factions: byFaction };
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf8");

  const totalUnits = Object.values(byFaction).reduce((s, f) => s + f.units.length, 0);
  const totalLegends = Object.values(byFaction).reduce(
    (s, f) => s + f.units.filter((u) => u.is_legends).length,
    0
  );
  console.log("\n--- Summary ---");
  if (skippedFactions.size > 0) {
    console.log("Skipped factions:");
    [...skippedFactions].sort().forEach((s) => console.log("- " + s));
  }
  console.log("Faction count: " + Object.keys(byFaction).length);
  console.log("Total units:  " + totalUnits);
  console.log("Legends units:" + totalLegends);
  console.log("\nWrote " + OUTPUT_FILE);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
