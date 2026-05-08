import type { AbilityConfig, SeedDataset } from "../../types/_index.types";

/**
 * Typed seed dataset for the `abilities` table.
 */
export const abilitiesDataset: SeedDataset<"abilities"> = {
  table: "abilities",
  records: [] satisfies AbilityConfig[],
};
