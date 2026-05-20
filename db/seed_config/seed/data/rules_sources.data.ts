import type { RulesSourceConfig, SeedDataset } from "../../types/_index.types";
import { rulesSourceId } from "../ids";
import { gameEditionId } from "../ids";

/**
 * Typed seed dataset for the `rules_sources` table.
 * codex, online, expansion, campaign book, Munitorum Field Manual, balance dataslate, codex supplement, and other
 */

export const CodexRulesSource: RulesSourceConfig = {
  id: rulesSourceId("codex"),
  rules_source_slug: "codex",
  rules_source_name: "Codex",
  rules_source_type: "codex",
  rules_source_version: null,
  rules_source_version_slug: null,
  release_date: new Date("2023-10-14"),
  superseded_date: null,
  game_edition_id: gameEditionId("10e"),
};

export const OnlineRulesSource: RulesSourceConfig = {
  id: rulesSourceId("online"),
  rules_source_slug: "online",
  rules_source_name: "Online",
  rules_source_type: "online",
  rules_source_version: null,
  rules_source_version_slug: null,
  release_date: null,
  superseded_date: null,
  game_edition_id: gameEditionId("10e"),
};

export const ExpansionRulesSource: RulesSourceConfig = {
  id: rulesSourceId("expansion"),
  rules_source_slug: "expansion",
  rules_source_name: "Expansion",
  rules_source_type: "expansion",
  rules_source_version: null,
  rules_source_version_slug: null,
  release_date: new Date("2025-11-01"),
  superseded_date: null,
  game_edition_id: gameEditionId("10e"),
};

export const CampaignBookRulesSource: RulesSourceConfig = {
  id: rulesSourceId("campaign_book"),
  rules_source_slug: "campaign_book",
  rules_source_name: "Campaign Book",
  rules_source_type: "campaign_book",
  rules_source_version: null,
  rules_source_version_slug: null,
  release_date: new Date("2025-11-01"),
  superseded_date: null,
  game_edition_id: gameEditionId("10e"),
};

export const MunitorumFieldManualRulesSource: RulesSourceConfig = {
  id: rulesSourceId("munitorum_field_manual"),
  rules_source_slug: "munitorum_field_manual",
  rules_source_name: "Munitorum Field Manual",
  rules_source_type: "munitorum_field_manual",
  rules_source_version: null,
  rules_source_version_slug: null,
  release_date: new Date("2025-06-01"),
  superseded_date: null,
  game_edition_id: gameEditionId("10e"),
};

export const BalanceDataslateRulesSource: RulesSourceConfig = {
  id: rulesSourceId("balance_dataslate"),
  rules_source_slug: "balance_dataslate",
  rules_source_name: "Balance Dataslate",
  rules_source_type: "balance_dataslate",
  rules_source_version: null,
  rules_source_version_slug: null,
  release_date: null,
  superseded_date: null,
  game_edition_id: gameEditionId("10e"),
};

export const CodexSupplementRulesSource: RulesSourceConfig = {
  id: rulesSourceId("codex_supplement"),
  rules_source_slug: "codex_supplement",
  rules_source_name: "Codex Supplement",
  rules_source_type: "codex_supplement",
  rules_source_version: null,
  rules_source_version_slug: null,
  release_date: new Date("2024-09-14"),
  superseded_date: null,
  game_edition_id: gameEditionId("10e"),
};

export const OtherRulesSource: RulesSourceConfig = {
  id: rulesSourceId("other"),
  rules_source_slug: "other",
  rules_source_name: "Other",
  rules_source_type: "other",
  rules_source_version: null,
  rules_source_version_slug: null,
  release_date: null,
  superseded_date: null,
  game_edition_id: gameEditionId("10e"),
};

export const rulesSourcesDataset: SeedDataset<"rules_sources"> = {
  table: "rules_sources",
  records: [] satisfies RulesSourceConfig[],
};
