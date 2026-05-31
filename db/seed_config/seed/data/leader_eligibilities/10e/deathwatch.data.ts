import type {
  LeaderEligibilityConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { gameEditionId, leaderEligibilityId, rulesSourceId, unitId } from "../../../ids";

/**
 * 10th edition leader eligibility rows owned by `deathwatch`.
 * Generated from BSData Leader ability profiles.
 */

export const WatchCaptainArtemisDeathwatchVeteransLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("watch_captain_artemis__deathwatch_veterans"),
  leader_unit_id: unitId("watch_captain_artemis"),
  target_unit_id: unitId("deathwatch_veterans"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_deathwatch_10e_v1_2"),
};


export const WatchCaptainArtemisFortisKillTeamLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("watch_captain_artemis__fortis_kill_team"),
  leader_unit_id: unitId("watch_captain_artemis"),
  target_unit_id: unitId("fortis_kill_team"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_deathwatch_10e_v1_2"),
};


export const WatchMasterDeathwatchVeteransLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("watch_master__deathwatch_veterans"),
  leader_unit_id: unitId("watch_master"),
  target_unit_id: unitId("deathwatch_veterans"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_deathwatch_10e_v1_2"),
};


export const WatchMasterFortisKillTeamLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("watch_master__fortis_kill_team"),
  leader_unit_id: unitId("watch_master"),
  target_unit_id: unitId("fortis_kill_team"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_deathwatch_10e_v1_2"),
};


export const deathwatchLeaderEligibilities10e: SeedDataset<"leader_eligibilities"> = {
  table: "leader_eligibilities",
  records: [
    WatchCaptainArtemisDeathwatchVeteransLeaderEligibility,
    WatchCaptainArtemisFortisKillTeamLeaderEligibility,
    WatchMasterDeathwatchVeteransLeaderEligibility,
    WatchMasterFortisKillTeamLeaderEligibility,
  ] satisfies LeaderEligibilityConfig[],
};
