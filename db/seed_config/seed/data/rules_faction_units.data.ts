import type {
  RulesFactionUnitConfig,
  SeedDataset,
} from "@db_index/";

/**
 * Typed seed dataset for the `rules_faction_units` table.
 */
export const rulesFactionUnitsDataset: SeedDataset<"rules_faction_units"> = {
  table: "rules_faction_units",
  records: [] satisfies RulesFactionUnitConfig[],
};
