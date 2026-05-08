import type {
  SeedDataset,
  UnitAbilityConfig,
} from "@db_index/";

/**
 * Typed seed dataset for the `unit_abilities` table.
 */
export const unitAbilitiesDataset: SeedDataset<"unit_abilities"> = {
  table: "unit_abilities",
  records: [] satisfies UnitAbilityConfig[],
};
