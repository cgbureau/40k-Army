import type { SeedDataset } from "../../types/_index.types";
import { unitAbilities10e } from "./unit_abilities/10e/_index.unit_abilities.data";

/**
 * Typed seed dataset for the `unit_abilities` table.
 */
export const unitAbilitiesDataset: SeedDataset<"unit_abilities"> = {
  table: "unit_abilities",
  records: [...unitAbilities10e],
};
