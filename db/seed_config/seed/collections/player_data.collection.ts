// player data phase
// - players
// - player_army_lists
// - player_army_list_units
// - player_collections
// - player_collection_models

import {
  playersDataset,
  playerArmyListsDataset,
  playerArmyListUnitsDataset,
  playerCollectionsDataset,
  playerCollectionModelsDataset,
} from "../data/_index.data";
import { createStaticSeedCollection } from "./utils.collection";

/**
 * Static datasets owned by the player data seed collection.
 */
const playerDataDatasets = [
  playersDataset,
  playerArmyListsDataset,
  playerArmyListUnitsDataset,
  playerCollectionsDataset,
  playerCollectionModelsDataset,
];

/**
 * Seed collection for player-owned army lists and collections.
 *
 * This collection intentionally avoids database-specific insertion behavior for
 * now. `createStaticSeedCollection` supplies shared build, validation, no-op
 * insert, and summary behavior for static dataset modules.
 */
export const playerDataCollection = createStaticSeedCollection({
  collection: "player_data",
  dependencies: ["reference_data", "factions", "units", "models", "kits"],
  datasets: playerDataDatasets,
});
