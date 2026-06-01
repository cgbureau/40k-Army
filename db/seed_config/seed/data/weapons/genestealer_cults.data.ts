import type {
  SeedDataset,
  WeaponConfig,
} from "../../../types/_index.types";
import { weaponId } from "../../ids";

/**
 * Weapon rows owned by `genestealer_cults`.
 * Generated from BSData weapon profiles.
 */

export const AchillesMissileLauncherWeapon: WeaponConfig = {
  id: weaponId("achilles_missile_launcher"),
  weapon_slug: "achilles_missile_launcher",
  weapon_name: "Achilles missile launcher",
  weapon_type: "ranged",
};


export const AtalanIncineratorWeapon: WeaponConfig = {
  id: weaponId("atalan_incinerator"),
  weapon_slug: "atalan_incinerator",
  weapon_name: "Atalan incinerator",
  weapon_type: "ranged",
};


export const ClearanceIncineratorWeapon: WeaponConfig = {
  id: weaponId("clearance_incinerator"),
  weapon_slug: "clearance_incinerator",
  weapon_name: "Clearance incinerator",
  weapon_type: "ranged",
};


export const CultClawsWeapon: WeaponConfig = {
  id: weaponId("cult_claws"),
  weapon_slug: "cult_claws",
  weapon_name: "Cult claws",
  weapon_type: "melee",
};


export const CultSniperRifleWeapon: WeaponConfig = {
  id: weaponId("cult_sniper_rifle"),
  weapon_slug: "cult_sniper_rifle",
  weapon_name: "Cult sniper rifle",
  weapon_type: "ranged",
};


export const DemolitionChargesWeapon: WeaponConfig = {
  id: weaponId("demolition_charges"),
  weapon_slug: "demolition_charges",
  weapon_name: "Demolition charges",
  weapon_type: "ranged",
};


export const DrilldozerBladeWeapon: WeaponConfig = {
  id: weaponId("drilldozer_blade"),
  weapon_slug: "drilldozer_blade",
  weapon_name: "Drilldozer blade",
  weapon_type: "melee",
};


export const FragdrillWeapon: WeaponConfig = {
  id: weaponId("fragdrill"),
  weapon_slug: "fragdrill",
  weapon_name: "Fragdrill",
  weapon_type: "melee",
};


export const GoliathWheelsWeapon: WeaponConfig = {
  id: weaponId("goliath_wheels"),
  weapon_slug: "goliath_wheels",
  weapon_name: "Goliath wheels",
  weapon_type: "melee",
};


export const HeavyMiningToolWeapon: WeaponConfig = {
  id: weaponId("heavy_mining_tool"),
  weapon_slug: "heavy_mining_tool",
  weapon_name: "Heavy mining tool",
  weapon_type: "melee",
};


export const HeavySeismicCannonWeapon: WeaponConfig = {
  id: weaponId("heavy_seismic_cannon"),
  weapon_slug: "heavy_seismic_cannon",
  weapon_name: "Heavy seismic cannon",
  weapon_type: "ranged",
};


export const LeadersBioWeaponsWeapon: WeaponConfig = {
  id: weaponId("leaders_bio_weapons"),
  weapon_slug: "leaders_bio_weapons",
  weapon_name: "Leader's bio-weapons",
  weapon_type: "melee",
};


export const LiberatorAutostubsWeapon: WeaponConfig = {
  id: weaponId("liberator_autostubs"),
  weapon_slug: "liberator_autostubs",
  weapon_name: "Liberator autostubs",
  weapon_type: "ranged",
};


export const LocusBladesWeapon: WeaponConfig = {
  id: weaponId("locus_blades"),
  weapon_slug: "locus_blades",
  weapon_name: "Locus blades",
  weapon_type: "melee",
};


export const MiningLaserWeapon: WeaponConfig = {
  id: weaponId("mining_laser"),
  weapon_slug: "mining_laser",
  weapon_name: "Mining laser",
  weapon_type: "ranged",
};


export const PatriarchsClawsWeapon: WeaponConfig = {
  id: weaponId("patriarchs_claws"),
  weapon_slug: "patriarchs_claws",
  weapon_name: "Patriarch's claws",
  weapon_type: "melee",
};


export const PowerSledgehammerWeapon: WeaponConfig = {
  id: weaponId("power_sledgehammer"),
  weapon_slug: "power_sledgehammer",
  weapon_name: "Power sledgehammer",
  weapon_type: "melee",
};


export const SanctusBioDaggerWeapon: WeaponConfig = {
  id: weaponId("sanctus_bio_dagger"),
  weapon_slug: "sanctus_bio_dagger",
  weapon_name: "Sanctus bio-dagger",
  weapon_type: "melee",
};


export const SeismicCannonWeapon: WeaponConfig = {
  id: weaponId("seismic_cannon"),
  weapon_slug: "seismic_cannon",
  weapon_name: "Seismic cannon",
  weapon_type: "ranged",
};


export const TwinHeavyStubberWeapon: WeaponConfig = {
  id: weaponId("twin_heavy_stubber"),
  weapon_slug: "twin_heavy_stubber",
  weapon_name: "Twin heavy stubber",
  weapon_type: "ranged",
};


export const genestealerCultsWeapons: SeedDataset<"weapons"> = {
  table: "weapons",
  records: [
    AchillesMissileLauncherWeapon,
    AtalanIncineratorWeapon,
    ClearanceIncineratorWeapon,
    CultClawsWeapon,
    CultSniperRifleWeapon,
    DemolitionChargesWeapon,
    DrilldozerBladeWeapon,
    FragdrillWeapon,
    GoliathWheelsWeapon,
    HeavyMiningToolWeapon,
    HeavySeismicCannonWeapon,
    LeadersBioWeaponsWeapon,
    LiberatorAutostubsWeapon,
    LocusBladesWeapon,
    MiningLaserWeapon,
    PatriarchsClawsWeapon,
    PowerSledgehammerWeapon,
    SanctusBioDaggerWeapon,
    SeismicCannonWeapon,
    TwinHeavyStubberWeapon,
  ] satisfies WeaponConfig[],
};
