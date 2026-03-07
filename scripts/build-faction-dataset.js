#!/usr/bin/env node
/**
 * Faction dataset builder — generic pipeline for any faction.
 * Usage: node scripts/build-faction-dataset.js <faction>
 * Example: node scripts/build-faction-dataset.js orks
 *
 * Loads: army-data-no-legends.json, kit-mappings/{faction}.json, kits/{faction}.json
 * Output: factions/{faction}/units.json
 * Deduplicates by unit id, sorts by name, validates required fields.
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const SOURCE_FILE = path.join(DATA_DIR, "army-data-no-legends.json");

function getPaths(faction) {
  const slug = String(faction).trim().toLowerCase();
  if (!slug) throw new Error("Faction argument required");
  return {
    slug,
    kitMappings: path.join(DATA_DIR, "kit-mappings", slug + ".json"),
    kitDataset: path.join(DATA_DIR, "kits", slug + ".json"),
    outfile: path.join(DATA_DIR, "factions", slug, "units.json"),
  };
}

function loadUnits(factionSlug) {
  const raw = fs.readFileSync(SOURCE_FILE, "utf8");
  const data = JSON.parse(raw);
  const factionData = data.factions?.[factionSlug];
  if (!factionData || !Array.isArray(factionData.units)) {
    throw new Error("Faction '" + factionSlug + "' not found in " + SOURCE_FILE);
  }
  const seen = new Set();
  const units = [];
  for (const u of factionData.units) {
    const id = u.id && String(u.id).trim();
    const name = u.name && String(u.name).trim();
    const points = typeof u.points === "number" ? u.points : parseInt(u.points, 10);
    if (!id || !name || isNaN(points)) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    units.push({ id, name, points });
  }
  return { units, factionName: factionData.name || factionSlug };
}

function loadKitMappings(kitMappingsPath) {
  try {
    const raw = fs.readFileSync(kitMappingsPath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function loadKitDataset(kitDatasetPath) {
  try {
    const raw = fs.readFileSync(kitDatasetPath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function buildFaction(factionArg) {
  const { slug, kitMappings: kitMappingsPath, kitDataset: kitDatasetPath, outfile } = getPaths(factionArg);
  const { units, factionName } = loadUnits(slug);
  const kitMappings = loadKitMappings(kitMappingsPath);
  const kitDataset = loadKitDataset(kitDatasetPath);

  const enriched = [];
  for (const unit of units) {
    const kitSlug = kitMappings[unit.id];
    const kitData = kitSlug ? kitDataset[String(kitSlug).trim()] : null;
    const hasKitData = kitData && typeof kitData.models === "number" && typeof kitData.price === "number";

    enriched.push({
      id: unit.id,
      name: unit.name,
      points: unit.points,
      models_per_box: hasKitData ? kitData.models : null,
      box_price: hasKitData ? Math.round(kitData.price * 100) / 100 : null,
    });
  }

  const sorted = enriched.sort((a, b) => a.name.localeCompare(b.name, "en"));
  const output = { faction: factionName, units: sorted };

  for (const u of output.units) {
    if (!u.id || !u.name || typeof u.points !== "number") {
      throw new Error("Missing id/name/points for unit: " + (u.id || u.name));
    }
    if (u.models_per_box !== null && typeof u.models_per_box !== "number") {
      throw new Error("models_per_box must be number or null");
    }
    if (u.box_price !== null && typeof u.box_price !== "number") {
      throw new Error("box_price must be number or null");
    }
  }

  fs.mkdirSync(path.dirname(outfile), { recursive: true });
  fs.writeFileSync(outfile, JSON.stringify(output, null, 2), "utf8");

  const unitsEnriched = output.units.filter((u) => u.models_per_box != null && u.box_price != null).length;

  return {
    factionName,
    unitsProcessed: units.length,
    unitsEnriched,
    outfile,
  };
}

function main() {
  const factionArg = process.argv[2];
  if (!factionArg) {
    console.error("Usage: node scripts/build-faction-dataset.js <faction>");
    process.exit(1);
  }

  const result = buildFaction(factionArg);
  console.log(result.factionName);
  console.log("Units processed:  " + result.unitsProcessed);
  console.log("Units enriched:  " + result.unitsEnriched);
  console.log("Output: " + result.outfile);
}

if (require.main === module) {
  main();
} else {
  module.exports = { buildFaction };
}
