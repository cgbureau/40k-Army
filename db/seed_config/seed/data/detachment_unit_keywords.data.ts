import type {
  DetachmentUnitKeywordConfig,
  SeedDataset,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `detachment_unit_keywords` table.
 */
export const detachmentUnitKeywordsDataset: SeedDataset<"detachment_unit_keywords"> =
  {
    table: "detachment_unit_keywords",
    records: [] satisfies DetachmentUnitKeywordConfig[],
  };
