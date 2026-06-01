import type {
  SeedDataset,
  WeaponConfig,
} from "../../../types/_index.types";
import { weaponId } from "../../ids";

/**
 * Weapon rows owned by `iron_hands`.
 * Generated from BSData weapon profiles.
 */

export const AxiomStrikeWeapon: WeaponConfig = {
  id: weaponId("axiom_strike"),
  weapon_slug: "axiom_strike",
  weapon_name: "Axiom - Strike",
  weapon_type: "melee",
};


export const AxiomSweepWeapon: WeaponConfig = {
  id: weaponId("axiom_sweep"),
  weapon_slug: "axiom_sweep",
  weapon_name: "Axiom - Sweep",
  weapon_type: "melee",
};


export const GorgonsWrathWeapon: WeaponConfig = {
  id: weaponId("gorgons_wrath"),
  weapon_slug: "gorgons_wrath",
  weapon_name: "Gorgon's Wrath",
  weapon_type: "ranged",
};


export const HarrowhandWeapon: WeaponConfig = {
  id: weaponId("harrowhand"),
  weapon_slug: "harrowhand",
  weapon_name: "Harrowhand",
  weapon_type: "melee",
};


export const MedusanManipuliWeapon: WeaponConfig = {
  id: weaponId("medusan_manipuli"),
  weapon_slug: "medusan_manipuli",
  weapon_name: "Medusan Manipuli",
  weapon_type: "melee",
};


export const ironHandsWeapons: SeedDataset<"weapons"> = {
  table: "weapons",
  records: [
    AxiomStrikeWeapon,
    AxiomSweepWeapon,
    GorgonsWrathWeapon,
    HarrowhandWeapon,
    MedusanManipuliWeapon,
  ] satisfies WeaponConfig[],
};
