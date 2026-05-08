import type {
  SeedDataset,
  UnitProfileConfig,
} from "../../types/_index.types";

/**
 * Typed seed dataset for the `unit_profiles` table.
 */
export const unitProfilesDataset: SeedDataset<"unit_profiles"> = {
  table: "unit_profiles",
  records: [] satisfies UnitProfileConfig[],
};
