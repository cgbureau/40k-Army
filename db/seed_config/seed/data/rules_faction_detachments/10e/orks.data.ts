import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `orks`.
 */

export const OrksBlitzBrigadeDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("orks__blitz_brigade_detachment"),
  rules_faction_id: rulesFactionId("orks"),
  detachment_id: detachmentId("blitz_brigade_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const OrksBullyBoyzDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("orks__bully_boyz_detachment"),
  rules_faction_id: rulesFactionId("orks"),
  detachment_id: detachmentId("bully_boyz_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const OrksDaBigHuntDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("orks__da_big_hunt_detachment"),
  rules_faction_id: rulesFactionId("orks"),
  detachment_id: detachmentId("da_big_hunt_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const OrksDreadMobDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("orks__dread_mob_detachment"),
  rules_faction_id: rulesFactionId("orks"),
  detachment_id: detachmentId("dread_mob_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const OrksFreebooterKrewDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("orks__freebooter_krew_detachment"),
  rules_faction_id: rulesFactionId("orks"),
  detachment_id: detachmentId("freebooter_krew_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const OrksGreenTideDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("orks__green_tide_detachment"),
  rules_faction_id: rulesFactionId("orks"),
  detachment_id: detachmentId("green_tide_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const OrksKultOfSpeedDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("orks__kult_of_speed_detachment"),
  rules_faction_id: rulesFactionId("orks"),
  detachment_id: detachmentId("kult_of_speed_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const OrksMoreDakkaDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("orks__more_dakka_detachment"),
  rules_faction_id: rulesFactionId("orks"),
  detachment_id: detachmentId("more_dakka_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const OrksSpeedwaaaghDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("orks__speedwaaagh_detachment"),
  rules_faction_id: rulesFactionId("orks"),
  detachment_id: detachmentId("speedwaaagh_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const OrksTaktikalBrigadeDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("orks__taktikal_brigade_detachment"),
  rules_faction_id: rulesFactionId("orks"),
  detachment_id: detachmentId("taktikal_brigade_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const OrksWarHordeDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("orks__war_horde_detachment"),
  rules_faction_id: rulesFactionId("orks"),
  detachment_id: detachmentId("war_horde_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const orksRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    OrksBlitzBrigadeDetachmentRulesFactionDetachment,
    OrksBullyBoyzDetachmentRulesFactionDetachment,
    OrksDaBigHuntDetachmentRulesFactionDetachment,
    OrksDreadMobDetachmentRulesFactionDetachment,
    OrksFreebooterKrewDetachmentRulesFactionDetachment,
    OrksGreenTideDetachmentRulesFactionDetachment,
    OrksKultOfSpeedDetachmentRulesFactionDetachment,
    OrksMoreDakkaDetachmentRulesFactionDetachment,
    OrksSpeedwaaaghDetachmentRulesFactionDetachment,
    OrksTaktikalBrigadeDetachmentRulesFactionDetachment,
    OrksWarHordeDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
