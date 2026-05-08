import type {
  LeaderEligibilityKeywordConfig,
  SeedDataset,
} from "@db_index/";

/**
 * Typed seed dataset for the `leader_eligibility_keywords` table.
 */
export const leaderEligibilityKeywordsDataset: SeedDataset<"leader_eligibility_keywords"> =
  {
    table: "leader_eligibility_keywords",
    records: [] satisfies LeaderEligibilityKeywordConfig[],
  };
