import type { RulesSourceConfig } from "../../../../../types/_index.types";
import { gameEditionId, rulesSourceId } from "../../../../ids";

export const bloodAngels10eRulesSources = [
  {
    id: rulesSourceId("codex_supplement_blood_angels_10e"),
    rules_source_slug: "codex_supplement_blood_angels_10e",
    rules_source_name: "Codex Supplement: Blood Angels",
    rules_source_type: "codex_supplement",
    rules_source_version: null,
    rules_source_version_slug: null,
    release_date: null,
    superseded_date: null,
    game_edition_id: gameEditionId("10e"),
  },
  {
    id: rulesSourceId("faction_pack_blood_angels_10e_v1_1"),
    rules_source_slug: "faction_pack_blood_angels_10e_v1_1",
    rules_source_name: "Faction Pack: Blood Angels",
    rules_source_type: "faction_pack",
    rules_source_version: "v1.1",
    rules_source_version_slug: "v1_1",
    release_date: null,
    superseded_date: null,
    game_edition_id: gameEditionId("10e"),
  },
  {
    id: rulesSourceId("combat_patrol_blood_angels_sanguinary_spearhead_10e"),
    rules_source_slug: "combat_patrol_blood_angels_sanguinary_spearhead_10e",
    rules_source_name: "Combat Patrol: Blood Angels - Sanguinary Spearhead",
    rules_source_type: "combat_patrol",
    rules_source_version: null,
    rules_source_version_slug: null,
    release_date: null,
    superseded_date: null,
    game_edition_id: gameEditionId("10e"),
  },
  {
    id: rulesSourceId("combat_patrol_blood_angels_strike_force_marcellos_10e"),
    rules_source_slug: "combat_patrol_blood_angels_strike_force_marcellos_10e",
    rules_source_name: "Combat Patrol: Blood Angels - Strike Force Marcellos",
    rules_source_type: "combat_patrol",
    rules_source_version: null,
    rules_source_version_slug: null,
    release_date: null,
    superseded_date: null,
    game_edition_id: gameEditionId("10e"),
  },
] satisfies RulesSourceConfig[];
