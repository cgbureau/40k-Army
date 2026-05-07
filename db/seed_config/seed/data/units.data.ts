import type {
  SeedDataset,
  UnitConfig,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `units` table.
 */
export const unitsDataset: SeedDataset<"units"> = {
  table: "units",
  records: [] satisfies UnitConfig[],
};
