import type {
  PlayerArmyListConfig,
  SeedDataset,
} from "@db_index/";

/**
 * Typed seed dataset for the `player_army_lists` table.
 */
export const playerArmyListsDataset: SeedDataset<"player_army_lists"> = {
  table: "player_army_lists",
  records: [] satisfies PlayerArmyListConfig[],
};
