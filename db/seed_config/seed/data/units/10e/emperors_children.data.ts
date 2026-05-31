import type { SeedDataset, UnitConfig } from "../../../../types/_index.types";
import { unitId } from "../../../ids";

/**
 * 10th edition unit rows owned by `emperors_children`.
 */

export const ChampionOfExcessCrucibleUnit: UnitConfig = {
  id: unitId("champion_of_excess_crucible"),
  unit_name: "Champion of Excess [Crucible]",
  unit_slug: "champion_of_excess_crucible",
  is_legends: false,
  wahapedia_url: null,
};


export const ChaosTerminatorsUnit: UnitConfig = {
  id: unitId("chaos_terminators"),
  unit_name: "Chaos Terminators",
  unit_slug: "chaos_terminators",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/emperor-s-children/Chaos-Terminators",
};


export const DaemonPrinceOfSlaaneshUnit: UnitConfig = {
  id: unitId("daemon_prince_of_slaanesh"),
  unit_name: "Daemon Prince of Slaanesh",
  unit_slug: "daemon_prince_of_slaanesh",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/emperor-s-children/Daemon-Prince-of-Slaanesh",
};


export const DaemonPrinceOfSlaaneshWithWingsUnit: UnitConfig = {
  id: unitId("daemon_prince_of_slaanesh_with_wings"),
  unit_name: "Daemon Prince of Slaanesh with Wings",
  unit_slug: "daemon_prince_of_slaanesh_with_wings",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/emperor-s-children/Daemon-Prince-of-Slaanesh-with-Wings",
};


export const ExcruciatorCrucibleUnit: UnitConfig = {
  id: unitId("excruciator_crucible"),
  unit_name: "Excruciator [Crucible]",
  unit_slug: "excruciator_crucible",
  is_legends: false,
  wahapedia_url: null,
};


export const FlawlessBladesUnit: UnitConfig = {
  id: unitId("flawless_blades"),
  unit_name: "Flawless Blades",
  unit_slug: "flawless_blades",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/emperor-s-children/Flawless-Blades",
};


export const FlawlessChampionCrucibleUnit: UnitConfig = {
  id: unitId("flawless_champion_crucible"),
  unit_name: "Flawless Champion [Crucible]",
  unit_slug: "flawless_champion_crucible",
  is_legends: false,
  wahapedia_url: null,
};


export const FulgrimUnit: UnitConfig = {
  id: unitId("fulgrim"),
  unit_name: "Fulgrim",
  unit_slug: "fulgrim",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/emperor-s-children/Fulgrim",
};


export const InfractorsUnit: UnitConfig = {
  id: unitId("infractors"),
  unit_name: "Infractors",
  unit_slug: "infractors",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/emperor-s-children/Infractors",
};


export const LordExultantUnit: UnitConfig = {
  id: unitId("lord_exultant"),
  unit_name: "Lord Exultant",
  unit_slug: "lord_exultant",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/emperor-s-children/Lord-Exultant",
};


export const LordKakophonistUnit: UnitConfig = {
  id: unitId("lord_kakophonist"),
  unit_name: "Lord Kakophonist",
  unit_slug: "lord_kakophonist",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/emperor-s-children/Lord-Kakophonist",
};


export const LuciusTheEternalUnit: UnitConfig = {
  id: unitId("lucius_the_eternal"),
  unit_name: "Lucius the Eternal",
  unit_slug: "lucius_the_eternal",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/emperor-s-children/Lucius-the-Eternal",
};


export const TormentorsUnit: UnitConfig = {
  id: unitId("tormentors"),
  unit_name: "Tormentors",
  unit_slug: "tormentors",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/emperor-s-children/Tormentors",
};


export const emperorsChildrenUnits10e: SeedDataset<"units"> = {
  table: "units",
  records: [
    ChampionOfExcessCrucibleUnit,
    ChaosTerminatorsUnit,
    DaemonPrinceOfSlaaneshUnit,
    DaemonPrinceOfSlaaneshWithWingsUnit,
    ExcruciatorCrucibleUnit,
    FlawlessBladesUnit,
    FlawlessChampionCrucibleUnit,
    FulgrimUnit,
    InfractorsUnit,
    LordExultantUnit,
    LordKakophonistUnit,
    LuciusTheEternalUnit,
    TormentorsUnit,
  ] satisfies UnitConfig[],
};
