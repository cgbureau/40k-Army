import type { KitUnitConfig, SeedDataset } from "../../types/_index.types";
import { kitContentImportedKitUnitsDataset } from "./kit_units/kit_content/_index.data";
import { kitUnitsMarkdownDatasets } from "./kit_units/markdown/_index.data";

/**
 * Aggregates source-backed kit-to-unit seed rows.
 * Do not add direct kit-unit records here; add an importer/source shard instead.
 */
export const kitUnitsDataset: SeedDataset<"kit_units"> = {
  table: "kit_units",
  records: [
    ...kitContentImportedKitUnitsDataset.records,
    ...kitUnitsMarkdownDatasets.flatMap((d) => d.records),
  ] satisfies KitUnitConfig[],
};
