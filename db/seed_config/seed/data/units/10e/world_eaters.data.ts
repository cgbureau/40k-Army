import type { SeedDataset, UnitConfig } from "../../../../types/_index.types";
import { unitId } from "../../../ids";

/**
 * 10th edition unit rows owned by `world_eaters`.
 */

export const AngronUnit: UnitConfig = {
  id: unitId("angron"),
  unit_name: "Angron",
  unit_slug: "angron",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/world-eaters/Angron",
};


export const BloodcultChampionCrucibleUnit: UnitConfig = {
  id: unitId("bloodcult_champion_crucible"),
  unit_name: "Bloodcult Champion [Crucible]",
  unit_slug: "bloodcult_champion_crucible",
  is_legends: false,
  wahapedia_url: null,
};


export const ButcherlordCrucibleUnit: UnitConfig = {
  id: unitId("butcherlord_crucible"),
  unit_name: "Butcherlord [Crucible]",
  unit_slug: "butcherlord_crucible",
  is_legends: false,
  wahapedia_url: null,
};


export const DaemonPrinceOfKhorneUnit: UnitConfig = {
  id: unitId("daemon_prince_of_khorne"),
  unit_name: "Daemon Prince of Khorne",
  unit_slug: "daemon_prince_of_khorne",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/world-eaters/Daemon-Prince-of-Khorne",
};


export const DaemonPrinceOfKhorneWithWingsUnit: UnitConfig = {
  id: unitId("daemon_prince_of_khorne_with_wings"),
  unit_name: "Daemon Prince of Khorne with Wings",
  unit_slug: "daemon_prince_of_khorne_with_wings",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/world-eaters/Daemon-Prince-of-Khorne-with-Wings",
};


export const EightBlessedLordCrucibleUnit: UnitConfig = {
  id: unitId("eight_blessed_lord_crucible"),
  unit_name: "Eight-blessed Lord [Crucible]",
  unit_slug: "eight_blessed_lord_crucible",
  is_legends: false,
  wahapedia_url: null,
};


export const EightboundUnit: UnitConfig = {
  id: unitId("eightbound"),
  unit_name: "Eightbound",
  unit_slug: "eightbound",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/world-eaters/Eightbound",
};


export const ExaltedEightboundUnit: UnitConfig = {
  id: unitId("exalted_eightbound"),
  unit_name: "Exalted Eightbound",
  unit_slug: "exalted_eightbound",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/world-eaters/Exalted-Eightbound",
};


export const GoremongersUnit: UnitConfig = {
  id: unitId("goremongers"),
  unit_name: "Goremongers",
  unit_slug: "goremongers",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/world-eaters/Goremongers",
};


export const JakhalsUnit: UnitConfig = {
  id: unitId("jakhals"),
  unit_name: "Jakhals",
  unit_slug: "jakhals",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/world-eaters/Jakhals",
};


export const KhRnTheBetrayerUnit: UnitConfig = {
  id: unitId("kh_rn_the_betrayer"),
  unit_name: "Kh\u00e2rn The Betrayer",
  unit_slug: "kh_rn_the_betrayer",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/world-eaters/Kh-rn-The-Betrayer",
};


export const LordInvocatusUnit: UnitConfig = {
  id: unitId("lord_invocatus"),
  unit_name: "Lord Invocatus",
  unit_slug: "lord_invocatus",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/world-eaters/Lord-Invocatus",
};


export const LordOnJuggernautUnit: UnitConfig = {
  id: unitId("lord_on_juggernaut"),
  unit_name: "Lord on Juggernaut",
  unit_slug: "lord_on_juggernaut",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/world-eaters/Lord-on-Juggernaut",
};


export const SlaughterboundUnit: UnitConfig = {
  id: unitId("slaughterbound"),
  unit_name: "Slaughterbound",
  unit_slug: "slaughterbound",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/world-eaters/Slaughterbound",
};


export const worldEatersUnits10e: SeedDataset<"units"> = {
  table: "units",
  records: [
    AngronUnit,
    BloodcultChampionCrucibleUnit,
    ButcherlordCrucibleUnit,
    DaemonPrinceOfKhorneUnit,
    DaemonPrinceOfKhorneWithWingsUnit,
    EightBlessedLordCrucibleUnit,
    EightboundUnit,
    ExaltedEightboundUnit,
    GoremongersUnit,
    JakhalsUnit,
    KhRnTheBetrayerUnit,
    LordInvocatusUnit,
    LordOnJuggernautUnit,
    SlaughterboundUnit,
  ] satisfies UnitConfig[],
};
