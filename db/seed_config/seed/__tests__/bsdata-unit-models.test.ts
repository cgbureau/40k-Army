import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  modelsDataset,
  unitModelsDataset,
  unitsDataset,
} from "../data/_index.data";
import { modelId, unitModelId } from "../ids";

type BsDataUnitModel = {
  unit_model_slug: string;
  model_slug: string;
};

type BsDataModel = {
  model_slug: string;
};

const BSDATA_ROOT =
  process.env.BSDATA_40K_ROOT ?? "/Users/mikeearley/code/wh40k-10e";

describe("BSData unit_models and models coverage", () => {
  it("covers BSData unit model selections with global seed rows", () => {
    const expectedIds = new Set(
      loadBsDataUnitModels().map((record) =>
        unitModelId(record.unit_model_slug),
      ),
    );
    const actualIds = new Set(
      unitModelsDataset.records.map((record) => record.id),
    );

    const missingIds = [...expectedIds].filter((id) => !actualIds.has(id));
    const extraIds = [...actualIds].filter((id) => !expectedIds.has(id));

    expect(missingIds).toEqual([]);
    expect(extraIds).toEqual([]);
  });

  it("covers BSData model identities with global seed rows", () => {
    const expectedIds = new Set(
      loadBsDataModels().map((record) => modelId(record.model_slug)),
    );
    const actualIds = new Set(modelsDataset.records.map((record) => record.id));

    const missingIds = [...expectedIds].filter((id) => !actualIds.has(id));
    const extraIds = [...actualIds].filter((id) => !expectedIds.has(id));

    expect(missingIds).toEqual([]);
    expect(extraIds).toEqual([]);
  });

  it("preserves duplicate BSData model selections within a unit", () => {
    const actualIds = new Set(
      unitModelsDataset.records.map((record) => record.id),
    );

    expect(
      actualIds.has(unitModelId("hells_last__lesks_hero__2e95_479e_8c46_956d")),
    ).toBe(true);
    expect(
      actualIds.has(unitModelId("hells_last__lesks_hero__68e3_e975_c00e_cf4c")),
    ).toBe(true);
    expect(
      actualIds.has(unitModelId("hells_last__lesks_hero__d763_f52e_5797_67c0")),
    ).toBe(true);
    expect(
      actualIds.has(unitModelId("hells_last__lesks_hero__f13b_f830_0b6b_7d25")),
    ).toBe(true);
  });

  it("resolves all unit model seed references", () => {
    const unitIds = new Set(unitsDataset.records.map((record) => record.id));
    const modelIds = new Set(modelsDataset.records.map((record) => record.id));
    const unresolvedRecords: string[] = [];
    const duplicateUnitModelIds = duplicateValues(
      unitModelsDataset.records.map((record) => record.id),
    );
    const duplicateModelIds = duplicateValues(
      modelsDataset.records.map((record) => record.id),
    );

    for (const record of unitModelsDataset.records) {
      if (!unitIds.has(record.unit_id)) {
        unresolvedRecords.push(`${record.id}:unit_id`);
      }
      if (!modelIds.has(record.model_id)) {
        unresolvedRecords.push(`${record.id}:model_id`);
      }
    }

    expect(unresolvedRecords).toEqual([]);
    expect(duplicateUnitModelIds).toEqual([]);
    expect(duplicateModelIds).toEqual([]);
  });
});

function loadBsDataUnitModels(): BsDataUnitModel[] {
  const result = spawnSync(
    "python3",
    [
      resolve(process.cwd(), "scripts/bsdata_expected_counts.py"),
      "--bsdata-root",
      BSDATA_ROOT,
      "--emit-unit-models",
    ],
    {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    },
  );

  expect(result.status, result.stderr || result.stdout).toBe(0);

  return JSON.parse(result.stdout) as BsDataUnitModel[];
}

function loadBsDataModels(): BsDataModel[] {
  const result = spawnSync(
    "python3",
    [
      resolve(process.cwd(), "scripts/bsdata_expected_counts.py"),
      "--bsdata-root",
      BSDATA_ROOT,
      "--emit-models",
    ],
    {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    },
  );

  expect(result.status, result.stderr || result.stdout).toBe(0);

  return JSON.parse(result.stdout) as BsDataModel[];
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
