import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `genestealer_cults`.
 */

export const BiosancticBroodsurgeDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("biosanctic_broodsurge_detachment"),
  detachment_name: "Biosanctic Broodsurge Detachment",
  detachment_slug: "biosanctic_broodsurge_detachment",
  rules_source_id: rulesSourceId("codex_genestealer_cults_10e"),
};


export const BroodBrotherAuxiliaDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("brood_brother_auxilia_detachment"),
  detachment_name: "Brood Brother Auxilia Detachment",
  detachment_slug: "brood_brother_auxilia_detachment",
  rules_source_id: rulesSourceId("codex_genestealer_cults_10e"),
};


export const FinalDayDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("final_day_detachment"),
  detachment_name: "Final Day Detachment",
  detachment_slug: "final_day_detachment",
  rules_source_id: rulesSourceId("codex_genestealer_cults_10e"),
};


export const HostOfAscensionDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("host_of_ascension_detachment"),
  detachment_name: "Host of Ascension Detachment",
  detachment_slug: "host_of_ascension_detachment",
  rules_source_id: rulesSourceId("codex_genestealer_cults_10e"),
};


export const OutlanderClawDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("outlander_claw_detachment"),
  detachment_name: "Outlander Claw Detachment",
  detachment_slug: "outlander_claw_detachment",
  rules_source_id: rulesSourceId("codex_genestealer_cults_10e"),
};


export const XenocreedCongregationDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("xenocreed_congregation_detachment"),
  detachment_name: "Xenocreed Congregation Detachment",
  detachment_slug: "xenocreed_congregation_detachment",
  rules_source_id: rulesSourceId("codex_genestealer_cults_10e"),
};


export const genestealerCultsDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    BiosancticBroodsurgeDetachmentDetachment,
    BroodBrotherAuxiliaDetachmentDetachment,
    FinalDayDetachmentDetachment,
    HostOfAscensionDetachmentDetachment,
    OutlanderClawDetachmentDetachment,
    XenocreedCongregationDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
