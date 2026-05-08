import type {
  SeedDataset,
  UnitKeywordConfig,
} from "@db_index/";

/**
 * Typed seed dataset for the `unit_keywords` table.
 */
export const unitKeywordsDataset: SeedDataset<"unit_keywords"> = {
  table: "unit_keywords",
  records: [] satisfies UnitKeywordConfig[],
};
