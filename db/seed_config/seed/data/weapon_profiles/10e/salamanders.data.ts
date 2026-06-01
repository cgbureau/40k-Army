import type {
  SeedDataset,
  WeaponProfileConfig,
} from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId, weaponId, weaponProfileId } from "../../../ids";

/**
 * 10th edition weapon profile rows owned by `salamanders`.
 * Generated from BSData weapon profiles.
 */

export const Drakkis10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("drakkis__10e__codex_space_marines_10e"),
  weapon_profile_slug: "drakkis__10e__codex_space_marines_10e",
  weapon_id: weaponId("drakkis"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  range: "12\"",
  attacks: "D6+3",
  skill: "N/A",
  strength: "4",
  armor_penetration: -1,
  damage: "1",
  effective_date: null,
  superseded_date: null,
};


export const GauntletOfTheForge10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("gauntlet_of_the_forge__10e__codex_space_marines_10e"),
  weapon_profile_slug: "gauntlet_of_the_forge__10e__codex_space_marines_10e",
  weapon_id: weaponId("gauntlet_of_the_forge"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  range: "12\"",
  attacks: "D6+3",
  skill: "N/A",
  strength: "6",
  armor_penetration: -1,
  damage: "1",
  effective_date: null,
  superseded_date: null,
};


export const MalleusNoctum10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("malleus_noctum__10e__codex_space_marines_10e"),
  weapon_profile_slug: "malleus_noctum__10e__codex_space_marines_10e",
  weapon_id: weaponId("malleus_noctum"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  range: "Melee",
  attacks: "5",
  skill: "2+",
  strength: "10",
  armor_penetration: -2,
  damage: "3",
  effective_date: null,
  superseded_date: null,
};


export const SpearOfVulkan10eCodexSpaceMarines10eWeaponProfile: WeaponProfileConfig = {
  id: weaponProfileId("spear_of_vulkan__10e__codex_space_marines_10e"),
  weapon_profile_slug: "spear_of_vulkan__10e__codex_space_marines_10e",
  weapon_id: weaponId("spear_of_vulkan"),
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


export const salamandersWeaponProfiles10e: SeedDataset<"weapon_profiles"> = {
  table: "weapon_profiles",
  records: [
    Drakkis10eCodexSpaceMarines10eWeaponProfile,
    GauntletOfTheForge10eCodexSpaceMarines10eWeaponProfile,
    MalleusNoctum10eCodexSpaceMarines10eWeaponProfile,
    SpearOfVulkan10eCodexSpaceMarines10eWeaponProfile,
  ] satisfies WeaponProfileConfig[],
};
