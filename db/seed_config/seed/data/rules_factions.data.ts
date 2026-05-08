import type {
  RulesFactionConfig,
  SeedDataset,
} from "../../types/_index.types";

/**
 * Typed seed dataset for the `rules_factions` table.
 */
export const rulesFactionsDataset: SeedDataset<"rules_factions"> = {
  table: "rules_factions",
  records: [] satisfies RulesFactionConfig[],
};
