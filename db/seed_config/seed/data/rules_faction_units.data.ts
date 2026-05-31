import type { SeedDataset } from "../../types/_index.types";
import { rulesFactionUnits10e } from "./rules_faction_units/10e/_index.rules_faction_units.data";

/**
 * Typed seed dataset for the `rules_faction_units` table.
 */
export const rulesFactionUnitsDataset: SeedDataset<"rules_faction_units"> = {
  table: "rules_faction_units",
  records: [...rulesFactionUnits10e],
};
