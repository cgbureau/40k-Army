import type {
  SeedDataset,
  WeaponConfig,
} from "../../../types/_index.types";
import { weaponId } from "../../ids";

/**
 * Weapon rows owned by `emperors_children`.
 * Generated from BSData weapon profiles.
 */

export const AgonisingEnergiesFocusedWitchfireWeapon: WeaponConfig = {
  id: weaponId("agonising_energies_focused_witchfire"),
  weapon_slug: "agonising_energies_focused_witchfire",
  weapon_name: "Agonising Energies - focused witchfire",
  weapon_type: "ranged",
};


export const AgonisingEnergiesWitchfireWeapon: WeaponConfig = {
  id: weaponId("agonising_energies_witchfire"),
  weapon_slug: "agonising_energies_witchfire",
  weapon_name: "Agonising Energies - witchfire",
  weapon_type: "ranged",
};


export const BladeOfTheLaerWeapon: WeaponConfig = {
  id: weaponId("blade_of_the_laer"),
  weapon_slug: "blade_of_the_laer",
  weapon_name: "Blade of the Laer",
  weapon_type: "melee",
};


export const BlissbladeWeapon: WeaponConfig = {
  id: weaponId("blissblade"),
  weapon_slug: "blissblade",
  weapon_name: "Blissblade",
  weapon_type: "melee",
};


export const DaemonicBladesStrikeWeapon: WeaponConfig = {
  id: weaponId("daemonic_blades_strike"),
  weapon_slug: "daemonic_blades_strike",
  weapon_name: "\u27a4 Daemonic blades - strike",
  weapon_type: "melee",
};


export const DaemonicBladesSweepWeapon: WeaponConfig = {
  id: weaponId("daemonic_blades_sweep"),
  weapon_slug: "daemonic_blades_sweep",
  weapon_name: "\u27a4 Daemonic blades - sweep",
  weapon_type: "melee",
};


export const DuellingSabreWeapon: WeaponConfig = {
  id: weaponId("duelling_sabre"),
  weapon_slug: "duelling_sabre",
  weapon_name: "Duelling sabre",
  weapon_type: "melee",
};


export const HadesAutocannonWeapon: WeaponConfig = {
  id: weaponId("hades_autocannon"),
  weapon_slug: "hades_autocannon",
  weapon_name: "Hades autocannon",
  weapon_type: "ranged",
};


export const LashOfTormentWeapon: WeaponConfig = {
  id: weaponId("lash_of_torment"),
  weapon_slug: "lash_of_torment",
  weapon_name: "Lash of Torment",
  weapon_type: "melee",
};


export const MaleficLashWeapon: WeaponConfig = {
  id: weaponId("malefic_lash"),
  weapon_slug: "malefic_lash",
  weapon_name: "Malefic lash",
  weapon_type: "ranged",
};


export const MasterCraftedPowerSwordWeapon: WeaponConfig = {
  id: weaponId("master_crafted_power_sword"),
  weapon_slug: "master_crafted_power_sword",
  weapon_name: "Master-crafted power sword",
  weapon_type: "melee",
};


export const PhoenixPowerSpearWeapon: WeaponConfig = {
  id: weaponId("phoenix_power_spear"),
  weapon_slug: "phoenix_power_spear",
  weapon_name: "Phoenix power spear",
  weapon_type: "melee",
};


export const RaptureLashWeapon: WeaponConfig = {
  id: weaponId("rapture_lash"),
  weapon_slug: "rapture_lash",
  weapon_name: "Rapture lash",
  weapon_type: "melee",
};


export const SerpentineTailWeapon: WeaponConfig = {
  id: weaponId("serpentine_tail"),
  weapon_slug: "serpentine_tail",
  weapon_name: "Serpentine tail",
  weapon_type: "melee",
};


export const emperorsChildrenWeapons: SeedDataset<"weapons"> = {
  table: "weapons",
  records: [
    AgonisingEnergiesFocusedWitchfireWeapon,
    AgonisingEnergiesWitchfireWeapon,
    BladeOfTheLaerWeapon,
    BlissbladeWeapon,
    DaemonicBladesStrikeWeapon,
    DaemonicBladesSweepWeapon,
    DuellingSabreWeapon,
    HadesAutocannonWeapon,
    LashOfTormentWeapon,
    MaleficLashWeapon,
    MasterCraftedPowerSwordWeapon,
    PhoenixPowerSpearWeapon,
    RaptureLashWeapon,
    SerpentineTailWeapon,
  ] satisfies WeaponConfig[],
};
