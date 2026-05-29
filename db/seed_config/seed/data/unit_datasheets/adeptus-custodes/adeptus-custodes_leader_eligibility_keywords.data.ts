import type { LeaderEligibilityKeywordConfig, SeedDataset } from "../../../../types/_index.types";

/**
 * Leader eligibility keyword predicates for the adeptus-custodes faction.
 * Not yet extracted — populated manually or in a future importer pass.
 */
export const adeptusCustodesLeaderEligibilityKeywordsDataset: SeedDataset<"leader_eligibility_keywords"> = {
  table: "leader_eligibility_keywords",
  records: [] satisfies LeaderEligibilityKeywordConfig[],
};
