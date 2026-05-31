import type {
  ModelConfig,
  SeedDataset,
} from "../../../types/_index.types";
import { modelId } from "../../ids";

/**
 * Physical model identities owned by `salamanders`.
 * Generated from BSData model selection entries.
 */

export const AdraxAgatoneModel: ModelConfig = {
  id: modelId("adrax_agatone"),
  model_slug: "adrax_agatone",
  model_name: "Adrax Agatone",
};


export const VulkanHestanModel: ModelConfig = {
  id: modelId("vulkan_hestan"),
  model_slug: "vulkan_hestan",
  model_name: "Vulkan He'stan",
};


export const salamandersModels: SeedDataset<"models"> = {
  table: "models",
  records: [
    AdraxAgatoneModel,
    VulkanHestanModel,
  ] satisfies ModelConfig[],
};
