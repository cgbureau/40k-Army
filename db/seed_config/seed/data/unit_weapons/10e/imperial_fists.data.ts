import type {
  SeedDataset,
  UnitWeaponConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, unitId, unitWeaponId, weaponProfileId } from "../../../ids";

/**
 * 10th edition unit weapon rows owned by `imperial_fists`.
 * Generated from BSData weapon profiles.
 */

export const DarnathLysanderFistOfDorn10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("darnath_lysander__fist_of_dorn__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("darnath_lysander"),
  model_id: null,
  weapon_profile_id: weaponProfileId("fist_of_dorn__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const PedroKantorDornsArrow10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("pedro_kantor__dorns_arrow__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("pedro_kantor"),
  model_id: null,
  weapon_profile_id: weaponProfileId("dorns_arrow__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const PedroKantorFistOfRetribution10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("pedro_kantor__fist_of_retribution__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("pedro_kantor"),
  model_id: null,
  weapon_profile_id: weaponProfileId("fist_of_retribution__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const TorGaradonArtificerGravGun10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("tor_garadon__artificer_grav_gun__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("tor_garadon"),
  model_id: null,
  weapon_profile_id: weaponProfileId("artificer_grav_gun__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const TorGaradonHandOfDefiance10eFactionPackSpaceMarines10eV18UnitWeapon: UnitWeaponConfig = {
  id: unitWeaponId("tor_garadon__hand_of_defiance__10e__faction_pack_space_marines_10e_v1_8"),
  unit_id: unitId("tor_garadon"),
  model_id: null,
  weapon_profile_id: weaponProfileId("hand_of_defiance__10e__faction_pack_space_marines_10e_v1_8"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  is_default: true,
  effective_date: null,
  superseded_date: null,
};


export const imperialFistsUnitWeapons10e: SeedDataset<"unit_weapons"> = {
  table: "unit_weapons",
  records: [
    DarnathLysanderFistOfDorn10eFactionPackSpaceMarines10eV18UnitWeapon,
    PedroKantorDornsArrow10eFactionPackSpaceMarines10eV18UnitWeapon,
    PedroKantorFistOfRetribution10eFactionPackSpaceMarines10eV18UnitWeapon,
    TorGaradonArtificerGravGun10eFactionPackSpaceMarines10eV18UnitWeapon,
    TorGaradonHandOfDefiance10eFactionPackSpaceMarines10eV18UnitWeapon,
  ] satisfies UnitWeaponConfig[],
};
