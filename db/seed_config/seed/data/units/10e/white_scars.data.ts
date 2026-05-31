import type { SeedDataset, UnitConfig } from "../../../../types/_index.types";
import { unitId } from "../../../ids";

/**
 * 10th edition unit rows owned by `white_scars`.
 */

export const KorsarroKhanUnit: UnitConfig = {
  id: unitId("korsarro_khan"),
  unit_name: "Kor\u2019sarro Khan",
  unit_slug: "korsarro_khan",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Kor-sarro-Khan",
};


export const SubodenKhanUnit: UnitConfig = {
  id: unitId("suboden_khan"),
  unit_name: "Suboden Khan",
  unit_slug: "suboden_khan",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Suboden-Khan",
};


export const whiteScarsUnits10e: SeedDataset<"units"> = {
  table: "units",
  records: [
    KorsarroKhanUnit,
    SubodenKhanUnit,
  ] satisfies UnitConfig[],
};
