import type {
  ModelConfig,
  SeedDataset,
} from "../../types/_index.types";

/**
 * Typed seed dataset for the `models` table.
 */
export const modelsDataset: SeedDataset<"models"> = {
  table: "models",
  records: [] satisfies ModelConfig[],
};
