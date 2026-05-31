import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `iron_hands`.
 */

export const IronHands1stCompanyTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("iron_hands__1st_company_task_force_detachment"),
  rules_faction_id: rulesFactionId("iron_hands"),
  detachment_id: detachmentId("1st_company_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const IronHandsAnvilSiegeForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("iron_hands__anvil_siege_force_detachment"),
  rules_faction_id: rulesFactionId("iron_hands"),
  detachment_id: detachmentId("anvil_siege_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const IronHandsArmouredSpeartipDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("iron_hands__armoured_speartip_detachment"),
  rules_faction_id: rulesFactionId("iron_hands"),
  detachment_id: detachmentId("armoured_speartip_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const IronHandsBastionTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("iron_hands__bastion_task_force_detachment"),
  rules_faction_id: rulesFactionId("iron_hands"),
  detachment_id: detachmentId("bastion_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const IronHandsCeramiteSentinelsDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("iron_hands__ceramite_sentinels_detachment"),
  rules_faction_id: rulesFactionId("iron_hands"),
  detachment_id: detachmentId("ceramite_sentinels_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const IronHandsFirestormAssaultForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("iron_hands__firestorm_assault_force_detachment"),
  rules_faction_id: rulesFactionId("iron_hands"),
  detachment_id: detachmentId("firestorm_assault_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const IronHandsGladiusTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("iron_hands__gladius_task_force_detachment"),
  rules_faction_id: rulesFactionId("iron_hands"),
  detachment_id: detachmentId("gladius_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const IronHandsHammerOfAverniiDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("iron_hands__hammer_of_avernii_detachment"),
  rules_faction_id: rulesFactionId("iron_hands"),
  detachment_id: detachmentId("hammer_of_avernii_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const IronHandsHeadhunterTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("iron_hands__headhunter_task_force_detachment"),
  rules_faction_id: rulesFactionId("iron_hands"),
  detachment_id: detachmentId("headhunter_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const IronHandsIronstormSpearheadDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("iron_hands__ironstorm_spearhead_detachment"),
  rules_faction_id: rulesFactionId("iron_hands"),
  detachment_id: detachmentId("ironstorm_spearhead_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const IronHandsLibrariusConclaveDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("iron_hands__librarius_conclave_detachment"),
  rules_faction_id: rulesFactionId("iron_hands"),
  detachment_id: detachmentId("librarius_conclave_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const IronHandsOrbitalAssaultForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("iron_hands__orbital_assault_force_detachment"),
  rules_faction_id: rulesFactionId("iron_hands"),
  detachment_id: detachmentId("orbital_assault_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const IronHandsStormlanceTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("iron_hands__stormlance_task_force_detachment"),
  rules_faction_id: rulesFactionId("iron_hands"),
  detachment_id: detachmentId("stormlance_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const IronHandsVanguardSpearheadDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("iron_hands__vanguard_spearhead_detachment"),
  rules_faction_id: rulesFactionId("iron_hands"),
  detachment_id: detachmentId("vanguard_spearhead_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const ironHandsRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    IronHands1stCompanyTaskForceDetachmentRulesFactionDetachment,
    IronHandsAnvilSiegeForceDetachmentRulesFactionDetachment,
    IronHandsArmouredSpeartipDetachmentRulesFactionDetachment,
    IronHandsBastionTaskForceDetachmentRulesFactionDetachment,
    IronHandsCeramiteSentinelsDetachmentRulesFactionDetachment,
    IronHandsFirestormAssaultForceDetachmentRulesFactionDetachment,
    IronHandsGladiusTaskForceDetachmentRulesFactionDetachment,
    IronHandsHammerOfAverniiDetachmentRulesFactionDetachment,
    IronHandsHeadhunterTaskForceDetachmentRulesFactionDetachment,
    IronHandsIronstormSpearheadDetachmentRulesFactionDetachment,
    IronHandsLibrariusConclaveDetachmentRulesFactionDetachment,
    IronHandsOrbitalAssaultForceDetachmentRulesFactionDetachment,
    IronHandsStormlanceTaskForceDetachmentRulesFactionDetachment,
    IronHandsVanguardSpearheadDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
