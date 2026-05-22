export type SeedTable =
  | "game_editions"
  | "game_sizes"
  | "super_factions"
  | "rules_factions"
  | "rules_sources"
  | "rules_faction_sources"
  | "detachments"
  | "rules_faction_detachments"
  | "units"
  | "rules_faction_units"
  | "unit_profiles"
  | "unit_profile_stats"
  | "unit_point_costs"
  | "keywords"
  | "unit_keywords"
  | "detachment_unit_keywords"
  | "unit_selection_limits"
  | "models"
  | "unit_models"
  | "kit_types"
  | "kits"
  | "kit_models"
  | "kit_units"
  | "kit_unit_price_allocations"
  | "kit_prices"
  | "abilities"
  | "unit_abilities"
  | "leader_eligibilities"
  | "leader_eligibility_keywords"
  | "players"
  | "player_army_lists"
  | "player_army_list_units"
  | "player_collections"
  | "player_collection_models";

export type SeedOperation = "insert" | "update" | "delete";

export type SeedingErrorContext = {
  table: SeedTable;
  operation: SeedOperation;
  id?: string;
};

export class SeedingError {
  readonly _tag = "SeedingError";
  readonly error: unknown;
  readonly context: SeedingErrorContext;

  /**
   * Creates a seeding error with the original error and seed operation context.
   *
   * @param error - The error that occurred while seeding the database.
   * @param context - The table, operation, and optional record id being seeded.
   */
  constructor(error: unknown, context: SeedingErrorContext) {
    this.error = error;
    this.context = context;
  }
}
