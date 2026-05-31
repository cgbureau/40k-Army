import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `adeptus_custodes`.
 */

export const AuricChampionsDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("auric_champions_detachment"),
  detachment_name: "Auric Champions Detachment",
  detachment_slug: "auric_champions_detachment",
  rules_source_id: rulesSourceId("codex_adeptus_custodes_10e"),
};


export const LionsOfTheEmperorDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("lions_of_the_emperor_detachment"),
  detachment_name: "Lions of the Emperor Detachment",
  detachment_slug: "lions_of_the_emperor_detachment",
  rules_source_id: rulesSourceId("codex_adeptus_custodes_10e"),
};


export const NullMaidenVigilDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("null_maiden_vigil_detachment"),
  detachment_name: "Null Maiden Vigil Detachment",
  detachment_slug: "null_maiden_vigil_detachment",
  rules_source_id: rulesSourceId("codex_adeptus_custodes_10e"),
};


export const ShieldHostDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("shield_host_detachment"),
  detachment_name: "Shield Host Detachment",
  detachment_slug: "shield_host_detachment",
  rules_source_id: rulesSourceId("codex_adeptus_custodes_10e"),
};


export const SolarSpearheadDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("solar_spearhead_detachment"),
  detachment_name: "Solar Spearhead Detachment",
  detachment_slug: "solar_spearhead_detachment",
  rules_source_id: rulesSourceId("codex_adeptus_custodes_10e"),
};


export const TalonsOfTheEmperorDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("talons_of_the_emperor_detachment"),
  detachment_name: "Talons of the Emperor Detachment",
  detachment_slug: "talons_of_the_emperor_detachment",
  rules_source_id: rulesSourceId("codex_adeptus_custodes_10e"),
};


export const adeptusCustodesDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    AuricChampionsDetachmentDetachment,
    LionsOfTheEmperorDetachmentDetachment,
    NullMaidenVigilDetachmentDetachment,
    ShieldHostDetachmentDetachment,
    SolarSpearheadDetachmentDetachment,
    TalonsOfTheEmperorDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
