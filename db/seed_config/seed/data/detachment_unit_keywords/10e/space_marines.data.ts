import type {
  DetachmentUnitKeywordConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import {
  detachmentId,
  detachmentUnitKeywordId,
  keywordId,
  unitId,
} from "../../../ids";

/**
 * 10th edition detachment-granted unit keyword rows owned by `space_marines`.
 * Generated from conservative BSData detachment rule text parsing.
 */

export const CompanyOfHuntersDetachmentOutriderSquadBattlelineDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("company_of_hunters_detachment__outrider_squad__battleline"),
  detachment_id: detachmentId("company_of_hunters_detachment"),
  unit_id: unitId("outrider_squad"),
  keyword_id: keywordId("battleline"),
  effective_date: null,
  superseded_date: null,
};


export const spaceMarinesDetachmentUnitKeywords10e: SeedDataset<"detachment_unit_keywords"> = {
  table: "detachment_unit_keywords",
  records: [
    CompanyOfHuntersDetachmentOutriderSquadBattlelineDetachmentUnitKeyword,
  ] satisfies DetachmentUnitKeywordConfig[],
};
