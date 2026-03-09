# PRICE PIPELINE V2

The pricing system populates regional RRP for every kit in the dataset.

Total kits: ~359


## Regions Supported

- United Kingdom (GBP)
- United States (USD)
- Europe (EUR)
- Australia (AUD)
- Canada (CAD)


## Source

All prices are sourced from the official Games Workshop web store:

https://www.warhammer.com


## Scraping Strategy

Instead of scraping each product individually, the scraper processes catalogue pages per region.

Example:

/en-GB/shop
/en-US/shop
/en-AU/shop

Catalogue pages return structured product data containing:

- product name
- price
- currency


## Matching

Scraped product names are matched to kit slugs.

Example:

"Terminator Squad" → terminators


## Validation

Scripts verify:

- all kits have prices for every region
- no negative values
- no impossible currency conversions


## Final Dataset

data/kits/*.json

Each kit contains:

models  
prices { GBP, USD, EUR, AUD, CAD }