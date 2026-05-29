import type {
  SeedDataset,
  UnitSelectionLimitConfig,
} from "../../types/_index.types";
import { gameEditionId, gameSizeId, keywordId } from "../ids";
import { unitSelectionLimitId } from "../ids";

/**
 * Typed seed dataset for the `unit_selection_limits` table.
 *
 * Encodes the army list repetition rules for each edition and game size.
 * The limit applies to all units that share the relevant keyword:
 *   - EPIC:       units with the EPIC HERO keyword — max 1 per list
 *   - BATTLELINE: units with the BATTLELINE keyword — max 6 per list
 *   - OTHER:      all remaining units — max 3 per list
 *
 * In 10th edition these limits are uniform across all game sizes.
 * In earlier editions (e.g. 9th) the OTHER limit varied by game size.
 *
 * game_size_id is required on every row so that per-size overrides can be
 * expressed cleanly in future editions without a schema change.
 */

// ---------------------------------------------------------------------------
// 10th edition — Combat Patrol
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// 10th edition — Incursion
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// 10th edition — Strike Force
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// 10th edition — Onslaught
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Dataset
// ---------------------------------------------------------------------------

export const unitSelectionLimitsDataset: SeedDataset<"unit_selection_limits"> = {
  table: "unit_selection_limits",
  records: [
    // Combat Patrol
    CombatPatrolEpicLimit,
    CombatPatrolBattlelineLimit,
    CombatPatrolOtherLimit,
    // Incursion
    IncursionEpicLimit,
    IncursionBattlelineLimit,
    IncursionOtherLimit,
    // Strike Force
    StrikeForceEpicLimit,
    StrikeForceBattlelineLimit,
    StrikeForceOtherLimit,
    // Onslaught
    OnslaughtEpicLimit,
    OnslaughtBattlelineLimit,
    OnslaughtOtherLimit,
  ] satisfies UnitSelectionLimitConfig[],
};
