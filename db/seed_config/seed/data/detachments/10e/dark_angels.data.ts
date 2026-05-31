import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `dark_angels`.
 */

export const CompanyOfHuntersDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("company_of_hunters_detachment"),
  detachment_name: "Company of Hunters Detachment",
  detachment_slug: "company_of_hunters_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const InnerCircleTaskForceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("inner_circle_task_force_detachment"),
  detachment_name: "Inner Circle Task Force Detachment",
  detachment_slug: "inner_circle_task_force_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const LionsBladeTaskForceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("lions_blade_task_force_detachment"),
  detachment_name: "Lion's Blade Task Force Detachment",
  detachment_slug: "lions_blade_task_force_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const UnforgivenTaskForceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("unforgiven_task_force_detachment"),
  detachment_name: "Unforgiven Task Force Detachment",
  detachment_slug: "unforgiven_task_force_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const WrathOfTheRockDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("wrath_of_the_rock_detachment"),
  detachment_name: "Wrath of the Rock Detachment",
  detachment_slug: "wrath_of_the_rock_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const darkAngelsDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    CompanyOfHuntersDetachmentDetachment,
    InnerCircleTaskForceDetachmentDetachment,
    LionsBladeTaskForceDetachmentDetachment,
    UnforgivenTaskForceDetachmentDetachment,
    WrathOfTheRockDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
