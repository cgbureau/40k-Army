import {
  abilitySchema,
  countrySchema,
  priceMarketSchema,
  priceMarketCountrySchema,
  detachmentSchema,
  detachmentUnitKeywordSchema,
  gameEditionSchema,
  gameSizeSchema,
  keywordSchema,
  kitModelSchema,
  kitPriceSchema,
  kitSchema,
  kitTypeSchema,
  kitUnitPriceAllocationSchema,
  kitUnitSchema,
  leaderEligibilityKeywordSchema,
  leaderEligibilitySchema,
  weaponSchema,
  weaponProfileSchema,
  weaponProfileKeywordSchema,
  unitWeaponSchema,
  modelSchema,
  playerArmyListSchema,
  playerArmyListUnitSchema,
  playerCollectionModelSchema,
  playerCollectionSchema,
  playerSchema,
  rulesFactionDetachmentSchema,
  rulesFactionSchema,
  rulesFactionsSourcesSchema,
  rulesFactionUnitSchema,
  rulesSourceSchema,
  superFactionSchema,
  unitAbilitySchema,
  unitKeywordSchema,
  unitModelSchema,
  unitPointCostSchema,
  unitProfileSchema,
  unitProfileStatSchema,
  unitSchema,
  unitSelectionLimitSchema,
} from "../../schemas/_index.schema";
import type {
  SeedDataCollection,
  SeedTableConfigMap,
  SeedTableName,
  SeedValidationIssue,
} from "../types/_index.types";
import { z } from "zod";

const dateOptionsSchema = z.object({
  start: z.union([z.date(), z.number()]).optional(),
  end: z.union([z.date(), z.number()]).optional(),
  reference: z.date().optional(),
  includeUpdated: z.boolean().optional(),
  chanceOfUpdate: z.number().optional(),
});

const seedMetadataSchema = z.object({
  seedSequence: z.number().int().optional(),
  dateConfig: dateOptionsSchema.optional(),
  comment: z.string().optional(),
});

const createSeedConfigSchema = <TSchema extends z.ZodObject<z.ZodRawShape>>(
  schema: TSchema,
) =>
  schema
    .omit({
      created_at: true,
      updated_at: true,
    })
    .extend(seedMetadataSchema.shape);

type SeedTableSchemaMap = {
  [TTable in SeedTableName]: z.ZodType;
};

export const seedTableSchemas = {
  game_editions: createSeedConfigSchema(gameEditionSchema),
  game_sizes: createSeedConfigSchema(gameSizeSchema),
  countries: createSeedConfigSchema(countrySchema),
  price_markets: createSeedConfigSchema(priceMarketSchema),
  price_market_countries: priceMarketCountrySchema.extend(seedMetadataSchema.shape),
  super_factions: createSeedConfigSchema(superFactionSchema),
  rules_factions: createSeedConfigSchema(rulesFactionSchema),
  rules_sources: createSeedConfigSchema(rulesSourceSchema),
  rules_faction_sources: createSeedConfigSchema(rulesFactionsSourcesSchema),
  detachments: createSeedConfigSchema(detachmentSchema),
  rules_faction_detachments: createSeedConfigSchema(
    rulesFactionDetachmentSchema,
  ),
  units: createSeedConfigSchema(unitSchema),
  rules_faction_units: createSeedConfigSchema(rulesFactionUnitSchema),
  unit_profiles: createSeedConfigSchema(unitProfileSchema),
  unit_profile_stats: createSeedConfigSchema(unitProfileStatSchema),
  unit_point_costs: createSeedConfigSchema(unitPointCostSchema),
  keywords: createSeedConfigSchema(keywordSchema),
  unit_keywords: createSeedConfigSchema(unitKeywordSchema),
  detachment_unit_keywords: createSeedConfigSchema(detachmentUnitKeywordSchema),
  unit_selection_limits: createSeedConfigSchema(unitSelectionLimitSchema),
  models: createSeedConfigSchema(modelSchema),
  unit_models: createSeedConfigSchema(unitModelSchema),
  kit_types: createSeedConfigSchema(kitTypeSchema),
  kits: createSeedConfigSchema(kitSchema),
  kit_models: createSeedConfigSchema(kitModelSchema),
  kit_units: createSeedConfigSchema(kitUnitSchema),
  kit_unit_price_allocations: createSeedConfigSchema(
    kitUnitPriceAllocationSchema,
  ),
  kit_prices: createSeedConfigSchema(kitPriceSchema),
  weapons: createSeedConfigSchema(weaponSchema),
  weapon_profiles: createSeedConfigSchema(weaponProfileSchema),
  weapon_profile_keywords: createSeedConfigSchema(weaponProfileKeywordSchema),
  unit_weapons: createSeedConfigSchema(unitWeaponSchema),
  abilities: createSeedConfigSchema(abilitySchema),
  unit_abilities: createSeedConfigSchema(unitAbilitySchema),
  leader_eligibilities: createSeedConfigSchema(leaderEligibilitySchema),
  leader_eligibility_keywords: createSeedConfigSchema(
    leaderEligibilityKeywordSchema,
  ),
  players: createSeedConfigSchema(playerSchema),
  player_army_lists: createSeedConfigSchema(playerArmyListSchema),
  player_army_list_units: createSeedConfigSchema(playerArmyListUnitSchema),
  player_collections: createSeedConfigSchema(playerCollectionSchema),
  player_collection_models: createSeedConfigSchema(playerCollectionModelSchema),
} satisfies SeedTableSchemaMap;

// TODO(P1): enforce that kit_unit_price_allocations.allocation_ratio values for a
// given kit_id sum to 1.0. Cannot be expressed per-row — requires an app-layer
// aggregation guard or a DB check constraint before inserts are wired.

export const validateSeedRecord = <T extends SeedTableName>(
  collection: SeedDataCollection,
  table: T,
  record: SeedTableConfigMap[T],
): SeedValidationIssue[] => {
  const result = seedTableSchemas[table].safeParse(record);

  if (result.success) {
    return [];
  }

  return result.error.issues.map((issue) => ({
    collection,
    table,
    recordId: "id" in record ? record.id : undefined,
    field: issue.path.map(String).join(".") || undefined,
    message: issue.message,
    severity: "error",
  }));
};
