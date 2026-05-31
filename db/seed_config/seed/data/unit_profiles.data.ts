import type { SeedDataset } from "../../types/_index.types";
import { unitProfiles10e } from "./unit_profiles/10e/_index.unit_profiles.data";

/**
 * Typed seed dataset for the `unit_profiles` table.
 */
export const unitProfilesDataset: SeedDataset<"unit_profiles"> = {
  table: "unit_profiles",
  records: [...unitProfiles10e],
};
