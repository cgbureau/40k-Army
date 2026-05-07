import type {
  RulesFactionSourceConfig,
  SeedDataset,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `rules_faction_sources` table.
 */
export const rulesFactionSourcesDataset: SeedDataset<"rules_faction_sources"> =
  {
    table: "rules_faction_sources",
    records: [] satisfies RulesFactionSourceConfig[],
  };
