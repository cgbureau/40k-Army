import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  leaderEligibilitiesDataset,
  rulesSourcesDataset,
  unitsDataset,
} from "../data/_index.data";
import { leaderEligibilityId } from "../ids";

type BsDataLeaderEligibility = {
  rules_faction_slug: string;
  leader_eligibility_slug: string;
  leader_unit_slug: string;
  target_unit_slug: string | null;
  target_kind: "unit" | "keyword_predicate";
};

const BSDATA_ROOT =
  process.env.BSDATA_40K_ROOT ?? "/Users/mikeearley/code/wh40k-10e";

describe("BSData leader_eligibilities coverage", () => {
  it("covers BSData leader eligibility memberships with global seed rows", () => {
    const expectedKeys = loadBsDataLeaderEligibilityKeys();
    const actualKeys = currentLeaderEligibilityKeys();

    const missingKeys = [...expectedKeys].filter((key) => !actualKeys.has(key));
    const extraKeys = [...actualKeys].filter((key) => !expectedKeys.has(key));

    expect(missingKeys).toEqual([]);
    expect(extraKeys).toEqual([]);
  });

  it("resolves all leader eligibility seed references", () => {
    const unitIds = new Set(unitsDataset.records.map((record) => record.id));
    const rulesSourceIds = new Set(
      rulesSourcesDataset.records.map((record) => record.id),
    );
    const unresolvedRecords: string[] = [];
    const duplicateIds = duplicateValues(
      leaderEligibilitiesDataset.records.map((record) => record.id),
    );

    for (const record of leaderEligibilitiesDataset.records) {
      if (!unitIds.has(record.leader_unit_id)) {
        unresolvedRecords.push(`${record.id}:leader_unit_id`);
      }
      if (record.target_unit_id && !unitIds.has(record.target_unit_id)) {
        unresolvedRecords.push(`${record.id}:target_unit_id`);
      }
      if (!rulesSourceIds.has(record.rules_source_id)) {
        unresolvedRecords.push(`${record.id}:rules_source_id`);
      }
    }

    expect(unresolvedRecords).toEqual([]);
    expect(duplicateIds).toEqual([]);
  });
});

function loadBsDataLeaderEligibilityKeys(): Set<string> {
  const result = spawnSync(
    "python3",
    [
      resolve(process.cwd(), "scripts/bsdata_expected_counts.py"),
      "--bsdata-root",
      BSDATA_ROOT,
      "--emit-leader-eligibilities",
    ],
    {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    },
  );

  expect(result.status, result.stderr || result.stdout).toBe(0);

  const records = JSON.parse(result.stdout) as BsDataLeaderEligibility[];
  return new Set(records.map(leaderEligibilityKey));
}

function currentLeaderEligibilityKeys(): Set<string> {
  const unitSlugById = new Map(
    unitsDataset.records.map((record) => [record.id, record.unit_slug]),
  );
  const keys = new Set<string>();

  for (const record of leaderEligibilitiesDataset.records) {
    const leaderSlug = unitSlugById.get(record.leader_unit_id);

    if (!leaderSlug) {
      continue;
    }

    if (!record.target_unit_id) {
      keys.add(record.id);
      continue;
    }

    const targetSlug = unitSlugById.get(record.target_unit_id);
    if (targetSlug) {
      keys.add(`${leaderSlug}__${targetSlug}`);
    }
  }

  return keys;
}

function leaderEligibilityKey(record: BsDataLeaderEligibility): string {
  if (record.target_unit_slug) {
    return `${record.leader_unit_slug}__${record.target_unit_slug}`;
  }

  return leaderEligibilityId(record.leader_eligibility_slug);
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
