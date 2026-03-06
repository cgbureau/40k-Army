# Faction Data Enrichment Pipeline

This document defines the workflow used to generate faction unit data for the 40KArmy calculator.

The goal is to automatically enrich faction unit lists with:

- Games Workshop box price
- number of miniatures per box

The resulting data is saved as:

/data/factions/{faction}/units.json

This pipeline should be deterministic, clean, and easy to review.

---

# Data Source

Unit lists originate from the Wahapedia / Battlescribe style dataset already used by the project.

The cleaned file used is:

/data/army-data-no-legends.json

Example entry:

```
{
  "id": "aggressor_squad",
  "name": "Aggressor Squad",
  "points": 95
}
```

---

# Target Output Format

Each faction unit file must follow this structure:

```
{
  "faction": "Space Marines",
  "units": [
    {
      "id": "aggressor_squad",
      "name": "Aggressor Squad",
      "points": 95,
      "models_per_box": 3,
      "box_price": 38.00
    }
  ]
}
```

Rules:

- `box_price` must be the **official Games Workshop price**
- `models_per_box` must reflect the **number of miniatures included in the kit**
- if data cannot be determined, flag it for review

---

# Pipeline Steps

## Step 1 — Extract Faction Units

From:

```
/data/army-data-no-legends.json
```

Filter units belonging to the target faction.

Example:

Space Marines → units containing:

```
Aggressor Squad
Intercessor Squad
Terminator Squad
```

Remove duplicates.

---

## Step 2 — Generate Product Name

Transform unit names into likely Games Workshop product names.

Examples:

```
Aggressor Squad → Space Marine Aggressors
Ancient → Space Marine Ancient
Terminator Squad → Space Marine Terminators
```

Rules:

- pluralise squads where appropriate
- remove suffix "Squad" where needed
- match common GW naming patterns

---

## Step 3 — Locate Official GW Product Page

Use the Games Workshop store:

```
https://www.games-workshop.com
```

Search pattern:

```
https://www.games-workshop.com/en-GB/search?q={product}
```

Locate the official product page.

Example:

```
https://www.games-workshop.com/en-GB/Space-Marine-Aggressors-2020
```

Only use **Games Workshop official store pages**.

Do not use third-party retailers.

---

## Step 4 — Extract Data

From the product page extract:

### Price

Example:

```
£38.00
```

Convert to numeric:

```
38.00
```

---

### Miniature Count

Look for phrases:

```
"3 miniatures"
"5 plastic miniatures"
"10 Citadel miniatures"
```

Extract number.

Examples:

```
3
5
10
```

---

## Step 5 — Edge Case Handling

Certain kits require manual review.

Flag with:

```
"review_required": true
```

Cases include:

- characters sold individually
- kits that build multiple unit types
- combat patrol / army box sets
- products containing upgrade sprues

Example flagged unit:

```
{
  "id": "chaos_lord",
  "name": "Chaos Lord",
  "points": 80,
  "models_per_box": 1,
  "box_price": 24.00,
  "review_required": true
}
```

---

# Validation Rules

Before saving:

1. Ensure all units have:
   - id
   - name
   - points
2. Ensure price is numeric
3. Ensure miniature count is numeric
4. Remove duplicates
5. Sort units alphabetically

---

# Output Location

Save final enriched faction file:

```
/data/factions/{faction}/units.json
```

Examples:

```
/data/factions/orks/units.json
/data/factions/chaos-space-marines/units.json
/data/factions/tyranids/units.json
/data/factions/necrons/units.json
```

---

# Required Output Summary

After generation, produce a report:

Example:

```
Faction: Orks

Units processed: 67
Matched automatically: 61
Flagged for review: 6

Review list:
- Weirdboy
- Big Mek
- Mek Gun
- Flash Gitz
```

This allows fast manual verification.

---

# Performance Expectations

Manual workflow:

~3 hours per faction

Automated enrichment workflow:

~10–15 minutes per faction

---

# Important Rule

Only use **official Games Workshop pricing**.

Do not pull discounted retailer prices.

This ensures consistent and fair cost comparison.