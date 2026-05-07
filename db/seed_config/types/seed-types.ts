import type { DateOptions } from "@/utils/general_utils";
import type { SeedingError } from "./seed-error-types";
import type { LogInfo } from "@/utils/logger";
import type {
  GameEdition,
  GameSize,
  SuperFaction,
  RulesFaction,
  RulesSource,
  RulesFactionSource,
  Detachment,
  RulesFactionDetachment,
  Unit,
  RulesFactionUnit,
  UnitProfile,
  UnitProfileStat,
  UnitPointCost,
  Keyword,
  UnitKeyword,
  DetachmentUnitKeyword,
  UnitSelectionLimit,
  Model,
  UnitModel,
  KitType,
  Kit,
  KitModel,
  KitPrice,
  Ability,
  UnitAbility,
  LeaderEligibility,
  LeaderEligibilityKeyword,
  Player,
  PlayerArmyList,
  PlayerArmyListUnit,
  PlayerCollection,
  PlayerCollectionModel,
} from "@schemas/schema-types";

/**
 * Seeder metadata shared by every table-specific config record.
 */
export type BaseEntityConfig = {
  id: string;
  seedSequence?: number;
  dateConfig?: DateOptions;
  comment?: string;
};

/**
 * Seed config shape for a Warhammer 40,000 game edition.
 */
export type GameEditionConfig = BaseEntityConfig &
  Omit<GameEdition, "created_at" | "updated_at">;

/**
 * Seed config shape for an edition-specific game size.
 */
export type GameSizeConfig = BaseEntityConfig &
  Omit<GameSize, "created_at" | "updated_at">;

/**
 * Seed config shape for a top-level faction grouping.
 */
export type SuperFactionConfig = BaseEntityConfig &
  Omit<SuperFaction, "created_at" | "updated_at">;

/**
 * Seed config shape for a rules-facing faction.
 */
export type RulesFactionConfig = BaseEntityConfig &
  Omit<RulesFaction, "created_at" | "updated_at">;

/**
 * Seed config shape for a rules publication or source.
 */
export type RulesSourceConfig = BaseEntityConfig &
  Omit<RulesSource, "created_at" | "updated_at">;

/**
 * Seed config shape for linking a rules faction to a rules source.
 */
export type RulesFactionSourceConfig = BaseEntityConfig &
  Omit<RulesFactionSource, "created_at" | "updated_at">;

/**
 * Seed config shape for a detachment.
 */
export type DetachmentConfig = BaseEntityConfig &
  Omit<Detachment, "created_at" | "updated_at">;

/**
 * Seed config shape for linking a rules faction to a detachment.
 */
export type RulesFactionDetachmentConfig = BaseEntityConfig &
  Omit<RulesFactionDetachment, "created_at" | "updated_at">;

/**
 * Seed config shape for a datasheet-level unit.
 */
export type UnitConfig = BaseEntityConfig &
  Omit<Unit, "created_at" | "updated_at">;

/**
 * Seed config shape for linking a rules faction to a usable unit.
 */
export type RulesFactionUnitConfig = BaseEntityConfig &
  Omit<RulesFactionUnit, "created_at" | "updated_at">;

/**
 * Seed config shape for a source-specific unit profile.
 */
export type UnitProfileConfig = BaseEntityConfig &
  Omit<UnitProfile, "created_at" | "updated_at">;

/**
 * Seed config shape for a key/value stat on a unit profile.
 */
export type UnitProfileStatConfig = BaseEntityConfig &
  Omit<UnitProfileStat, "created_at" | "updated_at">;

/**
 * Seed config shape for a source-specific unit point cost.
 */
export type UnitPointCostConfig = BaseEntityConfig &
  Omit<UnitPointCost, "created_at" | "updated_at">;

/**
 * Seed config shape for a canonical keyword.
 */
export type KeywordConfig = BaseEntityConfig &
  Omit<Keyword, "created_at" | "updated_at">;

/**
 * Seed config shape for assigning a keyword to a unit.
 */
export type UnitKeywordConfig = BaseEntityConfig &
  Omit<UnitKeyword, "created_at" | "updated_at">;

/**
 * Seed config shape for a detachment-granted unit keyword.
 */
export type DetachmentUnitKeywordConfig = BaseEntityConfig &
  Omit<DetachmentUnitKeyword, "created_at" | "updated_at">;

/**
 * Seed config shape for edition/game-size selection limits.
 */
export type UnitSelectionLimitConfig = BaseEntityConfig &
  Omit<UnitSelectionLimit, "created_at" | "updated_at">;

/**
 * Seed config shape for a physical model identity.
 */
export type ModelConfig = BaseEntityConfig &
  Omit<Model, "created_at" | "updated_at">;

/**
 * Seed config shape for linking a unit to its model composition.
 */
export type UnitModelConfig = BaseEntityConfig &
  Omit<UnitModel, "created_at" | "updated_at">;

/**
 * Seed config shape for a purchasable kit category.
 */
export type KitTypeConfig = BaseEntityConfig &
  Omit<KitType, "created_at" | "updated_at">;

/**
 * Seed config shape for a purchasable kit.
 */
export type KitConfig = BaseEntityConfig &
  Omit<Kit, "created_at" | "updated_at">;

/**
 * Seed config shape for linking a kit to contained models.
 */
export type KitModelConfig = BaseEntityConfig &
  Omit<KitModel, "created_at" | "updated_at">;

/**
 * Seed config shape for a kit price observation.
 */
export type KitPriceConfig = BaseEntityConfig &
  Omit<KitPrice, "created_at" | "updated_at">;

/**
 * Seed config shape for a reusable ability definition.
 */
export type AbilityConfig = BaseEntityConfig &
  Omit<Ability, "created_at" | "updated_at">;

/**
 * Seed config shape for assigning ability text to a unit.
 */
export type UnitAbilityConfig = BaseEntityConfig &
  Omit<UnitAbility, "created_at" | "updated_at">;

/**
 * Seed config shape for a leader eligibility rule.
 */
export type LeaderEligibilityConfig = BaseEntityConfig &
  Omit<LeaderEligibility, "created_at" | "updated_at">;

/**
 * Seed config shape for a keyword required by a leader eligibility rule.
 */
export type LeaderEligibilityKeywordConfig = BaseEntityConfig &
  Omit<LeaderEligibilityKeyword, "created_at" | "updated_at">;

/**
 * Seed config shape for a player identity.
 */
export type PlayerConfig = BaseEntityConfig &
  Omit<Player, "created_at" | "updated_at">;

/**
 * Seed config shape for a saved player army list.
 */
export type PlayerArmyListConfig = BaseEntityConfig &
  Omit<PlayerArmyList, "created_at" | "updated_at">;

/**
 * Seed config shape for a unit selected into a player army list.
 */
export type PlayerArmyListUnitConfig = BaseEntityConfig &
  Omit<PlayerArmyListUnit, "created_at" | "updated_at">;

/**
 * Seed config shape for a player collection.
 */
export type PlayerCollectionConfig = BaseEntityConfig &
  Omit<PlayerCollection, "created_at" | "updated_at">;

/**
 * Seed config shape for a model entry inside a player collection.
 */
export type PlayerCollectionModelConfig = BaseEntityConfig &
  Omit<PlayerCollectionModel, "created_at" | "updated_at">;

/**
 * Determines whether a seed run writes to the database.
 */
export type SeedMode = "dry_run" | "live";

/**
 * Runtime options that control how the seed runner executes phases.
 */
export type SeedRunOptions = {
  mode: SeedMode;
  resetBeforeSeed: boolean;
  phase?: SeedPhaseName;
};

/**
 * Coarse-grained domain phase used to order related table seeders.
 */
export type SeedPhaseName =
  | "reference_data"
  | "factions"
  | "detachments"
  | "units"
  | "models"
  | "unit_rules"
  | "kits"
  | "leader_rules"
  | "player_data";

/**
 * Maps each seedable database table to the config type accepted by that table.
 */
export type SeedTableConfigMap = {
  game_editions: GameEditionConfig;
  game_sizes: GameSizeConfig;
  super_factions: SuperFactionConfig;
  rules_factions: RulesFactionConfig;
  rules_sources: RulesSourceConfig;
  rules_faction_sources: RulesFactionSourceConfig;
  detachments: DetachmentConfig;
  rules_faction_detachments: RulesFactionDetachmentConfig;
  units: UnitConfig;
  rules_faction_units: RulesFactionUnitConfig;
  unit_profiles: UnitProfileConfig;
  unit_profile_stats: UnitProfileStatConfig;
  unit_point_costs: UnitPointCostConfig;
  keywords: KeywordConfig;
  unit_keywords: UnitKeywordConfig;
  detachment_unit_keywords: DetachmentUnitKeywordConfig;
  unit_selection_limits: UnitSelectionLimitConfig;
  models: ModelConfig;
  unit_models: UnitModelConfig;
  kit_types: KitTypeConfig;
  kits: KitConfig;
  kit_models: KitModelConfig;
  kit_prices: KitPriceConfig;
  abilities: AbilityConfig;
  unit_abilities: UnitAbilityConfig;
  leader_eligibilities: LeaderEligibilityConfig;
  leader_eligibility_keywords: LeaderEligibilityKeywordConfig;
  players: PlayerConfig;
  player_army_lists: PlayerArmyListConfig;
  player_army_list_units: PlayerArmyListUnitConfig;
  player_collections: PlayerCollectionConfig;
  player_collection_models: PlayerCollectionModelConfig;
};

/**
 * Name of any table supported by the seed type map.
 */
export type SeedTableName = keyof SeedTableConfigMap;

/**
 * A single typed seed row tagged with its destination table.
 */
export type SeedRecord<TTable extends SeedTableName> = {
  table: TTable;
  data: SeedTableConfigMap[TTable];
};

/**
 * A batch of typed seed rows for one destination table.
 */
export type SeedDataset<TTable extends SeedTableName> = {
  table: TTable;
  records: SeedTableConfigMap[TTable][];
};

/**
 * Union of every table-specific seed dataset.
 */
export type AnySeedDataset = {
  [TTable in SeedTableName]: SeedDataset<TTable>;
}[SeedTableName];

/**
 * Result produced when a phase builds normalized seed datasets.
 */
export type SeedBuildResult = {
  phase: SeedPhaseName;
  datasets: AnySeedDataset[];
  builtAt: Date;
};

/**
 * Severity level for seed validation findings.
 */
export type SeedValidationSeverity = "error" | "warning";

/**
 * One validation finding for a phase, table, record, or field.
 */
export type SeedValidationIssue = {
  phase: SeedPhaseName;
  table: SeedTableName;
  recordId?: string;
  field?: string;
  message: string;
  severity: SeedValidationSeverity;
};

/**
 * Result produced when a phase validates its built seed datasets.
 */
export type SeedValidationResult = {
  phase: SeedPhaseName;
  isValid: boolean;
  issues: SeedValidationIssue[];
  validatedAt: Date;
};

/**
 * Result produced when a live phase writes records to the database.
 */
export type SeedInsertResult = {
  phase: SeedPhaseName;
  insertedAt: Date;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
};

/**
 * Shared execution context passed to every phase method.
 */
export type SeedPhaseContext = {
  options: SeedRunOptions;
  startedAt: Date;
  logInfo?: LogInfo;
};

/**
 * Contract implemented by every seed phase.
 */
export type SeedPhase = {
  name: SeedPhaseName;
  dependencies: SeedPhaseName[];
  tables: SeedTableName[];
  build: (
    context: SeedPhaseContext,
  ) => SeedBuildResult | Promise<SeedBuildResult>;
  validate: (
    buildResult: SeedBuildResult,
    context: SeedPhaseContext,
  ) => SeedValidationResult | Promise<SeedValidationResult>;
  insert: (
    buildResult: SeedBuildResult,
    context: SeedPhaseContext,
  ) => SeedInsertResult | Promise<SeedInsertResult>;
};

/**
 * Aggregate outcome for a complete seed run.
 */
export type SeedRunSummary = {
  mode: SeedMode;
  startedAt: Date;
  completedAt: Date;
  phases: SeedPhaseName[];
  buildResults: SeedBuildResult[];
  validationResults: SeedValidationResult[];
  insertResults: SeedInsertResult[];
};

/**
 * Start and end timestamps for one state-machine status.
 */
export type BaseTimestamps = {
  stateStarted: Date;
  stateEnded: Date | null;
};

/**
 * Common timestamp payload carried by state-machine states.
 */
type BaseState = {
  timestamps: BaseTimestamps;
};

/**
 * State-machine payload for states that carry built or loaded data.
 */
type DataState<T> = BaseState & {
  dataSet?: T[];
};

/**
 * State-machine payload for states that capture a seeding failure.
 */
type FailureState<T> = BaseState & {
  error?: SeedingError;
  lastValidState?: SeederState<T>;
};

/**
 * Fine-grained state-machine status for one seed phase.
 */
export type SeedPhaseStatus =
  | "not_started"
  | "loading_source"
  | "source_loaded"
  | "building_records"
  | "records_built"
  | "validating_records"
  | "records_validated"
  | "inserting_records"
  | "records_inserted"
  | "summarizing_results"
  | "results_summarized"
  | "completed"
  | "failing"
  | "failed";

/**
 * Human-readable lifecycle stage used for logs and failure context.
 */
export type SeedPhaseStage =
  | "loading"
  | "building"
  | "validating"
  | "inserting"
  | "summarizing"
  | "completed";

/**
 * Current state-machine snapshot for one phase execution.
 */
export type SeederState<T> = BaseState &
  DataState<T> &
  FailureState<T> & {
    status: SeedPhaseStatus;
    stage?: SeedPhaseStage;
    rowsLoaded?: number;
    rowsBuilt?: number;
    rowsValidated?: number;
    rowsInserted?: number;
    rowsSummarized?: number;
    lastValidState?: SeederState<T>;
  };

/**
 * Common metadata carried by state-machine events.
 */
type BaseEvent = {
  timestamps: BaseTimestamps;
  logInfo: LogInfo;
};

/**
 * Events that drive state transitions for one seed phase.
 */
export type SeederEventType =
  | "START_LOAD"
  | "LOAD_COMPLETE"
  | "START_BUILD"
  | "BUILD_COMPLETE"
  | "START_VALIDATE"
  | "VALIDATE_COMPLETE"
  | "START_INSERT"
  | "INSERT_COMPLETE"
  | "START_SUMMARIZE"
  | "SUMMARIZE_COMPLETE"
  | "START_FAIL"
  | "FAIL_COMPLETE"
  | "PHASE_COMPLETE";

/**
 * State-machine event emitted while a seed phase advances.
 */
export type SeederEvent = BaseEvent & {
  type: SeederEventType;
  stage: SeedPhaseStage;
  error?: SeedingError;
};

/**
 * Validation result used when checking a proposed state transition.
 */
export type StateValidationResult = {
  isValid: boolean;
  error?: string;
};

/**
 * Describes a transition from one state-machine state to another.
 */
export type Transition<T> = {
  from: SeederState<T>;
  to: SeederState<T>;
  event: SeederEvent;
  validation?: StateValidationResult;
};

/**
 * Function signature for a valid transition out of a specific state.
 */
export type TransitionFunction<T, S extends SeederState<T>["status"]> = (
  state: Extract<SeederState<T>, { status: S }>,
  event: SeederEvent,
) => SeederState<T>;

/**
 * Lookup table from current status and event type to transition function.
 */
export type StateTransitionMap<T> = {
  [S in SeederState<T>["status"]]: {
    [E in SeederEventType]: TransitionFunction<T, S>;
  };
};

/**
 * Narrows a state to the source-loading portion of the lifecycle.
 */
export function isLoadingState<T>(
  state: SeederState<T>,
): state is DataState<T> & {
  status: "loading_source" | "source_loaded";
  rowsLoaded: number;
} {
  return ["loading_source", "source_loaded"].includes(state.status);
}

/**
 * Narrows a state to the record-building portion of the lifecycle.
 */
export function isBuildingState<T>(
  state: SeederState<T>,
): state is DataState<T> & {
  status: "building_records" | "records_built";
  rowsBuilt: number;
} {
  return ["building_records", "records_built"].includes(state.status);
}

/**
 * Narrows a state to the validation portion of the lifecycle.
 */
export function isValidatingState<T>(
  state: SeederState<T>,
): state is DataState<T> & {
  status: "validating_records" | "records_validated";
  rowsValidated: number;
} {
  return ["validating_records", "records_validated"].includes(state.status);
}

/**
 * Narrows a state to the database-insert portion of the lifecycle.
 */
export function isInsertingState<T>(
  state: SeederState<T>,
): state is DataState<T> & {
  status: "inserting_records" | "records_inserted";
  rowsInserted: number;
} {
  return ["inserting_records", "records_inserted"].includes(state.status);
}

/**
 * Narrows a state to the result-summarizing portion of the lifecycle.
 */
export function isSummarizingState<T>(
  state: SeederState<T>,
): state is DataState<T> & {
  status: "summarizing_results" | "results_summarized";
  rowsSummarized: number;
} {
  return ["summarizing_results", "results_summarized"].includes(state.status);
}

/**
 * Narrows a state to a failure state.
 */
export function isFailingState<T>(
  state: SeederState<T>,
): state is FailureState<T> & {
  status: "failing" | "failed";
  stage: "loading" | "building" | "validating" | "inserting" | "summarizing";
} {
  return ["failing", "failed"].includes(state.status);
}

/**
 * Narrows a state to a completed phase state.
 */
export function isCompletedState<T>(
  state: SeederState<T>,
): state is BaseState & {
  status: "completed";
  lastValidState: SeederState<T>;
} {
  return state.status === "completed";
}

/**
 * One historical status interval recorded by the state machine.
 */
export type StateHistoryEntry = {
  status: SeedPhaseStatus;
  stateStarted: Date;
  stateEnded: Date | null;
};
