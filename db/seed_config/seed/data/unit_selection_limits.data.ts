import type {
  SeedDataset,
  UnitSelectionLimitConfig,
} from "../../types/_index.types";

/**
 * Typed seed dataset for the `unit_selection_limits` table.
 */
export const unitSelectionLimitsDataset: SeedDataset<"unit_selection_limits"> =
  {
    table: "unit_selection_limits",
    records: [] satisfies UnitSelectionLimitConfig[],
  };
