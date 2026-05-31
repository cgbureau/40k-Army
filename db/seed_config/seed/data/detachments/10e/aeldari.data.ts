import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `aeldari`.
 */

export const ArmouredWarhostDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("armoured_warhost_detachment"),
  detachment_name: "Armoured Warhost Detachment",
  detachment_slug: "armoured_warhost_detachment",
  rules_source_id: rulesSourceId("codex_aeldari_10e"),
};


export const AspectHostDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("aspect_host_detachment"),
  detachment_name: "Aspect Host Detachment",
  detachment_slug: "aspect_host_detachment",
  rules_source_id: rulesSourceId("codex_aeldari_10e"),
};


export const CorsairCoterieDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("corsair_coterie_detachment"),
  detachment_name: "Corsair Coterie Detachment",
  detachment_slug: "corsair_coterie_detachment",
  rules_source_id: rulesSourceId("codex_aeldari_10e"),
};


export const DevotedOfYnneadDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("devoted_of_ynnead_detachment"),
  detachment_name: "Devoted of Ynnead Detachment",
  detachment_slug: "devoted_of_ynnead_detachment",
  rules_source_id: rulesSourceId("codex_aeldari_10e"),
};


export const EldritchRaidersDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("eldritch_raiders_detachment"),
  detachment_name: "Eldritch Raiders Detachment",
  detachment_slug: "eldritch_raiders_detachment",
  rules_source_id: rulesSourceId("codex_aeldari_10e"),
};


export const GhostsOfTheWebwayDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("ghosts_of_the_webway_detachment"),
  detachment_name: "Ghosts of the Webway Detachment",
  detachment_slug: "ghosts_of_the_webway_detachment",
  rules_source_id: rulesSourceId("codex_aeldari_10e"),
};


export const GuardianBattlehostDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("guardian_battlehost_detachment"),
  detachment_name: "Guardian Battlehost Detachment",
  detachment_slug: "guardian_battlehost_detachment",
  rules_source_id: rulesSourceId("codex_aeldari_10e"),
};


export const SeerCouncilDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("seer_council_detachment"),
  detachment_name: "Seer Council Detachment",
  detachment_slug: "seer_council_detachment",
  rules_source_id: rulesSourceId("codex_aeldari_10e"),
};


export const SerpentsBroodDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("serpents_brood_detachment"),
  detachment_name: "Serpent's Brood Detachment",
  detachment_slug: "serpents_brood_detachment",
  rules_source_id: rulesSourceId("codex_aeldari_10e"),
};


export const SpiritConclaveDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("spirit_conclave_detachment"),
  detachment_name: "Spirit Conclave Detachment",
  detachment_slug: "spirit_conclave_detachment",
  rules_source_id: rulesSourceId("codex_aeldari_10e"),
};


export const WarhostDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("warhost_detachment"),
  detachment_name: "Warhost Detachment",
  detachment_slug: "warhost_detachment",
  rules_source_id: rulesSourceId("codex_aeldari_10e"),
};


export const WindriderHostDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("windrider_host_detachment"),
  detachment_name: "Windrider Host Detachment",
  detachment_slug: "windrider_host_detachment",
  rules_source_id: rulesSourceId("codex_aeldari_10e"),
};


export const aeldariDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    ArmouredWarhostDetachmentDetachment,
    AspectHostDetachmentDetachment,
    CorsairCoterieDetachmentDetachment,
    DevotedOfYnneadDetachmentDetachment,
    EldritchRaidersDetachmentDetachment,
    GhostsOfTheWebwayDetachmentDetachment,
    GuardianBattlehostDetachmentDetachment,
    SeerCouncilDetachmentDetachment,
    SerpentsBroodDetachmentDetachment,
    SpiritConclaveDetachmentDetachment,
    WarhostDetachmentDetachment,
    WindriderHostDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
