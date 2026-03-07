#!/usr/bin/env node
/**
 * Phase A: Generate kit mappings and kit datasets for factions that don't have them,
 * then run the faction dataset builder for all factions in kit-mappings.
 * Called by the full pipeline; can also be run standalone.
 */
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const SOURCE_FILE = path.join(DATA_DIR, "army-data-no-legends.json");

function nameToSlug(name) {
  return (name || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/['']/g, "");
}

function unitNameToKitSlug(name) {
  const trimmed = (name || "").replace(/\s+(Squad|Unit)$/i, "").trim();
  return nameToSlug(trimmed);
}

function getFactionSlugFromKey(data, key) {
  const name = data.factions[key].name;
  return nameToSlug(name);
}

function generateKitMapping(units) {
  const out = {};
  for (const u of units) {
    if (!u.id || !u.name) continue;
    out[u.id] = unitNameToKitSlug(u.name);
  }
  return out;
}

function generateKitDataset(units, mapping) {
  const slugToUnit = new Map();
  for (const u of units) {
    const slug = mapping[u.id];
    if (slug && !slugToUnit.has(slug)) slugToUnit.set(slug, u);
  }
  const dataset = {};
  for (const [slug, unit] of slugToUnit) {
    const models = typeof unit.models_per_box === "number" ? unit.models_per_box : 1;
    const price = typeof unit.box_price === "number" ? unit.box_price : 25;
    dataset[slug] = { models, price };
  }
  return dataset;
}

function run() {
  const raw = fs.readFileSync(SOURCE_FILE, "utf8");
  const data = JSON.parse(raw);
  const factions = data.factions || {};
  const kitMappingsDir = path.join(DATA_DIR, "kit-mappings");
  const kitsDir = path.join(DATA_DIR, "kits");
  fs.mkdirSync(kitMappingsDir, { recursive: true });
  fs.mkdirSync(kitsDir, { recursive: true });

  let generated = 0;
  for (const key of Object.keys(factions)) {
    const slug = getFactionSlugFromKey(data, key);
    const mappingPath = path.join(kitMappingsDir, slug + ".json");
    const kitsPath = path.join(kitsDir, slug + ".json");
    const units = factions[key].units || [];

    if (!fs.existsSync(mappingPath)) {
      const mapping = generateKitMapping(units);
      fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), "utf8");
      generated++;
    }
    if (!fs.existsSync(kitsPath)) {
      const mapping = JSON.parse(fs.readFileSync(mappingPath, "utf8"));
      const kitDataset = generateKitDataset(units, mapping);
      fs.writeFileSync(kitsPath, JSON.stringify(kitDataset, null, 2), "utf8");
    }
  }
  return generated;
}

if (require.main === module) {
  run();
}

module.exports = { run, generateKitMapping, generateKitDataset };
