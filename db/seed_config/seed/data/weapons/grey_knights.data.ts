import type {
  SeedDataset,
  WeaponConfig,
} from "../../../types/_index.types";
import { weaponId } from "../../ids";

/**
 * Weapon rows owned by `grey_knights`.
 * Generated from BSData weapon profiles.
 */

export const ArmoredHullWeapon: WeaponConfig = {
  id: weaponId("armored_hull"),
  weapon_slug: "armored_hull",
  weapon_name: "Armored Hull",
  weapon_type: "melee",
};


export const BlackBladeOfAntwyrWeapon: WeaponConfig = {
  id: weaponId("black_blade_of_antwyr"),
  weapon_slug: "black_blade_of_antwyr",
  weapon_name: "Black Blade of Antwyr",
  weapon_type: "melee",
};


export const FlamestormCannonWeapon: WeaponConfig = {
  id: weaponId("flamestorm_cannon"),
  weapon_slug: "flamestorm_cannon",
  weapon_name: "Flamestorm cannon",
  weapon_type: "ranged",
};


export const HellstrikeMissileBatteryWeapon: WeaponConfig = {
  id: weaponId("hellstrike_missile_battery"),
  weapon_slug: "hellstrike_missile_battery",
  weapon_name: "Hellstrike missile battery",
  weapon_type: "ranged",
};


export const IcarusStormcannonWeapon: WeaponConfig = {
  id: weaponId("icarus_stormcannon"),
  weapon_slug: "icarus_stormcannon",
  weapon_name: "Icarus stormcannon",
  weapon_type: "ranged",
};


export const MalleusArgyrumWeapon: WeaponConfig = {
  id: weaponId("malleus_argyrum"),
  weapon_slug: "malleus_argyrum",
  weapon_name: "Malleus Argyrum",
  weapon_type: "melee",
};


export const NemesisForceSwordWeapon: WeaponConfig = {
  id: weaponId("nemesis_force_sword"),
  weapon_slug: "nemesis_force_sword",
  weapon_name: "Nemesis force sword",
  weapon_type: "melee",
};


export const NemesisForceWeaponWeapon: WeaponConfig = {
  id: weaponId("nemesis_force_weapon"),
  weapon_slug: "nemesis_force_weapon",
  weapon_name: "Nemesis force weapon",
  weapon_type: "melee",
};


export const PurifyingFlameWeapon: WeaponConfig = {
  id: weaponId("purifying_flame"),
  weapon_slug: "purifying_flame",
  weapon_name: "Purifying Flame",
  weapon_type: "ranged",
};


export const ScourgingWeapon: WeaponConfig = {
  id: weaponId("scourging"),
  weapon_slug: "scourging",
  weapon_name: "Scourging",
  weapon_type: "ranged",
};


export const SearingPurityWeapon: WeaponConfig = {
  id: weaponId("searing_purity"),
  weapon_slug: "searing_purity",
  weapon_name: "Searing Purity",
  weapon_type: "ranged",
};


export const TheTitanswordWeapon: WeaponConfig = {
  id: weaponId("the_titansword"),
  weapon_slug: "the_titansword",
  weapon_name: "The Titansword",
  weapon_type: "melee",
};


export const ThunderhawkHeavyCannonWeapon: WeaponConfig = {
  id: weaponId("thunderhawk_heavy_cannon"),
  weapon_slug: "thunderhawk_heavy_cannon",
  weapon_name: "Thunderhawk heavy cannon",
  weapon_type: "ranged",
};


export const TurboLaserDestructorWeapon: WeaponConfig = {
  id: weaponId("turbo_laser_destructor"),
  weapon_slug: "turbo_laser_destructor",
  weapon_name: "Turbo-laser destructor",
  weapon_type: "ranged",
};


export const TwinHeavyPlasmaCannonStandardWeapon: WeaponConfig = {
  id: weaponId("twin_heavy_plasma_cannon_standard"),
  weapon_slug: "twin_heavy_plasma_cannon_standard",
  weapon_name: "\u27a4 Twin heavy plasma cannon - standard",
  weapon_type: "ranged",
};


export const TwinHeavyPlasmaCannonSuperchargeWeapon: WeaponConfig = {
  id: weaponId("twin_heavy_plasma_cannon_supercharge"),
  weapon_slug: "twin_heavy_plasma_cannon_supercharge",
  weapon_name: "\u27a4 Twin heavy plasma cannon - supercharge",
  weapon_type: "ranged",
};


export const TwinPsycannonWeapon: WeaponConfig = {
  id: weaponId("twin_psycannon"),
  weapon_slug: "twin_psycannon",
  weapon_name: "Twin psycannon",
  weapon_type: "ranged",
};


export const greyKnightsWeapons: SeedDataset<"weapons"> = {
  table: "weapons",
  records: [
    ArmoredHullWeapon,
    BlackBladeOfAntwyrWeapon,
    FlamestormCannonWeapon,
    HellstrikeMissileBatteryWeapon,
    IcarusStormcannonWeapon,
    MalleusArgyrumWeapon,
    NemesisForceSwordWeapon,
    NemesisForceWeaponWeapon,
    PurifyingFlameWeapon,
    ScourgingWeapon,
    SearingPurityWeapon,
    TheTitanswordWeapon,
    ThunderhawkHeavyCannonWeapon,
    TurboLaserDestructorWeapon,
    TwinHeavyPlasmaCannonStandardWeapon,
    TwinHeavyPlasmaCannonSuperchargeWeapon,
    TwinPsycannonWeapon,
  ] satisfies WeaponConfig[],
};
