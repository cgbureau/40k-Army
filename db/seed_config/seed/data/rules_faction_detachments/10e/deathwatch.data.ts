import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `deathwatch`.
 */

export const Deathwatch1stCompanyTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("deathwatch__1st_company_task_force_detachment"),
  rules_faction_id: rulesFactionId("deathwatch"),
  detachment_id: detachmentId("1st_company_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const DeathwatchAnvilSiegeForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("deathwatch__anvil_siege_force_detachment"),
  rules_faction_id: rulesFactionId("deathwatch"),
  detachment_id: detachmentId("anvil_siege_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const DeathwatchArmouredSpeartipDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("deathwatch__armoured_speartip_detachment"),
  rules_faction_id: rulesFactionId("deathwatch"),
  detachment_id: detachmentId("armoured_speartip_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const DeathwatchBastionTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("deathwatch__bastion_task_force_detachment"),
  rules_faction_id: rulesFactionId("deathwatch"),
  detachment_id: detachmentId("bastion_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const DeathwatchBlackSpearTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("deathwatch__black_spear_task_force_detachment"),
  rules_faction_id: rulesFactionId("deathwatch"),
  detachment_id: detachmentId("black_spear_task_force_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const DeathwatchCeramiteSentinelsDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("deathwatch__ceramite_sentinels_detachment"),
  rules_faction_id: rulesFactionId("deathwatch"),
  detachment_id: detachmentId("ceramite_sentinels_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const DeathwatchFirestormAssaultForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("deathwatch__firestorm_assault_force_detachment"),
  rules_faction_id: rulesFactionId("deathwatch"),
  detachment_id: detachmentId("firestorm_assault_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const DeathwatchGladiusTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("deathwatch__gladius_task_force_detachment"),
  rules_faction_id: rulesFactionId("deathwatch"),
  detachment_id: detachmentId("gladius_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const DeathwatchHeadhunterTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("deathwatch__headhunter_task_force_detachment"),
  rules_faction_id: rulesFactionId("deathwatch"),
  detachment_id: detachmentId("headhunter_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const DeathwatchIronstormSpearheadDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("deathwatch__ironstorm_spearhead_detachment"),
  rules_faction_id: rulesFactionId("deathwatch"),
  detachment_id: detachmentId("ironstorm_spearhead_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const DeathwatchLibrariusConclaveDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("deathwatch__librarius_conclave_detachment"),
  rules_faction_id: rulesFactionId("deathwatch"),
  detachment_id: detachmentId("librarius_conclave_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const DeathwatchOrbitalAssaultForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("deathwatch__orbital_assault_force_detachment"),
  rules_faction_id: rulesFactionId("deathwatch"),
  detachment_id: detachmentId("orbital_assault_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const DeathwatchStormlanceTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("deathwatch__stormlance_task_force_detachment"),
  rules_faction_id: rulesFactionId("deathwatch"),
  detachment_id: detachmentId("stormlance_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const DeathwatchVanguardSpearheadDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("deathwatch__vanguard_spearhead_detachment"),
  rules_faction_id: rulesFactionId("deathwatch"),
  detachment_id: detachmentId("vanguard_spearhead_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const deathwatchRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    Deathwatch1stCompanyTaskForceDetachmentRulesFactionDetachment,
    DeathwatchAnvilSiegeForceDetachmentRulesFactionDetachment,
    DeathwatchArmouredSpeartipDetachmentRulesFactionDetachment,
    DeathwatchBastionTaskForceDetachmentRulesFactionDetachment,
    DeathwatchBlackSpearTaskForceDetachmentRulesFactionDetachment,
    DeathwatchCeramiteSentinelsDetachmentRulesFactionDetachment,
    DeathwatchFirestormAssaultForceDetachmentRulesFactionDetachment,
    DeathwatchGladiusTaskForceDetachmentRulesFactionDetachment,
    DeathwatchHeadhunterTaskForceDetachmentRulesFactionDetachment,
    DeathwatchIronstormSpearheadDetachmentRulesFactionDetachment,
    DeathwatchLibrariusConclaveDetachmentRulesFactionDetachment,
    DeathwatchOrbitalAssaultForceDetachmentRulesFactionDetachment,
    DeathwatchStormlanceTaskForceDetachmentRulesFactionDetachment,
    DeathwatchVanguardSpearheadDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
