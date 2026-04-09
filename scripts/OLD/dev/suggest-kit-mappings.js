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

function normalizeUnitId(unitId) {
  if (!unitId) return "";
  let slug = String(unitId).trim().toLowerCase();

  // replace "_" with "-"
  slug = slug.replace(/_/g, "-");

  // remove common suffixes
  const suffixes = ["-squad", "-unit", "-detachment", "-team"];
  for (const suffix of suffixes) {
    if (slug.endsWith(suffix)) {
      slug = slug.slice(0, -suffix.length);
      break;
    }
  }

  // remove common prefixes
  const prefixes = ["space-marine-", "chaos-", "necron-", "ork-", "tyranid-"];
  for (const prefix of prefixes) {
    if (slug.startsWith(prefix)) {
      slug = slug.slice(prefix.length);
      break;
    }
  }

  return slug;
}

function normalizeKitSlug(kitSlug) {
  if (!kitSlug) return "";
  let slug = String(kitSlug).trim().toLowerCase();
  // replace "_" with "-" just in case
  slug = slug.replace(/_/g, "-");
  // remove common prefixes to align with unit normalization
  const prefixes = ["space-marine-", "chaos-", "necron-", "ork-", "tyranid-"];
  for (const prefix of prefixes) {
    if (slug.startsWith(prefix)) {
      slug = slug.slice(prefix.length);
      break;
    }
  }
  return slug;
}

function diceCoefficient(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;

  const bigrams = (str) => {
    const res = [];
    for (let i = 0; i < str.length - 1; i++) {
      res.push(str.slice(i, i + 2));
    }
    return res;
  };

  const aBigrams = bigrams(a);
  const bBigrams = bigrams(b);

  const bMap = new Map();
  for (const bg of bBigrams) {
    bMap.set(bg, (bMap.get(bg) || 0) + 1);
  }

  let intersection = 0;
  for (const bg of aBigrams) {
    const count = bMap.get(bg) || 0;
    if (count > 0) {
      intersection++;
      bMap.set(bg, count - 1);
    }
  }

  return (2 * intersection) / (aBigrams.length + bBigrams.length);
}

function tokenOverlapScore(a, b) {
  const aTokens = new Set(a.split("-").filter(Boolean));
  const bTokens = new Set(b.split("-").filter(Boolean));
  if (aTokens.size === 0 || bTokens.size === 0) return 0;

  let intersection = 0;
  for (const t of aTokens) {
    if (bTokens.has(t)) intersection++;
  }
  const union = aTokens.size + bTokens.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function substringBoost(a, b) {
  if (!a || !b) return 0;
  if (a.includes(b) || b.includes(a)) {
    // moderate boost when one string contains the other
    return 0.2;
  }
  return 0;
}

function suggestForFaction(faction) {
  const factionSlug = String(faction).trim().toLowerCase();

  const unitsPath = path.join(DATA_DIR, "factions", factionSlug, "units.json");
  const kitsPath = path.join(DATA_DIR, "kits", factionSlug + ".json");
  const mappingsPath = path.join(DATA_DIR, "kit-mappings", factionSlug + ".json");

  const unitsData = loadJson(unitsPath);
  const kitsData = loadJson(kitsPath) || {};
  const mappingsData = loadJson(mappingsPath) || {};

  if (!unitsData || !Array.isArray(unitsData.units)) {
    console.error("Unable to load units from", unitsPath);
    process.exit(1);
  }

  const kitSlugs = Object.keys(kitsData);
  const existingMappings = new Set(Object.keys(mappingsData));

  const suggestionsByUnit = [];

  for (const unit of unitsData.units) {
    // Only consider unmapped units where models_per_box is null
    if (unit.models_per_box !== null && unit.models_per_box !== undefined) continue;
    if (existingMappings.has(unit.id)) continue;

    const normUnit = normalizeUnitId(unit.id);
    if (!normUnit) continue;

    const scored = [];

    for (const kitSlug of kitSlugs) {
      const normKit = normalizeKitSlug(kitSlug);
      if (!normKit) continue;

      const dice = diceCoefficient(normUnit, normKit);
      const overlap = tokenOverlapScore(normUnit, normKit);
      const boost = substringBoost(normUnit, normKit);

      // simple combined score
      const baseScore = (dice + overlap) / 2;
      const score = Math.min(1, baseScore + boost);

      if (score > 0) {
        scored.push({ kitSlug, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 3);

    if (top.length === 0) continue;
    if (top[0].score < 0.45) continue;

    suggestionsByUnit.push({
      unitId: unit.id,
      candidates: top,
    });
  }

  console.log("--------------------------------");
  console.log("SUGGESTED MAPPINGS");
  console.log("--------------------------------\n");

  if (suggestionsByUnit.length === 0) {
    console.log("(no suggestions found)");
    return;
  }

  for (const entry of suggestionsByUnit) {
    console.log(entry.unitId);
    entry.candidates.forEach((c, idx) => {
      const rank = idx + 1;
      const scoreStr = c.score.toFixed(2);
      console.log(`  ${rank}. ${c.kitSlug} (${scoreStr})`);
    });
    console.log("");
  }
}

function main() {
  const factionArg = process.argv[2];
  if (!factionArg) {
    console.error("Usage: node scripts/suggest-kit-mappings.js <faction-slug>");
    process.exit(1);
  }

  suggestForFaction(factionArg);
}

if (require.main === module) {
  main();
} else {
  module.exports = { suggestForFaction };
}

