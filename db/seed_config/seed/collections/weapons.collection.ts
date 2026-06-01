// weapons phase
// - weapons
// - weapon_profiles
// - weapon_profile_keywords

import {
  weaponProfileKeywordsDataset,
  weaponProfilesDataset,
  weaponsDataset,
} from "../data/_index.data";
import { createStaticSeedCollection } from "./utils.collection";

/**
 * Static datasets owned by the weapons seed collection.
 */
const weaponDataDatasets = [
  weaponsDataset,
  weaponProfilesDataset,
  weaponProfileKeywordsDataset,
];

/**
 * Seed collection for weapon definitions and edition-specific weapon profiles.
 *
 * This collection intentionally avoids database-specific insertion behavior for
 * now. `createStaticSeedCollection` supplies shared build, validation, no-op
 * insert, and summary behavior for static dataset modules.
 */
export const weaponDataCollection = createStaticSeedCollection({
  collection: "weapons",
  dependencies: ["reference_data"],
  datasets: weaponDataDatasets,
});
