import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `deathwatch`.
 */

export const BlackSpearTaskForceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("black_spear_task_force_detachment"),
  detachment_name: "Black Spear Task Force Detachment",
  detachment_slug: "black_spear_task_force_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const deathwatchDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    BlackSpearTaskForceDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
