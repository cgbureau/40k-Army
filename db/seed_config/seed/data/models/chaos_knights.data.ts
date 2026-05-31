import type {
  ModelConfig,
  SeedDataset,
} from "../../../types/_index.types";
import { modelId } from "../../ids";

/**
 * Physical model identities owned by `chaos_knights`.
 * Generated from BSData model selection entries.
 */

export const ChaosAcastusKnightAsteriusModel: ModelConfig = {
  id: modelId("chaos_acastus_knight_asterius"),
  model_slug: "chaos_acastus_knight_asterius",
  model_name: "Chaos Acastus Knight Asterius",
};


export const ChaosAcastusKnightPorphyrionModel: ModelConfig = {
  id: modelId("chaos_acastus_knight_porphyrion"),
  model_slug: "chaos_acastus_knight_porphyrion",
  model_name: "Chaos Acastus Knight Porphyrion",
};


export const ChaosCerastusKnightAcheronModel: ModelConfig = {
  id: modelId("chaos_cerastus_knight_acheron"),
  model_slug: "chaos_cerastus_knight_acheron",
  model_name: "Chaos Cerastus Knight Acheron",
};


export const ChaosCerastusKnightAtraposModel: ModelConfig = {
  id: modelId("chaos_cerastus_knight_atrapos"),
  model_slug: "chaos_cerastus_knight_atrapos",
  model_name: "Chaos Cerastus Knight Atrapos",
};


export const ChaosCerastusKnightCastigatorModel: ModelConfig = {
  id: modelId("chaos_cerastus_knight_castigator"),
  model_slug: "chaos_cerastus_knight_castigator",
  model_name: "Chaos Cerastus Knight Castigator",
};


export const ChaosCerastusKnightLancerModel: ModelConfig = {
  id: modelId("chaos_cerastus_knight_lancer"),
  model_slug: "chaos_cerastus_knight_lancer",
  model_name: "Chaos Cerastus Knight Lancer",
};


export const ChaosQuestorisKnightMagaeraModel: ModelConfig = {
  id: modelId("chaos_questoris_knight_magaera"),
  model_slug: "chaos_questoris_knight_magaera",
  model_name: "Chaos Questoris Knight Magaera",
};


export const ChaosQuestorisKnightStyrixModel: ModelConfig = {
  id: modelId("chaos_questoris_knight_styrix"),
  model_slug: "chaos_questoris_knight_styrix",
  model_name: "Chaos Questoris Knight Styrix",
};


export const KnightAbominantModel: ModelConfig = {
  id: modelId("knight_abominant"),
  model_slug: "knight_abominant",
  model_name: "Knight Abominant",
};


export const KnightDesecratorModel: ModelConfig = {
  id: modelId("knight_desecrator"),
  model_slug: "knight_desecrator",
  model_name: "Knight Desecrator",
};


export const KnightDespoilerModel: ModelConfig = {
  id: modelId("knight_despoiler"),
  model_slug: "knight_despoiler",
  model_name: "Knight Despoiler",
};


export const KnightRampagerModel: ModelConfig = {
  id: modelId("knight_rampager"),
  model_slug: "knight_rampager",
  model_name: "Knight Rampager",
};


export const KnightRuinatorModel: ModelConfig = {
  id: modelId("knight_ruinator"),
  model_slug: "knight_ruinator",
  model_name: "Knight Ruinator",
};


export const KnightTyrantModel: ModelConfig = {
  id: modelId("knight_tyrant"),
  model_slug: "knight_tyrant",
  model_name: "Knight Tyrant",
};


export const WarDogBrigandModel: ModelConfig = {
  id: modelId("war_dog_brigand"),
  model_slug: "war_dog_brigand",
  model_name: "War Dog Brigand",
};


export const WarDogExecutionerModel: ModelConfig = {
  id: modelId("war_dog_executioner"),
  model_slug: "war_dog_executioner",
  model_name: "War Dog Executioner",
};


export const WarDogHuntsmanModel: ModelConfig = {
  id: modelId("war_dog_huntsman"),
  model_slug: "war_dog_huntsman",
  model_name: "War Dog Huntsman",
};


export const WarDogKarnivoreModel: ModelConfig = {
  id: modelId("war_dog_karnivore"),
  model_slug: "war_dog_karnivore",
  model_name: "War Dog Karnivore",
};


export const WarDogMoiraxModel: ModelConfig = {
  id: modelId("war_dog_moirax"),
  model_slug: "war_dog_moirax",
  model_name: "War Dog Moirax",
};


export const WarDogStalkerModel: ModelConfig = {
  id: modelId("war_dog_stalker"),
  model_slug: "war_dog_stalker",
  model_name: "War Dog Stalker",
};


export const chaosKnightsModels: SeedDataset<"models"> = {
  table: "models",
  records: [
    ChaosAcastusKnightAsteriusModel,
    ChaosAcastusKnightPorphyrionModel,
    ChaosCerastusKnightAcheronModel,
    ChaosCerastusKnightAtraposModel,
    ChaosCerastusKnightCastigatorModel,
    ChaosCerastusKnightLancerModel,
    ChaosQuestorisKnightMagaeraModel,
    ChaosQuestorisKnightStyrixModel,
    KnightAbominantModel,
    KnightDesecratorModel,
    KnightDespoilerModel,
    KnightRampagerModel,
    KnightRuinatorModel,
    KnightTyrantModel,
    WarDogBrigandModel,
    WarDogExecutionerModel,
    WarDogHuntsmanModel,
    WarDogKarnivoreModel,
    WarDogMoiraxModel,
    WarDogStalkerModel,
  ] satisfies ModelConfig[],
};
