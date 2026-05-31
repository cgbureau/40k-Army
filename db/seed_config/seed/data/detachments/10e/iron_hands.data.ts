import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `iron_hands`.
 */

export const HammerOfAverniiDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("hammer_of_avernii_detachment"),
  detachment_name: "Hammer of Avernii Detachment",
  detachment_slug: "hammer_of_avernii_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const ironHandsDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    HammerOfAverniiDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
