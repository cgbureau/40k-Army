import type {
  ModelConfig,
  SeedDataset,
} from "@db_index/";

/**
 * Typed seed dataset for the `models` table.
 */
export const modelsDataset: SeedDataset<"models"> = {
  table: "models",
  records: [] satisfies ModelConfig[],
};
