import type {
  PlayerConfig,
  SeedDataset,
} from "../../types/_index.types";

/**
 * Typed seed dataset for the `players` table.
 */
export const playersDataset: SeedDataset<"players"> = {
  table: "players",
  records: [] satisfies PlayerConfig[],
};
