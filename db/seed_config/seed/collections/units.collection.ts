import {
  unitsDataset,
  unitProfilesDataset,
  unitProfileStatsDataset,
  unitPointCostsDataset,
  unitKeywordsDataset,
  detachmentUnitKeywordsDataset,
  leaderEligibilitiesDataset,
  leaderEligibilityKeywordsDataset,
  unitAbilitiesDataset,
  unitSelectionLimitsDataset,
  unitWeaponsDataset,
  rulesFactionUnitsDataset,
} from "../data/_index.data";
import { createStaticSeedCollection } from "./utils.collection";

/**
 * Static datasets owned by the units seed collection.
 */
const unitDataDatasets = [
  unitsDataset,
  unitProfilesDataset,
  unitProfileStatsDataset,
  unitPointCostsDataset,
  unitKeywordsDataset,
  detachmentUnitKeywordsDataset,
  leaderEligibilitiesDataset,
  leaderEligibilityKeywordsDataset,
  unitAbilitiesDataset,
  unitSelectionLimitsDataset,
  unitWeaponsDataset,
  rulesFactionUnitsDataset,
];

/**
 * Seed collection for unit data.
 *
 * This collection intentionally avoids database-specific insertion behavior for
 * now. `createStaticSeedCollection` supplies shared build, validation, no-op
 * insert, and summary behavior for static dataset modules.
 *
 * IMPORTANT: unit_profiles.model_id is an optional FK to the `models` table
 * (collection pos 4). This collection runs at pos 2 — safe while no seed record
 * sets model_id, but will fail if any record does. Fix: seed model_id after
 * models are seeded, or make the FK deferrable.
 */
export const unitDataCollection = createStaticSeedCollection({
  collection: "units",
  dependencies: ["reference_data", "factions", "weapons"],
  datasets: unitDataDatasets,
});
