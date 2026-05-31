import type {
  SeedDataset,
  UnitProfileConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, unitId, unitProfileId } from "../../../ids";

/**
 * 10th edition unit profile rows owned by `iron_hands`.
 * Generated from BSData Unit profiles.
 */

export const CaanokVar10eCaanokVarUnitProfile: UnitProfileConfig = {
  id: unitProfileId("caanok_var__10e__caanok_var"),
  unit_profile_slug: "caanok_var__10e__caanok_var",
  unit_profile_name: "Caanok Var - Caanok Var",
  game_edition_id: gameEditionId("10e"),
  unit_id: unitId("caanok_var"),
  model_id: null,
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  effective_date: null,
  superseded_date: null,
};


export const IronFatherFeirros10eIronFatherFerriosUnitProfile: UnitProfileConfig = {
  id: unitProfileId("iron_father_feirros__10e__iron_father_ferrios"),
  unit_profile_slug: "iron_father_feirros__10e__iron_father_ferrios",
  unit_profile_name: "Iron Father Feirros - Iron Father Ferrios",
  game_edition_id: gameEditionId("10e"),
  unit_id: unitId("iron_father_feirros"),
  model_id: null,
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  effective_date: null,
  superseded_date: null,
};


export const ironHandsUnitProfiles10e: SeedDataset<"unit_profiles"> = {
  table: "unit_profiles",
  records: [
    CaanokVar10eCaanokVarUnitProfile,
    IronFatherFeirros10eIronFatherFerriosUnitProfile,
  ] satisfies UnitProfileConfig[],
};
