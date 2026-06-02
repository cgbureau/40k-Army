import type { SeedDataset, UnitConfig } from "../../../../types/_index.types";
import { unitId } from "../../../ids";

/**
 * 10th edition unit rows owned by `grey_knights`.
 */

export const BrotherCaptainUnit: UnitConfig = {
  id: unitId("brother_captain"),
  unit_name: "Brother-Captain",
  unit_slug: "brother_captain",
  is_legends: false,
};


export const BrotherCaptainSternUnit: UnitConfig = {
  id: unitId("brother_captain_stern"),
  unit_name: "Brother-Captain Stern (Legends)",
  unit_slug: "brother_captain_stern",
  is_legends: false,
};


export const BrotherhoodChampionUnit: UnitConfig = {
  id: unitId("brotherhood_champion"),
  unit_name: "Brotherhood Champion",
  unit_slug: "brotherhood_champion",
  is_legends: false,
};


export const BrotherhoodChaplainUnit: UnitConfig = {
  id: unitId("brotherhood_chaplain"),
  unit_name: "Brotherhood Chaplain",
  unit_slug: "brotherhood_chaplain",
  is_legends: false,
};


export const BrotherhoodLibrarianUnit: UnitConfig = {
  id: unitId("brotherhood_librarian"),
  unit_name: "Brotherhood Librarian",
  unit_slug: "brotherhood_librarian",
  is_legends: false,
};


export const BrotherhoodTechmarineUnit: UnitConfig = {
  id: unitId("brotherhood_techmarine"),
  unit_name: "Brotherhood Techmarine",
  unit_slug: "brotherhood_techmarine",
  is_legends: false,
};


export const BrotherhoodTerminatorSquadUnit: UnitConfig = {
  id: unitId("brotherhood_terminator_squad"),
  unit_name: "Brotherhood Terminator Squad",
  unit_slug: "brotherhood_terminator_squad",
  is_legends: false,
};


export const CastellanCroweUnit: UnitConfig = {
  id: unitId("castellan_crowe"),
  unit_name: "Castellan Crowe",
  unit_slug: "castellan_crowe",
  is_legends: false,
};


export const ChampionOfTitanCrucibleUnit: UnitConfig = {
  id: unitId("champion_of_titan_crucible"),
  unit_name: "Champion of Titan [Crucible]",
  unit_slug: "champion_of_titan_crucible",
  is_legends: false,
};


export const DreadknightChampionCrucibleUnit: UnitConfig = {
  id: unitId("dreadknight_champion_crucible"),
  unit_name: "Dreadknight Champion [Crucible]",
  unit_slug: "dreadknight_champion_crucible",
  is_legends: false,
};


export const GrandMasterUnit: UnitConfig = {
  id: unitId("grand_master"),
  unit_name: "Grand Master",
  unit_slug: "grand_master",
  is_legends: false,
};


export const GrandMasterInNemesisDreadknightUnit: UnitConfig = {
  id: unitId("grand_master_in_nemesis_dreadknight"),
  unit_name: "Grand Master in Nemesis Dreadknight",
  unit_slug: "grand_master_in_nemesis_dreadknight",
  is_legends: false,
};


export const GrandMasterVoldusUnit: UnitConfig = {
  id: unitId("grand_master_voldus"),
  unit_name: "Grand Master Voldus",
  unit_slug: "grand_master_voldus",
  is_legends: false,
};


export const GreyKnightsDreadnoughtUnit: UnitConfig = {
  id: unitId("grey_knights_dreadnought"),
  unit_name: "Grey Knights Dreadnought (Legends)",
  unit_slug: "grey_knights_dreadnought",
  is_legends: false,
};


export const GreyKnightsRelicRazorbackUnit: UnitConfig = {
  id: unitId("grey_knights_relic_razorback"),
  unit_name: "Grey Knights Relic Razorback (Legends)",
  unit_slug: "grey_knights_relic_razorback",
  is_legends: false,
};


export const GreyKnightsThunderhawkGunshipUnit: UnitConfig = {
  id: unitId("grey_knights_thunderhawk_gunship"),
  unit_name: "Grey Knights Thunderhawk Gunship",
  unit_slug: "grey_knights_thunderhawk_gunship",
  is_legends: false,
};


export const InterceptorSquadUnit: UnitConfig = {
  id: unitId("interceptor_squad"),
  unit_name: "Interceptor Squad",
  unit_slug: "interceptor_squad",
  is_legends: false,
};


export const KaldorDraigoUnit: UnitConfig = {
  id: unitId("kaldor_draigo"),
  unit_name: "Kaldor Draigo (Legends)",
  unit_slug: "kaldor_draigo",
  is_legends: false,
};


export const LandRaiderBanisherUnit: UnitConfig = {
  id: unitId("land_raider_banisher"),
  unit_name: "Land Raider Banisher",
  unit_slug: "land_raider_banisher",
  is_legends: false,
};


export const NemesisDreadknightUnit: UnitConfig = {
  id: unitId("nemesis_dreadknight"),
  unit_name: "Nemesis Dreadknight",
  unit_slug: "nemesis_dreadknight",
  is_legends: false,
};


export const PaladinSquadUnit: UnitConfig = {
  id: unitId("paladin_squad"),
  unit_name: "Paladin Squad",
  unit_slug: "paladin_squad",
  is_legends: false,
};


export const PurgationSquadUnit: UnitConfig = {
  id: unitId("purgation_squad"),
  unit_name: "Purgation Squad",
  unit_slug: "purgation_squad",
  is_legends: false,
};


export const PurifierSquadUnit: UnitConfig = {
  id: unitId("purifier_squad"),
  unit_name: "Purifier Squad",
  unit_slug: "purifier_squad",
  is_legends: false,
};


export const StrikeSquadUnit: UnitConfig = {
  id: unitId("strike_squad"),
  unit_name: "Strike Squad",
  unit_slug: "strike_squad",
  is_legends: false,
};


export const VenerableDaemonSlayerCrucibleUnit: UnitConfig = {
  id: unitId("venerable_daemon_slayer_crucible"),
  unit_name: "Venerable Daemon Slayer [Crucible]",
  unit_slug: "venerable_daemon_slayer_crucible",
  is_legends: false,
};


export const VenerableDreadnoughtUnit: UnitConfig = {
  id: unitId("venerable_dreadnought"),
  unit_name: "Venerable Dreadnought",
  unit_slug: "venerable_dreadnought",
  is_legends: false,
};


export const greyKnightsUnits10e: SeedDataset<"units"> = {
  table: "units",
  records: [
    BrotherCaptainUnit,
    BrotherCaptainSternUnit,
    BrotherhoodChampionUnit,
    BrotherhoodChaplainUnit,
    BrotherhoodLibrarianUnit,
    BrotherhoodTechmarineUnit,
    BrotherhoodTerminatorSquadUnit,
    CastellanCroweUnit,
    ChampionOfTitanCrucibleUnit,
    DreadknightChampionCrucibleUnit,
    GrandMasterUnit,
    GrandMasterInNemesisDreadknightUnit,
    GrandMasterVoldusUnit,
    GreyKnightsDreadnoughtUnit,
    GreyKnightsRelicRazorbackUnit,
    GreyKnightsThunderhawkGunshipUnit,
    InterceptorSquadUnit,
    KaldorDraigoUnit,
    LandRaiderBanisherUnit,
    NemesisDreadknightUnit,
    PaladinSquadUnit,
    PurgationSquadUnit,
    PurifierSquadUnit,
    StrikeSquadUnit,
    VenerableDaemonSlayerCrucibleUnit,
    VenerableDreadnoughtUnit,
  ] satisfies UnitConfig[],
};
