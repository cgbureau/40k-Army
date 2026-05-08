import type {
  PlayerArmyListUnitConfig,
  SeedDataset,
} from "../../types/_index.types";

/**
 * Typed seed dataset for the `player_army_list_units` table.
 */
export const playerArmyListUnitsDataset: SeedDataset<"player_army_list_units"> =
  {
    table: "player_army_list_units",
    records: [] satisfies PlayerArmyListUnitConfig[],
  };
