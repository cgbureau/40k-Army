import type {
  ModelConfig,
  SeedDataset,
} from "../../../types/_index.types";
import { modelId } from "../../ids";

/**
 * Physical model identities owned by `ultramarines`.
 * Generated from BSData model selection entries.
 */

export const AemeliaMinervasModel: ModelConfig = {
  id: modelId("aemelia_minervas"),
  model_slug: "aemelia_minervas",
  model_name: "Aemelia Minervas",
};


export const AncientGadrielModel: ModelConfig = {
  id: modelId("ancient_gadriel"),
  model_slug: "ancient_gadriel",
  model_name: "Ancient Gadriel",
};


export const CaptainSicariusModel: ModelConfig = {
  id: modelId("captain_sicarius"),
  model_slug: "captain_sicarius",
  model_name: "Captain Sicarius",
};


export const CaptainTitusModel: ModelConfig = {
  id: modelId("captain_titus"),
  model_slug: "captain_titus",
  model_name: "Captain Titus",
};


export const CatoSicariusModel: ModelConfig = {
  id: modelId("cato_sicarius"),
  model_slug: "cato_sicarius",
  model_name: "Cato Sicarius",
};


export const ChaplainCassiusLegendsModel: ModelConfig = {
  id: modelId("chaplain_cassius_legends"),
  model_slug: "chaplain_cassius_legends",
  model_name: "Chaplain Cassius (Legends)",
};


export const ChapterAncientModel: ModelConfig = {
  id: modelId("chapter_ancient"),
  model_slug: "chapter_ancient",
  model_name: "Chapter Ancient",
};


export const ChapterChampionModel: ModelConfig = {
  id: modelId("chapter_champion"),
  model_slug: "chapter_champion",
  model_name: "Chapter Champion",
};


export const ChiefLibrarianTiguriusModel: ModelConfig = {
  id: modelId("chief_librarian_tigurius"),
  model_slug: "chief_librarian_tigurius",
  model_name: "Chief Librarian Tigurius",
};


export const DainalKorneliusModel: ModelConfig = {
  id: modelId("dainal_kornelius"),
  model_slug: "dainal_kornelius",
  model_name: "Dainal Kornelius",
};


export const FerrenAreiosLegendsModel: ModelConfig = {
  id: modelId("ferren_areios_legends"),
  model_slug: "ferren_areios_legends",
  model_name: "Ferren Areios (Legends)",
};


export const GaiusSilvaModel: ModelConfig = {
  id: modelId("gaius_silva"),
  model_slug: "gaius_silva",
  model_name: "Gaius Silva",
};


export const HonourGuardModel: ModelConfig = {
  id: modelId("honour_guard"),
  model_slug: "honour_guard",
  model_name: "Honour Guard",
};


export const LieutenantTitusModel: ModelConfig = {
  id: modelId("lieutenant_titus"),
  model_slug: "lieutenant_titus",
  model_name: "Lieutenant Titus",
};


export const LuciaVesthaModel: ModelConfig = {
  id: modelId("lucia_vestha"),
  model_slug: "lucia_vestha",
  model_name: "Lucia Vestha",
};


export const MarneusCalgarModel: ModelConfig = {
  id: modelId("marneus_calgar"),
  model_slug: "marneus_calgar",
  model_name: "Marneus Calgar",
};


export const MarneusCalgarInArmourOfAntilochusModel: ModelConfig = {
  id: modelId("marneus_calgar_in_armour_of_antilochus"),
  model_slug: "marneus_calgar_in_armour_of_antilochus",
  model_name: "Marneus Calgar in Armour of Antilochus",
};


export const RobouteGuillimanModel: ModelConfig = {
  id: modelId("roboute_guilliman"),
  model_slug: "roboute_guilliman",
  model_name: "Roboute Guilliman",
};


export const SergeantChronusLegendsModel: ModelConfig = {
  id: modelId("sergeant_chronus_legends"),
  model_slug: "sergeant_chronus_legends",
  model_name: "Sergeant Chronus (Legends)",
};


export const SergeantTelionLegendsModel: ModelConfig = {
  id: modelId("sergeant_telion_legends"),
  model_slug: "sergeant_telion_legends",
  model_name: "Sergeant Telion (Legends)",
};


export const TyrannicWarVeteranModel: ModelConfig = {
  id: modelId("tyrannic_war_veteran"),
  model_slug: "tyrannic_war_veteran",
  model_name: "Tyrannic War Veteran",
};


export const UrielVentrisModel: ModelConfig = {
  id: modelId("uriel_ventris"),
  model_slug: "uriel_ventris",
  model_name: "Uriel Ventris",
};


export const VeteranSergeantModel: ModelConfig = {
  id: modelId("veteran_sergeant"),
  model_slug: "veteran_sergeant",
  model_name: "Veteran Sergeant",
};


export const VeteranSergeantMetaurusModel: ModelConfig = {
  id: modelId("veteran_sergeant_metaurus"),
  model_slug: "veteran_sergeant_metaurus",
  model_name: "Veteran Sergeant Metaurus",
};


export const VictrixHonourGuardModel: ModelConfig = {
  id: modelId("victrix_honour_guard"),
  model_slug: "victrix_honour_guard",
  model_name: "Victrix Honour Guard",
};


export const ultramarinesModels: SeedDataset<"models"> = {
  table: "models",
  records: [
    AemeliaMinervasModel,
    AncientGadrielModel,
    CaptainSicariusModel,
    CaptainTitusModel,
    CatoSicariusModel,
    ChaplainCassiusLegendsModel,
    ChapterAncientModel,
    ChapterChampionModel,
    ChiefLibrarianTiguriusModel,
    DainalKorneliusModel,
    FerrenAreiosLegendsModel,
    GaiusSilvaModel,
    HonourGuardModel,
    LieutenantTitusModel,
    LuciaVesthaModel,
    MarneusCalgarModel,
    MarneusCalgarInArmourOfAntilochusModel,
    RobouteGuillimanModel,
    SergeantChronusLegendsModel,
    SergeantTelionLegendsModel,
    TyrannicWarVeteranModel,
    UrielVentrisModel,
    VeteranSergeantModel,
    VeteranSergeantMetaurusModel,
    VictrixHonourGuardModel,
  ] satisfies ModelConfig[],
};
