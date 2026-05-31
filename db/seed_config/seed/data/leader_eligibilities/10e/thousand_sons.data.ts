import type {
  LeaderEligibilityConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { gameEditionId, leaderEligibilityId, rulesSourceId, unitId } from "../../../ids";

/**
 * 10th edition leader eligibility rows owned by `thousand_sons`.
 * Generated from BSData Leader ability profiles.
 */

export const AhrimanRubricMarinesLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("ahriman__rubric_marines"),
  leader_unit_id: unitId("ahriman"),
  target_unit_id: unitId("rubric_marines"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_thousand_sons_10e"),
};


export const AhrimanTzaangorEnlightenedLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("ahriman__tzaangor_enlightened"),
  leader_unit_id: unitId("ahriman"),
  target_unit_id: unitId("tzaangor_enlightened"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_thousand_sons_10e"),
};


export const BrayherdChieftainCrucibleTzaangorsLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("brayherd_chieftain_crucible__tzaangors"),
  leader_unit_id: unitId("brayherd_chieftain_crucible"),
  target_unit_id: unitId("tzaangors"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_thousand_sons_10e"),
};


export const BrayherdShamanCrucibleTzaangorsLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("brayherd_shaman_crucible__tzaangors"),
  leader_unit_id: unitId("brayherd_shaman_crucible"),
  target_unit_id: unitId("tzaangors"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_thousand_sons_10e"),
};


export const ExaltedSorcererRubricMarinesLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("exalted_sorcerer__rubric_marines"),
  leader_unit_id: unitId("exalted_sorcerer"),
  target_unit_id: unitId("rubric_marines"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_thousand_sons_10e"),
};


export const ExaltedSorcererOnDiscOfTzeentchRubricMarinesLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("exalted_sorcerer_on_disc_of_tzeentch__rubric_marines"),
  leader_unit_id: unitId("exalted_sorcerer_on_disc_of_tzeentch"),
  target_unit_id: unitId("rubric_marines"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_thousand_sons_10e"),
};


export const ExaltedSorcererOnDiscOfTzeentchTzaangorEnlightenedLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("exalted_sorcerer_on_disc_of_tzeentch__tzaangor_enlightened"),
  leader_unit_id: unitId("exalted_sorcerer_on_disc_of_tzeentch"),
  target_unit_id: unitId("tzaangor_enlightened"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_thousand_sons_10e"),
};


export const InfernalMasterRubricMarinesLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("infernal_master__rubric_marines"),
  leader_unit_id: unitId("infernal_master"),
  target_unit_id: unitId("rubric_marines"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_thousand_sons_10e"),
};


export const MagisterCrucibleRubricMarinesLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("magister_crucible__rubric_marines"),
  leader_unit_id: unitId("magister_crucible"),
  target_unit_id: unitId("rubric_marines"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_thousand_sons_10e"),
};


export const SorcererRubricMarinesLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("sorcerer__rubric_marines"),
  leader_unit_id: unitId("sorcerer"),
  target_unit_id: unitId("rubric_marines"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_thousand_sons_10e"),
};


export const SorcererInTerminatorArmourScarabOccultTerminatorsLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("sorcerer_in_terminator_armour__scarab_occult_terminators"),
  leader_unit_id: unitId("sorcerer_in_terminator_armour"),
  target_unit_id: unitId("scarab_occult_terminators"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_thousand_sons_10e"),
};


export const TzaangorShamanTzaangorEnlightenedLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("tzaangor_shaman__tzaangor_enlightened"),
  leader_unit_id: unitId("tzaangor_shaman"),
  target_unit_id: unitId("tzaangor_enlightened"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_thousand_sons_10e"),
};


export const TzaangorShamanTzaangorsLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("tzaangor_shaman__tzaangors"),
  leader_unit_id: unitId("tzaangor_shaman"),
  target_unit_id: unitId("tzaangors"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_thousand_sons_10e"),
};


export const thousandSonsLeaderEligibilities10e: SeedDataset<"leader_eligibilities"> = {
  table: "leader_eligibilities",
  records: [
    AhrimanRubricMarinesLeaderEligibility,
    AhrimanTzaangorEnlightenedLeaderEligibility,
    BrayherdChieftainCrucibleTzaangorsLeaderEligibility,
    BrayherdShamanCrucibleTzaangorsLeaderEligibility,
    ExaltedSorcererRubricMarinesLeaderEligibility,
    ExaltedSorcererOnDiscOfTzeentchRubricMarinesLeaderEligibility,
    ExaltedSorcererOnDiscOfTzeentchTzaangorEnlightenedLeaderEligibility,
    InfernalMasterRubricMarinesLeaderEligibility,
    MagisterCrucibleRubricMarinesLeaderEligibility,
    SorcererRubricMarinesLeaderEligibility,
    SorcererInTerminatorArmourScarabOccultTerminatorsLeaderEligibility,
    TzaangorShamanTzaangorEnlightenedLeaderEligibility,
    TzaangorShamanTzaangorsLeaderEligibility,
  ] satisfies LeaderEligibilityConfig[],
};
