import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `tyranids`.
 */

export const TyranidsAssimilationSwarmDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("tyranids__assimilation_swarm_detachment"),
  rules_faction_id: rulesFactionId("tyranids"),
  detachment_id: detachmentId("assimilation_swarm_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const TyranidsCrusherStampedeDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("tyranids__crusher_stampede_detachment"),
  rules_faction_id: rulesFactionId("tyranids"),
  detachment_id: detachmentId("crusher_stampede_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const TyranidsInvasionFleetDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("tyranids__invasion_fleet_detachment"),
  rules_faction_id: rulesFactionId("tyranids"),
  detachment_id: detachmentId("invasion_fleet_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const TyranidsSubterraneanAssaultDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("tyranids__subterranean_assault_detachment"),
  rules_faction_id: rulesFactionId("tyranids"),
  detachment_id: detachmentId("subterranean_assault_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const TyranidsSynapticNexusDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("tyranids__synaptic_nexus_detachment"),
  rules_faction_id: rulesFactionId("tyranids"),
  detachment_id: detachmentId("synaptic_nexus_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const TyranidsUnendingSwarmDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("tyranids__unending_swarm_detachment"),
  rules_faction_id: rulesFactionId("tyranids"),
  detachment_id: detachmentId("unending_swarm_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const TyranidsVanguardOnslaughtDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("tyranids__vanguard_onslaught_detachment"),
  rules_faction_id: rulesFactionId("tyranids"),
  detachment_id: detachmentId("vanguard_onslaught_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const TyranidsWarriorBioformOnslaughtDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("tyranids__warrior_bioform_onslaught_detachment"),
  rules_faction_id: rulesFactionId("tyranids"),
  detachment_id: detachmentId("warrior_bioform_onslaught_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const tyranidsRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    TyranidsAssimilationSwarmDetachmentRulesFactionDetachment,
    TyranidsCrusherStampedeDetachmentRulesFactionDetachment,
    TyranidsInvasionFleetDetachmentRulesFactionDetachment,
    TyranidsSubterraneanAssaultDetachmentRulesFactionDetachment,
    TyranidsSynapticNexusDetachmentRulesFactionDetachment,
    TyranidsUnendingSwarmDetachmentRulesFactionDetachment,
    TyranidsVanguardOnslaughtDetachmentRulesFactionDetachment,
    TyranidsWarriorBioformOnslaughtDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
