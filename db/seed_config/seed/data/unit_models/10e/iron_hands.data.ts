import type {
  SeedDataset,
  UnitModelConfig,
} from "../../../../types/_index.types";
import { modelId, unitId, unitModelId } from "../../../ids";

/**
 * 10th edition unit model rows owned by `iron_hands`.
 * Generated from BSData model selection entries.
 */

export const CaanokVarCaanokVarUnitModel: UnitModelConfig = {
  id: unitModelId("caanok_var__caanok_var"),
  unit_id: unitId("caanok_var"),
  model_id: modelId("caanok_var"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  effective_date: null,
  superseded_date: null,
};


export const IronFatherFeirrosIronFatherFeirrosUnitModel: UnitModelConfig = {
  id: unitModelId("iron_father_feirros__iron_father_feirros"),
  unit_id: unitId("iron_father_feirros"),
  model_id: modelId("iron_father_feirros"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  effective_date: null,
  superseded_date: null,
};


export const ironHandsUnitModels10e: SeedDataset<"unit_models"> = {
  table: "unit_models",
  records: [
    CaanokVarCaanokVarUnitModel,
    IronFatherFeirrosIronFatherFeirrosUnitModel,
  ] satisfies UnitModelConfig[],
};
