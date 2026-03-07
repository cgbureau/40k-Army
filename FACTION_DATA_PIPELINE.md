# FACTION_DATA_PIPELINE.md

## Purpose

This document defines the complete, deterministic pipeline for generating **all Warhammer 40,000 faction datasets** used by 40KArmy.

The objective of this pipeline is to produce clean, validated faction data files that the website can use directly, without relying on live retailer scraping or fragile search-based matching at runtime.

This pipeline must support:

- all major factions
- all niche factions
- future expansion without changing the core architecture

The end result is a folder of faction datasets:

```text
/data/factions/{faction}/units.json

Each generated faction file must contain fully enriched unit data:

id

name

points

models_per_box

box_price

The pipeline must be:

deterministic

repeatable

fast

local

easy to validate

easy to re-run later

Core Principle

The faction data pipeline does not rely on live scraping to determine product price or box size.

Instead, it uses a stable local architecture:

Unit Source
→ Kit Mapping
→ Kit Dataset
→ Final Faction Dataset

This is the correct long-term system because:

unit points come from a structured game dataset

product information is more stable when stored locally

multiple units often map to one product kit

deterministic local data is easier to review and maintain than scraped data

Final Output

For every faction, the final output file must be:

/data/factions/{faction}/units.json

Example:

{
  "faction": "Orks",
  "units": [
    {
      "id": "boyz",
      "name": "Boyz",
      "points": 85,
      "models_per_box": 10,
      "box_price": 30
    }
  ]
}

Rules:

one unit object per unit

no duplicates

sorted alphabetically by name

valid JSON

all numeric fields must be numbers, not strings

if a value cannot be resolved confidently, use null and flag for manual review in reporting

Scope

This pipeline should build datasets for all available Warhammer 40,000 factions, including but not limited to:

Space Marines

Orks

Chaos Space Marines

Tyranids

Necrons

Adepta Sororitas

Adeptus Custodes

Adeptus Mechanicus

Astra Militarum

Grey Knights

Genestealer Cults

Drukhari

Aeldari

T’au Empire

Death Guard

Thousand Sons

Chaos Daemons

World Eaters

Imperial Knights

Chaos Knights

Leagues of Votann

Black Templars

Blood Angels

Dark Angels

Space Wolves

Deathwatch

and any other faction represented in the source data

Sub-factions may remain grouped under their parent faction if that matches the current site architecture.

Data Sources

The pipeline uses three local sources.

1. Unit Source

Location:

/data/army-data-no-legends.json

This file contains the base unit data, derived from the Warhammer / BSData source.

Each unit source entry provides:

id

name

points

Example:

{
  "id": "boyz",
  "name": "Boyz",
  "points": 85
}

This is the authoritative gameplay source for unit identity and points values.

2. Kit Mapping

Location:

/data/kit-mappings/{faction}.json

This file maps unit ids to a kit slug.

Purpose:

A unit is not always sold as a product of the exact same name. Many units map to a kit with a different product name, and many units share a box.

Examples:

{
  "boyz": "boyz",
  "burna_boyz": "lootas-burna-boyz",
  "lootas": "lootas-burna-boyz",
  "warboss": "ork-warboss"
}

This file is the translation layer between game unit and product kit.

3. Kit Dataset

Location:

/data/kits/{faction}.json

This file defines the actual product metadata for each kit slug.

Example:

{
  "boyz": {
    "models": 10,
    "price": 30
  },
  "lootas-burna-boyz": {
    "models": 5,
    "price": 27
  }
}

Fields:

models: number of miniatures in the kit

price: Games Workshop RRP in GBP

This is the authoritative product source for cost calculation.

Pipeline Architecture

The correct pipeline flow is:

1. Load faction units from unit source
2. Deduplicate units by id
3. Load faction kit mapping
4. Load faction kit dataset
5. Resolve unit → kit slug
6. Resolve kit slug → kit metadata
7. Populate models_per_box and box_price
8. Validate every unit object
9. Sort units alphabetically
10. Save final faction dataset

No live scraping is required in the final production version of this pipeline.

Required Folder Structure

The pipeline expects and maintains the following structure:

/data
  /factions
    /space-marines
      units.json
    /orks
      units.json
    /chaos-space-marines
      units.json
    ...
  /kit-mappings
    space-marines.json
    orks.json
    chaos-space-marines.json
    ...
  /kits
    space-marines.json
    orks.json
    chaos-space-marines.json
    ...
  army-data-no-legends.json

Each folder must be created automatically if missing.

Faction Naming Rules

Faction slugs should use lowercase kebab-case.

Examples:

space-marines

orks

chaos-space-marines

adepta-sororitas

imperial-knights

These slugs are used in:

file names

folder names

script arguments

image folder names

theme mapping

The human-readable faction name remains inside the JSON output:

{
  "faction": "Orks"
}
Unit Validation Rules

Every final unit object must contain:

id

name

points

models_per_box

box_price

Validation requirements:

id

required

string

unique within a faction dataset

name

required

string

must match source unit name

points

required

numeric

copied from source dataset

models_per_box

numeric if known

null if unresolved

box_price

numeric if known

null if unresolved

If any field fails validation, the pipeline must not crash. Instead:

log the issue

flag the unit in reporting

continue processing the remaining units

Deduplication Rules

Duplicates must never appear in the final faction dataset.

Deduplicate by:

unit.id

If two source units have the same id:

keep the first clean valid entry

ignore additional duplicates

report duplicate count in logs if useful

The final output must contain only one unit object per unique unit id.

Sorting Rules

The final units array in each faction output file must be sorted alphabetically by name.

Example order:

Battlewagon

Beastboss

Big Mek in Mega Armour

Boyz

Burna Boyz

This makes files predictable and easier to diff.

Kit Mapping Rules

Kit mapping files are critical and must be treated carefully.

Purpose

Translate a game unit id into the appropriate product kit slug.

Rules

mapping keys must exactly match unit ids from the source dataset

mapping values must exactly match kit slugs used in the faction kit dataset

multiple units may map to the same kit

not every unit requires a unique kit

Examples

Correct:

{
  "burna_boyz": "lootas-burna-boyz",
  "lootas": "lootas-burna-boyz"
}

Incorrect:

{
  "burna-boyz": "lootas-burna-boyz"
}

because the key must match the actual unit id exactly.

Kit Dataset Rules

Kit dataset files define the actual product metadata.

Required structure
{
  "kit-slug": {
    "models": 10,
    "price": 30
  }
}
Rules

models must be numeric

price must be numeric

values should reflect official GW RRP in GBP

one kit slug per product box

no duplicate kit keys

use integers for whole pound values where possible

decimals are allowed for half-pound prices or similar

Examples
{
  "ork-boyz": { "models": 10, "price": 30 },
  "meganobz": { "models": 3, "price": 44.5 },
  "ork-warboss": { "models": 1, "price": 22 }
}
Accuracy Target

The target accuracy for this pipeline is:

90–95% or better

This means:

at least 90% of faction units should resolve cleanly through mapping + kit dataset

unresolved units should be rare and easy to inspect manually

a faction should never require large-scale manual cleanup once the mapping and kit dataset are mature

The system should aim for deterministic confidence, not fuzzy approximation.

Generic Scripts

The pipeline should be powered by two generic scripts.

1. Single-faction builder
/scripts/build-faction-dataset.js

Usage:

node scripts/build-faction-dataset.js orks

Behaviour:

load one faction

process through mapping + kit dataset

save one output file

print a per-faction report

2. Batch builder
/scripts/build-all-factions.js

Usage:

node scripts/build-all-factions.js

Behaviour:

detect every faction present in /data/kit-mappings/

run the single-faction build for each one

continue even if one faction errors

print a report per faction

Required Build Report

Every faction build should produce a concise report.

Example:

Faction: Orks
Units processed: 30
Units enriched: 30
Units unresolved: 0
Output: /data/factions/orks/units.json

At minimum, the report should include:

faction name

units processed

units enriched

units unresolved

output file path

If unresolved units exist, print their names.

Building All Factions

The batch build process must support all factions found in the data folders.

Expected workflow:

1. Detect all faction mapping files in /data/kit-mappings/
2. For each faction:
   - load unit source
   - load kit mapping
   - load kit dataset
   - build final dataset
3. Save all outputs
4. Print all reports

This should make it possible to generate all faction datasets in one command.

Handling Missing Data

If a unit cannot be enriched because:

the faction is missing from source data

the unit id is missing from kit mapping

the mapped kit slug is missing from kit dataset

the kit dataset entry is malformed

Then the pipeline should:

keep the unit in the final output

preserve id, name, and points

set:

models_per_box: null

box_price: null

record the unit as unresolved in reporting

The pipeline must not silently drop units.

Building Kit Mappings and Kit Datasets

The overall system depends on these two local files per faction:

/data/kit-mappings/{faction}.json

/data/kits/{faction}.json

These may be created manually, semi-automatically, or through future helper scripts.

The faction pipeline assumes they already exist before a build.

If they do not exist, the builder should fail gracefully and report the missing file.

Relationship to the Website

The website reads the generated files directly:

/data/factions/{faction}/units.json

This means the builder is responsible for ensuring these files are always:

valid

complete

deduplicated

sorted

ready for runtime use

The website should never need to repair or transform this data at runtime.

Theme Support

Each faction in the generated data must align cleanly with the site’s theme system.

The faction slug naming must be stable so the UI can apply:

dropdown entries

panel tint

future faction-specific styles

The pipeline itself does not style the UI, but it must preserve consistent faction naming for theme mapping later.

Non-Goals

This pipeline is not responsible for:

downloading product images

converting images

editing artwork

running Photoshop actions

scraping retailer sites in production

modifying app UI code

Those belong to separate processes.

Success Criteria

The faction data pipeline is considered successful if:

all factions can be processed through one generic build system

each faction outputs a valid units.json

duplicate units are removed

units are sorted alphabetically

the majority of units are enriched through local deterministic data

unresolved units are reported clearly

the process can be run again later without repo mess or manual surgery

Final Principle

The faction data pipeline must favour:

stability over cleverness

local data over scraping

deterministic mapping over fuzzy matching

clean rebuilds over ad-hoc edits

The end result should be a system you can trust, re-run, and expand indefinitely.