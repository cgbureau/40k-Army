import type {
  ModelConfig,
  SeedDataset,
} from "../../../types/_index.types";
import { modelId } from "../../ids";

/**
 * Physical model identities owned by `imperial_knights`.
 * Generated from BSData model selection entries.
 */

export const AcastusKnightAsteriusModel: ModelConfig = {
  id: modelId("acastus_knight_asterius"),
  model_slug: "acastus_knight_asterius",
  model_name: "Acastus Knight Asterius",
};


export const AcastusKnightPorphyrionModel: ModelConfig = {
  id: modelId("acastus_knight_porphyrion"),
  model_slug: "acastus_knight_porphyrion",
  model_name: "Acastus Knight Porphyrion",
};


export const ArmigerHelverinModel: ModelConfig = {
  id: modelId("armiger_helverin"),
  model_slug: "armiger_helverin",
  model_name: "Armiger Helverin",
};


export const ArmigerMoiraxModel: ModelConfig = {
  id: modelId("armiger_moirax"),
  model_slug: "armiger_moirax",
  model_name: "Armiger Moirax",
};


export const ArmigerWarglaiveModel: ModelConfig = {
  id: modelId("armiger_warglaive"),
  model_slug: "armiger_warglaive",
  model_name: "Armiger Warglaive",
};


export const CanisRexModel: ModelConfig = {
  id: modelId("canis_rex"),
  model_slug: "canis_rex",
  model_name: "Canis Rex",
};


export const CerastusKnightAcheronModel: ModelConfig = {
  id: modelId("cerastus_knight_acheron"),
  model_slug: "cerastus_knight_acheron",
  model_name: "Cerastus Knight Acheron",
};


export const CerastusKnightAtraposModel: ModelConfig = {
  id: modelId("cerastus_knight_atrapos"),
  model_slug: "cerastus_knight_atrapos",
  model_name: "Cerastus Knight Atrapos",
};


export const CerastusKnightCastigatorModel: ModelConfig = {
  id: modelId("cerastus_knight_castigator"),
  model_slug: "cerastus_knight_castigator",
  model_name: "Cerastus Knight Castigator",
};


export const CerastusKnightLancerModel: ModelConfig = {
  id: modelId("cerastus_knight_lancer"),
  model_slug: "cerastus_knight_lancer",
  model_name: "Cerastus Knight Lancer",
};


export const KnightCastellanModel: ModelConfig = {
  id: modelId("knight_castellan"),
  model_slug: "knight_castellan",
  model_name: "Knight Castellan",
};


export const KnightCrusaderModel: ModelConfig = {
  id: modelId("knight_crusader"),
  model_slug: "knight_crusader",
  model_name: "Knight Crusader",
};


export const KnightDefenderModel: ModelConfig = {
  id: modelId("knight_defender"),
  model_slug: "knight_defender",
  model_name: "Knight Defender",
};


export const KnightDestrierModel: ModelConfig = {
  id: modelId("knight_destrier"),
  model_slug: "knight_destrier",
  model_name: "Knight Destrier",
};


export const KnightErrantModel: ModelConfig = {
  id: modelId("knight_errant"),
  model_slug: "knight_errant",
  model_name: "Knight Errant",
};


export const KnightGallantModel: ModelConfig = {
  id: modelId("knight_gallant"),
  model_slug: "knight_gallant",
  model_name: "Knight Gallant",
};


export const KnightPaladinModel: ModelConfig = {
  id: modelId("knight_paladin"),
  model_slug: "knight_paladin",
  model_name: "Knight Paladin",
};


export const KnightPreceptorModel: ModelConfig = {
  id: modelId("knight_preceptor"),
  model_slug: "knight_preceptor",
  model_name: "Knight Preceptor",
};


export const KnightValiantModel: ModelConfig = {
  id: modelId("knight_valiant"),
  model_slug: "knight_valiant",
  model_name: "Knight Valiant",
};


export const KnightWardenModel: ModelConfig = {
  id: modelId("knight_warden"),
  model_slug: "knight_warden",
  model_name: "Knight Warden",
};


export const QuestorisKnightMagaeraModel: ModelConfig = {
  id: modelId("questoris_knight_magaera"),
  model_slug: "questoris_knight_magaera",
  model_name: "Questoris Knight Magaera",
};


export const QuestorisKnightStyrixModel: ModelConfig = {
  id: modelId("questoris_knight_styrix"),
  model_slug: "questoris_knight_styrix",
  model_name: "Questoris Knight Styrix",
};


export const SirHekhturModel: ModelConfig = {
  id: modelId("sir_hekhtur"),
  model_slug: "sir_hekhtur",
  model_name: "Sir Hekhtur",
};


export const imperialKnightsModels: SeedDataset<"models"> = {
  table: "models",
  records: [
    AcastusKnightAsteriusModel,
    AcastusKnightPorphyrionModel,
    ArmigerHelverinModel,
    ArmigerMoiraxModel,
    ArmigerWarglaiveModel,
    CanisRexModel,
    CerastusKnightAcheronModel,
    CerastusKnightAtraposModel,
    CerastusKnightCastigatorModel,
    CerastusKnightLancerModel,
    KnightCastellanModel,
    KnightCrusaderModel,
    KnightDefenderModel,
    KnightDestrierModel,
    KnightErrantModel,
    KnightGallantModel,
    KnightPaladinModel,
    KnightPreceptorModel,
    KnightValiantModel,
    KnightWardenModel,
    QuestorisKnightMagaeraModel,
    QuestorisKnightStyrixModel,
    SirHekhturModel,
  ] satisfies ModelConfig[],
};
