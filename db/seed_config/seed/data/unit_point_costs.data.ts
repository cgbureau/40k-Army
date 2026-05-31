import type { SeedDataset } from "../../types/_index.types";
import { unitPointCosts10e } from "./unit_point_costs/10e/_index.unit_point_costs.data";

/**
 * Typed seed dataset for the `unit_point_costs` table.
 */
export const unitPointCostsDataset: SeedDataset<"unit_point_costs"> = {
  table: "unit_point_costs",
  records: [...unitPointCosts10e],
};
