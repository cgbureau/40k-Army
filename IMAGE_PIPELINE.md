# IMAGE PIPELINE (DEFERRED)

The image pipeline is currently disabled.

Image sourcing from retailer CDNs and the Games Workshop CDN proved unreliable for automated deterministic downloads.

Image acquisition will be implemented in a later phase using a verified image dataset or curated image source.

The current pipeline only prepares the folder structure:

public/unit-images/{faction}/

No automatic downloads are performed during the main build pipeline.

Future phases will populate these folders.

---

# IMAGE SOURCE

Images must be downloaded from a retailer CDN where filenames match product slugs.

Use the Element Games product image CDN.

Base URL:

https://elementgames.co.uk/images/products/

Example:

slug: boyz

image URL:
https://elementgames.co.uk/images/products/boyz.jpg

This allows deterministic image URLs without HTML scraping.

---

# IMAGE STORAGE STRUCTURE

Images must be saved to:


public/unit-images/{faction}/{unit-id}.jpg


Example:


public/unit-images/orks/boyz.jpg
public/unit-images/space-marines/aggressor_squad.jpg


Folder structure:


public/
unit-images/
orks/
space-marines/
tyranids/
necrons/
chaos-space-marines/


Each faction gets its own folder.

---

# IMAGE NAMING RULES

Image filename must match the **unit id**.

Unit id example:


aggressor_squad


Image file:


aggressor_squad.jpg


This ensures:

• deterministic mapping
• easy referencing in the UI
• simple batch processing later

---

# INPUT DATA

The image pipeline relies on three data sources.

## 1. Unit dataset


data/factions/{faction}/units.json


Contains:


id
name
points
models_per_box
box_price


---

## 2. Kit mapping


data/kit-mappings/{faction}.json


Maps unit ids to kit slugs.

Example:


{
"aggressor_squad": "aggressor-squad"
}


---

## 3. Kit dataset


data/kits/{faction}.json


Contains kit metadata including slug.

Example:


{
"slug": "aggressor-squad",
"models_per_box": 3,
"price": 38
}


---

# DOWNLOAD PROCESS

For each unit:

1. Load unit id from


data/factions/{faction}/units.json


2. Find kit slug using


data/kit-mappings/{faction}.json


3. Construct image URL


https://www.games-workshop.com/resources/catalog/product/920x950/{slug}.jpg


4. Download the image

5. Save it to


public/unit-images/{faction}/{unit-id}.jpg


---

# DOWNLOAD RULES

The script must:

• skip image if file already exists  
• skip if file size > 5KB  
• validate file after download  
• continue if any download fails  
• log failed units  

This ensures the pipeline can be resumed safely.

---

# PERFORMANCE REQUIREMENTS

The pipeline must:

• avoid HTML scraping entirely  
• use direct CDN URLs  
• download images sequentially  
• complete quickly (<1 second per image)

Expected runtime:

| Faction | Units | Time |
|------|------|------|
| Orks | ~30 | ~5 seconds |
| Space Marines | ~80 | ~15 seconds |

---

# SCRIPTS

Two scripts must exist.

## Single faction download


scripts/download-faction-images.js


Usage:


node scripts/download-faction-images.js orks


Downloads all images for a faction.

---

## All factions download


scripts/download-all-images.js


Usage:


node scripts/download-all-images.js


This script must:

1. scan


data/factions


2. detect all factions

3. run the faction downloader for each.

---

# OUTPUT REPORT

Each run must print:


Faction: orks
Units processed: 30
Downloaded: 28
Skipped: 2
Failed: 0


---

# ERROR HANDLING

If an image cannot be downloaded:

• log the unit id  
• continue processing  
• do not crash the script

Example:


FAILED: beastboss


---

# RESUME SAFETY

The pipeline must be safe to rerun.

Existing images must **not be re-downloaded**.

This allows interrupted runs to resume without restarting.

---

# FUTURE PROCESSING

Images downloaded here will later be batch-processed in Photoshop.

Possible future steps:

• background removal  
• uniform cropping  
• color grading  
• icon overlays

Therefore **image naming and structure must remain consistent**.

---

# SUMMARY

Image pipeline rules:

• Use GW CDN only  
• No HTML scraping  
• Deterministic filenames  
• Fast downloads  
• Resume-safe behaviour  
• Clean folder structure