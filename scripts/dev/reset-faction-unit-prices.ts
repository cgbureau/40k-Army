import fs from "fs";
import path from "path";

type Unit = {
  id: string;
  name: string;
  points: number;
  models_per_box?: number | null;
  box_price?: number | null;
  prices?: unknown;
  availability?: "retail" | "legends" | "forgeworld";
  // allow any additional fields without caring about their types
  [key: string]: unknown;
};

type FactionUnitsFile = {
  faction: string;
  units: Unit[];
};

const ROOT_DIR = path.join(__dirname, "..", "..");
const FACTIONS_DIR = path.join(ROOT_DIR, "data", "factions");

function resetUnitPricingInFile(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf8");
  let parsed: FactionUnitsFile;

  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to parse JSON for ${filePath}:`, err);
    return;
  }

  if (!Array.isArray(parsed.units)) {
    console.warn(`No units array found in ${filePath}, skipping.`);
    return;
  }

  const cleanedUnits = parsed.units.map((unit) => ({
    ...unit,
    models_per_box: null,
    box_price: null,
    prices: null,
  }));

  const cleaned: FactionUnitsFile = {
    ...parsed,
    units: cleanedUnits,
  };

  fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2) + "\n", "utf8");
  console.log(`Reset pricing fields in ${filePath}`);
}

function main() {
  if (!fs.existsSync(FACTIONS_DIR)) {
    console.error(`Factions directory not found at ${FACTIONS_DIR}`);
    process.exit(1);
  }

  const factionDirs = fs.readdirSync(FACTIONS_DIR, { withFileTypes: true });

  for (const entry of factionDirs) {
    if (!entry.isDirectory()) continue;

    const factionPath = path.join(FACTIONS_DIR, entry.name);
    const unitsFile = path.join(factionPath, "units.json");

    if (!fs.existsSync(unitsFile)) {
      continue;
    }

    resetUnitPricingInFile(unitsFile);
  }

  console.log("Completed resetting pricing fields for all faction units.");
}

if (require.main === module) {
  main();
}

