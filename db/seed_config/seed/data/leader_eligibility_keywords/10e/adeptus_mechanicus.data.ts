import type {
  LeaderEligibilityKeywordConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { keywordId, leaderEligibilityId, leaderEligibilityKeywordId } from "../../../ids";

/**
 * 10th edition leader eligibility keyword rows owned by `adeptus_mechanicus`.
 * Generated from BSData keyword-predicate Leader targets.
 */

export const MagosCrucibleKeywordElectroPriestsElectroPriestsLeaderEligibilityKeyword: LeaderEligibilityKeywordConfig = {
  id: leaderEligibilityKeywordId("magos_crucible__keyword_electro_priests__electro_priests"),
  leader_eligibility_id: leaderEligibilityId("magos_crucible__keyword_electro_priests"),
  keyword_id: keywordId("electro_priests"),
};


export const MagosCrucibleKeywordKataphronsKataphronLeaderEligibilityKeyword: LeaderEligibilityKeywordConfig = {
  id: leaderEligibilityKeywordId("magos_crucible__keyword_kataphrons__kataphron"),
  leader_eligibility_id: leaderEligibilityId("magos_crucible__keyword_kataphrons"),
  keyword_id: keywordId("kataphron"),
};


export const adeptusMechanicusLeaderEligibilityKeywords10e: SeedDataset<"leader_eligibility_keywords"> = {
  table: "leader_eligibility_keywords",
  records: [
    MagosCrucibleKeywordElectroPriestsElectroPriestsLeaderEligibilityKeyword,
    MagosCrucibleKeywordKataphronsKataphronLeaderEligibilityKeyword,
  ] satisfies LeaderEligibilityKeywordConfig[],
};
