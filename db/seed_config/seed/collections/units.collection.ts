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
];

/**
 * Seed collection for unit data.
 *
 * This collection intentionally avoids database-specific insertion behavior for
 * now. `createStaticSeedCollection` supplies shared build, validation, no-op
 * insert, and summary behavior for static dataset modules.
 */
export const unitDataCollection = createStaticSeedCollection({
  collection: "units",
  dependencies: ["reference_data", "factions"],
  datasets: unitDataDatasets,
});
