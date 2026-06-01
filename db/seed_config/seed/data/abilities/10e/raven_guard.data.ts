import type {
  AbilityConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { abilityId } from "../../../ids";

/**
 * 10th edition ability rows owned by `raven_guard`.
 * Generated from BSData ability profiles.
 */

export const BlackwingMantleAbility: AbilityConfig = {
  id: abilityId("blackwing_mantle"),
  ability_slug: "blackwing_mantle",
  ability_name: "Blackwing Mantle",
  ability_type: "datasheet",
};


export const ChapterMasterOfTheRavenGuardAbility: AbilityConfig = {
  id: abilityId("chapter_master_of_the_raven_guard"),
  ability_slug: "chapter_master_of_the_raven_guard",
  ability_name: "Chapter Master of the Raven Guard",
  ability_type: "datasheet",
};


export const EchoOfTheRavenspireAbility: AbilityConfig = {
  id: abilityId("echo_of_the_ravenspire"),
  ability_slug: "echo_of_the_ravenspire",
  ability_name: "Echo of the Ravenspire",
  ability_type: "datasheet",
};


export const MasterOfShadowsAbility: AbilityConfig = {
  id: abilityId("master_of_shadows"),
  ability_slug: "master_of_shadows",
  ability_name: "Master of Shadows",
  ability_type: "datasheet",
};


export const TrifoldPathOfShadowAbility: AbilityConfig = {
  id: abilityId("trifold_path_of_shadow"),
  ability_slug: "trifold_path_of_shadow",
  ability_name: "Trifold Path of Shadow",
  ability_type: "datasheet",
};


export const ravenGuardAbilities10e: SeedDataset<"abilities"> = {
  table: "abilities",
  records: [
    BlackwingMantleAbility,
    ChapterMasterOfTheRavenGuardAbility,
    EchoOfTheRavenspireAbility,
    MasterOfShadowsAbility,
    TrifoldPathOfShadowAbility,
  ] satisfies AbilityConfig[],
};
