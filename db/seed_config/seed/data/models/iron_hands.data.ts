import type {
  ModelConfig,
  SeedDataset,
} from "../../../types/_index.types";
import { modelId } from "../../ids";

/**
 * Physical model identities owned by `iron_hands`.
 * Generated from BSData model selection entries.
 */

export const CaanokVarModel: ModelConfig = {
  id: modelId("caanok_var"),
  model_slug: "caanok_var",
  model_name: "Caanok Var",
};


export const IronFatherFeirrosModel: ModelConfig = {
  id: modelId("iron_father_feirros"),
  model_slug: "iron_father_feirros",
  model_name: "Iron Father Feirros",
};


export const ironHandsModels: SeedDataset<"models"> = {
  table: "models",
  records: [
    CaanokVarModel,
    IronFatherFeirrosModel,
  ] satisfies ModelConfig[],
};
