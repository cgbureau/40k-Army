import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `chaos_daemons`.
 */

export const BloodLegionDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("blood_legion_detachment"),
  detachment_name: "Blood Legion Detachment",
  detachment_slug: "blood_legion_detachment",
  rules_source_id: rulesSourceId("faction_pack_chaos_daemons_10e_v1_2"),
};


export const DaemonicIncursionDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("daemonic_incursion_detachment"),
  detachment_name: "Daemonic Incursion Detachment",
  detachment_slug: "daemonic_incursion_detachment",
  rules_source_id: rulesSourceId("faction_pack_chaos_space_marines_10e_v1_6"),
};


export const LegionOfExcessDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("legion_of_excess_detachment"),
  detachment_name: "Legion of Excess Detachment",
  detachment_slug: "legion_of_excess_detachment",
  rules_source_id: rulesSourceId("faction_pack_chaos_daemons_10e_v1_2"),
};


export const PlagueLegionDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("plague_legion_detachment"),
  detachment_name: "Plague Legion Detachment",
  detachment_slug: "plague_legion_detachment",
  rules_source_id: rulesSourceId("faction_pack_chaos_space_marines_10e_v1_6"),
};


export const ScintillatingLegionDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("scintillating_legion_detachment"),
  detachment_name: "Scintillating Legion Detachment",
  detachment_slug: "scintillating_legion_detachment",
  rules_source_id: rulesSourceId("faction_pack_chaos_space_marines_10e_v1_6"),
};


export const ShadowLegionDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("shadow_legion_detachment"),
  detachment_name: "Shadow Legion Detachment",
  detachment_slug: "shadow_legion_detachment",
  rules_source_id: rulesSourceId("faction_pack_chaos_daemons_10e_v1_2"),
};


export const chaosDaemonsDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    BloodLegionDetachmentDetachment,
    DaemonicIncursionDetachmentDetachment,
    LegionOfExcessDetachmentDetachment,
    PlagueLegionDetachmentDetachment,
    ScintillatingLegionDetachmentDetachment,
    ShadowLegionDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
