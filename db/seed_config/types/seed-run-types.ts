import {
  SeedMode,
  SeedDataCollection,
  AnySeedDataset,
  SeedTableName,
  SeedValidationSeverity,
} from "@db_index/";

/**
 * Result produced when a collection builds normalized seed datasets.
 */
export type SeedBuildResult = {
  collection: SeedDataCollection;
  datasets: AnySeedDataset[];
  builtAt: Date;
};

/**
 * One validation finding for a collection, table, record, or field.
 */
export type SeedValidationIssue = {
  collection: SeedDataCollection;
  table: SeedTableName;
  recordId?: string;
  field?: string;
  message: string;
  severity: SeedValidationSeverity;
};

/**
 * Result produced when a collection validates its built seed datasets.
 */
export type SeedValidationResult = {
  collection: SeedDataCollection;
  isValid: boolean;
  issues: SeedValidationIssue[];
  validatedAt: Date;
  validated: number;
};

/**
 * Result produced when a live collection writes records to the database.
 */
export type SeedInsertResult = {
  collection: SeedDataCollection;
  insertedAt: Date;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
};

/**
 * Result produced when a collection summarizes its build/validate/insert work.
 */
export type SeedSummaryResult = {
  collection: SeedDataCollection;
  summarizedAt: Date;
  totalDatasets: number;
  totalRecords: number;
  created: number;
  validated: number;
  updated: number;
  skipped: number;
  failed: number;
};

/**
 * Runtime options that control how the seed runner executes collections.
 */
export type SeedRunOptions = {
  mode: SeedMode;
  resetBeforeSeed: boolean;
  collection?: SeedDataCollection;
};

/**
 * Aggregate outcome for a complete seed run.
 */
export type SeedRunSummary = {
  mode: SeedMode;
  startedAt: Date;
  completedAt: Date;
  collections: SeedDataCollection[];
  buildResults: SeedBuildResult[];
  validationResults: SeedValidationResult[];
  insertResults: SeedInsertResult[];
  summaryResults: SeedSummaryResult[];
};
