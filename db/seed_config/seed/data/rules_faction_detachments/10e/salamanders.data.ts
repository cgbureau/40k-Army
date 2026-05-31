import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `salamanders`.
 */

export const Salamanders1stCompanyTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("salamanders__1st_company_task_force_detachment"),
  rules_faction_id: rulesFactionId("salamanders"),
  detachment_id: detachmentId("1st_company_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const SalamandersAnvilSiegeForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("salamanders__anvil_siege_force_detachment"),
  rules_faction_id: rulesFactionId("salamanders"),
  detachment_id: detachmentId("anvil_siege_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const SalamandersArmouredSpeartipDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("salamanders__armoured_speartip_detachment"),
  rules_faction_id: rulesFactionId("salamanders"),
  detachment_id: detachmentId("armoured_speartip_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const SalamandersBastionTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("salamanders__bastion_task_force_detachment"),
  rules_faction_id: rulesFactionId("salamanders"),
  detachment_id: detachmentId("bastion_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const SalamandersCeramiteSentinelsDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("salamanders__ceramite_sentinels_detachment"),
  rules_faction_id: rulesFactionId("salamanders"),
  detachment_id: detachmentId("ceramite_sentinels_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const SalamandersFirestormAssaultForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("salamanders__firestorm_assault_force_detachment"),
  rules_faction_id: rulesFactionId("salamanders"),
  detachment_id: detachmentId("firestorm_assault_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const SalamandersForgefathersSeekersDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("salamanders__forgefathers_seekers_detachment"),
  rules_faction_id: rulesFactionId("salamanders"),
  detachment_id: detachmentId("forgefathers_seekers_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const SalamandersGladiusTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("salamanders__gladius_task_force_detachment"),
  rules_faction_id: rulesFactionId("salamanders"),
  detachment_id: detachmentId("gladius_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const SalamandersHeadhunterTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("salamanders__headhunter_task_force_detachment"),
  rules_faction_id: rulesFactionId("salamanders"),
  detachment_id: detachmentId("headhunter_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const SalamandersIronstormSpearheadDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("salamanders__ironstorm_spearhead_detachment"),
  rules_faction_id: rulesFactionId("salamanders"),
  detachment_id: detachmentId("ironstorm_spearhead_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const SalamandersLibrariusConclaveDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("salamanders__librarius_conclave_detachment"),
  rules_faction_id: rulesFactionId("salamanders"),
  detachment_id: detachmentId("librarius_conclave_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const SalamandersOrbitalAssaultForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("salamanders__orbital_assault_force_detachment"),
  rules_faction_id: rulesFactionId("salamanders"),
  detachment_id: detachmentId("orbital_assault_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const SalamandersStormlanceTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("salamanders__stormlance_task_force_detachment"),
  rules_faction_id: rulesFactionId("salamanders"),
  detachment_id: detachmentId("stormlance_task_force_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const SalamandersVanguardSpearheadDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("salamanders__vanguard_spearhead_detachment"),
  rules_faction_id: rulesFactionId("salamanders"),
  detachment_id: detachmentId("vanguard_spearhead_detachment"),
  detachment_access_type: "shared",
  effective_date: null,
  superseded_date: null,
};


export const salamandersRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    Salamanders1stCompanyTaskForceDetachmentRulesFactionDetachment,
    SalamandersAnvilSiegeForceDetachmentRulesFactionDetachment,
    SalamandersArmouredSpeartipDetachmentRulesFactionDetachment,
    SalamandersBastionTaskForceDetachmentRulesFactionDetachment,
    SalamandersCeramiteSentinelsDetachmentRulesFactionDetachment,
    SalamandersFirestormAssaultForceDetachmentRulesFactionDetachment,
    SalamandersForgefathersSeekersDetachmentRulesFactionDetachment,
    SalamandersGladiusTaskForceDetachmentRulesFactionDetachment,
    SalamandersHeadhunterTaskForceDetachmentRulesFactionDetachment,
    SalamandersIronstormSpearheadDetachmentRulesFactionDetachment,
    SalamandersLibrariusConclaveDetachmentRulesFactionDetachment,
    SalamandersOrbitalAssaultForceDetachmentRulesFactionDetachment,
    SalamandersStormlanceTaskForceDetachmentRulesFactionDetachment,
    SalamandersVanguardSpearheadDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
