import type {
  KeywordConfig,
  SeedDataset,
} from "../../types/_index.types";

/**
 * Typed seed dataset for the `keywords` table.
 */
export const keywordsDataset: SeedDataset<"keywords"> = {
  table: "keywords",
  records: [] satisfies KeywordConfig[],
};
