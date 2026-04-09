import * as fs from 'fs';
import * as path from 'path';

const PRICES_DIR = path.resolve(process.cwd(), 'data', 'prices');
const INPUT_CSV = path.join(PRICES_DIR, 'kit_prices_sheet.csv');
const OUTPUT_JSON = path.join(PRICES_DIR, 'price_tiers_gbp.json');

interface PriceTiers {
  tiers: number[];
}

function parseCsvLine(line: string): string[] {
  // Simple CSV splitter (no quoted commas expected for this sheet)
  return line.split(',').map((cell) => cell.trim());
}

async function extractPriceTiers() {
  if (!fs.existsSync(INPUT_CSV)) {
    console.error(`Input CSV not found: ${INPUT_CSV}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(INPUT_CSV, 'utf8');
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    console.log('CSV is empty, no tiers to extract.');
    return;
  }

  const header = parseCsvLine(lines[0]);
  const priceIndex = header.indexOf('price_gbp');

  if (priceIndex === -1) {
    console.error('price_gbp column not found in CSV header.');
    process.exit(1);
  }

  const tiersSet = new Set<number>();

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length <= priceIndex) continue;

    const priceStr = cols[priceIndex];
    if (!priceStr) continue;

    const value = parseFloat(priceStr);
    if (!Number.isNaN(value)) {
      tiersSet.add(value);
    }
  }

  const tiers = Array.from(tiersSet).sort((a, b) => a - b);

  const result: PriceTiers = { tiers };

  if (!fs.existsSync(PRICES_DIR)) {
    fs.mkdirSync(PRICES_DIR, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(result, null, 2), 'utf8');

  console.log('GBP Price Tiers:');
  console.log(tiers);
  console.log(`Saved tiers to ${OUTPUT_JSON}`);
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith('extract-price-tiers.ts') ||
    process.argv[1].endsWith('extract-price-tiers.js'));

if (isMain || typeof require === 'undefined' || (require as any).main === module) {
  extractPriceTiers().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

