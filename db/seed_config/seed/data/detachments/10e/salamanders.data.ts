import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `salamanders`.
 */

export const ForgefathersSeekersDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("forgefathers_seekers_detachment"),
  detachment_name: "Forgefather's Seekers Detachment",
  detachment_slug: "forgefathers_seekers_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const salamandersDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    ForgefathersSeekersDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
