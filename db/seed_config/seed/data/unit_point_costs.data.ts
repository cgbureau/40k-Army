import type {
  SeedDataset,
  UnitPointCostConfig,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `unit_point_costs` table.
 */
export const unitPointCostsDataset: SeedDataset<"unit_point_costs"> = {
  table: "unit_point_costs",
  records: [] satisfies UnitPointCostConfig[],
};
