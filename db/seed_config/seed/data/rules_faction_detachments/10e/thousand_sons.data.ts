import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `thousand_sons`.
 */

export const ThousandSonsChangehostOfDeceitDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("thousand_sons__changehost_of_deceit_detachment"),
  rules_faction_id: rulesFactionId("thousand_sons"),
  detachment_id: detachmentId("changehost_of_deceit_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ThousandSonsGrandCovenDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("thousand_sons__grand_coven_detachment"),
  rules_faction_id: rulesFactionId("thousand_sons"),
  detachment_id: detachmentId("grand_coven_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ThousandSonsHexwarpThrallbandDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("thousand_sons__hexwarp_thrallband_detachment"),
  rules_faction_id: rulesFactionId("thousand_sons"),
  detachment_id: detachmentId("hexwarp_thrallband_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ThousandSonsRubricaePhalanxDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("thousand_sons__rubricae_phalanx_detachment"),
  rules_faction_id: rulesFactionId("thousand_sons"),
  detachment_id: detachmentId("rubricae_phalanx_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ThousandSonsWarpforgedCabalDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("thousand_sons__warpforged_cabal_detachment"),
  rules_faction_id: rulesFactionId("thousand_sons"),
  detachment_id: detachmentId("warpforged_cabal_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ThousandSonsWarpmeldPactDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("thousand_sons__warpmeld_pact_detachment"),
  rules_faction_id: rulesFactionId("thousand_sons"),
  detachment_id: detachmentId("warpmeld_pact_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const thousandSonsRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    ThousandSonsChangehostOfDeceitDetachmentRulesFactionDetachment,
    ThousandSonsGrandCovenDetachmentRulesFactionDetachment,
    ThousandSonsHexwarpThrallbandDetachmentRulesFactionDetachment,
    ThousandSonsRubricaePhalanxDetachmentRulesFactionDetachment,
    ThousandSonsWarpforgedCabalDetachmentRulesFactionDetachment,
    ThousandSonsWarpmeldPactDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
