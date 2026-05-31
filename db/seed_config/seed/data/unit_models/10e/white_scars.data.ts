import type {
  SeedDataset,
  UnitModelConfig,
} from "../../../../types/_index.types";
import { modelId, unitId, unitModelId } from "../../../ids";

/**
 * 10th edition unit model rows owned by `white_scars`.
 * Generated from BSData model selection entries.
 */

export const KorsarroKhanKorsarroKhanUnitModel: UnitModelConfig = {
  id: unitModelId("korsarro_khan__korsarro_khan"),
  unit_id: unitId("korsarro_khan"),
  model_id: modelId("korsarro_khan"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  effective_date: null,
  superseded_date: null,
};


export const SubodenKhanSubodenKhanUnitModel: UnitModelConfig = {
  id: unitModelId("suboden_khan__suboden_khan"),
  unit_id: unitId("suboden_khan"),
  model_id: modelId("suboden_khan"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  effective_date: null,
  superseded_date: null,
};


export const whiteScarsUnitModels10e: SeedDataset<"unit_models"> = {
  table: "unit_models",
  records: [
    KorsarroKhanKorsarroKhanUnitModel,
    SubodenKhanSubodenKhanUnitModel,
  ] satisfies UnitModelConfig[],
};
