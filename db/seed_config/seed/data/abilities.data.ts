import type { SeedDataset } from "../../types/_index.types";
import { abilities10e } from "./abilities/10e/_index.abilities.data";

/**
 * Typed seed dataset for the `abilities` table.
 */
export const abilitiesDataset: SeedDataset<"abilities"> = {
  table: "abilities",
  records: [...abilities10e],
};
