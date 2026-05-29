import type { LeaderEligibilityConfig, SeedDataset } from "../../../../types/_index.types";
import { gameEditionId, leaderEligibilityId, rulesSourceId, unitId } from "../../../ids";

/**
 * Leader eligibility (LED BY) records for the leagues-of-votann faction.
 * Generated from Wahapedia unit-datasheet data.
 */

export const BerehkStornbrWCthonianBeserksLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("berehk_stornbr_w__cthonian_beserks"),
  leader_unit_id: unitId("berehk_stornbr_w"),
  target_unit_id: unitId("cthonian_beserks"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_leagues_of_votann_10e_v1_3"),
};

export const BrKhyrIronMasterBrKhyrThunderkynLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("br_khyr_iron_master__br_khyr_thunderkyn"),
  leader_unit_id: unitId("br_khyr_iron_master"),
  target_unit_id: unitId("br_khyr_thunderkyn"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_leagues_of_votann_10e_v1_3"),
};

export const BrKhyrIronMasterHearthkynWarriorsLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("br_khyr_iron_master__hearthkyn_warriors"),
  leader_unit_id: unitId("br_khyr_iron_master"),
  target_unit_id: unitId("hearthkyn_warriors"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_leagues_of_votann_10e_v1_3"),
};

export const EinhyrChampionEinhyrHearthguardLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("einhyr_champion__einhyr_hearthguard"),
  leader_unit_id: unitId("einhyr_champion"),
  target_unit_id: unitId("einhyr_hearthguard"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_leagues_of_votann_10e_v1_3"),
};

export const GrimnyrHearthkynWarriorsLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("grimnyr__hearthkyn_warriors"),
  leader_unit_id: unitId("grimnyr"),
  target_unit_id: unitId("hearthkyn_warriors"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_leagues_of_votann_10e_v1_3"),
};

export const KHlEinhyrHearthguardLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("k_hl__einhyr_hearthguard"),
  leader_unit_id: unitId("k_hl"),
  target_unit_id: unitId("einhyr_hearthguard"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_leagues_of_votann_10e_v1_3"),
};

export const KHlHearthkynWarriorsLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("k_hl__hearthkyn_warriors"),
  leader_unit_id: unitId("k_hl"),
  target_unit_id: unitId("hearthkyn_warriors"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_leagues_of_votann_10e_v1_3"),
};

export const MemnyrStrategistIronkinSteeljacksWithHeavyVolkaniteDisintegratorsLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("memnyr_strategist__ironkin_steeljacks_with_heavy_volkanite_disintegrators"),
  leader_unit_id: unitId("memnyr_strategist"),
  target_unit_id: unitId("ironkin_steeljacks_with_heavy_volkanite_disintegrators"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_leagues_of_votann_10e_v1_3"),
};

export const MemnyrStrategistIronkinSteeljacksWithMeleeWeaponsLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("memnyr_strategist__ironkin_steeljacks_with_melee_weapons"),
  leader_unit_id: unitId("memnyr_strategist"),
  target_unit_id: unitId("ironkin_steeljacks_with_melee_weapons"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_leagues_of_votann_10e_v1_3"),
};

export const TharTheDestinedEinhyrHearthguardLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("thar_the_destined__einhyr_hearthguard"),
  leader_unit_id: unitId("thar_the_destined"),
  target_unit_id: unitId("einhyr_hearthguard"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_leagues_of_votann_10e_v1_3"),
};

export const TharTheDestinedHearthkynWarriorsLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("thar_the_destined__hearthkyn_warriors"),
  leader_unit_id: unitId("thar_the_destined"),
  target_unit_id: unitId("hearthkyn_warriors"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_leagues_of_votann_10e_v1_3"),
};

export const leaguesOfVotannLeaderEligibilitiesDataset: SeedDataset<"leader_eligibilities"> = {
  table: "leader_eligibilities",
  records: [
    BerehkStornbrWCthonianBeserksLeaderEligibility,
    BrKhyrIronMasterBrKhyrThunderkynLeaderEligibility,
    BrKhyrIronMasterHearthkynWarriorsLeaderEligibility,
    EinhyrChampionEinhyrHearthguardLeaderEligibility,
    GrimnyrHearthkynWarriorsLeaderEligibility,
    KHlEinhyrHearthguardLeaderEligibility,
    KHlHearthkynWarriorsLeaderEligibility,
    MemnyrStrategistIronkinSteeljacksWithHeavyVolkaniteDisintegratorsLeaderEligibility,
    MemnyrStrategistIronkinSteeljacksWithMeleeWeaponsLeaderEligibility,
    TharTheDestinedEinhyrHearthguardLeaderEligibility,
    TharTheDestinedHearthkynWarriorsLeaderEligibility,
  ] satisfies LeaderEligibilityConfig[],
};
