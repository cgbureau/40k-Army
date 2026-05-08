import type {
  RulesSourceConfig,
  SeedDataset,
} from "@db_index/";

/**
 * Typed seed dataset for the `rules_sources` table.
 */
export const rulesSourcesDataset: SeedDataset<"rules_sources"> = {
  table: "rules_sources",
  records: [] satisfies RulesSourceConfig[],
};
