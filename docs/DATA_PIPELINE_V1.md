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