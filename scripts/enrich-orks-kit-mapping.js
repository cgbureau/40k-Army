#!/usr/bin/env node
/**
 * Faction Enrichment Pipeline — Orks (deterministic kit mapping)
 * Follows FACTION_DATA_PIPELINE.md v2
 * Maps units to Element Games product URLs, fetches pages, parses RRP and model count.
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const SOURCE_FILE = path.join(DATA_DIR, "army-data-no-legends.json");
const KIT_MAPPINGS_FILE = path.join(DATA_DIR, "kit-mappings", "orks.json");
const OUTFILE = path.join(DATA_DIR, "factions", "orks", "units.json");
const BASE_URL = "https://elementgames.co.uk/games-workshop/warhammer-40k/orks";

// Fallback: unit name → kit_slug when no mapping file entry exists
const KIT_SLUG_MAP = {
  "Battlewagon": "battlewagon",
  "Beastboss": "beastboss",
  "Big Mek in Meka Armour": "big-mek-in-meka-armour",
  "Big Mek with Shokk Attack Gun": "big-mek-with-shokk-attack-gun",
  "Bomba": "bomba",
  "Boyz": "ork-boyz-2021",
  "Burna Boyz": "ork-lootas-and-burnas",
  "Deff Dread": "deff-dread",
  "Deffkoptas": "ork-deffkoptas",
  "Flash Gitz": "flash-gitz",
  "Gretchin": "ork-gretchin",
  "Hunta Rig": "hunta-rig",
  "Kill Rig": "kill-rig",
  "Killa Kans": "killa-kans",
  "Kommandos": "orks-kommandos-new",
  "Lootas": "ork-lootas-and-burnas",
  "Mek": "ork-mek",
  "Meganobz": "ork-meganobz",
  "Nob on Smasha Squig": "nob-on-smasha-squig",
  "Nobz": "ork-nobz",
  "Painboy": "painboy",
  "Rukkatrukk Squigbuggy": "rukkatrukk-squigbuggy",
  "Shokkjump Dragsta": "shokkjump-dragsta",
  "Snagga Boyz": "orks-beast-snagga-boyz",
  "Squighog Boyz": "orks-squighog-boyz",
  "Stormboyz": "ork-stormboyz",
  "Tankbustas": "ork-tankbustas",
  "Trukk": "ork-trukk",
  "Warboss": "ork-warboss",
  "Warboss in Mega Armour": "warboss-in-mega-armour",
  "Weirdboy": "weirdboy",
  "Zodgrod Wortsnagga": "zodgrod-wortsnagga",
};

const FETCH_OPTS = {
  headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
  redirect: "follow",
};

function loadOrkUnits() {
  const raw = fs.readFileSync(SOURCE_FILE, "utf8");
  const data = JSON.parse(raw);
  const orks = data.factions?.orks;
  if (!orks || !Array.isArray(orks.units)) throw new Error("Orks faction not found");
  const seen = new Set();
  const units = [];
  for (const u of orks.units) {
    const id = u.id && String(u.id).trim();
    const name = u.name && String(u.name).trim();
    const points = typeof u.points === "number" ? u.points : parseInt(u.points, 10);
    if (!id || !name || isNaN(points)) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    units.push({ id, name, points });
  }
  return units;
}

function loadKitMappings() {
  try {
    const raw = fs.readFileSync(KIT_MAPPINGS_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function getKitSlugFallback(name) {
  return KIT_SLUG_MAP[name] || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function getKitSlug(unit, kitMappings) {
  const mapped = kitMappings[unit.id];
  if (mapped != null && typeof mapped === "string" && mapped.trim()) {
    return { slug: mapped.trim(), fromMapping: true };
  }
  return { slug: getKitSlugFallback(unit.name), fromMapping: false };
}

function parseProductPage(html) {
  const allPrices = html.match(/&pound;(\d+\.\d{2})/g);
  let boxPrice = null;
  if (allPrices) {
    for (const p of allPrices) {
      const num = parseFloat(p.replace(/[^0-9.]/g, ""));
      if (num >= 10 && num < 1000) { boxPrice = num; break; }
    }
  }
  const countMatch = html.match(/contains\s+(\d+)\s+(?:multi-part|mulit-part|plastic)/i)
    || html.match(/boxed?\s*set\s+contains\s+(\d+)/i)
    || html.match(/(\d+)\s+multi-part\s+plastic/i)
    || html.match(/(\d+)\s*(?:plastic\s+)?(?:citadel\s+)?miniatures?/i);
  const modelsPerBox = countMatch ? parseInt(countMatch[1], 10) : null;
  return { box_price: boxPrice, models_per_box: modelsPerBox };
}

async function fetchProduct(kitSlug) {
  const url = `${BASE_URL}/${kitSlug}`;
  try {
    const res = await fetch(url, FETCH_OPTS);
    const html = res.ok ? await res.text() : "";
    const parsed = parseProductPage(html);
    const ok = typeof parsed.box_price === "number" && typeof parsed.models_per_box === "number";
    return { ...parsed, review_required: !ok };
  } catch (e) {
    return { box_price: null, models_per_box: null, review_required: true };
  }
}

async function main() {
  console.log("Faction Enrichment Pipeline — Orks (Kit Mapping)\n");

  const units = loadOrkUnits();
  const kitMappings = loadKitMappings();
  const enriched = [];
  const flagged = [];
  let mappingUsedCount = 0;

  for (const unit of units) {
    const { slug: kitSlug, fromMapping } = getKitSlug(unit, kitMappings);
    if (fromMapping) mappingUsedCount++;

    const result = await fetchProduct(kitSlug);

    const hasNumeric = typeof result.box_price === "number" && typeof result.models_per_box === "number";
    if (hasNumeric && !result.review_required) {
      enriched.push({
        id: unit.id,
        name: unit.name,
        points: unit.points,
        models_per_box: result.models_per_box,
        box_price: Math.round(result.box_price * 100) / 100,
      });
    } else {
      flagged.push(unit.name);
    }
  }

  const sorted = enriched.sort((a, b) => a.name.localeCompare(b.name, "en"));
  const output = { faction: "Orks", units: sorted };

  for (const u of output.units) {
    if (!u.id || !u.name || typeof u.points !== "number") throw new Error("Missing id/name/points");
    if (typeof u.box_price !== "number") throw new Error("box_price must be numeric");
    if (typeof u.models_per_box !== "number") throw new Error("models_per_box must be numeric");
  }

  fs.writeFileSync(OUTFILE, JSON.stringify(output, null, 2), "utf8");

  console.log("Faction: Orks\n");
  console.log("Units processed:   " + units.length);
  console.log("Auto matched:     " + output.units.length);
  console.log("Review required:  " + flagged.length);
  console.log("Mapping used:     " + mappingUsedCount);
  if (flagged.length > 0) {
    console.log("\nFlagged units (by name):");
    flagged.forEach((n) => console.log("  - " + n));
  }
  console.log("\nOutput saved to: " + OUTFILE);
}

main().catch((e) => { console.error(e); process.exit(1); });
