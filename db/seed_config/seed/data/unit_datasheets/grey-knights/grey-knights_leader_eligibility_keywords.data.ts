import type { LeaderEligibilityKeywordConfig, SeedDataset } from "../../../../types/_index.types";

/**
 * Leader eligibility keyword predicates for the grey-knights faction.
 * Not yet extracted — populated manually or in a future importer pass.
 */
export const greyKnightsLeaderEligibilityKeywordsDataset: SeedDataset<"leader_eligibility_keywords"> = {
  table: "leader_eligibility_keywords",
  records: [] satisfies LeaderEligibilityKeywordConfig[],
};
