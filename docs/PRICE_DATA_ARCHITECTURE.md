# PRICE DATA ARCHITECTURE

This document defines how pricing data works in the 40KArmy calculator.

It exists to prevent future development from mixing price data with unit data or breaking the retail mapping system.

---

# Core Principle

Prices do NOT belong to units.

Prices belong to **retail kits (products)**.

Units are gameplay concepts.  
Kits are physical products sold by Games Workshop.

The correct data pipeline is:

units
→ kit mappings
→ retail kits
→ price data

---

# Why Pricing Must Live at Kit Level

Many Warhammer units share the same retail kit.

Examples:

- Deathmarks and Immortals come from the same kit
- Breachers and Strike Teams come from the same box
- Some characters are built from multi-character kits
- Some kits build multiple variants of a unit

If pricing lived at the unit level:

- prices would be duplicated
- updates would break consistency
- bundle / variant logic would be impossible

Therefore **kits are the only place price data should exist.**

---

# Retail Kit Data Structure

Each kit entry should represent a real retail product.

Example structure:


kit_slug
name
models
purchasable
prices
url


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

# Required Price Regions

The calculator must support MSRP pricing for:

- GBP (United Kingdom)
- USD (United States)
- EUR (Europe)
- AUD (Australia)
- CAD (Canada)

These regions represent the largest Warhammer markets.

Prices must come from the official Games Workshop store whenever possible.

---

# Handling Units That Are Not Purchasable

Some units may exist in the rules but cannot currently be purchased.

Examples:

- discontinued models
- legacy units
- units that only appear in bundle boxes
- temporarily unavailable products

These kits must be marked with:


purchasable: false


When this occurs:

- the calculator should not attempt to show a price
- the UI should show something like "Unavailable"

This preserves accuracy and avoids inventing fake prices.

---

# Relationship Between Units and Kits

Units map to kits through the kit-mapping layer.

Example:


rubric_marines → rubric-marines


The calculator then uses:


required models
÷ models per box
= boxes required

boxes required × price
= estimated cost


---

# Box Logic

A kit may contain multiple models.

Example:


rubric-marines
models: 10


If a user selects:


rubric marines × 15


The calculator should compute:


15 ÷ 10 = 1.5 → 2 boxes


Then multiply by the kit price.

---

# Future Improvements

Possible future improvements to the pricing layer include:

- bundle boxes
- combat patrol discounts
- army set boxes
- third-party retailer discount estimates

However the base system should always rely on **official MSRP** as the canonical price.

---

# Summary

The pricing layer must always follow these rules:

1. Prices live on kits, never units.
2. Units map to kits through kit mappings.
3. Kits define models per box.
4. Kits define regional prices.
5. Kits define purchasability.
6. Prices should reflect official Games Workshop MSRP.

Maintaining this structure ensures the calculator remains accurate and scalable as the dataset grows.