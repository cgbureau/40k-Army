import type {
  SeedDataset,
  UnitWeaponConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, unitId, unitWeaponId, weaponProfileId } from "../../../ids";

/**
 * 10th edition unit weapon rows owned by `salamanders`.
 * Generated from BSData weapon profiles.
 */

export const AdraxAgatoneDrakkis10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("adrax_agatone__drakkis__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("adrax_agatone"),
  model_id: null,
  weapon_profile_id: weaponProfileId("drakkis__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const AdraxAgatoneMalleusNoctum10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("adrax_agatone__malleus_noctum__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("adrax_agatone"),
  model_id: null,
  weapon_profile_id: weaponProfileId("malleus_noctum__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const VulkanHestanGauntletOfTheForge10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("vulkan_hestan__gauntlet_of_the_forge__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("vulkan_hestan"),
  model_id: null,
  weapon_profile_id: weaponProfileId("gauntlet_of_the_forge__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const VulkanHestanSpearOfVulkan10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("vulkan_hestan__spear_of_vulkan__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("vulkan_hestan"),
  model_id: null,
  weapon_profile_id: weaponProfileId("spear_of_vulkan__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const salamandersUnitWeapons10e: SeedDataset<"unit_weapons"> = {
  table: "unit_weapons",
  records: [
    AdraxAgatoneDrakkis10eFactionPackSpaceMarines10eV18UnitWeapon,
    AdraxAgatoneMalleusNoctum10eFactionPackSpaceMarines10eV18UnitWeapon,
    VulkanHestanGauntletOfTheForge10eFactionPackSpaceMarines10eV18UnitWeapon,
    VulkanHestanSpearOfVulkan10eFactionPackSpaceMarines10eV18UnitWeapon,
  ] satisfies UnitWeaponConfig[],
};
