import type {
  PlayerCollectionConfig,
  SeedDataset,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `player_collections` table.
 */
export const playerCollectionsDataset: SeedDataset<"player_collections"> = {
  table: "player_collections",
  records: [] satisfies PlayerCollectionConfig[],
};
