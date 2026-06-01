import type { SeedDataset } from "../../types/_index.types";
import { unitSelectionLimits10e } from "./unit_selection_limits/10e/_index.unit_selection_limits.data";

/**
 * Typed seed dataset for the `unit_selection_limits` table.
 */
export const unitSelectionLimitsDataset: SeedDataset<"unit_selection_limits"> = {
  table: "unit_selection_limits",
  records: [...unitSelectionLimits10e],
};
