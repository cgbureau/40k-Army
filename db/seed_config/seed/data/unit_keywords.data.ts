import type { SeedDataset } from "../../types/_index.types";
import { unitKeywords10e } from "./unit_keywords/10e/_index.unit_keywords.data";

/**
 * Typed seed dataset for the `unit_keywords` table.
 */
export const unitKeywordsDataset: SeedDataset<"unit_keywords"> = {
  table: "unit_keywords",
  records: [...unitKeywords10e],
};
