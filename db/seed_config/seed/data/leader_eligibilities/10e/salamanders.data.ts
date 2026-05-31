import type {
  LeaderEligibilityConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { gameEditionId, leaderEligibilityId, rulesSourceId, unitId } from "../../../ids";

/**
 * 10th edition leader eligibility rows owned by `salamanders`.
 * Generated from BSData Leader ability profiles.
 */

export const AdraxAgatoneAssaultIntercessorSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("adrax_agatone__assault_intercessor_squad"),
  leader_unit_id: unitId("adrax_agatone"),
  target_unit_id: unitId("assault_intercessor_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const AdraxAgatoneBladeguardVeteranSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("adrax_agatone__bladeguard_veteran_squad"),
  leader_unit_id: unitId("adrax_agatone"),
  target_unit_id: unitId("bladeguard_veteran_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const AdraxAgatoneCompanyHeroesLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("adrax_agatone__company_heroes"),
  leader_unit_id: unitId("adrax_agatone"),
  target_unit_id: unitId("company_heroes"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const AdraxAgatoneInfernusSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("adrax_agatone__infernus_squad"),
  leader_unit_id: unitId("adrax_agatone"),
  target_unit_id: unitId("infernus_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const AdraxAgatoneIntercessorSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("adrax_agatone__intercessor_squad"),
  leader_unit_id: unitId("adrax_agatone"),
  target_unit_id: unitId("intercessor_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const AdraxAgatoneSternguardVeteranSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("adrax_agatone__sternguard_veteran_squad"),
  leader_unit_id: unitId("adrax_agatone"),
  target_unit_id: unitId("sternguard_veteran_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const AdraxAgatoneTacticalSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("adrax_agatone__tactical_squad"),
  leader_unit_id: unitId("adrax_agatone"),
  target_unit_id: unitId("tactical_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const VulkanHestanAssaultIntercessorSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("vulkan_hestan__assault_intercessor_squad"),
  leader_unit_id: unitId("vulkan_hestan"),
  target_unit_id: unitId("assault_intercessor_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const VulkanHestanCompanyHeroesLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("vulkan_hestan__company_heroes"),
  leader_unit_id: unitId("vulkan_hestan"),
  target_unit_id: unitId("company_heroes"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const VulkanHestanInfernusSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("vulkan_hestan__infernus_squad"),
  leader_unit_id: unitId("vulkan_hestan"),
  target_unit_id: unitId("infernus_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const VulkanHestanTacticalSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("vulkan_hestan__tactical_squad"),
  leader_unit_id: unitId("vulkan_hestan"),
  target_unit_id: unitId("tactical_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const salamandersLeaderEligibilities10e: SeedDataset<"leader_eligibilities"> = {
  table: "leader_eligibilities",
  records: [
    AdraxAgatoneAssaultIntercessorSquadLeaderEligibility,
    AdraxAgatoneBladeguardVeteranSquadLeaderEligibility,
    AdraxAgatoneCompanyHeroesLeaderEligibility,
    AdraxAgatoneInfernusSquadLeaderEligibility,
    AdraxAgatoneIntercessorSquadLeaderEligibility,
    AdraxAgatoneSternguardVeteranSquadLeaderEligibility,
    AdraxAgatoneTacticalSquadLeaderEligibility,
    VulkanHestanAssaultIntercessorSquadLeaderEligibility,
    VulkanHestanCompanyHeroesLeaderEligibility,
    VulkanHestanInfernusSquadLeaderEligibility,
    VulkanHestanTacticalSquadLeaderEligibility,
  ] satisfies LeaderEligibilityConfig[],
};
