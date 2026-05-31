import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `white_scars`.
 */

export const SpearpointTaskForceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("spearpoint_task_force_detachment"),
  detachment_name: "Spearpoint Task Force Detachment",
  detachment_slug: "spearpoint_task_force_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const whiteScarsDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    SpearpointTaskForceDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
