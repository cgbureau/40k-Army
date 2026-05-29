import type { LeaderEligibilityKeywordConfig, SeedDataset } from "../../../../types/_index.types";

/**
 * Leader eligibility keyword predicates for the astra-militarum faction.
 * Not yet extracted — populated manually or in a future importer pass.
 */
export const astraMilitarumLeaderEligibilityKeywordsDataset: SeedDataset<"leader_eligibility_keywords"> = {
  table: "leader_eligibility_keywords",
  records: [] satisfies LeaderEligibilityKeywordConfig[],
};
