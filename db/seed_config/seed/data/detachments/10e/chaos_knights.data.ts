import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `chaos_knights`.
 */

export const HelhuntLanceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("helhunt_lance_detachment"),
  detachment_name: "Helhunt Lance Detachment",
  detachment_slug: "helhunt_lance_detachment",
  rules_source_id: rulesSourceId("codex_chaos_knights_10e"),
};


export const HoundpackLanceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("houndpack_lance_detachment"),
  detachment_name: "Houndpack Lance Detachment",
  detachment_slug: "houndpack_lance_detachment",
  rules_source_id: rulesSourceId("codex_chaos_knights_10e"),
};


export const IconoclastFiefdomDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("iconoclast_fiefdom_detachment"),
  detachment_name: "Iconoclast Fiefdom Detachment",
  detachment_slug: "iconoclast_fiefdom_detachment",
  rules_source_id: rulesSourceId("codex_chaos_knights_10e"),
};


export const InfernalLanceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("infernal_lance_detachment"),
  detachment_name: "Infernal Lance Detachment",
  detachment_slug: "infernal_lance_detachment",
  rules_source_id: rulesSourceId("codex_chaos_knights_10e"),
};


export const LordsOfDreadDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("lords_of_dread_detachment"),
  detachment_name: "Lords of Dread Detachment",
  detachment_slug: "lords_of_dread_detachment",
  rules_source_id: rulesSourceId("codex_chaos_knights_10e"),
};


export const TraitorisLanceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("traitoris_lance_detachment"),
  detachment_name: "Traitoris Lance Detachment",
  detachment_slug: "traitoris_lance_detachment",
  rules_source_id: rulesSourceId("codex_chaos_knights_10e"),
};


export const chaosKnightsDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    HelhuntLanceDetachmentDetachment,
    HoundpackLanceDetachmentDetachment,
    IconoclastFiefdomDetachmentDetachment,
    InfernalLanceDetachmentDetachment,
    LordsOfDreadDetachmentDetachment,
    TraitorisLanceDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
