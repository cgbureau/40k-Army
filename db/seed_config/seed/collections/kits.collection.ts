// kits phase
// - kit_types
// - kits
// - kit_models
// - kit_units
// - kit_unit_price_allocations
// - kit_prices

import {
  kitTypesDataset,
  kitsDataset,
  kitModelsDataset,
  kitUnitsDataset,
  kitUnitPriceAllocationsDataset,
  kitPricesDataset,
} from "../data/_index.data";
import { createStaticSeedCollection } from "./utils.collection";

/**
 * Static datasets owned by the kits seed collection.
 */
const kitDataDatasets = [
  kitTypesDataset,
  kitsDataset,
  kitModelsDataset,
  kitUnitsDataset,
  kitUnitPriceAllocationsDataset,
  kitPricesDataset,
];

/**
 * Seed collection for kit data.
 *
 * This collection intentionally avoids database-specific insertion behavior for
 * now. `createStaticSeedCollection` supplies shared build, validation, no-op
 * insert, and summary behavior for static dataset modules.
 */
export const kitDataCollection = createStaticSeedCollection({
  collection: "kits",
  dependencies: ["reference_data", "models", "units"],
  datasets: kitDataDatasets,
});
