import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `tyranids`.
 */

export const AssimilationSwarmDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("assimilation_swarm_detachment"),
  detachment_name: "Assimilation Swarm Detachment",
  detachment_slug: "assimilation_swarm_detachment",
  rules_source_id: rulesSourceId("codex_tyranids_10e"),
};


export const CrusherStampedeDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("crusher_stampede_detachment"),
  detachment_name: "Crusher Stampede Detachment",
  detachment_slug: "crusher_stampede_detachment",
  rules_source_id: rulesSourceId("codex_tyranids_10e"),
};


export const InvasionFleetDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("invasion_fleet_detachment"),
  detachment_name: "Invasion Fleet Detachment",
  detachment_slug: "invasion_fleet_detachment",
  rules_source_id: rulesSourceId("codex_tyranids_10e"),
};


export const SubterraneanAssaultDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("subterranean_assault_detachment"),
  detachment_name: "Subterranean Assault Detachment",
  detachment_slug: "subterranean_assault_detachment",
  rules_source_id: rulesSourceId("codex_tyranids_10e"),
};


export const SynapticNexusDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("synaptic_nexus_detachment"),
  detachment_name: "Synaptic Nexus Detachment",
  detachment_slug: "synaptic_nexus_detachment",
  rules_source_id: rulesSourceId("codex_tyranids_10e"),
};


export const UnendingSwarmDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("unending_swarm_detachment"),
  detachment_name: "Unending Swarm Detachment",
  detachment_slug: "unending_swarm_detachment",
  rules_source_id: rulesSourceId("codex_tyranids_10e"),
};


export const VanguardOnslaughtDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("vanguard_onslaught_detachment"),
  detachment_name: "Vanguard Onslaught Detachment",
  detachment_slug: "vanguard_onslaught_detachment",
  rules_source_id: rulesSourceId("codex_tyranids_10e"),
};


export const WarriorBioformOnslaughtDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("warrior_bioform_onslaught_detachment"),
  detachment_name: "Warrior Bioform Onslaught Detachment",
  detachment_slug: "warrior_bioform_onslaught_detachment",
  rules_source_id: rulesSourceId("codex_tyranids_10e"),
};


export const tyranidsDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    AssimilationSwarmDetachmentDetachment,
    CrusherStampedeDetachmentDetachment,
    InvasionFleetDetachmentDetachment,
    SubterraneanAssaultDetachmentDetachment,
    SynapticNexusDetachmentDetachment,
    UnendingSwarmDetachmentDetachment,
    VanguardOnslaughtDetachmentDetachment,
    WarriorBioformOnslaughtDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
