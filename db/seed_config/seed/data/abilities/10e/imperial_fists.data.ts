import type {
  AbilityConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { abilityId } from "../../../ids";

/**
 * 10th edition ability rows owned by `imperial_fists`.
 * Generated from BSData ability profiles.
 */

export const IconOfObstinacyAbility: AbilityConfig = {
  id: abilityId("icon_of_obstinacy"),
  ability_slug: "icon_of_obstinacy",
  ability_name: "Icon of Obstinacy",
  ability_type: "datasheet",
};


export const InspiringCommanderAbility: AbilityConfig = {
  id: abilityId("inspiring_commander"),
  ability_slug: "inspiring_commander",
  ability_name: "Inspiring Commander",
  ability_type: "datasheet",
};


export const OathOfRynnAbility: AbilityConfig = {
  id: abilityId("oath_of_rynn"),
  ability_slug: "oath_of_rynn",
  ability_name: "Oath of Rynn",
  ability_type: "datasheet",
};


export const RampartAbility: AbilityConfig = {
  id: abilityId("rampart"),
  ability_slug: "rampart",
  ability_name: "Rampart",
  ability_type: "datasheet",
};


export const SiegeCaptainAbility: AbilityConfig = {
  id: abilityId("siege_captain"),
  ability_slug: "siege_captain",
  ability_name: "Siege Captain",
  ability_type: "datasheet",
};


export const SignumArrayAbility: AbilityConfig = {
  id: abilityId("signum_array"),
  ability_slug: "signum_array",
  ability_name: "Signum Array",
  ability_type: "datasheet",
};


export const ToTheLastAbility: AbilityConfig = {
  id: abilityId("to_the_last"),
  ability_slug: "to_the_last",
  ability_name: "To the Last",
  ability_type: "datasheet",
};


export const imperialFistsAbilities10e: SeedDataset<"abilities"> = {
  table: "abilities",
  records: [
    IconOfObstinacyAbility,
    InspiringCommanderAbility,
    OathOfRynnAbility,
    RampartAbility,
    SiegeCaptainAbility,
    SignumArrayAbility,
    ToTheLastAbility,
  ] satisfies AbilityConfig[],
};
