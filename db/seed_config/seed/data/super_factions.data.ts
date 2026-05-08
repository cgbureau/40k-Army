import type {
  SeedDataset,
  SuperFactionConfig,
} from "../../types/_index.types";

/**
 * Typed seed dataset for the `super_factions` table.
 */
export const superFactionsDataset: SeedDataset<"super_factions"> = {
  table: "super_factions",
  records: [] satisfies SuperFactionConfig[],
};
