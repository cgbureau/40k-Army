import type {
  LeaderEligibilityConfig,
  SeedDataset,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `leader_eligibilities` table.
 */
export const leaderEligibilitiesDataset: SeedDataset<"leader_eligibilities"> =
  {
    table: "leader_eligibilities",
    records: [] satisfies LeaderEligibilityConfig[],
  };
