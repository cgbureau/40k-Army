import type {
  SeedDataset,
  WeaponConfig,
} from "../../../types/_index.types";
import { weaponId } from "../../ids";

/**
 * Weapon rows owned by `raven_guard`.
 * Generated from BSData weapon profiles.
 */

export const BlackoutWeapon: WeaponConfig = {
  id: weaponId("blackout"),
  weapon_slug: "blackout",
  weapon_name: "Blackout",
  weapon_type: "ranged",
};


export const ClawsOfSeveraxWeapon: WeaponConfig = {
  id: weaponId("claws_of_severax"),
  weapon_slug: "claws_of_severax",
  weapon_name: "Claws of Severax",
  weapon_type: "melee",
};


export const TheRavensTalonsWeapon: WeaponConfig = {
  id: weaponId("the_ravens_talons"),
  weapon_slug: "the_ravens_talons",
  weapon_name: "The Raven's Talons",
  weapon_type: "melee",
};


export const ravenGuardWeapons: SeedDataset<"weapons"> = {
  table: "weapons",
  records: [
    BlackoutWeapon,
    ClawsOfSeveraxWeapon,
    TheRavensTalonsWeapon,
  ] satisfies WeaponConfig[],
};
