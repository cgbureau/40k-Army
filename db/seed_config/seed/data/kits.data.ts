import type {
  KitConfig,
  SeedDataset,
} from "../../types/_index.types";

/**
 * Typed seed dataset for the `kits` table.
 */
export const kitsDataset: SeedDataset<"kits"> = {
  table: "kits",
  records: [] satisfies KitConfig[],
};
