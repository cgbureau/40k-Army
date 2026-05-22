import type { KitUnitConfig, SeedDataset } from "../../types/_index.types";

/**
 * Curated kit-to-unit mapping seed scaffold.
 * Wahapedia does not provide reliable purchasable kit packaging data.
 */

export const kitUnitsDataset: SeedDataset<"kit_units"> = {
  table: "kit_units",
  records: [] satisfies KitUnitConfig[],
};
