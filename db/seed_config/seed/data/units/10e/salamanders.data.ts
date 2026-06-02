import type { SeedDataset, UnitConfig } from "../../../../types/_index.types";
import { unitId } from "../../../ids";

/**
 * 10th edition unit rows owned by `salamanders`.
 */

export const AdraxAgatoneUnit: UnitConfig = {
  id: unitId("adrax_agatone"),
  unit_name: "Adrax Agatone",
  unit_slug: "adrax_agatone",
  is_legends: false,
};


export const VulkanHestanUnit: UnitConfig = {
  id: unitId("vulkan_hestan"),
  unit_name: "Vulkan He'stan",
  unit_slug: "vulkan_hestan",
  is_legends: false,
};


export const salamandersUnits10e: SeedDataset<"units"> = {
  table: "units",
  records: [
    AdraxAgatoneUnit,
    VulkanHestanUnit,
  ] satisfies UnitConfig[],
};
