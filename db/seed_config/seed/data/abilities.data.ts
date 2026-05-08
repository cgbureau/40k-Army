import type { AbilityConfig, SeedDataset } from "@db_index/";

/**
 * Typed seed dataset for the `abilities` table.
 */
export const abilitiesDataset: SeedDataset<"abilities"> = {
  table: "abilities",
  records: [] satisfies AbilityConfig[],
};
