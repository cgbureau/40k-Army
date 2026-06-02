import type {
  KitConfig,
  SeedDataset,
} from "../../types/_index.types";
import { kitContentImportedKitsDataset } from "./kits/kit_content/_index.data";
import { tcgCsvImportedKitsDataset } from "./kits/tcgcsv/_index.data";

/**
 * Aggregates source-backed kit seed rows.
 * Do not add direct kit records here; add an importer/source shard instead.
 */
export const kitsDataset: SeedDataset<"kits"> = {
  table: "kits",
  records: [
    ...kitContentImportedKitsDataset.records,
    ...tcgCsvImportedKitsDataset.records,
  ] satisfies KitConfig[],
};
