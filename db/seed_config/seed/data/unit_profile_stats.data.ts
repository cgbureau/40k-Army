import type {
  SeedDataset,
  UnitProfileStatConfig,
} from "@db_index/";

/**
 * Typed seed dataset for the `unit_profile_stats` table.
 */
export const unitProfileStatsDataset: SeedDataset<"unit_profile_stats"> = {
  table: "unit_profile_stats",
  records: [] satisfies UnitProfileStatConfig[],
};
