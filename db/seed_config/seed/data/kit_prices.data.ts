import { tcgCsvImportedKitPricesDataset } from "./kit_prices/tcgcsv/_index.data";
import { legacyImportedKitPricesDataset } from "./kit_prices/legacy/all.data";
import { gwImportedKitPricesDataset } from "./kit_prices/gw/all.data";
import type {
  KitPriceConfig,
  SeedDataset,
} from "../../types/_index.types";

/**
 * Typed seed dataset for the `kit_prices` table.
 */
export const kitPricesDataset: SeedDataset<"kit_prices"> = {
  table: "kit_prices",
  records: [
    ...tcgCsvImportedKitPricesDataset.records,
    ...legacyImportedKitPricesDataset.records,
    ...gwImportedKitPricesDataset.records,
  ] satisfies KitPriceConfig[],
};
