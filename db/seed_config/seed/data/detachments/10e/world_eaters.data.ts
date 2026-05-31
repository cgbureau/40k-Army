import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `world_eaters`.
 */

export const BerzerkerWarbandDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("berzerker_warband_detachment"),
  detachment_name: "Berzerker Warband Detachment",
  detachment_slug: "berzerker_warband_detachment",
  rules_source_id: rulesSourceId("faction_pack_world_eaters_10e_v1_1"),
};


export const CultOfBloodDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("cult_of_blood_detachment"),
  detachment_name: "Cult of Blood Detachment",
  detachment_slug: "cult_of_blood_detachment",
  rules_source_id: rulesSourceId("faction_pack_world_eaters_10e_v1_1"),
};


export const GoretrackOnslaughtDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("goretrack_onslaught_detachment"),
  detachment_name: "Goretrack Onslaught Detachment",
  detachment_slug: "goretrack_onslaught_detachment",
  rules_source_id: rulesSourceId("faction_pack_world_eaters_10e_v1_1"),
};


export const KhorneDaemonkinDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("khorne_daemonkin_detachment"),
  detachment_name: "Khorne Daemonkin Detachment",
  detachment_slug: "khorne_daemonkin_detachment",
  rules_source_id: rulesSourceId("faction_pack_world_eaters_10e_v1_1"),
};


export const PossessedSlaughterbandDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("possessed_slaughterband_detachment"),
  detachment_name: "Possessed Slaughterband Detachment",
  detachment_slug: "possessed_slaughterband_detachment",
  rules_source_id: rulesSourceId("faction_pack_world_eaters_10e_v1_1"),
};


export const VesselsOfWrathDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("vessels_of_wrath_detachment"),
  detachment_name: "Vessels of Wrath Detachment",
  detachment_slug: "vessels_of_wrath_detachment",
  rules_source_id: rulesSourceId("faction_pack_world_eaters_10e_v1_1"),
};


export const worldEatersDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    BerzerkerWarbandDetachmentDetachment,
    CultOfBloodDetachmentDetachment,
    GoretrackOnslaughtDetachmentDetachment,
    KhorneDaemonkinDetachmentDetachment,
    PossessedSlaughterbandDetachmentDetachment,
    VesselsOfWrathDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
