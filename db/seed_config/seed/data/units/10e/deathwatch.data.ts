import type { SeedDataset, UnitConfig } from "../../../../types/_index.types";
import { unitId } from "../../../ids";

/**
 * 10th edition unit rows owned by `deathwatch`.
 */

export const CorvusBlackstarUnit: UnitConfig = {
  id: unitId("corvus_blackstar"),
  unit_name: "Corvus Blackstar",
  unit_slug: "corvus_blackstar",
  is_legends: false,
};


export const DeathwatchTerminatorSquadUnit: UnitConfig = {
  id: unitId("deathwatch_terminator_squad"),
  unit_name: "Deathwatch Terminator Squad",
  unit_slug: "deathwatch_terminator_squad",
  is_legends: false,
};


export const DeathwatchVeteranWCarbineUnit: UnitConfig = {
  id: unitId("deathwatch_veteran_w_carbine"),
  unit_name: "Deathwatch Veteran w/ carbine",
  unit_slug: "deathwatch_veteran_w_carbine",
  is_legends: false,
};


export const DeathwatchVeteranWHeavyThunderHammerUnit: UnitConfig = {
  id: unitId("deathwatch_veteran_w_heavy_thunder_hammer"),
  unit_name: "Deathwatch Veteran w/ heavy thunder hammer",
  unit_slug: "deathwatch_veteran_w_heavy_thunder_hammer",
  is_legends: false,
};


export const DeathwatchVeteranWStalkerBoltRifleUnit: UnitConfig = {
  id: unitId("deathwatch_veteran_w_stalker_bolt_rifle"),
  unit_name: "Deathwatch Veteran w/ stalker bolt rifle",
  unit_slug: "deathwatch_veteran_w_stalker_bolt_rifle",
  is_legends: false,
};


export const DeathwatchVeteransUnit: UnitConfig = {
  id: unitId("deathwatch_veterans"),
  unit_name: "Deathwatch Veterans",
  unit_slug: "deathwatch_veterans",
  is_legends: false,
};


export const DecimusKillTeamUnit: UnitConfig = {
  id: unitId("decimus_kill_team"),
  unit_name: "Decimus Kill Team",
  unit_slug: "decimus_kill_team",
  is_legends: false,
};


export const FortisKillTeamUnit: UnitConfig = {
  id: unitId("fortis_kill_team"),
  unit_name: "Fortis Kill Team",
  unit_slug: "fortis_kill_team",
  is_legends: false,
};


export const GravisVeteranWInfernusHeavyBolterUnit: UnitConfig = {
  id: unitId("gravis_veteran_w_infernus_heavy_bolter"),
  unit_name: "Gravis Veteran w/ infernus heavy bolter",
  unit_slug: "gravis_veteran_w_infernus_heavy_bolter",
  is_legends: false,
};


export const IndomitorKillTeamUnit: UnitConfig = {
  id: unitId("indomitor_kill_team"),
  unit_name: "Indomitor Kill Team",
  unit_slug: "indomitor_kill_team",
  is_legends: false,
};


export const KillTeamCassiusUnit: UnitConfig = {
  id: unitId("kill_team_cassius"),
  unit_name: "Kill Team Cassius (Legends)",
  unit_slug: "kill_team_cassius",
  is_legends: false,
};


export const KillTeamSergeantUnit: UnitConfig = {
  id: unitId("kill_team_sergeant"),
  unit_name: "Kill Team Sergeant",
  unit_slug: "kill_team_sergeant",
  is_legends: false,
};


export const SpectrusKillTeamUnit: UnitConfig = {
  id: unitId("spectrus_kill_team"),
  unit_name: "Spectrus Kill Team",
  unit_slug: "spectrus_kill_team",
  is_legends: false,
};


export const TalonstrikeKillTeamUnit: UnitConfig = {
  id: unitId("talonstrike_kill_team"),
  unit_name: "Talonstrike Kill Team",
  unit_slug: "talonstrike_kill_team",
  is_legends: false,
};


export const WatchCaptainArtemisUnit: UnitConfig = {
  id: unitId("watch_captain_artemis"),
  unit_name: "Watch Captain Artemis",
  unit_slug: "watch_captain_artemis",
  is_legends: false,
};


export const WatchMasterUnit: UnitConfig = {
  id: unitId("watch_master"),
  unit_name: "Watch Master",
  unit_slug: "watch_master",
  is_legends: false,
};


export const deathwatchUnits10e: SeedDataset<"units"> = {
  table: "units",
  records: [
    CorvusBlackstarUnit,
    DeathwatchTerminatorSquadUnit,
    DeathwatchVeteranWCarbineUnit,
    DeathwatchVeteranWHeavyThunderHammerUnit,
    DeathwatchVeteranWStalkerBoltRifleUnit,
    DeathwatchVeteransUnit,
    DecimusKillTeamUnit,
    FortisKillTeamUnit,
    GravisVeteranWInfernusHeavyBolterUnit,
    IndomitorKillTeamUnit,
    KillTeamCassiusUnit,
    KillTeamSergeantUnit,
    SpectrusKillTeamUnit,
    TalonstrikeKillTeamUnit,
    WatchCaptainArtemisUnit,
    WatchMasterUnit,
  ] satisfies UnitConfig[],
};
