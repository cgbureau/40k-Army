import type {
  SeedDataset,
  UnitPointCostConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, unitId, unitPointCostId } from "../../../ids";

/**
 * 10th edition unit point cost rows owned by `salamanders`.
 * Generated from BSData point cost values and modifiers.
 */

export const AdraxAgatone10e1mPointCost: UnitPointCostConfig = {
  id: unitPointCostId("adrax_agatone__10e__1m"),
  unit_point_cost_slug: "adrax_agatone__10e__1m",
  unit_id: unitId("adrax_agatone"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  unit_points: 85,
  effective_date: new Date("2024-01-01"),
  superseded_date: null,
};


export const VulkanHestan10e1mPointCost: UnitPointCostConfig = {
  id: unitPointCostId("vulkan_hestan__10e__1m"),
  unit_point_cost_slug: "vulkan_hestan__10e__1m",
  unit_id: unitId("vulkan_hestan"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  unit_points: 100,
  effective_date: new Date("2024-01-01"),
  superseded_date: null,
};


export const salamandersUnitPointCosts10e: SeedDataset<"unit_point_costs"> = {
  table: "unit_point_costs",
  records: [
    AdraxAgatone10e1mPointCost,
    VulkanHestan10e1mPointCost,
  ] satisfies UnitPointCostConfig[],
};
