import type {
  ModelConfig,
  SeedDataset,
} from "../../../types/_index.types";
import { modelId } from "../../ids";

/**
 * Physical model identities owned by `thousand_sons`.
 * Generated from BSData model selection entries.
 */

export const AhrimanModel: ModelConfig = {
  id: modelId("ahriman"),
  model_slug: "ahriman",
  model_name: "Ahriman",
};


export const AviarchModel: ModelConfig = {
  id: modelId("aviarch"),
  model_slug: "aviarch",
  model_name: "Aviarch",
};


export const BrayherdChieftainCrucibleModel: ModelConfig = {
  id: modelId("brayherd_chieftain_crucible"),
  model_slug: "brayherd_chieftain_crucible",
  model_name: "Brayherd Chieftain [Crucible]",
};


export const BrayherdShamanCrucibleModel: ModelConfig = {
  id: modelId("brayherd_shaman_crucible"),
  model_slug: "brayherd_shaman_crucible",
  model_name: "Brayherd Shaman [Crucible]",
};


export const DaemonPrinceOfTzeentchModel: ModelConfig = {
  id: modelId("daemon_prince_of_tzeentch"),
  model_slug: "daemon_prince_of_tzeentch",
  model_name: "Daemon Prince of Tzeentch",
};


export const DaemonPrinceOfTzeentchWithWingsModel: ModelConfig = {
  id: modelId("daemon_prince_of_tzeentch_with_wings"),
  model_slug: "daemon_prince_of_tzeentch_with_wings",
  model_name: "Daemon Prince of Tzeentch with wings",
};


export const DiviningSpearEnlightenedModel: ModelConfig = {
  id: modelId("divining_spear_enlightened"),
  model_slug: "divining_spear_enlightened",
  model_name: "Divining spear Enlightened",
};


export const EnlightenedModel: ModelConfig = {
  id: modelId("enlightened"),
  model_slug: "enlightened",
  model_name: "Enlightened",
};


export const ExaltedSorcererModel: ModelConfig = {
  id: modelId("exalted_sorcerer"),
  model_slug: "exalted_sorcerer",
  model_name: "Exalted Sorcerer",
};


export const ExaltedSorcererOnDiscOfTzeentchModel: ModelConfig = {
  id: modelId("exalted_sorcerer_on_disc_of_tzeentch"),
  model_slug: "exalted_sorcerer_on_disc_of_tzeentch",
  model_name: "Exalted Sorcerer on Disc of Tzeentch",
};


export const InfernalMasterModel: ModelConfig = {
  id: modelId("infernal_master"),
  model_slug: "infernal_master",
  model_name: "Infernal Master",
};


export const MagisterCrucibleModel: ModelConfig = {
  id: modelId("magister_crucible"),
  model_slug: "magister_crucible",
  model_name: "Magister [Crucible]",
};


export const MagnusTheRedModel: ModelConfig = {
  id: modelId("magnus_the_red"),
  model_slug: "magnus_the_red",
  model_name: "Magnus the Red",
};


export const MutalithVortexBeastModel: ModelConfig = {
  id: modelId("mutalith_vortex_beast"),
  model_slug: "mutalith_vortex_beast",
  model_name: "Mutalith Vortex Beast",
};


export const PistolAndChainswordEnlightenedModel: ModelConfig = {
  id: modelId("pistol_and_chainsword_enlightened"),
  model_slug: "pistol_and_chainsword_enlightened",
  model_name: "Pistol and chainsword Enlightened",
};


export const ScarabOccultSorcererModel: ModelConfig = {
  id: modelId("scarab_occult_sorcerer"),
  model_slug: "scarab_occult_sorcerer",
  model_name: "Scarab Occult Sorcerer",
};


export const ScarabOccultTerminatorModel: ModelConfig = {
  id: modelId("scarab_occult_terminator"),
  model_slug: "scarab_occult_terminator",
  model_name: "Scarab Occult Terminator",
};


export const ScarabOccultTerminatorWHeavyWarpflamerModel: ModelConfig = {
  id: modelId("scarab_occult_terminator_w_heavy_warpflamer"),
  model_slug: "scarab_occult_terminator_w_heavy_warpflamer",
  model_name: "Scarab Occult Terminator w/ heavy warpflamer",
};


export const ScarabOccultTerminatorWSoulreaperCannonModel: ModelConfig = {
  id: modelId("scarab_occult_terminator_w_soulreaper_cannon"),
  model_slug: "scarab_occult_terminator_w_soulreaper_cannon",
  model_name: "Scarab Occult Terminator w/ soulreaper cannon",
};


export const SekhetarRobotWPyrefluxMeltagunModel: ModelConfig = {
  id: modelId("sekhetar_robot_w_pyreflux_meltagun"),
  model_slug: "sekhetar_robot_w_pyreflux_meltagun",
  model_name: "Sekhetar Robot w/ pyreflux meltagun",
};


export const SekhetarRobotWWarpflameProjectorAndClawModel: ModelConfig = {
  id: modelId("sekhetar_robot_w_warpflame_projector_and_claw"),
  model_slug: "sekhetar_robot_w_warpflame_projector_and_claw",
  model_name: "Sekhetar Robot w/ warpflame projector and claw",
};


export const TwistbrayModel: ModelConfig = {
  id: modelId("twistbray"),
  model_slug: "twistbray",
  model_name: "Twistbray",
};


export const TzaangorShamanModel: ModelConfig = {
  id: modelId("tzaangor_shaman"),
  model_slug: "tzaangor_shaman",
  model_name: "Tzaangor Shaman",
};


export const TzaangorWPistolAndChainswordModel: ModelConfig = {
  id: modelId("tzaangor_w_pistol_and_chainsword"),
  model_slug: "tzaangor_w_pistol_and_chainsword",
  model_name: "Tzaangor w/ pistol and chainsword",
};


export const TzaangorWTzaangorBladesModel: ModelConfig = {
  id: modelId("tzaangor_w_tzaangor_blades"),
  model_slug: "tzaangor_w_tzaangor_blades",
  model_name: "Tzaangor w/ Tzaangor blades",
};


export const thousandSonsModels: SeedDataset<"models"> = {
  table: "models",
  records: [
    AhrimanModel,
    AviarchModel,
    BrayherdChieftainCrucibleModel,
    BrayherdShamanCrucibleModel,
    DaemonPrinceOfTzeentchModel,
    DaemonPrinceOfTzeentchWithWingsModel,
    DiviningSpearEnlightenedModel,
    EnlightenedModel,
    ExaltedSorcererModel,
    ExaltedSorcererOnDiscOfTzeentchModel,
    InfernalMasterModel,
    MagisterCrucibleModel,
    MagnusTheRedModel,
    MutalithVortexBeastModel,
    PistolAndChainswordEnlightenedModel,
    ScarabOccultSorcererModel,
    ScarabOccultTerminatorModel,
    ScarabOccultTerminatorWHeavyWarpflamerModel,
    ScarabOccultTerminatorWSoulreaperCannonModel,
    SekhetarRobotWPyrefluxMeltagunModel,
    SekhetarRobotWWarpflameProjectorAndClawModel,
    TwistbrayModel,
    TzaangorShamanModel,
    TzaangorWPistolAndChainswordModel,
    TzaangorWTzaangorBladesModel,
  ] satisfies ModelConfig[],
};
