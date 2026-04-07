
## DATA OPERATIONS v2.4



1. tightening incomplete unit files
2. identifying units missing from faction unit files
3. correcting gaps created by earlier assumptions about overlap
4. cleaning up Chaos allied-unit removals
5. resolving shared-kit / shared-box pricing edge cases
6. preparing the data layer for a cleaner UX pass later

This is a refinement phase, not a rebuild phase.

---

# 2. Canonical Data Architecture

The project still uses the same strict layered model.

```txt
Units
→ Kit Mappings
→ Retail Kits
→ Regional Prices

This architecture must not be broken.

Layer 1 — Units

Location:

data/factions/{faction}/units.json

Units are gameplay-layer data only.

Each unit contains:

id
name
points
optional availability
neutral placeholders:
models_per_box: null
box_price: null
prices: null

Important rule:

Units must not be manually populated with retail prices.

Units are the gameplay universe, not the retail store.

Layer 2 — Kit Mappings

Location:

data/kit-mappings/{faction}.json

Format:

unit_id -> kit_slug

Example:

"accursed_cultists": "chaos-space-marines-accursed-cultists-2022"

Important rules:

keys must match unit.id
values must match the exact parent kit slug
many units may map to one kit
mappings contain no prices
mappings contain no model counts
Layer 3 — Retail Kits

Location:

data/kits/{faction}.json

Retail kits are the source of truth for what Games Workshop actually sells under that faction page.

Each kit defines:

display name
slug
models
prices by currency
optional year / image metadata

Important rule:

If a kit appears in the faction kit file, it is considered valid for that faction within this project.

That remains true even when the kit is clearly shared with another faction in game terms.

The project models GW storefront reality, not abstract lore purity.

Runtime Enrichment

The frontend runtime process is:

unit.id
→ mapping lookup
→ kit lookup
→ enrich unit with:
   - models_per_box
   - prices
   - box_price

Important implementation rule:

The enrichment must always spread the original unit.

Correct pattern:

return {
  ...unit,
  models_per_box,
  prices,
  box_price
}

This preserves:

id
name
points
availability


3. Current Data Rules (Locked)

These rules are now locked and should be repeated in any new data chat.

Core rules
We do not edit or remove units from units.json casually.
Units files represent full faction datasheets, including edge cases, old units, FW, Legends, and allied-style entries.
Units should only be removed if they are clearly incorrect cross-faction anomalies.
Kit files are the source of truth for what appears on the GW faction page.
If a unit has a corresponding kit in that faction kit file, it must be mapped.
Mapping completeness is the priority.
Availability is secondary to mapping.
If a kit exists in the faction kit file, cross-faction concerns do not block mapping.
Availability rules
forgeworld only when clearly FW / specialist resin / specialist range
legends only when clearly Legends / legacy
unmapped but valid units may remain AWOL
AWOL is acceptable when no confirmed retail kit exists
Operational warnings
Do not suggest “cleaning” unit files by default
Do not remove units simply because they appear to overlap with another faction
Do not assume cross-listed units are wrong
Do not collapse multiple retail kits into one if the kit file lists them separately
Do not invent kits not present in the faction kit file


4. What Has Been Completed Through V2.3

The project has now completed a substantial amount of faction data work.

Factions substantially completed / integrated in the new architecture

These have gone through QC, mapping, and availability work to varying degrees:

Adepta Sororitas
Adeptus Custodes
Adeptus Mechanicus
Aeldari
Chaos Daemons
Chaos Knights
Chaos Space Marines
Death Guard
Drukhari
Genestealer Cults
Grey Knights
Imperial Agents
Imperial Knights
Leagues of Votann
Necrons
Orks
T’au Empire
Thousand Sons
Tyranids
World Eaters

Additional factions may also exist in-tree, but the above list reflects the major completed / materially progressed work in this current operational phase.

Major completed achievements
runtime enrichment now works correctly
AWOL is no longer derived from stale unit price data
kit files are now the real retail source of truth
many factions have been manually QC’d
many mappings have been manually verified
major FW / Legends passes have been done
Reddit launch validated the usefulness of the tool
real users have now identified remaining data gaps


5. What Is Still Missing

Two major faction kit datasets are still missing from the current data system:

Space Marines
Astra Militarum

These are the final major missing retail kit files needed for the current broad faction coverage pass.

Current plan for these missing factions

The original contributor who had been supplying scraper-assisted GW retail kit data is currently out of action.

Therefore:

Space Marines kit data is currently blocked
Astra Militarum kit data is currently blocked

A new developer has reached out offering help.

Current intended plan:

task the new dev with scraping / producing:
Space Marines kit data
Astra Militarum kit data
require output in the existing kit file schema
keep the same project rule:
faction kit file must represent what appears on the GW faction page

These two factions are considered the big unlock for V2.5, not V2.4.

6. What V2.4 Specifically Means

V2.4 is now the “tightening and correction” phase.

It contains four main workstreams.

Workstream A — Unit completeness via reverse checking

This is the most important new workflow change.

Previously the project mostly worked:

UNITS → KITS → MAPPINGS

Now V2.4 will intentionally reverse that direction:

KITS → check against UNITS

The purpose is to identify:

kits that exist
but no corresponding unit exists in the faction unit file

This is the main response to Reddit feedback such as:

“this unit is missing”
“that commander is missing”
“Battlescribe shows this but your site doesn’t”

New V2.4 method

For a faction:

load the kit file
load the unit file
cross-reference them manually in chat
identify:
missing units
missed mappings
incorrect assumptions
if a kit clearly implies a missing unit:
add that unit to the faction unit file
source its points / exact unit record from Wahapedia

Important:

This is expected to produce only a limited number of missing units per faction, not total rewrites.

The goal is surgical completion.

Workstream B — Chaos allied-unit restoration

An important mistake happened in earlier Chaos cleanup work.

Some units were removed from Chaos faction unit files because they were assumed to be duplicate overlap.

This was wrong.

In many cases they were:

allied units
cross-listed units
legal or storefront-valid units that should remain in the faction file

V2.4 Chaos fix

Chaos factions need to be checked against the base master unit dataset.

Goal:

compare Chaos faction unit files against the master source
identify units wrongly removed
restore allied or cross-listed units where appropriate

Important rule:

Units that belong in a faction file as allied / cross-listed entries should remain in the file even if their retail kit sits elsewhere or appears AWOL in that faction context.

This is a data correction pass.

This should be done late in the V2.4 cycle, after the general unit-tightening work begins.

Workstream C — Shared box / multi-unit price mismatch cleanup

This is another important V2.4 task.

Some units currently produce incorrect cost behavior because several individual units all come from the same shared retail box.

Example conceptually:

Unit A
Unit B
Unit C

all come from one £40 box

But the current system may behave like:

A = £40
B = £40
C = £40

when selected individually

This inflates army cost incorrectly.

V2.4 price mismatch cleanup goal

Identify units where:

several distinct unit entries actually come from a single shared kit
pricing is effectively being overcounted

These should be reviewed faction by faction.

This does not mean changing the 3-layer architecture.

It means identifying where mapping or enrichment logic needs to better reflect shared-box reality.

This is expected to be a careful, smaller pass after the main unit-completeness work.

Workstream D — AWOL / allied data cleanup preparation

The full AWOL / allied distinction is partly a UX problem and will likely be implemented later in UI terms.

However, the data layer still needs tightening now.

Data-side goal in V2.4

Make sure the dataset clearly distinguishes between:

true missing units
true unmapped units
cross-faction / allied units that are valid but may not have native faction kits

This is not necessarily a full schema change in V2.4.

But the data work done in V2.4 should prepare the project for a later AWOL vs allied / external UX distinction.

7. Current Operational Workflow For V2.4

The workflow for this phase is now different from the original mapping phase.

Old workflow
QC kit file
map units to kits
tag remaining units

V2.4 workflow
cross-reference kit file back against unit file
find units that should exist but do not
patch missing unit entries
find units that exist but are not mapped
verify remaining AWOL entries
then check special price / shared-box issues
How this chat should now be used

For each faction, the user should provide:

kit file
unit file

The assistant should return:

missing units
missed mappings
wrong / suspicious mappings if any
true AWOL / FW / Legends edge cases

No architecture drift.
No random cleanup suggestions.
No unit purges unless clearly justified.

8. Faction Handling Rules Learned So Far

The following lessons have now been learned and should be preserved.

A. Kit file is storefront truth

If a kit is in the faction kit file, it can be used for mapping in that faction.

This includes cases like:

Ynnari units mapping to Drukhari kits present in Aeldari
cross-listed Chaos kits
cross-listed Imperial kits in fringe cases

Do not block mapping just because the kit is “really from another faction” in lore or codex terms.

If it is in the faction kit file, it is valid for this project.

B. Some subfaction kit files were redundant

This became especially clear in:

Aeldari
Chaos Space Marines

In those cases, the master faction file already contained the relevant subfaction kits.

Therefore the correct move was:

use the master file
ignore redundant sub-files

This reduced duplication and conflict risk.

C. Grey Knights are a true separate faction

Grey Knights should not be folded into Space Marines logic.

Even if GW visually groups them near Space Marines on the store, they should remain their own faction in this project.

D. Duplicate faction slugs can exist in-tree and be annoying

Example:

custodes
adeptus-custodes

This is untidy, but if removing a duplicate breaks build assumptions, do not force the cleanup in the middle of a data pass.

It can be deferred.

Cleanliness matters, but stability matters more.

9. Current Meaning of AWOL

For now, AWOL remains:

unit has no confirmed retail kit mapping
and no explicit forgeworld / legends tag

That is acceptable in the current architecture.

However, V2.4 acknowledges that AWOL currently mixes two realities:

true missing / unresolved units
valid units that may only exist externally or as allied-style cross-faction realities

This distinction is real, but a full solution may be implemented later in UI/UX.

For now, the data phase should focus on reducing false AWOL caused by:

missing unit entries
missed mappings
earlier wrong removals


10. Current Currency Support

Active kit files now support:

GBP
USD
EUR
AUD
CAD
PLN
CHF

Regional price support has expanded beyond the original 5-currency model.

The kit layer remains the only valid place for region pricing.

11. Coverage / Dataset Metrics Snapshot

A high-level dataset stats script has been created.

Recent approximate output indicated:

23 factions
1396 total units
842 mapped units
132 Forge World units
30 Legends units
412 AWOL units
815 total kits
support for GBP, USD, EUR, AUD, CAD, PLN, CHF

This implies:

mapped coverage around 60%
purchasable coverage just under that
resolved coverage notably higher once FW and Legends are counted

The exact numbers may shift as V2.4 progresses.

The key point is:

the project now has enough scale that coverage and completeness are measurable and marketable.

12. Contributor Guidance

Any future contributor working on data must follow these rules.

If producing kit data
represent the exact GW faction page
use stable slugs
preserve project schema
do not improvise custom structures
If helping with mappings
map only from existing units to existing kit slugs
use exact parent slugs
separate safe vs likely thinking when needed
respect that multiple units may map to one kit
If helping with unit tightening
do not delete units casually
compare kit file back against unit file
add missing units only when clearly justified
source exact unit records from Wahapedia / master unit data
If helping on Chaos / allied issues
assume prior removals may have been wrong
compare against the base master dataset
preserve allied-style entries where valid


13. What Must Not Be Broken

These rules remain absolute.

Units must not contain retail pricing as source data.
Prices must only live in data/kits/{faction}.json.
Mappings must only map unit ids to kit slugs.
The runtime enrichment architecture must remain intact.
A kit listed in a faction kit file is valid for mapping in that faction.
Units should not be removed unless clearly incorrect.
Availability tags are metadata, not a substitute for mapping.
V2.4 is a refinement phase, not an excuse to redesign the data system.
14. Immediate V2.4 Priority Order

In order:

1. Begin faction-by-faction kit → unit cross-checking

This is the heart of V2.4.

2. Patch missing units from Wahapedia

Only where clearly justified by kit presence and Reddit/user feedback.

3. Restore wrongly removed Chaos allied units

Use master unit data as reference.

6. Review multi-unit shared-box pricing mismatches

Do this after the broader completeness pass.

7. Await or source Space Marines and Astra Militarum kit data

These remain the V2.5 unlock.


15. Recommended New Chat Briefing Summary

Any new V2.4 data chat should understand:

the architecture is already stable
the current mission is data tightening
the method is now reverse validation:
kit file → unit file
missing Space Marines and Astra Militarum are known blockers for later
Chaos allied-unit cleanup must be done carefully
shared-box price issues are real and pending
AWOL is acceptable for now but false AWOL should be reduced
the user wants concise, direct, operational responses
this is a data chat, not a UI or monetisation chat
16. Short Version

40KArmy data operations are now in V2.4.

The broad faction rollout is largely done.

The job now is:

tighten unit completeness
restore wrongly removed allied entries
reduce false AWOL
fix shared-box pricing edge cases
prepare for the final big faction unlocks:
Space Marines
Astra Militarum

The system architecture is already good.

The task now is disciplined cleanup, not invention.


______________________


16. We have now completed V2.4. 
We did lots of data tightening, and have added all factions except Space Marines and their chapters.
I gave this document to ChatGPT and asked it to summarise and improve, for us to move into DATA v2.5 - Which is basically the final addition of the final faction


17. What V2.5 Means

V2.5 is the "Final Faction Addition" phase.

V2.4 focused on tightening, correction, and completeness.

V2.5 introduces:

- introduction of Space Marines as a base faction
- implementation of a chapter-based extension system for Space Marines

This phase is not about correcting past data errors.

It is about introducing controlled complexity on top of a now-stable system.


18. Allied Availability

A new availability type has been introduced:

"allied"

Definition:

Units that are valid within a faction’s gameplay context,
but whose retail kit belongs to a different faction’s storefront.

Examples:

- Imperial Agents units using Adepta Sororitas kits
- Cross-faction Imperial characters
- Chaos daemons appearing across multiple Chaos factions

Rules:

- Allied units may still be mapped to a valid retail kit
- Allied units are not AWOL
- Allied units may still display price if mapped
- Allied is not a replacement for mapping

UI Behaviour:

- Allied units display a green "ALLIED" badge
- Colour: #008235
- Allied appears alongside existing availability types:
  - LEGENDS
  - FORGEWORLD
  - AWOL

Important:

Allied is a classification layer, not a data workaround.

Mapping completeness still takes priority.


19. Space Marines System (Base + Chapter Architecture)

Space Marines are implemented as a two-layer faction system.

Layer 1 — Base Space Marines

Location:

data/factions/space-marines/

This contains:

- core Space Marine units
- There is a base Space Marine retail kit file
- There is a base Space Marine mappings file

This layer represents the default Space Marine faction.

Layer 2 — Chapter Overlays

Each chapter is treated as an extension layer.

Examples:

- blood-angels
- dark-angels
- space-wolves

Each chapter may contain:

- additional kit data, as its own file
- additional kit mappings
- All must tie back to the base Space marine Unit file
- Chaptered Units must be identified

Important rule:

Chapter data extends the base faction.
It does not replace it.

Runtime Behaviour:

When Space Marines is selected:

- only base units are shown initially

When a chapter is selected:

- chapter units are merged into the unit list
- chapter mappings are merged into mapping layer
- chapter kits are merged into kit registry

This is a controlled additive system.

No existing base data is removed or overridden.


20. Chapter Selection UI

When the Space Marines faction is selected:

A secondary dropdown is displayed:

"Select Chapter"

Options:

- None (default)
- Blood Angels
- Dark Angels
- Space Wolves
- etc

Behaviour:

- Default (None): base Space Marine units only
- When a chapter is selected:
  - additional units appear in the list
  - no base units are removed

Visual Distinction:

Chapter units are visually distinguished using:

- a subtle background tint
- no badges or labels
- no layout changes

This ensures:

- clarity without clutter
- consistency with existing UI design



21. Updated Phase Definition

V2.3 — Core system stabilisation
V2.4 — Data tightening and completeness
V2.5 — Final faction addition

The project has now moved from:

"making the data correct"

to:

"making the data complete"