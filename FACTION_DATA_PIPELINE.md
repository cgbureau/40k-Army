# Faction Data Pipeline

## Overview

The faction data pipeline generates the final faction datasets used by the application.

The system is deterministic and does **not scrape external websites**.

All faction unit data is built from three local sources:

1. Unit source data
2. Kit mappings
3. Kit datasets

This ensures the pipeline is:

- reproducible
- stable
- extremely fast
- not dependent on third-party sites

---

# Data Sources

## 1. Unit Source

Location:

/data/army-data-no-legends.json

Provides the base unit list.

Example:

{
  "id": "boyz",
  "name": "Boyz",
  "points": 85
}

Fields:

- id
- name
- points

---

## 2. Kit Mapping

Location:

/data/kit-mappings/{faction}.json

Maps a **unit id → kit slug**.

Example:

{
  "boyz": "boyz",
  "nobz": "nobz",
  "warboss": "ork-warboss"
}

This mapping connects game units to product kits.

---

## 3. Kit Dataset

Location:

/data/kits/{faction}.json

Defines product metadata for each kit.

Example:

{
  "boyz": {
    "models": 10,
    "price": 30
  },
  "nobz": {
    "models": 5,
    "price": 27
  }
}

Fields:

- models → number of miniatures in the box
- price → Games Workshop RRP in GBP

---

# Pipeline Flow

For each faction:

1. Load unit list from:

/data/army-data-no-legends.json

2. Load kit mappings:

/data/kit-mappings/{faction}.json

3. Load kit dataset:

/data/kits/{faction}.json

4. Resolve:

unit id → kit slug → kit metadata

5. Populate fields:

models_per_box  
box_price

6. Validate each unit:

id  
name  
points  
models_per_box  
box_price  

7. Remove duplicate units by id.

8. Sort alphabetically by unit name.

---

# Output

The final dataset is written to:

/data/factions/{faction}/units.json

Example output:

{
  "id": "boyz",
  "name": "Boyz",
  "points": 85,
  "models_per_box": 10,
  "box_price": 30
}

---

# Performance

Because the pipeline uses only local JSON files:

- execution time is <1 second per faction
- no network calls are required
- the output is deterministic

---

# Scripts

Faction build script:

scripts/build-faction-dataset.js

Example usage:

node scripts/build-faction-dataset.js orks

Batch build script:

scripts/build-all-factions.js

Example:

node scripts/build-all-factions.js

This generates faction datasets for all factions present in:

/data/kit-mappings/

---

# Folder Structure

data/

army-data-no-legends.json  
kit-mappings/  
kits/  
factions/

Example:

data/kits/orks.json  
data/kits/space-marines.json  
data/kits/necrons.json  

---

# Key Principle

The pipeline **never scrapes retailers or APIs**.

All product metadata lives in the kit dataset.

This ensures the system is reliable and maintainable.