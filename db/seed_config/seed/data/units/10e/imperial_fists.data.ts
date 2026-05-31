import type { SeedDataset, UnitConfig } from "../../../../types/_index.types";
import { unitId } from "../../../ids";

/**
 * 10th edition unit rows owned by `imperial_fists`.
 */

export const DarnathLysanderUnit: UnitConfig = {
  id: unitId("darnath_lysander"),
  unit_name: "Darnath Lysander",
  unit_slug: "darnath_lysander",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Darnath-Lysander",
};


export const PedroKantorUnit: UnitConfig = {
  id: unitId("pedro_kantor"),
  unit_name: "Pedro Kantor",
  unit_slug: "pedro_kantor",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Pedro-Kantor",
};


export const TorGaradonUnit: UnitConfig = {
  id: unitId("tor_garadon"),
  unit_name: "Tor Garadon",
  unit_slug: "tor_garadon",
  is_legends: false,
  wahapedia_url: "https://wahapedia.ru/wh40k10ed/factions/space-marines/Tor-Garadon",
};


export const imperialFistsUnits10e: SeedDataset<"units"> = {
  table: "units",
  records: [
    DarnathLysanderUnit,
    PedroKantorUnit,
    TorGaradonUnit,
  ] satisfies UnitConfig[],
};
