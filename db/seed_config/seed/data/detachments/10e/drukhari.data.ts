import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `drukhari`.
 */

export const CoveniteCoterieDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("covenite_coterie_detachment"),
  detachment_name: "Covenite Coterie Detachment",
  detachment_slug: "covenite_coterie_detachment",
  rules_source_id: rulesSourceId("codex_drukhari_10e"),
};


export const KabaliteCartelDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("kabalite_cartel_detachment"),
  detachment_name: "Kabalite Cartel Detachment",
  detachment_slug: "kabalite_cartel_detachment",
  rules_source_id: rulesSourceId("codex_drukhari_10e"),
};


export const RealspaceRaidersDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("realspace_raiders_detachment"),
  detachment_name: "Realspace Raiders Detachment",
  detachment_slug: "realspace_raiders_detachment",
  rules_source_id: rulesSourceId("codex_drukhari_10e"),
};


export const ReapersWagerDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("reapers_wager_detachment"),
  detachment_name: "Reaper's Wager Detachment",
  detachment_slug: "reapers_wager_detachment",
  rules_source_id: rulesSourceId("codex_drukhari_10e"),
};


export const SkysplinterAssaultDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("skysplinter_assault_detachment"),
  detachment_name: "Skysplinter Assault Detachment",
  detachment_slug: "skysplinter_assault_detachment",
  rules_source_id: rulesSourceId("codex_drukhari_10e"),
};


export const SpectacleOfSpiteDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("spectacle_of_spite_detachment"),
  detachment_name: "Spectacle of Spite Detachment",
  detachment_slug: "spectacle_of_spite_detachment",
  rules_source_id: rulesSourceId("codex_drukhari_10e"),
};


export const drukhariDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    CoveniteCoterieDetachmentDetachment,
    KabaliteCartelDetachmentDetachment,
    RealspaceRaidersDetachmentDetachment,
    ReapersWagerDetachmentDetachment,
    SkysplinterAssaultDetachmentDetachment,
    SpectacleOfSpiteDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
