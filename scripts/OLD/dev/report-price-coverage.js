#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "..", "data");
const FACTIONS_DIR = path.join(DATA_DIR, "factions");

function loadJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function toTitleCase(slug) {
  return slug
    .split(/[-_]/g)
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join(" ");
}

function main() {
  if (!fs.existsSync(FACTIONS_DIR)) {
    console.error("Factions directory not found:", FACTIONS_DIR);
    process.exit(1);
  }

  const factionSlugs = fs
    .readdirSync(FACTIONS_DIR, { withFileTypes: true })
    .filter((ent) => ent.isDirectory())
    .map((ent) => ent.name)
    .sort();

  const results = [];

  let grandTotalUnits = 0;
  let grandTotalWithPrice = 0;

  for (const slug of factionSlugs) {
    const unitsPath = path.join(FACTIONS_DIR, slug, "units.json");
    const data = loadJson(unitsPath);
    if (!data || !Array.isArray(data.units)) {
      continue;
    }

    const units = data.units;
    const total = units.length;
    let withPrice = 0;

    for (const unit of units) {
      if (unit && unit.prices != null) {
        withPrice++;
      }
    }

    results.push({
      slug,
      name: toTitleCase(slug),
      total,
      withPrice,
    });

    grandTotalUnits += total;
    grandTotalWithPrice += withPrice;
  }

  console.log("FACTION COVERAGE\n");

  // Determine padding for neat alignment
  const longestName = results.reduce(
    (max, r) => Math.max(max, r.name.length),
    "Faction".length
  );

  for (const r of results) {
    const namePadded = r.name.padEnd(longestName, " ");
    const totalStr = `${r.withPrice} / ${r.total}`;
    console.log(`${namePadded}  ${totalStr}`);
  }

  console.log("\nTOTAL UNITS");
  console.log(grandTotalUnits);
  console.log("\nTOTAL WITH PRICE");
  console.log(grandTotalWithPrice);

  const coverage =
    grandTotalUnits > 0
      ? ((grandTotalWithPrice / grandTotalUnits) * 100).toFixed(1)
      : "0.0";

  console.log("\nCOVERAGE");
  console.log(`${coverage}%`);
}

if (require.main === module) {
  main();
} else {
  module.exports = { main };
}

