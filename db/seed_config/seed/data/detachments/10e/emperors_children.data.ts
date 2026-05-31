import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `emperors_children`.
 */

export const CarnivalOfExcessDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("carnival_of_excess_detachment"),
  detachment_name: "Carnival of Excess Detachment",
  detachment_slug: "carnival_of_excess_detachment",
  rules_source_id: rulesSourceId("codex_emperors_children_10e"),
};


export const CoterieOfTheConceitedDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("coterie_of_the_conceited_detachment"),
  detachment_name: "Coterie of the Conceited Detachment",
  detachment_slug: "coterie_of_the_conceited_detachment",
  rules_source_id: rulesSourceId("codex_emperors_children_10e"),
};


export const CourtOfThePhoenicianDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("court_of_the_phoenician_detachment"),
  detachment_name: "Court of the Phoenician Detachment",
  detachment_slug: "court_of_the_phoenician_detachment",
  rules_source_id: rulesSourceId("codex_emperors_children_10e"),
};


export const MercurialHostDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("mercurial_host_detachment"),
  detachment_name: "Mercurial Host Detachment",
  detachment_slug: "mercurial_host_detachment",
  rules_source_id: rulesSourceId("codex_emperors_children_10e"),
};


export const PeerlessBladesmenDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("peerless_bladesmen_detachment"),
  detachment_name: "Peerless Bladesmen Detachment",
  detachment_slug: "peerless_bladesmen_detachment",
  rules_source_id: rulesSourceId("codex_emperors_children_10e"),
};


export const RapidEviscerationDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("rapid_evisceration_detachment"),
  detachment_name: "Rapid Evisceration Detachment",
  detachment_slug: "rapid_evisceration_detachment",
  rules_source_id: rulesSourceId("codex_emperors_children_10e"),
};


export const SlaaneshsChosenDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("slaaneshs_chosen_detachment"),
  detachment_name: "Slaanesh's Chosen Detachment",
  detachment_slug: "slaaneshs_chosen_detachment",
  rules_source_id: rulesSourceId("codex_emperors_children_10e"),
};


export const emperorsChildrenDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    CarnivalOfExcessDetachmentDetachment,
    CoterieOfTheConceitedDetachmentDetachment,
    CourtOfThePhoenicianDetachmentDetachment,
    MercurialHostDetachmentDetachment,
    PeerlessBladesmenDetachmentDetachment,
    RapidEviscerationDetachmentDetachment,
    SlaaneshsChosenDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
