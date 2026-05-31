import type { SeedDataset } from "../../types/_index.types";
import { rulesFactionDetachments10e } from "./rules_faction_detachments/10e/_index.rules_faction_detachments.data";

/**
 * Typed seed dataset for the `rules_faction_detachments` table.
 */
export const rulesFactionDetachmentsDataset: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [...rulesFactionDetachments10e],
};
