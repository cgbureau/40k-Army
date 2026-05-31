import type {
  SeedDataset,
  UnitPointCostConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, unitId, unitPointCostId } from "../../../ids";

/**
 * 10th edition unit point cost rows owned by `imperial_fists`.
 * Generated from BSData point cost values and modifiers.
 */

export const DarnathLysander10e1mPointCost: UnitPointCostConfig = {
  id: unitPointCostId("darnath_lysander__10e__1m"),
  unit_point_cost_slug: "darnath_lysander__10e__1m",
  unit_id: unitId("darnath_lysander"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  unit_points: 100,
  effective_date: new Date("2024-01-01"),
  superseded_date: null,
};


export const PedroKantor10e1mPointCost: UnitPointCostConfig = {
  id: unitPointCostId("pedro_kantor__10e__1m"),
  unit_point_cost_slug: "pedro_kantor__10e__1m",
  unit_id: unitId("pedro_kantor"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  unit_points: 90,
  effective_date: new Date("2024-01-01"),
  superseded_date: null,
};


export const TorGaradon10e1mPointCost: UnitPointCostConfig = {
  id: unitPointCostId("tor_garadon__10e__1m"),
  unit_point_cost_slug: "tor_garadon__10e__1m",
  unit_id: unitId("tor_garadon"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  unit_points: 90,
  effective_date: new Date("2024-01-01"),
  superseded_date: null,
};


export const imperialFistsUnitPointCosts10e: SeedDataset<"unit_point_costs"> = {
  table: "unit_point_costs",
  records: [
    DarnathLysander10e1mPointCost,
    PedroKantor10e1mPointCost,
    TorGaradon10e1mPointCost,
  ] satisfies UnitPointCostConfig[],
};
