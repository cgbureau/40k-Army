import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  keywordsDataset,
  rulesSourcesDataset,
  weaponProfileKeywordsDataset,
  weaponProfilesDataset,
  weaponsDataset,
} from "../data/_index.data";
import { weaponId, weaponProfileId, weaponProfileKeywordId } from "../ids";

type BsDataWeapon = {
  weapon_slug: string;
};

type BsDataWeaponProfile = {
  weapon_profile_slug: string;
};

type BsDataWeaponProfileKeyword = {
  weapon_profile_keyword_slug: string;
};

const BSDATA_ROOT =
  process.env.BSDATA_40K_ROOT ?? "/Users/mikeearley/code/wh40k-10e";

describe("BSData weapon coverage", () => {
  it("covers BSData weapon rows", () => {
    const expectedIds = new Set(
      loadBsDataRecords<BsDataWeapon>("--emit-weapons").map((record) =>
        weaponId(record.weapon_slug),
      ),
    );
    const actualIds = new Set(weaponsDataset.records.map((record) => record.id));

    expect([...expectedIds].filter((id) => !actualIds.has(id))).toEqual([]);
    expect([...actualIds].filter((id) => !expectedIds.has(id))).toEqual([]);
  });

  it("covers BSData weapon profile rows", () => {
    const expectedIds = new Set(
      loadBsDataRecords<BsDataWeaponProfile>("--emit-weapon-profiles").map(
        (record) => weaponProfileId(record.weapon_profile_slug),
      ),
    );
    const actualIds = new Set(
      weaponProfilesDataset.records.map((record) => record.id),
    );

    expect([...expectedIds].filter((id) => !actualIds.has(id))).toEqual([]);
    expect([...actualIds].filter((id) => !expectedIds.has(id))).toEqual([]);
  });

  it("covers BSData weapon profile keyword rows", () => {
    const expectedIds = new Set(
      loadBsDataRecords<BsDataWeaponProfileKeyword>(
        "--emit-weapon-profile-keywords",
      ).map((record) =>
        weaponProfileKeywordId(record.weapon_profile_keyword_slug),
      ),
    );
    const actualIds = new Set(
      weaponProfileKeywordsDataset.records.map((record) => record.id),
    );

    expect([...expectedIds].filter((id) => !actualIds.has(id))).toEqual([]);
    expect([...actualIds].filter((id) => !expectedIds.has(id))).toEqual([]);
  });

  it("resolves weapon table references", () => {
    const weaponIds = new Set(weaponsDataset.records.map((record) => record.id));
    const weaponProfileIds = new Set(
      weaponProfilesDataset.records.map((record) => record.id),
    );
    const keywordIds = new Set(keywordsDataset.records.map((record) => record.id));
    const rulesSourceIds = new Set(
      rulesSourcesDataset.records.map((record) => record.id),
    );
    const unresolvedRecords: string[] = [];

    for (const record of weaponProfilesDataset.records) {
      if (!weaponIds.has(record.weapon_id)) {
        unresolvedRecords.push(`${record.id}:weapon_id`);
      }
      if (!rulesSourceIds.has(record.rules_source_id)) {
        unresolvedRecords.push(`${record.id}:rules_source_id`);
      }
    }

    for (const record of weaponProfileKeywordsDataset.records) {
      if (!weaponProfileIds.has(record.weapon_profile_id)) {
        unresolvedRecords.push(`${record.id}:weapon_profile_id`);
      }
      if (!keywordIds.has(record.keyword_id)) {
        unresolvedRecords.push(`${record.id}:keyword_id`);
      }
    }

    expect(unresolvedRecords).toEqual([]);
    expect(duplicateValues(weaponsDataset.records.map((record) => record.id))).toEqual(
      [],
    );
    expect(
      duplicateValues(weaponProfilesDataset.records.map((record) => record.id)),
    ).toEqual([]);
    expect(
      duplicateValues(
        weaponProfileKeywordsDataset.records.map((record) => record.id),
      ),
    ).toEqual([]);
  });
});

function loadBsDataRecords<T>(emitFlag: string): T[] {
  const result = spawnSync(
    "python3",
    [
      resolve(process.cwd(), "scripts/bsdata_expected_counts.py"),
      "--bsdata-root",
      BSDATA_ROOT,
      emitFlag,
    ],
    {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    },
  );

  expect(result.status, result.stderr || result.stdout).toBe(0);

  return JSON.parse(result.stdout) as T[];
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
