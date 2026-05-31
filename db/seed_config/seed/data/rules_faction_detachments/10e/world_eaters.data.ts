import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `world_eaters`.
 */

export const WorldEatersBerzerkerWarbandDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("world_eaters__berzerker_warband_detachment"),
  rules_faction_id: rulesFactionId("world_eaters"),
  detachment_id: detachmentId("berzerker_warband_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const WorldEatersCultOfBloodDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("world_eaters__cult_of_blood_detachment"),
  rules_faction_id: rulesFactionId("world_eaters"),
  detachment_id: detachmentId("cult_of_blood_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const WorldEatersGoretrackOnslaughtDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("world_eaters__goretrack_onslaught_detachment"),
  rules_faction_id: rulesFactionId("world_eaters"),
  detachment_id: detachmentId("goretrack_onslaught_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const WorldEatersKhorneDaemonkinDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("world_eaters__khorne_daemonkin_detachment"),
  rules_faction_id: rulesFactionId("world_eaters"),
  detachment_id: detachmentId("khorne_daemonkin_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const WorldEatersPossessedSlaughterbandDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("world_eaters__possessed_slaughterband_detachment"),
  rules_faction_id: rulesFactionId("world_eaters"),
  detachment_id: detachmentId("possessed_slaughterband_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const WorldEatersVesselsOfWrathDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("world_eaters__vessels_of_wrath_detachment"),
  rules_faction_id: rulesFactionId("world_eaters"),
  detachment_id: detachmentId("vessels_of_wrath_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const worldEatersRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    WorldEatersBerzerkerWarbandDetachmentRulesFactionDetachment,
    WorldEatersCultOfBloodDetachmentRulesFactionDetachment,
    WorldEatersGoretrackOnslaughtDetachmentRulesFactionDetachment,
    WorldEatersKhorneDaemonkinDetachmentRulesFactionDetachment,
    WorldEatersPossessedSlaughterbandDetachmentRulesFactionDetachment,
    WorldEatersVesselsOfWrathDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
