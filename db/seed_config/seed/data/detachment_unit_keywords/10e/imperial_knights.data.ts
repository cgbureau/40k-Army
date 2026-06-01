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
 * 10th edition detachment-granted unit keyword rows owned by `imperial_knights`.
 * Generated from conservative BSData detachment rule text parsing.
 */

export const SpearheadAtArmsDetachmentArmigerHelverinBattlelineDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("spearhead_at_arms_detachment__armiger_helverin__battleline"),
  detachment_id: detachmentId("spearhead_at_arms_detachment"),
  unit_id: unitId("armiger_helverin"),
  keyword_id: keywordId("battleline"),
  effective_date: null,
  superseded_date: null,
};


export const SpearheadAtArmsDetachmentArmigerMoiraxBattlelineDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("spearhead_at_arms_detachment__armiger_moirax__battleline"),
  detachment_id: detachmentId("spearhead_at_arms_detachment"),
  unit_id: unitId("armiger_moirax"),
  keyword_id: keywordId("battleline"),
  effective_date: null,
  superseded_date: null,
};


export const SpearheadAtArmsDetachmentArmigerWarglaiveBattlelineDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("spearhead_at_arms_detachment__armiger_warglaive__battleline"),
  detachment_id: detachmentId("spearhead_at_arms_detachment"),
  unit_id: unitId("armiger_warglaive"),
  keyword_id: keywordId("battleline"),
  effective_date: null,
  superseded_date: null,
};


export const imperialKnightsDetachmentUnitKeywords10e: SeedDataset<"detachment_unit_keywords"> = {
  table: "detachment_unit_keywords",
  records: [
    SpearheadAtArmsDetachmentArmigerHelverinBattlelineDetachmentUnitKeyword,
    SpearheadAtArmsDetachmentArmigerMoiraxBattlelineDetachmentUnitKeyword,
    SpearheadAtArmsDetachmentArmigerWarglaiveBattlelineDetachmentUnitKeyword,
  ] satisfies DetachmentUnitKeywordConfig[],
};
