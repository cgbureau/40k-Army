import type {
  SeedDataset,
  UnitWeaponConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, unitId, unitWeaponId, weaponProfileId } from "../../../ids";

/**
 * 10th edition unit weapon rows owned by `white_scars`.
 * Generated from BSData weapon profiles.
 */

export const KorsarroKhanMoonfang10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("korsarro_khan__moonfang__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("korsarro_khan"),
  model_id: null,
  weapon_profile_id: weaponProfileId("moonfang__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const SubodenKhanOnslaughtGatlingCannon10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("suboden_khan__onslaught_gatling_cannon__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("suboden_khan"),
  model_id: null,
  weapon_profile_id: weaponProfileId("onslaught_gatling_cannon__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const SubodenKhanPowerSword10eFactionPackAeldari10eV12UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("suboden_khan__power_sword__10e__faction_pack_aeldari_10e_v1_2"),
  unit_id: unitId("suboden_khan"),
  model_id: null,
  weapon_profile_id: weaponProfileId("power_sword__10e__faction_pack_aeldari_10e_v1_2"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const SubodenKhanStormtooth10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("suboden_khan__stormtooth__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("suboden_khan"),
  model_id: null,
  weapon_profile_id: weaponProfileId("stormtooth__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const whiteScarsUnitWeapons10e: SeedDataset<"unit_weapons"> = {
  table: "unit_weapons",
  records: [
    KorsarroKhanMoonfang10eFactionPackSpaceMarines10eV18UnitWeapon,
    SubodenKhanOnslaughtGatlingCannon10eFactionPackSpaceMarines10eV18UnitWeapon,
    SubodenKhanPowerSword10eFactionPackAeldari10eV12UnitWeapon,
    SubodenKhanStormtooth10eFactionPackSpaceMarines10eV18UnitWeapon,
  ] satisfies UnitWeaponConfig[],
};
