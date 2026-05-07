import type {
  PlayerArmyListUnitConfig,
  SeedDataset,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `player_army_list_units` table.
 */
export const playerArmyListUnitsDataset: SeedDataset<"player_army_list_units"> =
  {
    table: "player_army_list_units",
    records: [] satisfies PlayerArmyListUnitConfig[],
  };
