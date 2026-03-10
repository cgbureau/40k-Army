import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

const TEST_MODE = true;

const DATA_DIR = path.resolve(process.cwd(), 'data', 'prices');
const OUTPUT_FILE = path.join(DATA_DIR, 'element_products.json');

interface ElementProduct {
  name: string;
  rrp_gbp: number;
}

async function scrapeElementRRP() {
  let page = 1;
  let hasMore = true;
  const productsMap = new Map<string, ElementProduct>();

  console.log(`\nStarting Element Games RRP Scrape...`);

  while (hasMore) {
    const url = `https://elementgames.co.uk/search?q=warhammer&page=${page}`;
    console.log(`Fetching page ${page}: ${url}`);

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!res.ok) {
        console.warn(`Failed to fetch ${url} - Status: ${res.status}`);
        break;
      }

      const html = await res.text();
      const $ = cheerio.load(html);

      // We need to inspect the actual DOM for element games
      // Let's guess some common product card selectors:
      const productElements = $('.productgrid');
      
      if (productElements.length === 0) {
        hasMore = false;
        console.log(`No more products found on page ${page}. Ending pagination.`);
        break;
      }

      let newProductsCount = 0;

      productElements.each((_, el) => {
        const name = $(el).find('.producttitle').text().trim();
        const oldPriceText = $(el).find('.oldprice').text().trim();
        
        const rrpMatch = oldPriceText.match(/£([\d.]+)/i);
        
        if (name && rrpMatch) {
          const rrpValue = parseFloat(rrpMatch[1]);
          
          if (rrpValue > 0) {
            if (!productsMap.has(name)) {
              productsMap.set(name, {
                name: name,
                rrp_gbp: rrpValue
              });
              newProductsCount++;
            }
          }
        }
      });

      console.log(`Found ${newProductsCount} new products on page ${page}. Total so far: ${productsMap.size}`);

      if (newProductsCount === 0 && page > 1) {
        // If no new products, we might be hitting a duplicate page
        hasMore = false;
        break;
      }

      if (TEST_MODE) {
        hasMore = false;
        break;
      }

      page++;

      // Small throttle
      await new Promise(r => setTimeout(r, 1000));

    } catch (err) {
      console.error(`Error scraping ${url}:`, err);
      break;
    }
  }

  const collectedProducts = Array.from(productsMap.values());
  
  console.log(`Finished scraping Element Games. Total products captured: ${collectedProducts.length}`);
  
  if (TEST_MODE) {
    console.log('First 5 products:');
    console.log(collectedProducts.slice(0, 5));
  }

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(collectedProducts, null, 2), 'utf-8');
  console.log(`File written: ${OUTPUT_FILE}`);
}

async function main() {
  console.log("TEST MODE:", TEST_MODE);
  await scrapeElementRRP();
}

const isMain = process.argv[1] && process.argv[1].endsWith('scrape-element-rrp.ts');
if (isMain || typeof require === 'undefined' || require.main === module) {
  main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
