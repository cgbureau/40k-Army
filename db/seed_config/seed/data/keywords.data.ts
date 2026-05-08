import type {
  KeywordConfig,
  SeedDataset,
} from "@db_index/";

/**
 * Typed seed dataset for the `keywords` table.
 */
export const keywordsDataset: SeedDataset<"keywords"> = {
  table: "keywords",
  records: [] satisfies KeywordConfig[],
};
