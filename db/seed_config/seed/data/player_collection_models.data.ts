import type {
  PlayerCollectionModelConfig,
  SeedDataset,
} from "../../types/_index.types";

/**
 * Typed seed dataset for the `player_collection_models` table.
 */
export const playerCollectionModelsDataset: SeedDataset<"player_collection_models"> =
  {
    table: "player_collection_models",
    records: [] satisfies PlayerCollectionModelConfig[],
  };
