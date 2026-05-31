import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `grey_knights`.
 */

export const GreyKnightsAuguriumTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("grey_knights__augurium_task_force_detachment"),
  rules_faction_id: rulesFactionId("grey_knights"),
  detachment_id: detachmentId("augurium_task_force_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const GreyKnightsBanishersDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("grey_knights__banishers_detachment"),
  rules_faction_id: rulesFactionId("grey_knights"),
  detachment_id: detachmentId("banishers_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const GreyKnightsBrotherhoodStrikeDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("grey_knights__brotherhood_strike_detachment"),
  rules_faction_id: rulesFactionId("grey_knights"),
  detachment_id: detachmentId("brotherhood_strike_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const GreyKnightsHallowedConclaveDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("grey_knights__hallowed_conclave_detachment"),
  rules_faction_id: rulesFactionId("grey_knights"),
  detachment_id: detachmentId("hallowed_conclave_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const GreyKnightsSancticSpearheadDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("grey_knights__sanctic_spearhead_detachment"),
  rules_faction_id: rulesFactionId("grey_knights"),
  detachment_id: detachmentId("sanctic_spearhead_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const GreyKnightsWarpbaneTaskForceDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("grey_knights__warpbane_task_force_detachment"),
  rules_faction_id: rulesFactionId("grey_knights"),
  detachment_id: detachmentId("warpbane_task_force_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const greyKnightsRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    GreyKnightsAuguriumTaskForceDetachmentRulesFactionDetachment,
    GreyKnightsBanishersDetachmentRulesFactionDetachment,
    GreyKnightsBrotherhoodStrikeDetachmentRulesFactionDetachment,
    GreyKnightsHallowedConclaveDetachmentRulesFactionDetachment,
    GreyKnightsSancticSpearheadDetachmentRulesFactionDetachment,
    GreyKnightsWarpbaneTaskForceDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
