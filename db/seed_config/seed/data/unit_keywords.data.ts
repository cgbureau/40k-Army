import type {
  SeedDataset,
  UnitKeywordConfig,
} from "../../types/_index.types";

/**
 * Typed seed dataset for the `unit_keywords` table.
 */
export const unitKeywordsDataset: SeedDataset<"unit_keywords"> = {
  table: "unit_keywords",
  records: [] satisfies UnitKeywordConfig[],
};
