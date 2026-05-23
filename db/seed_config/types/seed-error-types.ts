import type { SeedTableConfigMap } from "./seed-config-types";

export type SeedTable = keyof SeedTableConfigMap;

export type SeedOperation = "insert" | "update" | "delete";

export type SeedingErrorContext = {
  table: SeedTable;
  operation: SeedOperation;
  id?: string;
};

export class SeedingError {
  readonly _tag = "SeedingError";
  readonly error: unknown;
  readonly context: SeedingErrorContext;

  /**
   * Creates a seeding error with the original error and seed operation context.
   *
   * @param error - The error that occurred while seeding the database.
   * @param context - The table, operation, and optional record id being seeded.
   */
  constructor(error: unknown, context: SeedingErrorContext) {
    this.error = error;
    this.context = context;
  }
}
