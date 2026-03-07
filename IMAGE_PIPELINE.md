# IMAGE_PIPELINE.md

## Purpose

This document defines the complete pipeline for collecting, saving, and organising **unit product images for all Warhammer 40,000 factions** used by 40KArmy.

The objective of this pipeline is to build a reliable local image library for every unit so that later visual features can be added cleanly, including:

- selected unit preview cards
- faction-specific unit panels
- pixel / 8-bit converted artwork
- hover states
- future codex-style UI elements

The image pipeline must produce a consistent, well-labelled local asset library that can be used later without re-downloading or re-organising files.

The end result is:

```text
/public/unit-images/{faction}/{unit-id}.jpg

or, if needed:

/public/unit-images/{faction}/{unit-id}.png

This pipeline must be:

deterministic

repeatable

clearly foldered

clearly named

non-destructive

easy to validate

suitable for later batch image editing in Photoshop

Core Principle

The image pipeline is not concerned with image styling, image conversion, or visual effects.

Its job is only to:

identify the correct source product image

download the primary image

save it in a predictable local structure

name it clearly

avoid duplicates

prepare the library for future editing workflows

This means the pipeline must favour:

clean organisation

naming consistency

predictable folder structure

one canonical source image per unit

Final Output

For every unit that has a valid kit mapping and a source image, the pipeline should save:

/public/unit-images/{faction}/{unit-id}.jpg

Examples:

/public/unit-images/orks/boyz.jpg
/public/unit-images/orks/nobz.jpg
/public/unit-images/space-marines/aggressor_squad.jpg
/public/unit-images/tyranids/termagants.jpg

If image format detection requires PNG instead of JPG, the pipeline may save:

/public/unit-images/{faction}/{unit-id}.png

However, the preferred default is:

.jpg

for consistency and easier batch handling later.

Scope

This image pipeline must support all factions used by 40KArmy, including:

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

and any other faction represented in the local dataset

The image system must scale to all factions without needing a new architecture.

Relationship to Faction Data Pipeline

The image pipeline depends on the faction data pipeline and should use the same local structure wherever possible.

Relevant files:

/data/factions/{faction}/units.json
/data/kit-mappings/{faction}.json
/data/kits/{faction}.json

The image pipeline should not guess unit names independently if the data pipeline already provides a stable identity.

Preferred resolution path:

unit id
→ kit mapping
→ kit slug
→ product page
→ primary product image
→ local saved unit image

This keeps image naming aligned with the rest of the app.

Image Source Strategy

The image pipeline should aim to download the primary product image for each kit.

The ideal source image is the standard retailer / product image showing the kit on a clean white or neutral background.

This is important because the future workflow includes:

batch Photoshop actions

pixel conversion

card-style crops

consistent visual presentation

The pipeline should prefer the main “hero” image, not random thumbnails or lifestyle images.

Approved Source Type

The image pipeline may use a structured product source such as:

retailer product pages

product image URLs directly embedded in product pages

stable product CDN image URLs

The exact implementation source may evolve, but the pipeline rules stay the same.

The image pipeline should:

download the first relevant product image

avoid banners

avoid logos

avoid unrelated thumbnails

avoid duplicate alternate views unless explicitly needed later

Only one canonical product image is required per unit for now.

Folder Structure

The required folder structure is:

/public
  /unit-images
    /space-marines
    /orks
    /chaos-space-marines
    /tyranids
    /necrons
    /adepta-sororitas
    /adeptus-custodes
    /adeptus-mechanicus
    /astra-militarum
    /grey-knights
    /genestealer-cults
    /drukhari
    /aeldari
    /tau-empire
    /death-guard
    /thousand-sons
    /chaos-daemons
    /world-eaters
    /imperial-knights
    /chaos-knights
    /leagues-of-votann
    ...

The pipeline must create missing faction folders automatically.

No images should be saved outside this structure.

Naming Rules

Image files must be named by unit id, not by product title.

This is critical because the site uses unit ids consistently.

Required format
{unit-id}.jpg

Examples:

boyz.jpg
nobz.jpg
aggressor_squad.jpg
captain_in_terminator_armour.jpg
Rules

lowercase only

use the exact unit id from the data pipeline

preserve underscores if unit ids use underscores

do not invent new display-name filenames

do not use spaces

do not use product titles as filenames

do not include faction name in the file name if it is already in the folder path

Correct:

/public/unit-images/orks/boyz.jpg

Incorrect:

/public/unit-images/orks/Ork Boyz Product Image.jpg
/public/unit-images/orks/ork-boyz.jpg

if the unit id is actually boyz.

The filename must align with the app’s data model.

One Image Per Unit Rule

The current pipeline should save one primary image per unit.

Even if several units map to the same kit, each unit should still get its own file if that makes downstream usage easier.

Example:

burna_boyz → lootas-burna-boyz kit
lootas → lootas-burna-boyz kit

Both units may use the same source image, but the saved output should be:

/public/unit-images/orks/burna_boyz.jpg
/public/unit-images/orks/lootas.jpg

This is preferable because later UI code can reference images by unit id directly, without performing runtime kit lookups.

Canonical Resolution Path

For each faction, the image pipeline should follow this path:

1. Load faction units
2. Load kit mappings
3. Resolve unit id → kit slug
4. Resolve product page or image source for kit slug
5. Extract primary image URL
6. Download image
7. Save image under unit id
8. Skip or report failures cleanly

This ensures the image pipeline stays aligned with the faction dataset pipeline.

Inputs

The image pipeline may use these local inputs:

1. Final faction units

Location:

/data/factions/{faction}/units.json

Purpose:

enumerate valid units

ensure only real app-facing units are processed

2. Kit mappings

Location:

/data/kit-mappings/{faction}.json

Purpose:

resolve unit id → kit slug

3. Optional kit dataset

Location:

/data/kits/{faction}.json

Purpose:

keep image pulling aligned with product metadata

support future product-page lookup if needed

Preferred Behaviour

For every faction and every unit:

If image already exists

skip download

report as skipped

do not overwrite by default

If image does not exist

fetch source image

save to correct local path

report as downloaded

If source cannot be resolved

report as failed

continue processing remaining units

The pipeline must not stop on a single broken image.

Non-Destructive Rule

This pipeline must be non-destructive by default.

Meaning:

do not overwrite existing images automatically

do not delete existing images

do not rename existing files unless explicitly told to do so

do not replace edited images later unless the user explicitly requests a refresh

This matters because the user plans to run Photoshop actions on the image library later.

Once those edits happen, re-running the pipeline must not destroy that work.

If a future refresh mode is needed, it should be a separate explicit option.

Duplicate Handling

Duplicate downloads should be avoided.

The pipeline should prevent duplication in two ways:

1. Per-file check

If this path already exists:

/public/unit-images/{faction}/{unit-id}.jpg

or

/public/unit-images/{faction}/{unit-id}.png

then skip download.

2. Per-run duplication logic

If multiple units resolve to the same source image URL, that is allowed, but each unit should still save its own unit-id-labelled file if missing.

The final library should be unit-addressable, not only kit-addressable.

File Format Rules

Preferred save format:

jpg

Allowed fallback:

png

Rules:

preserve image readability

do not over-compress

do not resize unnecessarily

do not crop automatically unless explicitly needed later

keep source image as close to original as practical

This is because later Photoshop and pixel workflows will benefit from the cleanest source possible.

Minimum Image Quality Rules

The pipeline should prefer:

the main product image

clear white or neutral background

product-only composition

readable silhouette

full figure visible where possible

Avoid:

thumbnails if a larger version exists

banners

multi-product collages

UI icons

logos

screenshots

review images

random alternate gallery views if the first hero image exists

The goal is a clean art asset library, not a generic media scrape.

Output Validation

After download, the pipeline should validate:

file exists

file size > 0

correct folder

correct unit-id filename

no accidental HTML saved as image

If validation fails, the file should be deleted or ignored and the failure should be reported.

This is important because failed HTTP responses can sometimes save incorrectly if not checked.

Required Reports

The image pipeline must print a clear report per faction.

At minimum:

Faction: Orks
Units processed: 30
Images downloaded: 28
Images skipped: 2
Images failed: 0
Output folder: /public/unit-images/orks

If failures occur, list the failed units.

This makes it easy to verify whether the image pull is complete.

Batch Image Pipeline

The image pipeline should support both:

Single-faction image build

Example script:

/scripts/download-faction-images.js

Usage:

node scripts/download-faction-images.js orks
All-factions image build

Example script:

/scripts/download-all-images.js

Usage:

node scripts/download-all-images.js

The batch runner should:

detect all available factions

run the single-faction downloader for each

continue if one faction fails

print a report per faction

This makes it possible to set the whole image collection running in one go.

Relationship to Future Photoshop Workflow

This image library is being prepared for a later “image phase” in which the user will run a Photoshop action or other batch effect across all downloaded images.

Because of that, the pipeline must prioritise:

stable naming

stable folders

stable formats

no overwriting by default

The image library is not just for direct runtime use; it is also a pre-production asset collection for future art treatment.

This means organisation quality matters as much as download success.

Future 8-Bit / Pixel Phase

The current image pipeline does not perform image styling or pixel conversion.

That will happen later.

The future process may include:

8-bit conversion

color reduction

card cropping

outlines

faction frames

UI card exports

This pipeline should simply ensure the source images are well-labelled and ready.

App Usage Goal

Later, the website should be able to reference images simply by unit id.

Example:

/public/unit-images/orks/boyz.jpg

This means future UI code can do something like:

unit image path = /unit-images/{faction}/{unit-id}.jpg

without complicated runtime lookup logic.

That is why file naming must stay tied to unit-id.

Faction Naming Consistency

Faction folder names must match the project’s established faction slug system.

Examples:

space-marines

orks

chaos-space-marines

tyranids

necrons

This keeps image folders aligned with:

faction datasets

theme mapping

dropdown selection

future unit-card references

The image pipeline must not invent alternate faction folder names.

Failure Handling

If an image cannot be downloaded for a unit, the pipeline should:

log the unit

skip it

continue the run

Do not crash the entire job because one unit fails.

A failed image must not prevent the rest of the faction or batch build from completing.

Success Criteria

The image pipeline is successful if:

all factions can be processed through one generic image workflow

images are saved in clear faction folders

files are named by unit id

duplicate downloads are avoided

existing files are not overwritten by default

failed units are reported clearly

the resulting library is ready for batch Photoshop processing later

Non-Goals

This image pipeline is not responsible for:

editing images

cropping for cards

adding frames

reducing colors

generating pixel art

assigning runtime UI behaviour

modifying faction data files

modifying app UI code

Those belong to later processes.

Final Principle

The image pipeline must favour:

organisation over improvisation

stable local assets over hotlinked images

unit-id naming over pretty names

one clean source image per unit over messy galleries

repeatability over cleverness

The end result should be a local image library that is dependable, scalable, and perfectly prepared for the later image-editing phase.