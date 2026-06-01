import type {
  SeedDataset,
  WeaponConfig,
} from "../../../types/_index.types";
import { weaponId } from "../../ids";

/**
 * Weapon rows owned by `world_eaters`.
 * Generated from BSData weapon profiles.
 */

export const BloodHarpoonWeapon: WeaponConfig = {
  id: weaponId("blood_harpoon"),
  weapon_slug: "blood_harpoon",
  weapon_name: "Blood harpoon",
  weapon_type: "ranged",
};


export const ChainbladesWeapon: WeaponConfig = {
  id: weaponId("chainblades"),
  weapon_slug: "chainblades",
  weapon_name: "Chainblades",
  weapon_type: "melee",
};


export const CowardsBaneWeapon: WeaponConfig = {
  id: weaponId("cowards_bane"),
  weapon_slug: "cowards_bane",
  weapon_name: "Coward's Bane",
  weapon_type: "melee",
};


export const ExaltedChainbladeWeapon: WeaponConfig = {
  id: weaponId("exalted_chainblade"),
  weapon_slug: "exalted_chainblade",
  weapon_name: "Exalted chainblade",
  weapon_type: "melee",
};


export const GorechildWeapon: WeaponConfig = {
  id: weaponId("gorechild"),
  weapon_slug: "gorechild",
  weapon_name: "Gorechild",
  weapon_type: "melee",
};


export const LaceratorAndDaemonicClawWeapon: WeaponConfig = {
  id: weaponId("lacerator_and_daemonic_claw"),
  weapon_slug: "lacerator_and_daemonic_claw",
  weapon_name: "Lacerator and daemonic claw",
  weapon_type: "melee",
};


export const SamniariusAndSpinegrinderStrikeWeapon: WeaponConfig = {
  id: weaponId("samniarius_and_spinegrinder_strike"),
  weapon_slug: "samniarius_and_spinegrinder_strike",
  weapon_name: "\u27a4 Samni\u2019arius and Spinegrinder - strike",
  weapon_type: "melee",
};


export const SamniariusAndSpinegrinderSweepWeapon: WeaponConfig = {
  id: weaponId("samniarius_and_spinegrinder_sweep"),
  weapon_slug: "samniarius_and_spinegrinder_sweep",
  weapon_name: "\u27a4 Samni\u2019arius and Spinegrinder - sweep",
  weapon_type: "melee",
};


export const worldEatersWeapons: SeedDataset<"weapons"> = {
  table: "weapons",
  records: [
    BloodHarpoonWeapon,
    ChainbladesWeapon,
    CowardsBaneWeapon,
    ExaltedChainbladeWeapon,
    GorechildWeapon,
    LaceratorAndDaemonicClawWeapon,
    SamniariusAndSpinegrinderStrikeWeapon,
    SamniariusAndSpinegrinderSweepWeapon,
  ] satisfies WeaponConfig[],
};
