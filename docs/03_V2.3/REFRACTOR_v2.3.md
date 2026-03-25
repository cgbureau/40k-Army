# 40karmy – REFRACTOR v2.3
UI Stability & Architecture Cleanup

This document defines the controlled refactor plan for the 40karmy application.

The goal is to improve UI stability, eliminate hydration glitches, and prepare the
codebase for scale WITHOUT modifying the core data architecture.

This is NOT a rewrite.

All existing data pipelines and logic must remain intact.


--------------------------------
CORE ARCHITECTURE (DO NOT CHANGE)
--------------------------------

The application uses a 3-layer data architecture.

Layer 1 — Gameplay Data
data/factions/{faction}/units.json

Contains:
- unit id
- unit name
- points
- model count
- availability (optional)

This layer MUST NEVER contain pricing.


Layer 2 — Kit Mappings
data/kit-mappings/{faction}.json

Maps:
unit_id → kit_slug

Contains no pricing data.


Layer 3 — Retail Kits
data/kits/{faction}.json

Contains:
- kit_slug
- model_count
- prices { GBP, USD, EUR etc }


Runtime enrichment resolves:

unit
→ mapping
→ kit
→ models_per_box
→ retail price


Availability flags:

availability: "forgeworld"
availability: "legends"

These are UI labels only.

If a unit has no kit mapping it is marked AWOL.


This architecture MUST NOT change.


--------------------------------
GOALS OF THIS REFACTOR
--------------------------------

1. Stabilize the UI
2. Remove hydration flashes
3. Eliminate unnecessary re-renders
4. Improve page.tsx maintainability
5. Prepare the codebase for future features


Future features that must remain possible:

- bundle detection
- affiliate links
- multiple currencies
- list import
- cross-faction lists
- detailed unit insights
- dark mode


The refactor must NOT block these.


--------------------------------
CURRENT PROBLEM
--------------------------------

page.tsx has become too large (~1800 lines) and performs too many responsibilities.

This causes:

- hydration flashes
- table remounts
- scroll resets
- janky UI updates
- hard-to-maintain code


The solution is to separate rendering from state logic.


--------------------------------
TARGET ARCHITECTURE
--------------------------------

page.tsx becomes a controller only.

Responsibilities:

- load faction list
- load units
- manage state
- compute totals
- pass props to components


All rendering logic moves into components.


Target page.tsx size:

150–250 lines.


--------------------------------
NEW COMPONENT STRUCTURE
--------------------------------

Create:

/components/calculator/


Inside create:

CalculatorControls.tsx
UnitTable.tsx
UnitRow.tsx
ArmySummary.tsx
MobileTotalsBar.tsx


Responsibilities:


CalculatorControls
------------------

Handles:

- search input
- faction selector
- points selector
- discount selector


UnitTable
---------

Renders the unit table.

Receives:

- units
- selected army
- add/remove handlers


UnitRow
-------

Represents a single unit row.

Must be wrapped with:

React.memo()

to prevent full table re-renders.


ArmySummary
-----------

Displays:

- selected units
- total points
- total cost
- box count


MobileTotalsBar
---------------

Sticky bar for mobile showing:

- points
- total cost
- unit count


--------------------------------
PERFORMANCE RULES
--------------------------------

UnitTable must NOT rerender fully when a unit is added.

Use:

React.memo(UnitRow)


Loading units must NOT clear the table.

Do NOT use:

setUnits([])

Instead use:

loading state flags.


--------------------------------
UX IMPROVEMENTS
--------------------------------

Prevent scroll jumping when adding units.

Maintain scroll position after state updates.


Add subtle mobile "Back to Top" button.

Button should:

- appear after scrolling
- sit bottom-right
- low opacity
- minimal UI impact


--------------------------------
STRICT RULES
--------------------------------

The following systems must remain unchanged:

- unit enrichment
- pricing pipeline
- kit mapping logic
- availability tag logic
- army serialization
- URL army param
- data folder structure


Refactor ONLY affects UI structure.


--------------------------------
REFRACTOR ORDER
--------------------------------

Perform changes in small steps.

Step 1
Extract UnitRow component

Step 2
Extract UnitTable component

Step 3
Extract CalculatorControls

Step 4
Extract ArmySummary

Step 5
Add memoization

Step 6
Add loading state improvements

Step 7
Add mobile totals bar


Each step must preserve functionality.


--------------------------------
TESTING REQUIREMENTS
--------------------------------

After each step verify:

- units load correctly
- faction switching works
- units can be added
- totals calculate correctly
- availability labels still show
- AWOL units display correctly


No regression allowed.


--------------------------------
FINAL TARGET
--------------------------------

The refactor is complete when:

- page.tsx < 250 lines
- UI updates are smooth
- table does not flash
- faction switching is stable
- unit selection does not reset scroll
- codebase is modular


--------------------------------
END
--------------------------------