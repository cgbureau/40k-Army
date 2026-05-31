import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `chaos_space_marines`.
 */

export const CabalOfChaosDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("cabal_of_chaos_detachment"),
  detachment_name: "Cabal of Chaos Detachment",
  detachment_slug: "cabal_of_chaos_detachment",
  rules_source_id: rulesSourceId("codex_chaos_space_marines_10e"),
};


export const ChaosCultDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("chaos_cult_detachment"),
  detachment_name: "Chaos Cult Detachment",
  detachment_slug: "chaos_cult_detachment",
  rules_source_id: rulesSourceId("codex_chaos_space_marines_10e"),
};


export const CreationsOfBileDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("creations_of_bile_detachment"),
  detachment_name: "Creations of Bile Detachment",
  detachment_slug: "creations_of_bile_detachment",
  rules_source_id: rulesSourceId("codex_chaos_space_marines_10e"),
};


export const CultOfTheArkifaneDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("cult_of_the_arkifane_detachment"),
  detachment_name: "Cult of the Arkifane Detachment",
  detachment_slug: "cult_of_the_arkifane_detachment",
  rules_source_id: rulesSourceId("codex_chaos_space_marines_10e"),
};


export const DeceptorsDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("deceptors_detachment"),
  detachment_name: "Deceptors Detachment",
  detachment_slug: "deceptors_detachment",
  rules_source_id: rulesSourceId("codex_chaos_space_marines_10e"),
};


export const DreadTalonsDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("dread_talons_detachment"),
  detachment_name: "Dread Talons Detachment",
  detachment_slug: "dread_talons_detachment",
  rules_source_id: rulesSourceId("codex_chaos_space_marines_10e"),
};


export const FellhammerSiegeHostDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("fellhammer_siege_host_detachment"),
  detachment_name: "Fellhammer Siege-host Detachment",
  detachment_slug: "fellhammer_siege_host_detachment",
  rules_source_id: rulesSourceId("codex_chaos_space_marines_10e"),
};


export const HuronsMaraudersDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("hurons_marauders_detachment"),
  detachment_name: "Huron's Marauders Detachment",
  detachment_slug: "hurons_marauders_detachment",
  rules_source_id: rulesSourceId("codex_chaos_space_marines_10e"),
};


export const NightmareHuntDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("nightmare_hunt_detachment"),
  detachment_name: "Nightmare Hunt Detachment",
  detachment_slug: "nightmare_hunt_detachment",
  rules_source_id: rulesSourceId("codex_chaos_space_marines_10e"),
};


export const PactboundZealotsDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("pactbound_zealots_detachment"),
  detachment_name: "Pactbound Zealots Detachment",
  detachment_slug: "pactbound_zealots_detachment",
  rules_source_id: rulesSourceId("codex_chaos_space_marines_10e"),
};


export const RenegadeRaidersDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("renegade_raiders_detachment"),
  detachment_name: "Renegade Raiders Detachment",
  detachment_slug: "renegade_raiders_detachment",
  rules_source_id: rulesSourceId("codex_chaos_space_marines_10e"),
};


export const RenegadeWarbandDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("renegade_warband_detachment"),
  detachment_name: "Renegade Warband Detachment",
  detachment_slug: "renegade_warband_detachment",
  rules_source_id: rulesSourceId("codex_chaos_space_marines_10e"),
};


export const SoulforgedWarpackDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("soulforged_warpack_detachment"),
  detachment_name: "Soulforged Warpack Detachment",
  detachment_slug: "soulforged_warpack_detachment",
  rules_source_id: rulesSourceId("codex_chaos_space_marines_10e"),
};


export const VeteransOfTheLongWarDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("veterans_of_the_long_war_detachment"),
  detachment_name: "Veterans of the Long War Detachment",
  detachment_slug: "veterans_of_the_long_war_detachment",
  rules_source_id: rulesSourceId("codex_chaos_space_marines_10e"),
};


export const WarpstrikeChampionsDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("warpstrike_champions_detachment"),
  detachment_name: "Warpstrike Champions Detachment",
  detachment_slug: "warpstrike_champions_detachment",
  rules_source_id: rulesSourceId("codex_chaos_space_marines_10e"),
};


export const chaosSpaceMarinesDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    CabalOfChaosDetachmentDetachment,
    ChaosCultDetachmentDetachment,
    CreationsOfBileDetachmentDetachment,
    CultOfTheArkifaneDetachmentDetachment,
    DeceptorsDetachmentDetachment,
    DreadTalonsDetachmentDetachment,
    FellhammerSiegeHostDetachmentDetachment,
    HuronsMaraudersDetachmentDetachment,
    NightmareHuntDetachmentDetachment,
    PactboundZealotsDetachmentDetachment,
    RenegadeRaidersDetachmentDetachment,
    RenegadeWarbandDetachmentDetachment,
    SoulforgedWarpackDetachmentDetachment,
    VeteransOfTheLongWarDetachmentDetachment,
    WarpstrikeChampionsDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
