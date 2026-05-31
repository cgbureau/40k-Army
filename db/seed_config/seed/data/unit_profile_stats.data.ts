import type { SeedDataset } from "../../types/_index.types";
import { unitProfileStats10e } from "./unit_profile_stats/10e/_index.unit_profile_stats.data";

/**
 * Typed seed dataset for the `unit_profile_stats` table.
 */
export const unitProfileStatsDataset: SeedDataset<"unit_profile_stats"> = {
  table: "unit_profile_stats",
  records: [...unitProfileStats10e],
};
