import type {
  KitUnitPriceAllocationConfig,
  SeedDataset,
} from "../../types/_index.types";

/**
 * Curated kit-unit price allocation seed scaffold.
 * Wahapedia does not provide kit prices, SKUs, product URLs, bundles, or allocations.
 */

export const kitUnitPriceAllocationsDataset: SeedDataset<"kit_unit_price_allocations"> =
  {
    table: "kit_unit_price_allocations",
    records: [] satisfies KitUnitPriceAllocationConfig[],
  };
