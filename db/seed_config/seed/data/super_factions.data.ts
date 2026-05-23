import type { SeedDataset, SuperFactionConfig } from "../../types/_index.types";
import { superFactionId } from "../ids";

export const ImperiumSuperFaction: SuperFactionConfig = {
  id: superFactionId("imperium"),
  super_faction_name: "Imperium",
  super_faction_slug: "imperium",
};

export const SpaceMarinesSuperFaction: SuperFactionConfig = {
  id: superFactionId("space_marines"),
  super_faction_name: "Space Marines",
  super_faction_slug: "space_marines",
};

export const ChaosSuperFaction: SuperFactionConfig = {
  id: superFactionId("chaos"),
  super_faction_name: "Chaos",
  super_faction_slug: "chaos",
};

export const XenosSuperFaction: SuperFactionConfig = {
  id: superFactionId("xenos"),
  super_faction_name: "Xenos",
  super_faction_slug: "xenos",
};

export const UnalignedForcesSuperFaction: SuperFactionConfig = {
  id: superFactionId("unaligned_forces"),
  super_faction_name: "Unaligned Forces",
  super_faction_slug: "unaligned_forces",
};

/**
 * Typed seed dataset for the `super_factions` table.
 */
export const superFactionsDataset: SeedDataset<"super_factions"> = {
  table: "super_factions",
  records: [
    ImperiumSuperFaction,
    SpaceMarinesSuperFaction,
    ChaosSuperFaction,
    XenosSuperFaction,
    UnalignedForcesSuperFaction,
  ] satisfies SuperFactionConfig[],
};
