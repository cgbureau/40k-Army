import type { LeaderEligibilityConfig, SeedDataset } from "../../../../types/_index.types";
import { gameEditionId, leaderEligibilityId, rulesSourceId, unitId } from "../../../ids";

/**
 * Leader eligibility (LED BY) records for the world-eaters faction.
 * Generated from Wahapedia unit-datasheet data.
 */

export const KhRnTheBetrayerKhorneBerzerkersLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("kh_rn_the_betrayer__khorne_berzerkers"),
  leader_unit_id: unitId("kh_rn_the_betrayer"),
  target_unit_id: unitId("khorne_berzerkers"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_world_eaters_10e_v1_1"),
};

export const LordInvocatusEightboundLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("lord_invocatus__eightbound"),
  leader_unit_id: unitId("lord_invocatus"),
  target_unit_id: unitId("eightbound"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_world_eaters_10e_v1_1"),
};

export const LordInvocatusExaltedEightboundLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("lord_invocatus__exalted_eightbound"),
  leader_unit_id: unitId("lord_invocatus"),
  target_unit_id: unitId("exalted_eightbound"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_world_eaters_10e_v1_1"),
};

export const LordInvocatusKhorneBerzerkersLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("lord_invocatus__khorne_berzerkers"),
  leader_unit_id: unitId("lord_invocatus"),
  target_unit_id: unitId("khorne_berzerkers"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_world_eaters_10e_v1_1"),
};

export const LordOnJuggernautEightboundLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("lord_on_juggernaut__eightbound"),
  leader_unit_id: unitId("lord_on_juggernaut"),
  target_unit_id: unitId("eightbound"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_world_eaters_10e_v1_1"),
};

export const LordOnJuggernautExaltedEightboundLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("lord_on_juggernaut__exalted_eightbound"),
  leader_unit_id: unitId("lord_on_juggernaut"),
  target_unit_id: unitId("exalted_eightbound"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_world_eaters_10e_v1_1"),
};

export const LordOnJuggernautKhorneBerzerkersLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("lord_on_juggernaut__khorne_berzerkers"),
  leader_unit_id: unitId("lord_on_juggernaut"),
  target_unit_id: unitId("khorne_berzerkers"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_world_eaters_10e_v1_1"),
};

export const MasterOfExecutionsKhorneBerzerkersLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("master_of_executions__khorne_berzerkers"),
  leader_unit_id: unitId("master_of_executions"),
  target_unit_id: unitId("khorne_berzerkers"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_world_eaters_10e_v1_1"),
};

export const SlaughterboundEightboundLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("slaughterbound__eightbound"),
  leader_unit_id: unitId("slaughterbound"),
  target_unit_id: unitId("eightbound"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_world_eaters_10e_v1_1"),
};

export const SlaughterboundExaltedEightboundLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("slaughterbound__exalted_eightbound"),
  leader_unit_id: unitId("slaughterbound"),
  target_unit_id: unitId("exalted_eightbound"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_world_eaters_10e_v1_1"),
};

export const worldEatersLeaderEligibilitiesDataset: SeedDataset<"leader_eligibilities"> = {
  table: "leader_eligibilities",
  records: [
    KhRnTheBetrayerKhorneBerzerkersLeaderEligibility,
    LordInvocatusEightboundLeaderEligibility,
    LordInvocatusExaltedEightboundLeaderEligibility,
    LordInvocatusKhorneBerzerkersLeaderEligibility,
    LordOnJuggernautEightboundLeaderEligibility,
    LordOnJuggernautExaltedEightboundLeaderEligibility,
    LordOnJuggernautKhorneBerzerkersLeaderEligibility,
    MasterOfExecutionsKhorneBerzerkersLeaderEligibility,
    SlaughterboundEightboundLeaderEligibility,
    SlaughterboundExaltedEightboundLeaderEligibility,
  ] satisfies LeaderEligibilityConfig[],
};
