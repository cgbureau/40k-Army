import type {
  GameSizeConfig,
  SeedDataset,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `game_sizes` table.
 */
export const gameSizesDataset: SeedDataset<"game_sizes"> = {
  table: "game_sizes",
  records: [] satisfies GameSizeConfig[],
};
