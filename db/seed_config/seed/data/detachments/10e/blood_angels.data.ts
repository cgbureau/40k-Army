import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `blood_angels`.
 */

export const Seed1stCompanyTaskForceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("1st_company_task_force_detachment"),
  detachment_name: "1st Company Task Force Detachment",
  detachment_slug: "1st_company_task_force_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const AngelicInheritorsDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("angelic_inheritors_detachment"),
  detachment_name: "Angelic Inheritors Detachment",
  detachment_slug: "angelic_inheritors_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const LiberatorAssaultGroupDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("liberator_assault_group_detachment"),
  detachment_name: "Liberator Assault Group Detachment",
  detachment_slug: "liberator_assault_group_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const LibrariusConclaveDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("librarius_conclave_detachment"),
  detachment_name: "Librarius Conclave Detachment",
  detachment_slug: "librarius_conclave_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const RageCursedOnslaughtDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("rage_cursed_onslaught_detachment"),
  detachment_name: "Rage-Cursed Onslaught Detachment",
  detachment_slug: "rage_cursed_onslaught_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const TheAngelicHostDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("the_angelic_host_detachment"),
  detachment_name: "The Angelic Host Detachment",
  detachment_slug: "the_angelic_host_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const TheLostBrethrenDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("the_lost_brethren_detachment"),
  detachment_name: "The Lost Brethren Detachment",
  detachment_slug: "the_lost_brethren_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const bloodAngelsDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    Seed1stCompanyTaskForceDetachmentDetachment,
    AngelicInheritorsDetachmentDetachment,
    LiberatorAssaultGroupDetachmentDetachment,
    LibrariusConclaveDetachmentDetachment,
    RageCursedOnslaughtDetachmentDetachment,
    TheAngelicHostDetachmentDetachment,
    TheLostBrethrenDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
