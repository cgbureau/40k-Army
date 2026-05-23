import type {
  LeaderEligibilityConfig,
  SeedDataset,
} from "../../types/_index.types";

/**
 * Typed seed dataset for the `leader_eligibilities` table.
 */
export const leaderEligibilitiesDataset: SeedDataset<"leader_eligibilities"> =
  {
    table: "leader_eligibilities",
    records: [] satisfies LeaderEligibilityConfig[],
  };
