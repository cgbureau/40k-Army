# 40KArmy — Project State_v2.3

## Purpose

This document is the single current-state reference for the 40KArmy project.

It supersedes relying on fragmented chat history and should be treated as the primary briefing document for future chats. Other `.md` files remain valuable as deeper reference documents, but this file should describe:

- what 40KArmy is
- how the system currently works
- what has been completed
- what is in progress
- what has changed recently
- what the next priorities are
- how contributors should understand the project

---

# 1. Project Summary

40KArmy is a lightweight web tool that estimates the real-world retail cost of building a Warhammer 40K army.

Users choose a faction, add units, and the tool calculates:

- total points
- number of boxes required
- estimated total cost

The project is intentionally:

- fast
- static-data driven
- mobile-first
- easy to maintain
- useful to hobbyists planning purchases

The project has now moved beyond MVP validation and into a serious data-expansion phase.

---

# 2. Current Product State

## Live Status

The site is live on:

`40karmy.com`

Deployment model:

Git push → Vercel build → production deploy

The app is functioning as a real public product and has already received meaningful traffic and community interest.

---

## Audience / Usage

The project has already shown clear signs of real user demand.

Signals so far:

- Reddit launch generated strong early traffic
- Google has already begun sending traffic
- users are predominantly mobile
- US + UK are the strongest geographies
- users are clearly interested in faction-specific army cost pages

Key takeaways:

- the concept is validated
- mobile usability matters a lot
- complete faction coverage is now the most important product improvement
- army cost pages may become an important SEO traffic engine over time

---

# 3. Architecture (Current Canonical Model)

The project uses a 3-layer data architecture.

## Layer 1 — Units

Gameplay data only.

File family:

`data/factions/{faction}/units.json`

Each unit should contain gameplay-oriented information only:

- id
- name
- points
- optional availability
- neutral placeholders:
  - models_per_box: null
  - box_price: null
  - prices: null

Important rule:

Units must not contain real retail price data.

---

## Layer 2 — Kit Mappings

Unit → retail kit relationship layer.

File family:

`data/kit-mappings/{faction}.json`

Format:

`unit_id -> kit_slug`

Example:

`hexmark_destroyer -> necron-hexmark-destroyer`

Important rules:

- mappings contain no price data
- mappings contain no model counts
- mappings are the connection between gameplay data and retail data

---

## Layer 3 — Retail Kits

Retail source of truth.

File family:

`data/kits/{faction}.json`

Each kit contains:

- slug
- models
- prices by currency

Current active price support includes:

- GBP
- USD
- EUR
- AUD
- CAD
- PLN
- CHF

This kit layer is now the sole source of truth for:

- model count per box
- retail pricing
- regional pricing

---

## Runtime Enrichment

The UI no longer trusts price/model data directly inside units.

Instead, the runtime pipeline is:

`unit.id`
→ `kit-mappings/{faction}.json`
→ `kits/{faction}.json`
→ enrich unit in UI

This enrichment supplies:

- models_per_box
- prices

This is now the canonical system across the application.

---

# 4. AWOL / Availability Logic

A unit can appear in one of three non-standard retail states:

## AWOL

Meaning:

- no confirmed retail kit mapping exists

This is expected for:

- legacy units
- discontinued units
- units with no current retail equivalent
- units not yet mapped

AWOL now correctly means:

**no mapping exists**

It should not be used for units that already have a valid mapping.

---

## LEGENDS

Units may be explicitly tagged:

`"availability": "legends"`

These represent:

- legacy / legends datasheets
- units not currently part of normal retail reality

The UI displays these as a distinct label instead of AWOL where applicable.

---

## FORGEWORLD

Units may also be explicitly tagged:

`"availability": "forgeworld"`

These represent:

- Forge World / resin / specialist units
- edge-case retail reality outside the standard GW 40k range

The UI displays FORGEWORLD distinctly.

---

## Important Architecture Rule

Availability flags affect UI labeling only.

They do not replace the unit → mapping → kit pricing system.

If a Forge World or Legends unit has no standard retail mapping, it may still be unpriced. That is acceptable.

---

# 5. Major Data Architecture Cleanup Completed

A major architecture correction was completed in this project phase.

## Completed changes

### A. All pricing/model data was moved out of units.json
A cleanup script was created to reset all faction unit files so that:

- models_per_box = null
- box_price = null
- prices = null

This prevents stale or conflicting retail data from living in the gameplay layer.

### B. The app now enriches units at runtime from mappings + kits
This permanently solved the earlier bug where correctly mapped units still appeared AWOL.

### C. AWOL logic now depends on mapping existence
This is the key permanent rule:

- if a unit has a mapping, it is not AWOL
- if it does not have a mapping, it may show AWOL

### D. Units remain the gameplay layer only
This keeps the architecture clean and scalable.

---

# 6. Data Workflow (Current Manual / Hybrid Process)

The current faction completion workflow is:

## Step 1 — Populate kits
Retail kits are sourced from the official Games Workshop store and entered into:

`data/kits/{faction}.json`

Each kit includes:

- models
- regional prices

## Step 2 — Map units to kits
The faction’s units file and kits file are cross-referenced.

Result goes into:

`data/kit-mappings/{faction}.json`

Mappings are divided mentally into:

- safe exact mappings
- likely / loose mappings that require manual human judgment

## Step 3 — Sweep availability
Once retail kits are mapped, remaining units are reviewed and labeled where appropriate as:

- legends
- forgeworld

## Step 4 — Test locally
The faction is checked in the live UI to confirm:

- mapped units resolve price/model data
- truly unmapped units show AWOL
- FORGEWORLD / LEGENDS appear correctly
- totals and overview work correctly

## Step 5 — Push live
Once validated, changes are committed and pushed to Vercel.

---

# 7. New Data Pipeline Breakthrough — Wizard Mike

A major change happened during this project phase:

A contributor, Mike Earley, has begun helping with retail kit data production.

## What Mike is doing

Mike has built a scraper-assisted workflow using:

- Claude Code
- Playwright
- direct Games Workshop website extraction

This is important because earlier manual scraping attempts were slow and unreliable. Mike’s approach uses an actual browser automation workflow, allowing structured kit data to be pulled directly from GW.

This has the potential to massively accelerate the project.

---

## Requested scraper structure

The desired output shape for future scraper-generated kit files is:

- slug
- models
- prices
- year (separate field, if extractable)
- product url
- image url

Important slug rule:

- keep slugs stable
- remove trailing year from the slug itself where possible
- store year separately instead of embedding it in the slug

This avoids future mapping drift.

---

## Important scraper rule

Slug should be derived from the GW product URL slug, but normalized into the project’s stable slug format.

The key objective is stability, not decorative naming.

The slug must be consistent enough that it can be safely referenced by:

`kit-mappings/{faction}.json`

---

## Space Marine chapter rule agreed

For Space Marines, the project should use:

### Generic Space Marines file
Contains shared generic marine kits.

### Chapter files
Contain only chapter-specific units / kits.

Examples:

- space-marines = generic units
- space-wolves = unique Space Wolves units only
- blood-angels = unique Blood Angels units only
- dark-angels = unique Dark Angels units only
- black-templars = unique Black Templars units only
- deathwatch = unique Deathwatch units only

This avoids duplication of the entire generic marine range across every chapter file.

---

## Current contributor state

As of this project state:

- Mike has already completed at least one scraper-generated faction file (Sororitas) and indicated multiple additional factions are in progress
- this contributor workflow is still actively being discussed in the dedicated data chat
- this document only records that the scraper path now exists and may become the main acceleration route for faction kit population

---

# 8. Faction Progress Snapshot

## Manually completed in this phase
- Orks
- Necrons

These factions were manually swept through using the new architecture and runtime enrichment logic.

## Added / progressed after that
- Adepta Sororitas kits have been added from Mike’s scraper workflow
- Adeptus Custodes has since been added
- Adeptus Mechanicus is about to be added

Important note:

The dedicated data chat remains the active place for discussing live faction rollout and Mike coordination. This document records only the latest known state for briefing purposes.

---

# 9. UI / Product Changes Completed In This Phase

## A. Support link / Buy Me A Coffee
A support link was added to the live app.

It now appears near the main CTA area and is intended as a soft voluntary support mechanism.

This is not yet a major monetisation layer, but it exists and is live.

---

## B. Desktop header/footer cleanup
The desktop layout received multiple refinements, including:

- improved spacing
- centered logo/header balance
- more breathing room around the calculator
- improved footer positioning
- reduced clutter in desktop bottom content

These edits were fiddly and time-consuming, but the desktop view is now in a stronger place.

---

## C. Mobile UI remains a critical priority
The project still treats mobile as the main UX priority.

Key reason:

The majority of users are on mobile.

Mobile improvements remain one of the most important next product tasks.

---

## D. Sticky totals / overview direction
The mobile UI spec for sticky totals remains part of the active product direction.

The architecture and pricing logic must not be modified by future mobile UI work.

---

## E. Availability labels in UI
The UI now supports visual labeling of:

- AWOL
- LEGENDS
- FORGEWORLD

The key fix in this phase was ensuring these labels reflect the cleaned runtime enrichment logic rather than stale unit-level price data.

---

# 10. SEO / Content Work Completed

The project has already begun building SEO value through:

- metadata work
- faction cost pages
- internal cross-linking
- structured long-tail pages such as:
  - /space-marines-army-cost
  - /orks-army-cost
  - /necrons-army-cost
  - etc

These pages are already receiving some Google traffic.

This is significant because it suggests the project can grow through search over time, not just Reddit spikes.

---

# 11. Launch / Traffic / Validation Summary

The MVP / V2 period has already shown real traction.

Signals include:

- strong initial Reddit traffic
- people using the tool immediately
- community feedback about data accuracy
- interest from outside contributors
- email signups
- early supporter messaging
- Google beginning to surface the project in search

Key takeaway:

The project is no longer purely speculative. It has real audience validation and the main job now is improving completeness and usefulness.

---

# 12. Messaging / Community / Supporters

The project has started building a tiny but real early community.

Actions completed in this phase include:

- supporter email signup flow in use
- at least one project update email already sent
- plans to continue sending short builder-style updates
- Buy Me A Coffee support link now live
- contributor outreach now organically happening through the project itself

The communications tone should remain:

- honest
- builder-in-public
- short
- not corporate
- technical enough to be interesting, but still readable to normal hobbyists

---

# 13. Monetisation Direction

Current monetisation stack / direction:

## Live now
- Buy Me A Coffee support link

## Planned / preferred
- affiliate links to hobby retailers
- possible shopping / kit list export workflows
- potentially retailer click-throughs from unit or army breakdown pages

## Less preferred
- display ads

Core view:

This project is more likely to monetise well through:

- purchase intent
- affiliate clicks
- army shopping lists
- bundle / savings comparisons

rather than through generic SaaS subscription logic.

---

# 14. Current Known Issues / Caveats

## A. Dropdown duplication issue
There is / was a faction dropdown duplication issue (e.g. Custodes appearing twice). This is cosmetic and not a blocker, but should be fixed in core build work.

## B. Some local-vs-live quirks
A few temporary local-state / stale-cache oddities happened during development, but the live build generally reflected the correct logic after deployment.

## C. Still incomplete faction coverage
The biggest product limitation remains incomplete coverage. The project becomes much more compelling as more factions are completed.

## D. Bundle / Combat Patrol logic not yet implemented
Still planned, not yet live.

---

# 15. Core Rules That Must Not Be Broken

1. Units must not contain real retail price data.
2. Prices must live only in `data/kits/{faction}.json`.
3. Mappings must only map unit ids to kit slugs.
4. Runtime enrichment must resolve:
   `unit.id -> mapping -> kit`
5. AWOL should only mean:
   no mapping exists
6. Availability labels are UI metadata only:
   - legends
   - forgeworld
7. Future UI work must not break the pricing architecture.
8. Slugs must remain stable and deterministic.

---

# 16. Current Priorities

In practical order, the project priorities are now:

## 1. Complete faction kit coverage
This is the biggest value driver.

## 2. Continue mapping units to kits safely
Exact mappings first, judgment calls second.

## 3. Continue availability tagging
Legends / Forge World labeling where appropriate.

## 4. Improve mobile UX
Because the majority of users are mobile.

## 5. Bundle support
Combat Patrols / Battleforces / bundle logic.

## 6. Affiliate / retailer monetisation
Once enough traffic and confidence exists.

## 7. Expanded SEO pages
Continue compounding search visibility.

---

# 17. Recommended Chat Structure Going Forward

To avoid context fragmentation, the project should be split into only a few clear work chats:

## Core Build Chat
Use for:
- bugs
- UI
- code fixes
- integration
- layout
- deployment

## Data Pipeline Chat
Use for:
- faction datasets
- mappings
- Mike
- scraper workflow
- availability tags

## Marketing / Comms Chat
Use for:
- emails
- Reddit posts
- updates
- changelog style messaging
- supporter communications

This file (`Project State_v2.3`) should be used to brief any new 40KArmy chat.

---

# 18. Immediate Next-Step Summary

At the moment the project stands in a strong place:

- architecture is much cleaner
- runtime enrichment now works correctly
- Orks and Necrons were manually brought into the new system
- Sororitas has entered via scraper support
- Custodes is now added
- Mechanicus is next
- Mike may dramatically accelerate remaining faction coverage
- the product has real signs of usage, validation, and future monetisation potential

The next major unlock is simple:

**complete faction coverage faster**

If the scraper workflow holds, the entire project timeline compresses significantly.

---

# 19. Short Version

40KArmy is now a validated niche utility with:

- a working live product
- a clean 3-layer retail architecture
- fixed runtime enrichment
- a functioning AWOL / Legends / Forge World system
- live supporter communication
- early SEO traction
- a contributor helping automate GW kit data extraction

The product is no longer just an experiment.

It is now a real tool in active build-out.

---

⚠️ This document is now superseded by PROJECT_OVERVIEW_v2.5.md  
This file is retained for historical reference only.