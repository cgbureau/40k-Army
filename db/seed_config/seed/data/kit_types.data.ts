import type {
  KitTypeConfig,
  SeedDataset,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `kit_types` table.
 */
export const kitTypesDataset: SeedDataset<"kit_types"> = {
  table: "kit_types",
  records: [] satisfies KitTypeConfig[],
};
