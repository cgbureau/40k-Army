# DATA STRUCTURE REFERENCE

This document defines the canonical data architecture for the 40KArmy calculator.

All future development must respect these structures to avoid breaking the application.

---

# Core System Architecture

The calculator uses a 3-layer data pipeline.

units  
→ kit mappings  
→ retail kits

Each layer serves a different purpose and must remain separated.

---

# Layer 1 — Units

File:

data/army-data-no-legends.json

This dataset contains all playable units.

Fields typically include:

- unit name
- faction
- points value
- unit slug

Example:


{
"name": "Rubric Marines",
"slug": "rubric_marines",
"points": 105,
"faction": "thousand_sons"
}


Important rules:

- units represent **game rules**
- units should **never contain price data**
- units should **never contain retail information**

This dataset is sourced from Wahapedia and represents gameplay data only.

---

# Layer 2 — Kit Mappings

File location:

data/kit-mappings/

These files map a gameplay unit to the retail kit used to purchase it.

Example:


rubric_marines → rubric-marines


Example mapping file entry:


"rubric_marines": "rubric-marines"


Important rules:

- mappings only connect units to kits
- mappings contain **no pricing**
- mappings contain **no model counts**

This layer exists because many units share the same retail box.

---

# Layer 3 — Retail Kits

File location:

data/kits/

Retail kits represent physical products sold by Games Workshop.

Example kit entry:


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
}
}


Fields:

name  
Human readable product name

models  
Number of models contained in the kit

purchasable  
Boolean indicating if the product is currently available

prices  
Regional MSRP values

Important rules:

- kits contain **all price information**
- kits contain **models per box**
- kits represent **retail products**

---

# Calculation Pipeline

The application calculates army cost using the following steps:

1. user selects units
2. unit dataset provides required model counts
3. unit slug maps to kit slug
4. kit provides models per box
5. required models are divided by models per box
6. number of boxes is calculated
7. box price is multiplied by boxes required

Example:


Rubric Marines selected: 15

models per box: 10

15 ÷ 10 = 1.5 → 2 boxes required

2 × £42.50 = £85


---

# Rules That Must Never Be Broken

These rules protect the architecture.

1. Units must never contain price data.
2. Prices must only exist in the retail kit layer.
3. Unit mappings must only map units to kits.
4. Retail kits must define models per box.
5. Regional prices must be stored per kit.

Violating these rules will cause pricing errors and inconsistent calculations.

---

# Handling Missing Kits

Some units may not currently have a retail kit.

Possible reasons:

- legacy models
- discontinued products
- rules entries without retail equivalents

In these cases:


purchasable: false


The UI should display that the unit cannot currently be purchased.

---

# Summary

The architecture of the calculator is intentionally simple:

units → mappings → kits → prices

Maintaining this structure ensures the system can scale to support:

- new factions
- new units
- new kits
- global price updates
- bundle and discount logic in the future


---

# Kit Object Structure

Each kit entry represents a retail product sold by Games Workshop.

Example:

terminators:
  models: 5
  prices:
    GBP: number
    USD: number
    EUR: number
    AUD: number
    CAD: number

Field definitions:

models  
Number of models contained in the retail box.

prices  
Regional retail prices scraped from the official GW store.

All prices represent RRP.


## Availability Flags

Units may include an availability field:

availability: "legends"
availability: "forgeworld"

If present, the UI renders special states:

LEGENDS → blue label  
FORGEWORLD → orange label

Units without kit mappings are treated as:

AWOL → no retail kit available

Availability flags do not affect cost calculations.
They only change UI labeling.