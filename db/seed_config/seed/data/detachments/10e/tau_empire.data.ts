import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `tau_empire`.
 */

export const AuxiliaryCadreDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("auxiliary_cadre_detachment"),
  detachment_name: "Auxiliary Cadre Detachment",
  detachment_slug: "auxiliary_cadre_detachment",
  rules_source_id: rulesSourceId("codex_tau_empire_10e"),
};


export const ExperimentalPrototypeCadreDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("experimental_prototype_cadre_detachment"),
  detachment_name: "Experimental Prototype Cadre Detachment",
  detachment_slug: "experimental_prototype_cadre_detachment",
  rules_source_id: rulesSourceId("codex_tau_empire_10e"),
};


export const KauyonDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("kauyon_detachment"),
  detachment_name: "Kauyon Detachment",
  detachment_slug: "kauyon_detachment",
  rules_source_id: rulesSourceId("codex_tau_empire_10e"),
};


export const KrootHuntingPackDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("kroot_hunting_pack_detachment"),
  detachment_name: "Kroot Hunting Pack Detachment",
  detachment_slug: "kroot_hunting_pack_detachment",
  rules_source_id: rulesSourceId("codex_tau_empire_10e"),
};


export const MontkaDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("montka_detachment"),
  detachment_name: "Mont'ka Detachment",
  detachment_slug: "montka_detachment",
  rules_source_id: rulesSourceId("codex_tau_empire_10e"),
};


export const RetaliationCadreDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("retaliation_cadre_detachment"),
  detachment_name: "Retaliation Cadre Detachment",
  detachment_slug: "retaliation_cadre_detachment",
  rules_source_id: rulesSourceId("codex_tau_empire_10e"),
};


export const tauEmpireDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    AuxiliaryCadreDetachmentDetachment,
    ExperimentalPrototypeCadreDetachmentDetachment,
    KauyonDetachmentDetachment,
    KrootHuntingPackDetachmentDetachment,
    MontkaDetachmentDetachment,
    RetaliationCadreDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
