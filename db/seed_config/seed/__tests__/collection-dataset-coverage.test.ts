import { describe, expect, it } from "vitest";

import * as seedData from "../data/_index.data";
import { seedCollections } from "../registry";

type SeedDatasetLike = {
  table: string;
  records: unknown[];
};

describe("seed collection dataset coverage", () => {
  it("registers every exported seed dataset in exactly one collection", async () => {
    const exportedDatasets = Object.entries(
      seedData as Record<string, unknown>,
    ).filter(
      (entry): entry is [string, SeedDatasetLike] => isSeedDataset(entry[1]),
    );
    const registeredDatasets = new Map<SeedDatasetLike, string[]>();

    for (const collection of seedCollections) {
      const buildResult = await collection.build({} as never);

      for (const dataset of buildResult.datasets) {
        const owners = registeredDatasets.get(dataset) ?? [];
        owners.push(collection.collection);
        registeredDatasets.set(dataset, owners);
      }
    }

    const missingDatasets = exportedDatasets
      .filter(([, dataset]) => !registeredDatasets.has(dataset))
      .map(([name, dataset]) => `${name}:${dataset.table}`);
    const duplicatedDatasets = exportedDatasets
      .filter(([, dataset]) => (registeredDatasets.get(dataset)?.length ?? 0) > 1)
      .map(
        ([name, dataset]) =>
          `${name}:${dataset.table}:${registeredDatasets.get(dataset)?.join(",")}`,
      );

    expect(missingDatasets).toEqual([]);
    expect(duplicatedDatasets).toEqual([]);
  });
});

function isSeedDataset(value: unknown): value is SeedDatasetLike {
  return (
    typeof value === "object" &&
    value !== null &&
    "table" in value &&
    "records" in value &&
    typeof value.table === "string" &&
    Array.isArray(value.records)
  );
}
