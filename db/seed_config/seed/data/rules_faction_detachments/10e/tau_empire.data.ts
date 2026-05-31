import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `tau_empire`.
 */

export const TauEmpireAuxiliaryCadreDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("tau_empire__auxiliary_cadre_detachment"),
  rules_faction_id: rulesFactionId("tau_empire"),
  detachment_id: detachmentId("auxiliary_cadre_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const TauEmpireExperimentalPrototypeCadreDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("tau_empire__experimental_prototype_cadre_detachment"),
  rules_faction_id: rulesFactionId("tau_empire"),
  detachment_id: detachmentId("experimental_prototype_cadre_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const TauEmpireKauyonDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("tau_empire__kauyon_detachment"),
  rules_faction_id: rulesFactionId("tau_empire"),
  detachment_id: detachmentId("kauyon_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const TauEmpireKrootHuntingPackDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("tau_empire__kroot_hunting_pack_detachment"),
  rules_faction_id: rulesFactionId("tau_empire"),
  detachment_id: detachmentId("kroot_hunting_pack_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const TauEmpireMontkaDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("tau_empire__montka_detachment"),
  rules_faction_id: rulesFactionId("tau_empire"),
  detachment_id: detachmentId("montka_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const TauEmpireRetaliationCadreDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("tau_empire__retaliation_cadre_detachment"),
  rules_faction_id: rulesFactionId("tau_empire"),
  detachment_id: detachmentId("retaliation_cadre_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const tauEmpireRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    TauEmpireAuxiliaryCadreDetachmentRulesFactionDetachment,
    TauEmpireExperimentalPrototypeCadreDetachmentRulesFactionDetachment,
    TauEmpireKauyonDetachmentRulesFactionDetachment,
    TauEmpireKrootHuntingPackDetachmentRulesFactionDetachment,
    TauEmpireMontkaDetachmentRulesFactionDetachment,
    TauEmpireRetaliationCadreDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
