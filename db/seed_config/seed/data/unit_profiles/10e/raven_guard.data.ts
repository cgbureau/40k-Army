import type {
  SeedDataset,
  UnitProfileConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, unitId, unitProfileId } from "../../../ids";

/**
 * 10th edition unit profile rows owned by `raven_guard`.
 * Generated from BSData Unit profiles.
 */

export const AethonShaan10eAethonShaanUnitProfile: UnitProfileConfig = {
  id: unitProfileId("aethon_shaan__10e__aethon_shaan"),
  unit_profile_slug: "aethon_shaan__10e__aethon_shaan",
  unit_profile_name: "Aethon Shaan - Aethon Shaan",
  game_edition_id: gameEditionId("10e"),
  unit_id: unitId("aethon_shaan"),
  model_id: null,
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  effective_date: null,
  superseded_date: null,
};


export const KayvaanShrike10eKayvaanShrikeUnitProfile: UnitProfileConfig = {
  id: unitProfileId("kayvaan_shrike__10e__kayvaan_shrike"),
  unit_profile_slug: "kayvaan_shrike__10e__kayvaan_shrike",
  unit_profile_name: "Kayvaan Shrike - Kayvaan Shrike",
  game_edition_id: gameEditionId("10e"),
  unit_id: unitId("kayvaan_shrike"),
  model_id: null,
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  effective_date: null,
  superseded_date: null,
};


export const ravenGuardUnitProfiles10e: SeedDataset<"unit_profiles"> = {
  table: "unit_profiles",
  records: [
    AethonShaan10eAethonShaanUnitProfile,
    KayvaanShrike10eKayvaanShrikeUnitProfile,
  ] satisfies UnitProfileConfig[],
};
