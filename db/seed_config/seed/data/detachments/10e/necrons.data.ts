import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `necrons`.
 */

export const AnnihilationLegionDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("annihilation_legion_detachment"),
  detachment_name: "Annihilation Legion Detachment",
  detachment_slug: "annihilation_legion_detachment",
  rules_source_id: rulesSourceId("codex_necrons_10e"),
};


export const AwakenedDynastyDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("awakened_dynasty_detachment"),
  detachment_name: "Awakened Dynasty Detachment",
  detachment_slug: "awakened_dynasty_detachment",
  rules_source_id: rulesSourceId("codex_necrons_10e"),
};


export const CanoptekCourtDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("canoptek_court_detachment"),
  detachment_name: "Canoptek Court Detachment",
  detachment_slug: "canoptek_court_detachment",
  rules_source_id: rulesSourceId("codex_necrons_10e"),
};


export const CryptekConclaveDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("cryptek_conclave_detachment"),
  detachment_name: "Cryptek Conclave Detachment",
  detachment_slug: "cryptek_conclave_detachment",
  rules_source_id: rulesSourceId("codex_necrons_10e"),
};


export const CursedLegionDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("cursed_legion_detachment"),
  detachment_name: "Cursed Legion Detachment",
  detachment_slug: "cursed_legion_detachment",
  rules_source_id: rulesSourceId("codex_necrons_10e"),
};


export const HypercryptLegionDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("hypercrypt_legion_detachment"),
  detachment_name: "Hypercrypt Legion Detachment",
  detachment_slug: "hypercrypt_legion_detachment",
  rules_source_id: rulesSourceId("codex_necrons_10e"),
};


export const ObeisancePhalanxDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("obeisance_phalanx_detachment"),
  detachment_name: "Obeisance Phalanx Detachment",
  detachment_slug: "obeisance_phalanx_detachment",
  rules_source_id: rulesSourceId("codex_necrons_10e"),
};


export const PantheonOfWoeDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("pantheon_of_woe_detachment"),
  detachment_name: "Pantheon of Woe Detachment",
  detachment_slug: "pantheon_of_woe_detachment",
  rules_source_id: rulesSourceId("codex_necrons_10e"),
};


export const StarshatterArsenalDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("starshatter_arsenal_detachment"),
  detachment_name: "Starshatter Arsenal Detachment",
  detachment_slug: "starshatter_arsenal_detachment",
  rules_source_id: rulesSourceId("codex_necrons_10e"),
};


export const necronsDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    AnnihilationLegionDetachmentDetachment,
    AwakenedDynastyDetachmentDetachment,
    CanoptekCourtDetachmentDetachment,
    CryptekConclaveDetachmentDetachment,
    CursedLegionDetachmentDetachment,
    HypercryptLegionDetachmentDetachment,
    ObeisancePhalanxDetachmentDetachment,
    PantheonOfWoeDetachmentDetachment,
    StarshatterArsenalDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
