import type {
  SeedDataset,
  UnitModelConfig,
} from "@db_index/";

/**
 * Typed seed dataset for the `unit_models` table.
 */
export const unitModelsDataset: SeedDataset<"unit_models"> = {
  table: "unit_models",
  records: [] satisfies UnitModelConfig[],
};
