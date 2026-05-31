import type {
  LeaderEligibilityConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { gameEditionId, leaderEligibilityId, rulesSourceId, unitId } from "../../../ids";

/**
 * 10th edition leader eligibility rows owned by `raven_guard`.
 * Generated from BSData Leader ability profiles.
 */

export const KayvaanShrikeAssaultIntercessorsWithJumpPacksLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("kayvaan_shrike__assault_intercessors_with_jump_packs"),
  leader_unit_id: unitId("kayvaan_shrike"),
  target_unit_id: unitId("assault_intercessors_with_jump_packs"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const KayvaanShrikeVanguardVeteranSquadWithJumpPacksLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("kayvaan_shrike__vanguard_veteran_squad_with_jump_packs"),
  leader_unit_id: unitId("kayvaan_shrike"),
  target_unit_id: unitId("vanguard_veteran_squad_with_jump_packs"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const ravenGuardLeaderEligibilities10e: SeedDataset<"leader_eligibilities"> = {
  table: "leader_eligibilities",
  records: [
    KayvaanShrikeAssaultIntercessorsWithJumpPacksLeaderEligibility,
    KayvaanShrikeVanguardVeteranSquadWithJumpPacksLeaderEligibility,
  ] satisfies LeaderEligibilityConfig[],
};
