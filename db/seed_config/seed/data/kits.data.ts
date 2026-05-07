import type {
  KitConfig,
  SeedDataset,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `kits` table.
 */
export const kitsDataset: SeedDataset<"kits"> = {
  table: "kits",
  records: [] satisfies KitConfig[],
};
