import type { SeedDataset } from "../../types/_index.types";
import { unitWeapons10e } from "./unit_weapons/10e/_index.unit_weapons.data";

/**
 * Typed seed dataset for the `unit_weapons` table.
 */
export const unitWeaponsDataset: SeedDataset<"unit_weapons"> = {
  table: "unit_weapons",
  records: [...unitWeapons10e],
};
