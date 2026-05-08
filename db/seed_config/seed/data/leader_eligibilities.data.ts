import type {
  LeaderEligibilityConfig,
  SeedDataset,
} from "@db_index/";

/**
 * Typed seed dataset for the `leader_eligibilities` table.
 */
export const leaderEligibilitiesDataset: SeedDataset<"leader_eligibilities"> =
  {
    table: "leader_eligibilities",
    records: [] satisfies LeaderEligibilityConfig[],
  };
