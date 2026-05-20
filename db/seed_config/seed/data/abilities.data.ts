import type { AbilityConfig, SeedDataset } from "../../types/_index.types";
import { abilityId } from "../ids";

/**
 * Typed seed dataset for the `abilities` table.
 * starting with deep_strike, leader, infiltrators, scouts_6, and stealth.
 */

export const DeepStrikeAbility: AbilityConfig = {
  id: abilityId("deep_strike"),
  ability_slug: "deep_strike",
  ability_name: "Deep Strike",
  ability_type: "core",
};

export const LeaderAbility: AbilityConfig = {
  id: abilityId("leader"),
  ability_slug: "leader",
  ability_name: "Leader",
  ability_type: "core",
};

export const InfiltratorsAbility: AbilityConfig = {
  id: abilityId("infiltrators"),
  ability_slug: "infiltrators",
  ability_name: "Infiltrators",
  ability_type: "core",
};

export const Scouts6Ability: AbilityConfig = {
  id: abilityId("scouts_6"),
  ability_slug: "scouts_6",
  ability_name: "Scouts 6",
  ability_type: "core",
};

export const StealthAbility: AbilityConfig = {
  id: abilityId("stealth"),
  ability_slug: "stealth",
  ability_name: "Stealth",
  ability_type: "core",
};

export const WaaghAbility: AbilityConfig = {
  id: abilityId("waagh"),
  ability_slug: "waagh",
  ability_name: "Waagh",
  ability_type: "faction",
};

export const SneakySurpriseAbility: AbilityConfig = {
  id: abilityId("sneaky_surprise"),
  ability_slug: "sneaky_surprise",
  ability_name: "Sneaky Surprise",
  ability_type: "datasheet",
};

export const DistractionGrotAbility: AbilityConfig = {
  id: abilityId("distraction_grot"),
  ability_slug: "distraction_grot",
  ability_name: "Distraction Grot",
  ability_type: "wargear",
};

export const BombSquigsAbility: AbilityConfig = {
  id: abilityId("bomb_squigs"),
  ability_slug: "bomb_squigs",
  ability_name: "Bomb Squigs",
  ability_type: "wargear",
};

export const KrumpinTimeAbility: AbilityConfig = {
  id: abilityId("krumpin_time"),
  ability_slug: "krumpin_time",
  ability_name: "Krumpin Time",
  ability_type: "datasheet",
};

export const abilitiesDataset: SeedDataset<"abilities"> = {
  table: "abilities",
  records: [] satisfies AbilityConfig[],
};
