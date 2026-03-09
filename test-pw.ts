import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('catalog') || url.includes('products') || url.includes('search')) {
      if (res.request().resourceType() === 'fetch' || res.request().resourceType() === 'xhr') {
        try {
          const json = await res.json();
          console.log('Got JSON from', url);
          console.log(Object.keys(json));
          if (json.products || json.results || json.items) {
             const items = json.products || json.results || json.items;
             console.log('Items length:', items.length);
             if (items.length > 0) {
               console.log(items[0]);
             }
          }
        } catch (e) {}
      }
    }
  });
  
  await page.goto('https://www.warhammer.com/en-GB/shop?page=1');
  await page.waitForTimeout(5000);
  await browser.close();
}

main();
