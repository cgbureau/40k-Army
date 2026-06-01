import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { BSDATA_ROOT } from "./helpers/bsdata-root";

import {
  rulesFactionsDataset,
  rulesFactionUnitsDataset,
  rulesSourcesDataset,
  unitsDataset,
} from "../data/_index.data";

type BsDataRulesFactionUnit = {
  rules_faction_slug: string;
  unit_slug: string;
};

describe("BSData rules_faction_units coverage", () => {
  it("matches BSData faction-unit memberships exactly", () => {
    const expectedPairs = loadBsDataRulesFactionUnits();
    const actualPairs = currentRulesFactionUnitPairs();

    const missingPairs = [...expectedPairs].filter((pair) => !actualPairs.has(pair));
    const extraPairs = [...actualPairs].filter((pair) => !expectedPairs.has(pair));

    expect(missingPairs).toEqual([]);
    expect(extraPairs).toEqual([]);
  });

  it("keeps Ferren Areios scoped to Ultramarines Legends", () => {
    const rows = currentRulesFactionUnitRowsByPair();

    expect(rows.has("space_marines__ferren_areios")).toBe(false);
    expect(rows.has("black_templars__ferren_areios")).toBe(false);
    expect(rows.has("raven_guard__ferren_areios")).toBe(false);
    expect(rows.get("ultramarines__ferren_areios")).toEqual({
      accessType: "exclusive",
      rulesSourceSlug: "legends_ultramarines_10e",
    });
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
  return new Set(currentRulesFactionUnitRowsByPair().keys());
}

function currentRulesFactionUnitRowsByPair(): Map<
  string,
  { accessType: string; rulesSourceSlug: string }
> {
  const factionSlugById = new Map(
    rulesFactionsDataset.records.map((record) => [
      record.id,
      record.rules_faction_slug,
    ]),
  );
  const unitSlugById = new Map(
    unitsDataset.records.map((record) => [record.id, record.unit_slug]),
  );
  const rulesSourceSlugById = new Map(
    rulesSourcesDataset.records.map((record) => [
      record.id,
      record.rules_source_slug,
    ]),
  );

  const unresolvedRecords: string[] = [];
  const rows = new Map<string, { accessType: string; rulesSourceSlug: string }>();

  for (const record of rulesFactionUnitsDataset.records) {
    const factionSlug = factionSlugById.get(record.rules_faction_id);
    const unitSlug = unitSlugById.get(record.unit_id);
    const rulesSourceSlug = rulesSourceSlugById.get(record.rules_source_id);

    if (!factionSlug || !unitSlug || !rulesSourceSlug || !record.unit_access_type) {
      unresolvedRecords.push(record.rules_faction_unit_slug);
      continue;
    }

    rows.set(`${factionSlug}__${unitSlug}`, {
      accessType: record.unit_access_type,
      rulesSourceSlug,
    });
  }

  expect(unresolvedRecords).toEqual([]);
  return rows;
}
