#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

function loadJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function auditFaction(faction) {
  const factionSlug = String(faction).trim().toLowerCase();

  const unitsPath = path.join(DATA_DIR, "factions", factionSlug, "units.json");
  const mappingsPath = path.join(DATA_DIR, "kit-mappings", factionSlug + ".json");
  const kitsPath = path.join(DATA_DIR, "kits", factionSlug + ".json");

  const unitsData = loadJson(unitsPath);
  const mappingsData = loadJson(mappingsPath) || {};
  const kitsData = loadJson(kitsPath) || {};

  if (!unitsData || !Array.isArray(unitsData.units)) {
    console.error("Unable to load units from", unitsPath);
    process.exit(1);
  }

  const units = unitsData.units;
  const totalUnits = units.length;

  const mappingUnitIds = new Set(Object.keys(mappingsData));
  const kitSlugs = new Set(Object.keys(kitsData));

  const missingMappings = [];
  let enrichedCount = 0;

  for (const unit of units) {
    const isEnriched =
      unit.models_per_box !== null &&
      unit.models_per_box !== undefined &&
      unit.prices !== null &&
      unit.prices !== undefined;

    if (isEnriched) enrichedCount++;

    if (!mappingUnitIds.has(unit.id)) {
      // unit exists but no mapping
      missingMappings.push(unit.id);
    }
  }

  const mappedButKitMissing = [];
  for (const [unitId, kitSlug] of Object.entries(mappingsData)) {
    if (!kitSlugs.has(String(kitSlug))) {
      mappedButKitMissing.push(unitId);
    }
  }

  console.log("--------------------------------");
  console.log(`Faction: ${factionSlug}`);
  console.log("--------------------------------\n");

  console.log("MISSING KIT MAPPINGS");
  console.log("(unit exists but no mapping)\n");
  if (missingMappings.length === 0) {
    console.log("(none)\n");
  } else {
    for (const id of missingMappings) {
      console.log(`- ${id}`);
    }
    console.log("");
  }

  console.log("MAPPED BUT KIT NOT FOUND");
  console.log("(mapping exists but kit slug missing in kits file)\n");
  if (mappedButKitMissing.length === 0) {
    console.log("(none)\n");
  } else {
    for (const id of mappedButKitMissing) {
      console.log(`- ${id}`);
    }
    console.log("");
  }

  console.log(`TOTAL UNITS: ${totalUnits}`);
  console.log(`ENRICHED: ${enrichedCount}`);
  console.log(`MISSING: ${totalUnits - enrichedCount}`);
}

function main() {
  const factionArg = process.argv[2];
  if (!factionArg) {
    console.error("Usage: node scripts/audit-missing-mappings.js <faction-slug>");
    process.exit(1);
  }

  auditFaction(factionArg);
}

if (require.main === module) {
  main();
} else {
  module.exports = { auditFaction };
}

