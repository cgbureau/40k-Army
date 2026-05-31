import type {
  SeedDataset,
  UnitPointCostConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, unitId, unitPointCostId } from "../../../ids";

/**
 * 10th edition unit point cost rows owned by `white_scars`.
 * Generated from BSData point cost values and modifiers.
 */

export const KorsarroKhan10e1mPointCost: UnitPointCostConfig = {
  id: unitPointCostId("korsarro_khan__10e__1m"),
  unit_point_cost_slug: "korsarro_khan__10e__1m",
  unit_id: unitId("korsarro_khan"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  unit_points: 60,
  effective_date: new Date("2024-01-01"),
  superseded_date: null,
};


export const SubodenKhan10e1mPointCost: UnitPointCostConfig = {
  id: unitPointCostId("suboden_khan__10e__1m"),
  unit_point_cost_slug: "suboden_khan__10e__1m",
  unit_id: unitId("suboden_khan"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  unit_points: 115,
  effective_date: new Date("2024-01-01"),
  superseded_date: null,
};


export const whiteScarsUnitPointCosts10e: SeedDataset<"unit_point_costs"> = {
  table: "unit_point_costs",
  records: [
    KorsarroKhan10e1mPointCost,
    SubodenKhan10e1mPointCost,
  ] satisfies UnitPointCostConfig[],
};
