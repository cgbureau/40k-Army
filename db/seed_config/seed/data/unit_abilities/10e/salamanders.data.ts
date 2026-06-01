import type {
  SeedDataset,
  UnitAbilityConfig,
} from "../../../../types/_index.types";
import { abilityId, gameEditionId, rulesSourceId, unitAbilityId, unitId } from "../../../ids";

/**
 * 10th edition unit ability rows owned by `salamanders`.
 * Generated from BSData ability profiles.
 */

export const AdraxAgatoneLeader10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("adrax_agatone__leader__10e__codex_space_marines_10e"),
  unit_id: unitId("adrax_agatone"),
  ability_id: abilityId("leader"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "This model can be attached to the following units: \u25a0 Assault Intercessor Squad \u25a0 Bladeguard Veteran Squad \u25a0 Company Heroes \u25a0 Infernus Squad \u25a0 Intercessor Squad \u25a0 Sternguard Veteran Squad \u25a0 Tactical Squad",
  effective_date: null,
  superseded_date: null,
};


export const AdraxAgatoneLordOfThePyroclasts10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("adrax_agatone__lord_of_the_pyroclasts__10e__codex_space_marines_10e"),
  unit_id: unitId("adrax_agatone"),
  ability_id: abilityId("lord_of_the_pyroclasts"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "While an enemy unit is within Engagement Range of this model, halve the Objective Control characteristic of models in that enemy unit",
  effective_date: null,
  superseded_date: null,
};


export const AdraxAgatoneUntoTheAnvil10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("adrax_agatone__unto_the_anvil__10e__codex_space_marines_10e"),
  unit_id: unitId("adrax_agatone"),
  ability_id: abilityId("unto_the_anvil"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "While this model is leading a unit, each time a model in that unit makes a melee attack, you can re-roll the Wound roll.",
  effective_date: null,
  superseded_date: null,
};


export const VulkanHestanForgefather10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("vulkan_hestan__forgefather__10e__codex_space_marines_10e"),
  unit_id: unitId("vulkan_hestan"),
  ability_id: abilityId("forgefather"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "In your Shooting phase, select one enemy unit within 24\" of and visible to this model. Until the end of the phase, each time a friendly Adeptus Astartes model makes a ranged attack with a Torrent or Melta weapon that targets that enemy unit, you can re-roll the Wound roll",
  effective_date: null,
  superseded_date: null,
};


export const VulkanHestanInspiringCommander10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("vulkan_hestan__inspiring_commander__10e__codex_space_marines_10e"),
  unit_id: unitId("vulkan_hestan"),
  ability_id: abilityId("inspiring_commander"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "If you include this model in your army, until the end of the battle, non-Character models in Infernus Squad units from your army have an Objective Control characteristic of 2 while they are not Battle-shocked.",
  effective_date: null,
  superseded_date: null,
};


export const VulkanHestanLeader10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("vulkan_hestan__leader__10e__codex_space_marines_10e"),
  unit_id: unitId("vulkan_hestan"),
  ability_id: abilityId("leader"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "This model can be attached to the following units: \u25a0 Assault Intercessor Squad \u25a0 Company Heroes \u25a0 Infernus Squad \u25a0 Tactical Squad",
  effective_date: null,
  superseded_date: null,
};


export const VulkanHestanSeekerOfTheUnfound10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("vulkan_hestan__seeker_of_the_unfound__10e__codex_space_marines_10e"),
  unit_id: unitId("vulkan_hestan"),
  ability_id: abilityId("seeker_of_the_unfound"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "The first time this model is set up on the battlefield, select one objective marker on the battlefield. While this model is within range of that objective marker, it has an Objective Control characteristic of 10, a Leadership characteristic of 5+ and the Feel No Pain 4+ ability.",
  effective_date: null,
  superseded_date: null,
};


export const salamandersUnitAbilities10e: SeedDataset<"unit_abilities"> = {
  table: "unit_abilities",
  records: [
    AdraxAgatoneLeader10eCodexSpaceMarines10eUnitAbility,
    AdraxAgatoneLordOfThePyroclasts10eCodexSpaceMarines10eUnitAbility,
    AdraxAgatoneUntoTheAnvil10eCodexSpaceMarines10eUnitAbility,
    VulkanHestanForgefather10eCodexSpaceMarines10eUnitAbility,
    VulkanHestanInspiringCommander10eCodexSpaceMarines10eUnitAbility,
    VulkanHestanLeader10eCodexSpaceMarines10eUnitAbility,
    VulkanHestanSeekerOfTheUnfound10eCodexSpaceMarines10eUnitAbility,
  ] satisfies UnitAbilityConfig[],
};
