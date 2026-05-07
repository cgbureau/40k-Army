import type {
  KitPriceConfig,
  SeedDataset,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `kit_prices` table.
 */
export const kitPricesDataset: SeedDataset<"kit_prices"> = {
  table: "kit_prices",
  records: [] satisfies KitPriceConfig[],
};
