import type {
  PlayerArmyListConfig,
  SeedDataset,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `player_army_lists` table.
 */
export const playerArmyListsDataset: SeedDataset<"player_army_lists"> = {
  table: "player_army_lists",
  records: [] satisfies PlayerArmyListConfig[],
};
