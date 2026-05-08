// catalog of seed collection seeders
// what seed collections exist, and in what order should they run?

import {
  factionDataCollection,
  kitDataCollection,
  modelDataCollection,
  playerDataCollection,
  referenceDataCollection,
  unitDataCollection,
} from "./collections/_index.collection";

export const seedCollections = [
  referenceDataCollection,
  factionDataCollection,
  unitDataCollection,
  modelDataCollection,
  kitDataCollection,
  playerDataCollection,
];
