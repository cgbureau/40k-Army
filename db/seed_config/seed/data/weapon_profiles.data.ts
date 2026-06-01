import type { SeedDataset } from "../../types/_index.types";
import { weaponProfiles10e } from "./weapon_profiles/10e/_index.weapon_profiles.data";

/**
 * Typed seed dataset for the `weapon_profiles` table.
 */
export const weaponProfilesDataset: SeedDataset<"weapon_profiles"> = {
  table: "weapon_profiles",
  records: [...weaponProfiles10e],
};
