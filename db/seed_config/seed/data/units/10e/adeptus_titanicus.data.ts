import type { SeedDataset, UnitConfig } from "../../../../types/_index.types";
import { unitId } from "../../../ids";

/**
 * 10th edition unit rows owned by `adeptus_titanicus`.
 */

export const ReaverTitanUnit: UnitConfig = {
  id: unitId("reaver_titan"),
  unit_name: "Reaver Titan",
  unit_slug: "reaver_titan",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/adeptus-titanicus/Reaver-Titan",
};


export const WarbringerNemesisTitanUnit: UnitConfig = {
  id: unitId("warbringer_nemesis_titan"),
  unit_name: "Warbringer Nemesis Titan",
  unit_slug: "warbringer_nemesis_titan",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/adeptus-titanicus/Warbringer-Nemesis-Titan",
};


export const WarhoundTitanUnit: UnitConfig = {
  id: unitId("warhound_titan"),
  unit_name: "Warhound Titan",
  unit_slug: "warhound_titan",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/adeptus-titanicus/Warhound-Titan",
};


export const WarlordTitanUnit: UnitConfig = {
  id: unitId("warlord_titan"),
  unit_name: "Warlord Titan",
  unit_slug: "warlord_titan",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/adeptus-titanicus/Warlord-Titan",
};


export const adeptusTitanicusUnits10e: SeedDataset<"units"> = {
  table: "units",
  records: [
    ReaverTitanUnit,
    WarbringerNemesisTitanUnit,
    WarhoundTitanUnit,
    WarlordTitanUnit,
  ] satisfies UnitConfig[],
};
