import type { LeaderEligibilityConfig, SeedDataset } from "../../../../types/_index.types";
import { gameEditionId, leaderEligibilityId, rulesSourceId, unitId } from "../../../ids";

/**
 * Leader eligibility (LED BY) records for the emperor-s-children faction.
 * Generated from Wahapedia unit-datasheet data.
 */

export const LordExultantInfractorsLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("lord_exultant__infractors"),
  leader_unit_id: unitId("lord_exultant"),
  target_unit_id: unitId("infractors"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_emperors_children_10e_v1_3"),
};

export const LordExultantTormentorsLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("lord_exultant__tormentors"),
  leader_unit_id: unitId("lord_exultant"),
  target_unit_id: unitId("tormentors"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_emperors_children_10e_v1_3"),
};

export const LordKakophonistChaosTerminatorsLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("lord_kakophonist__chaos_terminators"),
  leader_unit_id: unitId("lord_kakophonist"),
  target_unit_id: unitId("chaos_terminators"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_emperors_children_10e_v1_3"),
};

export const LordKakophonistNoiseMarinesLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("lord_kakophonist__noise_marines"),
  leader_unit_id: unitId("lord_kakophonist"),
  target_unit_id: unitId("noise_marines"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_emperors_children_10e_v1_3"),
};

export const LuciusTheEternalFlawlessBladesLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("lucius_the_eternal__flawless_blades"),
  leader_unit_id: unitId("lucius_the_eternal"),
  target_unit_id: unitId("flawless_blades"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_emperors_children_10e_v1_3"),
};

export const SorcererInfractorsLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("sorcerer__infractors"),
  leader_unit_id: unitId("sorcerer"),
  target_unit_id: unitId("infractors"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_emperors_children_10e_v1_3"),
};

export const SorcererNoiseMarinesLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("sorcerer__noise_marines"),
  leader_unit_id: unitId("sorcerer"),
  target_unit_id: unitId("noise_marines"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_emperors_children_10e_v1_3"),
};

export const SorcererTormentorsLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("sorcerer__tormentors"),
  leader_unit_id: unitId("sorcerer"),
  target_unit_id: unitId("tormentors"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_emperors_children_10e_v1_3"),
};

export const emperorSChildrenLeaderEligibilitiesDataset: SeedDataset<"leader_eligibilities"> = {
  table: "leader_eligibilities",
  records: [
    LordExultantInfractorsLeaderEligibility,
    LordExultantTormentorsLeaderEligibility,
    LordKakophonistChaosTerminatorsLeaderEligibility,
    LordKakophonistNoiseMarinesLeaderEligibility,
    LuciusTheEternalFlawlessBladesLeaderEligibility,
    SorcererInfractorsLeaderEligibility,
    SorcererNoiseMarinesLeaderEligibility,
    SorcererTormentorsLeaderEligibility,
  ] satisfies LeaderEligibilityConfig[],
};
