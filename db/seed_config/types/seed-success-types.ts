import type { SeedTable } from "@db_index/";

export type SeedDateConfig = {
  createdAt: Date;
  updatedAt: Date | null;
};

export type SeededRecord<
  TTable extends SeedTable = SeedTable,
  TData extends Record<string, unknown> = Record<string, unknown>,
> = {
  id: string;
  table: TTable;
  createdAt: Date;
  updatedAt: Date | null;
  seedSequence?: number;
  dateConfig: SeedDateConfig;
} & TData;

export type Seeded = SeededRecord;
