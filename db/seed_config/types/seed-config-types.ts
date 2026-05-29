import type {
  GameEdition,
  GameSize,
  SuperFaction,
  RulesFaction,
  RulesSource,
  RulesFactionSource,
  Detachment,
  RulesFactionDetachment,
  Unit,
  RulesFactionUnit,
  UnitProfile,
  UnitProfileStat,
  UnitPointCost,
  Keyword,
  UnitKeyword,
  DetachmentUnitKeyword,
  UnitSelectionLimit,
  Model,
  UnitModel,
  KitType,
  Kit,
  KitModel,
  KitUnit,
  KitUnitPriceAllocation,
  KitPrice,
  Ability,
  UnitAbility,
  LeaderEligibility,
  LeaderEligibilityKeyword,
  Weapon,
  WeaponProfile,
  WeaponProfileKeyword,
  UnitWeapon,
  Player,
  PlayerArmyList,
  PlayerArmyListUnit,
  PlayerCollection,
  PlayerCollectionModel,
} from "@db_index/";
import type { DateOptions } from "@/utils/general_utils";

/**
 * Seeder metadata shared by every table-specific config record.
 */
export type BaseEntityConfig = {
  id: string;
  seedSequence?: number;
  dateConfig?: DateOptions;
  comment?: string;
};

/**
 * Seed config shape for a Warhammer 40,000 game edition.
 */
export type GameEditionConfig = BaseEntityConfig &
  Omit<GameEdition, "created_at" | "updated_at">;

/**
 * Seed config shape for an edition-specific game size.
 */
export type GameSizeConfig = BaseEntityConfig &
  Omit<GameSize, "created_at" | "updated_at">;

/**
 * Seed config shape for a top-level faction grouping.
 */
export type SuperFactionConfig = BaseEntityConfig &
  Omit<SuperFaction, "created_at" | "updated_at">;

/**
 * Seed config shape for a rules-facing faction.
 */
export type RulesFactionConfig = BaseEntityConfig &
  Omit<RulesFaction, "created_at" | "updated_at">;

/**
 * Seed config shape for a rules publication or source.
 */
export type RulesSourceConfig = BaseEntityConfig &
  Omit<RulesSource, "created_at" | "updated_at">;

/**
 * Seed config shape for linking a rules faction to a rules source.
 */
export type RulesFactionSourceConfig = BaseEntityConfig &
  Omit<RulesFactionSource, "created_at" | "updated_at">;

/**
 * Seed config shape for a detachment.
 */
export type DetachmentConfig = BaseEntityConfig &
  Omit<Detachment, "created_at" | "updated_at">;

/**
 * Seed config shape for linking a rules faction to a detachment.
 */
export type RulesFactionDetachmentConfig = BaseEntityConfig &
  Omit<RulesFactionDetachment, "created_at" | "updated_at">;

/**
 * Seed config shape for a datasheet-level unit.
 */
export type UnitConfig = BaseEntityConfig &
  Omit<Unit, "created_at" | "updated_at">;

/**
 * Seed config shape for linking a rules faction to a usable unit.
 */
export type RulesFactionUnitConfig = BaseEntityConfig &
  Omit<RulesFactionUnit, "created_at" | "updated_at">;

/**
 * Seed config shape for a source-specific unit profile.
 */
export type UnitProfileConfig = BaseEntityConfig &
  Omit<UnitProfile, "created_at" | "updated_at">;

/**
 * Seed config shape for a key/value stat on a unit profile.
 */
export type UnitProfileStatConfig = BaseEntityConfig &
  Omit<UnitProfileStat, "created_at" | "updated_at">;

/**
 * Seed config shape for a source-specific unit point cost.
 */
export type UnitPointCostConfig = BaseEntityConfig &
  Omit<UnitPointCost, "created_at" | "updated_at">;

/**
 * Seed config shape for a canonical keyword.
 */
export type KeywordConfig = BaseEntityConfig &
  Omit<Keyword, "created_at" | "updated_at">;

/**
 * Seed config shape for assigning a keyword to a unit.
 */
export type UnitKeywordConfig = BaseEntityConfig &
  Omit<UnitKeyword, "created_at" | "updated_at">;

/**
 * Seed config shape for a detachment-granted unit keyword.
 */
export type DetachmentUnitKeywordConfig = BaseEntityConfig &
  Omit<DetachmentUnitKeyword, "created_at" | "updated_at">;

/**
 * Seed config shape for edition/game-size selection limits.
 */
export type UnitSelectionLimitConfig = BaseEntityConfig &
  Omit<UnitSelectionLimit, "created_at" | "updated_at">;

/**
 * Seed config shape for a physical model identity.
 */
export type ModelConfig = BaseEntityConfig &
  Omit<Model, "created_at" | "updated_at">;

/**
 * Seed config shape for linking a unit to its model composition.
 */
export type UnitModelConfig = BaseEntityConfig &
  Omit<UnitModel, "created_at" | "updated_at">;

/**
 * Seed config shape for a purchasable kit category.
 */
export type KitTypeConfig = BaseEntityConfig &
  Omit<KitType, "created_at" | "updated_at">;

/**
 * Seed config shape for a purchasable kit.
 */
export type KitConfig = BaseEntityConfig &
  Omit<Kit, "created_at" | "updated_at">;

/**
 * Seed config shape for linking a kit to contained models.
 */
export type KitModelConfig = BaseEntityConfig &
  Omit<KitModel, "created_at" | "updated_at">;

/**
 * Seed config shape for linking a kit to satisfied units.
 */
export type KitUnitConfig = BaseEntityConfig &
  Omit<KitUnit, "created_at" | "updated_at">;

/**
 * Seed config shape for assigning kit price allocation metadata to satisfied units.
 */
export type KitUnitPriceAllocationConfig = BaseEntityConfig &
  Omit<KitUnitPriceAllocation, "created_at" | "updated_at">;

/**
 * Seed config shape for a kit price observation.
 */
export type KitPriceConfig = BaseEntityConfig &
  Omit<KitPrice, "created_at" | "updated_at">;

/**
 * Seed config shape for a canonical weapon type.
 */
export type WeaponConfig = BaseEntityConfig &
  Omit<Weapon, "created_at" | "updated_at">;

/**
 * Seed config shape for an edition/source-specific weapon stat line.
 */
export type WeaponProfileConfig = BaseEntityConfig &
  Omit<WeaponProfile, "created_at" | "updated_at">;

/**
 * Seed config shape for assigning a weapon keyword to a weapon profile.
 */
export type WeaponProfileKeywordConfig = BaseEntityConfig &
  Omit<WeaponProfileKeyword, "created_at" | "updated_at">;

/**
 * Seed config shape for assigning a weapon profile to a unit or model within a unit.
 */
export type UnitWeaponConfig = BaseEntityConfig &
  Omit<UnitWeapon, "created_at" | "updated_at">;

/**
 * Seed config shape for a reusable ability definition.
 */
export type AbilityConfig = BaseEntityConfig &
  Omit<Ability, "created_at" | "updated_at">;

/**
 * Seed config shape for assigning ability text to a unit.
 */
export type UnitAbilityConfig = BaseEntityConfig &
  Omit<UnitAbility, "created_at" | "updated_at">;

/**
 * Seed config shape for a leader eligibility rule.
 */
export type LeaderEligibilityConfig = BaseEntityConfig &
  Omit<LeaderEligibility, "created_at" | "updated_at">;

/**
 * Seed config shape for a keyword required by a leader eligibility rule.
 */
export type LeaderEligibilityKeywordConfig = BaseEntityConfig &
  Omit<LeaderEligibilityKeyword, "created_at" | "updated_at">;

/**
 * Seed config shape for a player identity.
 */
export type PlayerConfig = BaseEntityConfig &
  Omit<Player, "created_at" | "updated_at">;

/**
 * Seed config shape for a saved player army list.
 */
export type PlayerArmyListConfig = BaseEntityConfig &
  Omit<PlayerArmyList, "created_at" | "updated_at">;

/**
 * Seed config shape for a unit selected into a player army list.
 */
export type PlayerArmyListUnitConfig = BaseEntityConfig &
  Omit<PlayerArmyListUnit, "created_at" | "updated_at">;

/**
 * Seed config shape for a player collection.
 */
export type PlayerCollectionConfig = BaseEntityConfig &
  Omit<PlayerCollection, "created_at" | "updated_at">;

/**
 * Seed config shape for a model entry inside a player collection.
 */
export type PlayerCollectionModelConfig = BaseEntityConfig &
  Omit<PlayerCollectionModel, "created_at" | "updated_at">;

/**
 * Maps each seedable database table to the config type accepted by that table.
 */
export type SeedTableConfigMap = {
  game_editions: GameEditionConfig;
  game_sizes: GameSizeConfig;
  super_factions: SuperFactionConfig;
  rules_factions: RulesFactionConfig;
  rules_sources: RulesSourceConfig;
  rules_faction_sources: RulesFactionSourceConfig;
  detachments: DetachmentConfig;
  rules_faction_detachments: RulesFactionDetachmentConfig;
  units: UnitConfig;
  rules_faction_units: RulesFactionUnitConfig;
  unit_profiles: UnitProfileConfig;
  unit_profile_stats: UnitProfileStatConfig;
  unit_point_costs: UnitPointCostConfig;
  keywords: KeywordConfig;
  unit_keywords: UnitKeywordConfig;
  detachment_unit_keywords: DetachmentUnitKeywordConfig;
  unit_selection_limits: UnitSelectionLimitConfig;
  models: ModelConfig;
  unit_models: UnitModelConfig;
  kit_types: KitTypeConfig;
  kits: KitConfig;
  kit_models: KitModelConfig;
  kit_units: KitUnitConfig;
  kit_unit_price_allocations: KitUnitPriceAllocationConfig;
  kit_prices: KitPriceConfig;
  weapons: WeaponConfig;
  weapon_profiles: WeaponProfileConfig;
  weapon_profile_keywords: WeaponProfileKeywordConfig;
  unit_weapons: UnitWeaponConfig;
  abilities: AbilityConfig;
  unit_abilities: UnitAbilityConfig;
  leader_eligibilities: LeaderEligibilityConfig;
  leader_eligibility_keywords: LeaderEligibilityKeywordConfig;
  players: PlayerConfig;
  player_army_lists: PlayerArmyListConfig;
  player_army_list_units: PlayerArmyListUnitConfig;
  player_collections: PlayerCollectionConfig;
  player_collection_models: PlayerCollectionModelConfig;
};
