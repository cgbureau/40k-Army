import {
  superFactionsDataset,
  rulesFactionsDataset,
  rulesFactionSourcesDataset,
  detachmentsDataset,
  rulesFactionDetachmentsDataset,
} from "../data/_index.data";
import { createStaticSeedCollection } from "./utils.collection";

/**
 * Static datasets owned by the factions seed collection.
 */
const factionDataDatasets = [
  superFactionsDataset,
  rulesFactionsDataset,
  rulesFactionSourcesDataset,
  detachmentsDataset,
  rulesFactionDetachmentsDataset,
];

/**
 * Seed collection for super factions, factions, and detachments.
 *
 * This collection intentionally avoids database-specific insertion behavior for
 * now. `createStaticSeedCollection` supplies shared build, validation, no-op
 * insert, and summary behavior for static dataset modules.
 */
export const factionDataCollection = createStaticSeedCollection({
  collection: "factions",
  dependencies: ["reference_data"],
  datasets: factionDataDatasets,
});
