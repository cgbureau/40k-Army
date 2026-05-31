import type {
  SeedDataset,
  UnitPointCostConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, unitId, unitPointCostId } from "../../../ids";

/**
 * 10th edition unit point cost rows owned by `iron_hands`.
 * Generated from BSData point cost values and modifiers.
 */

export const CaanokVar10e1mPointCost: UnitPointCostConfig = {
  id: unitPointCostId("caanok_var__10e__1m"),
  unit_point_cost_slug: "caanok_var__10e__1m",
  unit_id: unitId("caanok_var"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  unit_points: 100,
  effective_date: new Date("2024-01-01"),
  superseded_date: null,
};


export const IronFatherFeirros10e1mPointCost: UnitPointCostConfig = {
  id: unitPointCostId("iron_father_feirros__10e__1m"),
  unit_point_cost_slug: "iron_father_feirros__10e__1m",
  unit_id: unitId("iron_father_feirros"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  unit_points: 95,
  effective_date: new Date("2024-01-01"),
  superseded_date: null,
};


export const ironHandsUnitPointCosts10e: SeedDataset<"unit_point_costs"> = {
  table: "unit_point_costs",
  records: [
    CaanokVar10e1mPointCost,
    IronFatherFeirros10e1mPointCost,
  ] satisfies UnitPointCostConfig[],
};
