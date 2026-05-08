import type {
  SeedDataset,
  UnitConfig,
} from "../../types/_index.types";

/**
 * Typed seed dataset for the `units` table.
 */
export const unitsDataset: SeedDataset<"units"> = {
  table: "units",
  records: [] satisfies UnitConfig[],
};
