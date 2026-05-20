import type { GameSizeConfig, SeedDataset } from "../../types/_index.types";
import { gameSizeId } from "../ids";
import { gameEditionId } from "../ids";

/**
 * Typed seed dataset for the `game_sizes` table.
 */

export const combatPatrolGameSize: GameSizeConfig = {
  id: gameSizeId("combat_patrol"),
  game_size_name: "Combat Patrol",
  game_size_slug: "combat_patrol",
  minimum_points: 1,
  maximum_points: null,
  game_edition_id: gameEditionId("10e"),
};

export const incursionGameSize: GameSizeConfig = {
  id: gameSizeId("incursion"),
  game_size_name: "Incursion",
  game_size_slug: "incursion",
  minimum_points: null,
  maximum_points: 1000,
  game_edition_id: gameEditionId("10e"),
};

export const strikeForceGameSize: GameSizeConfig = {
  id: gameSizeId("strike_force"),
  game_size_name: "Strike Force",
  game_size_slug: "strike_force",
  minimum_points: 1001,
  maximum_points: 2000,
  game_edition_id: gameEditionId("10e"),
};

export const onslaughtGameSize: GameSizeConfig = {
  id: gameSizeId("onslaught"),
  game_size_name: "Onslaught",
  game_size_slug: "onslaught",
  minimum_points: 2001,
  maximum_points: null,
  game_edition_id: gameEditionId("10e"),
};
export const gameSizesDataset: SeedDataset<"game_sizes"> = {
  table: "game_sizes",
  records: [] satisfies GameSizeConfig[],
};
