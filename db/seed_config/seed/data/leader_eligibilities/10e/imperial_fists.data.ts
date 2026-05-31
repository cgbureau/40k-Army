import type {
  LeaderEligibilityConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { gameEditionId, leaderEligibilityId, rulesSourceId, unitId } from "../../../ids";

/**
 * 10th edition leader eligibility rows owned by `imperial_fists`.
 * Generated from BSData Leader ability profiles.
 */

export const DarnathLysanderTerminatorAssaultSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("darnath_lysander__terminator_assault_squad"),
  leader_unit_id: unitId("darnath_lysander"),
  target_unit_id: unitId("terminator_assault_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const DarnathLysanderTerminatorSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("darnath_lysander__terminator_squad"),
  leader_unit_id: unitId("darnath_lysander"),
  target_unit_id: unitId("terminator_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const PedroKantorBladeguardVeteranSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("pedro_kantor__bladeguard_veteran_squad"),
  leader_unit_id: unitId("pedro_kantor"),
  target_unit_id: unitId("bladeguard_veteran_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const PedroKantorCompanyHeroesLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("pedro_kantor__company_heroes"),
  leader_unit_id: unitId("pedro_kantor"),
  target_unit_id: unitId("company_heroes"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const PedroKantorSternguardVeteranSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("pedro_kantor__sternguard_veteran_squad"),
  leader_unit_id: unitId("pedro_kantor"),
  target_unit_id: unitId("sternguard_veteran_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const PedroKantorTacticalSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("pedro_kantor__tactical_squad"),
  leader_unit_id: unitId("pedro_kantor"),
  target_unit_id: unitId("tactical_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const TorGaradonAggressorSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("tor_garadon__aggressor_squad"),
  leader_unit_id: unitId("tor_garadon"),
  target_unit_id: unitId("aggressor_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const TorGaradonEradicatorSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("tor_garadon__eradicator_squad"),
  leader_unit_id: unitId("tor_garadon"),
  target_unit_id: unitId("eradicator_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const TorGaradonHeavyIntercessorSquadLeaderEligibility: LeaderEligibilityConfig = {
  id: leaderEligibilityId("tor_garadon__heavy_intercessor_squad"),
  leader_unit_id: unitId("tor_garadon"),
  target_unit_id: unitId("heavy_intercessor_squad"),
  game_edition_id: gameEditionId("10e"),
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const imperialFistsLeaderEligibilities10e: SeedDataset<"leader_eligibilities"> = {
  table: "leader_eligibilities",
  records: [
    DarnathLysanderTerminatorAssaultSquadLeaderEligibility,
    DarnathLysanderTerminatorSquadLeaderEligibility,
    PedroKantorBladeguardVeteranSquadLeaderEligibility,
    PedroKantorCompanyHeroesLeaderEligibility,
    PedroKantorSternguardVeteranSquadLeaderEligibility,
    PedroKantorTacticalSquadLeaderEligibility,
    TorGaradonAggressorSquadLeaderEligibility,
    TorGaradonEradicatorSquadLeaderEligibility,
    TorGaradonHeavyIntercessorSquadLeaderEligibility,
  ] satisfies LeaderEligibilityConfig[],
};
