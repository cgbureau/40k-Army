# CLEANUP_PIPELINE.md

## Purpose

This document defines the **final cleanup and validation pipeline** that must run after all automated processes complete.

The cleanup pipeline ensures the repository is left in a **stable, production-ready state** after the following processes have run:

- FACTION DATA PIPELINE
- IMAGE PIPELINE

The goal is that when the user returns to the machine:

- all faction datasets exist
- all image folders exist
- all scripts are clean
- no experimental files remain
- the Next.js application builds successfully
- the repository structure is tidy
- no manual refactoring is required

This pipeline acts as the **final safety pass** after all automated generation tasks complete.

---

# Objectives

The cleanup process must ensure:

1. The repository contains **only required files**
2. All generated data is **valid and correctly located**
3. No temporary scripts remain
4. No duplicate scripts exist
5. No duplicate JSON files exist
6. All faction datasets are valid
7. All image folders are correctly structured
8. The Next.js application still builds successfully
9. Folder structure matches project conventions
10. The repository is ready for the **next development phase**

---

# Scope

This cleanup applies to the entire repository.

Specifically:

- `/data`
- `/scripts`
- `/public`
- `/app`
- `/components`

The cleanup pipeline must **not delete necessary project code**.

Its purpose is to remove:

- temporary scripts
- experimental scripts
- leftover test data
- obsolete pipelines
- duplicated data files
- unused directories

---

# Required Folder Structure

After cleanup, the repository must contain the following core structure.


/data
army-data-no-legends.json

/factions
/space-marines
units.json
/orks
units.json
/tyranids
units.json
/necrons
units.json
/chaos-space-marines
units.json
...

/kit-mappings
space-marines.json
orks.json
tyranids.json
necrons.json
chaos-space-marines.json
...

/kits
space-marines.json
orks.json
tyranids.json
necrons.json
chaos-space-marines.json
...

/scripts
build-faction-dataset.js
build-all-factions.js
download-faction-images.js
download-all-images.js

/public
/unit-images
/space-marines
/orks
/tyranids
/necrons
/chaos-space-marines
...


Any other script or data file outside this structure should be reviewed and removed if unnecessary.

---

# Script Cleanup

The cleanup process must inspect the `/scripts` directory.

Only the following scripts should remain:


build-faction-dataset.js
build-all-factions.js
download-faction-images.js
download-all-images.js


The cleanup must remove any obsolete scripts such as:


enrich-orks-kit-mapping.js
enrich-orks-faction.js
test scripts
debug scripts
temporary extraction scripts


If multiple scripts perform the same role, the cleanup must keep the **generic version** and remove faction-specific experimental versions.

---

# Data File Cleanup

The cleanup must inspect `/data`.

Ensure the following rules:

### Unit Source


/data/army-data-no-legends.json


Must exist.

Must not contain duplicate factions.

Must not contain temporary test factions.

---

### Faction Datasets


/data/factions/{faction}/units.json


Rules:

- one file per faction
- no duplicates
- no temporary test files
- valid JSON
- correct fields

Each unit must contain:


id
name
points
models_per_box
box_price


---

### Kit Mapping Files


/data/kit-mappings/{faction}.json


Rules:

- one file per faction
- no duplicate keys
- keys match unit ids
- values match kit dataset slugs

---

### Kit Dataset Files


/data/kits/{faction}.json


Rules:

- one file per faction
- no duplicate kit entries
- each kit contains:


models
price


Values must be numeric.

---

# Image Folder Cleanup

Inspect the directory:


/public/unit-images


Each faction folder must:

- exist
- contain images for its units
- contain no incorrectly named files
- contain no nested subfolders

Correct example:


/public/unit-images/orks/boyz.jpg
/public/unit-images/orks/nobz.jpg
/public/unit-images/space-marines/aggressor_squad.jpg


Incorrect examples that must be cleaned:


/public/unit-images/Orks/
/public/unit-images/space_marines/
/public/unit-images/orks/boyz (1).jpg
/public/unit-images/orks/tmp/
/public/unit-images/orks/product-image.jpg


The cleanup must not overwrite images.

It may rename files if they violate naming rules.

---

# Image Naming Validation

Every file must follow this rule:


{unit-id}.jpg


Rules:

- lowercase
- underscores allowed
- no spaces
- no capital letters
- no duplicate suffixes

Example:


boyz.jpg
warboss.jpg
captain_in_terminator_armour.jpg


---

# JSON Validation

The cleanup process must validate all generated JSON files.

For each file:


/data/factions/{faction}/units.json


Verify:

- file parses correctly
- no trailing commas
- array is valid
- no duplicate ids
- fields exist

If any invalid JSON is detected, the cleanup must report it.

---

# Deduplication Check

The cleanup pipeline must verify:

- no duplicate unit ids in faction datasets
- no duplicate kit mappings
- no duplicate kit dataset entries

Duplicates should be removed or reported.

---

# Application Build Validation

After cleanup, the Next.js application must still build successfully.

The cleanup pipeline should run:


npm run build


Expected outcome:

- build completes successfully
- no fatal errors
- warnings allowed but must be minimal

If the build fails, the cleanup pipeline must report the failure.

---

# Theme Coverage Check

Because new factions may have been added, the cleanup must verify the UI theme system still works.

Specifically:

The faction theme configuration must include every faction used in:


/data/factions


If a faction is missing from the theme configuration, the cleanup must:

- add a fallback theme color
- or report the missing mapping

This prevents UI crashes when selecting new factions.

---

# Repository Noise Removal

The cleanup must also remove common noise files such as:


*.log
*.tmp
debug.json
test-output.json
scratch files
temporary dataset files


But must not remove:


README.md
.md pipeline documents
package.json
lock files
Next.js config files


---

# Reporting

After cleanup completes, the system must print a final report.

Example:


Cleanup completed.

Scripts retained: 4
Scripts removed: 2

Factions detected: 18
Faction datasets validated: 18

Images validated: 420
Image errors: 3

JSON validation: passed

Next.js build: successful


This confirms the repository is stable.

---

# Non-Destructive Rule

Cleanup must **not delete important files silently**.

If a file is ambiguous, the pipeline should:

- log it
- skip deletion
- report it

Safety is more important than aggressive deletion.

---

# Final Repository State

After the cleanup pipeline runs, the repository should:

- have a clean folder structure
- contain only required scripts
- contain valid faction datasets
- contain organised image folders
- pass JSON validation
- pass application build
- contain no experimental clutter

The developer should be able to return to the repository and immediately begin the **next development phase** without refactoring.

---

# Final Principle

The cleanup pipeline ensures the automated generation process does not leave the project messy.

It enforces:

- structure
- consistency
- safety
- maintainability

so the repository remains **professional, readable, and scalable**.