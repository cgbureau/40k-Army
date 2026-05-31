import type { SeedDataset } from "../../types/_index.types";
import { leaderEligibilities10e } from "./leader_eligibilities/10e/_index.leader_eligibilities.data";

/**
 * Typed seed dataset for the `leader_eligibilities` table.
 */
export const leaderEligibilitiesDataset: SeedDataset<"leader_eligibilities"> = {
  table: "leader_eligibilities",
  records: [...leaderEligibilities10e],
};
