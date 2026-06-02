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
};


export const BloodcultChampionCrucibleUnit: UnitConfig = {
  id: unitId("bloodcult_champion_crucible"),
  unit_name: "Bloodcult Champion [Crucible]",
  unit_slug: "bloodcult_champion_crucible",
  is_legends: false,
};


export const ButcherlordCrucibleUnit: UnitConfig = {
  id: unitId("butcherlord_crucible"),
  unit_name: "Butcherlord [Crucible]",
  unit_slug: "butcherlord_crucible",
  is_legends: false,
};


export const DaemonPrinceOfKhorneUnit: UnitConfig = {
  id: unitId("daemon_prince_of_khorne"),
  unit_name: "Daemon Prince of Khorne",
  unit_slug: "daemon_prince_of_khorne",
  is_legends: false,
};


export const DaemonPrinceOfKhorneWithWingsUnit: UnitConfig = {
  id: unitId("daemon_prince_of_khorne_with_wings"),
  unit_name: "Daemon Prince of Khorne with wings",
  unit_slug: "daemon_prince_of_khorne_with_wings",
  is_legends: false,
};


export const EightBlessedLordCrucibleUnit: UnitConfig = {
  id: unitId("eight_blessed_lord_crucible"),
  unit_name: "Eight-blessed Lord [Crucible]",
  unit_slug: "eight_blessed_lord_crucible",
  is_legends: false,
};


export const EightboundUnit: UnitConfig = {
  id: unitId("eightbound"),
  unit_name: "Eightbound",
  unit_slug: "eightbound",
  is_legends: false,
};


export const ExaltedEightboundUnit: UnitConfig = {
  id: unitId("exalted_eightbound"),
  unit_name: "Exalted Eightbound",
  unit_slug: "exalted_eightbound",
  is_legends: false,
};


export const GoremongersUnit: UnitConfig = {
  id: unitId("goremongers"),
  unit_name: "Goremongers",
  unit_slug: "goremongers",
  is_legends: false,
};


export const JakhalsUnit: UnitConfig = {
  id: unitId("jakhals"),
  unit_name: "Jakhal",
  unit_slug: "jakhals",
  is_legends: false,
};


export const KhRnTheBetrayerUnit: UnitConfig = {
  id: unitId("kh_rn_the_betrayer"),
  unit_name: "Kh\u00e2rn the Betrayer",
  unit_slug: "kh_rn_the_betrayer",
  is_legends: false,
};


export const LordInvocatusUnit: UnitConfig = {
  id: unitId("lord_invocatus"),
  unit_name: "Lord Invocatus",
  unit_slug: "lord_invocatus",
  is_legends: false,
};


export const LordOnJuggernautUnit: UnitConfig = {
  id: unitId("lord_on_juggernaut"),
  unit_name: "Lord on Juggernaut",
  unit_slug: "lord_on_juggernaut",
  is_legends: false,
};


export const SlaughterboundUnit: UnitConfig = {
  id: unitId("slaughterbound"),
  unit_name: "Slaughterbound",
  unit_slug: "slaughterbound",
  is_legends: false,
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
