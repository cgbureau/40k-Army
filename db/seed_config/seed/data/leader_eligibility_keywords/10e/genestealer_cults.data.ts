import type {
  LeaderEligibilityKeywordConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { keywordId, leaderEligibilityId, leaderEligibilityKeywordId } from "../../../ids";

/**
 * 10th edition leader eligibility keyword rows owned by `genestealer_cults`.
 * Generated from BSData keyword-predicate Leader targets.
 */

export const AcolyteIconwardKeywordAcolyteHybridsAcolyteHybridsLeaderEligibilityKeyword: LeaderEligibilityKeywordConfig = {
  id: leaderEligibilityKeywordId("acolyte_iconward__keyword_acolyte_hybrids__acolyte_hybrids"),
  leader_eligibility_id: leaderEligibilityId("acolyte_iconward__keyword_acolyte_hybrids"),
  keyword_id: keywordId("acolyte_hybrids"),
};


export const BenefictusKeywordAcolyteHybridsAcolyteHybridsLeaderEligibilityKeyword: LeaderEligibilityKeywordConfig = {
  id: leaderEligibilityKeywordId("benefictus__keyword_acolyte_hybrids__acolyte_hybrids"),
  leader_eligibility_id: leaderEligibilityId("benefictus__keyword_acolyte_hybrids"),
  keyword_id: keywordId("acolyte_hybrids"),
};


export const ClamavusKeywordAcolyteHybridsAcolyteHybridsLeaderEligibilityKeyword: LeaderEligibilityKeywordConfig = {
  id: leaderEligibilityKeywordId("clamavus__keyword_acolyte_hybrids__acolyte_hybrids"),
  leader_eligibility_id: leaderEligibilityId("clamavus__keyword_acolyte_hybrids"),
  keyword_id: keywordId("acolyte_hybrids"),
};


export const LocusKeywordAcolyteHybridsAcolyteHybridsLeaderEligibilityKeyword: LeaderEligibilityKeywordConfig = {
  id: leaderEligibilityKeywordId("locus__keyword_acolyte_hybrids__acolyte_hybrids"),
  leader_eligibility_id: leaderEligibilityId("locus__keyword_acolyte_hybrids"),
  keyword_id: keywordId("acolyte_hybrids"),
};


export const MagusKeywordAcolyteHybridsAcolyteHybridsLeaderEligibilityKeyword: LeaderEligibilityKeywordConfig = {
  id: leaderEligibilityKeywordId("magus__keyword_acolyte_hybrids__acolyte_hybrids"),
  leader_eligibility_id: leaderEligibilityId("magus__keyword_acolyte_hybrids"),
  keyword_id: keywordId("acolyte_hybrids"),
};


export const NexosKeywordAcolyteHybridsAcolyteHybridsLeaderEligibilityKeyword: LeaderEligibilityKeywordConfig = {
  id: leaderEligibilityKeywordId("nexos__keyword_acolyte_hybrids__acolyte_hybrids"),
  leader_eligibility_id: leaderEligibilityId("nexos__keyword_acolyte_hybrids"),
  keyword_id: keywordId("acolyte_hybrids"),
};


export const PrimusKeywordAcolyteHybridsAcolyteHybridsLeaderEligibilityKeyword: LeaderEligibilityKeywordConfig = {
  id: leaderEligibilityKeywordId("primus__keyword_acolyte_hybrids__acolyte_hybrids"),
  leader_eligibility_id: leaderEligibilityId("primus__keyword_acolyte_hybrids"),
  keyword_id: keywordId("acolyte_hybrids"),
};


export const genestealerCultsLeaderEligibilityKeywords10e: SeedDataset<"leader_eligibility_keywords"> = {
  table: "leader_eligibility_keywords",
  records: [
    AcolyteIconwardKeywordAcolyteHybridsAcolyteHybridsLeaderEligibilityKeyword,
    BenefictusKeywordAcolyteHybridsAcolyteHybridsLeaderEligibilityKeyword,
    ClamavusKeywordAcolyteHybridsAcolyteHybridsLeaderEligibilityKeyword,
    LocusKeywordAcolyteHybridsAcolyteHybridsLeaderEligibilityKeyword,
    MagusKeywordAcolyteHybridsAcolyteHybridsLeaderEligibilityKeyword,
    NexosKeywordAcolyteHybridsAcolyteHybridsLeaderEligibilityKeyword,
    PrimusKeywordAcolyteHybridsAcolyteHybridsLeaderEligibilityKeyword,
  ] satisfies LeaderEligibilityKeywordConfig[],
};
