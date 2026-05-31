import type {
  SeedDataset,
  UnitProfileConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, unitId, unitProfileId } from "../../../ids";

/**
 * 10th edition unit profile rows owned by `salamanders`.
 * Generated from BSData Unit profiles.
 */

export const AdraxAgatone10eAdraxAgatoneUnitProfile: UnitProfileConfig = {
  id: unitProfileId("adrax_agatone__10e__adrax_agatone"),
  unit_profile_slug: "adrax_agatone__10e__adrax_agatone",
  unit_profile_name: "Adrax Agatone - Adrax Agatone",
  game_edition_id: gameEditionId("10e"),
  unit_id: unitId("adrax_agatone"),
  model_id: null,
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  effective_date: null,
  superseded_date: null,
};


export const VulkanHestan10eVulkanHestanUnitProfile: UnitProfileConfig = {
  id: unitProfileId("vulkan_hestan__10e__vulkan_hestan"),
  unit_profile_slug: "vulkan_hestan__10e__vulkan_hestan",
  unit_profile_name: "Vulkan He'stan - Vulkan He'stan",
  game_edition_id: gameEditionId("10e"),
  unit_id: unitId("vulkan_hestan"),
  model_id: null,
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  effective_date: null,
  superseded_date: null,
};


export const salamandersUnitProfiles10e: SeedDataset<"unit_profiles"> = {
  table: "unit_profiles",
  records: [
    AdraxAgatone10eAdraxAgatoneUnitProfile,
    VulkanHestan10eVulkanHestanUnitProfile,
  ] satisfies UnitProfileConfig[],
};
