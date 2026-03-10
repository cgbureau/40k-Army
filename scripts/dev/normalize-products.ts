import * as fs from 'fs';
import * as path from 'path';

const PRICES_DIR = path.resolve(process.cwd(), 'data', 'prices');
const INPUT_FILE = path.join(PRICES_DIR, 'element_products.json');
const OUTPUT_FILE = path.join(PRICES_DIR, 'element_products_filtered.json');

interface ElementProduct {
  name: string;
  rrp_gbp: number;
}

const FILTER_KEYWORDS = [
  'battletome',
  'roleplay',
  'rpg',
  'novel',
  'book',
  'dice',
  'paint',
  'brush',
  'card',
  'magazine',
  'collector',
  'limited',
  'soundtrack',
  'apparel'
];

async function normalizeProducts() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`Input file not found: ${INPUT_FILE}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(INPUT_FILE, 'utf-8');
  const products: ElementProduct[] = JSON.parse(rawData);

  console.log(`Starting product normalization...`);
  
  const filteredProducts: ElementProduct[] = [];
  let removedCount = 0;

  for (const product of products) {
    const lowerName = product.name.toLowerCase();
    
    let shouldRemove = false;
    for (const keyword of FILTER_KEYWORDS) {
      if (lowerName.includes(keyword)) {
        shouldRemove = true;
        break;
      }
    }

    if (shouldRemove) {
      removedCount++;
    } else {
      filteredProducts.push(product);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(filteredProducts, null, 2), 'utf-8');

  console.log(`--------------------------------`);
  console.log(`NORMALIZATION RESULTS`);
  console.log(`--------------------------------`);
  console.log(`Total products: ${products.length}`);
  console.log(`Removed products: ${removedCount}`);
  console.log(`Filtered products remaining: ${filteredProducts.length}`);
  console.log(`--------------------------------`);
  console.log(`Saved to: ${OUTPUT_FILE}`);
}

const isMain = process.argv[1] && process.argv[1].endsWith('normalize-products.ts');
if (isMain || typeof require === 'undefined' || require.main === module) {
  normalizeProducts().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
