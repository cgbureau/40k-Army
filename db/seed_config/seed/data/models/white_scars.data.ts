import type {
  ModelConfig,
  SeedDataset,
} from "../../../types/_index.types";
import { modelId } from "../../ids";

/**
 * Physical model identities owned by `white_scars`.
 * Generated from BSData model selection entries.
 */

export const KorsarroKhanModel: ModelConfig = {
  id: modelId("korsarro_khan"),
  model_slug: "korsarro_khan",
  model_name: "Kor'sarro Khan",
};


export const SubodenKhanModel: ModelConfig = {
  id: modelId("suboden_khan"),
  model_slug: "suboden_khan",
  model_name: "Suboden Khan",
};


export const whiteScarsModels: SeedDataset<"models"> = {
  table: "models",
  records: [
    KorsarroKhanModel,
    SubodenKhanModel,
  ] satisfies ModelConfig[],
};
