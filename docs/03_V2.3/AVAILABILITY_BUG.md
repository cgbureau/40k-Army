# Availability Rendering Bug (FORGEWORLD / LEGENDS showing as AWOL)

This document records the debugging process and final solution for a recurring bug where units with an `availability` tag (e.g. `"forgeworld"` or `"legends"`) incorrectly display as `AWOL` in the UI.

This issue first appeared when integrating **Adeptus Custodes** and later appeared again when integrating **Adeptus Mechanicus**.

The purpose of this document is to ensure the issue can be diagnosed and fixed quickly in the future without repeating the full debugging process.

---

# Expected Behaviour

Units in `units.json` may include an availability tag:


"availability": "forgeworld"


or


"availability": "legends"


If a unit has:

models_per_box = null  
prices = null  

but **availability exists**, the UI should render:


FORGEWORLD


or


LEGENDS


If **no availability exists**, the UI should render:


AWOL


Correct priority:

1. Show **price + models** if kit data exists
2. Show **FORGEWORLD / LEGENDS** if availability exists
3. Show **AWOL** only if availability is missing

---

# Symptom

Units with:


"availability": "forgeworld"


render as:


AWOL


Example:


Secutarii Hoplites → AWOL (incorrect)


Expected:


Secutarii Hoplites → FORGEWORLD


---

# Initial Suspicions

Several potential causes were investigated.

## 1. Units JSON missing availability

Checked faction files:


data/factions/adeptus-custodes/units.json
data/factions/adeptus-mechanicus/units.json


Confirmed availability fields exist.

Example:


{
"id": "secutarii_hoplites",
"availability": "forgeworld"
}


Result:  
❌ Not the cause.

---

## 2. Enrichment dropping availability

Investigated:


enrichUnitsWithKits()


Confirmed every return spreads the unit:


return { ...unit }


or


return {
...unit,
models_per_box,
prices,
box_price
}


Meaning fields like:


availability
id
name
points


are preserved.

Result:  
❌ Not the cause.

---

## 3. Renderer logic

Renderer structure inside:


filteredUnits.map(...)


Looked like:


if (hasKitData) → show price

else
if availability === "forgeworld" → FORGEWORLD
if availability === "legends" → LEGENDS
if !availability → AWOL


At first glance this looked correct.

However the bug persisted.

---

# Debug Logging

Temporary logging was added:


console.log("RAW UNITS", units)
console.log("ENRICH START", unit)
console.log("ENRICH END", unit)


This confirmed:

• availability existed in raw units  
• availability existed after enrichment  
• renderer still produced AWOL

---

# Final Root Cause

The issue occurs when **availability is lost or misinterpreted during rendering logic**.

Specifically:

The AWOL fallback was triggered when the renderer incorrectly evaluated the availability condition.

This happens when:


!unit.availability


evaluates true.

Possible triggers:

• availability undefined  
• availability overwritten  
• availability passed through an unexpected code path

---

# Final Fix

Ensure the renderer strictly follows this order:


const hasKitData =
unit.models_per_box !== null &&
unit.prices !== null


Rendering priority must be:


if (hasKitData)
show price

else if (unit.availability === "forgeworld")
show FORGEWORLD

else if (unit.availability === "legends")
show LEGENDS

else
show AWOL


AWOL must **only render when availability is missing**.

---

# Permanent Rule

The renderer must **never check AWOL before availability**.

Correct logic order:


price
→ availability
→ AWOL


---

# Debug Procedure (Future)

When this bug appears again:

1. Check `units.json` contains availability
2. Check `enrichUnitsWithKits` spreads `...unit`
3. Log raw units and enriched units
4. Verify renderer priority order
5. Ensure AWOL only triggers when `!unit.availability`

---

# Files Involved


app/page.tsx
data/factions/{faction}/units.json
data/kits/{faction}.json
data/kit-mappings/{faction}.json


---

# Notes

This bug appeared during integration of:

• Adeptus Custodes  
• Adeptus Mechanicus

The underlying cause is related to **renderer logic priority and availability propagation**.