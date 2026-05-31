import type { SeedDataset, UnitConfig } from "../../../../types/_index.types";
import { unitId } from "../../../ids";

/**
 * 10th edition unit rows owned by `ultramarines`.
 */

export const CaptainSicariusUnit: UnitConfig = {
  id: unitId("captain_sicarius"),
  unit_name: "Captain Sicarius",
  unit_slug: "captain_sicarius",
  is_legends: false,
  wahapedia_url: null,
};


export const CaptainTitusUnit: UnitConfig = {
  id: unitId("captain_titus"),
  unit_name: "Captain Titus",
  unit_slug: "captain_titus",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Captain-Titus",
};


export const CatoSicariusUnit: UnitConfig = {
  id: unitId("cato_sicarius"),
  unit_name: "Cato Sicarius",
  unit_slug: "cato_sicarius",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Cato-Sicarius",
};


export const ChaplainCassiusUnit: UnitConfig = {
  id: unitId("chaplain_cassius"),
  unit_name: "Chaplain Cassius",
  unit_slug: "chaplain_cassius",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Chaplain-Cassius",
};


export const ChiefLibrarianTiguriusUnit: UnitConfig = {
  id: unitId("chief_librarian_tigurius"),
  unit_name: "Chief Librarian Tigurius",
  unit_slug: "chief_librarian_tigurius",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Chief-Librarian-Tigurius",
};


export const FerrenAreiosUnit: UnitConfig = {
  id: unitId("ferren_areios"),
  unit_name: "Ferren Areios",
  unit_slug: "ferren_areios",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Ferren-Areios",
};


export const LieutenantTitusUnit: UnitConfig = {
  id: unitId("lieutenant_titus"),
  unit_name: "Lieutenant Titus",
  unit_slug: "lieutenant_titus",
  is_legends: false,
  wahapedia_url: null,
};


export const MarneusCalgarUnit: UnitConfig = {
  id: unitId("marneus_calgar"),
  unit_name: "Marneus Calgar",
  unit_slug: "marneus_calgar",
  is_legends: false,
  wahapedia_url: null,
};


export const MarneusCalgarInArmourOfAntilochusUnit: UnitConfig = {
  id: unitId("marneus_calgar_in_armour_of_antilochus"),
  unit_name: "Marneus Calgar in Armour of Antilochus",
  unit_slug: "marneus_calgar_in_armour_of_antilochus",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Marneus-Calgar-in-Armour-of-Antilochus",
};


export const RobouteGuillimanUnit: UnitConfig = {
  id: unitId("roboute_guilliman"),
  unit_name: "Roboute Guilliman",
  unit_slug: "roboute_guilliman",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Roboute-Guilliman",
};


export const SergeantChronusUnit: UnitConfig = {
  id: unitId("sergeant_chronus"),
  unit_name: "Sergeant Chronus",
  unit_slug: "sergeant_chronus",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Sergeant-Chronus",
};


export const SergeantTelionUnit: UnitConfig = {
  id: unitId("sergeant_telion"),
  unit_name: "Sergeant Telion",
  unit_slug: "sergeant_telion",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Sergeant-Telion",
};


export const TyrannicWarVeteransUnit: UnitConfig = {
  id: unitId("tyrannic_war_veterans"),
  unit_name: "Tyrannic War Veterans",
  unit_slug: "tyrannic_war_veterans",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Tyrannic-War-Veterans",
};


export const UltramarinesHonourGuardUnit: UnitConfig = {
  id: unitId("ultramarines_honour_guard"),
  unit_name: "Ultramarines Honour Guard",
  unit_slug: "ultramarines_honour_guard",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Ultramarines-Honour-Guard",
};


export const UrielVentrisUnit: UnitConfig = {
  id: unitId("uriel_ventris"),
  unit_name: "Uriel Ventris",
  unit_slug: "uriel_ventris",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Uriel-Ventris",
};


export const VictrixHonourGuardUnit: UnitConfig = {
  id: unitId("victrix_honour_guard"),
  unit_name: "Victrix Honour Guard",
  unit_slug: "victrix_honour_guard",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Victrix-Honour-Guard",
};


export const WardensOfUltramarUnit: UnitConfig = {
  id: unitId("wardens_of_ultramar"),
  unit_name: "Wardens of Ultramar",
  unit_slug: "wardens_of_ultramar",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Wardens-of-Ultramar-1",
};


export const ultramarinesUnits10e: SeedDataset<"units"> = {
  table: "units",
  records: [
    CaptainSicariusUnit,
    CaptainTitusUnit,
    CatoSicariusUnit,
    ChaplainCassiusUnit,
    ChiefLibrarianTiguriusUnit,
    FerrenAreiosUnit,
    LieutenantTitusUnit,
    MarneusCalgarUnit,
    MarneusCalgarInArmourOfAntilochusUnit,
    RobouteGuillimanUnit,
    SergeantChronusUnit,
    SergeantTelionUnit,
    TyrannicWarVeteransUnit,
    UltramarinesHonourGuardUnit,
    UrielVentrisUnit,
    VictrixHonourGuardUnit,
    WardensOfUltramarUnit,
  ] satisfies UnitConfig[],
};
