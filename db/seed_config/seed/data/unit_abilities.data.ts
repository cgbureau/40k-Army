import type {
  SeedDataset,
  UnitAbilityConfig,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `unit_abilities` table.
 */
export const unitAbilitiesDataset: SeedDataset<"unit_abilities"> = {
  table: "unit_abilities",
  records: [] satisfies UnitAbilityConfig[],
};
