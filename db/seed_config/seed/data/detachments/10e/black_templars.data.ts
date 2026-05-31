import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `black_templars`.
 */

export const AnvilSiegeForceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("anvil_siege_force_detachment"),
  detachment_name: "Anvil Siege Force Detachment",
  detachment_slug: "anvil_siege_force_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const ArmouredSpeartipDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("armoured_speartip_detachment"),
  detachment_name: "Armoured Speartip Detachment",
  detachment_slug: "armoured_speartip_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const BastionTaskForceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("bastion_task_force_detachment"),
  detachment_name: "Bastion Task Force Detachment",
  detachment_slug: "bastion_task_force_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const CeramiteSentinelsDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("ceramite_sentinels_detachment"),
  detachment_name: "Ceramite Sentinels Detachment",
  detachment_slug: "ceramite_sentinels_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const CompanionsOfVehemenceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("companions_of_vehemence_detachment"),
  detachment_name: "Companions of Vehemence Detachment",
  detachment_slug: "companions_of_vehemence_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const FirestormAssaultForceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("firestorm_assault_force_detachment"),
  detachment_name: "Firestorm Assault Force Detachment",
  detachment_slug: "firestorm_assault_force_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const GladiusTaskForceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("gladius_task_force_detachment"),
  detachment_name: "Gladius Task Force Detachment",
  detachment_slug: "gladius_task_force_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const GodhammerAssaultForceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("godhammer_assault_force_detachment"),
  detachment_name: "Godhammer Assault Force Detachment",
  detachment_slug: "godhammer_assault_force_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const HeadhunterTaskForceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("headhunter_task_force_detachment"),
  detachment_name: "Headhunter Task Force Detachment",
  detachment_slug: "headhunter_task_force_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const IronstormSpearheadDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("ironstorm_spearhead_detachment"),
  detachment_name: "Ironstorm Spearhead Detachment",
  detachment_slug: "ironstorm_spearhead_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const OrbitalAssaultForceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("orbital_assault_force_detachment"),
  detachment_name: "Orbital Assault Force Detachment",
  detachment_slug: "orbital_assault_force_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const StormlanceTaskForceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("stormlance_task_force_detachment"),
  detachment_name: "Stormlance Task Force Detachment",
  detachment_slug: "stormlance_task_force_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const VanguardSpearheadDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("vanguard_spearhead_detachment"),
  detachment_name: "Vanguard Spearhead Detachment",
  detachment_slug: "vanguard_spearhead_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const VindicationTaskForceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("vindication_task_force_detachment"),
  detachment_name: "Vindication Task Force Detachment",
  detachment_slug: "vindication_task_force_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const WrathfulProcessionDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("wrathful_procession_detachment"),
  detachment_name: "Wrathful Procession Detachment",
  detachment_slug: "wrathful_procession_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const blackTemplarsDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    AnvilSiegeForceDetachmentDetachment,
    ArmouredSpeartipDetachmentDetachment,
    BastionTaskForceDetachmentDetachment,
    CeramiteSentinelsDetachmentDetachment,
    CompanionsOfVehemenceDetachmentDetachment,
    FirestormAssaultForceDetachmentDetachment,
    GladiusTaskForceDetachmentDetachment,
    GodhammerAssaultForceDetachmentDetachment,
    HeadhunterTaskForceDetachmentDetachment,
    IronstormSpearheadDetachmentDetachment,
    OrbitalAssaultForceDetachmentDetachment,
    StormlanceTaskForceDetachmentDetachment,
    VanguardSpearheadDetachmentDetachment,
    VindicationTaskForceDetachmentDetachment,
    WrathfulProcessionDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
