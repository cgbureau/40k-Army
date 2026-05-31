import type { SeedDataset } from "../../types/_index.types";
import { leaderEligibilityKeywords10e } from "./leader_eligibility_keywords/10e/_index.leader_eligibility_keywords.data";

/**
 * Typed seed dataset for the `leader_eligibility_keywords` table.
 */
export const leaderEligibilityKeywordsDataset: SeedDataset<"leader_eligibility_keywords"> = {
  table: "leader_eligibility_keywords",
  records: [...leaderEligibilityKeywords10e],
};
