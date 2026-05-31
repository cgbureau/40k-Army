import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `death_guard`.
 */

export const DeathGuardChampionsOfContagionDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("death_guard__champions_of_contagion_detachment"),
  rules_faction_id: rulesFactionId("death_guard"),
  detachment_id: detachmentId("champions_of_contagion_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const DeathGuardDeathLordsChosenDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("death_guard__death_lords_chosen_detachment"),
  rules_faction_id: rulesFactionId("death_guard"),
  detachment_id: detachmentId("death_lords_chosen_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const DeathGuardFlyblownHostDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("death_guard__flyblown_host_detachment"),
  rules_faction_id: rulesFactionId("death_guard"),
  detachment_id: detachmentId("flyblown_host_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const DeathGuardMortarionsHammerDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("death_guard__mortarions_hammer_detachment"),
  rules_faction_id: rulesFactionId("death_guard"),
  detachment_id: detachmentId("mortarions_hammer_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const DeathGuardShamblerotVectoriumDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("death_guard__shamblerot_vectorium_detachment"),
  rules_faction_id: rulesFactionId("death_guard"),
  detachment_id: detachmentId("shamblerot_vectorium_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const DeathGuardTallybandSummonersDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("death_guard__tallyband_summoners_detachment"),
  rules_faction_id: rulesFactionId("death_guard"),
  detachment_id: detachmentId("tallyband_summoners_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const DeathGuardVirulentVectoriumDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("death_guard__virulent_vectorium_detachment"),
  rules_faction_id: rulesFactionId("death_guard"),
  detachment_id: detachmentId("virulent_vectorium_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const deathGuardRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    DeathGuardChampionsOfContagionDetachmentRulesFactionDetachment,
    DeathGuardDeathLordsChosenDetachmentRulesFactionDetachment,
    DeathGuardFlyblownHostDetachmentRulesFactionDetachment,
    DeathGuardMortarionsHammerDetachmentRulesFactionDetachment,
    DeathGuardShamblerotVectoriumDetachmentRulesFactionDetachment,
    DeathGuardTallybandSummonersDetachmentRulesFactionDetachment,
    DeathGuardVirulentVectoriumDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
