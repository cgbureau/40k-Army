import type {
  SeedingError,
  SeederEventType,
  SeedStage,
  SeedStageStatus,
} from "@db_index/";
import type { LogInfo } from "@/utils/logger";

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
 * Current state-machine snapshot for one collection execution.
 */
export type SeederState<T> = BaseState &
  DataState<T> &
  FailureState<T> & {
    status: SeedStageStatus;
    stage?: SeedStage;
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
 * State-machine event emitted while a seed collection advances.
 */
export type SeederEvent = BaseEvent & {
  type: SeederEventType;
  stage: SeedStage;
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
  stage: "load" | "build" | "validate" | "insert" | "summarize" | "error";
} {
  return ["failing", "failed"].includes(state.status);
}

/**
 * Narrows a state to a completed collection state.
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
  status: SeedStageStatus;
  stateStarted: Date;
  stateEnded: Date | null;
};
