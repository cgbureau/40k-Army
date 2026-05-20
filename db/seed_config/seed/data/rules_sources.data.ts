import type { SeedDataset } from "../../types/_index.types";
import { rulesSources10e } from "./rules_sources/10e/_index.rules_sources.data";

/**
 * Typed seed dataset for concrete, versionable rules publications.
 */
export const rulesSourcesDataset: SeedDataset<"rules_sources"> = {
  table: "rules_sources",
  records: [...rulesSources10e],
};
