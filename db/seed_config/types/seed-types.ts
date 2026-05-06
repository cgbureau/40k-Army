import type { DateOptions } from "@/utils/general_utils";
import { SeedingError } from "./seed-error-types";
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

/*
Add types for the following concepts:
SeedMode - how the seeder is running
SeedPhaseName - which logical phase of the seeder is running
SeedPhaseStatus
SeedTableConfigMap
SeedRecord - a normalized config row with table metadata
SeedBuildResult
SeedValidationIssue
SeedValidationResult
SeedInsertResult
SeedPhaseContext
SeedPhase - the contract every phase must implement; A seed phase declares its name, dependencies, affected tables, and exposes build, validate, insert, and summarize behavior.
SeedRunSummary - what the whole seed run reports at the end
*/

// dry_run = load, build, validate, summarize, but do not write to the database
// live = load, build, validate, insert, summarize, write to the database
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

type BaseTimestamps = {
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

type SeederStatus =
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

type SeederStatusName =
  | "loading"
  | "building"
  | "validating"
  | "inserting"
  | "summarizing"
  | "completed";

type SeederState<T> = BaseState &
  DataState<T> &
  FailureState<T> & {
    status: SeederStatus;
    rowsBuilt?: number;
    rowsInserted?: number;
    rowsReturned?: number;
    phase?: SeederStatusName;
    lastValidState?: SeederState<T>;
  };

type BaseEvent = {
  timestamps: BaseTimestamps;
  logInfo: LogInfo;
};

export type SeederEvent = BaseEvent & {
  status: SeederStatus;
  statusName: SeederStatusName;
  error?: SeedingError;
};

export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export type Transition<T> = {
  from: SeederState<T>;
  to: SeederState<T>;
  event: SeederEvent;
  validation?: ValidationResult;
};

export type TransitionFunction<T, S extends SeederState<T>["status"]> = (
  state: Extract<SeederState<T>, { status: S }>,
  event: SeederEvent,
) => SeederState<T>;

export type StateTransitionMap<T> = {
  [S in SeederState<T>["status"]]: {
    [E in SeederStatus]: TransitionFunction<T, S>;
  };
};

export function isLoadingState<T>(
  state: SeederState<T>,
): state is DataState<T> & {
  status: "loading_source" | "source_loaded";
  rowsBuilt: number;
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
  statusName:
    | "loading"
    | "building"
    | "validating"
    | "inserting"
    | "summarizing";
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
  status: SeederStatus;
  stateStarted: Date;
  stateEnded: Date | null;
};

// for handling single row
export type SeedRecord<TTable extends keyof SeedTableConfigMap> = {
  table: TTable;
  data: SeedTableConfigMap[TTable];
};

// for handling multiple rows
export type SeedDataset<TTable extends keyof SeedTableConfigMap> = {
  table: TTable;
  records: SeedTableConfigMap[TTable][];
};
