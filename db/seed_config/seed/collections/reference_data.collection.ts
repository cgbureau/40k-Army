import {
  abilitiesDataset,
  countriesDataset,
  gameEditionsDataset,
  gameSizesDataset,
  keywordsDataset,
  priceMarketsDataset,
  priceMarketCountriesDataset,
  rulesSourcesDataset,
} from "../data/_index.data";
import { createStaticSeedCollection } from "./utils.collection";

/**
 * Static datasets owned by the reference data seed collection.
 *
 * price_markets must come after countries (PriceMarketCountry has a FK to Country)
 * and before kit_prices (which may reference a price market).
 */
const referenceDataDatasets = [
  gameEditionsDataset,
  gameSizesDataset,
  countriesDataset,
  priceMarketsDataset,
  priceMarketCountriesDataset,
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
