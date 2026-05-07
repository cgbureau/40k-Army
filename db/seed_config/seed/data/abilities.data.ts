import type {
  AbilityConfig,
  SeedDataset,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `abilities` table.
 */
export const abilitiesDataset: SeedDataset<"abilities"> = {
  table: "abilities",
  records: [] satisfies AbilityConfig[],
};
