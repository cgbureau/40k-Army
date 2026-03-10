import * as fs from 'fs';
import * as path from 'path';

const PRICES_DIR = path.resolve(process.cwd(), 'data', 'prices');
const GLOBAL_TIER_SHEET = path.join(PRICES_DIR, 'global_tier_sheet.csv');
const KITS_DIR = path.resolve(process.cwd(), 'data', 'kits');

interface TierEntry {
  USD: number | null;
  EUR: number | null;
  AUD: number | null;
  CAD: number | null;
}

interface KitDefinition {
  models?: number;
  price?: number;
  price_gbp?: number;
  prices?: {
    GBP?: number;
    USD?: number;
    EUR?: number;
    AUD?: number;
    CAD?: number;
    [key: string]: any;
  };
  // any other fields are preserved
  [key: string]: any;
}

function parseCsvLine(line: string): string[] {
  // Simple CSV splitter assuming no embedded commas/quotes
  return line.split(',').map((cell) => cell.trim());
}

function loadTierMap(): Map<number, TierEntry> {
  if (!fs.existsSync(GLOBAL_TIER_SHEET)) {
    console.error(`Global tier sheet not found: ${GLOBAL_TIER_SHEET}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(GLOBAL_TIER_SHEET, 'utf8');
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    console.error('Global tier sheet is empty.');
    process.exit(1);
  }

  const header = parseCsvLine(lines[0]);
  const gbpIndex = header.indexOf('gbp_tier');
  const usdIndex = header.indexOf('usd');
  const eurIndex = header.indexOf('eur');
  const audIndex = header.indexOf('aud');
  const cadIndex = header.indexOf('cad');

  if (gbpIndex === -1) {
    console.error('gbp_tier column not found in global_tier_sheet.csv');
    process.exit(1);
  }

  const map = new Map<number, TierEntry>();

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length <= gbpIndex) continue;

    const gbpStr = cols[gbpIndex];
    if (!gbpStr) continue;

    const gbpVal = parseFloat(gbpStr);
    if (Number.isNaN(gbpVal)) continue;

    const getNumberOrNull = (idx: number): number | null => {
      if (idx < 0 || idx >= cols.length) return null;
      const v = cols[idx];
      if (!v) return null;
      const num = parseFloat(v);
      return Number.isNaN(num) ? null : num;
    };

    const entry: TierEntry = {
      USD: getNumberOrNull(usdIndex),
      EUR: getNumberOrNull(eurIndex),
      AUD: getNumberOrNull(audIndex),
      CAD: getNumberOrNull(cadIndex),
    };

    map.set(gbpVal, entry);
  }

  if (map.size === 0) {
    console.error('No valid GBP tiers found in global_tier_sheet.csv');
    process.exit(1);
  }

  return map;
}

function findTierForPrice(tiers: Map<number, TierEntry>, gbp: number): TierEntry | null {
  // Direct lookup first
  if (tiers.has(gbp)) {
    return tiers.get(gbp)!;
  }

  // Fallback with small epsilon for floating-point differences
  const EPS = 1e-6;
  for (const [tierValue, entry] of tiers.entries()) {
    if (Math.abs(tierValue - gbp) < EPS) {
      return entry;
    }
  }

  return null;
}

async function injectGlobalPrices() {
  const tierMap = loadTierMap();

  if (!fs.existsSync(KITS_DIR)) {
    console.error(`Kits directory not found: ${KITS_DIR}`);
    process.exit(1);
  }

  const kitFiles = fs.readdirSync(KITS_DIR).filter((f) => f.endsWith('.json'));

  let updatedKits = 0;
  const missingTiers: { file: string; kitSlug: string; gbp: number | null }[] = [];

  for (const file of kitFiles) {
    const fullPath = path.join(KITS_DIR, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const data: Record<string, KitDefinition> = JSON.parse(raw);

    let fileChanged = false;

    for (const [kitSlug, kitDef] of Object.entries(data)) {
      // Determine current GBP price from various possible fields
      let gbp: number | null = null;

      if (kitDef.prices && typeof kitDef.prices.GBP === 'number') {
        gbp = kitDef.prices.GBP;
      } else if (typeof kitDef.price === 'number') {
        gbp = kitDef.price;
      } else if (typeof kitDef.price_gbp === 'number') {
        gbp = kitDef.price_gbp;
      }

      if (gbp === null) {
        // no GBP price to map; treat as missing tier
        missingTiers.push({ file, kitSlug, gbp: null });
        continue;
      }

      const tier = findTierForPrice(tierMap, gbp);
      if (!tier) {
        missingTiers.push({ file, kitSlug, gbp });
        continue;
      }

      const newPrices: Record<string, number> = {
        GBP: gbp,
      };

      if (tier.USD !== null) newPrices.USD = tier.USD;
      if (tier.EUR !== null) newPrices.EUR = tier.EUR;
      if (tier.AUD !== null) newPrices.AUD = tier.AUD;
      if (tier.CAD !== null) newPrices.CAD = tier.CAD;

      // Remove legacy price fields and assign new prices object
      delete kitDef.price;
      delete kitDef.price_gbp;
      kitDef.prices = newPrices;

      fileChanged = true;
      updatedKits++;
    }

    if (fileChanged) {
      fs.writeFileSync(fullPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    }
  }

  if (missingTiers.length > 0) {
    console.error('Missing GBP tiers for some kits:');
    for (const m of missingTiers) {
      console.error(
        `  File: ${m.file}, Kit: ${m.kitSlug}, GBP: ${m.gbp === null ? 'null' : m.gbp}`
      );
    }
    throw new Error('Some kits have GBP prices that do not match any tier.');
  }

  console.log(`Updated ${updatedKits} kits with global pricing`);
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith('inject-global-prices.ts') ||
    process.argv[1].endsWith('inject-global-prices.js'));

if (isMain || typeof require === 'undefined' || (require as any).main === module) {
  injectGlobalPrices().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

