import type { SeedDataset } from "../../types/_index.types";
import { detachmentUnitKeywords10e } from "./detachment_unit_keywords/10e/_index.detachment_unit_keywords.data";

/**
 * Typed seed dataset for the `detachment_unit_keywords` table.
 */
export const detachmentUnitKeywordsDataset: SeedDataset<"detachment_unit_keywords"> = {
  table: "detachment_unit_keywords",
  records: [...detachmentUnitKeywords10e],
};
