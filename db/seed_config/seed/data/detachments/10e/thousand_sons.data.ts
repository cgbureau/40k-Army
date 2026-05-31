import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `thousand_sons`.
 */

export const ChangehostOfDeceitDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("changehost_of_deceit_detachment"),
  detachment_name: "Changehost of Deceit Detachment",
  detachment_slug: "changehost_of_deceit_detachment",
  rules_source_id: rulesSourceId("codex_thousand_sons_10e"),
};


export const GrandCovenDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("grand_coven_detachment"),
  detachment_name: "Grand Coven Detachment",
  detachment_slug: "grand_coven_detachment",
  rules_source_id: rulesSourceId("codex_thousand_sons_10e"),
};


export const HexwarpThrallbandDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("hexwarp_thrallband_detachment"),
  detachment_name: "Hexwarp Thrallband Detachment",
  detachment_slug: "hexwarp_thrallband_detachment",
  rules_source_id: rulesSourceId("codex_thousand_sons_10e"),
};


export const RubricaePhalanxDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("rubricae_phalanx_detachment"),
  detachment_name: "Rubricae Phalanx Detachment",
  detachment_slug: "rubricae_phalanx_detachment",
  rules_source_id: rulesSourceId("codex_thousand_sons_10e"),
};


export const WarpforgedCabalDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("warpforged_cabal_detachment"),
  detachment_name: "Warpforged Cabal Detachment",
  detachment_slug: "warpforged_cabal_detachment",
  rules_source_id: rulesSourceId("codex_thousand_sons_10e"),
};


export const WarpmeldPactDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("warpmeld_pact_detachment"),
  detachment_name: "Warpmeld Pact Detachment",
  detachment_slug: "warpmeld_pact_detachment",
  rules_source_id: rulesSourceId("codex_thousand_sons_10e"),
};


export const thousandSonsDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    ChangehostOfDeceitDetachmentDetachment,
    GrandCovenDetachmentDetachment,
    HexwarpThrallbandDetachmentDetachment,
    RubricaePhalanxDetachmentDetachment,
    WarpforgedCabalDetachmentDetachment,
    WarpmeldPactDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
