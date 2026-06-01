import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { BSDATA_ROOT } from "./helpers/bsdata-root";

import {
  rulesSourcesDataset,
  unitProfilesDataset,
  unitProfileStatsDataset,
  unitsDataset,
} from "../data/_index.data";
import { unitId, unitProfileId, unitProfileStatId } from "../ids";

type BsDataUnitProfile = {
  unit_profile_slug: string;
};

type BsDataUnitProfileStat = {
  unit_profile_stat_slug: string;
};

describe("BSData unit_profiles and unit_profile_stats coverage", () => {
  it("covers BSData Unit profiles with global seed rows", () => {
    const expectedIds = new Set(
      loadBsDataUnitProfiles().map((record) =>
        unitProfileId(record.unit_profile_slug),
      ),
    );
    const actualIds = new Set(
      unitProfilesDataset.records.map((record) => record.id),
    );

    const missingIds = [...expectedIds].filter((id) => !actualIds.has(id));
    const extraIds = [...actualIds].filter((id) => !expectedIds.has(id));

    expect(missingIds).toEqual([]);
    expect(extraIds).toEqual([]);
  });

  it("covers BSData Unit profile characteristics with global seed rows", () => {
    const expectedIds = new Set(
      loadBsDataUnitProfileStats().map((record) =>
        unitProfileStatId(record.unit_profile_stat_slug),
      ),
    );
    const actualIds = new Set(
      unitProfileStatsDataset.records.map((record) => record.id),
    );

    const missingIds = [...expectedIds].filter((id) => !actualIds.has(id));
    const extraIds = [...actualIds].filter((id) => !expectedIds.has(id));

    expect(missingIds).toEqual([]);
    expect(extraIds).toEqual([]);
  });

  it("keeps multi-profile units distinct", () => {
    const profilesById = new Map(
      unitProfilesDataset.records.map((record) => [record.id, record]),
    );
    const statsById = new Map(
      unitProfileStatsDataset.records.map((record) => [record.id, record]),
    );

    expect(
      profilesById.get(unitProfileId("aggressor_squad__10e__aggressors")),
    ).toMatchObject({
      unit_profile_name: "Aggressor Squad - Aggressors",
      unit_id: unitId("aggressor_squad"),
    });
    expect(
      profilesById.get(
        unitProfileId("aggressor_squad__10e__aggressor_sergeant"),
      ),
    ).toMatchObject({
      unit_profile_name: "Aggressor Squad - Aggressor Sergeant",
      unit_id: unitId("aggressor_squad"),
    });
    expect(
      statsById.get(unitProfileStatId("aggressor_squad__10e__aggressors__m")),
    ).toMatchObject({
      unit_profile_id: unitProfileId("aggressor_squad__10e__aggressors"),
      stat_key: "M",
      stat_value: '5"',
    });
  });

  it("resolves all unit profile seed references", () => {
    const unitIds = new Set(unitsDataset.records.map((record) => record.id));
    const rulesSourceIds = new Set(
      rulesSourcesDataset.records.map((record) => record.id),
    );
    const unitProfileIds = new Set(
      unitProfilesDataset.records.map((record) => record.id),
    );
    const unresolvedRecords: string[] = [];
    const duplicateUnitProfileIds = duplicateValues(
      unitProfilesDataset.records.map((record) => record.id),
    );
    const duplicateUnitProfileStatIds = duplicateValues(
      unitProfileStatsDataset.records.map((record) => record.id),
    );

    for (const record of unitProfilesDataset.records) {
      if (!unitIds.has(record.unit_id)) {
        unresolvedRecords.push(`${record.id}:unit_id`);
      }
      if (!rulesSourceIds.has(record.rules_source_id)) {
        unresolvedRecords.push(`${record.id}:rules_source_id`);
      }
    }

    for (const record of unitProfileStatsDataset.records) {
      if (!unitProfileIds.has(record.unit_profile_id)) {
        unresolvedRecords.push(`${record.id}:unit_profile_id`);
      }
    }

    expect(unresolvedRecords).toEqual([]);
    expect(duplicateUnitProfileIds).toEqual([]);
    expect(duplicateUnitProfileStatIds).toEqual([]);
  });
});

function loadBsDataUnitProfiles(): BsDataUnitProfile[] {
  const result = spawnSync(
    "python3",
    [
      resolve(process.cwd(), "scripts/bsdata_expected_counts.py"),
      "--bsdata-root",
      BSDATA_ROOT,
      "--emit-unit-profiles",
    ],
    {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    },
  );

  expect(result.status, result.stderr || result.stdout).toBe(0);

  return JSON.parse(result.stdout) as BsDataUnitProfile[];
}

function loadBsDataUnitProfileStats(): BsDataUnitProfileStat[] {
  const result = spawnSync(
    "python3",
    [
      resolve(process.cwd(), "scripts/bsdata_expected_counts.py"),
      "--bsdata-root",
      BSDATA_ROOT,
      "--emit-unit-profile-stats",
    ],
    {
      encoding: "utf8",
      maxBuffer: 50 * 1024 * 1024,
    },
  );

  expect(result.status, result.stderr || result.stdout).toBe(0);

  return JSON.parse(result.stdout) as BsDataUnitProfileStat[];
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
