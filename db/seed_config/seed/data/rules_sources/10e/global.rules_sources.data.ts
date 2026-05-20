import type { RulesSourceConfig } from "../../../../types/_index.types";
import { gameEditionId, rulesSourceId } from "../../../ids";

export const global10eRulesSources = [
  {
    id: rulesSourceId("balance_dataslate_10e_v3_4"),
    rules_source_slug: "balance_dataslate_10e_v3_4",
    rules_source_name: "Balance Dataslate",
    rules_source_type: "balance_dataslate",
    rules_source_version: "v3.4",
    rules_source_version_slug: "v3_4",
    release_date: null,
    superseded_date: null,
    game_edition_id: gameEditionId("10e"),
  },
  {
    id: rulesSourceId("munitorum_field_manual_10e_v4_3"),
    rules_source_slug: "munitorum_field_manual_10e_v4_3",
    rules_source_name: "Munitorum Field Manual",
    rules_source_type: "munitorum_field_manual",
    rules_source_version: "v4.3",
    rules_source_version_slug: "v4_3",
    release_date: null,
    superseded_date: null,
    game_edition_id: gameEditionId("10e"),
  },
  {
    id: rulesSourceId("chapter_approved_tournament_companion_10e_2026_02"),
    rules_source_slug: "chapter_approved_tournament_companion_10e_2026_02",
    rules_source_name: "Chapter Approved Tournament Companion",
    rules_source_type: "chapter_approved_tournament_companion",
    rules_source_version: "February 2026",
    rules_source_version_slug: "2026_02",
    release_date: null,
    superseded_date: null,
    game_edition_id: gameEditionId("10e"),
  },
] satisfies RulesSourceConfig[];
