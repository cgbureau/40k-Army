import type {
  LeaderEligibilityConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { gameEditionId, leaderEligibilityId, rulesSourceId, unitId } from "../../../ids";

/**
 * 10th edition leader eligibility rows owned by `white_scars`.
 * Generated from BSData Leader ability profiles.
 */

export const KorsarroKhanAssaultIntercessorSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("korsarro_khan__assault_intercessor_squad"),
  leader_unit_id: unitId("korsarro_khan"),
  target_unit_id: unitId("assault_intercessor_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const KorsarroKhanBladeguardVeteranSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("korsarro_khan__bladeguard_veteran_squad"),
  leader_unit_id: unitId("korsarro_khan"),
  target_unit_id: unitId("bladeguard_veteran_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const KorsarroKhanCompanyHeroesLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("korsarro_khan__company_heroes"),
  leader_unit_id: unitId("korsarro_khan"),
  target_unit_id: unitId("company_heroes"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const KorsarroKhanIntercessorSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("korsarro_khan__intercessor_squad"),
  leader_unit_id: unitId("korsarro_khan"),
  target_unit_id: unitId("intercessor_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const KorsarroKhanSternguardVeteranSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("korsarro_khan__sternguard_veteran_squad"),
  leader_unit_id: unitId("korsarro_khan"),
  target_unit_id: unitId("sternguard_veteran_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const KorsarroKhanTacticalSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("korsarro_khan__tactical_squad"),
  leader_unit_id: unitId("korsarro_khan"),
  target_unit_id: unitId("tactical_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const SubodenKhanOutriderSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("suboden_khan__outrider_squad"),
  leader_unit_id: unitId("suboden_khan"),
  target_unit_id: unitId("outrider_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const whiteScarsLeaderEligibilities10e: SeedDataset<"leader_eligibilities"> = {
  table: "leader_eligibilities",
  records: [
    KorsarroKhanAssaultIntercessorSquadLeaderEligibility,
    KorsarroKhanBladeguardVeteranSquadLeaderEligibility,
    KorsarroKhanCompanyHeroesLeaderEligibility,
    KorsarroKhanIntercessorSquadLeaderEligibility,
    KorsarroKhanSternguardVeteranSquadLeaderEligibility,
    KorsarroKhanTacticalSquadLeaderEligibility,
    SubodenKhanOutriderSquadLeaderEligibility,
  ] satisfies LeaderEligibilityConfig[],
};
