import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `adepta_sororitas`.
 */

export const ArmyOfFaithDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("army_of_faith_detachment"),
  detachment_name: "Army of Faith Detachment",
  detachment_slug: "army_of_faith_detachment",
  rules_source_id: rulesSourceId("codex_adepta_sororitas_10e"),
};


export const BringersOfFlameDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("bringers_of_flame_detachment"),
  detachment_name: "Bringers of Flame Detachment",
  detachment_slug: "bringers_of_flame_detachment",
  rules_source_id: rulesSourceId("codex_adepta_sororitas_10e"),
};


export const ChampionsOfFaithDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("champions_of_faith_detachment"),
  detachment_name: "Champions of Faith Detachment",
  detachment_slug: "champions_of_faith_detachment",
  rules_source_id: rulesSourceId("codex_adepta_sororitas_10e"),
};


export const HallowedMartyrsDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("hallowed_martyrs_detachment"),
  detachment_name: "Hallowed Martyrs Detachment",
  detachment_slug: "hallowed_martyrs_detachment",
  rules_source_id: rulesSourceId("codex_adepta_sororitas_10e"),
};


export const PenitentHostDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("penitent_host_detachment"),
  detachment_name: "Penitent Host Detachment",
  detachment_slug: "penitent_host_detachment",
  rules_source_id: rulesSourceId("codex_adepta_sororitas_10e"),
};


export const adeptaSororitasDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    ArmyOfFaithDetachmentDetachment,
    BringersOfFlameDetachmentDetachment,
    ChampionsOfFaithDetachmentDetachment,
    HallowedMartyrsDetachmentDetachment,
    PenitentHostDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
