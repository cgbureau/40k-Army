import type {
  SeedDataset,
  UnitSelectionLimitConfig,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `unit_selection_limits` table.
 */
export const unitSelectionLimitsDataset: SeedDataset<"unit_selection_limits"> =
  {
    table: "unit_selection_limits",
    records: [] satisfies UnitSelectionLimitConfig[],
  };
