import type {
  LeaderEligibilityKeywordConfig,
  SeedDataset,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `leader_eligibility_keywords` table.
 */
export const leaderEligibilityKeywordsDataset: SeedDataset<"leader_eligibility_keywords"> =
  {
    table: "leader_eligibility_keywords",
    records: [] satisfies LeaderEligibilityKeywordConfig[],
  };
