import type {
  LeaderEligibilityConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { gameEditionId, leaderEligibilityId, rulesSourceId, unitId } from "../../../ids";

/**
 * 10th edition leader eligibility rows owned by `iron_hands`.
 * Generated from BSData Leader ability profiles.
 */

export const CaanokVarTerminatorAssaultSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("caanok_var__terminator_assault_squad"),
  leader_unit_id: unitId("caanok_var"),
  target_unit_id: unitId("terminator_assault_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const CaanokVarTerminatorSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("caanok_var__terminator_squad"),
  leader_unit_id: unitId("caanok_var"),
  target_unit_id: unitId("terminator_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const IronFatherFeirrosAggressorSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("iron_father_feirros__aggressor_squad"),
  leader_unit_id: unitId("iron_father_feirros"),
  target_unit_id: unitId("aggressor_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const IronFatherFeirrosEradicatorSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("iron_father_feirros__eradicator_squad"),
  leader_unit_id: unitId("iron_father_feirros"),
  target_unit_id: unitId("eradicator_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const IronFatherFeirrosHeavyIntercessorSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("iron_father_feirros__heavy_intercessor_squad"),
  leader_unit_id: unitId("iron_father_feirros"),
  target_unit_id: unitId("heavy_intercessor_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const ironHandsLeaderEligibilities10e: SeedDataset<"leader_eligibilities"> = {
  table: "leader_eligibilities",
  records: [
    CaanokVarTerminatorAssaultSquadLeaderEligibility,
    CaanokVarTerminatorSquadLeaderEligibility,
    IronFatherFeirrosAggressorSquadLeaderEligibility,
    IronFatherFeirrosEradicatorSquadLeaderEligibility,
    IronFatherFeirrosHeavyIntercessorSquadLeaderEligibility,
  ] satisfies LeaderEligibilityConfig[],
};
