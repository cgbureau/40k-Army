import type {
  SeedDataset,
  UnitProfileStatConfig,
} from "../../../../types/_index.types";
import { unitProfileId, unitProfileStatId } from "../../../ids";

/**
 * 10th edition unit profile stat rows owned by `salamanders`.
 * Generated from BSData Unit profile characteristics.
 */

export const AdraxAgatone10eAdraxAgatoneLdUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("adrax_agatone__10e__adrax_agatone__ld"),
  unit_profile_id: unitProfileId("adrax_agatone__10e__adrax_agatone"),
  stat_key: "Ld",
  stat_value: "6+",
};


export const AdraxAgatone10eAdraxAgatoneMUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("adrax_agatone__10e__adrax_agatone__m"),
  unit_profile_id: unitProfileId("adrax_agatone__10e__adrax_agatone"),
  stat_key: "M",
  stat_value: "6\"",
};


export const AdraxAgatone10eAdraxAgatoneOcUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("adrax_agatone__10e__adrax_agatone__oc"),
  unit_profile_id: unitProfileId("adrax_agatone__10e__adrax_agatone"),
  stat_key: "OC",
  stat_value: "1",
};


export const AdraxAgatone10eAdraxAgatoneSvUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("adrax_agatone__10e__adrax_agatone__sv"),
  unit_profile_id: unitProfileId("adrax_agatone__10e__adrax_agatone"),
  stat_key: "Sv",
  stat_value: "2+",
};


export const AdraxAgatone10eAdraxAgatoneTUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("adrax_agatone__10e__adrax_agatone__t"),
  unit_profile_id: unitProfileId("adrax_agatone__10e__adrax_agatone"),
  stat_key: "T",
  stat_value: "4",
};


export const AdraxAgatone10eAdraxAgatoneWUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("adrax_agatone__10e__adrax_agatone__w"),
  unit_profile_id: unitProfileId("adrax_agatone__10e__adrax_agatone"),
  stat_key: "W",
  stat_value: "5",
};


export const VulkanHestan10eVulkanHestanLdUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("vulkan_hestan__10e__vulkan_hestan__ld"),
  unit_profile_id: unitProfileId("vulkan_hestan__10e__vulkan_hestan"),
  stat_key: "Ld",
  stat_value: "6+",
};


export const VulkanHestan10eVulkanHestanMUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("vulkan_hestan__10e__vulkan_hestan__m"),
  unit_profile_id: unitProfileId("vulkan_hestan__10e__vulkan_hestan"),
  stat_key: "M",
  stat_value: "6\"",
};


export const VulkanHestan10eVulkanHestanOcUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("vulkan_hestan__10e__vulkan_hestan__oc"),
  unit_profile_id: unitProfileId("vulkan_hestan__10e__vulkan_hestan"),
  stat_key: "OC",
  stat_value: "1",
};


export const VulkanHestan10eVulkanHestanSvUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("vulkan_hestan__10e__vulkan_hestan__sv"),
  unit_profile_id: unitProfileId("vulkan_hestan__10e__vulkan_hestan"),
  stat_key: "Sv",
  stat_value: "2+",
};


export const VulkanHestan10eVulkanHestanTUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("vulkan_hestan__10e__vulkan_hestan__t"),
  unit_profile_id: unitProfileId("vulkan_hestan__10e__vulkan_hestan"),
  stat_key: "T",
  stat_value: "4",
};


export const VulkanHestan10eVulkanHestanWUnitProfileStat: UnitProfileStatConfig = {
  id: unitProfileStatId("vulkan_hestan__10e__vulkan_hestan__w"),
  unit_profile_id: unitProfileId("vulkan_hestan__10e__vulkan_hestan"),
  stat_key: "W",
  stat_value: "5",
};


export const salamandersUnitProfileStats10e: SeedDataset<"unit_profile_stats"> = {
  table: "unit_profile_stats",
  records: [
    AdraxAgatone10eAdraxAgatoneLdUnitProfileStat,
    AdraxAgatone10eAdraxAgatoneMUnitProfileStat,
    AdraxAgatone10eAdraxAgatoneOcUnitProfileStat,
    AdraxAgatone10eAdraxAgatoneSvUnitProfileStat,
    AdraxAgatone10eAdraxAgatoneTUnitProfileStat,
    AdraxAgatone10eAdraxAgatoneWUnitProfileStat,
    VulkanHestan10eVulkanHestanLdUnitProfileStat,
    VulkanHestan10eVulkanHestanMUnitProfileStat,
    VulkanHestan10eVulkanHestanOcUnitProfileStat,
    VulkanHestan10eVulkanHestanSvUnitProfileStat,
    VulkanHestan10eVulkanHestanTUnitProfileStat,
    VulkanHestan10eVulkanHestanWUnitProfileStat,
  ] satisfies UnitProfileStatConfig[],
};
