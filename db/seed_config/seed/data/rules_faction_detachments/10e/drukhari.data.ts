import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `drukhari`.
 */

export const DrukhariCoveniteCoterieDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("drukhari__covenite_coterie_detachment"),
  rules_faction_id: rulesFactionId("drukhari"),
  detachment_id: detachmentId("covenite_coterie_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const DrukhariKabaliteCartelDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("drukhari__kabalite_cartel_detachment"),
  rules_faction_id: rulesFactionId("drukhari"),
  detachment_id: detachmentId("kabalite_cartel_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const DrukhariRealspaceRaidersDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("drukhari__realspace_raiders_detachment"),
  rules_faction_id: rulesFactionId("drukhari"),
  detachment_id: detachmentId("realspace_raiders_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const DrukhariReapersWagerDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("drukhari__reapers_wager_detachment"),
  rules_faction_id: rulesFactionId("drukhari"),
  detachment_id: detachmentId("reapers_wager_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const DrukhariSkysplinterAssaultDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("drukhari__skysplinter_assault_detachment"),
  rules_faction_id: rulesFactionId("drukhari"),
  detachment_id: detachmentId("skysplinter_assault_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const DrukhariSpectacleOfSpiteDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("drukhari__spectacle_of_spite_detachment"),
  rules_faction_id: rulesFactionId("drukhari"),
  detachment_id: detachmentId("spectacle_of_spite_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const drukhariRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    DrukhariCoveniteCoterieDetachmentRulesFactionDetachment,
    DrukhariKabaliteCartelDetachmentRulesFactionDetachment,
    DrukhariRealspaceRaidersDetachmentRulesFactionDetachment,
    DrukhariReapersWagerDetachmentRulesFactionDetachment,
    DrukhariSkysplinterAssaultDetachmentRulesFactionDetachment,
    DrukhariSpectacleOfSpiteDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
