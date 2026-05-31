import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  rulesFactionsDataset,
  rulesFactionUnitsDataset,
  unitsDataset,
} from "../data/_index.data";

type BsDataRulesFactionUnit = {
  rules_faction_slug: string;
  unit_slug: string;
};

const BSDATA_ROOT =
  process.env.BSDATA_40K_ROOT ?? "/Users/mikeearley/code/wh40k-10e";

describe("BSData rules_faction_units coverage", () => {
  it("matches BSData faction-unit memberships exactly", () => {
    const expectedPairs = loadBsDataRulesFactionUnits();
    const actualPairs = currentRulesFactionUnitPairs();

    const missingPairs = [...expectedPairs].filter((pair) => !actualPairs.has(pair));
    const extraPairs = [...actualPairs].filter((pair) => !expectedPairs.has(pair));

    expect(missingPairs).toEqual([]);
    expect(extraPairs).toEqual([]);
  });
});

function loadBsDataRulesFactionUnits(): Set<string> {
  const result = spawnSync(
    "python3",
    [
      resolve(process.cwd(), "scripts/bsdata_expected_counts.py"),
      "--bsdata-root",
      BSDATA_ROOT,
      "--emit-rules-faction-units",
    ],
    { encoding: "utf8" },
  );

  expect(result.status, result.stderr || result.stdout).toBe(0);

  const records = JSON.parse(result.stdout) as BsDataRulesFactionUnit[];
  return new Set(
    records.map(
      (record) => `${record.rules_faction_slug}__${record.unit_slug}`,
    ),
  );
}

function currentRulesFactionUnitPairs(): Set<string> {
  const factionSlugById = new Map(
    rulesFactionsDataset.records.map((record) => [
      record.id,
      record.rules_faction_slug,
    ]),
  );
  const unitSlugById = new Map(
    unitsDataset.records.map((record) => [record.id, record.unit_slug]),
  );

  const unresolvedRecords: string[] = [];
  const pairs = new Set<string>();

  for (const record of rulesFactionUnitsDataset.records) {
    const factionSlug = factionSlugById.get(record.rules_faction_id);
    const unitSlug = unitSlugById.get(record.unit_id);

    if (!factionSlug || !unitSlug) {
      unresolvedRecords.push(record.rules_faction_unit_slug);
      continue;
    }

    pairs.add(`${factionSlug}__${unitSlug}`);
  }

  expect(unresolvedRecords).toEqual([]);
  return pairs;
}
