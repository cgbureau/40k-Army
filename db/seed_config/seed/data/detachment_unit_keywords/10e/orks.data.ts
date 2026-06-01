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
 * 10th edition detachment-granted unit keyword rows owned by `orks`.
 * Generated from conservative BSData detachment rule text parsing.
 */

export const DreadMobDetachmentGretchinBattlelineDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("dread_mob_detachment__gretchin__battleline"),
  detachment_id: detachmentId("dread_mob_detachment"),
  unit_id: unitId("gretchin"),
  keyword_id: keywordId("battleline"),
  effective_date: null,
  superseded_date: null,
};


export const TaktikalBrigadeDetachmentStormboyzBattlelineDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("taktikal_brigade_detachment__stormboyz__battleline"),
  detachment_id: detachmentId("taktikal_brigade_detachment"),
  unit_id: unitId("stormboyz"),
  keyword_id: keywordId("battleline"),
  effective_date: null,
  superseded_date: null,
};


export const orksDetachmentUnitKeywords10e: SeedDataset<"detachment_unit_keywords"> = {
  table: "detachment_unit_keywords",
  records: [
    DreadMobDetachmentGretchinBattlelineDetachmentUnitKeyword,
    TaktikalBrigadeDetachmentStormboyzBattlelineDetachmentUnitKeyword,
  ] satisfies DetachmentUnitKeywordConfig[],
};
