import type {
  SeedDataset,
  UnitSelectionLimitConfig,
} from "../../../../types/_index.types";
import {
  gameEditionId,
  gameSizeId,
  keywordId,
  unitSelectionLimitId,
} from "../../../ids";

/**
 * 10th edition unit-selection limit rows.
 *
 * These encode the 10e army list repetition rules for each game size:
 * - epic: units with the Epic Hero keyword, max 1 per list
 * - battleline: units with the Battleline keyword, max 6 per list
 * - other: all remaining units, max 3 per list
 *
 * `game_size_id` is intentionally populated on every row so future editions can
 * express per-size overrides without a schema change.
 */

const CombatPatrolEpicLimit: UnitSelectionLimitConfig = {
  id: unitSelectionLimitId("10e__combat_patrol__epic"),
  game_edition_id: gameEditionId("10e"),
  game_size_id: gameSizeId("combat_patrol"),
  keyword_id: keywordId("epic_hero"),
  limit_kind: "epic",
  max_instances: 1,
};

const CombatPatrolBattlelineLimit: UnitSelectionLimitConfig = {
  id: unitSelectionLimitId("10e__combat_patrol__battleline"),
  game_edition_id: gameEditionId("10e"),
  game_size_id: gameSizeId("combat_patrol"),
  keyword_id: keywordId("battleline"),
  limit_kind: "battleline",
  max_instances: 6,
};

const CombatPatrolOtherLimit: UnitSelectionLimitConfig = {
  id: unitSelectionLimitId("10e__combat_patrol__other"),
  game_edition_id: gameEditionId("10e"),
  game_size_id: gameSizeId("combat_patrol"),
  keyword_id: null,
  limit_kind: "other",
  max_instances: 3,
};

const IncursionEpicLimit: UnitSelectionLimitConfig = {
  id: unitSelectionLimitId("10e__incursion__epic"),
  game_edition_id: gameEditionId("10e"),
  game_size_id: gameSizeId("incursion"),
  keyword_id: keywordId("epic_hero"),
  limit_kind: "epic",
  max_instances: 1,
};

const IncursionBattlelineLimit: UnitSelectionLimitConfig = {
  id: unitSelectionLimitId("10e__incursion__battleline"),
  game_edition_id: gameEditionId("10e"),
  game_size_id: gameSizeId("incursion"),
  keyword_id: keywordId("battleline"),
  limit_kind: "battleline",
  max_instances: 6,
};

const IncursionOtherLimit: UnitSelectionLimitConfig = {
  id: unitSelectionLimitId("10e__incursion__other"),
  game_edition_id: gameEditionId("10e"),
  game_size_id: gameSizeId("incursion"),
  keyword_id: null,
  limit_kind: "other",
  max_instances: 3,
};

const StrikeForceEpicLimit: UnitSelectionLimitConfig = {
  id: unitSelectionLimitId("10e__strike_force__epic"),
  game_edition_id: gameEditionId("10e"),
  game_size_id: gameSizeId("strike_force"),
  keyword_id: keywordId("epic_hero"),
  limit_kind: "epic",
  max_instances: 1,
};

const StrikeForceBattlelineLimit: UnitSelectionLimitConfig = {
  id: unitSelectionLimitId("10e__strike_force__battleline"),
  game_edition_id: gameEditionId("10e"),
  game_size_id: gameSizeId("strike_force"),
  keyword_id: keywordId("battleline"),
  limit_kind: "battleline",
  max_instances: 6,
};

const StrikeForceOtherLimit: UnitSelectionLimitConfig = {
  id: unitSelectionLimitId("10e__strike_force__other"),
  game_edition_id: gameEditionId("10e"),
  game_size_id: gameSizeId("strike_force"),
  keyword_id: null,
  limit_kind: "other",
  max_instances: 3,
};

const OnslaughtEpicLimit: UnitSelectionLimitConfig = {
  id: unitSelectionLimitId("10e__onslaught__epic"),
  game_edition_id: gameEditionId("10e"),
  game_size_id: gameSizeId("onslaught"),
  keyword_id: keywordId("epic_hero"),
  limit_kind: "epic",
  max_instances: 1,
};

const OnslaughtBattlelineLimit: UnitSelectionLimitConfig = {
  id: unitSelectionLimitId("10e__onslaught__battleline"),
  game_edition_id: gameEditionId("10e"),
  game_size_id: gameSizeId("onslaught"),
  keyword_id: keywordId("battleline"),
  limit_kind: "battleline",
  max_instances: 6,
};

const OnslaughtOtherLimit: UnitSelectionLimitConfig = {
  id: unitSelectionLimitId("10e__onslaught__other"),
  game_edition_id: gameEditionId("10e"),
  game_size_id: gameSizeId("onslaught"),
  keyword_id: null,
  limit_kind: "other",
  max_instances: 3,
};

export const unitSelectionLimits10eDataset: SeedDataset<"unit_selection_limits"> = {
  table: "unit_selection_limits",
  records: [
    CombatPatrolEpicLimit,
    CombatPatrolBattlelineLimit,
    CombatPatrolOtherLimit,
    IncursionEpicLimit,
    IncursionBattlelineLimit,
    IncursionOtherLimit,
    StrikeForceEpicLimit,
    StrikeForceBattlelineLimit,
    StrikeForceOtherLimit,
    OnslaughtEpicLimit,
    OnslaughtBattlelineLimit,
    OnslaughtOtherLimit,
  ] satisfies UnitSelectionLimitConfig[],
};
