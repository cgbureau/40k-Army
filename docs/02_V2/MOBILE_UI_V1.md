# 40KArmy – Mobile UI Specification V1

This document defines the mobile UX rules for the 40KArmy application.

This phase focuses ONLY on UI and layout improvements.

The data pipeline, dataset structure, and API architecture MUST NOT be modified.

Reference documents:

ARCHITECTURE_V1.md  
DATA_PIPELINE_V1.md  
PROJECT_OVERVIEW_V1.md

All changes must remain compatible with these systems.

---

## Design Goal

The application must provide a fast, clear and comfortable experience for mobile
users.

Analytics show that over 70% of users access the tool on mobile devices.

Mobile UI must therefore be treated as a first-class experience.

The interface should feel closer to a native tool than a compressed desktop
layout.

Primary user action:

```text
scroll → tap + → build army
```

---

## Layout Model

The application supports two layout modes.

- Desktop Layout
- Mobile Layout

---

## Desktop Layout

Desktop layout remains unchanged.

Structure:

```text
| Units Panel | Army Summary Panel |
```

Units panel contains:

- search
- target points
- faction selector
- unit list

Army summary panel contains:

- selected units
- cost breakdown
- totals
- export/reset

---

## Mobile Layout

Mobile layout switches to a single vertical flow.

Panels stack vertically.

Structure:

```text
Header
Controls
Unit List
Army Summary
Actions
```

---

## Breakpoints

Mobile layout activates at:

```text
max-width: 900px
```

Desktop layout activates at:

```text
min-width: 901px
```

---

## Mobile Layout Structure

Order of sections:

1. Header
2. Currency selector
3. Search bar
4. Target points buttons
5. Faction selector
6. Unit list
7. Army summary
8. Totals
9. Actions (Copy / Export / Reset)

---

## Unit Row Layout (Mobile)

Each unit row becomes a two-line layout.

Example:

```text
Aggressor Squad
95pts • 3 models per box • £38

[-] 0 [+]
```

Rules:

- unit name must never truncate
- price and model count appear under name
- add/remove buttons must be easily tappable
- minimum tap target size: 44px

---

## Army Summary Behaviour

Army summary appears below the unit list in mobile layout.

It must always show:

- Selected units
- Cost breakdown
- Totals

Optional improvement:

A sticky "View Army" button may be added later.

---

## Landscape Behaviour

When device width exceeds 900px (including landscape phones):

The layout may switch to desktop split mode.

---

## Currency Selector

The currency selector must not overlap the logo on small screens.

It should appear below or beside the header depending on available width.

---

## Scrolling Behaviour

The mobile page should scroll as a single continuous document.

Avoid nested scroll containers where possible.

---

## Performance Requirements

The mobile UI must remain extremely lightweight.

Do not add:

- heavy UI frameworks
- unnecessary state libraries
- client-side routing changes

The application must remain a simple static-data frontend.

---

## Accessibility

Tap targets must be comfortable.

Minimum target size:

```text
44px
```

Text must remain readable at standard mobile zoom.

---

## Architecture Safety

The following files must NOT be modified during mobile UI development:

- `data/`
- `scripts/`
- data pipeline generators

API routes may only be adjusted for minor formatting if required.

No changes should affect:

- dataset generation
- pricing logic
- cost calculations

---

## Scope of Changes

Allowed changes:

- layout restructuring
- CSS / Tailwind updates
- component layout adjustments
- improved unit row formatting
- improved mobile spacing

Not allowed:

- pipeline changes
- pricing model changes
- new backend services
- new databases

---

## End Goal

Mobile users must be able to:

- choose faction
- search units
- add units quickly
- see army totals clearly
- export/share the army

without layout friction.

The experience should feel fast, clean, and intuitive.
