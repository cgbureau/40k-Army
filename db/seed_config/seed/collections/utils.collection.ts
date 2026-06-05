import type {
  AnySeedDataset,
  SeedBuildResult,
  SeedCollectionSeeder,
  SeedDataCollection,
  SeedInsertResult,
  SeedSummaryResult,
  SeedTableName,
  SeedValidationIssue,
  SeedValidationResult,
  StaticSeedCollectionConfig,
} from "../../types/_index.types";
import { validateSeedRecord } from "../validators";

/**
 * Counts all records across a list of seed datasets.
 *
 * @param datasets - Table-specific datasets to count.
 * @returns Total record count across every dataset.
 */
export const countDatasetRecords = (datasets: AnySeedDataset[]): number =>
  datasets.reduce((total, dataset) => total + dataset.records.length, 0);

/**
 * Builds a standard result for a static seed data collection.
 *
 * @param collection - Data collection being built.
 * @param datasets - Datasets owned by the collection.
 * @returns Build result containing the collection datasets.
 */
export const buildCollection = (
  collection: SeedDataCollection,
  datasets: AnySeedDataset[],
): SeedBuildResult => ({
  collection,
  datasets,
  builtAt: new Date(),
});

/**
 * Performs structural and table-specific validation for built static seed
 * datasets.
 *
 * @param buildResult - Built datasets to validate.
 * @returns Validation result with any structural issues found.
 */
export const validateCollection = (
  buildResult: SeedBuildResult,
): SeedValidationResult => {
  const issues: SeedValidationIssue[] = [];
  const seenTables = new Set<SeedTableName>();

  for (const dataset of buildResult.datasets) {
    if (seenTables.has(dataset.table)) {
      issues.push({
        collection: buildResult.collection,
        table: dataset.table,
        message: `Duplicate dataset for table ${dataset.table}`,
        severity: "error",
      });
    }

    seenTables.add(dataset.table);

    if (!Array.isArray(dataset.records)) {
      issues.push({
        collection: buildResult.collection,
        table: dataset.table,
        message: `Dataset records must be an array for table ${dataset.table}`,
        severity: "error",
      });
      continue;
    }

    for (const record of dataset.records) {
      if ("id" in record && !record.id) {
        issues.push({
          collection: buildResult.collection,
          table: dataset.table,
          message: `Seed record is missing a stable id`,
          severity: "error",
        });
      }

      issues.push(
        ...validateSeedRecord(
          buildResult.collection,
          dataset.table,
          record,
        ),
      );
    }
  }

  return {
    collection: buildResult.collection,
    isValid: issues.every((issue) => issue.severity !== "error"),
    issues,
    validatedAt: new Date(),
    validated: countDatasetRecords(buildResult.datasets),
  };
};

/**
 * Placeholder insert implementation for static seed datasets.
 *
 * Until Prisma upserts are implemented, every built record is counted as
 * skipped so the collection lifecycle can be exercised without database writes.
 *
 * @param buildResult - Built datasets that would be inserted.
 * @returns Insert result with all records counted as skipped.
 */
export const insertCollection = (
  buildResult: SeedBuildResult,
): SeedInsertResult => ({
  collection: buildResult.collection,
  insertedAt: new Date(),
  created: 0,
  updated: 0,
  skipped: countDatasetRecords(buildResult.datasets),
  failed: 0,
});

/**
 * Summarizes build, validation, and insert results for a seed collection.
 *
 * @param buildResult - Result returned by the collection build stage.
 * @param insertResult - Result returned by the collection insert stage.
 * @returns Aggregated collection summary.
 */
export const summarizeCollection = (
  buildResult: SeedBuildResult,
  validateResult: SeedValidationResult,
  insertResult: SeedInsertResult,
): SeedSummaryResult => ({
  collection: buildResult.collection,
  summarizedAt: new Date(),
  totalDatasets: buildResult.datasets.length,
  totalRecords: countDatasetRecords(buildResult.datasets),
  created: insertResult.created,
  validated: validateResult.validated,
  updated: insertResult.updated,
  skipped: insertResult.skipped,
  failed: insertResult.failed,
});

/**
 * Creates a seed collection backed by static TypeScript dataset modules.
 *
 * @param config - Collection name, dependencies, and owned datasets.
 * @returns Seed collection seeder using shared build/validate/insert behavior.
 */
export const createStaticSeedCollection = (
  config: StaticSeedCollectionConfig,
): SeedCollectionSeeder => ({
  collection: config.collection,
  dependencies: config.dependencies,
  tables: config.datasets.map((dataset) => dataset.table),
  build: () => buildCollection(config.collection, config.datasets),
  validate: (buildResult: SeedBuildResult) => validateCollection(buildResult),
  insert: (buildResult: SeedBuildResult) => insertCollection(buildResult),
  summarize: (
    buildResult: SeedBuildResult,
    validationResult: SeedValidationResult,
    insertResult: SeedInsertResult,
  ) => summarizeCollection(buildResult, validationResult, insertResult),
});
