# 40KArmy — Complete Data System (Authoritative Reference)

This document defines the **entire data architecture** for the 40KArmy application.

It replaces the following previous documents:

- DATA_PIPELINE.md
- PRICE_PIPELINE_V2.md
- DATA_STRUCTURE_REFERENCE.md

All future work on the data layer must follow the rules defined here.

This file is the **single source of truth for the 40KArmy data pipeline.**

---

# System Overview

The application calculates the real-world cost of Warhammer armies.

To achieve this, the system separates:

GAME DATA  
from  
RETAIL PRODUCT DATA

The architecture is intentionally strict.

Gameplay data and retail data must **never be mixed**.

---

# Core Architecture

The system uses a **3-layer data pipeline**.

```
Units
→ Kit Mapping
→ Retail Kits
→ Regional Prices
```

Each layer has a clear responsibility.

---

# Layer 1 — Master Unit Dataset

Source file:

```
army-data-no-legends.json
```

This dataset is sourced from **Wahapedia**.

It contains all gameplay units and points values.

Example:

```
{
"id": "intercessor_squad",
"name": "Intercessor Squad",
"points": 95,
"faction": "space-marines"
}
```

Important rules:

Units represent **game rules only**.

Units must NEVER contain:

- retail price
- models per box
- kit information

This layer defines the **game universe**, not the retail store.

---

# Layer 2 — Unit → Kit Mapping

Location:

```
data/kit-mappings/{faction}.json
```

This layer connects a gameplay unit to the retail kit that builds it.

Example:

```
"intercessor_squad": "space-marine-intercessors"
```

Important properties:

- many units may map to one kit
- one kit may build multiple units
- mappings contain **no pricing**
- mappings contain **no model counts**

Mappings exist because:

GAME DATA ≠ RETAIL PRODUCTS

---

# Layer 3 — Retail Kit Definitions

Location:

```
data/kits/{faction}.json
```

Retail kits represent real products sold by Games Workshop.

Example:

```
"space-marine-intercessors": {
  "name": "Space Marine Intercessors",
  "models": 10,
  "prices": {
    "GBP": 37.50,
    "USD": 60,
    "EUR": 50,
    "AUD": 95,
    "CAD": 80
  }
}
```

Fields:

name  
Human readable product name.

models  
Number of models included in the box.

prices  
Regional RRP values.

Important rules:

Prices **must only exist in the kit layer**.

---

# Regional Price System

Supported currencies:

- GBP
- USD
- EUR
- AUD
- CAD

Prices are stored directly inside each kit:

```
prices {
  GBP
  USD
  EUR
  AUD
  CAD
}
```

No currency conversion occurs in the frontend.

The UI selects the price directly:

```
unit.prices[currency]
```

Fallback currency:

```
GBP
```

---

# Final Runtime Dataset

The frontend consumes compiled faction datasets:

```
data/factions/{faction}/units.json
```

Example entry:

```
{
"id": "intercessor_squad",
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
```

These files are **derived datasets**, not source data.

---

# Runtime Enrichment Pipeline

The application enriches units at runtime.

Process:

```
unit.id
→ kit mapping lookup
→ kit lookup
→ attach kit data
```

Result:

```
models_per_box
box_price
prices
```

The enrichment function must **always spread the original unit**.

Correct structure:

```
return {
  ...unit,
  models_per_box,
  prices,
  box_price
}
```

This ensures metadata such as:

```
availability
id
name
points
```

are never lost.

---

# UI Availability States

Units may include an availability flag.

Example:

```
availability: "forgeworld"
availability: "legends"
```

These affect **UI display only**, not pricing.

Rendering rules:

| Condition | UI Result |
|--------|--------|
| kit data exists | show price |
| availability = forgeworld | show FORGEWORLD |
| availability = legends | show LEGENDS |
| no kit + no availability | show AWOL |

AWOL represents:

```
unit has no known retail kit
```

Examples:

- Forge World units
- discontinued kits
- rules-only entries

---

# AWOL Definition

A unit is AWOL if:

```
models_per_box = null
prices = null
availability missing
```

AWOL means:

```
No known purchasable retail kit.
```

AWOL units do not participate in cost calculations.

---

# Manual Kit Mapping Workflow

Kit mapping is currently **manual** to ensure accuracy.

Process:

1. Retail kits sourced from Games Workshop store.
2. Kits added to:

```
data/kits/{faction}.json
```

3. Units sourced from Wahapedia.

4. Assistant compares units to retail kits.

Two mapping categories produced:

SAFE mappings  
LIKELY mappings

SAFE = exact kit match  
LIKELY = needs human verification

Only verified mappings are added to:

```
data/kit-mappings/{faction}.json
```

---

# Data Validation Scripts

Scripts validate mapping integrity.

Example:

```
npm run validate:mappings
```

Checks include:

- every mapping references a valid kit
- no orphan mappings
- no duplicate kit definitions

---

# Price Pipeline

Prices are scraped from the official Games Workshop store.

Source:

```
warhammer.com
```

Regions scraped:

```
/en-GB/shop
/en-US/shop
/en-AU/shop
```

Scraper extracts:

- product name
- currency
- price

These values populate:

```
data/kits/*.json
```

All prices represent **RRP**.

---

# Pricing Philosophy

Prices must reflect **official Games Workshop retail price**.

Discounts are not stored in the dataset.

Discount logic will exist in the UI via a user toggle.

---

# Known Warhammer Data Complexities

The Warhammer ecosystem contains edge cases:

- multiple units from one kit
- kits that build different variants
- units only in bundles
- Forge World resin models
- legacy rules entries

The architecture is designed to accommodate these.

---

# Current Dataset Status

Current system includes:

- ~1577 units
- ~613 kit mappings
- ~359 retail kits

Units and points are now considered **stable infrastructure**.

The remaining work is expanding:

- kit coverage
- price completeness
- mapping accuracy

---

# Architecture Rules (Must Never Be Broken)

1. Units must never contain price data.
2. Prices must only exist in retail kits.
3. Unit mappings must only connect units to kits.
4. Retail kits must define models per box.
5. Regional prices must live in the kit layer.

Violating these rules will break the cost pipeline.

---

# Long-Term Vision

The data system will eventually support:

- bundle kits (Combat Patrols, Battleforces)
- discount calculation
- owned model tracking
- list imports
- historical price comparison

Maintaining the current architecture ensures these features can be added safely.