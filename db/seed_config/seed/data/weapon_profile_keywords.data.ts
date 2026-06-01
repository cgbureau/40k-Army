import type { SeedDataset } from "../../types/_index.types";
import { weaponProfileKeywords10e } from "./weapon_profile_keywords/10e/_index.weapon_profile_keywords.data";

/**
 * Typed seed dataset for the `weapon_profile_keywords` table.
 */
export const weaponProfileKeywordsDataset: SeedDataset<"weapon_profile_keywords"> = {
  table: "weapon_profile_keywords",
  records: [...weaponProfileKeywords10e],
};
