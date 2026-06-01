import type {
  SeedDataset,
  WeaponProfileConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, weaponId, weaponProfileId } from "../../../ids";

/**
 * 10th edition weapon profile rows owned by `raven_guard`.
 * Generated from BSData weapon profiles.
 */

export const Blackout10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("blackout__10e__codex_space_marines_10e"),
  weapon_profile_slug: "blackout__10e__codex_space_marines_10e",
  weapon_id: weaponId("blackout"),
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


export const ClawsOfSeverax10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("claws_of_severax__10e__codex_space_marines_10e"),
  weapon_profile_slug: "claws_of_severax__10e__codex_space_marines_10e",
  weapon_id: weaponId("claws_of_severax"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  range: "Melee",
  attacks: "7",
  skill: "2+",
  strength: "5",
  armor_penetration: -2,
  damage: "2",
  effective_date: null,
  superseded_date: null,
};


export const TheRavensTalons10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("the_ravens_talons__10e__codex_space_marines_10e"),
  weapon_profile_slug: "the_ravens_talons__10e__codex_space_marines_10e",
  weapon_id: weaponId("the_ravens_talons"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  range: "Melee",
  attacks: "7",
  skill: "2+",
  strength: "5",
  armor_penetration: -2,
  damage: "2",
  effective_date: null,
  superseded_date: null,
};


export const ravenGuardWeaponProfiles10e: SeedDataset<"weapon_profiles"> = {
  table: "weapon_profiles",
  records: [
    Blackout10eCodexSpaceMarines10eWeaponProfile,
    ClawsOfSeverax10eCodexSpaceMarines10eWeaponProfile,
    TheRavensTalons10eCodexSpaceMarines10eWeaponProfile,
  ] satisfies WeaponProfileConfig[],
};
