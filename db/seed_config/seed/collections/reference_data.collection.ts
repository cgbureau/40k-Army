import {
  abilitiesDataset,
  countriesDataset,
  gameEditionsDataset,
  gameSizesDataset,
  keywordsDataset,
  rulesSourcesDataset,
} from "../data/_index.data";
import { createStaticSeedCollection } from "./utils.collection";

/**
 * Static datasets owned by the reference data seed collection.
 */
const referenceDataDatasets = [
  gameEditionsDataset,
  gameSizesDataset,
  countriesDataset,
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
