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
 * 10th edition detachment-granted unit keyword rows owned by `thousand_sons`.
 * Generated from conservative BSData detachment rule text parsing.
 */

export const WarpmeldPactDetachmentTzaangorsBattlelineDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("warpmeld_pact_detachment__tzaangors__battleline"),
  detachment_id: detachmentId("warpmeld_pact_detachment"),
  unit_id: unitId("tzaangors"),
  keyword_id: keywordId("battleline"),
  effective_date: null,
  superseded_date: null,
};


export const thousandSonsDetachmentUnitKeywords10e: SeedDataset<"detachment_unit_keywords"> = {
  table: "detachment_unit_keywords",
  records: [
    WarpmeldPactDetachmentTzaangorsBattlelineDetachmentUnitKeyword,
  ] satisfies DetachmentUnitKeywordConfig[],
};
