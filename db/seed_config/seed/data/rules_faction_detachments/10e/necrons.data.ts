import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `necrons`.
 */

export const NecronsAnnihilationLegionDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("necrons__annihilation_legion_detachment"),
  rules_faction_id: rulesFactionId("necrons"),
  detachment_id: detachmentId("annihilation_legion_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const NecronsAwakenedDynastyDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("necrons__awakened_dynasty_detachment"),
  rules_faction_id: rulesFactionId("necrons"),
  detachment_id: detachmentId("awakened_dynasty_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const NecronsCanoptekCourtDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("necrons__canoptek_court_detachment"),
  rules_faction_id: rulesFactionId("necrons"),
  detachment_id: detachmentId("canoptek_court_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const NecronsCryptekConclaveDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("necrons__cryptek_conclave_detachment"),
  rules_faction_id: rulesFactionId("necrons"),
  detachment_id: detachmentId("cryptek_conclave_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const NecronsCursedLegionDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("necrons__cursed_legion_detachment"),
  rules_faction_id: rulesFactionId("necrons"),
  detachment_id: detachmentId("cursed_legion_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const NecronsHypercryptLegionDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("necrons__hypercrypt_legion_detachment"),
  rules_faction_id: rulesFactionId("necrons"),
  detachment_id: detachmentId("hypercrypt_legion_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const NecronsObeisancePhalanxDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("necrons__obeisance_phalanx_detachment"),
  rules_faction_id: rulesFactionId("necrons"),
  detachment_id: detachmentId("obeisance_phalanx_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const NecronsPantheonOfWoeDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("necrons__pantheon_of_woe_detachment"),
  rules_faction_id: rulesFactionId("necrons"),
  detachment_id: detachmentId("pantheon_of_woe_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const NecronsStarshatterArsenalDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("necrons__starshatter_arsenal_detachment"),
  rules_faction_id: rulesFactionId("necrons"),
  detachment_id: detachmentId("starshatter_arsenal_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const necronsRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    NecronsAnnihilationLegionDetachmentRulesFactionDetachment,
    NecronsAwakenedDynastyDetachmentRulesFactionDetachment,
    NecronsCanoptekCourtDetachmentRulesFactionDetachment,
    NecronsCryptekConclaveDetachmentRulesFactionDetachment,
    NecronsCursedLegionDetachmentRulesFactionDetachment,
    NecronsHypercryptLegionDetachmentRulesFactionDetachment,
    NecronsObeisancePhalanxDetachmentRulesFactionDetachment,
    NecronsPantheonOfWoeDetachmentRulesFactionDetachment,
    NecronsStarshatterArsenalDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
