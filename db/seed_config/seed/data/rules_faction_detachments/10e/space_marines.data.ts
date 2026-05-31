import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `space_marines`.
 */

export const SpaceMarines1stCompanyTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("space_marines__1st_company_task_force_detachment"),
  rules_faction_id: rulesFactionId("space_marines"),
  detachment_id: detachmentId("1st_company_task_force_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const SpaceMarinesAnvilSiegeForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("space_marines__anvil_siege_force_detachment"),
  rules_faction_id: rulesFactionId("space_marines"),
  detachment_id: detachmentId("anvil_siege_force_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const SpaceMarinesArmouredSpeartipDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("space_marines__armoured_speartip_detachment"),
  rules_faction_id: rulesFactionId("space_marines"),
  detachment_id: detachmentId("armoured_speartip_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const SpaceMarinesBastionTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("space_marines__bastion_task_force_detachment"),
  rules_faction_id: rulesFactionId("space_marines"),
  detachment_id: detachmentId("bastion_task_force_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const SpaceMarinesCeramiteSentinelsDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("space_marines__ceramite_sentinels_detachment"),
  rules_faction_id: rulesFactionId("space_marines"),
  detachment_id: detachmentId("ceramite_sentinels_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const SpaceMarinesFirestormAssaultForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("space_marines__firestorm_assault_force_detachment"),
  rules_faction_id: rulesFactionId("space_marines"),
  detachment_id: detachmentId("firestorm_assault_force_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const SpaceMarinesGladiusTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("space_marines__gladius_task_force_detachment"),
  rules_faction_id: rulesFactionId("space_marines"),
  detachment_id: detachmentId("gladius_task_force_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const SpaceMarinesHeadhunterTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("space_marines__headhunter_task_force_detachment"),
  rules_faction_id: rulesFactionId("space_marines"),
  detachment_id: detachmentId("headhunter_task_force_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const SpaceMarinesIronstormSpearheadDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("space_marines__ironstorm_spearhead_detachment"),
  rules_faction_id: rulesFactionId("space_marines"),
  detachment_id: detachmentId("ironstorm_spearhead_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const SpaceMarinesLibrariusConclaveDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("space_marines__librarius_conclave_detachment"),
  rules_faction_id: rulesFactionId("space_marines"),
  detachment_id: detachmentId("librarius_conclave_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const SpaceMarinesOrbitalAssaultForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("space_marines__orbital_assault_force_detachment"),
  rules_faction_id: rulesFactionId("space_marines"),
  detachment_id: detachmentId("orbital_assault_force_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const SpaceMarinesStormlanceTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("space_marines__stormlance_task_force_detachment"),
  rules_faction_id: rulesFactionId("space_marines"),
  detachment_id: detachmentId("stormlance_task_force_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const SpaceMarinesVanguardSpearheadDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("space_marines__vanguard_spearhead_detachment"),
  rules_faction_id: rulesFactionId("space_marines"),
  detachment_id: detachmentId("vanguard_spearhead_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const spaceMarinesRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    SpaceMarines1stCompanyTaskForceDetachmentRulesFactionDetachment,
    SpaceMarinesAnvilSiegeForceDetachmentRulesFactionDetachment,
    SpaceMarinesArmouredSpeartipDetachmentRulesFactionDetachment,
    SpaceMarinesBastionTaskForceDetachmentRulesFactionDetachment,
    SpaceMarinesCeramiteSentinelsDetachmentRulesFactionDetachment,
    SpaceMarinesFirestormAssaultForceDetachmentRulesFactionDetachment,
    SpaceMarinesGladiusTaskForceDetachmentRulesFactionDetachment,
    SpaceMarinesHeadhunterTaskForceDetachmentRulesFactionDetachment,
    SpaceMarinesIronstormSpearheadDetachmentRulesFactionDetachment,
    SpaceMarinesLibrariusConclaveDetachmentRulesFactionDetachment,
    SpaceMarinesOrbitalAssaultForceDetachmentRulesFactionDetachment,
    SpaceMarinesStormlanceTaskForceDetachmentRulesFactionDetachment,
    SpaceMarinesVanguardSpearheadDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
