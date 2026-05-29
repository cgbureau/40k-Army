import type { LeaderEligibilityKeywordConfig, SeedDataset } from "../../../../types/_index.types";

/**
 * Leader eligibility keyword predicates for the chaos-space-marines faction.
 * Not yet extracted — populated manually or in a future importer pass.
 */
export const chaosSpaceMarinesLeaderEligibilityKeywordsDataset: SeedDataset<"leader_eligibility_keywords"> = {
  table: "leader_eligibility_keywords",
  records: [] satisfies LeaderEligibilityKeywordConfig[],
};
