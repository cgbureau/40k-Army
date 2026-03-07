#!/usr/bin/env node
/**
 * Faction Enrichment Pipeline — Orks (kit mapping + kit dataset)
 * Loads unit list, kit mappings, and kit dataset. Populates models_per_box and box_price.
 * No retailer scraping.
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const SOURCE_FILE = path.join(DATA_DIR, "army-data-no-legends.json");
const KIT_MAPPINGS_FILE = path.join(DATA_DIR, "kit-mappings", "orks.json");
const KIT_DATASET_FILE = path.join(DATA_DIR, "kits", "orks.json");
const OUTFILE = path.join(DATA_DIR, "factions", "orks", "units.json");

function loadOrkUnits() {
  const raw = fs.readFileSync(SOURCE_FILE, "utf8");
  const data = JSON.parse(raw);
  const orks = data.factions?.orks;
  if (!orks || !Array.isArray(orks.units)) throw new Error("Orks faction not found in " + SOURCE_FILE);
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

function loadKitDataset() {
  try {
    const raw = fs.readFileSync(KIT_DATASET_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function main() {
  console.log("Faction Enrichment Pipeline — Orks (Kit Dataset)\n");

  const units = loadOrkUnits();
  const kitMappings = loadKitMappings();
  const kitDataset = loadKitDataset();

  const enriched = [];
  const flagged = [];

  for (const unit of units) {
    const kitSlug = kitMappings[unit.id];
    const kitData = kitSlug ? kitDataset[kitSlug.trim()] : null;
    const hasKitData = kitData && typeof kitData.models === "number" && typeof kitData.price === "number";

    enriched.push({
      id: unit.id,
      name: unit.name,
      points: unit.points,
      models_per_box: hasKitData ? kitData.models : null,
      box_price: hasKitData ? Math.round(kitData.price * 100) / 100 : null,
    });
    if (!hasKitData) flagged.push(unit.name);
  }

  const sorted = enriched.sort((a, b) => a.name.localeCompare(b.name, "en"));
  const output = { faction: "Orks", units: sorted };

  for (const u of output.units) {
    if (!u.id || !u.name || typeof u.points !== "number") throw new Error("Missing id/name/points for unit: " + (u.id || u.name));
    if (u.models_per_box !== null && typeof u.models_per_box !== "number") throw new Error("models_per_box must be number or null");
    if (u.box_price !== null && typeof u.box_price !== "number") throw new Error("box_price must be number or null");
  }

  fs.writeFileSync(OUTFILE, JSON.stringify(output, null, 2), "utf8");

  const autoMatched = output.units.filter((u) => u.models_per_box != null && u.box_price != null).length;

  console.log("Faction: Orks\n");
  console.log("Units processed:   " + units.length);
  console.log("Auto matched:      " + autoMatched);
  console.log("Review required:   " + flagged.length);
  if (flagged.length > 0) {
    console.log("\nFlagged units (by name):");
    flagged.forEach((n) => console.log("  - " + n));
  }
  console.log("\nOutput saved to: " + OUTFILE);
}

main();
