import type {
  SeedDataset,
  UnitSelectionLimitConfig,
} from "@db_index/";

/**
 * Typed seed dataset for the `unit_selection_limits` table.
 */
export const unitSelectionLimitsDataset: SeedDataset<"unit_selection_limits"> =
  {
    table: "unit_selection_limits",
    records: [] satisfies UnitSelectionLimitConfig[],
  };
