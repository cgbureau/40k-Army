import type {
  SeedDataset,
  UnitProfileStatConfig,
} from "../../../../types/_index.types";
import { unitProfileId, unitProfileStatId } from "../../../ids";

/**
 * 10th edition unit profile stat rows owned by `raven_guard`.
 * Generated from BSData Unit profile characteristics.
 */

export const AethonShaan10eAethonShaanLdUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("aethon_shaan__10e__aethon_shaan__ld"),
  unit_profile_id: unitProfileId("aethon_shaan__10e__aethon_shaan"),
  stat_key: "Ld",
  stat_value: "6",
};


export const AethonShaan10eAethonShaanMUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("aethon_shaan__10e__aethon_shaan__m"),
  unit_profile_id: unitProfileId("aethon_shaan__10e__aethon_shaan"),
  stat_key: "M",
  stat_value: "14\"",
};


export const AethonShaan10eAethonShaanOcUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("aethon_shaan__10e__aethon_shaan__oc"),
  unit_profile_id: unitProfileId("aethon_shaan__10e__aethon_shaan"),
  stat_key: "OC",
  stat_value: "1",
};


export const AethonShaan10eAethonShaanSvUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("aethon_shaan__10e__aethon_shaan__sv"),
  unit_profile_id: unitProfileId("aethon_shaan__10e__aethon_shaan"),
  stat_key: "Sv",
  stat_value: "3+",
};


export const AethonShaan10eAethonShaanTUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("aethon_shaan__10e__aethon_shaan__t"),
  unit_profile_id: unitProfileId("aethon_shaan__10e__aethon_shaan"),
  stat_key: "T",
  stat_value: "4",
};


export const AethonShaan10eAethonShaanWUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("aethon_shaan__10e__aethon_shaan__w"),
  unit_profile_id: unitProfileId("aethon_shaan__10e__aethon_shaan"),
  stat_key: "W",
  stat_value: "5",
};


export const KayvaanShrike10eKayvaanShrikeLdUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("kayvaan_shrike__10e__kayvaan_shrike__ld"),
  unit_profile_id: unitProfileId("kayvaan_shrike__10e__kayvaan_shrike"),
  stat_key: "Ld",
  stat_value: "6+",
};


export const KayvaanShrike10eKayvaanShrikeMUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("kayvaan_shrike__10e__kayvaan_shrike__m"),
  unit_profile_id: unitProfileId("kayvaan_shrike__10e__kayvaan_shrike"),
  stat_key: "M",
  stat_value: "12\"",
};


export const KayvaanShrike10eKayvaanShrikeOcUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("kayvaan_shrike__10e__kayvaan_shrike__oc"),
  unit_profile_id: unitProfileId("kayvaan_shrike__10e__kayvaan_shrike"),
  stat_key: "OC",
  stat_value: "1",
};


export const KayvaanShrike10eKayvaanShrikeSvUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("kayvaan_shrike__10e__kayvaan_shrike__sv"),
  unit_profile_id: unitProfileId("kayvaan_shrike__10e__kayvaan_shrike"),
  stat_key: "Sv",
  stat_value: "3+",
};


export const KayvaanShrike10eKayvaanShrikeTUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("kayvaan_shrike__10e__kayvaan_shrike__t"),
  unit_profile_id: unitProfileId("kayvaan_shrike__10e__kayvaan_shrike"),
  stat_key: "T",
  stat_value: "4",
};


export const KayvaanShrike10eKayvaanShrikeWUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("kayvaan_shrike__10e__kayvaan_shrike__w"),
  unit_profile_id: unitProfileId("kayvaan_shrike__10e__kayvaan_shrike"),
  stat_key: "W",
  stat_value: "5",
};


export const ravenGuardUnitProfileStats10e: SeedDataset<"unit_profile_stats"> = {
  table: "unit_profile_stats",
  records: [
    AethonShaan10eAethonShaanLdUnitProfileStat,
    AethonShaan10eAethonShaanMUnitProfileStat,
    AethonShaan10eAethonShaanOcUnitProfileStat,
    AethonShaan10eAethonShaanSvUnitProfileStat,
    AethonShaan10eAethonShaanTUnitProfileStat,
    AethonShaan10eAethonShaanWUnitProfileStat,
    KayvaanShrike10eKayvaanShrikeLdUnitProfileStat,
    KayvaanShrike10eKayvaanShrikeMUnitProfileStat,
    KayvaanShrike10eKayvaanShrikeOcUnitProfileStat,
    KayvaanShrike10eKayvaanShrikeSvUnitProfileStat,
    KayvaanShrike10eKayvaanShrikeTUnitProfileStat,
    KayvaanShrike10eKayvaanShrikeWUnitProfileStat,
  ] satisfies UnitProfileStatConfig[],
};
