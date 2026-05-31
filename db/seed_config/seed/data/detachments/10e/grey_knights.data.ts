import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `grey_knights`.
 */

export const AuguriumTaskForceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("augurium_task_force_detachment"),
  detachment_name: "Augurium Task Force Detachment",
  detachment_slug: "augurium_task_force_detachment",
  rules_source_id: rulesSourceId("codex_grey_knights_10e"),
};


export const BanishersDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("banishers_detachment"),
  detachment_name: "Banishers Detachment",
  detachment_slug: "banishers_detachment",
  rules_source_id: rulesSourceId("codex_grey_knights_10e"),
};


export const BrotherhoodStrikeDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("brotherhood_strike_detachment"),
  detachment_name: "Brotherhood Strike Detachment",
  detachment_slug: "brotherhood_strike_detachment",
  rules_source_id: rulesSourceId("codex_grey_knights_10e"),
};


export const HallowedConclaveDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("hallowed_conclave_detachment"),
  detachment_name: "Hallowed Conclave Detachment",
  detachment_slug: "hallowed_conclave_detachment",
  rules_source_id: rulesSourceId("codex_grey_knights_10e"),
};


export const SancticSpearheadDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("sanctic_spearhead_detachment"),
  detachment_name: "Sanctic Spearhead Detachment",
  detachment_slug: "sanctic_spearhead_detachment",
  rules_source_id: rulesSourceId("codex_grey_knights_10e"),
};


export const WarpbaneTaskForceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("warpbane_task_force_detachment"),
  detachment_name: "Warpbane Task Force Detachment",
  detachment_slug: "warpbane_task_force_detachment",
  rules_source_id: rulesSourceId("codex_grey_knights_10e"),
};


export const greyKnightsDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    AuguriumTaskForceDetachmentDetachment,
    BanishersDetachmentDetachment,
    BrotherhoodStrikeDetachmentDetachment,
    HallowedConclaveDetachmentDetachment,
    SancticSpearheadDetachmentDetachment,
    WarpbaneTaskForceDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
