import type {
  SeedDataset,
  WeaponProfileConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, weaponId, weaponProfileId } from "../../../ids";

/**
 * 10th edition weapon profile rows owned by `imperial_fists`.
 * Generated from BSData weapon profiles.
 */

export const ArtificerGravGun10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("artificer_grav_gun__10e__codex_space_marines_10e"),
  weapon_profile_slug: "artificer_grav_gun__10e__codex_space_marines_10e",
  weapon_id: weaponId("artificer_grav_gun"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  range: "18\"",
  attacks: "2",
  skill: "2+",
  strength: "5",
  armor_penetration: -1,
  damage: "2",
  effective_date: null,
  superseded_date: null,
};


export const DornsArrow10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("dorns_arrow__10e__codex_space_marines_10e"),
  weapon_profile_slug: "dorns_arrow__10e__codex_space_marines_10e",
  weapon_id: weaponId("dorns_arrow"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  range: "24\"",
  attacks: "2",
  skill: "2+",
  strength: "5",
  armor_penetration: -1,
  damage: "2",
  effective_date: null,
  superseded_date: null,
};


export const FistOfDorn10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("fist_of_dorn__10e__codex_space_marines_10e"),
  weapon_profile_slug: "fist_of_dorn__10e__codex_space_marines_10e",
  weapon_id: weaponId("fist_of_dorn"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  range: "Melee",
  attacks: "5",
  skill: "2+",
  strength: "10",
  armor_penetration: -3,
  damage: "3",
  effective_date: null,
  superseded_date: null,
};


export const FistOfRetribution10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("fist_of_retribution__10e__codex_space_marines_10e"),
  weapon_profile_slug: "fist_of_retribution__10e__codex_space_marines_10e",
  weapon_id: weaponId("fist_of_retribution"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  range: "Melee",
  attacks: "5",
  skill: "2+",
  strength: "8",
  armor_penetration: -3,
  damage: "3",
  effective_date: null,
  superseded_date: null,
};


export const HandOfDefiance10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("hand_of_defiance__10e__codex_space_marines_10e"),
  weapon_profile_slug: "hand_of_defiance__10e__codex_space_marines_10e",
  weapon_id: weaponId("hand_of_defiance"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  range: "Melee",
  attacks: "5",
  skill: "2+",
  strength: "12",
  armor_penetration: -2,
  damage: "2",
  effective_date: null,
  superseded_date: null,
};


export const imperialFistsWeaponProfiles10e: SeedDataset<"weapon_profiles"> = {
  table: "weapon_profiles",
  records: [
    ArtificerGravGun10eCodexSpaceMarines10eWeaponProfile,
    DornsArrow10eCodexSpaceMarines10eWeaponProfile,
    FistOfDorn10eCodexSpaceMarines10eWeaponProfile,
    FistOfRetribution10eCodexSpaceMarines10eWeaponProfile,
    HandOfDefiance10eCodexSpaceMarines10eWeaponProfile,
  ] satisfies WeaponProfileConfig[],
};
