import {
  SeedRunOptions,
  SeedDataCollection,
  SeedTableConfigMap,
  SeedBuildResult,
  SeedValidationResult,
  SeedInsertResult,
  SeedSummaryResult,
} from "@db_index/";
import { LogInfo } from "@/utils/logger";

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
 * Shared execution context passed to every collection method.
 */
export type SeedCollectionContext = {
  options: SeedRunOptions;
  startedAt: Date;
  logInfo?: LogInfo;
};

/**
 * Configuration for a collection backed by static TypeScript datasets.
 */
export type StaticSeedCollectionConfig = {
  collection: SeedDataCollection;
  dependencies: SeedDataCollection[];
  datasets: AnySeedDataset[];
};

/**
 * Contract implemented by every seed data collection.
 */
export type SeedCollectionSeeder = {
  collection: SeedDataCollection;
  dependencies: SeedDataCollection[];
  tables: SeedTableName[];
  build: (
    context: SeedCollectionContext,
  ) => SeedBuildResult | Promise<SeedBuildResult>;
  validate: (
    buildResult: SeedBuildResult,
    context: SeedCollectionContext,
  ) => SeedValidationResult | Promise<SeedValidationResult>;
  insert: (
    buildResult: SeedBuildResult,
    context: SeedCollectionContext,
  ) => SeedInsertResult | Promise<SeedInsertResult>;
  summarize: (
    buildResult: SeedBuildResult,
    validationResult: SeedValidationResult,
    insertResult: SeedInsertResult,
    context: SeedCollectionContext,
  ) => SeedSummaryResult | Promise<SeedSummaryResult>;
};
