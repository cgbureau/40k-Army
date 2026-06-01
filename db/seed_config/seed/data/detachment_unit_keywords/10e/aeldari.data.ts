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
 * 10th edition detachment-granted unit keyword rows owned by `aeldari`.
 * Generated from conservative BSData detachment rule text parsing.
 */

export const SpiritConclaveDetachmentWraithbladesBattlelineDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("spirit_conclave_detachment__wraithblades__battleline"),
  detachment_id: detachmentId("spirit_conclave_detachment"),
  unit_id: unitId("wraithblades"),
  keyword_id: keywordId("battleline"),
  effective_date: null,
  superseded_date: null,
};


export const SpiritConclaveDetachmentWraithguardBattlelineDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("spirit_conclave_detachment__wraithguard__battleline"),
  detachment_id: detachmentId("spirit_conclave_detachment"),
  unit_id: unitId("wraithguard"),
  keyword_id: keywordId("battleline"),
  effective_date: null,
  superseded_date: null,
};


export const aeldariDetachmentUnitKeywords10e: SeedDataset<"detachment_unit_keywords"> = {
  table: "detachment_unit_keywords",
  records: [
    SpiritConclaveDetachmentWraithbladesBattlelineDetachmentUnitKeyword,
    SpiritConclaveDetachmentWraithguardBattlelineDetachmentUnitKeyword,
  ] satisfies DetachmentUnitKeywordConfig[],
};
