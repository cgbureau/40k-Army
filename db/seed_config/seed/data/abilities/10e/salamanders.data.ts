import type {
  AbilityConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { abilityId } from "../../../ids";

/**
 * 10th edition ability rows owned by `salamanders`.
 * Generated from BSData ability profiles.
 */

export const ForgefatherAbility: AbilityConfig = {
  id: abilityId("forgefather"),
  ability_slug: "forgefather",
  ability_name: "Forgefather",
  ability_type: "datasheet",
};


export const LordOfThePyroclastsAbility: AbilityConfig = {
  id: abilityId("lord_of_the_pyroclasts"),
  ability_slug: "lord_of_the_pyroclasts",
  ability_name: "Lord of the Pyroclasts",
  ability_type: "datasheet",
};


export const SeekerOfTheUnfoundAbility: AbilityConfig = {
  id: abilityId("seeker_of_the_unfound"),
  ability_slug: "seeker_of_the_unfound",
  ability_name: "Seeker of the Unfound",
  ability_type: "datasheet",
};


export const UntoTheAnvilAbility: AbilityConfig = {
  id: abilityId("unto_the_anvil"),
  ability_slug: "unto_the_anvil",
  ability_name: "Unto the Anvil",
  ability_type: "datasheet",
};


export const salamandersAbilities10e: SeedDataset<"abilities"> = {
  table: "abilities",
  records: [
    ForgefatherAbility,
    LordOfThePyroclastsAbility,
    SeekerOfTheUnfoundAbility,
    UntoTheAnvilAbility,
  ] satisfies AbilityConfig[],
};
