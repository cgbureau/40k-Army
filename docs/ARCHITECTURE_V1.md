# 40KArmy – Architecture V1

## Overview

40KArmy is a static-data driven Warhammer 40K army cost calculator.

The system converts verified Warhammer unit + retail kit data into faction-specific datasets used by a Next.js frontend.

All retail cost calculations are performed client-side using these datasets.

The architecture prioritises:

• deterministic data generation  
• zero runtime scraping  
• static JSON datasets  
• minimal server logic  

---

# System Architecture

Build Pipeline

army-data-no-legends.json
(master unit source)

        ↓

kit-mappings/{faction}.json
(unit → retail kit mapping)

        ↓

kits/{faction}.json
(retail kit definitions)

        ↓

build-all-factions.js
(dataset generator)

        ↓

data/factions/{slug}/units.json
(final faction datasets)

---

# Runtime Architecture

Frontend (Next.js)

page.tsx

        ↓

fetch()

/api/factions/{slug}/units

        ↓

Next API route

app/api/factions/[slug]/units/route.ts

        ↓

reads static dataset

data/factions/{slug}/units.json

        ↓

returns JSON

---

# Unit Data Format

Each unit contains:

{
  id
  name
  points
  models_per_box
  box_price
  prices {
    GBP
    USD
    EUR
  }
}

---

# Currency System

Currencies supported:

GBP
USD
EUR

Pricing rules:

GBP → prices.GBP fallback to box_price  
USD → prices.USD only  
EUR → prices.EUR only

All price rendering goes through:

getUnitPrice(unit, currency)

---

# Performance Design

Datasets are static JSON.

Advantages:

• no database
• no runtime scraping
• minimal server load
• extremely fast responses
• easy caching

Typical API response size:
~30–60kb

---

# Security Model

No user accounts  
No database  
No user input affecting server logic  

API routes only read static datasets.

Risk surface is extremely small.

---

# Deployment

Platform: Vercel

Deployment model:

GitHub push → Vercel build → deploy

Static datasets are included in build output.

---

# Future Work

Next development phase:

• Mobile UI optimisation
• Responsive layout improvements
• Unit filtering improvements
• Army export improvements
• dataset expansion

The data pipeline itself is considered stable for V1.


## Runtime Unit Enrichment

Units loaded by the UI are enriched at runtime.

Process:

1. Load base unit data
   data/factions/{faction}/units.json

2. Resolve kit slug
   data/kit-mappings/{faction}.json

3. Load kit definition
   data/kits/{faction}.json

4. Enrich unit object with:

- models_per_box
- prices

Example:

unit.id → "burna_bommer"
kitMapping → "burna-bommer"
kit → models + prices

If no kit mapping exists, the unit renders as AWOL.