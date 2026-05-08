import type {
  RulesFactionConfig,
  SeedDataset,
} from "@db_index/";

/**
 * Typed seed dataset for the `rules_factions` table.
 */
export const rulesFactionsDataset: SeedDataset<"rules_factions"> = {
  table: "rules_factions",
  records: [] satisfies RulesFactionConfig[],
};
