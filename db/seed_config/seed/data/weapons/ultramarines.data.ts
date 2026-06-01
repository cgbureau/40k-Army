import type {
  SeedDataset,
  WeaponConfig,
} from "../../../types/_index.types";
import { weaponId } from "../../ids";

/**
 * Weapon rows owned by `ultramarines`.
 * Generated from BSData weapon profiles.
 */

export const ArtisanPlasmaPistolWeapon: WeaponConfig = {
  id: weaponId("artisan_plasma_pistol"),
  weapon_slug: "artisan_plasma_pistol",
  weapon_name: "Artisan Plasma Pistol",
  weapon_type: "ranged",
};


export const AstropathicBlastWeapon: WeaponConfig = {
  id: weaponId("astropathic_blast"),
  weapon_slug: "astropathic_blast",
  weapon_name: "Astropathic Blast",
  weapon_type: "ranged",
};


export const BladesOfHonourWeapon: WeaponConfig = {
  id: weaponId("blades_of_honour"),
  weapon_slug: "blades_of_honour",
  weapon_name: "Blades of Honour",
  weapon_type: "melee",
};


export const ChronusServoArmWeapon: WeaponConfig = {
  id: weaponId("chronus_servo_arm"),
  weapon_slug: "chronus_servo_arm",
  weapon_name: "Chronus' Servo-Arm",
  weapon_type: "melee",
};


export const GauntletsOfUltramarWeapon: WeaponConfig = {
  id: weaponId("gauntlets_of_ultramar"),
  weapon_slug: "gauntlets_of_ultramar",
  weapon_name: "Gauntlets of Ultramar",
  weapon_type: "ranged",
};


export const HandOfDominionWeapon: WeaponConfig = {
  id: weaponId("hand_of_dominion"),
  weapon_slug: "hand_of_dominion",
  weapon_name: "Hand of Dominion",
  weapon_type: "ranged",
};


export const InfernusWeapon: WeaponConfig = {
  id: weaponId("infernus"),
  weapon_slug: "infernus",
  weapon_name: "Infernus",
  weapon_type: "ranged",
};


export const InvictusWeapon: WeaponConfig = {
  id: weaponId("invictus"),
  weapon_slug: "invictus",
  weapon_name: "Invictus",
  weapon_type: "ranged",
};


export const MasterCraftedBolterWeapon: WeaponConfig = {
  id: weaponId("master_crafted_bolter"),
  weapon_slug: "master_crafted_bolter",
  weapon_name: "Master-crafted Bolter",
  weapon_type: "ranged",
};


export const QuietusWeapon: WeaponConfig = {
  id: weaponId("quietus"),
  weapon_slug: "quietus",
  weapon_name: "Quietus",
  weapon_type: "ranged",
};


export const RelicThunderHammerWeapon: WeaponConfig = {
  id: weaponId("relic_thunder_hammer"),
  weapon_slug: "relic_thunder_hammer",
  weapon_name: "Relic Thunder Hammer",
  weapon_type: "melee",
};


export const RodOfTiguriusWeapon: WeaponConfig = {
  id: weaponId("rod_of_tigurius"),
  weapon_slug: "rod_of_tigurius",
  weapon_name: "Rod of Tigurius",
  weapon_type: "melee",
};


export const StormOfTheEmperorsWrathFocusedWitchfireWeapon: WeaponConfig = {
  id: weaponId("storm_of_the_emperors_wrath_focused_witchfire"),
  weapon_slug: "storm_of_the_emperors_wrath_focused_witchfire",
  weapon_name: "\u27a4 Storm of the Emperor\u2019s Wrath - Focused Witchfire",
  weapon_type: "ranged",
};


export const StormOfTheEmperorsWrathWitchfireWeapon: WeaponConfig = {
  id: weaponId("storm_of_the_emperors_wrath_witchfire"),
  weapon_slug: "storm_of_the_emperors_wrath_witchfire",
  weapon_name: "\u27a4 Storm of the Emperor\u2019s Wrath - Witchfire",
  weapon_type: "ranged",
};


export const SwordOfIdaeusWeapon: WeaponConfig = {
  id: weaponId("sword_of_idaeus"),
  weapon_slug: "sword_of_idaeus",
  weapon_name: "Sword of Idaeus",
  weapon_type: "melee",
};


export const TalassarianTempestBladeWeapon: WeaponConfig = {
  id: weaponId("talassarian_tempest_blade"),
  weapon_slug: "talassarian_tempest_blade",
  weapon_name: "Talassarian Tempest Blade",
  weapon_type: "melee",
};


export const TalassarianTempestBladeCoupDeGraceWeapon: WeaponConfig = {
  id: weaponId("talassarian_tempest_blade_coup_de_grace"),
  weapon_slug: "talassarian_tempest_blade_coup_de_grace",
  weapon_name: "\u27a4 Talassarian Tempest Blade - Coup de Grace",
  weapon_type: "melee",
};


export const TalassarianTempestBladeStrikeWeapon: WeaponConfig = {
  id: weaponId("talassarian_tempest_blade_strike"),
  weapon_slug: "talassarian_tempest_blade_strike",
  weapon_name: "\u27a4 Talassarian Tempest Blade - Strike",
  weapon_type: "melee",
};


export const TalassarianTempestBladeSweepWeapon: WeaponConfig = {
  id: weaponId("talassarian_tempest_blade_sweep"),
  weapon_slug: "talassarian_tempest_blade_sweep",
  weapon_name: "\u27a4 Talassarian Tempest Blade - Sweep",
  weapon_type: "melee",
};


export const TheEmperorsSwordWeapon: WeaponConfig = {
  id: weaponId("the_emperors_sword"),
  weapon_slug: "the_emperors_sword",
  weapon_name: "The Emperor's Sword",
  weapon_type: "melee",
};


export const VictrixPowerSwordWeapon: WeaponConfig = {
  id: weaponId("victrix_power_sword"),
  weapon_slug: "victrix_power_sword",
  weapon_name: "Victrix Power Sword",
  weapon_type: "melee",
};


export const ultramarinesWeapons: SeedDataset<"weapons"> = {
  table: "weapons",
  records: [
    ArtisanPlasmaPistolWeapon,
    AstropathicBlastWeapon,
    BladesOfHonourWeapon,
    ChronusServoArmWeapon,
    GauntletsOfUltramarWeapon,
    HandOfDominionWeapon,
    InfernusWeapon,
    InvictusWeapon,
    MasterCraftedBolterWeapon,
    QuietusWeapon,
    RelicThunderHammerWeapon,
    RodOfTiguriusWeapon,
    StormOfTheEmperorsWrathFocusedWitchfireWeapon,
    StormOfTheEmperorsWrathWitchfireWeapon,
    SwordOfIdaeusWeapon,
    TalassarianTempestBladeWeapon,
    TalassarianTempestBladeCoupDeGraceWeapon,
    TalassarianTempestBladeStrikeWeapon,
    TalassarianTempestBladeSweepWeapon,
    TheEmperorsSwordWeapon,
    VictrixPowerSwordWeapon,
  ] satisfies WeaponConfig[],
};
