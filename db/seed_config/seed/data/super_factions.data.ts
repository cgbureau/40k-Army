import type {
  SeedDataset,
  SuperFactionConfig,
} from "../../types/_index.types";
import { superFactionId } from "../ids";

export const ImperiumSuperFaction: SuperFactionConfig = {
  id: superFactionId("imperium"),
  super_faction_name: "Imperium",
  super_faction_slug: "imperium",
};

/**
 * Typed seed dataset for the `super_factions` table.
 */
export const superFactionsDataset: SeedDataset<"super_factions"> = {
  table: "super_factions",
  records: [ImperiumSuperFaction] satisfies SuperFactionConfig[],
};
