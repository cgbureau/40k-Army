import type { RulesFactionSourceConfig } from "../../../../../types/_index.types";
import { rulesFactionId, rulesFactionSourceId, rulesSourceId } from "../../../../ids";

export const bloodAngels10eRulesFactionSources = [
  {
    id: rulesFactionSourceId("blood_angels__codex_space_marines_10e"),
    rules_faction_id: rulesFactionId("blood_angels"),
    rules_source_id: rulesSourceId("codex_space_marines_10e"),
    source_relationship: "primary",
    source_scope: "shared_base",
  },
  {
    id: rulesFactionSourceId("blood_angels__codex_supplement_blood_angels_10e"),
    rules_faction_id: rulesFactionId("blood_angels"),
    rules_source_id: rulesSourceId("codex_supplement_blood_angels_10e"),
    source_relationship: "supplement",
    source_scope: "exclusive",
  },
  {
    id: rulesFactionSourceId("blood_angels__faction_pack_blood_angels_10e_v1_1"),
    rules_faction_id: rulesFactionId("blood_angels"),
    rules_source_id: rulesSourceId("faction_pack_blood_angels_10e_v1_1"),
    source_relationship: "errata_faq",
    source_scope: "exclusive",
  },
  {
    id: rulesFactionSourceId("blood_angels__balance_dataslate_10e_v3_4"),
    rules_faction_id: rulesFactionId("blood_angels"),
    rules_source_id: rulesSourceId("balance_dataslate_10e_v3_4"),
    source_relationship: "errata_faq",
    source_scope: "global",
  },
  {
    id: rulesFactionSourceId("blood_angels__munitorum_field_manual_10e_v4_3"),
    rules_faction_id: rulesFactionId("blood_angels"),
    rules_source_id: rulesSourceId("munitorum_field_manual_10e_v4_3"),
    source_relationship: "points",
    source_scope: "global",
  },
  {
    id: rulesFactionSourceId(
      "blood_angels__chapter_approved_tournament_companion_10e_2026_02",
    ),
    rules_faction_id: rulesFactionId("blood_angels"),
    rules_source_id: rulesSourceId(
      "chapter_approved_tournament_companion_10e_2026_02",
    ),
    source_relationship: "base_sizes",
    source_scope: "global",
  },
  {
    id: rulesFactionSourceId(
      "blood_angels__combat_patrol_blood_angels_sanguinary_spearhead_10e",
    ),
    rules_faction_id: rulesFactionId("blood_angels"),
    rules_source_id: rulesSourceId(
      "combat_patrol_blood_angels_sanguinary_spearhead_10e",
    ),
    source_relationship: "combat_patrol",
    source_scope: "exclusive",
  },
  {
    id: rulesFactionSourceId(
      "blood_angels__combat_patrol_blood_angels_strike_force_marcellos_10e",
    ),
    rules_faction_id: rulesFactionId("blood_angels"),
    rules_source_id: rulesSourceId(
      "combat_patrol_blood_angels_strike_force_marcellos_10e",
    ),
    source_relationship: "combat_patrol",
    source_scope: "exclusive",
  },
  {
    id: rulesFactionSourceId(
      "blood_angels__combat_patrol_space_marines_strike_force_octavius_10e",
    ),
    rules_faction_id: rulesFactionId("blood_angels"),
    rules_source_id: rulesSourceId(
      "combat_patrol_space_marines_strike_force_octavius_10e",
    ),
    source_relationship: "combat_patrol",
    source_scope: "shared_base",
  },
  {
    id: rulesFactionSourceId(
      "blood_angels__combat_patrol_space_marines_strike_team_solarien_10e",
    ),
    rules_faction_id: rulesFactionId("blood_angels"),
    rules_source_id: rulesSourceId(
      "combat_patrol_space_marines_strike_team_solarien_10e",
    ),
    source_relationship: "combat_patrol",
    source_scope: "shared_base",
  },
] satisfies RulesFactionSourceConfig[];
