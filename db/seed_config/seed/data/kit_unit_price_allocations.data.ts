import type {
  KitUnitPriceAllocationConfig,
  SeedDataset,
} from "../../types/_index.types";

/**
 * Source-backed kit-unit price allocations.
 * Empty until approved kit-unit edges and allocation policy are both explicit.
 */
export const kitUnitPriceAllocationsDataset: SeedDataset<"kit_unit_price_allocations"> =
  {
    table: "kit_unit_price_allocations",
    records: [] satisfies KitUnitPriceAllocationConfig[],
  };
