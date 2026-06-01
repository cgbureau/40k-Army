import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { BSDATA_ROOT } from "./helpers/bsdata-root";

import {
  rulesSourcesDataset,
  unitPointCostsDataset,
  unitsDataset,
} from "../data/_index.data";
import { unitId, unitPointCostId } from "../ids";

type BsDataUnitPointCost = {
  unit_point_cost_slug: string;
};

describe("BSData unit_point_costs coverage", () => {
  it("covers BSData point cost values with global seed rows", () => {
    const expectedIds = new Set(
      loadBsDataUnitPointCosts().map((record) =>
        unitPointCostId(record.unit_point_cost_slug),
      ),
    );
    const actualIds = new Set(
      unitPointCostsDataset.records.map((record) => record.id),
    );

    const missingIds = [...expectedIds].filter((id) => !actualIds.has(id));
    const extraIds = [...actualIds].filter((id) => !expectedIds.has(id));

    expect(missingIds).toEqual([]);
    expect(extraIds).toEqual([]);
  });

  it("keeps common multi-size point rows", () => {
    const rowsById = new Map(
      unitPointCostsDataset.records.map((record) => [record.id, record]),
    );

    expect(rowsById.get(unitPointCostId("aggressor_squad__10e__3m"))).toMatchObject({
      unit_id: unitId("aggressor_squad"),
      minimum_model_count: 3,
      maximum_model_count: 3,
      unit_points: 95,
    });
    expect(rowsById.get(unitPointCostId("aggressor_squad__10e__6m"))).toMatchObject({
      unit_id: unitId("aggressor_squad"),
      minimum_model_count: 6,
      maximum_model_count: 6,
      unit_points: 190,
    });
  });

  it("resolves all unit point cost seed references", () => {
    const unitIds = new Set(unitsDataset.records.map((record) => record.id));
    const rulesSourceIds = new Set(
      rulesSourcesDataset.records.map((record) => record.id),
    );
    const unresolvedRecords: string[] = [];
    const duplicateIds = duplicateValues(
      unitPointCostsDataset.records.map((record) => record.id),
    );

    for (const record of unitPointCostsDataset.records) {
      if (!unitIds.has(record.unit_id)) {
        unresolvedRecords.push(`${record.id}:unit_id`);
      }
      if (!rulesSourceIds.has(record.rules_source_id)) {
        unresolvedRecords.push(`${record.id}:rules_source_id`);
      }
    }

    expect(unresolvedRecords).toEqual([]);
    expect(duplicateIds).toEqual([]);
  });
});

function loadBsDataUnitPointCosts(): BsDataUnitPointCost[] {
  const result = spawnSync(
    "python3",
    [
      resolve(process.cwd(), "scripts/bsdata_expected_counts.py"),
      "--bsdata-root",
      BSDATA_ROOT,
      "--emit-unit-point-costs",
    ],
    {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    },
  );

  expect(result.status, result.stderr || result.stdout).toBe(0);

  return JSON.parse(result.stdout) as BsDataUnitPointCost[];
}

function duplicateValues(values: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }

    seen.add(value);
  }

  return [...duplicates].sort();
}
