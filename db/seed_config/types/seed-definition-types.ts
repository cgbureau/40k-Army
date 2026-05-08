/**
 * Determines whether a seed run writes to the database.
 */
export type SeedMode = "dry_run" | "live";

/**
 * Domain-level group of seed data processed as one ordered collection.
 */
export type SeedDataCollection =
  | "reference_data"
  | "factions"
  | "units"
  | "models"
  | "kits"
  | "player_data";

/**
 * Severity level for seed validation findings.
 */
export type SeedValidationSeverity = "error" | "warning";

/**
 * Lifecycle stage a seed data collection is currently executing.
 */
export type SeedStage =
  | "load"
  | "build"
  | "validate"
  | "insert"
  | "summarize"
  | "complete"
  | "error";

/**
 * Fine-grained state-machine status for one seed stage.
 */
export type SeedStageStatus =
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
 * Events that drive state transitions for one seed collection.
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
  | "COLLECTION_COMPLETE";
