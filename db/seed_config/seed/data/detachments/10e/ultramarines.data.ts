import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `ultramarines`.
 */

export const BladeOfUltramarDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("blade_of_ultramar_detachment"),
  detachment_name: "Blade of Ultramar Detachment",
  detachment_slug: "blade_of_ultramar_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const ReclamationForceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("reclamation_force_detachment"),
  detachment_name: "Reclamation Force Detachment",
  detachment_slug: "reclamation_force_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const ultramarinesDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    BladeOfUltramarDetachmentDetachment,
    ReclamationForceDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
