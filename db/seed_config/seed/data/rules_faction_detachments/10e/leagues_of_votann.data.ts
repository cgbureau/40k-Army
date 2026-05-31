import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `leagues_of_votann`.
 */

export const LeaguesOfVotannBrandfastOathbandDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("leagues_of_votann__brandfast_oathband_detachment"),
  rules_faction_id: rulesFactionId("leagues_of_votann"),
  detachment_id: detachmentId("brandfast_oathband_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const LeaguesOfVotannDalveAssaultShiftDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("leagues_of_votann__dalve_assault_shift_detachment"),
  rules_faction_id: rulesFactionId("leagues_of_votann"),
  detachment_id: detachmentId("dalve_assault_shift_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const LeaguesOfVotannHearthbandDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("leagues_of_votann__hearthband_detachment"),
  rules_faction_id: rulesFactionId("leagues_of_votann"),
  detachment_id: detachmentId("hearthband_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const LeaguesOfVotannHearthfyreArsenalDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("leagues_of_votann__hearthfyre_arsenal_detachment"),
  rules_faction_id: rulesFactionId("leagues_of_votann"),
  detachment_id: detachmentId("hearthfyre_arsenal_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const LeaguesOfVotannMercenaryOathbandDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("leagues_of_votann__mercenary_oathband_detachment"),
  rules_faction_id: rulesFactionId("leagues_of_votann"),
  detachment_id: detachmentId("mercenary_oathband_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const LeaguesOfVotannNeedgardOathbandDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("leagues_of_votann__needgard_oathband_detachment"),
  rules_faction_id: rulesFactionId("leagues_of_votann"),
  detachment_id: detachmentId("needgard_oathband_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const LeaguesOfVotannPersecutionProspectDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("leagues_of_votann__persecution_prospect_detachment"),
  rules_faction_id: rulesFactionId("leagues_of_votann"),
  detachment_id: detachmentId("persecution_prospect_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const leaguesOfVotannRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    LeaguesOfVotannBrandfastOathbandDetachmentRulesFactionDetachment,
    LeaguesOfVotannDalveAssaultShiftDetachmentRulesFactionDetachment,
    LeaguesOfVotannHearthbandDetachmentRulesFactionDetachment,
    LeaguesOfVotannHearthfyreArsenalDetachmentRulesFactionDetachment,
    LeaguesOfVotannMercenaryOathbandDetachmentRulesFactionDetachment,
    LeaguesOfVotannNeedgardOathbandDetachmentRulesFactionDetachment,
    LeaguesOfVotannPersecutionProspectDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
