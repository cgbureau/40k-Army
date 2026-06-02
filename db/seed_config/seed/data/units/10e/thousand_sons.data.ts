import type { SeedDataset, UnitConfig } from "../../../../types/_index.types";
import { unitId } from "../../../ids";

/**
 * 10th edition unit rows owned by `thousand_sons`.
 */

export const AhrimanUnit: UnitConfig = {
  id: unitId("ahriman"),
  unit_name: "Ahriman",
  unit_slug: "ahriman",
  is_legends: false,
};


export const BrayherdChieftainCrucibleUnit: UnitConfig = {
  id: unitId("brayherd_chieftain_crucible"),
  unit_name: "Brayherd Chieftain [Crucible]",
  unit_slug: "brayherd_chieftain_crucible",
  is_legends: false,
};


export const BrayherdShamanCrucibleUnit: UnitConfig = {
  id: unitId("brayherd_shaman_crucible"),
  unit_name: "Brayherd Shaman [Crucible]",
  unit_slug: "brayherd_shaman_crucible",
  is_legends: false,
};


export const ChaosSpawnFleshChangeUnit: UnitConfig = {
  id: unitId("chaos_spawn_flesh_change"),
  unit_name: "Chaos Spawn (Flesh Change)",
  unit_slug: "chaos_spawn_flesh_change",
  is_legends: false,
};


export const DaemonPrinceOfTzeentchUnit: UnitConfig = {
  id: unitId("daemon_prince_of_tzeentch"),
  unit_name: "Daemon Prince of Tzeentch",
  unit_slug: "daemon_prince_of_tzeentch",
  is_legends: false,
};


export const DaemonPrinceOfTzeentchWithWingsUnit: UnitConfig = {
  id: unitId("daemon_prince_of_tzeentch_with_wings"),
  unit_name: "Daemon Prince of Tzeentch with wings",
  unit_slug: "daemon_prince_of_tzeentch_with_wings",
  is_legends: false,
};


export const ExaltedSorcererUnit: UnitConfig = {
  id: unitId("exalted_sorcerer"),
  unit_name: "Exalted Sorcerer",
  unit_slug: "exalted_sorcerer",
  is_legends: false,
};


export const ExaltedSorcererOnDiscOfTzeentchUnit: UnitConfig = {
  id: unitId("exalted_sorcerer_on_disc_of_tzeentch"),
  unit_name: "Exalted Sorcerer on Disc of Tzeentch",
  unit_slug: "exalted_sorcerer_on_disc_of_tzeentch",
  is_legends: false,
};


export const InfernalMasterUnit: UnitConfig = {
  id: unitId("infernal_master"),
  unit_name: "Infernal Master",
  unit_slug: "infernal_master",
  is_legends: false,
};


export const MagisterCrucibleUnit: UnitConfig = {
  id: unitId("magister_crucible"),
  unit_name: "Magister [Crucible]",
  unit_slug: "magister_crucible",
  is_legends: false,
};


export const MagnusTheRedUnit: UnitConfig = {
  id: unitId("magnus_the_red"),
  unit_name: "Magnus the Red",
  unit_slug: "magnus_the_red",
  is_legends: false,
};


export const MutalithVortexBeastUnit: UnitConfig = {
  id: unitId("mutalith_vortex_beast"),
  unit_name: "Mutalith Vortex Beast",
  unit_slug: "mutalith_vortex_beast",
  is_legends: false,
};


export const ScarabOccultTerminatorsUnit: UnitConfig = {
  id: unitId("scarab_occult_terminators"),
  unit_name: "Scarab Occult Terminators",
  unit_slug: "scarab_occult_terminators",
  is_legends: false,
};


export const SekhetarRobotsUnit: UnitConfig = {
  id: unitId("sekhetar_robots"),
  unit_name: "Sekhetar Robots",
  unit_slug: "sekhetar_robots",
  is_legends: false,
};


export const TzaangorEnlightenedUnit: UnitConfig = {
  id: unitId("tzaangor_enlightened"),
  unit_name: "Tzaangor Enlightened",
  unit_slug: "tzaangor_enlightened",
  is_legends: false,
};


export const TzaangorEnlightenedWithFatecasterGreatbowsUnit: UnitConfig = {
  id: unitId("tzaangor_enlightened_with_fatecaster_greatbows"),
  unit_name: "Tzaangor Enlightened with Fatecaster greatbows",
  unit_slug: "tzaangor_enlightened_with_fatecaster_greatbows",
  is_legends: false,
};


export const TzaangorShamanUnit: UnitConfig = {
  id: unitId("tzaangor_shaman"),
  unit_name: "Tzaangor Shaman",
  unit_slug: "tzaangor_shaman",
  is_legends: false,
};


export const TzaangorsUnit: UnitConfig = {
  id: unitId("tzaangors"),
  unit_name: "Tzaangors",
  unit_slug: "tzaangors",
  is_legends: false,
};


export const thousandSonsUnits10e: SeedDataset<"units"> = {
  table: "units",
  records: [
    AhrimanUnit,
    BrayherdChieftainCrucibleUnit,
    BrayherdShamanCrucibleUnit,
    ChaosSpawnFleshChangeUnit,
    DaemonPrinceOfTzeentchUnit,
    DaemonPrinceOfTzeentchWithWingsUnit,
    ExaltedSorcererUnit,
    ExaltedSorcererOnDiscOfTzeentchUnit,
    InfernalMasterUnit,
    MagisterCrucibleUnit,
    MagnusTheRedUnit,
    MutalithVortexBeastUnit,
    ScarabOccultTerminatorsUnit,
    SekhetarRobotsUnit,
    TzaangorEnlightenedUnit,
    TzaangorEnlightenedWithFatecasterGreatbowsUnit,
    TzaangorShamanUnit,
    TzaangorsUnit,
  ] satisfies UnitConfig[],
};
