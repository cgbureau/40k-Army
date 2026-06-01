import type {
  SeedDataset,
  UnitWeaponConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, unitId, unitWeaponId, weaponProfileId } from "../../../ids";

/**
 * 10th edition unit weapon rows owned by `iron_hands`.
 * Generated from BSData weapon profiles.
 */

export const CaanokVarAxiomStrike10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("caanok_var__axiom_strike__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("caanok_var"),
  model_id: null,
  weapon_profile_id: weaponProfileId("axiom_strike__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const CaanokVarAxiomSweep10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("caanok_var__axiom_sweep__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("caanok_var"),
  model_id: null,
  weapon_profile_id: weaponProfileId("axiom_sweep__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const IronFatherFeirrosGorgonsWrath10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("iron_father_feirros__gorgons_wrath__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("iron_father_feirros"),
  model_id: null,
  weapon_profile_id: weaponProfileId("gorgons_wrath__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const IronFatherFeirrosHarrowhand10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("iron_father_feirros__harrowhand__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("iron_father_feirros"),
  model_id: null,
  weapon_profile_id: weaponProfileId("harrowhand__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const IronFatherFeirrosMedusanManipuli10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("iron_father_feirros__medusan_manipuli__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("iron_father_feirros"),
  model_id: null,
  weapon_profile_id: weaponProfileId("medusan_manipuli__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const ironHandsUnitWeapons10e: SeedDataset<"unit_weapons"> = {
  table: "unit_weapons",
  records: [
    CaanokVarAxiomStrike10eFactionPackSpaceMarines10eV18UnitWeapon,
    CaanokVarAxiomSweep10eFactionPackSpaceMarines10eV18UnitWeapon,
    IronFatherFeirrosGorgonsWrath10eFactionPackSpaceMarines10eV18UnitWeapon,
    IronFatherFeirrosHarrowhand10eFactionPackSpaceMarines10eV18UnitWeapon,
    IronFatherFeirrosMedusanManipuli10eFactionPackSpaceMarines10eV18UnitWeapon,
  ] satisfies UnitWeaponConfig[],
};
