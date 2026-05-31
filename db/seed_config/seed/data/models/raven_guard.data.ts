import type {
  ModelConfig,
  SeedDataset,
} from "../../../types/_index.types";
import { modelId } from "../../ids";

/**
 * Physical model identities owned by `raven_guard`.
 * Generated from BSData model selection entries.
 */

export const AethonShaanModel: ModelConfig = {
  id: modelId("aethon_shaan"),
  model_slug: "aethon_shaan",
  model_name: "Aethon Shaan",
};


export const KayvaanShrikeModel: ModelConfig = {
  id: modelId("kayvaan_shrike"),
  model_slug: "kayvaan_shrike",
  model_name: "Kayvaan Shrike",
};


export const ravenGuardModels: SeedDataset<"models"> = {
  table: "models",
  records: [
    AethonShaanModel,
    KayvaanShrikeModel,
  ] satisfies ModelConfig[],
};
