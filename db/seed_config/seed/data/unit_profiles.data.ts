import type {
  SeedDataset,
  UnitProfileConfig,
} from "@db_index/";

/**
 * Typed seed dataset for the `unit_profiles` table.
 */
export const unitProfilesDataset: SeedDataset<"unit_profiles"> = {
  table: "unit_profiles",
  records: [] satisfies UnitProfileConfig[],
};
