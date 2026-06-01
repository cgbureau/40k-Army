import type {
  AbilityConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { abilityId } from "../../../ids";

/**
 * 10th edition ability rows owned by `deathwatch`.
 * Generated from BSData ability profiles.
 */

export const AuspexArrayAbility: AbilityConfig = {
  id: abilityId("auspex_array"),
  ability_slug: "auspex_array",
  ability_name: "Auspex Array",
  ability_type: "datasheet",
};


export const BlackstarClusterLauncherAbility: AbilityConfig = {
  id: abilityId("blackstar_cluster_launcher"),
  ability_slug: "blackstar_cluster_launcher",
  ability_name: "Blackstar Cluster Launcher",
  ability_type: "datasheet",
};


export const CatechismOfDeathAbility: AbilityConfig = {
  id: abilityId("catechism_of_death"),
  ability_slug: "catechism_of_death",
  ability_name: "Catechism of Death",
  ability_type: "datasheet",
};


export const DeathToTheAlienAbility: AbilityConfig = {
  id: abilityId("death_to_the_alien"),
  ability_slug: "death_to_the_alien",
  ability_name: "Death to the Alien",
  ability_type: "datasheet",
};


export const FortisDoctrinesAbility: AbilityConfig = {
  id: abilityId("fortis_doctrines"),
  ability_slug: "fortis_doctrines",
  ability_name: "Fortis Doctrines",
  ability_type: "datasheet",
};


export const IndomitorDoctrinesAbility: AbilityConfig = {
  id: abilityId("indomitor_doctrines"),
  ability_slug: "indomitor_doctrines",
  ability_name: "Indomitor Doctrines",
  ability_type: "datasheet",
};


export const InfernumHaloLauncherAbility: AbilityConfig = {
  id: abilityId("infernum_halo_launcher"),
  ability_slug: "infernum_halo_launcher",
  ability_name: "Infernum Halo-launcher",
  ability_type: "datasheet",
};


export const InstigatorBoltCarbineAbility: AbilityConfig = {
  id: abilityId("instigator_bolt_carbine"),
  ability_slug: "instigator_bolt_carbine",
  ability_name: "Instigator Bolt Carbine",
  ability_type: "datasheet",
};


export const JumpPackAbility: AbilityConfig = {
  id: abilityId("jump_pack"),
  ability_slug: "jump_pack",
  ability_name: "Jump Pack",
  ability_type: "datasheet",
};


export const PsychicHoodAbility: AbilityConfig = {
  id: abilityId("psychic_hood"),
  ability_slug: "psychic_hood",
  ability_name: "Psychic Hood",
  ability_type: "datasheet",
};


export const SpectrusDoctrinesAbility: AbilityConfig = {
  id: abilityId("spectrus_doctrines"),
  ability_slug: "spectrus_doctrines",
  ability_name: "Spectrus Doctrines",
  ability_type: "datasheet",
};


export const StrategicKnowledgeAbility: AbilityConfig = {
  id: abilityId("strategic_knowledge"),
  ability_slug: "strategic_knowledge",
  ability_name: "Strategic Knowledge",
  ability_type: "datasheet",
};


export const TacticalInstinctAbility: AbilityConfig = {
  id: abilityId("tactical_instinct"),
  ability_slug: "tactical_instinct",
  ability_name: "Tactical Instinct",
  ability_type: "datasheet",
};


export const TalonstrikeDoctrinesAbility: AbilityConfig = {
  id: abilityId("talonstrike_doctrines"),
  ability_slug: "talonstrike_doctrines",
  ability_name: "Talonstrike Doctrines",
  ability_type: "datasheet",
};


export const UnflinchingAbility: AbilityConfig = {
  id: abilityId("unflinching"),
  ability_slug: "unflinching",
  ability_name: "Unflinching",
  ability_type: "datasheet",
};


export const UnstoppableChampionAbility: AbilityConfig = {
  id: abilityId("unstoppable_champion"),
  ability_slug: "unstoppable_champion",
  ability_name: "Unstoppable Champion",
  ability_type: "datasheet",
};


export const WatchMasterAbility: AbilityConfig = {
  id: abilityId("watch_master"),
  ability_slug: "watch_master",
  ability_name: "Watch Master",
  ability_type: "datasheet",
};


export const deathwatchAbilities10e: SeedDataset<"abilities"> = {
  table: "abilities",
  records: [
    AuspexArrayAbility,
    BlackstarClusterLauncherAbility,
    CatechismOfDeathAbility,
    DeathToTheAlienAbility,
    FortisDoctrinesAbility,
    IndomitorDoctrinesAbility,
    InfernumHaloLauncherAbility,
    InstigatorBoltCarbineAbility,
    JumpPackAbility,
    PsychicHoodAbility,
    SpectrusDoctrinesAbility,
    StrategicKnowledgeAbility,
    TacticalInstinctAbility,
    TalonstrikeDoctrinesAbility,
    UnflinchingAbility,
    UnstoppableChampionAbility,
    WatchMasterAbility,
  ] satisfies AbilityConfig[],
};
