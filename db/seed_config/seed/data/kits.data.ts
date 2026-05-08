import type {
  KitConfig,
  SeedDataset,
} from "@db_index/";

/**
 * Typed seed dataset for the `kits` table.
 */
export const kitsDataset: SeedDataset<"kits"> = {
  table: "kits",
  records: [] satisfies KitConfig[],
};
