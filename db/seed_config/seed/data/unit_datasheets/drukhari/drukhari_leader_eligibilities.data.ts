import type { LeaderEligibilityConfig, SeedDataset } from "../../../../types/_index.types";
import { gameEditionId, leaderEligibilityId, rulesSourceId, unitId } from "../../../ids";

/**
 * Leader eligibility (LED BY) records for the drukhari faction.
 * Generated from Wahapedia unit-datasheet data.
 */

export const ArchonHandOfTheArchonLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("archon__hand_of_the_archon"),
  leader_unit_id: unitId("archon"),
  target_unit_id: unitId("hand_of_the_archon"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_drukhari_10e_v1_1"),
};

export const ArchonIncubiLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("archon__incubi"),
  leader_unit_id: unitId("archon"),
  target_unit_id: unitId("incubi"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_drukhari_10e_v1_1"),
};

export const ArchonKabaliteWarriorsLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("archon__kabalite_warriors"),
  leader_unit_id: unitId("archon"),
  target_unit_id: unitId("kabalite_warriors"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_drukhari_10e_v1_1"),
};

export const DrazharIncubiLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("drazhar__incubi"),
  leader_unit_id: unitId("drazhar"),
  target_unit_id: unitId("incubi"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_drukhari_10e_v1_1"),
};

export const HaemonculusWracksLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("haemonculus__wracks"),
  leader_unit_id: unitId("haemonculus"),
  target_unit_id: unitId("wracks"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_drukhari_10e_v1_1"),
};

export const LadyMalysHandOfTheArchonLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("lady_malys__hand_of_the_archon"),
  leader_unit_id: unitId("lady_malys"),
  target_unit_id: unitId("hand_of_the_archon"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_drukhari_10e_v1_1"),
};

export const LadyMalysIncubiLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("lady_malys__incubi"),
  leader_unit_id: unitId("lady_malys"),
  target_unit_id: unitId("incubi"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_drukhari_10e_v1_1"),
};

export const LadyMalysKabaliteWarriorsLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("lady_malys__kabalite_warriors"),
  leader_unit_id: unitId("lady_malys"),
  target_unit_id: unitId("kabalite_warriors"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_drukhari_10e_v1_1"),
};

export const LelithHesperaxWychesLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("lelith_hesperax__wyches"),
  leader_unit_id: unitId("lelith_hesperax"),
  target_unit_id: unitId("wyches"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_drukhari_10e_v1_1"),
};

export const SuccubusWychesLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("succubus__wyches"),
  leader_unit_id: unitId("succubus"),
  target_unit_id: unitId("wyches"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_drukhari_10e_v1_1"),
};

export const UrienRakarthWracksLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("urien_rakarth__wracks"),
  leader_unit_id: unitId("urien_rakarth"),
  target_unit_id: unitId("wracks"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("faction_pack_drukhari_10e_v1_1"),
};

export const drukhariLeaderEligibilitiesDataset: SeedDataset<"leader_eligibilities"> = {
  table: "leader_eligibilities",
  records: [
    ArchonHandOfTheArchonLeaderEligibility,
    ArchonIncubiLeaderEligibility,
    ArchonKabaliteWarriorsLeaderEligibility,
    DrazharIncubiLeaderEligibility,
    HaemonculusWracksLeaderEligibility,
    LadyMalysHandOfTheArchonLeaderEligibility,
    LadyMalysIncubiLeaderEligibility,
    LadyMalysKabaliteWarriorsLeaderEligibility,
    LelithHesperaxWychesLeaderEligibility,
    SuccubusWychesLeaderEligibility,
    UrienRakarthWracksLeaderEligibility,
  ] satisfies LeaderEligibilityConfig[],
};
