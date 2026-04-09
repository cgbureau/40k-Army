#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const FACTIONS_DIR = path.join(ROOT, "data", "factions");
const MAPPINGS_DIR = path.join(ROOT, "data", "kit-mappings");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function safePercent(numerator, denominator) {
  if (!denominator) return "0.00%";
  return `${((numerator / denominator) * 100).toFixed(2)}%`;
}

function pad(str, width) {
  return String(str).padEnd(width, " ");
}

function getFactionSlugs() {
  return fs
    .readdirSync(FACTIONS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function getValidMappedIds(mappingObj) {
  const ids = new Set();
  for (const key of Object.keys(mappingObj || {})) {
    if (key.startsWith("__")) continue;
    ids.add(key);
  }
  return ids;
}

function main() {
  const slugs = getFactionSlugs();

  const rows = [];
  let totalUnits = 0;
  let totalMapped = 0;
  let totalAwol = 0;
  let totalForgeWorld = 0;
  let totalLegends = 0;
  let totalAllied = 0;

  for (const slug of slugs) {
    const unitsPath = path.join(FACTIONS_DIR, slug, "units.json");
    const mappingPath = path.join(MAPPINGS_DIR, `${slug}.json`);

    if (!fs.existsSync(unitsPath)) continue;

    const unitsData = readJson(unitsPath);
    const units = Array.isArray(unitsData.units) ? unitsData.units : [];

    const mappings = fs.existsSync(mappingPath) ? readJson(mappingPath) : {};
    const mappedIds = getValidMappedIds(mappings);

    let mapped = 0;
    let awol = 0;
    let forgeworld = 0;
    let legends = 0;
    let allied = 0;

    for (const unit of units) {
      const availability = unit && unit.availability;
      const id = unit && unit.id;

      if (id && mappedIds.has(id)) {
        mapped += 1;
      }

      if (availability === "forgeworld") forgeworld += 1;
      if (availability === "legends") legends += 1;
      if (availability === "allied") allied += 1;

      if ((!id || !mappedIds.has(id)) && !availability) {
        awol += 1;
      }
    }

    rows.push({
      slug,
      total: units.length,
      mapped,
      awol,
      forgeworld,
      legends,
      allied,
    });

    totalUnits += units.length;
    totalMapped += mapped;
    totalAwol += awol;
    totalForgeWorld += forgeworld;
    totalLegends += legends;
    totalAllied += allied;
  }

  const slugWidth = Math.max(
    "faction".length,
    ...rows.map((row) => row.slug.length)
  );

  console.log("PROJECT STATS (kits + mappings architecture)");
  console.log("");

  for (const row of rows) {
    const mappedText = `mapped ${row.mapped} / ${row.total}`;
    const awolText = `awol ${row.awol}`;
    const fwText = `fw ${row.forgeworld}`;
    const lgdText = `lgd ${row.legends}`;
    const alliedText = `allied ${row.allied}`;

    console.log(
      `${pad(row.slug, slugWidth)}  ${pad(mappedText, 18)} | ${pad(awolText, 8)} | ${pad(fwText, 6)} | ${pad(lgdText, 7)} | ${alliedText}`
    );
  }

  const resolvedTotal = totalMapped + totalForgeWorld + totalLegends + totalAllied;

  console.log("");
  console.log(`TOTAL UNITS: ${totalUnits}`);
  console.log(`TOTAL MAPPED: ${totalMapped}`);
  console.log(`TOTAL AWOL: ${totalAwol}`);
  console.log(`TOTAL FORGEWORLD: ${totalForgeWorld}`);
  console.log(`TOTAL LEGENDS: ${totalLegends}`);
  console.log(`TOTAL ALLIED: ${totalAllied}`);
  console.log("");
  console.log(`Mapped Coverage: ${safePercent(totalMapped, totalUnits)}`);
  console.log(`Resolved Coverage: ${safePercent(resolvedTotal, totalUnits)}`);
}

main();
