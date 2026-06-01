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
 * 10th edition detachment-granted unit keyword rows owned by `chaos_knights`.
 * Generated from conservative BSData detachment rule text parsing.
 */

export const HoundpackLanceDetachmentWarDogBrigandBattlelineDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("houndpack_lance_detachment__war_dog_brigand__battleline"),
  detachment_id: detachmentId("houndpack_lance_detachment"),
  unit_id: unitId("war_dog_brigand"),
  keyword_id: keywordId("battleline"),
  effective_date: null,
  superseded_date: null,
};


export const HoundpackLanceDetachmentWarDogExecutionerBattlelineDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("houndpack_lance_detachment__war_dog_executioner__battleline"),
  detachment_id: detachmentId("houndpack_lance_detachment"),
  unit_id: unitId("war_dog_executioner"),
  keyword_id: keywordId("battleline"),
  effective_date: null,
  superseded_date: null,
};


export const HoundpackLanceDetachmentWarDogHuntsmanBattlelineDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("houndpack_lance_detachment__war_dog_huntsman__battleline"),
  detachment_id: detachmentId("houndpack_lance_detachment"),
  unit_id: unitId("war_dog_huntsman"),
  keyword_id: keywordId("battleline"),
  effective_date: null,
  superseded_date: null,
};


export const HoundpackLanceDetachmentWarDogKarnivoreBattlelineDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("houndpack_lance_detachment__war_dog_karnivore__battleline"),
  detachment_id: detachmentId("houndpack_lance_detachment"),
  unit_id: unitId("war_dog_karnivore"),
  keyword_id: keywordId("battleline"),
  effective_date: null,
  superseded_date: null,
};


export const HoundpackLanceDetachmentWarDogMoiraxBattlelineDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("houndpack_lance_detachment__war_dog_moirax__battleline"),
  detachment_id: detachmentId("houndpack_lance_detachment"),
  unit_id: unitId("war_dog_moirax"),
  keyword_id: keywordId("battleline"),
  effective_date: null,
  superseded_date: null,
};


export const HoundpackLanceDetachmentWarDogStalkerBattlelineDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("houndpack_lance_detachment__war_dog_stalker__battleline"),
  detachment_id: detachmentId("houndpack_lance_detachment"),
  unit_id: unitId("war_dog_stalker"),
  keyword_id: keywordId("battleline"),
  effective_date: null,
  superseded_date: null,
};


export const chaosKnightsDetachmentUnitKeywords10e: SeedDataset<"detachment_unit_keywords"> = {
  table: "detachment_unit_keywords",
  records: [
    HoundpackLanceDetachmentWarDogBrigandBattlelineDetachmentUnitKeyword,
    HoundpackLanceDetachmentWarDogExecutionerBattlelineDetachmentUnitKeyword,
    HoundpackLanceDetachmentWarDogHuntsmanBattlelineDetachmentUnitKeyword,
    HoundpackLanceDetachmentWarDogKarnivoreBattlelineDetachmentUnitKeyword,
    HoundpackLanceDetachmentWarDogMoiraxBattlelineDetachmentUnitKeyword,
    HoundpackLanceDetachmentWarDogStalkerBattlelineDetachmentUnitKeyword,
  ] satisfies DetachmentUnitKeywordConfig[],
};
