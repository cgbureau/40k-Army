import type {
  SeedDataset,
  UnitModelConfig,
} from "../../../../types/_index.types";
import { modelId, unitId, unitModelId } from "../../../ids";

/**
 * 10th edition unit model rows owned by `raven_guard`.
 * Generated from BSData model selection entries.
 */

export const AethonShaanAethonShaanUnitModel: UnitModelConfig = {
  id: unitModelId("aethon_shaan__aethon_shaan"),
  unit_id: unitId("aethon_shaan"),
  model_id: modelId("aethon_shaan"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  effective_date: null,
  superseded_date: null,
};


export const KayvaanShrikeKayvaanShrikeUnitModel: UnitModelConfig = {
  id: unitModelId("kayvaan_shrike__kayvaan_shrike"),
  unit_id: unitId("kayvaan_shrike"),
  model_id: modelId("kayvaan_shrike"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  effective_date: null,
  superseded_date: null,
};


export const ravenGuardUnitModels10e: SeedDataset<"unit_models"> = {
  table: "unit_models",
  records: [
    AethonShaanAethonShaanUnitModel,
    KayvaanShrikeKayvaanShrikeUnitModel,
  ] satisfies UnitModelConfig[],
};
