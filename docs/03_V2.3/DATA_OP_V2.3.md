# 40KArmy — Data Operations Guide (V2.3)

This document describes the **operational workflow** used to build and maintain faction datasets for the 40KArmy calculator.

It complements the system architecture described in:

DATA_SYSTEM.md

Where DATA_SYSTEM defines the **data architecture**, this document defines the **human workflow used to populate it**.

---

# Data Pipeline Recap

The system uses a strict 3-layer pipeline:

Units  
→ Kit Mappings  
→ Retail Kits  
→ Regional Prices

Operationally this means every faction integration requires work across **three files**.

---

# Required Files Per Faction

Each faction requires the following data files.

```
data/factions/{faction}/units.json
data/kit-mappings/{faction}.json
data/kits/{faction}.json
```

These three files together define the faction's cost calculation data.

---

# File Responsibilities

## units.json

Contains gameplay unit entries.

Fields:

id  
name  
points  
models_per_box  
box_price  
prices  
availability (optional)

Important:

models_per_box  
box_price  
prices  

start as **null** and are filled by enrichment.

Example:

```
{
"id": "terminator_squad",
"name": "Terminator Squad",
"points": 180,
"models_per_box": null,
"box_price": null,
"prices": null
}
```

Forge World or Legends units include:

```
availability: "forgeworld"
availability: "legends"
```

---

## kit-mappings/{faction}.json

Maps unit IDs to kit slugs.

Example:

```
{
"terminator_squad": "terminators",
"deathwing_terminators": "terminators"
}
```

Rules:

• keys must match unit.id  
• values must match kit slug  
• multiple units may map to one kit  

---

## kits/{faction}.json

Defines retail kit data.

Example:

```
terminators:
  models: 5
  prices:
    GBP: 42.50
    USD: 60
    EUR: 50
    AUD: 95
    CAD: 80
```

Rules:

• prices represent GW RRP  
• prices stored per region  
• models represent box contents

---

# Mapping Workflow (Used In Development)

When integrating a faction:

Step 1  
Load the faction units dataset.

Step 2  
Identify retail kits sold by Games Workshop.

Step 3  
Compare unit list against retail kits.

Step 4  
Assistant generates two lists:

SAFE mappings  
LIKELY mappings

SAFE mappings  
= exact retail match

LIKELY mappings  
= probable but requires confirmation

Step 5  
Human verifies LIKELY mappings.

Step 6  
Confirmed mappings added to:

```
data/kit-mappings/{faction}.json
```

---

# Data Enrichment Pipeline

At runtime units are enriched using kit mappings.

Pipeline:

```
unit.id
→ lookup mapping
→ lookup kit
→ attach models_per_box
→ attach regional prices
```

Important rule:

The enrichment function **must always spread the original unit object**.

Correct implementation:

```
return {
  ...unit,
  models_per_box,
  prices,
  box_price
}
```

This preserves:

id  
name  
points  
availability  

---

# UI Display States

The UI supports four states.

1️⃣ Purchasable

Unit has kit mapping.

Display:

points • models • price

---

2️⃣ Forge World

```
availability: "forgeworld"
```

Display:

FORGEWORLD label

---

3️⃣ Legends

```
availability: "legends"
```

Display:

LEGENDS label

---

4️⃣ AWOL

Unit has:

```
models_per_box = null
prices = null
availability missing
```

Display:

AWOL

AWOL means:

unit has no known retail kit.

---

# Known Recurring Bug

A recurring bug exists where units with:

```
availability: "forgeworld"
```

render as:

AWOL

This occurs when availability is lost or misinterpreted during rendering.

This issue is documented in:

```
docs/availability_bug.md
```

---

# Current Development Status

The project currently contains:

~1577 units  
~613 kit mappings  
~359 kits

The focus of current development is:

• completing faction datasets  
• verifying mappings  
• ensuring price accuracy

---

# Contributor Workflow

When a contributor provides faction data:

1. Add kit definitions to:

```
data/kits/{faction}.json
```

2. Add kit mappings to:

```
data/kit-mappings/{faction}.json
```

3. Ensure units exist in:

```
data/factions/{faction}/units.json
```

4. Run validation scripts.

5. Load the faction page and verify:

• models per box  
• prices  
• availability states

---

# Long-Term Data Goals

Future improvements include:

• bundle support  
• Combat Patrol pricing  
• discount calculations  
• owned model tracking  
• automated price refresh

Maintaining the current workflow ensures the system remains stable as the dataset expands.