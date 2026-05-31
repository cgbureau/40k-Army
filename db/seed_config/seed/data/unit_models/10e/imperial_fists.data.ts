import type {
  SeedDataset,
  UnitModelConfig,
} from "../../../../types/_index.types";
import { modelId, unitId, unitModelId } from "../../../ids";

/**
 * 10th edition unit model rows owned by `imperial_fists`.
 * Generated from BSData model selection entries.
 */

export const DarnathLysanderDarnathLysanderUnitModel: UnitModelConfig = {
  id: unitModelId("darnath_lysander__darnath_lysander"),
  unit_id: unitId("darnath_lysander"),
  model_id: modelId("darnath_lysander"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  effective_date: null,
  superseded_date: null,
};


export const PedroKantorPedroKantorUnitModel: UnitModelConfig = {
  id: unitModelId("pedro_kantor__pedro_kantor"),
  unit_id: unitId("pedro_kantor"),
  model_id: modelId("pedro_kantor"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  effective_date: null,
  superseded_date: null,
};


export const TorGaradonTorGaradonUnitModel: UnitModelConfig = {
  id: unitModelId("tor_garadon__tor_garadon"),
  unit_id: unitId("tor_garadon"),
  model_id: modelId("tor_garadon"),
  minimum_model_count: 1,
  maximum_model_count: 1,
  effective_date: null,
  superseded_date: null,
};


export const imperialFistsUnitModels10e: SeedDataset<"unit_models"> = {
  table: "unit_models",
  records: [
    DarnathLysanderDarnathLysanderUnitModel,
    PedroKantorPedroKantorUnitModel,
    TorGaradonTorGaradonUnitModel,
  ] satisfies UnitModelConfig[],
};
