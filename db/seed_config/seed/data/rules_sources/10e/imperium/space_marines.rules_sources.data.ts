import type { RulesSourceConfig } from "../../../../../types/_index.types";
import { gameEditionId, rulesSourceId } from "../../../../ids";

export const spaceMarines10eRulesSources = [
  {
    id: rulesSourceId("codex_space_marines_10e"),
    rules_source_slug: "codex_space_marines_10e",
    rules_source_name: "Codex: Space Marines",
    rules_source_type: "codex",
    rules_source_version: null,
    rules_source_version_slug: null,
    release_date: null,
    superseded_date: null,
    game_edition_id: gameEditionId("10e"),
  },
  {
    id: rulesSourceId("combat_patrol_space_marines_strike_force_octavius_10e"),
    rules_source_slug: "combat_patrol_space_marines_strike_force_octavius_10e",
    rules_source_name: "Combat Patrol: Space Marines - Strike Force Octavius",
    rules_source_type: "combat_patrol",
    rules_source_version: null,
    rules_source_version_slug: null,
    release_date: null,
    superseded_date: null,
    game_edition_id: gameEditionId("10e"),
  },
  {
    id: rulesSourceId("combat_patrol_space_marines_strike_team_solarien_10e"),
    rules_source_slug: "combat_patrol_space_marines_strike_team_solarien_10e",
    rules_source_name: "Combat Patrol: Space Marines - Strike Team Solarien",
    rules_source_type: "combat_patrol",
    rules_source_version: null,
    rules_source_version_slug: null,
    release_date: null,
    superseded_date: null,
    game_edition_id: gameEditionId("10e"),
  },
] satisfies RulesSourceConfig[];
