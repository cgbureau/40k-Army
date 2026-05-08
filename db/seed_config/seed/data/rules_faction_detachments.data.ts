import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "@db_index/";

/**
 * Typed seed dataset for the `rules_faction_detachments` table.
 */
export const rulesFactionDetachmentsDataset: SeedDataset<"rules_faction_detachments"> =
  {
    table: "rules_faction_detachments",
    records: [] satisfies RulesFactionDetachmentConfig[],
  };
