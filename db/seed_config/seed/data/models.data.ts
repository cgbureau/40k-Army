import type { SeedDataset } from "../../types/_index.types";
import { models } from "./models/_index.models.data";

/**
 * Typed seed dataset for the `models` table.
 */
export const modelsDataset: SeedDataset<"models"> = {
  table: "models",
  records: [...models],
};
