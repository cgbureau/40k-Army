import type {
  LeaderEligibilityKeywordConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { keywordId, leaderEligibilityId, leaderEligibilityKeywordId } from "../../../ids";

/**
 * 10th edition leader eligibility keyword rows owned by `astra_militarum`.
 * Generated from BSData keyword-predicate Leader targets.
 */

export const FrontLineCommanderCrucibleKeywordAstraMilitarumBattlelineAstraMilitarumLeaderEligibilityKeyword: LeaderEligibilityKeywordConfig = {
  id: leaderEligibilityKeywordId("front_line_commander_crucible__keyword_astra_militarum_battleline__astra_militarum"),
  leader_eligibility_id: leaderEligibilityId("front_line_commander_crucible__keyword_astra_militarum_battleline"),
  keyword_id: keywordId("astra_militarum"),
};


export const FrontLineCommanderCrucibleKeywordAstraMilitarumBattlelineBattlelineLeaderEligibilityKeyword: LeaderEligibilityKeywordConfig = {
  id: leaderEligibilityKeywordId("front_line_commander_crucible__keyword_astra_militarum_battleline__battleline"),
  leader_eligibility_id: leaderEligibilityId("front_line_commander_crucible__keyword_astra_militarum_battleline"),
  keyword_id: keywordId("battleline"),
};


export const astraMilitarumLeaderEligibilityKeywords10e: SeedDataset<"leader_eligibility_keywords"> = {
  table: "leader_eligibility_keywords",
  records: [
    FrontLineCommanderCrucibleKeywordAstraMilitarumBattlelineAstraMilitarumLeaderEligibilityKeyword,
    FrontLineCommanderCrucibleKeywordAstraMilitarumBattlelineBattlelineLeaderEligibilityKeyword,
  ] satisfies LeaderEligibilityKeywordConfig[],
};
