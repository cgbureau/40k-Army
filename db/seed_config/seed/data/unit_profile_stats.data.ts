import type {
  SeedDataset,
  UnitProfileStatConfig,
} from "../../types/_index.types";

/**
 * Typed seed dataset for the `unit_profile_stats` table.
 */
export const unitProfileStatsDataset: SeedDataset<"unit_profile_stats"> = {
  table: "unit_profile_stats",
  records: [] satisfies UnitProfileStatConfig[],
};
