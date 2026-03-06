# 40KArmy MVP UI Implementation Spec

## Purpose

This document defines the MVP user interface redesign for the 40KArmy web app.

The app already has a working engine and existing product logic. This redesign is **UI-only**.

The goal is to restyle the current working Next.js page so it matches the provided visual direction:

- retro / pixel / tabletop utility feel
- monochrome-green interface
- thick dark borders
- compact tactical layout
- logo-led header
- left builder panel + right summary panel

This is not a marketing page. It is a **tool UI**.

---

## Critical Rule: Preserve Existing Logic

The following already work and **must not be broken or rewritten unless absolutely necessary for layout integration**:

- faction selector
- search input
- target points input
- target points preset buttons
- quantity controls
- points calculation
- boxes calculation
- cost calculation
- army summary generation
- cost breakdown generation
- export list button
- copy link button
- URL persistence / query param syncing
- sticky totals behaviour, unless reworked to fit the new layout while preserving visibility

You are redesigning the interface, not rebuilding the product logic.

Prefer to **reuse existing state and calculations**.

---

## Existing Product Structure

The app currently includes these functional regions:

1. Header / title
2. Faction selector
3. Search input
4. Target points input
5. Preset buttons
6. Scrollable unit list
7. Army summary
8. Cost breakdown
9. Totals display
10. Copy link button
11. Export list button

The redesign must continue to expose all of these features clearly.

---

## Design Intent

The interface should feel like:

- a retro strategy utility
- a codex / terminal / tabletop reference tool
- a focused hobby app
- compact, not airy
- graphic and structured, not soft SaaS

Avoid:
- rounded “modern SaaS cards”
- shadows
- glossy styling
- gradients
- oversized whitespace
- playful consumer app styling

Prefer:
- strong outlines
- tight spacing
- deliberate visual hierarchy
- grid / table-like structure
- monospace data display

---

## Brand Assets

### Logo
Use this file:

`/public/40KArmy_Logo.svg`

Display it centered at the top of the page.

### Colors

Primary background:
`#B2C4AE`

Primary text / borders:
`#231F20`

These two colors should drive almost the entire UI.

Suggested use:
- page background: `#B2C4AE`
- panels: slightly transparent or same green tone
- text: `#231F20`
- borders / dividers: `#231F20`
- buttons: green background with dark borders
- input fields: slightly darker or inset green variation if needed

Do not introduce unrelated accent colors unless needed for functional states.

### Fonts

#### Display / headings
Use Google Font:
`Workbench`

Use for:
- logo-adjacent title
- section headings
- totals heading
- major UI labels if appropriate

#### Data / body / table text
Use Google Font:
`IBM Plex Mono`
(or a very close monospace fallback if needed)

Use for:
- unit rows
- values
- labels
- buttons like COPY / EXPORT
- points / costs / box data
- search / form UI

---

## Page Layout Overview

The page should be a centered composition with a maximum width suitable for desktop-first use.

### Overall page structure

1. Top header zone
2. Main two-column content area

### Header zone
Centered logo at the top.
Below the logo, centered subtitle:

`WARHAMMER 40K ARMY CALCULATOR`

This should feel like a product header, not a blog title.

### Main content area
Two columns:

- **Left column**: army builder interface
- **Right column**: army summary, cost breakdown, and totals

Desktop layout should match the supplied design direction.

Approximate proportion:
- left column: ~68–72%
- right column: ~28–32%

On smaller screens, stack vertically if needed, but preserve all features.

---

## Header Specification

### Header container
Centered horizontally.
Top margin/padding should feel deliberate and balanced.

### Logo
- centered
- prominent
- not oversized to the point of crowding layout
- maintain aspect ratio
- use SVG cleanly

### Subtitle
Text:
`WARHAMMER 40K ARMY CALCULATOR`

Style:
- Workbench font
- uppercase
- centered
- dark text
- moderate spacing below logo

---

## Main Layout Specification

Use a two-panel bordered layout.

### Shared panel style
Both left and right panels should share a consistent visual language:

- solid border using `#231F20`
- thicker border than typical Tailwind defaults
- no drop shadow
- square or near-square corners
- transparent or subtle green background
- internal padding
- strong graphic structure

Suggested visual idea:
“boxed control panel”

---

## Left Panel: Army Builder

The left panel contains:

1. Search field
2. Controls row:
   - target points label/input
   - preset buttons (500 / 1000 / 2000)
   - faction selector aligned to the right
3. Units heading / small section label
4. Scrollable unit list

### Search field
Position: top of left panel

Placeholder:
`Search...`

Style:
- full width
- dark border
- green-toned fill
- monospace text
- compact height
- should feel like an input field inside a utility interface

Avoid:
- pill shapes
- oversized input height
- soft shadows

### Controls row
Below the search field.

Must contain:
- target points label
- preset buttons 500 / 1000 / 2000
- a visual zero/off state if target points is 0
- faction selector aligned to the right side of the row

This row can wrap slightly on smaller screens, but should stay compact.

### Target points
Should remain fully functional.

Default state is already 0 and should remain so.

If target points = 0:
- this is effectively “no target”
- UI should not feel broken or empty

A small representation like:
`0---`
or equivalent visual treatment is acceptable if easy to integrate, but do not force this if it complicates functionality.

Primary requirement:
the input remains usable and clear.

### Preset buttons
Keep:
- 500
- 1000
- 2000

Compact, tactical styling.
These should feel like small utility buttons, not big CTA buttons.

### Faction selector
Place on the right side of the controls area.

Label:
`Faction`

Should remain fully functional and future-ready for more factions.

Even though only Space Marines currently exists, the selector should still appear.

---

## Units Section

### Section label
Add a small label:
`Units`

This should sit above the unit list and help structure the panel.

### Unit list container
This must remain scrollable.

It should visually resemble a compact table/list, not separate cards.

Use:
- tight row spacing
- column alignment
- monospace data
- consistent row rhythm

### Unit row structure
Each row should show:

- Unit Name
- Points
- Models per box
- Price per box
- Quantity controls

Approximate desktop row layout:

`OUTRIDER SQUAD    80pts    3mdls/pb    £40.00    [-] 0 [+]`

Important:
This should still be readable and flexible with longer names.

Recommended approach:
Use a CSS grid or flex layout with fixed/minmax columns.

Suggested columns:
1. unit name
2. points
3. models per box
4. price
5. controls

### Unit name
- dominant within row
- uppercase is acceptable
- monospace or body font
- strong readability
- truncate carefully if needed, but prefer wrapping only if layout requires it

### Points
Display like:
`80pts`

### Models per box
Display like:
`3mdls/pb`

If models_per_box is null:
display a fallback like:
`--`

### Box price
Display like:
`£40.00`

If box_price is null:
display a fallback like:
`--`

### Quantity controls
Must preserve existing behaviour:
- minus button
- current quantity
- plus button

Display format should be compact:
`[-] 0 [+]`

Buttons should fit the retro UI:
- bordered
- square-ish
- no shadow
- compact
- dark text
- green background

### Unit row separators
Optional but recommended:
- subtle bottom border or spacing between rows
- keep it clean and dense

Do not convert rows into standalone rounded cards.

---

## Right Panel

The right panel contains, in this order:

1. Top action row
   - COPY
   - EXPORT
2. Army Summary
3. Cost Breakdown
4. Totals

This panel is more informational and should remain visually secondary to the builder, but still strong and readable.

---

## Top Action Row

At the top of the right panel, place two actions:

- `COPY`
- `EXPORT`

These correspond to the existing:
- copy army link button
- export army list button

Use the existing functionality.
Only restyle and relabel visually if needed.

Style:
- compact
- monospace
- aligned horizontally
- simple bordered controls or text-buttons
- visually integrated into panel top edge

Do not remove the copied feedback behaviour.
If the existing temporary labels like `Copied!` or `Copied List!` remain, that is acceptable.

---

## Army Summary Section

Section heading:
`Army Summary`

Below it, list all currently selected units.

Format example:

`VINDICATOR                                   x1`
`WHIRLWIND                                    x1`

Requirements:
- only show units where quantity > 0
- keep existing logic
- if none selected, show an empty state such as:
  `No units selected`

Presentation:
- simple vertical list
- compact
- readable
- aligned

---

## Cost Breakdown Section

Section heading:
`Cost Breakdown`

For each unit where:
- quantity > 0
- models_per_box is available
- box_price is available

Show:

- unit name
- quantity
- boxes required
- total cost for that unit

Format example:

`VINDICATOR   Qty:1   Bxs:1   £47.50`

Requirements:
- preserve existing calculation logic
- skip units without cost data
- if no valid units selected, show:
  `No units with cost data selected`

Presentation:
- compact rows
- monospace
- no card-within-card styling
- simple structured list

---

## Totals Section

Place at the bottom of the right panel.

This should feel visually anchored and important.

Section heading:
`Totals`

Show:
- Current Points
- Total Boxes
- Estimated Cost

If target points > 0, also show:
- Remaining Points

Use existing logic for whether Remaining Points appears.

### Display style
This should not remain as modern boxed KPI cards.
Instead, shift toward a more integrated information block.

Example structure:

Current Points  
`375pts`

Total Boxes  
`2`

Estimated Cost  
`£92.50`

If shown:

Remaining Points  
`1625`

Layout can be:
- two-column
- stacked
- small grid
- or asymmetric block

But it should fit the retro utility style.

### Sticky behaviour
If possible, preserve totals visibility.
However, if the new right-panel layout naturally keeps totals visible without the previous sticky implementation, that is acceptable.

Priority:
- clear visibility
- no broken overlapping
- no awkward mobile issues

---

## Responsive Behaviour

This MVP is desktop-first, but should not break on smaller screens.

### Desktop
Use the intended two-column layout.

### Tablet / small desktop
Can reduce spacing slightly, keep two columns if possible.

### Mobile
Panels may stack vertically:
- header
- left panel
- right panel

The UI must remain functional.

On smaller screens:
- unit rows may wrap more
- controls may stack
- faction selector may move below target controls if needed

Do not sacrifice functionality for pixel-perfect desktop imitation.

---

## Tailwind / Implementation Notes

The project already uses Next.js + Tailwind.

Use Tailwind utilities where sensible.

If cleaner, you may:
- use CSS variables for the two brand colors
- add utility classes in globals if needed for fonts/colors
- use Next.js font loading for Google Fonts

Recommended:
- import fonts with `next/font/google`
- apply Workbench to headings
- apply IBM Plex Mono to data/body

Avoid introducing heavy custom CSS unless necessary.

---

## Implementation Priorities

Priority order:

1. Preserve all current functionality
2. Match the new layout structure
3. Apply fonts and color palette
4. Convert units into compact table-style rows
5. Restyle summary / breakdown / totals to match retro UI
6. Ensure responsive stability

If a visual detail from the mock conflicts with usability or existing functionality, prefer usability while staying faithful to the design direction.

---

## Acceptance Criteria

The implementation is successful if all of the following are true:

### Functional
- all current calculations still work
- search still works
- faction selector still works
- target points still works
- preset buttons still work
- quantity controls still work
- army summary still updates
- cost breakdown still updates
- copy army link still works
- export list still works
- URL query persistence still works

### Visual
- logo appears at top center
- page uses green + black palette
- headings use Workbench
- data uses IBM Plex Mono or equivalent
- left/right panel layout matches the described composition
- unit list feels compact and table-like
- right panel contains summary, breakdown, and totals
- old SaaS-style cards/shadows are removed
- UI feels like a retro tabletop utility tool

### Technical
- no runtime errors
- no broken imports
- no hydration issues
- layout remains usable across desktop and smaller screen sizes

---

## Final Instruction

Implement this as a polished MVP UI refactor of the existing page.

Do not remove features.
Do not simplify working functionality.
Do not replace the app with a mockup.

This must remain a fully working product page with the new visual design applied.