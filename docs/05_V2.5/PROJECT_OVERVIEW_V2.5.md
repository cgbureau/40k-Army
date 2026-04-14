# 40KARMY — PROJECT OVERVIEW v2.5

---

## 1. Project Definition

40KArmy is a Warhammer 40K army cost calculator.

It allows users to:

* Build an army using real gameplay units
* See total points cost
* See real-world monetary cost based on Games Workshop retail kits

The system bridges:

Gameplay data → Retail reality

This is the core value of the product.

---

## 2. System Status (V2.5)

The project is now:

* Functionally complete
* Architecturally stable
* Data-complete across all factions
* Production-ready

V2.5 represents the transition from:

“Building the system”
→
“Refining and improving the system”

---

## 3. Core Architecture (LOCKED)

The system operates on a strict 3-layer architecture:

Units
→ Kit Mappings
→ Retail Kits

Runtime enrichment connects these layers.

### Layer 1 — Units

Location:
data/factions/{faction}/units.json

Contains:

* id
* name
* points
* optional availability

Rules:

* NO pricing data
* Represents full gameplay universe
* Includes:

  * standard units
  * Forge World
  * Legends
  * allied-style entries

---

### Layer 2 — Kit Mappings

Location:
data/kit-mappings/{faction}.json

Maps:

unit_id → kit_slug

Rules:

* No pricing
* No model counts
* Many units can map to one kit
* Must match exact unit IDs and kit slugs

---

### Layer 3 — Retail Kits

Location:
data/kits/{faction}.json

Source of truth for:

* what Games Workshop sells
* model counts
* regional pricing

Contains:

* slug
* display name
* models
* prices { GBP, USD, EUR, AUD, CAD, PLN, CHF }

---

### Runtime Enrichment

Process:

unit
→ mapping
→ kit
→ enriched unit

Adds:

* models_per_box
* prices
* box_price

Critical rule:

```ts
return {
  ...unit,
  models_per_box,
  prices,
  box_price
}
```

The original unit must always be preserved.

---

## 4. Availability System

Units can have:

* LEGENDS
* FORGEWORLD
* ALLIED
* AWOL

### Definitions

LEGENDS
Legacy / unsupported units

FORGEWORLD
Specialist resin / FW range

ALLIED
Unit belongs to another faction’s retail ecosystem but is valid in gameplay context

AWOL
No confirmed retail kit mapping and no special availability

---

### Rules

* Mapping takes priority over availability
* Allied units can still have prices
* AWOL is acceptable (not an error state)
* Availability is descriptive, not corrective

---

## 5. Space Marines System (V2.5)

Space Marines use a **two-layer architecture**.

### Layer 1 — Base Space Marines

* Core units
* Base kit file
* Base mappings

### Layer 2 — Chapter Overlays

Examples:

* Blood Angels
* Dark Angels
* Space Wolves

Each chapter adds:

* additional kits
* additional mappings

---

### Runtime Behaviour

Active kits are dynamically built:

```ts
base kits
+ chapter kits (if selected)
```

---

### Unit Visibility Rules

For each unit:

IF no mapping → SHOW (AWOL / FW / LEGENDS)

IF mapping exists →
SHOW only if kit exists in active kit set

---

### Chapter Identification (Derived)

A unit is a chapter unit if:

* it has a mapping
* AND its kit does not exist in base kits

No unit-level tagging exists.

---

### Key Constraint

* No duplication of units
* No chapter field in unit data
* No mutation of base dataset

Everything is derived from:

* mappings
* kit files
* runtime logic

---

## 6. UI Architecture (Post Refactor)

The UI has been modularised to stabilise performance.

page.tsx is now a controller only.

Responsibilities:

* data loading
* state management
* totals calculation

Rendering is handled by components.

---

### Core Components

* CalculatorControls
* UnitTable
* UnitRow (memoized)
* ArmySummary
* MobileTotalsBar

---

### Performance Rules

* Unit rows must be memoized
* Table must not remount on updates
* Loading must not clear existing data
* Scroll position must be preserved

---

### Outcome

* No hydration flashes
* Smooth updates
* Stable mobile experience
* Maintainable codebase

---

## 7. Data System (V2.5)

The data system is now:

* complete across all factions
* structurally consistent
* validated by real users

---

### Coverage Snapshot

* Total Units: 1420
* Mapped: 922
* AWOL: 253
* ForgeWorld: 145
* Legends: 79
* Allied: 50

Mapped Coverage: ~65%
Resolved Coverage: ~84%

---

### Interpretation

Mapped = directly purchasable
Resolved = correctly classified

Resolved coverage is the true measure of completeness.

---

## 8. What V2.5 Achieved

* Full faction coverage
* Space Marines + chapter system complete
* Stable runtime enrichment
* Clean UI architecture
* Real-world validated dataset
* No architectural compromises

---

## 9. What This Project Is Now

The system is:

* kit-driven
* mapping-driven
* runtime-enriched

It is no longer experimental.

It is a stable platform.

---

## 10. What Must NOT Be Changed

The following are absolute constraints:

* Units must never contain pricing
* Kit files are the only pricing source
* Mapping layer must remain separate
* Runtime enrichment must remain intact
* No unit-level chapter tagging
* No duplication of units
* No breaking of 3-layer architecture

---

## 11. Known Limitations (Accepted)

* High AWOL counts in some factions
* Shared-kit pricing ambiguity
* Bundle / Combat Patrol kits not fully utilised
* Some mapping gaps remain

These are acceptable at this stage.

---

## 12. Next Phase Direction

The project has moved beyond system design.

Future work is refinement.

### Data

* Reduce false AWOL
* Improve mapping coverage
* Refine shared-kit logic

### Technical

* Smarter box allocation
* Bundle detection
* Performance at scale

### UX (Optional)

* AWOL vs Allied clarity
* Chapter clarity improvements

---

## 13. Final Positioning

40KArmy is now:

A complete, working, real-world useful tool
with a stable architecture and scalable foundation

The focus is no longer:

“Can we build this?”

The focus is now:

“How far can we take it?”

---

## END

