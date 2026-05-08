import {
  abilitiesDataset,
  gameEditionsDataset,
  gameSizesDataset,
  keywordsDataset,
  rulesSourcesDataset,
} from "@db_index/";
import { createStaticSeedCollection } from "@db_index/";

/**
 * Static datasets owned by the reference data seed collection.
 */
const referenceDataDatasets = [
  gameEditionsDataset,
  gameSizesDataset,
  rulesSourcesDataset,
  abilitiesDataset,
  keywordsDataset,
];

/**
 * Seed collection for foundational lookup/reference data.
 *
 * This collection intentionally avoids database-specific insertion behavior for
 * now. `createStaticSeedCollection` supplies shared build, validation, no-op
 * insert, and summary behavior for static dataset modules.
 */
export const referenceDataCollection = createStaticSeedCollection({
  collection: "reference_data",
  dependencies: [],
  datasets: referenceDataDatasets,
});
