import type {
  SeedDataset,
  UnitKeywordConfig,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `unit_keywords` table.
 */
export const unitKeywordsDataset: SeedDataset<"unit_keywords"> = {
  table: "unit_keywords",
  records: [] satisfies UnitKeywordConfig[],
};
