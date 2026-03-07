# Kit Data Pipeline

Purpose:
Populate accurate kit data for all factions.

This stage adds two pieces of information:

- models_per_box
- box_price

These values must come from real retail kits.

---

## Data Sources

Faction units:
data/army-data-no-legends.json

Kit mappings:
data/kit-mappings/{faction}.json

Kit dataset:
data/kits/{faction}.json

---

## Mapping Structure

Kit mapping file:

data/kit-mappings/{faction}.json

Example:

{
  "aggressor_squad": "aggressors",
  "intercessor_squad": "intercessors",
  "captain": "space-marine-captain"
}

This maps each unit to a kit slug.

Multiple units may map to the same kit.

---

## Kit Dataset Structure

data/kits/{faction}.json

Example:

{
  "aggressors": {
    "models": 3,
    "price": 38
  },
  "intercessors": {
    "models": 10,
    "price": 40
  }
}

Values must match real retail kit contents.

---

## Accuracy Requirements

The pipeline must never guess values.

Allowed:

- verified product kit
- verified model count
- verified RRP

Not allowed:

- inferred values
- heuristic pricing
- point-based guesses
- category guesses

---

## Workflow

For each faction:

1. Read units from:

data/army-data-no-legends.json

2. For each unit:

identify the real retail kit that builds the unit.

3. Create or update:

data/kit-mappings/{faction}.json

4. Add kit entries to:

data/kits/{faction}.json

5. Verify:

- models per box
- GW retail price

---

## Shared Kits

Multiple units may map to the same kit.

Example:

captain
captain_with_jump_pack

→ both map to captain kit.

---

## Validation

After generation:

- every mapped unit must have a valid kit slug
- every kit slug must exist in kits dataset
- no duplicate kit entries
- JSON must parse correctly

---

## Reporting

After processing a faction print:

Faction name
Total units
Units mapped
Units unresolved
Kits created

Final summary:

Total factions processed
Total units mapped
Total kits created
Total unresolved units