#!/usr/bin/env node
/**
 * Build faction datasets for every faction that has a kit-mappings file.
 * Usage: node scripts/build-all-factions.js
 *
 * Discovers factions from data/kit-mappings/*.json and runs the pipeline for each.
 */

const fs = require("fs");
const path = require("path");
const { buildFaction } = require("./build-faction-dataset.js");

const DATA_DIR = path.join(__dirname, "..", "data");
const KIT_MAPPINGS_DIR = path.join(DATA_DIR, "kit-mappings");

function main() {
  if (!fs.existsSync(KIT_MAPPINGS_DIR)) {
    console.log("No kit-mappings directory found. Nothing to build.");
    return;
  }

  const files = fs.readdirSync(KIT_MAPPINGS_DIR).filter((f) => f.endsWith(".json"));
  const factions = files.map((f) => path.basename(f, ".json")).sort();

  if (factions.length === 0) {
    console.log("No faction kit-mappings found.");
    return;
  }

  console.log("Building faction datasets\n");

  for (const factionSlug of factions) {
    try {
      const result = buildFaction(factionSlug);
      console.log(result.factionName);
      console.log("Units processed:  " + result.unitsProcessed);
      console.log("Units enriched:   " + result.unitsEnriched);
      console.log("");
    } catch (err) {
      console.error("Faction: " + factionSlug);
      console.error("Error: " + err.message);
      console.error("");
    }
  }
}

main();
