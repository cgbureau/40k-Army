import type {
  SeedDataset,
  UnitAbilityConfig,
} from "../../../../types/_index.types";
import { abilityId, gameEditionId, rulesSourceId, unitAbilityId, unitId } from "../../../ids";

/**
 * 10th edition unit ability rows owned by `white_scars`.
 * Generated from BSData ability profiles.
 */

export const KorsarroKhanForTheKhan10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("korsarro_khan__for_the_khan__10e__codex_space_marines_10e"),
  unit_id: unitId("korsarro_khan"),
  ability_id: abilityId("for_the_khan"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "While this model is leading a unit, ranged weapons equipped by models in that unit have the [ASSAULT] ability and melee weapons equipped by models in that unit have the [LANCE] ability.",
  effective_date: null,
  superseded_date: null,
};


export const KorsarroKhanInspiringCommander10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("korsarro_khan__inspiring_commander__10e__codex_space_marines_10e"),
  unit_id: unitId("korsarro_khan"),
  ability_id: abilityId("inspiring_commander"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "If you include this model in your army, until the end of the battle, non-Character models in Outrider Squad units from your army have an Objective Control characteristic of 3 while they are not Battle-shocked.",
  effective_date: null,
  superseded_date: null,
};


export const KorsarroKhanLeader10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("korsarro_khan__leader__10e__codex_space_marines_10e"),
  unit_id: unitId("korsarro_khan"),
  ability_id: abilityId("leader"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "This model can be attached to the following units: \u25a0 Assault Intercessor Squad \u25a0 Bladeguard Veteran Squad \u25a0 Intercessor Squad \u25a0 Sternguard Veteran Squad \u25a0 Tactical Squad \u25a0 Company Heroes",
  effective_date: null,
  superseded_date: null,
};


export const KorsarroKhanTrophyTaker10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("korsarro_khan__trophy_taker__10e__codex_space_marines_10e"),
  unit_id: unitId("korsarro_khan"),
  ability_id: abilityId("trophy_taker"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "Each time this model destroys an enemy Character model, you gain 1CP",
  effective_date: null,
  superseded_date: null,
};


export const SubodenKhanLeader10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("suboden_khan__leader__10e__codex_space_marines_10e"),
  unit_id: unitId("suboden_khan"),
  ability_id: abilityId("leader"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "This model can be attached to the following units: Outrider Squad",
  effective_date: null,
  superseded_date: null,
};


export const SubodenKhanSkilledRiders10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("suboden_khan__skilled_riders__10e__codex_space_marines_10e"),
  unit_id: unitId("suboden_khan"),
  ability_id: abilityId("skilled_riders"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "Each time a model in this model\u2019s unit makes a Normal, Advance, Fall Back or Charge move, it can move horizontally through terrain features.",
  effective_date: null,
  superseded_date: null,
};


export const SubodenKhanSpearOfChogoris10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("suboden_khan__spear_of_chogoris__10e__codex_space_marines_10e"),
  unit_id: unitId("suboden_khan"),
  ability_id: abilityId("spear_of_chogoris"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "This model\u2019s unit is eligible to shoot and declare a charge in a turn in which it Advanced or Fell Back. If that unit is already eligible to shoot and declare a charge in a turn in which it Advanced, add 1 to Advance and Charge rolls made for that unit instead.",
  effective_date: null,
  superseded_date: null,
};


export const whiteScarsUnitAbilities10e: SeedDataset<"unit_abilities"> = {
  table: "unit_abilities",
  records: [
    KorsarroKhanForTheKhan10eCodexSpaceMarines10eUnitAbility,
    KorsarroKhanInspiringCommander10eCodexSpaceMarines10eUnitAbility,
    KorsarroKhanLeader10eCodexSpaceMarines10eUnitAbility,
    KorsarroKhanTrophyTaker10eCodexSpaceMarines10eUnitAbility,
    SubodenKhanLeader10eCodexSpaceMarines10eUnitAbility,
    SubodenKhanSkilledRiders10eCodexSpaceMarines10eUnitAbility,
    SubodenKhanSpearOfChogoris10eCodexSpaceMarines10eUnitAbility,
  ] satisfies UnitAbilityConfig[],
};
