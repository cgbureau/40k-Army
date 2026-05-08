import type {
  KitTypeConfig,
  SeedDataset,
} from "@db_index/";

/**
 * Typed seed dataset for the `kit_types` table.
 */
export const kitTypesDataset: SeedDataset<"kit_types"> = {
  table: "kit_types",
  records: [] satisfies KitTypeConfig[],
};
