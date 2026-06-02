import type { SeedDataset, UnitConfig } from "../../../../types/_index.types";
import { unitId } from "../../../ids";

/**
 * 10th edition unit rows owned by `black_templars`.
 */

export const CastellanUnit: UnitConfig = {
  id: unitId("castellan"),
  unit_name: "Castellan",
  unit_slug: "castellan",
  is_legends: false,
};


export const ChaplainGrimaldusUnit: UnitConfig = {
  id: unitId("chaplain_grimaldus"),
  unit_name: "Chaplain Grimaldus",
  unit_slug: "chaplain_grimaldus",
  is_legends: false,
};


export const CrusadeAncientUnit: UnitConfig = {
  id: unitId("crusade_ancient"),
  unit_name: "Crusade Ancient",
  unit_slug: "crusade_ancient",
  is_legends: false,
};


export const CrusaderSquadUnit: UnitConfig = {
  id: unitId("crusader_squad"),
  unit_name: "Crusader Squad",
  unit_slug: "crusader_squad",
  is_legends: false,
};


export const CrusaderSquadLegendaryUnit: UnitConfig = {
  id: unitId("crusader_squad_legendary"),
  unit_name: "Crusader Squad (Legends)",
  unit_slug: "crusader_squad_legendary",
  is_legends: false,
};


export const EmperorsChampionUnit: UnitConfig = {
  id: unitId("emperors_champion"),
  unit_name: "Emperor's Champion",
  unit_slug: "emperors_champion",
  is_legends: false,
};


export const EmperorsChampionAnointedUnit: UnitConfig = {
  id: unitId("emperors_champion_anointed"),
  unit_name: "Emperor's Champion (Anointed)",
  unit_slug: "emperors_champion_anointed",
  is_legends: false,
};


export const ExecratorUnit: UnitConfig = {
  id: unitId("execrator"),
  unit_name: "Execrator",
  unit_slug: "execrator",
  is_legends: false,
};


export const GladiatorLancerUnit: UnitConfig = {
  id: unitId("gladiator_lancer"),
  unit_name: "Gladiator Lancer",
  unit_slug: "gladiator_lancer",
  is_legends: false,
};


export const GladiatorReaperUnit: UnitConfig = {
  id: unitId("gladiator_reaper"),
  unit_name: "Gladiator Reaper",
  unit_slug: "gladiator_reaper",
  is_legends: false,
};


export const GladiatorValiantUnit: UnitConfig = {
  id: unitId("gladiator_valiant"),
  unit_name: "Gladiator Valiant",
  unit_slug: "gladiator_valiant",
  is_legends: false,
};


export const HighMarshalHelbrechtUnit: UnitConfig = {
  id: unitId("high_marshal_helbrecht"),
  unit_name: "High Marshal Helbrecht",
  unit_slug: "high_marshal_helbrecht",
  is_legends: false,
};


export const ImpulsorUnit: UnitConfig = {
  id: unitId("impulsor"),
  unit_name: "Impulsor",
  unit_slug: "impulsor",
  is_legends: false,
};


export const LandRaiderCrusaderUnit: UnitConfig = {
  id: unitId("land_raider_crusader"),
  unit_name: "Land Raider Crusader",
  unit_slug: "land_raider_crusader",
  is_legends: false,
};


export const MarshalUnit: UnitConfig = {
  id: unitId("marshal"),
  unit_name: "Marshal",
  unit_slug: "marshal",
  is_legends: false,
};


export const RepulsorUnit: UnitConfig = {
  id: unitId("repulsor"),
  unit_name: "Repulsor",
  unit_slug: "repulsor",
  is_legends: false,
};


export const RepulsorExecutionerUnit: UnitConfig = {
  id: unitId("repulsor_executioner"),
  unit_name: "Repulsor Executioner",
  unit_slug: "repulsor_executioner",
  is_legends: false,
};


export const SternguardVeteranSquadUnit: UnitConfig = {
  id: unitId("sternguard_veteran_squad"),
  unit_name: "Sternguard Veteran Squad",
  unit_slug: "sternguard_veteran_squad",
  is_legends: false,
};


export const SwordBrethrenSquadUnit: UnitConfig = {
  id: unitId("sword_brethren_squad"),
  unit_name: "Sword Brethren Squad",
  unit_slug: "sword_brethren_squad",
  is_legends: false,
};


export const TerminatorSquadUnit: UnitConfig = {
  id: unitId("terminator_squad"),
  unit_name: "Terminator Squad",
  unit_slug: "terminator_squad",
  is_legends: false,
};


export const blackTemplarsUnits10e: SeedDataset<"units"> = {
  table: "units",
  records: [
    CastellanUnit,
    ChaplainGrimaldusUnit,
    CrusadeAncientUnit,
    CrusaderSquadUnit,
    CrusaderSquadLegendaryUnit,
    EmperorsChampionUnit,
    EmperorsChampionAnointedUnit,
    ExecratorUnit,
    GladiatorLancerUnit,
    GladiatorReaperUnit,
    GladiatorValiantUnit,
    HighMarshalHelbrechtUnit,
    ImpulsorUnit,
    LandRaiderCrusaderUnit,
    MarshalUnit,
    RepulsorUnit,
    RepulsorExecutionerUnit,
    SternguardVeteranSquadUnit,
    SwordBrethrenSquadUnit,
    TerminatorSquadUnit,
  ] satisfies UnitConfig[],
};
