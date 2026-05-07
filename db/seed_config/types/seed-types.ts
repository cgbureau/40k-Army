import type { DateOptions } from "@/utils/general_utils";
import type { SeedingError } from "./seed-error-types";
import type { LogInfo } from "@/utils/logger";
import {
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

// base config type that all seeder configs extend
export type BaseEntityConfig = {
  id: string;
  seedSequence?: number;
  dateConfig?: DateOptions;
  comment?: string;
};

// config types extend the base schema types with seeder-specific fields

export type GameEditionConfig = BaseEntityConfig &
  Omit<GameEdition, "created_at" | "updated_at">;

export type GameSizeConfig = BaseEntityConfig &
  Omit<GameSize, "created_at" | "updated_at">;

export type SuperFactionConfig = BaseEntityConfig &
  Omit<SuperFaction, "created_at" | "updated_at">;

export type RulesFactionConfig = BaseEntityConfig &
  Omit<RulesFaction, "created_at" | "updated_at">;

export type RulesSourceConfig = BaseEntityConfig &
  Omit<RulesSource, "created_at" | "updated_at">;

export type RulesFactionSourceConfig = BaseEntityConfig &
  Omit<RulesFactionSource, "created_at" | "updated_at">;

export type DetachmentConfig = BaseEntityConfig &
  Omit<Detachment, "created_at" | "updated_at">;

export type RulesFactionDetachmentConfig = BaseEntityConfig &
  Omit<RulesFactionDetachment, "created_at" | "updated_at">;

export type UnitConfig = BaseEntityConfig &
  Omit<Unit, "created_at" | "updated_at">;

export type RulesFactionUnitConfig = BaseEntityConfig &
  Omit<RulesFactionUnit, "created_at" | "updated_at">;

export type UnitProfileConfig = BaseEntityConfig &
  Omit<UnitProfile, "created_at" | "updated_at">;

export type UnitProfileStatConfig = BaseEntityConfig &
  Omit<UnitProfileStat, "created_at" | "updated_at">;

export type UnitPointCostConfig = BaseEntityConfig &
  Omit<UnitPointCost, "created_at" | "updated_at">;

export type KeywordConfig = BaseEntityConfig &
  Omit<Keyword, "created_at" | "updated_at">;

export type UnitKeywordConfig = BaseEntityConfig &
  Omit<UnitKeyword, "created_at" | "updated_at">;

export type DetachmentUnitKeywordConfig = BaseEntityConfig &
  Omit<DetachmentUnitKeyword, "created_at" | "updated_at">;

export type UnitSelectionLimitConfig = BaseEntityConfig &
  Omit<UnitSelectionLimit, "created_at" | "updated_at">;

export type ModelConfig = BaseEntityConfig &
  Omit<Model, "created_at" | "updated_at">;

export type UnitModelConfig = BaseEntityConfig &
  Omit<UnitModel, "created_at" | "updated_at">;

export type KitTypeConfig = BaseEntityConfig &
  Omit<KitType, "created_at" | "updated_at">;

export type KitConfig = BaseEntityConfig &
  Omit<Kit, "created_at" | "updated_at">;

export type KitModelConfig = BaseEntityConfig &
  Omit<KitModel, "created_at" | "updated_at">;

export type KitPriceConfig = BaseEntityConfig &
  Omit<KitPrice, "created_at" | "updated_at">;

export type AbilityConfig = BaseEntityConfig &
  Omit<Ability, "created_at" | "updated_at">;

export type UnitAbilityConfig = BaseEntityConfig &
  Omit<UnitAbility, "created_at" | "updated_at">;

export type LeaderEligibilityConfig = BaseEntityConfig &
  Omit<LeaderEligibility, "created_at" | "updated_at">;

export type LeaderEligibilityKeywordConfig = BaseEntityConfig &
  Omit<LeaderEligibilityKeyword, "created_at" | "updated_at">;

export type PlayerConfig = BaseEntityConfig &
  Omit<Player, "created_at" | "updated_at">;

export type PlayerArmyListConfig = BaseEntityConfig &
  Omit<PlayerArmyList, "created_at" | "updated_at">;

export type PlayerArmyListUnitConfig = BaseEntityConfig &
  Omit<PlayerArmyListUnit, "created_at" | "updated_at">;

export type PlayerCollectionConfig = BaseEntityConfig &
  Omit<PlayerCollection, "created_at" | "updated_at">;

export type PlayerCollectionModelConfig = BaseEntityConfig &
  Omit<PlayerCollectionModel, "created_at" | "updated_at">;

export type SeedMode = "dry_run" | "live";

export type SeedRunOptions = {
  mode: SeedMode;
  resetBeforeSeed: boolean;
  phase?: SeedPhaseName;
};

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

export type SeedTableName = keyof SeedTableConfigMap;

export type SeedRecord<TTable extends SeedTableName> = {
  table: TTable;
  data: SeedTableConfigMap[TTable];
};

export type SeedDataset<TTable extends SeedTableName> = {
  table: TTable;
  records: SeedTableConfigMap[TTable][];
};

export type AnySeedDataset = {
  [TTable in SeedTableName]: SeedDataset<TTable>;
}[SeedTableName];

export type SeedBuildResult = {
  phase: SeedPhaseName;
  datasets: AnySeedDataset[];
  builtAt: Date;
};

export type SeedValidationSeverity = "error" | "warning";

export type SeedValidationIssue = {
  phase: SeedPhaseName;
  table: SeedTableName;
  recordId?: string;
  field?: string;
  message: string;
  severity: SeedValidationSeverity;
};

export type SeedValidationResult = {
  phase: SeedPhaseName;
  isValid: boolean;
  issues: SeedValidationIssue[];
  validatedAt: Date;
};

export type SeedInsertResult = {
  phase: SeedPhaseName;
  insertedAt: Date;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
};

export type SeedPhaseContext = {
  options: SeedRunOptions;
  startedAt: Date;
  logInfo?: LogInfo;
};

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

export type SeedRunSummary = {
  mode: SeedMode;
  startedAt: Date;
  completedAt: Date;
  phases: SeedPhaseName[];
  buildResults: SeedBuildResult[];
  validationResults: SeedValidationResult[];
  insertResults: SeedInsertResult[];
};

export type BaseTimestamps = {
  stateStarted: Date;
  stateEnded: Date | null;
};

type BaseState = {
  timestamps: BaseTimestamps;
};

type DataState<T> = BaseState & {
  dataSet?: T[];
};

type FailureState<T> = BaseState & {
  error?: SeedingError;
  lastValidState?: SeederState<T>;
};

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

export type SeedPhaseStage =
  | "loading"
  | "building"
  | "validating"
  | "inserting"
  | "summarizing"
  | "completed";

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

type BaseEvent = {
  timestamps: BaseTimestamps;
  logInfo: LogInfo;
};

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

export type SeederEvent = BaseEvent & {
  type: SeederEventType;
  stage: SeedPhaseStage;
  error?: SeedingError;
};

export type StateValidationResult = {
  isValid: boolean;
  error?: string;
};

export type Transition<T> = {
  from: SeederState<T>;
  to: SeederState<T>;
  event: SeederEvent;
  validation?: StateValidationResult;
};

export type TransitionFunction<T, S extends SeederState<T>["status"]> = (
  state: Extract<SeederState<T>, { status: S }>,
  event: SeederEvent,
) => SeederState<T>;

export type StateTransitionMap<T> = {
  [S in SeederState<T>["status"]]: {
    [E in SeederEventType]: TransitionFunction<T, S>;
  };
};

export function isLoadingState<T>(
  state: SeederState<T>,
): state is DataState<T> & {
  status: "loading_source" | "source_loaded";
  rowsLoaded: number;
} {
  return ["loading_source", "source_loaded"].includes(state.status);
}

export function isBuildingState<T>(
  state: SeederState<T>,
): state is DataState<T> & {
  status: "building_records" | "records_built";
  rowsBuilt: number;
} {
  return ["building_records", "records_built"].includes(state.status);
}

export function isValidatingState<T>(
  state: SeederState<T>,
): state is DataState<T> & {
  status: "validating_records" | "records_validated";
  rowsValidated: number;
} {
  return ["validating_records", "records_validated"].includes(state.status);
}

export function isInsertingState<T>(
  state: SeederState<T>,
): state is DataState<T> & {
  status: "inserting_records" | "records_inserted";
  rowsInserted: number;
} {
  return ["inserting_records", "records_inserted"].includes(state.status);
}

export function isSummarizingState<T>(
  state: SeederState<T>,
): state is DataState<T> & {
  status: "summarizing_results" | "results_summarized";
  rowsSummarized: number;
} {
  return ["summarizing_results", "results_summarized"].includes(state.status);
}

export function isFailingState<T>(
  state: SeederState<T>,
): state is FailureState<T> & {
  status: "failing" | "failed";
  stage: "loading" | "building" | "validating" | "inserting" | "summarizing";
} {
  return ["failing", "failed"].includes(state.status);
}

export function isCompletedState<T>(
  state: SeederState<T>,
): state is BaseState & {
  status: "completed";
  lastValidState: SeederState<T>;
} {
  return state.status === "completed";
}

export type StateHistoryEntry = {
  status: SeedPhaseStatus;
  stateStarted: Date;
  stateEnded: Date | null;
};
