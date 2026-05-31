import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `astra_militarum`.
 */

export const AstraMilitarumArmouredInfantryDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("astra_militarum__armoured_infantry_detachment"),
  rules_faction_id: rulesFactionId("astra_militarum"),
  detachment_id: detachmentId("armoured_infantry_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AstraMilitarumBridgeheadStrikeDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("astra_militarum__bridgehead_strike_detachment"),
  rules_faction_id: rulesFactionId("astra_militarum"),
  detachment_id: detachmentId("bridgehead_strike_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AstraMilitarumCombinedArmsDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("astra_militarum__combined_arms_detachment"),
  rules_faction_id: rulesFactionId("astra_militarum"),
  detachment_id: detachmentId("combined_arms_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AstraMilitarumGrizzledCompanyDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("astra_militarum__grizzled_company_detachment"),
  rules_faction_id: rulesFactionId("astra_militarum"),
  detachment_id: detachmentId("grizzled_company_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AstraMilitarumHammerOfTheEmperorDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("astra_militarum__hammer_of_the_emperor_detachment"),
  rules_faction_id: rulesFactionId("astra_militarum"),
  detachment_id: detachmentId("hammer_of_the_emperor_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AstraMilitarumMechanisedAssaultDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("astra_militarum__mechanised_assault_detachment"),
  rules_faction_id: rulesFactionId("astra_militarum"),
  detachment_id: detachmentId("mechanised_assault_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AstraMilitarumReconElementDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("astra_militarum__recon_element_detachment"),
  rules_faction_id: rulesFactionId("astra_militarum"),
  detachment_id: detachmentId("recon_element_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AstraMilitarumSiegeRegimentDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("astra_militarum__siege_regiment_detachment"),
  rules_faction_id: rulesFactionId("astra_militarum"),
  detachment_id: detachmentId("siege_regiment_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AstraMilitarumSteelHammerDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("astra_militarum__steel_hammer_detachment"),
  rules_faction_id: rulesFactionId("astra_militarum"),
  detachment_id: detachmentId("steel_hammer_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const astraMilitarumRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    AstraMilitarumArmouredInfantryDetachmentRulesFactionDetachment,
    AstraMilitarumBridgeheadStrikeDetachmentRulesFactionDetachment,
    AstraMilitarumCombinedArmsDetachmentRulesFactionDetachment,
    AstraMilitarumGrizzledCompanyDetachmentRulesFactionDetachment,
    AstraMilitarumHammerOfTheEmperorDetachmentRulesFactionDetachment,
    AstraMilitarumMechanisedAssaultDetachmentRulesFactionDetachment,
    AstraMilitarumReconElementDetachmentRulesFactionDetachment,
    AstraMilitarumSiegeRegimentDetachmentRulesFactionDetachment,
    AstraMilitarumSteelHammerDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
