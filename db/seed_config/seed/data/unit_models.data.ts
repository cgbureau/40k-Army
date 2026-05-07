import type {
  SeedDataset,
  UnitModelConfig,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `unit_models` table.
 */
export const unitModelsDataset: SeedDataset<"unit_models"> = {
  table: "unit_models",
  records: [] satisfies UnitModelConfig[],
};
