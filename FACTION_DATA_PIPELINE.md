# FACTION DATA PIPELINE (v2 — Kit Mapping Method)

This pipeline generates faction data used by the Warhammer Army Cost Calculator.

The goal is to enrich unit data with:

* models_per_box
* box_price (GW RRP)

Output files:

```
/data/factions/{faction}/units.json
```

These files are consumed directly by the application.

---

# Source Data

All base unit data comes from:

```
/data/army-data-no-legends.json
```

Example entry:

```
{
"id": "boyz",
"name": "Boyz",
"points": 85
}
```

Only these fields are used:

* id
* name
* points

---

# Key Design Change

Previous versions attempted to:

```
unit → guess product → search retailer
```

Search results are unreliable and produce low match rates.

The new system uses:

```
unit → kit mapping → fetch product page
```

Warhammer units are built from a **small set of kits**, so mapping units to kits is far more reliable.

Example:

```
Boyz → ork-boyz
Warboss → ork-warboss
Meganobz → ork-meganobz
```

---

# Product Source

Product data is fetched from Element Games.

Example product URL:

```
https://elementgames.co.uk/games-workshop/warhammer-40k/orks/ork-boyz
```

These pages expose:

```
RRP £30.00
Contains 10 plastic miniatures
```

Both values can be parsed reliably.

---

# Pipeline Steps

## Step 1 — Load Source Data

Load:

```
/data/army-data-no-legends.json
```

Extract the requested faction.

Keep:

```
id
name
points
```

Remove duplicates.

---

## Step 2 — Generate Kit Mapping

Generate a `kit_slug` for each unit.

Examples:

```
Boyz → ork-boyz
Meganobz → ork-meganobz
Warboss → ork-warboss
Stormboyz → ork-stormboyz
Kommandos → ork-kommandos
Flash Gitz → flash-gitz
```

This mapping is deterministic and does not require search.

Example intermediate structure:

```
{
"id": "boyz",
"name": "Boyz",
"points": 85,
"kit_slug": "ork-boyz"
}
```

---

## Step 3 — Build Product URL

Construct the product URL directly:

```
https://elementgames.co.uk/games-workshop/warhammer-40k/{faction}/{kit_slug}
```

Example:

```
https://elementgames.co.uk/games-workshop/warhammer-40k/orks/ork-boyz
```

Fetch this page.

---

## Step 4 — Parse Product Page

Extract:

Price:

```
£([0-9]+(?:\.[0-9]{2})?)
```

Model count:

```
contains (\d+)
(\d+) miniatures
```

Convert to:

```
box_price: number
models_per_box: number
```

---

## Step 5 — Handle Edge Cases

If the page cannot be parsed or the product is ambiguous:

Add:

```
review_required: true
```

Do not invent values.

---

## Step 6 — Build Final JSON

Output structure:

```
{
"faction": "Orks",
"units": [
{
"id": "boyz",
"name": "Boyz",
"points": 85,
"models_per_box": 10,
"box_price": 30.00
}
]
}
```

---

## Step 7 — Validation

Before saving ensure:

* id exists
* name exists
* points exists
* box_price numeric
* models_per_box numeric

Remove duplicates.

Sort units alphabetically by name.

---

## Step 8 — Save Output

Write to:

```
/data/factions/{faction}/units.json
```

Overwrite existing file.

---

## Step 9 — Report

Print summary:

Example:

```
Faction: Orks

Units processed: 32
Auto matched: 28
Review required: 4
```

List flagged units.

---

# Expected Accuracy

Using deterministic kit mapping:

```
85–95% automatic matches
```

Manual review typically required for:

* character variants
* special kits
* units sharing a box

---

# Notes

Games Workshop kit data changes rarely.

The pipeline does not require live updates.

Manual corrections can be committed once and reused indefinitely.
