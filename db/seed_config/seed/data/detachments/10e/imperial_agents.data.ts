import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `imperial_agents`.
 */

export const AlienHuntersOrdoXenosDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("alien_hunters_ordo_xenos_detachment"),
  detachment_name: "Alien Hunters (Ordo Xenos) Detachment",
  detachment_slug: "alien_hunters_ordo_xenos_detachment",
  rules_source_id: rulesSourceId("codex_imperial_agents_10e"),
};


export const DaemonHuntersOrdoMalleusDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("daemon_hunters_ordo_malleus_detachment"),
  detachment_name: "Daemon Hunters (Ordo Malleus) Detachment",
  detachment_slug: "daemon_hunters_ordo_malleus_detachment",
  rules_source_id: rulesSourceId("codex_imperial_agents_10e"),
};


export const ImperialisFleetDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("imperialis_fleet_detachment"),
  detachment_name: "Imperialis Fleet Detachment",
  detachment_slug: "imperialis_fleet_detachment",
  rules_source_id: rulesSourceId("codex_imperial_agents_10e"),
};


export const PurgationForceOrdoHereticusDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("purgation_force_ordo_hereticus_detachment"),
  detachment_name: "Purgation Force (Ordo Hereticus) Detachment",
  detachment_slug: "purgation_force_ordo_hereticus_detachment",
  rules_source_id: rulesSourceId("codex_imperial_agents_10e"),
};


export const VeiledBladeEliminationForceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("veiled_blade_elimination_force_detachment"),
  detachment_name: "Veiled Blade Elimination Force Detachment",
  detachment_slug: "veiled_blade_elimination_force_detachment",
  rules_source_id: rulesSourceId("codex_imperial_agents_10e"),
};


export const imperialAgentsDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    AlienHuntersOrdoXenosDetachmentDetachment,
    DaemonHuntersOrdoMalleusDetachmentDetachment,
    ImperialisFleetDetachmentDetachment,
    PurgationForceOrdoHereticusDetachmentDetachment,
    VeiledBladeEliminationForceDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
