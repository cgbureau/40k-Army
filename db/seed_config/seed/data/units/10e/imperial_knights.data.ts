import type { SeedDataset, UnitConfig } from "../../../../types/_index.types";
import { unitId } from "../../../ids";

/**
 * 10th edition unit rows owned by `imperial_knights`.
 */

export const AcastusKnightAsteriusUnit: UnitConfig = {
  id: unitId("acastus_knight_asterius"),
  unit_name: "Acastus Knight Asterius",
  unit_slug: "acastus_knight_asterius",
  is_legends: false,
};


export const AcastusKnightPorphyrionUnit: UnitConfig = {
  id: unitId("acastus_knight_porphyrion"),
  unit_name: "Acastus Knight Porphyrion",
  unit_slug: "acastus_knight_porphyrion",
  is_legends: false,
};


export const ArmigerHelverinUnit: UnitConfig = {
  id: unitId("armiger_helverin"),
  unit_name: "Armiger Helverin",
  unit_slug: "armiger_helverin",
  is_legends: false,
};


export const ArmigerMoiraxUnit: UnitConfig = {
  id: unitId("armiger_moirax"),
  unit_name: "Armiger Moirax",
  unit_slug: "armiger_moirax",
  is_legends: false,
};


export const ArmigerWarglaiveUnit: UnitConfig = {
  id: unitId("armiger_warglaive"),
  unit_name: "Armiger Warglaive",
  unit_slug: "armiger_warglaive",
  is_legends: false,
};


export const CanisRexUnit: UnitConfig = {
  id: unitId("canis_rex"),
  unit_name: "Canis Rex",
  unit_slug: "canis_rex",
  is_legends: false,
};


export const CerastusKnightAcheronUnit: UnitConfig = {
  id: unitId("cerastus_knight_acheron"),
  unit_name: "Cerastus Knight Acheron",
  unit_slug: "cerastus_knight_acheron",
  is_legends: false,
};


export const CerastusKnightAtraposUnit: UnitConfig = {
  id: unitId("cerastus_knight_atrapos"),
  unit_name: "Cerastus Knight Atrapos",
  unit_slug: "cerastus_knight_atrapos",
  is_legends: false,
};


export const CerastusKnightCastigatorUnit: UnitConfig = {
  id: unitId("cerastus_knight_castigator"),
  unit_name: "Cerastus Knight Castigator",
  unit_slug: "cerastus_knight_castigator",
  is_legends: false,
};


export const CerastusKnightLancerUnit: UnitConfig = {
  id: unitId("cerastus_knight_lancer"),
  unit_name: "Cerastus Knight Lancer",
  unit_slug: "cerastus_knight_lancer",
  is_legends: false,
};


export const KnightCastellanUnit: UnitConfig = {
  id: unitId("knight_castellan"),
  unit_name: "Knight Castellan",
  unit_slug: "knight_castellan",
  is_legends: false,
};


export const KnightCrusaderUnit: UnitConfig = {
  id: unitId("knight_crusader"),
  unit_name: "Knight Crusader",
  unit_slug: "knight_crusader",
  is_legends: false,
};


export const KnightDefenderUnit: UnitConfig = {
  id: unitId("knight_defender"),
  unit_name: "Knight Defender",
  unit_slug: "knight_defender",
  is_legends: false,
};


export const KnightDestrierUnit: UnitConfig = {
  id: unitId("knight_destrier"),
  unit_name: "Knight Destrier",
  unit_slug: "knight_destrier",
  is_legends: false,
};


export const KnightErrantUnit: UnitConfig = {
  id: unitId("knight_errant"),
  unit_name: "Knight Errant",
  unit_slug: "knight_errant",
  is_legends: false,
};


export const KnightGallantUnit: UnitConfig = {
  id: unitId("knight_gallant"),
  unit_name: "Knight Gallant",
  unit_slug: "knight_gallant",
  is_legends: false,
};


export const KnightPaladinUnit: UnitConfig = {
  id: unitId("knight_paladin"),
  unit_name: "Knight Paladin",
  unit_slug: "knight_paladin",
  is_legends: false,
};


export const KnightPreceptorUnit: UnitConfig = {
  id: unitId("knight_preceptor"),
  unit_name: "Knight Preceptor",
  unit_slug: "knight_preceptor",
  is_legends: false,
};


export const KnightValiantUnit: UnitConfig = {
  id: unitId("knight_valiant"),
  unit_name: "Knight Valiant",
  unit_slug: "knight_valiant",
  is_legends: false,
};


export const KnightWardenUnit: UnitConfig = {
  id: unitId("knight_warden"),
  unit_name: "Knight Warden",
  unit_slug: "knight_warden",
  is_legends: false,
};


export const QuestorisKnightMagaeraUnit: UnitConfig = {
  id: unitId("questoris_knight_magaera"),
  unit_name: "Questoris Knight Magaera",
  unit_slug: "questoris_knight_magaera",
  is_legends: false,
};


export const QuestorisKnightStyrixUnit: UnitConfig = {
  id: unitId("questoris_knight_styrix"),
  unit_name: "Questoris Knight Styrix",
  unit_slug: "questoris_knight_styrix",
  is_legends: false,
};


export const imperialKnightsUnits10e: SeedDataset<"units"> = {
  table: "units",
  records: [
    AcastusKnightAsteriusUnit,
    AcastusKnightPorphyrionUnit,
    ArmigerHelverinUnit,
    ArmigerMoiraxUnit,
    ArmigerWarglaiveUnit,
    CanisRexUnit,
    CerastusKnightAcheronUnit,
    CerastusKnightAtraposUnit,
    CerastusKnightCastigatorUnit,
    CerastusKnightLancerUnit,
    KnightCastellanUnit,
    KnightCrusaderUnit,
    KnightDefenderUnit,
    KnightDestrierUnit,
    KnightErrantUnit,
    KnightGallantUnit,
    KnightPaladinUnit,
    KnightPreceptorUnit,
    KnightValiantUnit,
    KnightWardenUnit,
    QuestorisKnightMagaeraUnit,
    QuestorisKnightStyrixUnit,
  ] satisfies UnitConfig[],
};
