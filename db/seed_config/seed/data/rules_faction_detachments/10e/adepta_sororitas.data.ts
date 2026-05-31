import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `adepta_sororitas`.
 */

export const AdeptaSororitasArmyOfFaithDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("adepta_sororitas__army_of_faith_detachment"),
  rules_faction_id: rulesFactionId("adepta_sororitas"),
  detachment_id: detachmentId("army_of_faith_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AdeptaSororitasBringersOfFlameDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("adepta_sororitas__bringers_of_flame_detachment"),
  rules_faction_id: rulesFactionId("adepta_sororitas"),
  detachment_id: detachmentId("bringers_of_flame_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AdeptaSororitasChampionsOfFaithDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("adepta_sororitas__champions_of_faith_detachment"),
  rules_faction_id: rulesFactionId("adepta_sororitas"),
  detachment_id: detachmentId("champions_of_faith_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AdeptaSororitasHallowedMartyrsDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("adepta_sororitas__hallowed_martyrs_detachment"),
  rules_faction_id: rulesFactionId("adepta_sororitas"),
  detachment_id: detachmentId("hallowed_martyrs_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AdeptaSororitasPenitentHostDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("adepta_sororitas__penitent_host_detachment"),
  rules_faction_id: rulesFactionId("adepta_sororitas"),
  detachment_id: detachmentId("penitent_host_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const adeptaSororitasRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    AdeptaSororitasArmyOfFaithDetachmentRulesFactionDetachment,
    AdeptaSororitasBringersOfFlameDetachmentRulesFactionDetachment,
    AdeptaSororitasChampionsOfFaithDetachmentRulesFactionDetachment,
    AdeptaSororitasHallowedMartyrsDetachmentRulesFactionDetachment,
    AdeptaSororitasPenitentHostDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
