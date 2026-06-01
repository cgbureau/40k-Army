import type {
  AbilityConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { abilityId } from "../../../ids";

/**
 * 10th edition ability rows owned by `iron_hands`.
 * Generated from BSData ability profiles.
 */

export const CerebrexLogicEngineAbility: AbilityConfig = {
  id: abilityId("cerebrex_logic_engine"),
  ability_slug: "cerebrex_logic_engine",
  ability_name: "Cerebrex Logic Engine",
  ability_type: "datasheet",
};


export const ColdAndCalculatingAbility: AbilityConfig = {
  id: abilityId("cold_and_calculating"),
  ability_slug: "cold_and_calculating",
  ability_name: "Cold and Calculating",
  ability_type: "datasheet",
};


export const IronFatherAbility: AbilityConfig = {
  id: abilityId("iron_father"),
  ability_slug: "iron_father",
  ability_name: "Iron Father",
  ability_type: "datasheet",
};


export const MasterOfTheForgeAbility: AbilityConfig = {
  id: abilityId("master_of_the_forge"),
  ability_slug: "master_of_the_forge",
  ability_name: "Master of the Forge",
  ability_type: "datasheet",
};


export const RitesOfTemperingAbility: AbilityConfig = {
  id: abilityId("rites_of_tempering"),
  ability_slug: "rites_of_tempering",
  ability_name: "Rites of Tempering",
  ability_type: "datasheet",
};


export const ironHandsAbilities10e: SeedDataset<"abilities"> = {
  table: "abilities",
  records: [
    CerebrexLogicEngineAbility,
    ColdAndCalculatingAbility,
    IronFatherAbility,
    MasterOfTheForgeAbility,
    RitesOfTemperingAbility,
  ] satisfies AbilityConfig[],
};
