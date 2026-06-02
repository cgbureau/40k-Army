import type { SeedDataset, UnitConfig } from "../../../../types/_index.types";
import { unitId } from "../../../ids";

/**
 * 10th edition unit rows owned by `leagues_of_votann`.
 */

export const ArkanystEvaluatorUnit: UnitConfig = {
  id: unitId("arkanyst_evaluator"),
  unit_name: "Arkanyst Evaluator",
  unit_slug: "arkanyst_evaluator",
  is_legends: false,
};


export const BerehkStornbrWUnit: UnitConfig = {
  id: unitId("berehk_stornbr_w"),
  unit_name: "Berehk Stornbr\u00f6w",
  unit_slug: "berehk_stornbr_w",
  is_legends: false,
};


export const BrKhyrIronMasterUnit: UnitConfig = {
  id: unitId("br_khyr_iron_master"),
  unit_name: "Br\u00f4khyr Iron-master",
  unit_slug: "br_khyr_iron_master",
  is_legends: false,
};


export const BrKhyrThunderkynUnit: UnitConfig = {
  id: unitId("br_khyr_thunderkyn"),
  unit_name: "Br\u00f4khyr Thunderkyn",
  unit_slug: "br_khyr_thunderkyn",
  is_legends: false,
};


export const BuriAegnirssenUnit: UnitConfig = {
  id: unitId("buri_aegnirssen"),
  unit_name: "Buri Aegnirssen",
  unit_slug: "buri_aegnirssen",
  is_legends: false,
};


export const CthonianBeserksUnit: UnitConfig = {
  id: unitId("cthonian_beserks"),
  unit_name: "Cthonian Beserks",
  unit_slug: "cthonian_beserks",
  is_legends: false,
};


export const CthonianEarthshakersUnit: UnitConfig = {
  id: unitId("cthonian_earthshakers"),
  unit_name: "Cthonian Earthshakers",
  unit_slug: "cthonian_earthshakers",
  is_legends: false,
};


export const EinhyrChampionUnit: UnitConfig = {
  id: unitId("einhyr_champion"),
  unit_name: "Einhyr Champion",
  unit_slug: "einhyr_champion",
  is_legends: false,
};


export const EinhyrHearthguardUnit: UnitConfig = {
  id: unitId("einhyr_hearthguard"),
  unit_name: "Einhyr Hearthguard",
  unit_slug: "einhyr_hearthguard",
  is_legends: false,
};


export const GrimnyrUnit: UnitConfig = {
  id: unitId("grimnyr"),
  unit_name: "Grimnyr",
  unit_slug: "grimnyr",
  is_legends: false,
};


export const HearthkynWarriorsUnit: UnitConfig = {
  id: unitId("hearthkyn_warriors"),
  unit_name: "Hearthkyn Warriors",
  unit_slug: "hearthkyn_warriors",
  is_legends: false,
};


export const HekatonLandFortressUnit: UnitConfig = {
  id: unitId("hekaton_land_fortress"),
  unit_name: "Hekaton Land Fortress",
  unit_slug: "hekaton_land_fortress",
  is_legends: false,
};


export const HernkynPioneersUnit: UnitConfig = {
  id: unitId("hernkyn_pioneers"),
  unit_name: "Hernkyn Pioneers",
  unit_slug: "hernkyn_pioneers",
  is_legends: false,
};


export const HernkynYaegirsUnit: UnitConfig = {
  id: unitId("hernkyn_yaegirs"),
  unit_name: "Hernkyn Yaegirs",
  unit_slug: "hernkyn_yaegirs",
  is_legends: false,
};


export const IronkinSteeljacksWithHeavyVolkaniteDisintegratorsUnit: UnitConfig = {
  id: unitId("ironkin_steeljacks_with_heavy_volkanite_disintegrators"),
  unit_name: "Ironkin Steeljacks with Heavy Volkanite Disintegrators",
  unit_slug: "ironkin_steeljacks_with_heavy_volkanite_disintegrators",
  is_legends: false,
};


export const IronkinSteeljacksWithMeleeWeaponsUnit: UnitConfig = {
  id: unitId("ironkin_steeljacks_with_melee_weapons"),
  unit_name: "Ironkin Steeljacks with Melee Weapons",
  unit_slug: "ironkin_steeljacks_with_melee_weapons",
  is_legends: false,
};


export const KHlUnit: UnitConfig = {
  id: unitId("k_hl"),
  unit_name: "K\u00e2hl",
  unit_slug: "k_hl",
  is_legends: false,
};


export const KapricusCarrierUnit: UnitConfig = {
  id: unitId("kapricus_carrier"),
  unit_name: "Kapricus Carrier",
  unit_slug: "kapricus_carrier",
  is_legends: false,
};


export const KapricusDefendersUnit: UnitConfig = {
  id: unitId("kapricus_defenders"),
  unit_name: "Kapricus Defenders",
  unit_slug: "kapricus_defenders",
  is_legends: false,
};


export const KinhostCommanderCrucibleUnit: UnitConfig = {
  id: unitId("kinhost_commander_crucible"),
  unit_name: "Kinhost Commander [Crucible]",
  unit_slug: "kinhost_commander_crucible",
  is_legends: false,
};


export const LivingAncestorCrucibleUnit: UnitConfig = {
  id: unitId("living_ancestor_crucible"),
  unit_name: "Living Ancestor [Crucible]",
  unit_slug: "living_ancestor_crucible",
  is_legends: false,
};


export const MemnyrStrategistUnit: UnitConfig = {
  id: unitId("memnyr_strategist"),
  unit_name: "Memnyr Strategist",
  unit_slug: "memnyr_strategist",
  is_legends: false,
};


export const SagitaurUnit: UnitConfig = {
  id: unitId("sagitaur"),
  unit_name: "Sagitaur",
  unit_slug: "sagitaur",
  is_legends: false,
};


export const SteeljackElderCrucibleUnit: UnitConfig = {
  id: unitId("steeljack_elder_crucible"),
  unit_name: "Steeljack Elder [Crucible]",
  unit_slug: "steeljack_elder_crucible",
  is_legends: false,
};


export const TharTheDestinedUnit: UnitConfig = {
  id: unitId("thar_the_destined"),
  unit_name: "\u00dbthar the Destined",
  unit_slug: "thar_the_destined",
  is_legends: false,
};


export const leaguesOfVotannUnits10e: SeedDataset<"units"> = {
  table: "units",
  records: [
    ArkanystEvaluatorUnit,
    BerehkStornbrWUnit,
    BrKhyrIronMasterUnit,
    BrKhyrThunderkynUnit,
    BuriAegnirssenUnit,
    CthonianBeserksUnit,
    CthonianEarthshakersUnit,
    EinhyrChampionUnit,
    EinhyrHearthguardUnit,
    GrimnyrUnit,
    HearthkynWarriorsUnit,
    HekatonLandFortressUnit,
    HernkynPioneersUnit,
    HernkynYaegirsUnit,
    IronkinSteeljacksWithHeavyVolkaniteDisintegratorsUnit,
    IronkinSteeljacksWithMeleeWeaponsUnit,
    KHlUnit,
    KapricusCarrierUnit,
    KapricusDefendersUnit,
    KinhostCommanderCrucibleUnit,
    LivingAncestorCrucibleUnit,
    MemnyrStrategistUnit,
    SagitaurUnit,
    SteeljackElderCrucibleUnit,
    TharTheDestinedUnit,
  ] satisfies UnitConfig[],
};
