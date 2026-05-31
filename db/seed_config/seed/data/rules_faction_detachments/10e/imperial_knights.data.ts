import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `imperial_knights`.
 */

export const ImperialKnightsFreebladeCompanyDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("imperial_knights__freeblade_company_detachment"),
  rules_faction_id: rulesFactionId("imperial_knights"),
  detachment_id: detachmentId("freeblade_company_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ImperialKnightsGateWardenLanceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("imperial_knights__gate_warden_lance_detachment"),
  rules_faction_id: rulesFactionId("imperial_knights"),
  detachment_id: detachmentId("gate_warden_lance_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ImperialKnightsQuestorForgepactDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("imperial_knights__questor_forgepact_detachment"),
  rules_faction_id: rulesFactionId("imperial_knights"),
  detachment_id: detachmentId("questor_forgepact_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ImperialKnightsQuestorisCompanionsDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("imperial_knights__questoris_companions_detachment"),
  rules_faction_id: rulesFactionId("imperial_knights"),
  detachment_id: detachmentId("questoris_companions_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ImperialKnightsSpearheadAtArmsDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("imperial_knights__spearhead_at_arms_detachment"),
  rules_faction_id: rulesFactionId("imperial_knights"),
  detachment_id: detachmentId("spearhead_at_arms_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ImperialKnightsValourstrikeLanceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("imperial_knights__valourstrike_lance_detachment"),
  rules_faction_id: rulesFactionId("imperial_knights"),
  detachment_id: detachmentId("valourstrike_lance_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const imperialKnightsRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    ImperialKnightsFreebladeCompanyDetachmentRulesFactionDetachment,
    ImperialKnightsGateWardenLanceDetachmentRulesFactionDetachment,
    ImperialKnightsQuestorForgepactDetachmentRulesFactionDetachment,
    ImperialKnightsQuestorisCompanionsDetachmentRulesFactionDetachment,
    ImperialKnightsSpearheadAtArmsDetachmentRulesFactionDetachment,
    ImperialKnightsValourstrikeLanceDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
