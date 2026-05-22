# 40karmy Schema Design

This document sketches the core relational model for 40karmy. The schema separates
game rules identity from user personalization:

- Rules-facing tables answer questions like "which units can this army use?"
- Source-facing tables answer questions like "where was this unit or detachment
  published?"
- Player-facing tables answer questions like "what does this user call their army?"
  and "which models do they already own?"

The companion fixture file at
`docs/00_Developer_Docs/database/fixtures/schema-exercise-seed.json` contains
representative Space Marines, Blood Angels, and Death Guard data for exercising
these relationships without making this design document exhaustive. Full
datasheet imports can use Wahapedia's 10th edition data as a source for faction,
unit, model, weapon, and profile details. [Wahapedia](https://wahapedia.ru/wh40k10ed)

The table examples below use generic `id` primary keys to match the intended
database schema convention. Fixture and import files may use table-specific
identifier names, such as `unit_id` or `rules_faction_unit_id`, as source-local
keys that are mapped into database `id` values during import.

## Rules Taxonomy

The rules taxonomy models faction identities that matter for list legality and
pricing. Player-created chapter names, successor-chapter names, and other
"counts-as" flavor live on player army lists and collections instead of in the
global rules taxonomy.

### Super-Factions

Super-factions are the top-level product and browsing buckets used by 40karmy.
Space Marines are intentionally modeled as their own super-faction, matching Games
Workshop's store taxonomy and common army-builder behavior.

| id  | super_faction_name |
| --- | ------------------ |
| 1   | imperium           |
| 2   | chaos              |
| 3   | xenos              |
| 4   | space_marines      |

### Rules Factions

Rules factions are the game-facing faction identities that control legal unit and
detachment access. A player may display their army as a custom chapter while still
using one of these rules factions for validation.

| id  | super_faction_id | rules_faction_name |
| --- | ---------------- | ------------------ |
| 1   | 4                | Space Marines      |
| 2   | 4                | Ultramarines       |
| 3   | 4                | Blood Angels       |
| 4   | 4                | Dark Angels        |
| 5   | 4                | White Scars        |
| 6   | 2                | Death Guard        |

### Rules Sources

Rules sources are publications or release channels that contain rules content.
They are not the same thing as a faction: a single rules faction may use content
from multiple sources, and a single source may contain content for multiple rules
factions. The source release date tracks when the source was published; individual
rules and points entries can still have their own effective dates.

| id  | rules_source_name                                     | rules_source_type      | release_date |
| --- | ----------------------------------------------------- | ---------------------- | ------------ |
| 1   | Codex: Space Marines                                  | codex                  | 2023-10-14   |
| 2   | Warhammer Community                                   | online                 |              |
| 3   | Armageddon: The Return of Yarrick - Armoured Gauntlet | expansion              | 2025-11-01   |
| 4   | Codex Supplement: Blood Angels                        | codex_supplement       | 2024-09-14   |
| 5   | Codex: Death Guard                                    | codex                  | 2025-09-01   |
| 6   | Munitorum Field Manual June 2025                      | munitorum_field_manual | 2025-06-01   |

### Rules Faction Sources

A rules faction can draw rules from one or more sources. This table captures
whether a source is a base codex, supplement, later online release, campaign book,
or other relationship for that rules faction.

| id  | rules_faction_id | rules_source_id | source_relationship |
| --- | ---------------- | --------------- | ------------------- |
| 1   | 1                | 1               | primary             |
| 2   | 2                | 1               | primary             |
| 3   | 3                | 1               | shared_base         |
| 4   | 3                | 4               | supplement          |
| 5   | 6                | 5               | primary             |

### Detachments

Detachments are selectable army rule packages. A detachment has its own detachment
rule, enhancements, and stratagems. The source relationship tells where the
detachment was published, not who may use it.

| id  | detachment_name         | rules_source_id |
| --- | ----------------------- | --------------- |
| 1   | Gladius Task Force      | 1               |
| 2   | Ceramite Sentinels      | 2               |
| 3   | Liberator Assault Group | 4               |
| 4   | Mortarion's Hammer      | 5               |

### Rules Faction Detachments

This join table defines which rules factions may select which detachments.
Shared Space Marine detachments can be granted to the broad Space Marines rules
faction, while chapter-specific detachments can be granted directly to the
chapter rules faction.

| id  | rules_faction_id | detachment_id | detachment_access_type |
| --- | ---------------- | ------------- | ---------------------- |
| 1   | 1                | 1             | shared                 |
| 2   | 1                | 2             | shared                 |
| 3   | 3                | 1             | inherited              |
| 4   | 3                | 2             | inherited              |
| 5   | 3                | 3             | exclusive              |
| 6   | 6                | 4             | exclusive              |

## Units and Their Factions

### Units

Units are datasheet-level game entities. A unit consists of at least one model and
may have different allowed model counts, wargear choices, keywords, points costs,
and statistics by edition.

| id  | unit_name                                 |
| --- | ----------------------------------------- |
| 1   | Intercessor Squad                         |
| 2   | Assault Intercessor Squad                 |
| 3   | Assault Intercessor Squad with Jump Packs |
| 4   | Heavy Intercessor Squad                   |
| 5   | Sanguinary Guard                          |
| 6   | Blightlord Terminators                    |
| 7   | Captain Titus                             |
| 8   | Wardens of Ultramar                       |

### Rules Faction Units

This join table defines which rules factions may use which units. Shared units
can be attached to the broad rules faction, while named characters and other
exclusive units can be attached to the specific chapter or faction.

| id  | unit_id | rules_faction_id | unit_access_type | rules_source_id |
| --- | ------- | ---------------- | ---------------- | --------------- |
| 1   | 1       | 1                | shared           | 1               |
| 2   | 2       | 1                | shared           | 1               |
| 3   | 3       | 1                | shared           | 1               |
| 4   | 4       | 1                | shared           | 1               |
| 5   | 5       | 3                | exclusive        | 4               |
| 6   | 6       | 6                | exclusive        | 5               |
| 7   | 7       | 2                | exclusive        | 1               |
| 8   | 8       | 2                | exclusive        | 1               |

### Models

Models are the physical model identities that can be owned, included in kits, and
fielded as part of units. Epic Hero status is represented through unit keywords
instead of a model-level boolean.

| id  | model_name                |
| --- | ------------------------- |
| 1   | Blightlord Champion       |
| 2   | Blightlord Terminator     |
| 3   | Captain Titus             |
| 4   | Ancient Gadriel           |
| 5   | Veteran Sergeant Metaurus |
| 6   | Gaius Silva               |
| 7   | Aemelia Minervas          |
| 8   | Dainal Kornelius          |
| 9   | Lucia Vestha              |
| 10  | Intercessor Sergeant      |
| 11  | Intercessor               |

### Unit Models

Models are fielded in units. This table defines the allowed model composition for
each unit. A single unit can contain one or more model types, each with its own
minimum and maximum count.

| id  | unit_id | model_id | minimum_model_count | maximum_model_count |
| --- | ------- | -------- | ------------------- | ------------------- |
| 1   | 8       | 4        | 1                   | 1                   |
| 2   | 8       | 5        | 1                   | 1                   |
| 3   | 8       | 6        | 1                   | 1                   |
| 4   | 8       | 7        | 1                   | 1                   |
| 5   | 8       | 8        | 1                   | 1                   |
| 6   | 8       | 9        | 1                   | 1                   |
| 7   | 6       | 1        | 1                   | 1                   |
| 8   | 6       | 2        | 2                   | 9                   |
| 9   | 1       | 10       | 1                   | 1                   |
| 10  | 1       | 11       | 4                   | 9                   |

### Unit Profiles

Unit profiles are edition-specific stat profiles for a unit or a model within a
unit. Profiles point to a rules source and effective date because datasheets can
change across codexes, indexes, balance updates, and editions.

| id  | game_edition_id | unit_id | model_id | profile_name         | rules_source_id | effective_date |
| --- | --------------- | ------- | -------- | -------------------- | --------------- | -------------- |
| 1   | 10              | 5       |          | Sanguinary Guard     | 4               | 2024-09-14     |
| 2   | 10              | 1       | 10       | Intercessor Sergeant | 1               | 2023-10-14     |
| 3   | 10              | 1       | 11       | Intercessor          | 1               | 2023-10-14     |
| 4   | 9               | 1       | 11       | Intercessor          | 1               | 2020-10-10     |

### Unit Profile Stats

Profile stats use key/value rows so the schema can support different stat lines
across editions. For example, models had a Strength stat before 10th edition;
in 10th edition, Strength moved to weapon profiles instead.

| id  | unit_profile_id | stat_key          | stat_value |
| --- | --------------- | ----------------- | ---------- |
| 1   | 3               | movement          | 6"         |
| 2   | 3               | toughness         | 4          |
| 3   | 3               | save              | 3+         |
| 4   | 3               | wounds            | 2          |
| 5   | 3               | leadership        | 6+         |
| 6   | 3               | objective_control | 2          |
| 7   | 4               | movement          | 6"         |
| 8   | 4               | weapon_skill      | 3+         |
| 9   | 4               | ballistic_skill   | 3+         |
| 10  | 4               | strength          | 4          |
| 11  | 4               | toughness         | 4          |
| 12  | 4               | wounds            | 2          |
| 13  | 4               | attacks           | 2          |
| 14  | 4               | leadership        | 7          |
| 15  | 4               | save              | 3+         |

### Unit Points Costs

Points costs are edition-specific and source-specific. A unit's points may come
from a codex, codex supplement, Munitorum Field Manual, or other update. The
rules source stores the publication release date, while effective and superseded
dates describe the validity window for this exact points entry.

| id  | game_edition_id | unit_id | rules_source_id | minimum_model_count | maximum_model_count | unit_points | effective_date | superseded_date |
| --- | --------------- | ------- | --------------- | ------------------- | ------------------- | ----------- | -------------- | --------------- |
| 1   | 10              | 6       | 6               | 3                   | 4                   | 115         | 2025-06-01     |                 |
| 2   | 10              | 6       | 6               | 5                   | 9                   | 185         | 2025-06-01     |                 |
| 3   | 10              | 6       | 6               | 10                  | 10                  | 370         | 2025-06-01     |                 |
| 4   | 10              | 1       | 6               | 5                   | 5                   | 80          | 2025-06-01     |                 |
| 5   | 10              | 1       | 6               | 10                  | 10                  | 160         | 2025-06-01     |                 |

## Kits and Prices

### Kit Types

Kit types describe the commercial packaging pattern of a kit. They support
pricing logic and filters such as "standalone unit kit," "combat patrol," or
"duel box."

| id  | kit_type_name      | multi_unit | number_of_factions |
| --- | ------------------ | ---------- | ------------------ |
| 1   | character unit     | 0          | 1                  |
| 2   | non-character unit | 0          | 1                  |
| 3   | combat patrol      | 1          | 1                  |
| 4   | battleforce        | 1          | 1                  |
| 5   | duel               | 1          | 2                  |
| 6   | edition launch box | 1          | 2                  |
| 7   | expansion box      | 1          | 1                  |
| 8   | character + unit   | 1          | 1                  |

### Kits

Kits are purchasable products. They usually come from Games Workshop, but the
schema should allow additional retailers or resale sources later. Kit-level
metadata describes the product; kit contents are modeled separately.

| id  | kit_name                                  | gw_slug                                        | display_name                              | gw_short_slug                             | 40karmy_slug           | model_count | kit_type |
| --- | ----------------------------------------- | ---------------------------------------------- | ----------------------------------------- | ----------------------------------------- | ---------------------- | ----------- | -------- |
| 1   | Captain Titus and the Wardens of Ultramar | captain-titus-and-the-wardens-of-ultramar-2026 | Captain Titus and the Wardens of Ultramar | captain-titus-and-the-wardens-of-ultramar | titus_plus_wardens     | 7           | 8        |
| 2   | Blightlord Terminators                    | death-guard-blightlord-terminators-2020        | Blightlord Terminators                    | death-guard-blightlord-terminators        | blightlord_terminators | 5           | 2        |

### Kit Models

Kit models define the physical models included in each purchasable product. This
is the key table for comparing an army list against a player's collection and
for deciding which kits satisfy missing models.

| id  | kit_id | model_id | model_count |
| --- | ------ | -------- | ----------- |
| 1   | 1      | 3        | 1           |
| 2   | 1      | 4        | 1           |
| 3   | 1      | 5        | 1           |
| 4   | 1      | 6        | 1           |
| 5   | 1      | 7        | 1           |
| 6   | 1      | 8        | 1           |
| 7   | 1      | 9        | 1           |
| 8   | 2      | 1        | 1           |
| 9   | 2      | 2        | 4           |

### Kit Units

Kit units define which game units a purchasable product can satisfy. This table
is intentionally distinct from kit models: `kit_models` answers what physical
models are in the box, while `kit_units` answers how the box maps to army-list
unit demand.

This distinction matters for combined kits, combat patrols, launch boxes,
battleforces, alternate-build kits, upgrade sprues, named characters bundled with
squads, and future resale or split-kit pricing. A purchase calculator should use
`kit_units` to determine which kits satisfy selected army-list units, then use
`kit_models` for physical inventory validation and collection matching.

| id  | kit_id | unit_id | unit_count | model_count | component_type | effective_date | superseded_date |
| --- | ------ | ------- | ---------- | ----------- | -------------- | -------------- | --------------- |
| 1   | 1      | 7       | 1          | 1           | complete_unit  | 2026-06-01     |                 |
| 2   | 1      | 8       | 1          | 6           | complete_unit  | 2026-06-01     |                 |

Recommended `component_type` values:

- `complete_unit`: the kit contains the complete unit as fielded.
- `partial_unit`: the kit contributes models/components but does not satisfy the
  full unit by itself.
- `alternate_build`: the kit can build this unit instead of another listed unit.
- `upgrade_component`: the kit modifies or upgrades another model/unit.

### Kit Unit Price Allocations

Kit unit price allocations describe how to apportion a kit price across the units
the kit satisfies. They should not replace `kit_prices`: the purchasable product
still has one observed price, and per-unit values are derived from allocation
ratios.

For example, if a combined kit contains a $40 character-equivalent unit and a $55
squad-equivalent unit, the reference value total is $95. If the kit sells for
$75, the character's allocated value is `40 / 95` of the kit price and the squad's
allocated value is `55 / 95` of the kit price. The app can then explain both the
full-kit purchase cost and the implied unit share.

| id  | kit_id | unit_id | allocation_ratio | reference_price | reference_currency | allocation_basis   | effective_date | superseded_date |
| --- | ------ | ------- | ---------------- | --------------- | ------------------ | ------------------ | -------------- | --------------- |
| 1   | 1      | 7       | 0.4210526        | 40              | usd                | average_unit_price | 2026-06-01     |                 |
| 2   | 1      | 8       | 0.5789474        | 55              | usd                | average_unit_price | 2026-06-01     |                 |

Recommended `allocation_basis` values:

- `standalone_msrp`: based on official separate-kit MSRP where available.
- `average_unit_price`: based on an average or estimated comparable-unit price.
- `model_count`: based purely on physical model count.
- `manual`: intentionally curated by an admin/editor.
- `reseller_observation`: based on observed split-kit or third-party resale
  prices.

### Kit Prices

Kit prices store the purchase price for a kit in a supported currency and pricing
source. A unit may have multiple effective prices because it can appear in
multiple kits, including discounted bundle kits.

| id  | kit_id | currency | price | price_source |
| --- | ------ | -------- | ----- | ------------ |
| 1   | 1      | usd      | 94    | gw           |
| 2   | 1      | gbp      | 57    | gw           |
| 3   | 1      | aud      | 160   | gw           |
| 4   | 1      | cad      | 113   | gw           |
| 5   | 1      | eur      | 74    | gw           |
| 6   | 1      | pln      | 315   | gw           |
| 7   | 1      | chf      | 74    | gw           |
| 8   | 2      | usd      | 65    | gw           |
| 9   | 2      | gbp      | 40    | gw           |
| 10  | 2      | aud      | 110   | gw           |
| 11  | 2      | cad      | 78    | gw           |
| 12  | 2      | eur      | 51.5  | gw           |
| 13  | 2      | pln      | 215   | gw           |
| 14  | 2      | chf      | 51.5  | gw           |

## Players, Editions, Collections, and Army Lists

### Game Editions

Game editions identify the rules era for army lists, points, datasheets,
detachments, and other edition-specific content.

| id  | game_edition_name              | game_edition_alternate_name | game_edition_slug |
| --- | ------------------------------ | --------------------------- | ----------------- |
| 1   | Rogue Trader                   |                             | rt                |
| 2   | Warhammer 40,000: 2nd Edition  |                             | 2e                |
| 3   | Warhammer 40,000: 3rd Edition  |                             | 3e                |
| 4   | Warhammer 40,000: 4th Edition  |                             | 4e                |
| 5   | Warhammer 40,000: 5th Edition  |                             | 5e                |
| 6   | Warhammer 40,000: 6th Edition  |                             | 6e                |
| 7   | Warhammer 40,000: 7th Edition  |                             | 7e                |
| 8   | Warhammer 40,000: 8th Edition  | Dark Imperium               | 8e                |
| 9   | Warhammer 40,000: 9th Edition  | Indomitus                   | 9e                |
| 10  | Warhammer 40,000: 10th Edition | Leviathan                   | 10e               |
| 11  | Warhammer 40,000: 11th Edition | Armageddon                  | 11e               |

### Game Sizes

Game sizes define the supported point ranges for an edition. These are useful for
army list validation and user-facing list filters.

| id  | game_size_name | minimum_points | maximum_points | game_edition_id |
| --- | -------------- | -------------- | -------------- | --------------- |
| 1   | Combat Patrol  | 1              | 500            | 10              |
| 2   | Incursion      | 501            | 1000           | 10              |
| 3   | Strike Force   | 1001           | 2000           | 10              |
| 4   | Onslaught      | 2001           |                | 10              |

### Players

Players are registered users who can save army lists, pricing calculator lists,
and collections.

| id  | player_name  | player_username |
| --- | ------------ | --------------- |
| 1   | Mike Earley  | gravetitan      |
| 2   | George Brown | georgebrown     |

### Player Army Lists

A player army list is built against a rules faction, selected detachment, game
edition, and game size. User-facing display fields let a player call a White
Scars rules list "Storm Lords" without adding Storm Lords to the global rules
taxonomy.

| id  | player_id | rules_faction_id | detachment_id | faction_display_name | list_name        | game_size_id | points_limit | game_edition_id |
| --- | --------- | ---------------- | ------------- | -------------------- | ---------------- | ------------ | ------------ | --------------- |
| 1   | 1         | 3                | 3             | Sanguine Angels      | 2,000 Point List | 3            | 2000         | 10              |

### Player Army List Units

Army list units store each concrete unit instance a player has selected for a
list. Identical units are still separate rows because each instance may have its
own model count, wargear, attached leaders, enhancements, or display nickname.

| id  | player_army_list_id | unit_id | selected_model_count | display_name    | points_cost |
| --- | ------------------- | ------- | -------------------- | --------------- | ----------- |
| 1   | 1                   | 1       | 10                   | Squad Raphael   | 160         |
| 2   | 1                   | 1       | 5                    | Squad Barachiel | 80          |
| 3   | 1                   | 5       | 5                    | Golden Host     | 130         |

### Player Collections

Collections represent the models a player already owns. A player may keep one
large collection or multiple themed collections.

| id  | player_id | collection_name     |
| --- | --------- | ------------------- |
| 1   | 1         | Sanguine Angels     |
| 2   | 1         | Death Guard Backlog |

### Player Collection Models

Collection models track physical models owned by a player. The optional
rules_faction_id is useful when a player wants to assign painted models to a
specific army, but generic models can leave it blank so they can be counted
against any compatible list.

| id  | player_collection_id | rules_faction_id | model_id | model_count |
| --- | -------------------- | ---------------- | -------- | ----------- |
| 1   | 1                    | 3                | 10       | 2           |
| 2   | 1                    | 3                | 11       | 16          |
