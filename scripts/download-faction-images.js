#!/usr/bin/env node
/**
 * Image pipeline — download unit images for one faction.
 * Usage: node scripts/download-faction-images.js <faction>
 * Example: node scripts/download-faction-images.js orks
 *
 * Reads: data/factions/{faction}/units.json, kit-mappings/{faction}.json, kits/{faction}.json
 * Resolves unit id → kit slug → product page → primary image
 * Saves: public/unit-images/{faction}/{unit-id}.jpg
 *
 * Rules: lowercase filenames, skip if exists, validate file size, continue on errors.
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const UNIT_IMAGES_DIR = path.join(PUBLIC_DIR, "unit-images");

const FETCH_TIMEOUT_MS = 15000;
const USER_AGENT = "40KArmy-Image-Pipeline/1.0 (local build tool)";

function getPaths(faction) {
  const slug = String(faction).trim().toLowerCase();
  if (!slug) throw new Error("Faction argument required");
  return {
    slug,
    unitsFile: path.join(DATA_DIR, "factions", slug, "units.json"),
    kitMappingsFile: path.join(DATA_DIR, "kit-mappings", slug + ".json"),
    kitsFile: path.join(DATA_DIR, "kits", slug + ".json"),
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

function loadKits(kitsPath) {
  try {
    const raw = fs.readFileSync(kitsPath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

/**
 * Build a candidate product page URL from kit slug (e.g. ork-boyz → GW-style path).
 * Games Workshop URLs often look like /en-GB/Product-Name or /en-GB/Product-Name-2020
 */
function slugToProductPath(slug) {
  const part = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("-");
  return part;
}

/**
 * Fetch product page HTML and extract primary image URL (og:image or first product image).
 */
async function getImageUrlForKitSlug(kitSlug) {
  const pathSegment = slugToProductPath(kitSlug);
  const urlsToTry = [
    `https://www.games-workshop.com/en-GB/${pathSegment}`,
    `https://www.games-workshop.com/en-GB/${pathSegment}-2020`,
    `https://www.games-workshop.com/en-GB/${pathSegment}-2021`,
  ];

  for (const pageUrl of urlsToTry) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      const res = await fetch(pageUrl, {
        headers: { "User-Agent": USER_AGENT },
        signal: controller.signal,
        redirect: "follow",
      });
      clearTimeout(timeout);
      if (!res.ok) continue;
      const html = await res.text();
      const imgUrl = extractPrimaryImageUrl(html, pageUrl);
      if (imgUrl) return imgUrl;
    } catch (_) {
      // try next URL
    }
  }
  return null;
}

function extractPrimaryImageUrl(html, baseUrl) {
  const ogMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)
    || html.match(/<meta\s+content="([^"]+)"\s+property="og:image"/i);
  if (ogMatch && ogMatch[1]) {
    const url = ogMatch[1].trim();
    if (url.startsWith("http")) return url;
    try {
      const base = new URL(baseUrl);
      return new URL(url, base).href;
    } catch (_) {}
  }
  const imgMatch = html.match(/<img[^>]+src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))"[^>]*/i);
  if (imgMatch && imgMatch[1]) return imgMatch[1];
  return null;
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

async function downloadFactionImages(factionArg) {
  const paths = getPaths(factionArg);
  const report = {
    factionName: factionArg,
    unitsProcessed: 0,
    imagesDownloaded: 0,
    imagesSkipped: 0,
    imagesFailed: 0,
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
  loadKits(paths.kitsFile);

  fs.mkdirSync(paths.outDir, { recursive: true });

  report.unitsProcessed = units.length;

  for (const unit of units) {
    const unitId = (unit.id && String(unit.id).trim()) || "";
    if (!unitId) continue;

    const fileBase = unitId.toLowerCase().replace(/\s+/g, "_");
    const jpgPath = path.join(paths.outDir, fileBase + ".jpg");

    if (fs.existsSync(jpgPath)) {
      try {
        const stat = fs.statSync(jpgPath);
        if (stat.size > 0) {
          report.imagesSkipped++;
          continue;
        }
      } catch (_) {}
    }

    const kitSlug = kitMappings[unit.id];
    if (!kitSlug || typeof kitSlug !== "string") {
      report.imagesFailed++;
      report.failedUnits.push(unit.name || unitId + " (no kit mapping)");
      continue;
    }

    try {
      const imageUrl = await getImageUrlForKitSlug(kitSlug.trim());
      if (!imageUrl) {
        report.imagesFailed++;
        report.failedUnits.push(unit.name || unitId + " (no image URL)");
        continue;
      }

      await downloadImage(imageUrl, jpgPath);
      const stat = fs.statSync(jpgPath);
      if (stat.size > 0) {
        report.imagesDownloaded++;
      } else {
        fs.unlinkSync(jpgPath);
        report.imagesFailed++;
        report.failedUnits.push(unit.name || unitId + " (empty file)");
      }
    } catch (e) {
      report.imagesFailed++;
      report.failedUnits.push(unit.name || unitId + " (" + (e.message || "download failed") + ")");
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
    console.log(report.factionName);
    console.log("Units processed:   " + report.unitsProcessed);
    console.log("Images downloaded: " + report.imagesDownloaded);
    console.log("Images skipped:    " + report.imagesSkipped);
    console.log("Images failed:     " + report.imagesFailed);
    if (report.failedUnits.length > 0) {
      console.log("\nFailed units:");
      report.failedUnits.forEach((n) => console.log("  - " + n));
    }
    console.log("\nOutput folder: " + report.outDir);
  })();
}

if (require.main === module) {
  main();
} else {
  module.exports = { downloadFactionImages };
}
