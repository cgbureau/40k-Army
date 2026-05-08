import type {
  PlayerConfig,
  SeedDataset,
} from "@db_index/";

/**
 * Typed seed dataset for the `players` table.
 */
export const playersDataset: SeedDataset<"players"> = {
  table: "players",
  records: [] satisfies PlayerConfig[],
};
