// models phase
// - models
// - unit_models

import { modelsDataset, unitModelsDataset } from "../data/_index.data";
import { createStaticSeedCollection } from "./utils.collection";

/**
 * Static datasets owned by the models seed collection.
 */
const modelDataDatasets = [modelsDataset, unitModelsDataset];

/**
 * Seed collection for model data.
 *
 * This collection intentionally avoids database-specific insertion behavior for
 * now. `createStaticSeedCollection` supplies shared build, validation, no-op
 * insert, and summary behavior for static dataset modules.
 */
export const modelDataCollection = createStaticSeedCollection({
  collection: "models",
  dependencies: ["units"],
  datasets: modelDataDatasets,
});
