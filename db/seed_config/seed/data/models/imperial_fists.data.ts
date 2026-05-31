import type {
  ModelConfig,
  SeedDataset,
} from "../../../types/_index.types";
import { modelId } from "../../ids";

/**
 * Physical model identities owned by `imperial_fists`.
 * Generated from BSData model selection entries.
 */

export const DarnathLysanderModel: ModelConfig = {
  id: modelId("darnath_lysander"),
  model_slug: "darnath_lysander",
  model_name: "Darnath Lysander",
};


export const PedroKantorModel: ModelConfig = {
  id: modelId("pedro_kantor"),
  model_slug: "pedro_kantor",
  model_name: "Pedro Kantor",
};


export const TorGaradonModel: ModelConfig = {
  id: modelId("tor_garadon"),
  model_slug: "tor_garadon",
  model_name: "Tor Garadon",
};


export const imperialFistsModels: SeedDataset<"models"> = {
  table: "models",
  records: [
    DarnathLysanderModel,
    PedroKantorModel,
    TorGaradonModel,
  ] satisfies ModelConfig[],
};
