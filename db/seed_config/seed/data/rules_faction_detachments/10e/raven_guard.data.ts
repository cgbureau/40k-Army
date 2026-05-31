import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `raven_guard`.
 */

export const RavenGuard1stCompanyTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("raven_guard__1st_company_task_force_detachment"),
  rules_faction_id: rulesFactionId("raven_guard"),
  detachment_id: detachmentId("1st_company_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const RavenGuardAnvilSiegeForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("raven_guard__anvil_siege_force_detachment"),
  rules_faction_id: rulesFactionId("raven_guard"),
  detachment_id: detachmentId("anvil_siege_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const RavenGuardArmouredSpeartipDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("raven_guard__armoured_speartip_detachment"),
  rules_faction_id: rulesFactionId("raven_guard"),
  detachment_id: detachmentId("armoured_speartip_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const RavenGuardBastionTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("raven_guard__bastion_task_force_detachment"),
  rules_faction_id: rulesFactionId("raven_guard"),
  detachment_id: detachmentId("bastion_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const RavenGuardCeramiteSentinelsDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("raven_guard__ceramite_sentinels_detachment"),
  rules_faction_id: rulesFactionId("raven_guard"),
  detachment_id: detachmentId("ceramite_sentinels_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const RavenGuardFirestormAssaultForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("raven_guard__firestorm_assault_force_detachment"),
  rules_faction_id: rulesFactionId("raven_guard"),
  detachment_id: detachmentId("firestorm_assault_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const RavenGuardGladiusTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("raven_guard__gladius_task_force_detachment"),
  rules_faction_id: rulesFactionId("raven_guard"),
  detachment_id: detachmentId("gladius_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const RavenGuardHeadhunterTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("raven_guard__headhunter_task_force_detachment"),
  rules_faction_id: rulesFactionId("raven_guard"),
  detachment_id: detachmentId("headhunter_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const RavenGuardIronstormSpearheadDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("raven_guard__ironstorm_spearhead_detachment"),
  rules_faction_id: rulesFactionId("raven_guard"),
  detachment_id: detachmentId("ironstorm_spearhead_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const RavenGuardLibrariusConclaveDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("raven_guard__librarius_conclave_detachment"),
  rules_faction_id: rulesFactionId("raven_guard"),
  detachment_id: detachmentId("librarius_conclave_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const RavenGuardOrbitalAssaultForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("raven_guard__orbital_assault_force_detachment"),
  rules_faction_id: rulesFactionId("raven_guard"),
  detachment_id: detachmentId("orbital_assault_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const RavenGuardShadowmarkTalonDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("raven_guard__shadowmark_talon_detachment"),
  rules_faction_id: rulesFactionId("raven_guard"),
  detachment_id: detachmentId("shadowmark_talon_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const RavenGuardStormlanceTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("raven_guard__stormlance_task_force_detachment"),
  rules_faction_id: rulesFactionId("raven_guard"),
  detachment_id: detachmentId("stormlance_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const RavenGuardVanguardSpearheadDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("raven_guard__vanguard_spearhead_detachment"),
  rules_faction_id: rulesFactionId("raven_guard"),
  detachment_id: detachmentId("vanguard_spearhead_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const ravenGuardRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    RavenGuard1stCompanyTaskForceDetachmentRulesFactionDetachment,
    RavenGuardAnvilSiegeForceDetachmentRulesFactionDetachment,
    RavenGuardArmouredSpeartipDetachmentRulesFactionDetachment,
    RavenGuardBastionTaskForceDetachmentRulesFactionDetachment,
    RavenGuardCeramiteSentinelsDetachmentRulesFactionDetachment,
    RavenGuardFirestormAssaultForceDetachmentRulesFactionDetachment,
    RavenGuardGladiusTaskForceDetachmentRulesFactionDetachment,
    RavenGuardHeadhunterTaskForceDetachmentRulesFactionDetachment,
    RavenGuardIronstormSpearheadDetachmentRulesFactionDetachment,
    RavenGuardLibrariusConclaveDetachmentRulesFactionDetachment,
    RavenGuardOrbitalAssaultForceDetachmentRulesFactionDetachment,
    RavenGuardShadowmarkTalonDetachmentRulesFactionDetachment,
    RavenGuardStormlanceTaskForceDetachmentRulesFactionDetachment,
    RavenGuardVanguardSpearheadDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
