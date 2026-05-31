import type {
  ModelConfig,
  SeedDataset,
} from "../../../types/_index.types";
import { modelId } from "../../ids";

/**
 * Physical model identities owned by `emperors_children`.
 * Generated from BSData model selection entries.
 */

export const BlissbringerModel: ModelConfig = {
  id: modelId("blissbringer"),
  model_slug: "blissbringer",
  model_name: "Blissbringer",
};


export const ChampionOfExcessCrucibleModel: ModelConfig = {
  id: modelId("champion_of_excess_crucible"),
  model_slug: "champion_of_excess_crucible",
  model_name: "Champion of Excess [Crucible]",
};


export const DaemonPrinceOfSlaaneshModel: ModelConfig = {
  id: modelId("daemon_prince_of_slaanesh"),
  model_slug: "daemon_prince_of_slaanesh",
  model_name: "Daemon Prince of Slaanesh",
};


export const DaemonPrinceOfSlaaneshWithWingsModel: ModelConfig = {
  id: modelId("daemon_prince_of_slaanesh_with_wings"),
  model_slug: "daemon_prince_of_slaanesh_with_wings",
  model_name: "Daemon Prince of Slaanesh with Wings",
};


export const ExcruciatorCrucibleModel: ModelConfig = {
  id: modelId("excruciator_crucible"),
  model_slug: "excruciator_crucible",
  model_name: "Excruciator [Crucible]",
};


export const FlawlessBladeModel: ModelConfig = {
  id: modelId("flawless_blade"),
  model_slug: "flawless_blade",
  model_name: "Flawless Blade",
};


export const FlawlessChampionCrucibleModel: ModelConfig = {
  id: modelId("flawless_champion_crucible"),
  model_slug: "flawless_champion_crucible",
  model_name: "Flawless Champion [Crucible]",
};


export const FulgrimModel: ModelConfig = {
  id: modelId("fulgrim"),
  model_slug: "fulgrim",
  model_name: "Fulgrim",
};


export const InfractorModel: ModelConfig = {
  id: modelId("infractor"),
  model_slug: "infractor",
  model_name: "Infractor",
};


export const LordExultantModel: ModelConfig = {
  id: modelId("lord_exultant"),
  model_slug: "lord_exultant",
  model_name: "Lord Exultant",
};


export const LordKakophonistModel: ModelConfig = {
  id: modelId("lord_kakophonist"),
  model_slug: "lord_kakophonist",
  model_name: "Lord Kakophonist",
};


export const LuciusTheEternalModel: ModelConfig = {
  id: modelId("lucius_the_eternal"),
  model_slug: "lucius_the_eternal",
  model_name: "Lucius the Eternal",
};


export const ObsessionistModel: ModelConfig = {
  id: modelId("obsessionist"),
  model_slug: "obsessionist",
  model_name: "Obsessionist",
};


export const TormentorModel: ModelConfig = {
  id: modelId("tormentor"),
  model_slug: "tormentor",
  model_name: "Tormentor",
};


export const TormentorWMeltagunModel: ModelConfig = {
  id: modelId("tormentor_w_meltagun"),
  model_slug: "tormentor_w_meltagun",
  model_name: "Tormentor w/ meltagun",
};


export const TormentorWPlasmaGunModel: ModelConfig = {
  id: modelId("tormentor_w_plasma_gun"),
  model_slug: "tormentor_w_plasma_gun",
  model_name: "Tormentor w/ plasma gun",
};


export const emperorsChildrenModels: SeedDataset<"models"> = {
  table: "models",
  records: [
    BlissbringerModel,
    ChampionOfExcessCrucibleModel,
    DaemonPrinceOfSlaaneshModel,
    DaemonPrinceOfSlaaneshWithWingsModel,
    ExcruciatorCrucibleModel,
    FlawlessBladeModel,
    FlawlessChampionCrucibleModel,
    FulgrimModel,
    InfractorModel,
    LordExultantModel,
    LordKakophonistModel,
    LuciusTheEternalModel,
    ObsessionistModel,
    TormentorModel,
    TormentorWMeltagunModel,
    TormentorWPlasmaGunModel,
  ] satisfies ModelConfig[],
};
