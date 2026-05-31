import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `chaos_knights`.
 */

export const ChaosKnightsHelhuntLanceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("chaos_knights__helhunt_lance_detachment"),
  rules_faction_id: rulesFactionId("chaos_knights"),
  detachment_id: detachmentId("helhunt_lance_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ChaosKnightsHoundpackLanceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("chaos_knights__houndpack_lance_detachment"),
  rules_faction_id: rulesFactionId("chaos_knights"),
  detachment_id: detachmentId("houndpack_lance_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ChaosKnightsIconoclastFiefdomDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("chaos_knights__iconoclast_fiefdom_detachment"),
  rules_faction_id: rulesFactionId("chaos_knights"),
  detachment_id: detachmentId("iconoclast_fiefdom_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ChaosKnightsInfernalLanceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("chaos_knights__infernal_lance_detachment"),
  rules_faction_id: rulesFactionId("chaos_knights"),
  detachment_id: detachmentId("infernal_lance_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ChaosKnightsLordsOfDreadDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("chaos_knights__lords_of_dread_detachment"),
  rules_faction_id: rulesFactionId("chaos_knights"),
  detachment_id: detachmentId("lords_of_dread_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ChaosKnightsTraitorisLanceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("chaos_knights__traitoris_lance_detachment"),
  rules_faction_id: rulesFactionId("chaos_knights"),
  detachment_id: detachmentId("traitoris_lance_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const chaosKnightsRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    ChaosKnightsHelhuntLanceDetachmentRulesFactionDetachment,
    ChaosKnightsHoundpackLanceDetachmentRulesFactionDetachment,
    ChaosKnightsIconoclastFiefdomDetachmentRulesFactionDetachment,
    ChaosKnightsInfernalLanceDetachmentRulesFactionDetachment,
    ChaosKnightsLordsOfDreadDetachmentRulesFactionDetachment,
    ChaosKnightsTraitorisLanceDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
