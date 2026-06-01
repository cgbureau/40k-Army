import type {
  SeedDataset,
  WeaponProfileConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, weaponId, weaponProfileId } from "../../../ids";

/**
 * 10th edition weapon profile rows owned by `iron_hands`.
 * Generated from BSData weapon profiles.
 */

export const AxiomStrike10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("axiom_strike__10e__codex_space_marines_10e"),
  weapon_profile_slug: "axiom_strike__10e__codex_space_marines_10e",
  weapon_id: weaponId("axiom_strike"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  range: "Melee",
  attacks: "5",
  skill: "2+",
  strength: "8",
  armor_penetration: -2,
  damage: "2",
  effective_date: null,
  superseded_date: null,
};


export const AxiomSweep10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("axiom_sweep__10e__codex_space_marines_10e"),
  weapon_profile_slug: "axiom_sweep__10e__codex_space_marines_10e",
  weapon_id: weaponId("axiom_sweep"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  range: "Melee",
  attacks: "10",
  skill: "2+",
  strength: "5",
  armor_penetration: -2,
  damage: "1",
  effective_date: null,
  superseded_date: null,
};


export const GorgonsWrath10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("gorgons_wrath__10e__codex_space_marines_10e"),
  weapon_profile_slug: "gorgons_wrath__10e__codex_space_marines_10e",
  weapon_id: weaponId("gorgons_wrath"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  range: "36\"",
  attacks: "3",
  skill: "2+",
  strength: "5",
  armor_penetration: -1,
  damage: "2",
  effective_date: null,
  superseded_date: null,
};


export const Harrowhand10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("harrowhand__10e__codex_space_marines_10e"),
  weapon_profile_slug: "harrowhand__10e__codex_space_marines_10e",
  weapon_id: weaponId("harrowhand"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  range: "Melee",
  attacks: "6",
  skill: "3+",
  strength: "7",
  armor_penetration: -2,
  damage: "2",
  effective_date: null,
  superseded_date: null,
};


export const MedusanManipuli10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("medusan_manipuli__10e__codex_space_marines_10e"),
  weapon_profile_slug: "medusan_manipuli__10e__codex_space_marines_10e",
  weapon_id: weaponId("medusan_manipuli"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  range: "Melee",
  attacks: "2",
  skill: "3+",
  strength: "8",
  armor_penetration: -2,
  damage: "3",
  effective_date: null,
  superseded_date: null,
};


export const ironHandsWeaponProfiles10e: SeedDataset<"weapon_profiles"> = {
  table: "weapon_profiles",
  records: [
    AxiomStrike10eCodexSpaceMarines10eWeaponProfile,
    AxiomSweep10eCodexSpaceMarines10eWeaponProfile,
    GorgonsWrath10eCodexSpaceMarines10eWeaponProfile,
    Harrowhand10eCodexSpaceMarines10eWeaponProfile,
    MedusanManipuli10eCodexSpaceMarines10eWeaponProfile,
  ] satisfies WeaponProfileConfig[],
};
