import type {
  SeedDataset,
  UnitModelConfig,
} from "../../../../types/_index.types";
import { modelId, unitId, unitModelId } from "../../../ids";

/**
 * 10th edition unit model rows owned by `salamanders`.
 * Generated from BSData model selection entries.
 */

export const AdraxAgatoneAdraxAgatoneUnitModel: UnitModelConfig = {
  id: unitModelId("adrax_agatone__adrax_agatone"),
  unit_id: unitId("adrax_agatone"),
  model_id: modelId("adrax_agatone"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  effective_date: null,
  superseded_date: null,
};


export const VulkanHestanVulkanHestanUnitModel: UnitModelConfig = {
  id: unitModelId("vulkan_hestan__vulkan_hestan"),
  unit_id: unitId("vulkan_hestan"),
  model_id: modelId("vulkan_hestan"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  effective_date: null,
  superseded_date: null,
};


export const salamandersUnitModels10e: SeedDataset<"unit_models"> = {
  table: "unit_models",
  records: [
    AdraxAgatoneAdraxAgatoneUnitModel,
    VulkanHestanVulkanHestanUnitModel,
  ] satisfies UnitModelConfig[],
};
