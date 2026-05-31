import type {
  SeedDataset,
  UnitProfileConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, unitId, unitProfileId } from "../../../ids";

/**
 * 10th edition unit profile rows owned by `white_scars`.
 * Generated from BSData Unit profiles.
 */

export const KorsarroKhan10eKorsarroKhanUnitProfile: UnitProfileConfig = {
  id: unitProfileId("korsarro_khan__10e__korsarro_khan"),
  unit_profile_slug: "korsarro_khan__10e__korsarro_khan",
  unit_profile_name: "Kor'sarro Khan - Kor'sarro Khan",
  game_edition_id: gameEditionId("10e"),
  unit_id: unitId("korsarro_khan"),
  model_id: null,
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  effective_date: null,
  superseded_date: null,
};


export const SubodenKhan10eSubodenKhanUnitProfile: UnitProfileConfig = {
  id: unitProfileId("suboden_khan__10e__suboden_khan"),
  unit_profile_slug: "suboden_khan__10e__suboden_khan",
  unit_profile_name: "Suboden Khan - Suboden Khan",
  game_edition_id: gameEditionId("10e"),
  unit_id: unitId("suboden_khan"),
  model_id: null,
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  effective_date: null,
  superseded_date: null,
};


export const whiteScarsUnitProfiles10e: SeedDataset<"unit_profiles"> = {
  table: "unit_profiles",
  records: [
    KorsarroKhan10eKorsarroKhanUnitProfile,
    SubodenKhan10eSubodenKhanUnitProfile,
  ] satisfies UnitProfileConfig[],
};
