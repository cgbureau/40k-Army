import type {
  SeedDataset,
  UnitAbilityConfig,
} from "../../../../types/_index.types";
import { abilityId, gameEditionId, rulesSourceId, unitAbilityId, unitId } from "../../../ids";

/**
 * 10th edition unit ability rows owned by `raven_guard`.
 * Generated from BSData ability profiles.
 */

export const AethonShaanBlackwingMantle10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("aethon_shaan__blackwing_mantle__10e__codex_space_marines_10e"),
  unit_id: unitId("aethon_shaan"),
  ability_id: abilityId("blackwing_mantle"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "You can target this model\u2019s unit with the Rapid Ingress and Heroic Intervention Stratagems for 0CP, even if you have already used that Stratagem on a different unit this phase.",
  effective_date: null,
  superseded_date: null,
};


export const AethonShaanChapterMasterOfTheRavenGuard10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("aethon_shaan__chapter_master_of_the_raven_guard__10e__codex_space_marines_10e"),
  unit_id: unitId("aethon_shaan"),
  ability_id: abilityId("chapter_master_of_the_raven_guard"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "At the start of the Declare Battle Formations step, if your army includes Aethon Shaan and Kayvaan Shrike, until the end of the battle, your Kayvaan Shrike unit loses its Lone Operative ability and it replaces its Chapter Master keyword with Captain.",
  effective_date: null,
  superseded_date: null,
};


export const AethonShaanMasterOfShadows10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("aethon_shaan__master_of_shadows__10e__codex_space_marines_10e"),
  unit_id: unitId("aethon_shaan"),
  ability_id: abilityId("master_of_shadows"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "In your Command phase, you can select one unit from your opponent\u2019s army. Until the start of your next Command phase, each time an Adeptus Astartes unit from your army declares a charge while it is within 12\" of that enemy unit, you can re-roll the Charge roll, but it must declare that enemy unit as a target of that charge (if possible).",
  effective_date: null,
  superseded_date: null,
};


export const KayvaanShrikeEchoOfTheRavenspire10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("kayvaan_shrike__echo_of_the_ravenspire__10e__codex_space_marines_10e"),
  unit_id: unitId("kayvaan_shrike"),
  ability_id: abilityId("echo_of_the_ravenspire"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "At the end of your opponent\u2019s turn, if this model\u2019s unit is not within Engagement Range of any enemy models, you can remove it from the battlefield and place it into Strategic Reserves.",
  effective_date: null,
  superseded_date: null,
};


export const KayvaanShrikeInspiringCommander10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("kayvaan_shrike__inspiring_commander__10e__codex_space_marines_10e"),
  unit_id: unitId("kayvaan_shrike"),
  ability_id: abilityId("inspiring_commander"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "If you include this model in your army, until the end of the battle, non-Character models in Assault Intercessors with Jump Packs units from your army have an Objective Control characteristic of 2 while they are not Battle-shocked.",
  effective_date: null,
  superseded_date: null,
};


export const KayvaanShrikeLeader10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("kayvaan_shrike__leader__10e__codex_space_marines_10e"),
  unit_id: unitId("kayvaan_shrike"),
  ability_id: abilityId("leader"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "This model can be attached to the following units: \u25a0 Assault Intercessors with Jump Packs \u25a0 Vanguard Veteran Squad with Jump Packs",
  effective_date: null,
  superseded_date: null,
};


export const KayvaanShrikeTrifoldPathOfShadow10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("kayvaan_shrike__trifold_path_of_shadow__10e__codex_space_marines_10e"),
  unit_id: unitId("kayvaan_shrike"),
  ability_id: abilityId("trifold_path_of_shadow"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "While this model is leading a unit, models in this unit cannot be targeted by ranged attacks unless the attacking model is within 12\".",
  effective_date: null,
  superseded_date: null,
};


export const ravenGuardUnitAbilities10e: SeedDataset<"unit_abilities"> = {
  table: "unit_abilities",
  records: [
    AethonShaanBlackwingMantle10eCodexSpaceMarines10eUnitAbility,
    AethonShaanChapterMasterOfTheRavenGuard10eCodexSpaceMarines10eUnitAbility,
    AethonShaanMasterOfShadows10eCodexSpaceMarines10eUnitAbility,
    KayvaanShrikeEchoOfTheRavenspire10eCodexSpaceMarines10eUnitAbility,
    KayvaanShrikeInspiringCommander10eCodexSpaceMarines10eUnitAbility,
    KayvaanShrikeLeader10eCodexSpaceMarines10eUnitAbility,
    KayvaanShrikeTrifoldPathOfShadow10eCodexSpaceMarines10eUnitAbility,
  ] satisfies UnitAbilityConfig[],
};
