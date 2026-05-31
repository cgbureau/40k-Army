import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `raven_guard`.
 */

export const ShadowmarkTalonDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("shadowmark_talon_detachment"),
  detachment_name: "Shadowmark Talon Detachment",
  detachment_slug: "shadowmark_talon_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const ravenGuardDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    ShadowmarkTalonDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
