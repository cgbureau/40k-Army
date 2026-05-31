import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `aeldari`.
 */

export const AeldariArmouredWarhostDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("aeldari__armoured_warhost_detachment"),
  rules_faction_id: rulesFactionId("aeldari"),
  detachment_id: detachmentId("armoured_warhost_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AeldariAspectHostDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("aeldari__aspect_host_detachment"),
  rules_faction_id: rulesFactionId("aeldari"),
  detachment_id: detachmentId("aspect_host_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AeldariCorsairCoterieDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("aeldari__corsair_coterie_detachment"),
  rules_faction_id: rulesFactionId("aeldari"),
  detachment_id: detachmentId("corsair_coterie_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AeldariDevotedOfYnneadDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("aeldari__devoted_of_ynnead_detachment"),
  rules_faction_id: rulesFactionId("aeldari"),
  detachment_id: detachmentId("devoted_of_ynnead_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AeldariEldritchRaidersDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("aeldari__eldritch_raiders_detachment"),
  rules_faction_id: rulesFactionId("aeldari"),
  detachment_id: detachmentId("eldritch_raiders_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AeldariGhostsOfTheWebwayDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("aeldari__ghosts_of_the_webway_detachment"),
  rules_faction_id: rulesFactionId("aeldari"),
  detachment_id: detachmentId("ghosts_of_the_webway_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AeldariGuardianBattlehostDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("aeldari__guardian_battlehost_detachment"),
  rules_faction_id: rulesFactionId("aeldari"),
  detachment_id: detachmentId("guardian_battlehost_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AeldariSeerCouncilDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("aeldari__seer_council_detachment"),
  rules_faction_id: rulesFactionId("aeldari"),
  detachment_id: detachmentId("seer_council_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AeldariSerpentsBroodDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("aeldari__serpents_brood_detachment"),
  rules_faction_id: rulesFactionId("aeldari"),
  detachment_id: detachmentId("serpents_brood_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AeldariSpiritConclaveDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("aeldari__spirit_conclave_detachment"),
  rules_faction_id: rulesFactionId("aeldari"),
  detachment_id: detachmentId("spirit_conclave_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AeldariWarhostDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("aeldari__warhost_detachment"),
  rules_faction_id: rulesFactionId("aeldari"),
  detachment_id: detachmentId("warhost_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AeldariWindriderHostDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("aeldari__windrider_host_detachment"),
  rules_faction_id: rulesFactionId("aeldari"),
  detachment_id: detachmentId("windrider_host_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const aeldariRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    AeldariArmouredWarhostDetachmentRulesFactionDetachment,
    AeldariAspectHostDetachmentRulesFactionDetachment,
    AeldariCorsairCoterieDetachmentRulesFactionDetachment,
    AeldariDevotedOfYnneadDetachmentRulesFactionDetachment,
    AeldariEldritchRaidersDetachmentRulesFactionDetachment,
    AeldariGhostsOfTheWebwayDetachmentRulesFactionDetachment,
    AeldariGuardianBattlehostDetachmentRulesFactionDetachment,
    AeldariSeerCouncilDetachmentRulesFactionDetachment,
    AeldariSerpentsBroodDetachmentRulesFactionDetachment,
    AeldariSpiritConclaveDetachmentRulesFactionDetachment,
    AeldariWarhostDetachmentRulesFactionDetachment,
    AeldariWindriderHostDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
