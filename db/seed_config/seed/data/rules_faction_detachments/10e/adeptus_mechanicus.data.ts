import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `adeptus_mechanicus`.
 */

export const AdeptusMechanicusCohortCyberneticaDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("adeptus_mechanicus__cohort_cybernetica_detachment"),
  rules_faction_id: rulesFactionId("adeptus_mechanicus"),
  detachment_id: detachmentId("cohort_cybernetica_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AdeptusMechanicusDataPsalmConclaveDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("adeptus_mechanicus__data_psalm_conclave_detachment"),
  rules_faction_id: rulesFactionId("adeptus_mechanicus"),
  detachment_id: detachmentId("data_psalm_conclave_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AdeptusMechanicusEradicationCohortDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("adeptus_mechanicus__eradication_cohort_detachment"),
  rules_faction_id: rulesFactionId("adeptus_mechanicus"),
  detachment_id: detachmentId("eradication_cohort_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AdeptusMechanicusExploratorManipleDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("adeptus_mechanicus__explorator_maniple_detachment"),
  rules_faction_id: rulesFactionId("adeptus_mechanicus"),
  detachment_id: detachmentId("explorator_maniple_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AdeptusMechanicusHaloscreedBattleCladeDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("adeptus_mechanicus__haloscreed_battle_clade_detachment"),
  rules_faction_id: rulesFactionId("adeptus_mechanicus"),
  detachment_id: detachmentId("haloscreed_battle_clade_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AdeptusMechanicusRadZoneCorpsDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("adeptus_mechanicus__rad_zone_corps_detachment"),
  rules_faction_id: rulesFactionId("adeptus_mechanicus"),
  detachment_id: detachmentId("rad_zone_corps_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const AdeptusMechanicusSkitariiHunterCohortDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("adeptus_mechanicus__skitarii_hunter_cohort_detachment"),
  rules_faction_id: rulesFactionId("adeptus_mechanicus"),
  detachment_id: detachmentId("skitarii_hunter_cohort_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const adeptusMechanicusRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    AdeptusMechanicusCohortCyberneticaDetachmentRulesFactionDetachment,
    AdeptusMechanicusDataPsalmConclaveDetachmentRulesFactionDetachment,
    AdeptusMechanicusEradicationCohortDetachmentRulesFactionDetachment,
    AdeptusMechanicusExploratorManipleDetachmentRulesFactionDetachment,
    AdeptusMechanicusHaloscreedBattleCladeDetachmentRulesFactionDetachment,
    AdeptusMechanicusRadZoneCorpsDetachmentRulesFactionDetachment,
    AdeptusMechanicusSkitariiHunterCohortDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
