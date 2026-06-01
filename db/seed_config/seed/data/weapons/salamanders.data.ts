import type {
  SeedDataset,
  WeaponConfig,
} from "../../../types/_index.types";
import { weaponId } from "../../ids";

/**
 * Weapon rows owned by `salamanders`.
 * Generated from BSData weapon profiles.
 */

export const DrakkisWeapon: WeaponConfig = {
  id: weaponId("drakkis"),
  weapon_slug: "drakkis",
  weapon_name: "Drakkis",
  weapon_type: "ranged",
};


export const GauntletOfTheForgeWeapon: WeaponConfig = {
  id: weaponId("gauntlet_of_the_forge"),
  weapon_slug: "gauntlet_of_the_forge",
  weapon_name: "Gauntlet of the Forge",
  weapon_type: "ranged",
};


export const MalleusNoctumWeapon: WeaponConfig = {
  id: weaponId("malleus_noctum"),
  weapon_slug: "malleus_noctum",
  weapon_name: "Malleus Noctum",
  weapon_type: "melee",
};


export const SpearOfVulkanWeapon: WeaponConfig = {
  id: weaponId("spear_of_vulkan"),
  weapon_slug: "spear_of_vulkan",
  weapon_name: "Spear of Vulkan",
  weapon_type: "melee",
};


export const salamandersWeapons: SeedDataset<"weapons"> = {
  table: "weapons",
  records: [
    DrakkisWeapon,
    GauntletOfTheForgeWeapon,
    MalleusNoctumWeapon,
    SpearOfVulkanWeapon,
  ] satisfies WeaponConfig[],
};
