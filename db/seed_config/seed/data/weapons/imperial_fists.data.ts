import type {
  SeedDataset,
  WeaponConfig,
} from "../../../types/_index.types";
import { weaponId } from "../../ids";

/**
 * Weapon rows owned by `imperial_fists`.
 * Generated from BSData weapon profiles.
 */

export const ArtificerGravGunWeapon: WeaponConfig = {
  id: weaponId("artificer_grav_gun"),
  weapon_slug: "artificer_grav_gun",
  weapon_name: "Artificer Grav Gun",
  weapon_type: "ranged",
};


export const DornsArrowWeapon: WeaponConfig = {
  id: weaponId("dorns_arrow"),
  weapon_slug: "dorns_arrow",
  weapon_name: "Dorn's Arrow",
  weapon_type: "ranged",
};


export const FistOfDornWeapon: WeaponConfig = {
  id: weaponId("fist_of_dorn"),
  weapon_slug: "fist_of_dorn",
  weapon_name: "Fist of Dorn",
  weapon_type: "melee",
};


export const FistOfRetributionWeapon: WeaponConfig = {
  id: weaponId("fist_of_retribution"),
  weapon_slug: "fist_of_retribution",
  weapon_name: "Fist of Retribution",
  weapon_type: "melee",
};


export const HandOfDefianceWeapon: WeaponConfig = {
  id: weaponId("hand_of_defiance"),
  weapon_slug: "hand_of_defiance",
  weapon_name: "Hand of Defiance",
  weapon_type: "melee",
};


export const imperialFistsWeapons: SeedDataset<"weapons"> = {
  table: "weapons",
  records: [
    ArtificerGravGunWeapon,
    DornsArrowWeapon,
    FistOfDornWeapon,
    FistOfRetributionWeapon,
    HandOfDefianceWeapon,
  ] satisfies WeaponConfig[],
};
