import type {
  SeedDataset,
  SuperFactionConfig,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `super_factions` table.
 */
export const superFactionsDataset: SeedDataset<"super_factions"> = {
  table: "super_factions",
  records: [] satisfies SuperFactionConfig[],
};
