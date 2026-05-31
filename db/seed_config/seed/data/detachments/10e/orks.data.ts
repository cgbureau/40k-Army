import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `orks`.
 */

export const BlitzBrigadeDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("blitz_brigade_detachment"),
  detachment_name: "Blitz Brigade Detachment",
  detachment_slug: "blitz_brigade_detachment",
  rules_source_id: rulesSourceId("codex_orks_10e"),
};


export const BullyBoyzDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("bully_boyz_detachment"),
  detachment_name: "Bully Boyz Detachment",
  detachment_slug: "bully_boyz_detachment",
  rules_source_id: rulesSourceId("codex_orks_10e"),
};


export const DaBigHuntDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("da_big_hunt_detachment"),
  detachment_name: "Da Big Hunt Detachment",
  detachment_slug: "da_big_hunt_detachment",
  rules_source_id: rulesSourceId("codex_orks_10e"),
};


export const DreadMobDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("dread_mob_detachment"),
  detachment_name: "Dread Mob Detachment",
  detachment_slug: "dread_mob_detachment",
  rules_source_id: rulesSourceId("codex_orks_10e"),
};


export const FreebooterKrewDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("freebooter_krew_detachment"),
  detachment_name: "Freebooter Krew Detachment",
  detachment_slug: "freebooter_krew_detachment",
  rules_source_id: rulesSourceId("codex_orks_10e"),
};


export const GreenTideDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("green_tide_detachment"),
  detachment_name: "Green Tide Detachment",
  detachment_slug: "green_tide_detachment",
  rules_source_id: rulesSourceId("codex_orks_10e"),
};


export const KultOfSpeedDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("kult_of_speed_detachment"),
  detachment_name: "Kult of Speed Detachment",
  detachment_slug: "kult_of_speed_detachment",
  rules_source_id: rulesSourceId("codex_orks_10e"),
};


export const MoreDakkaDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("more_dakka_detachment"),
  detachment_name: "More Dakka! Detachment",
  detachment_slug: "more_dakka_detachment",
  rules_source_id: rulesSourceId("codex_orks_10e"),
};


export const SpeedwaaaghDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("speedwaaagh_detachment"),
  detachment_name: "Speedwaaagh! Detachment",
  detachment_slug: "speedwaaagh_detachment",
  rules_source_id: rulesSourceId("codex_orks_10e"),
};


export const TaktikalBrigadeDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("taktikal_brigade_detachment"),
  detachment_name: "Taktikal Brigade Detachment",
  detachment_slug: "taktikal_brigade_detachment",
  rules_source_id: rulesSourceId("codex_orks_10e"),
};


export const WarHordeDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("war_horde_detachment"),
  detachment_name: "War Horde Detachment",
  detachment_slug: "war_horde_detachment",
  rules_source_id: rulesSourceId("codex_orks_10e"),
};


export const orksDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    BlitzBrigadeDetachmentDetachment,
    BullyBoyzDetachmentDetachment,
    DaBigHuntDetachmentDetachment,
    DreadMobDetachmentDetachment,
    FreebooterKrewDetachmentDetachment,
    GreenTideDetachmentDetachment,
    KultOfSpeedDetachmentDetachment,
    MoreDakkaDetachmentDetachment,
    SpeedwaaaghDetachmentDetachment,
    TaktikalBrigadeDetachmentDetachment,
    WarHordeDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
