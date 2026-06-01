import type {
  SeedDataset,
  WeaponConfig,
} from "../../../types/_index.types";
import { weaponId } from "../../ids";

/**
 * Weapon rows owned by `white_scars`.
 * Generated from BSData weapon profiles.
 */

export const MoonfangWeapon: WeaponConfig = {
  id: weaponId("moonfang"),
  weapon_slug: "moonfang",
  weapon_name: "Moonfang",
  weapon_type: "melee",
};


export const StormtoothWeapon: WeaponConfig = {
  id: weaponId("stormtooth"),
  weapon_slug: "stormtooth",
  weapon_name: "Stormtooth",
  weapon_type: "melee",
};


export const whiteScarsWeapons: SeedDataset<"weapons"> = {
  table: "weapons",
  records: [
    MoonfangWeapon,
    StormtoothWeapon,
  ] satisfies WeaponConfig[],
};
