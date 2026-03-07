#!/usr/bin/env node
/**
 * Image pipeline — download unit images for all factions.
 * Usage: node scripts/download-all-images.js
 *
 * Detects all factions in data/factions, runs download-faction-images for each.
 * Prints report per faction. Continues if one faction fails.
 */

const fs = require("fs");
const path = require("path");
const { downloadFactionImages } = require("./download-faction-images.js");

const DATA_DIR = path.join(__dirname, "..", "data");
const FACTIONS_DIR = path.join(DATA_DIR, "factions");

async function main() {
  if (!fs.existsSync(FACTIONS_DIR)) {
    console.log("No data/factions directory found. Nothing to download.");
    return;
  }

  const entries = fs.readdirSync(FACTIONS_DIR, { withFileTypes: true });
  const factions = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  if (factions.length === 0) {
    console.log("No factions found in data/factions.");
    return;
  }

  console.log("Downloading images for all factions\n");

  for (const faction of factions) {
    try {
      const report = await downloadFactionImages(faction);
      if (report.error) {
        console.log(report.factionName);
        console.log("Error: " + report.error);
        console.log("");
        continue;
      }
      console.log(report.factionName);
      console.log("Units processed:   " + report.unitsProcessed);
      console.log("Images downloaded: " + report.imagesDownloaded);
      console.log("Images skipped:    " + report.imagesSkipped);
      console.log("Images failed:     " + report.imagesFailed);
      if (report.failedUnits.length > 0) {
        console.log("Failed units: " + report.failedUnits.length);
      }
      console.log("");
    } catch (err) {
      console.log(faction);
      console.log("Error: " + (err.message || String(err)));
      console.log("");
    }
  }
}

main();
