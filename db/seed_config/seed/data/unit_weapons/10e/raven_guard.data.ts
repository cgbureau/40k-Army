import type {
  SeedDataset,
  UnitWeaponConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, unitId, unitWeaponId, weaponProfileId } from "../../../ids";

/**
 * 10th edition unit weapon rows owned by `raven_guard`.
 * Generated from BSData weapon profiles.
 */

export const AethonShaanClawsOfSeverax10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("aethon_shaan__claws_of_severax__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("aethon_shaan"),
  model_id: null,
  weapon_profile_id: weaponProfileId("claws_of_severax__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const KayvaanShrikeBlackout10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("kayvaan_shrike__blackout__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("kayvaan_shrike"),
  model_id: null,
  weapon_profile_id: weaponProfileId("blackout__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const KayvaanShrikeTheRavensTalons10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("kayvaan_shrike__the_ravens_talons__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("kayvaan_shrike"),
  model_id: null,
  weapon_profile_id: weaponProfileId("the_ravens_talons__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const ravenGuardUnitWeapons10e: SeedDataset<"unit_weapons"> = {
  table: "unit_weapons",
  records: [
    AethonShaanClawsOfSeverax10eFactionPackSpaceMarines10eV18UnitWeapon,
    KayvaanShrikeBlackout10eFactionPackSpaceMarines10eV18UnitWeapon,
    KayvaanShrikeTheRavensTalons10eFactionPackSpaceMarines10eV18UnitWeapon,
  ] satisfies UnitWeaponConfig[],
};
