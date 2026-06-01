import type {
  SeedDataset,
  WeaponConfig,
} from "../../../types/_index.types";
import { weaponId } from "../../ids";

/**
 * Weapon rows owned by `black_templars`.
 * Generated from BSData weapon profiles.
 */

export const ArtificerCroziusWeapon: WeaponConfig = {
  id: weaponId("artificer_crozius"),
  weapon_slug: "artificer_crozius",
  weapon_name: "Artificer Crozius",
  weapon_type: "melee",
};


export const AstartesChainswordWeapon: WeaponConfig = {
  id: weaponId("astartes_chainsword"),
  weapon_slug: "astartes_chainsword",
  weapon_name: "Astartes Chainsword",
  weapon_type: "melee",
};


export const AstartesShotgunWeapon: WeaponConfig = {
  id: weaponId("astartes_shotgun"),
  weapon_slug: "astartes_shotgun",
  weapon_name: "Astartes Shotgun",
  weapon_type: "ranged",
};


export const BlackSwordStrikeWeapon: WeaponConfig = {
  id: weaponId("black_sword_strike"),
  weapon_slug: "black_sword_strike",
  weapon_name: "\u27a4 Black Sword - Strike",
  weapon_type: "melee",
};


export const BlackSwordSweepWeapon: WeaponConfig = {
  id: weaponId("black_sword_sweep"),
  weapon_slug: "black_sword_sweep",
  weapon_name: "\u27a4 Black Sword - Sweep",
  weapon_type: "melee",
};


export const CombatKnifeWeapon: WeaponConfig = {
  id: weaponId("combat_knife"),
  weapon_slug: "combat_knife",
  weapon_name: "Combat Knife",
  weapon_type: "melee",
};


export const FerocityWeapon: WeaponConfig = {
  id: weaponId("ferocity"),
  weapon_slug: "ferocity",
  weapon_name: "Ferocity",
  weapon_type: "ranged",
};


export const HeavyLaserDestroyerWeapon: WeaponConfig = {
  id: weaponId("heavy_laser_destroyer"),
  weapon_slug: "heavy_laser_destroyer",
  weapon_name: "Heavy Laser Destroyer",
  weapon_type: "ranged",
};


export const IronhailSkytalonArrayWeapon: WeaponConfig = {
  id: weaponId("ironhail_skytalon_array"),
  weapon_slug: "ironhail_skytalon_array",
  weapon_name: "Ironhail Skytalon Array",
  weapon_type: "ranged",
};


export const LancerLaserDestroyerWeapon: WeaponConfig = {
  id: weaponId("lancer_laser_destroyer"),
  weapon_slug: "lancer_laser_destroyer",
  weapon_name: "Lancer Laser Destroyer",
  weapon_type: "ranged",
};


export const LasTalonWeapon: WeaponConfig = {
  id: weaponId("las_talon"),
  weapon_slug: "las_talon",
  weapon_name: "Las-talon",
  weapon_type: "ranged",
};


export const MasterCraftedPowerWeaponWeapon: WeaponConfig = {
  id: weaponId("master_crafted_power_weapon"),
  weapon_slug: "master_crafted_power_weapon",
  weapon_name: "Master-crafted Power Weapon",
  weapon_type: "melee",
};


export const NeophyteFirearmWeapon: WeaponConfig = {
  id: weaponId("neophyte_firearm"),
  weapon_slug: "neophyte_firearm",
  weapon_name: "Neophyte Firearm",
  weapon_type: "ranged",
};


export const RepulsorExecutionerDefensiveArrayWeapon: WeaponConfig = {
  id: weaponId("repulsor_executioner_defensive_array"),
  weapon_slug: "repulsor_executioner_defensive_array",
  weapon_name: "Repulsor Executioner Defensive Array",
  weapon_type: "ranged",
};


export const SwordOfTheHighMarshalsStrikeWeapon: WeaponConfig = {
  id: weaponId("sword_of_the_high_marshals_strike"),
  weapon_slug: "sword_of_the_high_marshals_strike",
  weapon_name: "\u27a4 Sword of the High Marshals - Strike",
  weapon_type: "melee",
};


export const SwordOfTheHighMarshalsSweepWeapon: WeaponConfig = {
  id: weaponId("sword_of_the_high_marshals_sweep"),
  weapon_slug: "sword_of_the_high_marshals_sweep",
  weapon_name: "\u27a4 Sword of the High Marshals - Sweep",
  weapon_type: "melee",
};


export const TempestBolterWeapon: WeaponConfig = {
  id: weaponId("tempest_bolter"),
  weapon_slug: "tempest_bolter",
  weapon_name: "Tempest Bolter",
  weapon_type: "ranged",
};


export const ThunderHammerWeapon: WeaponConfig = {
  id: weaponId("thunder_hammer"),
  weapon_slug: "thunder_hammer",
  weapon_name: "Thunder Hammer",
  weapon_type: "melee",
};


export const TwinHeavyOnslaughtGatlingCannonWeapon: WeaponConfig = {
  id: weaponId("twin_heavy_onslaught_gatling_cannon"),
  weapon_slug: "twin_heavy_onslaught_gatling_cannon",
  weapon_name: "Twin Heavy Onslaught Gatling Cannon",
  weapon_type: "ranged",
};


export const TwinLasTalonWeapon: WeaponConfig = {
  id: weaponId("twin_las_talon"),
  weapon_slug: "twin_las_talon",
  weapon_name: "Twin Las-talon",
  weapon_type: "ranged",
};


export const TwinLightningClawsWeapon: WeaponConfig = {
  id: weaponId("twin_lightning_claws"),
  weapon_slug: "twin_lightning_claws",
  weapon_name: "Twin Lightning Claws",
  weapon_type: "melee",
};


export const blackTemplarsWeapons: SeedDataset<"weapons"> = {
  table: "weapons",
  records: [
    ArtificerCroziusWeapon,
    AstartesChainswordWeapon,
    AstartesShotgunWeapon,
    BlackSwordStrikeWeapon,
    BlackSwordSweepWeapon,
    CombatKnifeWeapon,
    FerocityWeapon,
    HeavyLaserDestroyerWeapon,
    IronhailSkytalonArrayWeapon,
    LancerLaserDestroyerWeapon,
    LasTalonWeapon,
    MasterCraftedPowerWeaponWeapon,
    NeophyteFirearmWeapon,
    RepulsorExecutionerDefensiveArrayWeapon,
    SwordOfTheHighMarshalsStrikeWeapon,
    SwordOfTheHighMarshalsSweepWeapon,
    TempestBolterWeapon,
    ThunderHammerWeapon,
    TwinHeavyOnslaughtGatlingCannonWeapon,
    TwinLasTalonWeapon,
    TwinLightningClawsWeapon,
  ] satisfies WeaponConfig[],
};
