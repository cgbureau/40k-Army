import type {
  SeedDataset,
  UnitProfileConfig,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `unit_profiles` table.
 */
export const unitProfilesDataset: SeedDataset<"unit_profiles"> = {
  table: "unit_profiles",
  records: [] satisfies UnitProfileConfig[],
};
