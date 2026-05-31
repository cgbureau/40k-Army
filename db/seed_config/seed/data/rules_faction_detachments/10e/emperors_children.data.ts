import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `emperors_children`.
 */

export const EmperorsChildrenCarnivalOfExcessDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("emperors_children__carnival_of_excess_detachment"),
  rules_faction_id: rulesFactionId("emperors_children"),
  detachment_id: detachmentId("carnival_of_excess_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const EmperorsChildrenCoterieOfTheConceitedDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("emperors_children__coterie_of_the_conceited_detachment"),
  rules_faction_id: rulesFactionId("emperors_children"),
  detachment_id: detachmentId("coterie_of_the_conceited_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const EmperorsChildrenCourtOfThePhoenicianDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("emperors_children__court_of_the_phoenician_detachment"),
  rules_faction_id: rulesFactionId("emperors_children"),
  detachment_id: detachmentId("court_of_the_phoenician_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const EmperorsChildrenMercurialHostDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("emperors_children__mercurial_host_detachment"),
  rules_faction_id: rulesFactionId("emperors_children"),
  detachment_id: detachmentId("mercurial_host_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const EmperorsChildrenPeerlessBladesmenDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("emperors_children__peerless_bladesmen_detachment"),
  rules_faction_id: rulesFactionId("emperors_children"),
  detachment_id: detachmentId("peerless_bladesmen_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const EmperorsChildrenRapidEviscerationDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("emperors_children__rapid_evisceration_detachment"),
  rules_faction_id: rulesFactionId("emperors_children"),
  detachment_id: detachmentId("rapid_evisceration_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const EmperorsChildrenSlaaneshsChosenDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("emperors_children__slaaneshs_chosen_detachment"),
  rules_faction_id: rulesFactionId("emperors_children"),
  detachment_id: detachmentId("slaaneshs_chosen_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const emperorsChildrenRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    EmperorsChildrenCarnivalOfExcessDetachmentRulesFactionDetachment,
    EmperorsChildrenCoterieOfTheConceitedDetachmentRulesFactionDetachment,
    EmperorsChildrenCourtOfThePhoenicianDetachmentRulesFactionDetachment,
    EmperorsChildrenMercurialHostDetachmentRulesFactionDetachment,
    EmperorsChildrenPeerlessBladesmenDetachmentRulesFactionDetachment,
    EmperorsChildrenRapidEviscerationDetachmentRulesFactionDetachment,
    EmperorsChildrenSlaaneshsChosenDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
