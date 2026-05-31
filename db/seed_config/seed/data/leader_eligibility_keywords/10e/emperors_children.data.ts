import type {
  LeaderEligibilityKeywordConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { keywordId, leaderEligibilityId, leaderEligibilityKeywordId } from "../../../ids";

/**
 * 10th edition leader eligibility keyword rows owned by `emperors_children`.
 * Generated from BSData keyword-predicate Leader targets.
 */

export const LordKakophonistKeywordEmperorsChildrenTerminatorSquadEmperorsChildrenLeaderEligibilityKeyword: LeaderEligibilityKeywordConfig = {
  id: leaderEligibilityKeywordId("lord_kakophonist__keyword_emperors_children_terminator_squad__emperors_children"),
  leader_eligibility_id: leaderEligibilityId("lord_kakophonist__keyword_emperors_children_terminator_squad"),
  keyword_id: keywordId("emperors_children"),
};


export const LordKakophonistKeywordEmperorsChildrenTerminatorSquadTerminatorSquadLeaderEligibilityKeyword: LeaderEligibilityKeywordConfig = {
  id: leaderEligibilityKeywordId("lord_kakophonist__keyword_emperors_children_terminator_squad__terminator_squad"),
  leader_eligibility_id: leaderEligibilityId("lord_kakophonist__keyword_emperors_children_terminator_squad"),
  keyword_id: keywordId("terminator_squad"),
};


export const emperorsChildrenLeaderEligibilityKeywords10e: SeedDataset<"leader_eligibility_keywords"> = {
  table: "leader_eligibility_keywords",
  records: [
    LordKakophonistKeywordEmperorsChildrenTerminatorSquadEmperorsChildrenLeaderEligibilityKeyword,
    LordKakophonistKeywordEmperorsChildrenTerminatorSquadTerminatorSquadLeaderEligibilityKeyword,
  ] satisfies LeaderEligibilityKeywordConfig[],
};
