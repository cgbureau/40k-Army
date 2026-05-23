import type {
  LeaderEligibilityKeywordConfig,
  SeedDataset,
} from "../../types/_index.types";

/**
 * Typed seed dataset for the `leader_eligibility_keywords` table.
 */
export const leaderEligibilityKeywordsDataset: SeedDataset<"leader_eligibility_keywords"> =
  {
    table: "leader_eligibility_keywords",
    records: [] satisfies LeaderEligibilityKeywordConfig[],
  };
