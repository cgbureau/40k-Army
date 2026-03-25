#!/usr/bin/env node
/**
 * High-level dataset stats for marketing / social (no dependencies).
 * Run from repo root: node scripts/report-dataset-stats.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const FACTIONS_DIR = path.join(ROOT, "data", "factions");
const KIT_MAPPINGS_DIR = path.join(ROOT, "data", "kit-mappings");
const KITS_DIR = path.join(ROOT, "data", "kits");

function safeReadJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function listFactionSlugs() {
  if (!fs.existsSync(FACTIONS_DIR)) return [];
  return fs
    .readdirSync(FACTIONS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) =>
      fs.existsSync(path.join(FACTIONS_DIR, name, "units.json"))
    );
}

function loadKitMapping(slug) {
  const p = path.join(KIT_MAPPINGS_DIR, `${slug}.json`);
  if (!fs.existsSync(p)) return {};
  const data = safeReadJson(p);
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};
  return data;
}

function isUnitMapped(unit, mapping) {
  if (unit == null || typeof unit !== "object") return false;
  const k = unit.kit;
  if (k != null && k !== "") return true;
  const mapped = mapping[unit.id];
  if (mapped == null) return false;
  if (typeof mapped === "string") return mapped.length > 0;
  return typeof mapped === "object";
}

function collectKitJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...collectKitJsonFiles(full));
    else if (ent.isFile() && ent.name.endsWith(".json")) out.push(full);
  }
  return out;
}

function countUniqueKitKeys() {
  const keys = new Set();
  for (const file of collectKitJsonFiles(KITS_DIR)) {
    const data = safeReadJson(file);
    if (!data || typeof data !== "object" || Array.isArray(data)) continue;
    for (const k of Object.keys(data)) keys.add(k);
  }
  return keys.size;
}

function pct(part, total) {
  if (!total) return "0.0";
  return ((part / total) * 100).toFixed(1);
}

function main() {
  const slugs = listFactionSlugs();
  let totalUnits = 0;
  let mappedUnits = 0;
  let forgeWorldUnits = 0;
  let legendsUnits = 0;
  let purchasableUnits = 0;
  let awolUnits = 0;

  for (const slug of slugs) {
    const unitsPath = path.join(FACTIONS_DIR, slug, "units.json");
    const data = safeReadJson(unitsPath);
    const units = data && Array.isArray(data.units) ? data.units : [];
    const mapping = loadKitMapping(slug);

    for (const unit of units) {
      totalUnits += 1;
      const av = unit.availability;
      const isFw = av === "forgeworld";
      const isLeg = av === "legends";
      if (isFw) forgeWorldUnits += 1;
      if (isLeg) legendsUnits += 1;

      const mapped = isUnitMapped(unit, mapping);
      if (mapped) mappedUnits += 1;
      if (mapped && !isFw && !isLeg) purchasableUnits += 1;
      if (!mapped && !isFw && !isLeg) awolUnits += 1;
    }
  }

  const totalKits = countUniqueKitKeys();
  const factionCount = slugs.length;

  const lines = [
    "40KARMY DATASET STATS",
    "",
    `Factions: ${factionCount}`,
    `Total Units: ${totalUnits}`,
    `Mapped Units: ${mappedUnits}`,
    `Forge World Units: ${forgeWorldUnits}`,
    `Legends Units: ${legendsUnits}`,
    `AWOL Units: ${awolUnits}`,
    "",
    `Coverage (mapped): ${pct(mappedUnits, totalUnits)}%`,
    `Coverage (purchasable): ${pct(purchasableUnits, totalUnits)}%`,
    `Coverage (AWOL): ${pct(awolUnits, totalUnits)}%`,
    "",
    `Total Kits: ${totalKits}`,
    "",
    "Supported Currencies:",
    "GBP, USD, EUR, AUD, CAD, PLN, CHF",
    "",
  ];

  process.stdout.write(lines.join("\n"));
}

main();
