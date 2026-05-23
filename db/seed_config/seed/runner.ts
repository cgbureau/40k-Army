// take the registered collections and execute their lifecycle methods in order

/**
 * for each collection:
 * - build
 * - validate
 * - if invalid, stop
 * - insert
 * - summarize
 *
 * 1. what options is this run using?
 * 2. which registered collections should run?
 * 3. where do we store each stage result?
 */

import type {
  SeedBuildResult,
  SeedCollectionContext,
  SeedCollectionSeeder,
  SeedInsertResult,
  SeedRunOptions,
  SeedRunSummary,
  SeedSummaryResult,
  SeedValidationResult,
} from "../types/_index.types";
import { seedCollections } from "./registry";

const defaultSeedRunOptions: SeedRunOptions = {
  mode: "dry_run",
  resetBeforeSeed: false,
};

const getCollectionsForRun = (
  options: SeedRunOptions,
): SeedCollectionSeeder[] => {
  if (!options.collection) {
    return seedCollections;
  }

  const collection = seedCollections.find(
    (seedCollection) => seedCollection.collection === options.collection,
  );

  if (!collection) {
    throw new Error(`Unknown seed collection: ${options.collection}`);
  }

  return [collection];
};

export const runSeedCollections = async (
  options: Partial<SeedRunOptions> = {},
): Promise<SeedRunSummary> => {
  const resolvedOptions: SeedRunOptions = {
    ...defaultSeedRunOptions,
    ...options,
  };
  const buildResults: SeedBuildResult[] = [];
  const validationResults: SeedValidationResult[] = [];
  const insertResults: SeedInsertResult[] = [];
  const summaryResults: SeedSummaryResult[] = [];
  const startedAt = new Date();
  const context: SeedCollectionContext = {
    options: resolvedOptions,
    startedAt,
  };
  const collections = getCollectionsForRun(resolvedOptions);

  for (const collection of collections) {
    const buildResult = await collection.build(context);
    buildResults.push(buildResult);

    const validationResult = await collection.validate(buildResult, context);
    validationResults.push(validationResult);

    if (!validationResult.isValid) {
      throw new Error(`Seed validation failed for ${collection.collection}`);
    }

    const insertResult = await collection.insert(buildResult, context);
    insertResults.push(insertResult);

    const summarizeResult = await collection.summarize(
      buildResult,
      validationResult,
      insertResult,
      context,
    );
    summaryResults.push(summarizeResult);
  }

  return {
    mode: resolvedOptions.mode,
    startedAt,
    completedAt: new Date(),
    collections: collections.map((collection) => collection.collection),
    buildResults,
    validationResults,
    insertResults,
    summaryResults,
  };
};
