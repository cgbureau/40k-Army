import type {
  SeedDataset,
  UnitPointCostConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, unitId, unitPointCostId } from "../../../ids";

/**
 * 10th edition unit point cost rows owned by `raven_guard`.
 * Generated from BSData point cost values and modifiers.
 */

export const AethonShaan10e1mPointCost: UnitPointCostConfig = {
  id: unitPointCostId("aethon_shaan__10e__1m"),
  unit_point_cost_slug: "aethon_shaan__10e__1m",
  unit_id: unitId("aethon_shaan"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  unit_points: 110,
  effective_date: new Date("2024-01-01"),
  superseded_date: null,
};


export const KayvaanShrike10e1mPointCost: UnitPointCostConfig = {
  id: unitPointCostId("kayvaan_shrike__10e__1m"),
  unit_point_cost_slug: "kayvaan_shrike__10e__1m",
  unit_id: unitId("kayvaan_shrike"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  unit_points: 100,
  effective_date: new Date("2024-01-01"),
  superseded_date: null,
};


export const ravenGuardUnitPointCosts10e: SeedDataset<"unit_point_costs"> = {
  table: "unit_point_costs",
  records: [
    AethonShaan10e1mPointCost,
    KayvaanShrike10e1mPointCost,
  ] satisfies UnitPointCostConfig[],
};
