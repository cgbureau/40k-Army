import type {
  PlayerConfig,
  SeedDataset,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `players` table.
 */
export const playersDataset: SeedDataset<"players"> = {
  table: "players",
  records: [] satisfies PlayerConfig[],
};
