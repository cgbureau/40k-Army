import type {
  SeedDataset,
  UnitConfig,
} from "@db_index/";

/**
 * Typed seed dataset for the `units` table.
 */
export const unitsDataset: SeedDataset<"units"> = {
  table: "units",
  records: [] satisfies UnitConfig[],
};
