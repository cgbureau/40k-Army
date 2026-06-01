import type {
  SeedDataset,
  UnitWeaponConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, unitId, unitWeaponId, weaponProfileId } from "../../../ids";

/**
 * 10th edition unit weapon rows owned by `raven_guard`.
 * Generated from BSData weapon profiles.
 */

export const AethonShaanClawsOfSeverax10eCodexSpaceMarines10eUnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("aethon_shaan__claws_of_severax__10e__codex_space_marines_10e"),
  unit_id: unitId("aethon_shaan"),
  model_id: null,
  weapon_profile_id: weaponProfileId("claws_of_severax__10e__codex_space_marines_10e"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const KayvaanShrikeBlackout10eCodexSpaceMarines10eUnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("kayvaan_shrike__blackout__10e__codex_space_marines_10e"),
  unit_id: unitId("kayvaan_shrike"),
  model_id: null,
  weapon_profile_id: weaponProfileId("blackout__10e__codex_space_marines_10e"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const KayvaanShrikeTheRavensTalons10eCodexSpaceMarines10eUnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("kayvaan_shrike__the_ravens_talons__10e__codex_space_marines_10e"),
  unit_id: unitId("kayvaan_shrike"),
  model_id: null,
  weapon_profile_id: weaponProfileId("the_ravens_talons__10e__codex_space_marines_10e"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const ravenGuardUnitWeapons10e: SeedDataset<"unit_weapons"> = {
  table: "unit_weapons",
  records: [
    AethonShaanClawsOfSeverax10eCodexSpaceMarines10eUnitWeapon,
    KayvaanShrikeBlackout10eCodexSpaceMarines10eUnitWeapon,
    KayvaanShrikeTheRavensTalons10eCodexSpaceMarines10eUnitWeapon,
  ] satisfies UnitWeaponConfig[],
};
