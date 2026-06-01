import type {
  SeedDataset,
  UnitWeaponConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, unitId, unitWeaponId, weaponProfileId } from "../../../ids";

/**
 * 10th edition unit weapon rows owned by `imperial_fists`.
 * Generated from BSData weapon profiles.
 */

export const DarnathLysanderFistOfDorn10eCodexSpaceMarines10eUnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("darnath_lysander__fist_of_dorn__10e__codex_space_marines_10e"),
  unit_id: unitId("darnath_lysander"),
  model_id: null,
  weapon_profile_id: weaponProfileId("fist_of_dorn__10e__codex_space_marines_10e"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const PedroKantorDornsArrow10eCodexSpaceMarines10eUnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("pedro_kantor__dorns_arrow__10e__codex_space_marines_10e"),
  unit_id: unitId("pedro_kantor"),
  model_id: null,
  weapon_profile_id: weaponProfileId("dorns_arrow__10e__codex_space_marines_10e"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const PedroKantorFistOfRetribution10eCodexSpaceMarines10eUnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("pedro_kantor__fist_of_retribution__10e__codex_space_marines_10e"),
  unit_id: unitId("pedro_kantor"),
  model_id: null,
  weapon_profile_id: weaponProfileId("fist_of_retribution__10e__codex_space_marines_10e"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const TorGaradonArtificerGravGun10eCodexSpaceMarines10eUnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("tor_garadon__artificer_grav_gun__10e__codex_space_marines_10e"),
  unit_id: unitId("tor_garadon"),
  model_id: null,
  weapon_profile_id: weaponProfileId("artificer_grav_gun__10e__codex_space_marines_10e"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const TorGaradonHandOfDefiance10eCodexSpaceMarines10eUnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("tor_garadon__hand_of_defiance__10e__codex_space_marines_10e"),
  unit_id: unitId("tor_garadon"),
  model_id: null,
  weapon_profile_id: weaponProfileId("hand_of_defiance__10e__codex_space_marines_10e"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const imperialFistsUnitWeapons10e: SeedDataset<"unit_weapons"> = {
  table: "unit_weapons",
  records: [
    DarnathLysanderFistOfDorn10eCodexSpaceMarines10eUnitWeapon,
    PedroKantorDornsArrow10eCodexSpaceMarines10eUnitWeapon,
    PedroKantorFistOfRetribution10eCodexSpaceMarines10eUnitWeapon,
    TorGaradonArtificerGravGun10eCodexSpaceMarines10eUnitWeapon,
    TorGaradonHandOfDefiance10eCodexSpaceMarines10eUnitWeapon,
  ] satisfies UnitWeaponConfig[],
};
