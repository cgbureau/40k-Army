import type {
  SeedDataset,
  UnitAbilityConfig,
} from "../../../../types/_index.types";
import { abilityId, gameEditionId, rulesSourceId, unitAbilityId, unitId } from "../../../ids";

/**
 * 10th edition unit ability rows owned by `iron_hands`.
 * Generated from BSData ability profiles.
 */

export const CaanokVarCerebrexLogicEngine10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("caanok_var__cerebrex_logic_engine__10e__codex_space_marines_10e"),
  unit_id: unitId("caanok_var"),
  ability_id: abilityId("cerebrex_logic_engine"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "\u25a0 At the start of the Declare Battle Formations step, you can select one Adeptus Astartes Infantry unit from your army. Until the end of the battle, that unit gains the Scouts 6\" ability. \u25a0 After both players have deployed their armies, you can select one Adeptus Astartes unit from your army and redeploy it. When doing so, you can set that unit up in Strategic Reserves if you wish, regardless of how many units are already in Strategic Reserves.",
  effective_date: null,
  superseded_date: null,
};


export const CaanokVarColdAndCalculating10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("caanok_var__cold_and_calculating__10e__codex_space_marines_10e"),
  unit_id: unitId("caanok_var"),
  ability_id: abilityId("cold_and_calculating"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "Each time a model in this model\u2019s unit makes an attack that targets a Monster or Vehicle unit, that attack has the [LETHAL HITS] ability. Each time a model in this model\u2019s unit makes an attack that targets any other unit, that attack has the [SUSTAINED HITS 1] ability.",
  effective_date: null,
  superseded_date: null,
};


export const CaanokVarLeader10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("caanok_var__leader__10e__codex_space_marines_10e"),
  unit_id: unitId("caanok_var"),
  ability_id: abilityId("leader"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "This model can be attached to the following units: Terminator Assault Squad, Terminator Squad",
  effective_date: null,
  superseded_date: null,
};


export const IronFatherFeirrosInspiringCommander10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("iron_father_feirros__inspiring_commander__10e__codex_space_marines_10e"),
  unit_id: unitId("iron_father_feirros"),
  ability_id: abilityId("inspiring_commander"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "If you include this model in your army, until the end of the battle, non-Character models in Heavy Intercessor Squad units from your army have an Objective Control characteristic of 3 while they are not Battle-shocked.",
  effective_date: null,
  superseded_date: null,
};


export const IronFatherFeirrosIronFather10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("iron_father_feirros__iron_father__10e__codex_space_marines_10e"),
  unit_id: unitId("iron_father_feirros"),
  ability_id: abilityId("iron_father"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "While this model is within 3\" of one or more friendly Adeptus Astartes Vehicle units, it has the Lone Operative ability.",
  effective_date: null,
  superseded_date: null,
};


export const IronFatherFeirrosLeader10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("iron_father_feirros__leader__10e__codex_space_marines_10e"),
  unit_id: unitId("iron_father_feirros"),
  ability_id: abilityId("leader"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "This model can be attached to the following units: \u25a0 Aggressor Squad \u25a0 Eradicator Squad \u25a0 Heavy Intercessor Squad",
  effective_date: null,
  superseded_date: null,
};


export const IronFatherFeirrosMasterOfTheForge10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("iron_father_feirros__master_of_the_forge__10e__codex_space_marines_10e"),
  unit_id: unitId("iron_father_feirros"),
  ability_id: abilityId("master_of_the_forge"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "In your Command phase, select one friendly Adeptus Astartes Vehicle model within 3\" of this model. That model regains up to 3 lost wounds and, until the start of your next Command phase, each time that Vehicle model makes an attack, add 1 to the Hit roll. You cannot select a unit for this ability that has already been selected for the Blessing of the Omnissiah ability this phase, and vice versa.",
  effective_date: null,
  superseded_date: null,
};


export const IronFatherFeirrosRitesOfTempering10eCodexSpaceMarines10eUnitAbility: UnitAbilityConfig = {
  id: unitAbilityId("iron_father_feirros__rites_of_tempering__10e__codex_space_marines_10e"),
  unit_id: unitId("iron_father_feirros"),
  ability_id: abilityId("rites_of_tempering"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
  rules_text: "While this model is leading a unit, models in that unit have the Feel No Pain 5+ ability",
  effective_date: null,
  superseded_date: null,
};


export const ironHandsUnitAbilities10e: SeedDataset<"unit_abilities"> = {
  table: "unit_abilities",
  records: [
    CaanokVarCerebrexLogicEngine10eCodexSpaceMarines10eUnitAbility,
    CaanokVarColdAndCalculating10eCodexSpaceMarines10eUnitAbility,
    CaanokVarLeader10eCodexSpaceMarines10eUnitAbility,
    IronFatherFeirrosInspiringCommander10eCodexSpaceMarines10eUnitAbility,
    IronFatherFeirrosIronFather10eCodexSpaceMarines10eUnitAbility,
    IronFatherFeirrosLeader10eCodexSpaceMarines10eUnitAbility,
    IronFatherFeirrosMasterOfTheForge10eCodexSpaceMarines10eUnitAbility,
    IronFatherFeirrosRitesOfTempering10eCodexSpaceMarines10eUnitAbility,
  ] satisfies UnitAbilityConfig[],
};
