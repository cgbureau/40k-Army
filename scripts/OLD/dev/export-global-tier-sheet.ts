import * as fs from 'fs';
import * as path from 'path';

const PRICES_DIR = path.resolve(process.cwd(), 'data', 'prices');
const TIERS_FILE = path.join(PRICES_DIR, 'price_tiers_gbp.json');
const KITS_SHEET_FILE = path.join(PRICES_DIR, 'kit_prices_sheet.csv');
const OUTPUT_FILE = path.join(PRICES_DIR, 'global_tier_sheet.csv');
const KITS_DIR = path.resolve(process.cwd(), 'data', 'kits');

interface PriceTiers {
  tiers: number[];
}

interface KitRow {
  faction: string;
  kit_slug: string;
  price_gbp: number | null;
}

interface ExistingTierRow {
  usd: string;
  eur: string;
  aud: string;
  cad: string;
}

function parseCsvLine(line: string): string[] {
  // Simple CSV splitter assuming no embedded commas/quotes
  return line.split(',').map((cell) => cell.trim());
}

function loadTiers(): number[] {
  if (!fs.existsSync(TIERS_FILE)) {
    console.error(`Tiers file not found: ${TIERS_FILE}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(TIERS_FILE, 'utf8');
  const data: PriceTiers = JSON.parse(raw);
  return Array.isArray(data.tiers) ? data.tiers.slice() : [];
}

function loadKitRows(): KitRow[] {
  if (!fs.existsSync(KITS_SHEET_FILE)) {
    console.error(`Kit prices sheet not found: ${KITS_SHEET_FILE}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(KITS_SHEET_FILE, 'utf8');
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return [];

  const header = parseCsvLine(lines[0]);
  const factionIndex = header.indexOf('faction');
  const kitIndex = header.indexOf('kit_slug');
  const priceIndex = header.indexOf('price_gbp');

  if (factionIndex === -1 || kitIndex === -1 || priceIndex === -1) {
    console.error('Expected columns faction, kit_slug, price_gbp not found in kit_prices_sheet.csv');
    process.exit(1);
  }

  const rows: KitRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length <= Math.max(factionIndex, kitIndex, priceIndex)) continue;

    const faction = cols[factionIndex];
    const kit_slug = cols[kitIndex];
    const priceStr = cols[priceIndex];
    const price = priceStr ? parseFloat(priceStr) : NaN;

    rows.push({
      faction,
      kit_slug,
      price_gbp: Number.isNaN(price) ? null : price,
    });
  }

  return rows;
}

function loadExistingTierCurrencies(): Map<number, ExistingTierRow> {
  const map = new Map<number, ExistingTierRow>();

  if (!fs.existsSync(OUTPUT_FILE)) {
    return map;
  }

  const raw = fs.readFileSync(OUTPUT_FILE, 'utf8');
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return map;
  }

  const header = parseCsvLine(lines[0]);
  const gbpIndex = header.indexOf('gbp_tier');
  const usdIndex = header.indexOf('usd');
  const eurIndex = header.indexOf('eur');
  const audIndex = header.indexOf('aud');
  const cadIndex = header.indexOf('cad');

  if (gbpIndex === -1) {
    return map;
  }

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length <= gbpIndex) continue;

    const gbpStr = cols[gbpIndex];
    if (!gbpStr) continue;

    const gbpVal = parseFloat(gbpStr);
    if (Number.isNaN(gbpVal)) continue;

    const getCell = (idx: number): string =>
      idx >= 0 && idx < cols.length ? cols[idx] : '';

    map.set(gbpVal, {
      usd: getCell(usdIndex),
      eur: getCell(eurIndex),
      aud: getCell(audIndex),
      cad: getCell(cadIndex),
    });
  }

  return map;
}

async function exportGlobalTierSheet() {
  const tiersFromJson = loadTiers();

  // Collect all GBP prices actually used in kit definitions
  const gbpFromKits = new Set<number>();
  const kitExamplesFromDefs: KitRow[] = [];
  if (fs.existsSync(KITS_DIR)) {
    const kitFiles = fs.readdirSync(KITS_DIR).filter((f) => f.endsWith('.json'));
    for (const file of kitFiles) {
      const fullPath = path.join(KITS_DIR, file);
      const raw = fs.readFileSync(fullPath, 'utf8');
      const data: Record<string, any> = JSON.parse(raw);

      const faction = path.basename(file, '.json');

      for (const [kitSlug, kitDef] of Object.entries<any>(data)) {
        let gbp: number | null = null;

        if (kitDef.prices && typeof kitDef.prices.GBP === 'number') {
          gbp = kitDef.prices.GBP;
        } else if (typeof kitDef.price === 'number') {
          gbp = kitDef.price;
        } else if (typeof kitDef.price_gbp === 'number') {
          gbp = kitDef.price_gbp;
        }

        if (gbp !== null) {
          gbpFromKits.add(gbp);
          kitExamplesFromDefs.push({
            faction,
            kit_slug: kitSlug,
            price_gbp: gbp,
          });
        }
      }
    }
  }

  // Merge tiers from JSON and from kits
  const mergedTierSet = new Set<number>(tiersFromJson);
  for (const v of gbpFromKits) {
    mergedTierSet.add(v);
  }

  const tiers = Array.from(mergedTierSet).sort((a, b) => a - b);
  const kitRows = loadKitRows();
  const existingCurrencies = loadExistingTierCurrencies();

  if (!fs.existsSync(PRICES_DIR)) {
    fs.mkdirSync(PRICES_DIR, { recursive: true });
  }

  const header =
    'gbp_tier,usd,eur,aud,cad,example_faction,example_kit_slug';
  const rows: string[] = [header];

  let count = 0;

  for (const tier of tiers) {
    // Find first kit row whose price_gbp matches this tier
    let match = kitRows.find(
      (row) => row.price_gbp !== null && row.price_gbp === tier
    );

    // If not found in kit price sheet, fall back to direct kit definitions
    if (!match) {
      match = kitExamplesFromDefs.find(
        (row) => row.price_gbp !== null && row.price_gbp === tier
      );
    }

    const exampleFaction = match ? match.faction : '';
    const exampleKitSlug = match ? match.kit_slug : '';

    const existing = existingCurrencies.get(tier);

    // Ensure exactly 7 columns: gbp_tier,usd,eur,aud,cad,example_faction,example_kit_slug
    const cols = [
      tier.toString(),
      existing ? existing.usd : '',
      existing ? existing.eur : '',
      existing ? existing.aud : '',
      existing ? existing.cad : '',
      exampleFaction,
      exampleKitSlug,
    ];

    rows.push(cols.join(','));
    count++;
  }

  fs.writeFileSync(OUTPUT_FILE, rows.join('\n'), 'utf8');
  console.log(
    `Exported ${count} GBP tiers to data/prices/global_tier_sheet.csv`
  );
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith('export-global-tier-sheet.ts') ||
    process.argv[1].endsWith('export-global-tier-sheet.js'));

if (isMain || typeof require === 'undefined' || (require as any).main === module) {
  exportGlobalTierSheet().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

