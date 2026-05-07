import type {
  KitModelConfig,
  SeedDataset,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `kit_models` table.
 */
export const kitModelsDataset: SeedDataset<"kit_models"> = {
  table: "kit_models",
  records: [] satisfies KitModelConfig[],
};
