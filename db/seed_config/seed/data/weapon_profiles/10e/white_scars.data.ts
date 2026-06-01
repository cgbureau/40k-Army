import type {
  SeedDataset,
  WeaponProfileConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, weaponId, weaponProfileId } from "../../../ids";

/**
 * 10th edition weapon profile rows owned by `white_scars`.
 * Generated from BSData weapon profiles.
 */

export const Moonfang10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("moonfang__10e__codex_space_marines_10e"),
  weapon_profile_slug: "moonfang__10e__codex_space_marines_10e",
  weapon_id: weaponId("moonfang"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  range: "Melee",
  attacks: "6",
  skill: "2+",
  strength: "5",
  armor_penetration: -2,
  damage: "2",
  effective_date: null,
  superseded_date: null,
};


export const PowerSword10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("power_sword__10e__codex_space_marines_10e"),
  weapon_profile_slug: "power_sword__10e__codex_space_marines_10e",
  weapon_id: weaponId("power_sword"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  range: "Melee",
  attacks: "8",
  skill: "2+",
  strength: "5",
  armor_penetration: -2,
  damage: "1",
  effective_date: null,
  superseded_date: null,
};


export const Stormtooth10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("stormtooth__10e__codex_space_marines_10e"),
  weapon_profile_slug: "stormtooth__10e__codex_space_marines_10e",
  weapon_id: weaponId("stormtooth"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  range: "Melee",
  attacks: "6",
  skill: "2+",
  strength: "6",
  armor_penetration: -2,
  damage: "2",
  effective_date: null,
  superseded_date: null,
};


export const whiteScarsWeaponProfiles10e: SeedDataset<"weapon_profiles"> = {
  table: "weapon_profiles",
  records: [
    Moonfang10eCodexSpaceMarines10eWeaponProfile,
    PowerSword10eCodexSpaceMarines10eWeaponProfile,
    Stormtooth10eCodexSpaceMarines10eWeaponProfile,
  ] satisfies WeaponProfileConfig[],
};
