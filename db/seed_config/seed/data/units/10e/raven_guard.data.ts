import type { SeedDataset, UnitConfig } from "../../../../types/_index.types";
import { unitId } from "../../../ids";

/**
 * 10th edition unit rows owned by `raven_guard`.
 */

export const AethonShaanUnit: UnitConfig = {
  id: unitId("aethon_shaan"),
  unit_name: "Aethon Shaan",
  unit_slug: "aethon_shaan",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Aethon-Shaan",
};


export const KayvaanShrikeUnit: UnitConfig = {
  id: unitId("kayvaan_shrike"),
  unit_name: "Kayvaan Shrike",
  unit_slug: "kayvaan_shrike",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Kayvaan-Shrike",
};


export const ravenGuardUnits10e: SeedDataset<"units"> = {
  table: "units",
  records: [
    AethonShaanUnit,
    KayvaanShrikeUnit,
  ] satisfies UnitConfig[],
};
