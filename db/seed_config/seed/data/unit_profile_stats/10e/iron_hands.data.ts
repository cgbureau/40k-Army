import type {
  SeedDataset,
  UnitProfileStatConfig,
} from "../../../../types/_index.types";
import { unitProfileId, unitProfileStatId } from "../../../ids";

/**
 * 10th edition unit profile stat rows owned by `iron_hands`.
 * Generated from BSData Unit profile characteristics.
 */

export const CaanokVar10eCaanokVarLdUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("caanok_var__10e__caanok_var__ld"),
  unit_profile_id: unitProfileId("caanok_var__10e__caanok_var"),
  stat_key: "Ld",
  stat_value: "6+",
};


export const CaanokVar10eCaanokVarMUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("caanok_var__10e__caanok_var__m"),
  unit_profile_id: unitProfileId("caanok_var__10e__caanok_var"),
  stat_key: "M",
  stat_value: "5\"",
};


export const CaanokVar10eCaanokVarOcUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("caanok_var__10e__caanok_var__oc"),
  unit_profile_id: unitProfileId("caanok_var__10e__caanok_var"),
  stat_key: "OC",
  stat_value: "1",
};


export const CaanokVar10eCaanokVarSvUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("caanok_var__10e__caanok_var__sv"),
  unit_profile_id: unitProfileId("caanok_var__10e__caanok_var"),
  stat_key: "Sv",
  stat_value: "2+",
};


export const CaanokVar10eCaanokVarTUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("caanok_var__10e__caanok_var__t"),
  unit_profile_id: unitProfileId("caanok_var__10e__caanok_var"),
  stat_key: "T",
  stat_value: "5",
};


export const CaanokVar10eCaanokVarWUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("caanok_var__10e__caanok_var__w"),
  unit_profile_id: unitProfileId("caanok_var__10e__caanok_var"),
  stat_key: "W",
  stat_value: "6",
};


export const IronFatherFeirros10eIronFatherFerriosLdUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("iron_father_feirros__10e__iron_father_ferrios__ld"),
  unit_profile_id: unitProfileId("iron_father_feirros__10e__iron_father_ferrios"),
  stat_key: "Ld",
  stat_value: "6+",
};


export const IronFatherFeirros10eIronFatherFerriosMUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("iron_father_feirros__10e__iron_father_ferrios__m"),
  unit_profile_id: unitProfileId("iron_father_feirros__10e__iron_father_ferrios"),
  stat_key: "M",
  stat_value: "5\"",
};


export const IronFatherFeirros10eIronFatherFerriosOcUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("iron_father_feirros__10e__iron_father_ferrios__oc"),
  unit_profile_id: unitProfileId("iron_father_feirros__10e__iron_father_ferrios"),
  stat_key: "OC",
  stat_value: "1",
};


export const IronFatherFeirros10eIronFatherFerriosSvUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("iron_father_feirros__10e__iron_father_ferrios__sv"),
  unit_profile_id: unitProfileId("iron_father_feirros__10e__iron_father_ferrios"),
  stat_key: "Sv",
  stat_value: "2+",
};


export const IronFatherFeirros10eIronFatherFerriosTUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("iron_father_feirros__10e__iron_father_ferrios__t"),
  unit_profile_id: unitProfileId("iron_father_feirros__10e__iron_father_ferrios"),
  stat_key: "T",
  stat_value: "6",
};


export const IronFatherFeirros10eIronFatherFerriosWUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("iron_father_feirros__10e__iron_father_ferrios__w"),
  unit_profile_id: unitProfileId("iron_father_feirros__10e__iron_father_ferrios"),
  stat_key: "W",
  stat_value: "6",
};


export const ironHandsUnitProfileStats10e: SeedDataset<"unit_profile_stats"> = {
  table: "unit_profile_stats",
  records: [
    CaanokVar10eCaanokVarLdUnitProfileStat,
    CaanokVar10eCaanokVarMUnitProfileStat,
    CaanokVar10eCaanokVarOcUnitProfileStat,
    CaanokVar10eCaanokVarSvUnitProfileStat,
    CaanokVar10eCaanokVarTUnitProfileStat,
    CaanokVar10eCaanokVarWUnitProfileStat,
    IronFatherFeirros10eIronFatherFerriosLdUnitProfileStat,
    IronFatherFeirros10eIronFatherFerriosMUnitProfileStat,
    IronFatherFeirros10eIronFatherFerriosOcUnitProfileStat,
    IronFatherFeirros10eIronFatherFerriosSvUnitProfileStat,
    IronFatherFeirros10eIronFatherFerriosTUnitProfileStat,
    IronFatherFeirros10eIronFatherFerriosWUnitProfileStat,
  ] satisfies UnitProfileStatConfig[],
};
