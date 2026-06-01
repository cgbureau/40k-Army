import type {
  SeedDataset,
  UnitWeaponConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, unitId, unitWeaponId, weaponProfileId } from "../../../ids";

/**
 * 10th edition unit weapon rows owned by `white_scars`.
 * Generated from BSData weapon profiles.
 */

export const KorsarroKhanMoonfang10eCodexSpaceMarines10eUnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("korsarro_khan__moonfang__10e__codex_space_marines_10e"),
  unit_id: unitId("korsarro_khan"),
  model_id: null,
  weapon_profile_id: weaponProfileId("moonfang__10e__codex_space_marines_10e"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const SubodenKhanOnslaughtGatlingCannon10eCodexSpaceMarines10eUnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("suboden_khan__onslaught_gatling_cannon__10e__codex_space_marines_10e"),
  unit_id: unitId("suboden_khan"),
  model_id: null,
  weapon_profile_id: weaponProfileId("onslaught_gatling_cannon__10e__codex_space_marines_10e"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const SubodenKhanPowerSword10eCodexSpaceMarines10eUnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("suboden_khan__power_sword__10e__codex_space_marines_10e"),
  unit_id: unitId("suboden_khan"),
  model_id: null,
  weapon_profile_id: weaponProfileId("power_sword__10e__codex_space_marines_10e"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const SubodenKhanStormtooth10eCodexSpaceMarines10eUnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("suboden_khan__stormtooth__10e__codex_space_marines_10e"),
  unit_id: unitId("suboden_khan"),
  model_id: null,
  weapon_profile_id: weaponProfileId("stormtooth__10e__codex_space_marines_10e"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const whiteScarsUnitWeapons10e: SeedDataset<"unit_weapons"> = {
  table: "unit_weapons",
  records: [
    KorsarroKhanMoonfang10eCodexSpaceMarines10eUnitWeapon,
    SubodenKhanOnslaughtGatlingCannon10eCodexSpaceMarines10eUnitWeapon,
    SubodenKhanPowerSword10eCodexSpaceMarines10eUnitWeapon,
    SubodenKhanStormtooth10eCodexSpaceMarines10eUnitWeapon,
  ] satisfies UnitWeaponConfig[],
};
