import type {
  SeedDataset,
  UnitProfileStatConfig,
} from "../../../../types/_index.types";
import { unitProfileId, unitProfileStatId } from "../../../ids";

/**
 * 10th edition unit profile stat rows owned by `white_scars`.
 * Generated from BSData Unit profile characteristics.
 */

export const KorsarroKhan10eKorsarroKhanLdUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("korsarro_khan__10e__korsarro_khan__ld"),
  unit_profile_id: unitProfileId("korsarro_khan__10e__korsarro_khan"),
  stat_key: "Ld",
  stat_value: "6+",
};


export const KorsarroKhan10eKorsarroKhanMUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("korsarro_khan__10e__korsarro_khan__m"),
  unit_profile_id: unitProfileId("korsarro_khan__10e__korsarro_khan"),
  stat_key: "M",
  stat_value: "6\"",
};


export const KorsarroKhan10eKorsarroKhanOcUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("korsarro_khan__10e__korsarro_khan__oc"),
  unit_profile_id: unitProfileId("korsarro_khan__10e__korsarro_khan"),
  stat_key: "OC",
  stat_value: "1",
};


export const KorsarroKhan10eKorsarroKhanSvUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("korsarro_khan__10e__korsarro_khan__sv"),
  unit_profile_id: unitProfileId("korsarro_khan__10e__korsarro_khan"),
  stat_key: "Sv",
  stat_value: "3+",
};


export const KorsarroKhan10eKorsarroKhanTUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("korsarro_khan__10e__korsarro_khan__t"),
  unit_profile_id: unitProfileId("korsarro_khan__10e__korsarro_khan"),
  stat_key: "T",
  stat_value: "4",
};


export const KorsarroKhan10eKorsarroKhanWUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("korsarro_khan__10e__korsarro_khan__w"),
  unit_profile_id: unitProfileId("korsarro_khan__10e__korsarro_khan"),
  stat_key: "W",
  stat_value: "5",
};


export const SubodenKhan10eSubodenKhanLdUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("suboden_khan__10e__suboden_khan__ld"),
  unit_profile_id: unitProfileId("suboden_khan__10e__suboden_khan"),
  stat_key: "Ld",
  stat_value: "6+",
};


export const SubodenKhan10eSubodenKhanMUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("suboden_khan__10e__suboden_khan__m"),
  unit_profile_id: unitProfileId("suboden_khan__10e__suboden_khan"),
  stat_key: "M",
  stat_value: "12\"",
};


export const SubodenKhan10eSubodenKhanOcUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("suboden_khan__10e__suboden_khan__oc"),
  unit_profile_id: unitProfileId("suboden_khan__10e__suboden_khan"),
  stat_key: "OC",
  stat_value: "2",
};


export const SubodenKhan10eSubodenKhanSvUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("suboden_khan__10e__suboden_khan__sv"),
  unit_profile_id: unitProfileId("suboden_khan__10e__suboden_khan"),
  stat_key: "Sv",
  stat_value: "3+",
};


export const SubodenKhan10eSubodenKhanTUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("suboden_khan__10e__suboden_khan__t"),
  unit_profile_id: unitProfileId("suboden_khan__10e__suboden_khan"),
  stat_key: "T",
  stat_value: "5",
};


export const SubodenKhan10eSubodenKhanWUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("suboden_khan__10e__suboden_khan__w"),
  unit_profile_id: unitProfileId("suboden_khan__10e__suboden_khan"),
  stat_key: "W",
  stat_value: "8",
};


export const whiteScarsUnitProfileStats10e: SeedDataset<"unit_profile_stats"> = {
  table: "unit_profile_stats",
  records: [
    KorsarroKhan10eKorsarroKhanLdUnitProfileStat,
    KorsarroKhan10eKorsarroKhanMUnitProfileStat,
    KorsarroKhan10eKorsarroKhanOcUnitProfileStat,
    KorsarroKhan10eKorsarroKhanSvUnitProfileStat,
    KorsarroKhan10eKorsarroKhanTUnitProfileStat,
    KorsarroKhan10eKorsarroKhanWUnitProfileStat,
    SubodenKhan10eSubodenKhanLdUnitProfileStat,
    SubodenKhan10eSubodenKhanMUnitProfileStat,
    SubodenKhan10eSubodenKhanOcUnitProfileStat,
    SubodenKhan10eSubodenKhanSvUnitProfileStat,
    SubodenKhan10eSubodenKhanTUnitProfileStat,
    SubodenKhan10eSubodenKhanWUnitProfileStat,
  ] satisfies UnitProfileStatConfig[],
};
