import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `imperial_agents`.
 */

export const ImperialAgentsAlienHuntersOrdoXenosDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("imperial_agents__alien_hunters_ordo_xenos_detachment"),
  rules_faction_id: rulesFactionId("imperial_agents"),
  detachment_id: detachmentId("alien_hunters_ordo_xenos_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ImperialAgentsDaemonHuntersOrdoMalleusDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("imperial_agents__daemon_hunters_ordo_malleus_detachment"),
  rules_faction_id: rulesFactionId("imperial_agents"),
  detachment_id: detachmentId("daemon_hunters_ordo_malleus_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ImperialAgentsImperialisFleetDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("imperial_agents__imperialis_fleet_detachment"),
  rules_faction_id: rulesFactionId("imperial_agents"),
  detachment_id: detachmentId("imperialis_fleet_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ImperialAgentsPurgationForceOrdoHereticusDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("imperial_agents__purgation_force_ordo_hereticus_detachment"),
  rules_faction_id: rulesFactionId("imperial_agents"),
  detachment_id: detachmentId("purgation_force_ordo_hereticus_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ImperialAgentsVeiledBladeEliminationForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("imperial_agents__veiled_blade_elimination_force_detachment"),
  rules_faction_id: rulesFactionId("imperial_agents"),
  detachment_id: detachmentId("veiled_blade_elimination_force_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const imperialAgentsRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    ImperialAgentsAlienHuntersOrdoXenosDetachmentRulesFactionDetachment,
    ImperialAgentsDaemonHuntersOrdoMalleusDetachmentRulesFactionDetachment,
    ImperialAgentsImperialisFleetDetachmentRulesFactionDetachment,
    ImperialAgentsPurgationForceOrdoHereticusDetachmentRulesFactionDetachment,
    ImperialAgentsVeiledBladeEliminationForceDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
