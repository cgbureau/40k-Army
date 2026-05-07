import type {
  KeywordConfig,
  SeedDataset,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `keywords` table.
 */
export const keywordsDataset: SeedDataset<"keywords"> = {
  table: "keywords",
  records: [] satisfies KeywordConfig[],
};
