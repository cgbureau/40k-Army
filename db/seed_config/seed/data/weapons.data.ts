import type { SeedDataset } from "../../types/_index.types";
import { weapons } from "./weapons/_index.weapons.data";

/**
 * Typed seed dataset for the `weapons` table.
 */
export const weaponsDataset: SeedDataset<"weapons"> = {
  table: "weapons",
  records: [...weapons],
};
