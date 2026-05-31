import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `imperial_fists`.
 */

export const EmperorsShieldDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("emperors_shield_detachment"),
  detachment_name: "Emperor's Shield Detachment",
  detachment_slug: "emperors_shield_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const imperialFistsDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    EmperorsShieldDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
