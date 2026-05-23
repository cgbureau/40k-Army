import type {
  PlayerCollectionConfig,
  SeedDataset,
} from "../../types/_index.types";

/**
 * Typed seed dataset for the `player_collections` table.
 */
export const playerCollectionsDataset: SeedDataset<"player_collections"> = {
  table: "player_collections",
  records: [] satisfies PlayerCollectionConfig[],
};
