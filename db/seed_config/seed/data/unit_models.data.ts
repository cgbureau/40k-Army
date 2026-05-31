import type { SeedDataset } from "../../types/_index.types";
import { unitModels10e } from "./unit_models/10e/_index.unit_models.data";

/**
 * Typed seed dataset for the `unit_models` table.
 */
export const unitModelsDataset: SeedDataset<"unit_models"> = {
  table: "unit_models",
  records: [...unitModels10e],
};
