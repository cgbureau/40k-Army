import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  detachmentsDataset,
  rulesFactionDetachmentsDataset,
  rulesFactionsDataset,
} from "../data/_index.data";

type BsDataRulesFactionDetachment = {
  rules_faction_slug: string;
  detachment_slug: string;
  detachment_access_type: string;
};

const BSDATA_ROOT =
  process.env.BSDATA_40K_ROOT ?? "/Users/mikeearley/code/wh40k-10e";

describe("BSData rules_faction_detachments coverage", () => {
  it("matches BSData faction-detachment memberships and access types exactly", () => {
    const expectedRecords = loadBsDataRulesFactionDetachments();
    const actualRecords = currentRulesFactionDetachmentPairs();

    const expectedPairs = new Set(expectedRecords.keys());
    const actualPairs = new Set(actualRecords.keys());
    const missingPairs = [...expectedPairs].filter((pair) => !actualPairs.has(pair));
    const extraPairs = [...actualPairs].filter((pair) => !expectedPairs.has(pair));

    expect(missingPairs).toEqual([]);
    expect(extraPairs).toEqual([]);

    const accessTypeMismatches = [...expectedRecords.entries()]
      .filter(([pair, expectedAccessType]) => {
        return actualRecords.get(pair) !== expectedAccessType;
      })
      .map(([pair, expectedAccessType]) => ({
        pair,
        expectedAccessType,
        actualAccessType: actualRecords.get(pair),
      }));

    expect(accessTypeMismatches).toEqual([]);
  });
});

function loadBsDataRulesFactionDetachments(): Map<string, string> {
  const result = spawnSync(
    "python3",
    [
      resolve(process.cwd(), "scripts/bsdata_expected_counts.py"),
      "--bsdata-root",
      BSDATA_ROOT,
      "--emit-rules-faction-detachments",
    ],
    { encoding: "utf8" },
  );

  expect(result.status, result.stderr || result.stdout).toBe(0);

  const records = JSON.parse(result.stdout) as BsDataRulesFactionDetachment[];
  return new Map(
    records.map((record) => [
      `${record.rules_faction_slug}__${record.detachment_slug}`,
      record.detachment_access_type,
    ]),
  );
}

function currentRulesFactionDetachmentPairs(): Map<string, string> {
  const factionSlugById = new Map(
    rulesFactionsDataset.records.map((record) => [
      record.id,
      record.rules_faction_slug,
    ]),
  );
  const detachmentSlugById = new Map(
    detachmentsDataset.records.map((record) => [
      record.id,
      record.detachment_slug,
    ]),
  );

  const unresolvedRecords: string[] = [];
  const nullAccessTypeRecords: string[] = [];
  const pairs = new Map<string, string>();

  for (const record of rulesFactionDetachmentsDataset.records) {
    const factionSlug = factionSlugById.get(record.rules_faction_id);
    const detachmentSlug = detachmentSlugById.get(record.detachment_id);

    if (!factionSlug || !detachmentSlug) {
      unresolvedRecords.push(record.id);
      continue;
    }

    if (!record.detachment_access_type) {
      nullAccessTypeRecords.push(record.id);
      continue;
    }

    pairs.set(
      `${factionSlug}__${detachmentSlug}`,
      record.detachment_access_type,
    );
  }

  expect(unresolvedRecords).toEqual([]);
  expect(nullAccessTypeRecords).toEqual([]);
  return pairs;
}
