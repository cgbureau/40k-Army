#!/usr/bin/env node
/**
 * Image pipeline — download unit images for one faction from Element Games.
 * Usage: node scripts/download-faction-images.js <faction>
 * Example: node scripts/download-faction-images.js orks
 *
 * Reads: data/factions/{faction}/units.json, data/kit-mappings/{faction}.json
 * Builds image URL: https://elementgames.co.uk/images/products/{slug}.jpg
 * Saves: public/unit-images/{faction}/{unit-id}.jpg
 *
 * No HTML scraping. Skip if file exists and size > 5KB. Validate after download.
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const UNIT_IMAGES_DIR = path.join(PUBLIC_DIR, "unit-images");

const IMAGE_BASE_URL = "https://elementgames.co.uk/images/products/";
const MIN_VALID_SIZE_BYTES = 5 * 1024; // 5KB
const FETCH_TIMEOUT_MS = 10000;
const USER_AGENT = "40KArmy-Image-Pipeline/1.0";

function getPaths(faction) {
  const slug = String(faction).trim().toLowerCase();
  if (!slug) throw new Error("Faction argument required");
  return {
    slug,
    unitsFile: path.join(DATA_DIR, "factions", slug, "units.json"),
    kitMappingsFile: path.join(DATA_DIR, "kit-mappings", slug + ".json"),
    outDir: path.join(UNIT_IMAGES_DIR, slug),
  };
}

function loadUnits(unitsPath) {
  const raw = fs.readFileSync(unitsPath, "utf8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data.units)) throw new Error("Invalid units.json: missing units array");
  return data.units;
}

function loadKitMappings(mappingsPath) {
  try {
    const raw = fs.readFileSync(mappingsPath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function imageUrlForSlug(kitSlug) {
  const slug = String(kitSlug).trim().toLowerCase().replace(/\s+/g, "-");
  return IMAGE_BASE_URL + slug + ".jpg";
}

async function downloadImage(url, destPath) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: controller.signal,
    redirect: "follow",
  });
  clearTimeout(timeout);
  if (!res.ok) throw new Error("HTTP " + res.status);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length === 0) throw new Error("Empty response");
  fs.writeFileSync(destPath, buffer);
  return buffer.length;
}

function isValidImageFile(filePath) {
  try {
    const stat = fs.statSync(filePath);
    return stat.size > MIN_VALID_SIZE_BYTES;
  } catch (_) {
    return false;
  }
}

async function downloadFactionImages(factionArg) {
  const paths = getPaths(factionArg);
  const report = {
    factionName: factionArg,
    unitsProcessed: 0,
    downloaded: 0,
    skipped: 0,
    failed: 0,
    failedUnits: [],
    outDir: paths.outDir,
  };

  let units;
  try {
    units = loadUnits(paths.unitsFile);
  } catch (e) {
    report.error = e.message;
    return report;
  }

  const kitMappings = loadKitMappings(paths.kitMappingsFile);
  fs.mkdirSync(paths.outDir, { recursive: true });

  report.unitsProcessed = units.length;

  for (const unit of units) {
    const unitId = (unit.id && String(unit.id).trim()) || "";
    if (!unitId) continue;

    const fileBase = unitId.toLowerCase().replace(/\s+/g, "_");
    const jpgPath = path.join(paths.outDir, fileBase + ".jpg");

    if (fs.existsSync(jpgPath) && isValidImageFile(jpgPath)) {
      report.skipped++;
      continue;
    }

    const kitSlug = kitMappings[unit.id];
    if (!kitSlug || typeof kitSlug !== "string") {
      report.failed++;
      report.failedUnits.push(unit.name || unitId + " (no kit mapping)");
      continue;
    }

    const imageUrl = imageUrlForSlug(kitSlug);

    try {
      await downloadImage(imageUrl, jpgPath);
      if (isValidImageFile(jpgPath)) {
        report.downloaded++;
      } else {
        try {
          fs.unlinkSync(jpgPath);
        } catch (_) {}
        report.failed++;
        report.failedUnits.push(unit.name || unitId + " (invalid size)");
      }
    } catch (e) {
      report.failed++;
      const msg = e.message || "download failed";
      report.failedUnits.push(unit.name || unitId + " (" + msg + ")");
      if (fs.existsSync(jpgPath)) {
        try {
          fs.unlinkSync(jpgPath);
        } catch (_) {}
      }
    }
  }

  return report;
}

function main() {
  const factionArg = process.argv[2];
  if (!factionArg) {
    console.error("Usage: node scripts/download-faction-images.js <faction>");
    process.exit(1);
  }

  (async () => {
    const report = await downloadFactionImages(factionArg);
    if (report.error) {
      console.error("Error:", report.error);
      process.exit(1);
    }
    console.log("Faction:", report.factionName);
    console.log("Units processed:", report.unitsProcessed);
    console.log("Downloaded:", report.downloaded);
    console.log("Skipped:", report.skipped);
    console.log("Failed:", report.failed);
    if (report.failedUnits.length > 0) {
      report.failedUnits.forEach((n) => console.log("FAILED:", n));
    }
  })();
}

if (require.main === module) {
  main();
} else {
  module.exports = { downloadFactionImages };
}
