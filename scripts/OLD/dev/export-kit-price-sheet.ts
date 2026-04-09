import * as fs from 'fs';
import * as path from 'path';

const KITS_DIR = path.resolve(process.cwd(), 'data', 'kits');
const PRICES_DIR = path.resolve(process.cwd(), 'data', 'prices');
const OUTPUT_FILE = path.join(PRICES_DIR, 'kit_prices_sheet.csv');

interface KitDefinition {
  models?: number;
  // other fields (like prices) are ignored for this export
  [key: string]: any;
}

async function exportKitPriceSheet() {
  if (!fs.existsSync(KITS_DIR)) {
    console.error(`Kits directory not found: ${KITS_DIR}`);
    process.exit(1);
  }

  if (!fs.existsSync(PRICES_DIR)) {
    fs.mkdirSync(PRICES_DIR, { recursive: true });
  }

  const kitFiles = fs.readdirSync(KITS_DIR).filter((f) => f.endsWith('.json'));

  const rows: string[] = [];
  rows.push('faction,kit_slug,models,price_gbp');

  let kitCount = 0;

  for (const file of kitFiles) {
    const faction = path.basename(file, '.json');
    const fullPath = path.join(KITS_DIR, file);

    const raw = fs.readFileSync(fullPath, 'utf8');
    const data: Record<string, KitDefinition> = JSON.parse(raw);

    for (const [kitSlug, kitDef] of Object.entries(data)) {
      const models = kitDef.models ?? '';
      // price_gbp intentionally left empty for manual filling
      rows.push(`${faction},${kitSlug},${models},`);
      kitCount++;
    }
  }

  fs.writeFileSync(OUTPUT_FILE, rows.join('\n'), 'utf8');
  console.log(`Exported ${kitCount} kits to data/prices/kit_prices_sheet.csv`);
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith('export-kit-price-sheet.ts') ||
    process.argv[1].endsWith('export-kit-price-sheet.js'));

if (isMain || typeof require === 'undefined' || (require as any).main === module) {
  exportKitPriceSheet().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

