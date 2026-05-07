import type {
  ModelConfig,
  SeedDataset,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `models` table.
 */
export const modelsDataset: SeedDataset<"models"> = {
  table: "models",
  records: [] satisfies ModelConfig[],
};
