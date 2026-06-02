# Model-Centered Data Model

This document describes the logical database shape with `models` at the center.
It focuses on how physical model identities connect list-building rules,
purchasing data, and player collections.

`models` is not the same thing as `units`. A unit is a rules datasheet that can
be selected in an army list. A model is a physical miniature identity that can be
required by a unit, included in a kit, or owned by a player.

## Relationship Diagram

```mermaid
flowchart LR
  Model["models<br/>physical model identity"]

  subgraph Rules["Rules and list building"]
    Unit["units<br/>datasheet unit"]
    UnitModel["unit_models<br/>unit composition"]
    RulesFactionUnit["rules_faction_units<br/>faction-unit access"]
    RulesFaction["rules_factions"]
    RulesSource["rules_sources"]
    UnitPointCost["unit_point_costs<br/>points by model count"]
    UnitAbility["unit_abilities"]
    Ability["abilities"]
    LeaderEligibility["leader_eligibilities"]
    LeaderEligibilityKeyword["leader_eligibility_keywords"]
    Keyword["keywords"]
    UnitSelectionLimit["unit_selection_limits"]
    DetachmentUnitKeyword["detachment_unit_keywords"]
    Detachment["detachments"]
    RulesFactionDetachment["rules_faction_detachments"]
  end

  subgraph Datasheet["Model- or unit-scoped datasheet details"]
    UnitProfile["unit_profiles<br/>nullable model_id"]
    UnitProfileStat["unit_profile_stats"]
    UnitKeyword["unit_keywords<br/>nullable model_id"]
    UnitWeapon["unit_weapons<br/>nullable model_id"]
    WeaponProfile["weapon_profiles"]
    Weapon["weapons"]
    WeaponProfileKeyword["weapon_profile_keywords"]
  end

  subgraph Store["Purchasing and kits"]
    Kit["kits<br/>purchasable product"]
    KitType["kit_types"]
    KitModel["kit_models<br/>physical kit contents"]
    KitUnit["kit_units<br/>unit-level satisfaction"]
    KitUnitPriceAllocation["kit_unit_price_allocations"]
    KitPrice["kit_prices"]
  end

  subgraph PlayerData["Player inventory and lists"]
    Player["players"]
    PlayerCollection["player_collections"]
    PlayerCollectionModel["player_collection_models<br/>owned model counts"]
    PlayerArmyList["player_army_lists"]
    PlayerArmyListUnit["player_army_list_units"]
    GameEdition["game_editions"]
    GameSize["game_sizes"]
  end

  Model <--> UnitModel
  UnitModel <--> Unit

  Model <--> KitModel
  KitModel <--> Kit
  Kit --> KitType
  Kit --> KitPrice
  Kit --> KitUnit
  KitUnit --> Unit
  Kit --> KitUnitPriceAllocation
  KitUnitPriceAllocation --> Unit

  Model <--> PlayerCollectionModel
  PlayerCollectionModel --> PlayerCollection
  PlayerCollection --> Player
  PlayerCollectionModel -. optional .-> RulesFaction

  Unit --> RulesFactionUnit
  RulesFactionUnit --> RulesFaction
  RulesFactionUnit --> RulesSource
  RulesFaction --> RulesFactionDetachment
  RulesFactionDetachment --> Detachment

  Unit --> UnitPointCost
  UnitPointCost --> GameEdition
  UnitPointCost --> RulesSource

  Unit --> UnitAbility
  UnitAbility --> Ability

  Unit --> LeaderEligibility
  LeaderEligibility --> Unit
  LeaderEligibility --> LeaderEligibilityKeyword
  LeaderEligibilityKeyword --> Keyword

  Detachment --> DetachmentUnitKeyword
  DetachmentUnitKeyword --> Unit
  DetachmentUnitKeyword --> Keyword

  UnitSelectionLimit --> Keyword
  UnitSelectionLimit --> GameEdition
  UnitSelectionLimit --> GameSize

  Model -. optional .-> UnitProfile
  Unit --> UnitProfile
  UnitProfile --> UnitProfileStat
  UnitProfile --> GameEdition
  UnitProfile --> RulesSource

  Model -. optional .-> UnitKeyword
  Unit --> UnitKeyword
  UnitKeyword --> Keyword
  UnitKeyword --> GameEdition
  UnitKeyword --> RulesSource

  Model -. optional .-> UnitWeapon
  Unit --> UnitWeapon
  UnitWeapon --> WeaponProfile
  UnitWeapon --> GameEdition
  UnitWeapon --> RulesSource
  WeaponProfile --> Weapon
  WeaponProfile --> WeaponProfileKeyword
  WeaponProfileKeyword --> Keyword
  WeaponProfile --> GameEdition
  WeaponProfile --> RulesSource

  Player --> PlayerArmyList
  PlayerArmyList --> RulesFaction
  PlayerArmyList --> Detachment
  PlayerArmyList --> GameEdition
  PlayerArmyList --> GameSize
  PlayerArmyList --> PlayerArmyListUnit
  PlayerArmyListUnit --> Unit
  PlayerArmyListUnit --> UnitPointCost
```

## Core Interpretation

- `unit_models` answers which physical model identities a unit requires or
  permits, and in what counts.
- `kit_models` answers which physical model identities are included in a
  purchasable product.
- `player_collection_models` answers which physical model identities a player
  owns.
- `kit_units` is a unit-level purchasing shortcut. It should remain
  source-backed because it answers whether a kit can satisfy a unit, not merely
  whether it contains similar model names.
- `unit_profiles`, `unit_keywords`, and `unit_weapons` can be model-scoped or
  unit-scoped. Their `model_id` is nullable so a datasheet detail can apply to a
  specific model type or to the unit as a whole.

## Practical Consequence

The target purchase and collection workflow should compare desired army list
units against `unit_models`, owned inventory against `player_collection_models`,
and purchasable products against `kit_models` plus `kit_units`.

That keeps the app aligned with three different user questions:

- Can this faction legally field the unit?
- Which physical models does the player already own?
- Which purchasable kits can close the gap?
