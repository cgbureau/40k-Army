import type { SeedDataset, UnitConfig } from "../../../../types/_index.types";
import { unitId } from "../../../ids";

/**
 * 10th edition unit rows owned by `iron_hands`.
 */

export const CaanokVarUnit: UnitConfig = {
  id: unitId("caanok_var"),
  unit_name: "Caanok Var",
  unit_slug: "caanok_var",
  is_legends: false,
};


export const IronFatherFeirrosUnit: UnitConfig = {
  id: unitId("iron_father_feirros"),
  unit_name: "Iron Father Feirros",
  unit_slug: "iron_father_feirros",
  is_legends: false,
};


export const ironHandsUnits10e: SeedDataset<"units"> = {
  table: "units",
  records: [
    CaanokVarUnit,
    IronFatherFeirrosUnit,
  ] satisfies UnitConfig[],
};
