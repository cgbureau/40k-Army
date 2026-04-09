#!/usr/bin/env node
/**
 * Build faction datasets for every faction in army-data-no-legends.json.
 * Usage: node scripts/build-all-factions.js
 *
 * Loads data/army-data-no-legends.json, reads all faction keys, converts each to
 * kebab-case slug (e.g. space_marines -> space-marines), and runs the dataset
 * builder for each. Output: data/factions/{faction}/units.json per faction.
 */

const fs = require("fs");
const path = require("path");
const { buildFaction } = require("./build-faction-dataset.js");

const DATA_DIR = path.join(__dirname, "..", "data");
const SOURCE_FILE = path.join(DATA_DIR, "army-data-no-legends.json");

/** Convert faction_key to kebab-case slug for paths. */
function factionKeyToSlug(key) {
  return String(key || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
}

function main() {
  if (!fs.existsSync(SOURCE_FILE)) {
    console.log("Source file not found: " + SOURCE_FILE);
    return;
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(SOURCE_FILE, "utf8"));
  } catch (e) {
    console.error("Invalid JSON in " + SOURCE_FILE + ": " + e.message);
    return;
  }

  const factionKeys = Object.keys(data.factions || {}).sort();
  if (factionKeys.length === 0) {
    console.log("No factions found in " + SOURCE_FILE);
    return;
  }

  console.log("Building faction datasets\n");

  let totalUnitsProcessed = 0;
  let totalUnitsEnriched = 0;
  const datasetsGenerated = [];

  for (const factionKey of factionKeys) {
    const slug = factionKeyToSlug(factionKey);
    try {
      const result = buildFaction(slug);
      console.log(result.factionName);
      console.log("Units processed:  " + result.unitsProcessed);
      console.log("Units enriched:   " + result.unitsEnriched);
      console.log("");
      totalUnitsProcessed += result.unitsProcessed;
      totalUnitsEnriched += result.unitsEnriched;
      datasetsGenerated.push(result.factionName);
    } catch (err) {
      console.error("Faction: " + slug);
      console.error("Error: " + err.message);
      console.error("");
    }
  }

  console.log("---");
  console.log("Total factions processed: " + factionKeys.length);
  console.log("Total units processed:   " + totalUnitsProcessed);
  console.log("Datasets generated:      " + datasetsGenerated.length);
}

main();
