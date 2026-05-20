import type { SeedDataset } from "../../types/_index.types";
import { rulesFactionSources10e } from "./rules_faction_sources/10e/_index.rules_faction_sources.data";

/**
 * Typed seed dataset for source applicability by rules faction.
 */
export const rulesFactionSourcesDataset: SeedDataset<"rules_faction_sources"> =
  {
    table: "rules_faction_sources",
    records: [...rulesFactionSources10e],
  };
