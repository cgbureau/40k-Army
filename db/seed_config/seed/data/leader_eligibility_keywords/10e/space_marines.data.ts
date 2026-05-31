import type {
  LeaderEligibilityKeywordConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { keywordId, leaderEligibilityId, leaderEligibilityKeywordId } from "../../../ids";

/**
 * 10th edition leader eligibility keyword rows owned by `space_marines`.
 * Generated from BSData keyword-predicate Leader targets.
 */

export const ChampionOfTheChapterCrucibleKeywordTacticusTacticusLeaderEligibilityKeyword: LeaderEligibilityKeywordConfig = {
  id: leaderEligibilityKeywordId("champion_of_the_chapter_crucible__keyword_tacticus__tacticus"),
  leader_eligibility_id: leaderEligibilityId("champion_of_the_chapter_crucible__keyword_tacticus"),
  keyword_id: keywordId("tacticus"),
};


export const LibrariusAdeptCrucibleKeywordTacticusTacticusLeaderEligibilityKeyword: LeaderEligibilityKeywordConfig = {
  id: leaderEligibilityKeywordId("librarius_adept_crucible__keyword_tacticus__tacticus"),
  leader_eligibility_id: leaderEligibilityId("librarius_adept_crucible__keyword_tacticus"),
  keyword_id: keywordId("tacticus"),
};


export const spaceMarinesLeaderEligibilityKeywords10e: SeedDataset<"leader_eligibility_keywords"> = {
  table: "leader_eligibility_keywords",
  records: [
    ChampionOfTheChapterCrucibleKeywordTacticusTacticusLeaderEligibilityKeyword,
    LibrariusAdeptCrucibleKeywordTacticusTacticusLeaderEligibilityKeyword,
  ] satisfies LeaderEligibilityKeywordConfig[],
};
