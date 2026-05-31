import type {
  SeedDataset,
  UnitProfileConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, unitId, unitProfileId } from "../../../ids";

/**
 * 10th edition unit profile rows owned by `imperial_fists`.
 * Generated from BSData Unit profiles.
 */

export const DarnathLysander10eDarnathLysanderUnitProfile: UnitProfileConfig = {
  id: unitProfileId("darnath_lysander__10e__darnath_lysander"),
  unit_profile_slug: "darnath_lysander__10e__darnath_lysander",
  unit_profile_name: "Darnath Lysander - Darnath Lysander",
  game_edition_id: gameEditionId("10e"),
  unit_id: unitId("darnath_lysander"),
  model_id: null,
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  effective_date: null,
  superseded_date: null,
};


export const PedroKantor10ePedroKantorUnitProfile: UnitProfileConfig = {
  id: unitProfileId("pedro_kantor__10e__pedro_kantor"),
  unit_profile_slug: "pedro_kantor__10e__pedro_kantor",
  unit_profile_name: "Pedro Kantor - Pedro Kantor",
  game_edition_id: gameEditionId("10e"),
  unit_id: unitId("pedro_kantor"),
  model_id: null,
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  effective_date: null,
  superseded_date: null,
};


export const TorGaradon10eTorGaradonUnitProfile: UnitProfileConfig = {
  id: unitProfileId("tor_garadon__10e__tor_garadon"),
  unit_profile_slug: "tor_garadon__10e__tor_garadon",
  unit_profile_name: "Tor Garadon - Tor Garadon",
  game_edition_id: gameEditionId("10e"),
  unit_id: unitId("tor_garadon"),
  model_id: null,
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  effective_date: null,
  superseded_date: null,
};


export const imperialFistsUnitProfiles10e: SeedDataset<"unit_profiles"> = {
  table: "unit_profiles",
  records: [
    DarnathLysander10eDarnathLysanderUnitProfile,
    PedroKantor10ePedroKantorUnitProfile,
    TorGaradon10eTorGaradonUnitProfile,
  ] satisfies UnitProfileConfig[],
};
