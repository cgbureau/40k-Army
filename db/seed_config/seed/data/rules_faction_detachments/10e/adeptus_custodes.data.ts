import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `adeptus_custodes`.
 */

export const AdeptusCustodesAuricChampionsDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("adeptus_custodes__auric_champions_detachment"),
  rules_faction_id: rulesFactionId("adeptus_custodes"),
  detachment_id: detachmentId("auric_champions_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AdeptusCustodesLionsOfTheEmperorDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("adeptus_custodes__lions_of_the_emperor_detachment"),
  rules_faction_id: rulesFactionId("adeptus_custodes"),
  detachment_id: detachmentId("lions_of_the_emperor_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AdeptusCustodesNullMaidenVigilDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("adeptus_custodes__null_maiden_vigil_detachment"),
  rules_faction_id: rulesFactionId("adeptus_custodes"),
  detachment_id: detachmentId("null_maiden_vigil_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AdeptusCustodesShieldHostDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("adeptus_custodes__shield_host_detachment"),
  rules_faction_id: rulesFactionId("adeptus_custodes"),
  detachment_id: detachmentId("shield_host_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AdeptusCustodesSolarSpearheadDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("adeptus_custodes__solar_spearhead_detachment"),
  rules_faction_id: rulesFactionId("adeptus_custodes"),
  detachment_id: detachmentId("solar_spearhead_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AdeptusCustodesTalonsOfTheEmperorDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("adeptus_custodes__talons_of_the_emperor_detachment"),
  rules_faction_id: rulesFactionId("adeptus_custodes"),
  detachment_id: detachmentId("talons_of_the_emperor_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const adeptusCustodesRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    AdeptusCustodesAuricChampionsDetachmentRulesFactionDetachment,
    AdeptusCustodesLionsOfTheEmperorDetachmentRulesFactionDetachment,
    AdeptusCustodesNullMaidenVigilDetachmentRulesFactionDetachment,
    AdeptusCustodesShieldHostDetachmentRulesFactionDetachment,
    AdeptusCustodesSolarSpearheadDetachmentRulesFactionDetachment,
    AdeptusCustodesTalonsOfTheEmperorDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
