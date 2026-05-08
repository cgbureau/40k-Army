import type {
  PlayerCollectionConfig,
  SeedDataset,
} from "@db_index/";

/**
 * Typed seed dataset for the `player_collections` table.
 */
export const playerCollectionsDataset: SeedDataset<"player_collections"> = {
  table: "player_collections",
  records: [] satisfies PlayerCollectionConfig[],
};
