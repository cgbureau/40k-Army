import type {
  AbilityConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { abilityId } from "../../../ids";

/**
 * 10th edition ability rows owned by `white_scars`.
 * Generated from BSData ability profiles.
 */

export const ForTheKhanAbility: AbilityConfig = {
  id: abilityId("for_the_khan"),
  ability_slug: "for_the_khan",
  ability_name: "For the Khan!",
  ability_type: "datasheet",
};


export const SkilledRidersAbility: AbilityConfig = {
  id: abilityId("skilled_riders"),
  ability_slug: "skilled_riders",
  ability_name: "Skilled Riders",
  ability_type: "datasheet",
};


export const SpearOfChogorisAbility: AbilityConfig = {
  id: abilityId("spear_of_chogoris"),
  ability_slug: "spear_of_chogoris",
  ability_name: "Spear of Chogoris",
  ability_type: "datasheet",
};


export const whiteScarsAbilities10e: SeedDataset<"abilities"> = {
  table: "abilities",
  records: [
    ForTheKhanAbility,
    SkilledRidersAbility,
    SpearOfChogorisAbility,
  ] satisfies AbilityConfig[],
};
