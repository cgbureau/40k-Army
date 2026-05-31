import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  keywordsDataset,
  leaderEligibilitiesDataset,
  leaderEligibilityKeywordsDataset,
} from "../data/_index.data";
import { leaderEligibilityId } from "../ids";

type BsDataLeaderEligibilityKeyword = {
  leader_eligibility_slug: string;
  keyword_slug: string;
};

const BSDATA_ROOT =
  process.env.BSDATA_40K_ROOT ?? "/Users/mikeearley/code/wh40k-10e";

describe("BSData leader_eligibility_keywords coverage", () => {
  it("covers BSData keyword-predicate leader targets with global seed rows", () => {
    const expectedKeys = new Set(loadBsDataLeaderEligibilityKeywordKeys());
    const actualKeys = currentLeaderEligibilityKeywordKeys();

    const missingKeys = [...expectedKeys].filter((key) => !actualKeys.has(key));
    const extraKeys = [...actualKeys].filter((key) => !expectedKeys.has(key));

    expect(missingKeys).toEqual([]);
    expect(extraKeys).toEqual([]);
  });

  it("expands compound keyword predicates", () => {
    const actualKeys = currentLeaderEligibilityKeywordKeys();

    expect(
      actualKeys.has(
        key("inquisitor__keyword_imperium_battleline_infantry", "imperium"),
      ),
    ).toBe(true);
    expect(
      actualKeys.has(
        key("inquisitor__keyword_imperium_battleline_infantry", "battleline"),
      ),
    ).toBe(true);
    expect(
      actualKeys.has(
        key("inquisitor__keyword_imperium_battleline_infantry", "infantry"),
      ),
    ).toBe(true);
    expect(
      actualKeys.has(
        key("daemonic_charioteer_crucible__keyword_nurgle", "mounted"),
      ),
    ).toBe(true);
    expect(
      actualKeys.has(
        key("daemonic_charioteer_crucible__keyword_nurgle", "daemon"),
      ),
    ).toBe(true);
    expect(
      actualKeys.has(
        key("daemonic_charioteer_crucible__keyword_nurgle", "nurgle"),
      ),
    ).toBe(true);
  });

  it("resolves all leader eligibility keyword seed references", () => {
    const leaderEligibilityIds = new Set(
      leaderEligibilitiesDataset.records.map((record) => record.id),
    );
    const keywordIds = new Set(keywordsDataset.records.map((record) => record.id));
    const unresolvedRecords: string[] = [];
    const duplicateIds = duplicateValues(
      leaderEligibilityKeywordsDataset.records.map((record) => record.id),
    );

    for (const record of leaderEligibilityKeywordsDataset.records) {
      if (!leaderEligibilityIds.has(record.leader_eligibility_id)) {
        unresolvedRecords.push(`${record.id}:leader_eligibility_id`);
      }
      if (!keywordIds.has(record.keyword_id)) {
        unresolvedRecords.push(`${record.id}:keyword_id`);
      }
    }

    expect(unresolvedRecords).toEqual([]);
    expect(duplicateIds).toEqual([]);
  });
});

function loadBsDataLeaderEligibilityKeywordKeys(): string[] {
  const result = spawnSync(
    "python3",
    [
      resolve(process.cwd(), "scripts/bsdata_expected_counts.py"),
      "--bsdata-root",
      BSDATA_ROOT,
      "--emit-leader-eligibility-keywords",
    ],
    {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    },
  );

  expect(result.status, result.stderr || result.stdout).toBe(0);

  const records = JSON.parse(result.stdout) as BsDataLeaderEligibilityKeyword[];
  return records.map(
    (record) => key(record.leader_eligibility_slug, record.keyword_slug),
  );
}

function currentLeaderEligibilityKeywordKeys(): Set<string> {
  const leaderEligibilitySlugById = new Map(
    leaderEligibilitiesDataset.records.map((record) => [record.id, record.id]),
  );
  const keywordSlugById = new Map(
    keywordsDataset.records.map((record) => [record.id, record.keyword_slug]),
  );
  const keys = new Set<string>();

  for (const record of leaderEligibilityKeywordsDataset.records) {
    const leaderEligibilitySlug = leaderEligibilitySlugById.get(
      record.leader_eligibility_id,
    );
    const keywordSlug = keywordSlugById.get(record.keyword_id);

    if (leaderEligibilitySlug && keywordSlug) {
      keys.add(`${leaderEligibilitySlug}__${keywordSlug}`);
    }
  }

  return keys;
}

function key(leaderEligibilitySlug: string, keywordSlug: string): string {
  return `${leaderEligibilityId(leaderEligibilitySlug)}__${keywordSlug}`;
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
