import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `adeptus_mechanicus`.
 */

export const CohortCyberneticaDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("cohort_cybernetica_detachment"),
  detachment_name: "Cohort Cybernetica Detachment",
  detachment_slug: "cohort_cybernetica_detachment",
  rules_source_id: rulesSourceId("codex_adeptus_mechanicus_10e"),
};


export const DataPsalmConclaveDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("data_psalm_conclave_detachment"),
  detachment_name: "Data-psalm Conclave Detachment",
  detachment_slug: "data_psalm_conclave_detachment",
  rules_source_id: rulesSourceId("codex_adeptus_mechanicus_10e"),
};


export const EradicationCohortDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("eradication_cohort_detachment"),
  detachment_name: "Eradication Cohort Detachment",
  detachment_slug: "eradication_cohort_detachment",
  rules_source_id: rulesSourceId("codex_adeptus_mechanicus_10e"),
};


export const ExploratorManipleDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("explorator_maniple_detachment"),
  detachment_name: "Explorator Maniple Detachment",
  detachment_slug: "explorator_maniple_detachment",
  rules_source_id: rulesSourceId("codex_adeptus_mechanicus_10e"),
};


export const HaloscreedBattleCladeDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("haloscreed_battle_clade_detachment"),
  detachment_name: "Haloscreed Battleclade Detachment",
  detachment_slug: "haloscreed_battle_clade_detachment",
  rules_source_id: rulesSourceId("codex_adeptus_mechanicus_10e"),
};


export const RadZoneCorpsDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("rad_zone_corps_detachment"),
  detachment_name: "Rad-zone Corps Detachment",
  detachment_slug: "rad_zone_corps_detachment",
  rules_source_id: rulesSourceId("codex_adeptus_mechanicus_10e"),
};


export const SkitariiHunterCohortDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("skitarii_hunter_cohort_detachment"),
  detachment_name: "Skitarii Hunter Cohort Detachment",
  detachment_slug: "skitarii_hunter_cohort_detachment",
  rules_source_id: rulesSourceId("codex_adeptus_mechanicus_10e"),
};


export const adeptusMechanicusDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    CohortCyberneticaDetachmentDetachment,
    DataPsalmConclaveDetachmentDetachment,
    EradicationCohortDetachmentDetachment,
    ExploratorManipleDetachmentDetachment,
    HaloscreedBattleCladeDetachmentDetachment,
    RadZoneCorpsDetachmentDetachment,
    SkitariiHunterCohortDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
