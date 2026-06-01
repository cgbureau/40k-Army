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
 * 10th edition detachment-granted unit keyword rows owned by `tyranids`.
 * Generated from conservative BSData detachment rule text parsing.
 */

export const SubterraneanAssaultDetachmentMawlocBurrowerDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("subterranean_assault_detachment__mawloc__burrower"),
  detachment_id: detachmentId("subterranean_assault_detachment"),
  unit_id: unitId("mawloc"),
  keyword_id: keywordId("burrower"),
  effective_date: null,
  superseded_date: null,
};


export const SubterraneanAssaultDetachmentTrygonBurrowerDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("subterranean_assault_detachment__trygon__burrower"),
  detachment_id: detachmentId("subterranean_assault_detachment"),
  unit_id: unitId("trygon"),
  keyword_id: keywordId("burrower"),
  effective_date: null,
  superseded_date: null,
};


export const WarriorBioformOnslaughtDetachmentTyranidWarriorsWithMeleeBioWeaponsBattlelineDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("warrior_bioform_onslaught_detachment__tyranid_warriors_with_melee_bio_weapons__battleline"),
  detachment_id: detachmentId("warrior_bioform_onslaught_detachment"),
  unit_id: unitId("tyranid_warriors_with_melee_bio_weapons"),
  keyword_id: keywordId("battleline"),
  effective_date: null,
  superseded_date: null,
};


export const WarriorBioformOnslaughtDetachmentTyranidWarriorsWithMeleeBioWeaponsTyranidWarriorsDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("warrior_bioform_onslaught_detachment__tyranid_warriors_with_melee_bio_weapons__tyranid_warriors"),
  detachment_id: detachmentId("warrior_bioform_onslaught_detachment"),
  unit_id: unitId("tyranid_warriors_with_melee_bio_weapons"),
  keyword_id: keywordId("tyranid_warriors"),
  effective_date: null,
  superseded_date: null,
};


export const WarriorBioformOnslaughtDetachmentTyranidWarriorsWithRangedBioWeaponsBattlelineDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("warrior_bioform_onslaught_detachment__tyranid_warriors_with_ranged_bio_weapons__battleline"),
  detachment_id: detachmentId("warrior_bioform_onslaught_detachment"),
  unit_id: unitId("tyranid_warriors_with_ranged_bio_weapons"),
  keyword_id: keywordId("battleline"),
  effective_date: null,
  superseded_date: null,
};


export const WarriorBioformOnslaughtDetachmentTyranidWarriorsWithRangedBioWeaponsTyranidWarriorsDetachmentUnitKeyword: DetachmentUnitKeywordConfig = {
  id: detachmentUnitKeywordId("warrior_bioform_onslaught_detachment__tyranid_warriors_with_ranged_bio_weapons__tyranid_warriors"),
  detachment_id: detachmentId("warrior_bioform_onslaught_detachment"),
  unit_id: unitId("tyranid_warriors_with_ranged_bio_weapons"),
  keyword_id: keywordId("tyranid_warriors"),
  effective_date: null,
  superseded_date: null,
};


export const tyranidsDetachmentUnitKeywords10e: SeedDataset<"detachment_unit_keywords"> = {
  table: "detachment_unit_keywords",
  records: [
    SubterraneanAssaultDetachmentMawlocBurrowerDetachmentUnitKeyword,
    SubterraneanAssaultDetachmentTrygonBurrowerDetachmentUnitKeyword,
    WarriorBioformOnslaughtDetachmentTyranidWarriorsWithMeleeBioWeaponsBattlelineDetachmentUnitKeyword,
    WarriorBioformOnslaughtDetachmentTyranidWarriorsWithMeleeBioWeaponsTyranidWarriorsDetachmentUnitKeyword,
    WarriorBioformOnslaughtDetachmentTyranidWarriorsWithRangedBioWeaponsBattlelineDetachmentUnitKeyword,
    WarriorBioformOnslaughtDetachmentTyranidWarriorsWithRangedBioWeaponsTyranidWarriorsDetachmentUnitKeyword,
  ] satisfies DetachmentUnitKeywordConfig[],
};
