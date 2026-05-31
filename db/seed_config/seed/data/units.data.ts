import type { SeedDataset } from "../../types/_index.types";
import { units10e } from "./units/10e/_index.units.data";

/**
 * Typed seed dataset for the `units` table.
 */
export const unitsDataset: SeedDataset<"units"> = {
  table: "units",
  records: [...units10e],
};
