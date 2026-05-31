import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `chaos_daemons`.
 */

export const ChaosDaemonsBloodLegionDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("chaos_daemons__blood_legion_detachment"),
  rules_faction_id: rulesFactionId("chaos_daemons"),
  detachment_id: detachmentId("blood_legion_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ChaosDaemonsDaemonicIncursionDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("chaos_daemons__daemonic_incursion_detachment"),
  rules_faction_id: rulesFactionId("chaos_daemons"),
  detachment_id: detachmentId("daemonic_incursion_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ChaosDaemonsLegionOfExcessDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("chaos_daemons__legion_of_excess_detachment"),
  rules_faction_id: rulesFactionId("chaos_daemons"),
  detachment_id: detachmentId("legion_of_excess_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ChaosDaemonsPlagueLegionDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("chaos_daemons__plague_legion_detachment"),
  rules_faction_id: rulesFactionId("chaos_daemons"),
  detachment_id: detachmentId("plague_legion_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ChaosDaemonsScintillatingLegionDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("chaos_daemons__scintillating_legion_detachment"),
  rules_faction_id: rulesFactionId("chaos_daemons"),
  detachment_id: detachmentId("scintillating_legion_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const ChaosDaemonsShadowLegionDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("chaos_daemons__shadow_legion_detachment"),
  rules_faction_id: rulesFactionId("chaos_daemons"),
  detachment_id: detachmentId("shadow_legion_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const chaosDaemonsRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    ChaosDaemonsBloodLegionDetachmentRulesFactionDetachment,
    ChaosDaemonsDaemonicIncursionDetachmentRulesFactionDetachment,
    ChaosDaemonsLegionOfExcessDetachmentRulesFactionDetachment,
    ChaosDaemonsPlagueLegionDetachmentRulesFactionDetachment,
    ChaosDaemonsScintillatingLegionDetachmentRulesFactionDetachment,
    ChaosDaemonsShadowLegionDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
