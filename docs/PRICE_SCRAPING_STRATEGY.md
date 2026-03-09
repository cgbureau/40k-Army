# PRICE SCRAPING STRATEGY

This document defines how retail price data should be collected for the 40KArmy calculator.

The goal is to maintain accurate global MSRP pricing for Warhammer products.

---

# Objective

The calculator must support accurate retail price estimation for all purchasable units.

This requires price data for all retail kits used in the kit dataset.

Prices must be collected for the following regions:

- GBP (United Kingdom)
- USD (United States)
- EUR (Europe)
- AUD (Australia)
- CAD (Canada)

These represent the primary Warhammer markets.

---

# Source of Truth

Prices must come from the **official Games Workshop store** whenever possible.

Example product page:

https://www.warhammer.com/en-GB/shop/rubric-marines

Regional price pages exist for each market.

Examples:

UK  
https://www.warhammer.com/en-GB/

US  
https://www.warhammer.com/en-US/

EU  
https://www.warhammer.com/en-EU/

AU  
https://www.warhammer.com/en-AU/

CA  
https://www.warhammer.com/en-CA/

These pages provide official MSRP pricing.

Retailers should not be used as the primary source because they often include discounts.

---

# Scraping Scope

The price scraper must operate at the **retail kit level**, not the unit level.

Important distinction:

1577 units exist in the rules dataset.

However these map to approximately **300–400 retail kits**.

Therefore the scraper should only collect prices for kits.

This greatly reduces complexity.

---

# Data Required Per Kit

Each kit entry should eventually contain:

- product name
- models per box
- purchasability state
- regional prices
- optional product URL

Example:


"rubric-marines": {
"name": "Rubric Marines",
"models": 10,
"purchasable": true,
"prices": {
"GBP": 42.5,
"USD": 60,
"EUR": 50,
"AUD": 98,
"CAD": 75
},
"url": "https://www.warhammer.com/en-GB/shop/rubric-marines
"
}


---

# Handling Missing Products

Some kits may not currently appear on the Games Workshop store.

Possible reasons include:

- discontinued products
- temporarily unavailable stock
- replaced kits
- legacy rules entries

When this occurs the dataset should mark the kit as:


purchasable: false


The calculator should display this clearly instead of showing a price.

---

# Scraping Considerations

The scraper should be designed to:

- fetch product pages
- extract regional price values
- update the kit dataset
- preserve existing kit mappings

The scraper should never modify:

- unit data
- faction datasets
- mapping files

It should only update the **retail kit price layer**.

---

# Update Strategy

Price scraping should be repeatable.

The script should allow:

- periodic price refresh
- regional price updates
- easy expansion to new regions

This ensures the calculator can remain accurate as Games Workshop updates pricing globally.

---

# Future Improvements

Possible later improvements include:

- bundle box detection
- combat patrol box pricing
- army set pricing
- third-party retailer discount estimates

However the base system should always rely on **official MSRP pricing**.

---

# Summary

The pricing system should follow these principles:

1. Price scraping occurs only at the retail kit level.
2. Units never contain price data.
3. Official Games Workshop pricing is the primary source.
4. Regional MSRP should be supported globally.
5. Missing products must be marked as not purchasable.

Maintaining these rules ensures that the calculator remains accurate and scalable as the dataset grows.