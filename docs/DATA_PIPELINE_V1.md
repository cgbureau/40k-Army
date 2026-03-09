# 40KArmy — Data Pipeline (V1)

## Overview

The 40KArmy application uses a **static JSON dataset pipeline** to provide faction and unit data.

The goal is:

- predictable data structure
- easy maintenance
- minimal runtime processing
- fast client loading

All data is stored inside the repository.


---

# Data Architecture

The pipeline uses **three layers of data**.

1. Master unit dataset
2. Kit mapping layer
3. Kit definition layer


---

# Layer 1 — Master Unit Dataset

File:


army-data-no-legends.json


This file contains:

- all units
- faction assignment
- base point values

Purpose:

Provide a single **canonical unit list**.

Example structure:


{
"id": "intercessor",
"name": "Intercessor Squad",
"points": 95,
"faction": "space-marines"
}



---

# Layer 2 — Unit → Kit Mapping

Directory:


data/kit-mappings/{faction}.json


This layer maps units to their retail kits.

Example:


{
"intercessor": "space-marine-intercessors"
}


Purpose:

Separate gameplay units from retail products.


---

# Layer 3 — Kit Definitions

Directory:


data/kits/{faction}.json


This file defines:

- models per box
- price
- regional prices

Example:


{
"slug": "space-marine-intercessors",
"models": 10,
"prices": {
"GBP": 37.50,
"USD": 60,
"EUR": 50
}
}


Purpose:

Store **real-world product data**.


---

# Final Generated Dataset

Scripts combine the above layers into the runtime dataset:


data/factions/{faction}/units.json


This is the dataset consumed by the frontend.

Example:


{
"id": "intercessor",
"name": "Intercessor Squad",
"points": 95,
"models_per_box": 10,
"box_price": 37.50,
"prices": {
"GBP": 37.50,
"USD": 60,
"EUR": 50
}
}



---

# Runtime Data Loading

Frontend requests data via API routes:


/api/factions
/api/factions/{faction}/units


These endpoints return the compiled dataset.


---

# Frontend Consumption

The application loads:


units.json


Each unit object contains:


id
name
points
models_per_box
box_price
prices
is_legends


This allows the UI to calculate:

- total points
- boxes required
- estimated cost


---

# Box Calculation Logic

Boxes required is calculated as:


boxes_required = ceil(unit_quantity / models_per_box)


Cost is then:


boxes_required × box_price



---

# Currency Handling

The dataset may include regional pricing:


prices {
GBP
USD
EUR
}


If a regional price is missing, the system falls back to the base price.


---

# Known Data Challenges

Several complexities exist in the Warhammer ecosystem:

• units with multiple kit options  
• kits that build multiple unit types  
• partial box usage  
• faction-specific kit reuse  


These require manual mapping.


---

# Data Sources

Current sources include:

- community datasets
- manual extraction
- Games Workshop store pricing

Future improvements may include:

• Wahapedia integration  
• automated price updates  
• improved kit mappings  


---

# Pipeline Goals (V2)

The V2 pipeline will aim to achieve:

1. Full faction coverage
2. Verified point values
3. Accurate box-to-unit mapping
4. Reliable regional price data


---

# Pipeline Philosophy

The pipeline prioritises:

- clarity over automation
- predictable structures
- easy editing by maintainers

This keeps the dataset maintainable as Warhammer releases new models.

---

# Post-Launch Status Update — Units, Points, and Pricing

## Current Status

The project now has a rebuilt unit dataset sourced from Wahapedia.

Current state:

- 1,577 units loaded
- ~98% points coverage
- units and points are now considered the stable backbone of the application

This means the next major phase is no longer unit discovery, but **price data completion and accuracy**.

---

## Pricing Phase Goal

The next development phase is to make 40KArmy the most accurate source for Warhammer army cost estimation.

This requires:

1. Price data for **all purchasable units**
2. Correct representation of units that come from the same retail kit / box
3. Clear handling of units that are not currently purchasable
4. Regional MSRP support for:
   - GBP
   - USD
   - EUR
   - AUD
   - CAD

---

## Important Pricing Principle

Prices must not live at the raw unit level.

Prices belong to **retail kits / products**.

The correct architecture remains:

units
→ kit mappings
→ kits
→ prices

This is essential because:

- multiple units may map to the same kit
- a single kit may build multiple unit variants
- some units are not currently sold individually
- box size and purchasability matter just as much as price

---

## Purchasability Rules

The app must support the idea that some units may not currently be purchasable.

Examples:

- out of production
- not currently sold separately
- Forge World / specialist stock issues
- legacy / unusual entries that remain in rules data

These should not be given fake prices.

Instead, the pricing layer should support a state such as:

- purchasable: true / false

And the UI should clearly show when a unit cannot currently be bought.

---

## Box / Kit Representation

Some units are bought through standard boxes, while others may come through:

- shared kits
- alternate build kits
- character boxes
- bundle / boxed sets

The system must represent retail reality, not just game datasheets.

This means the pricing phase must improve the mapping between:

- unit
- retail kit
- models per box
- purchasability
- regional price

---

## Next Pricing Objective

The next objective is to upgrade the pricing layer so that all kit data can support:

- models per box
- purchasable state
- regional prices
- product identity

This will allow the calculator to become the go-to reference for:

- all units
- all points
- all practical retail cost data


---

# V2 DATA PIPELINE (UNIT → KIT → PRICE)

The cost calculation system uses a 3-layer data pipeline.

Layer 1 — Master Unit Dataset  
`army-data-no-legends.json`

Source: Wahapedia scrape.  
Contains all valid datasheets and points values.

Total units extracted: ~1577  
Purchasable units mapped to kits: 613


Layer 2 — Unit → Kit Mapping  
`data/kit-mappings/*.json`

Each faction contains a mapping of:

unit_slug → kit_slug

Example:

terminator_squad → terminators  
terminator_assault_squad → terminators  
deathwing_terminators → terminators

Multiple units may map to the same kit if they share a retail product.


Layer 3 — Kit Definitions  
`data/kits/*.json`

Each kit contains:

- number of models
- regional retail prices

Example structure:

terminators:
  models: 5
  prices:
    GBP: 42.50
    USD: 60
    EUR: 50
    AUD: 95
    CAD: 80


Validation

Kit mappings are validated using:

npm run validate:mappings

This ensures every unit mapping references a valid kit definition.

Current status:

613 mappings validated  
0 invalid references