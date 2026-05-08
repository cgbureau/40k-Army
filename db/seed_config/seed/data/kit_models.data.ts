import type {
  KitModelConfig,
  SeedDataset,
} from "../../types/_index.types";

/**
 * Typed seed dataset for the `kit_models` table.
 */
export const kitModelsDataset: SeedDataset<"kit_models"> = {
  table: "kit_models",
  records: [] satisfies KitModelConfig[],
};
