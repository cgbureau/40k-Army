import type {
  SeedDataset,
  UnitModelConfig,
} from "../../types/_index.types";

/**
 * Typed seed dataset for the `unit_models` table.
 */
export const unitModelsDataset: SeedDataset<"unit_models"> = {
  table: "unit_models",
  records: [] satisfies UnitModelConfig[],
};
