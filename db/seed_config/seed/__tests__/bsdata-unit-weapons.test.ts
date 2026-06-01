import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { BSDATA_ROOT } from "./helpers/bsdata-root";

import {
  rulesSourcesDataset,
  unitWeaponsDataset,
  unitsDataset,
} from "../data/_index.data";
import { unitId, unitWeaponId, weaponProfileId } from "../ids";

type BsDataUnitWeapon = {
  unit_weapon_slug: string;
};

describe("BSData unit_weapons coverage", () => {
  it("covers BSData weapon profiles with global unit weapon rows", () => {
    const expectedIds = new Set(
      loadBsDataUnitWeapons().map((record) =>
        unitWeaponId(record.unit_weapon_slug),
      ),
    );
    const actualIds = new Set(
      unitWeaponsDataset.records.map((record) => record.id),
    );

    const missingIds = [...expectedIds].filter((id) => !actualIds.has(id));
    const extraIds = [...actualIds].filter((id) => !expectedIds.has(id));

    expect(missingIds).toEqual([]);
    expect(extraIds).toEqual([]);
  });

  it("preserves duplicate BSData weapon profile entries within a unit", () => {
    const rowsById = new Map(
      unitWeaponsDataset.records.map((record) => [record.id, record]),
    );

    expect(
      rowsById.get(
        unitWeaponId(
          "aggressor_squad__auto_boltstorm_gauntlets__10e__codex_space_marines_10e__250d_7b42_6542_8539",
        ),
      ),
    ).toMatchObject({
      unit_id: unitId("aggressor_squad"),
      weapon_profile_id: weaponProfileId(
        "auto_boltstorm_gauntlets__10e__codex_space_marines_10e",
      ),
    });
    expect(
      rowsById.get(
        unitWeaponId(
          "aggressor_squad__auto_boltstorm_gauntlets__10e__codex_space_marines_10e__5752_af90_874a_4fb1",
        ),
      ),
    ).toBeDefined();
  });

  it("resolves unit and rules source references", () => {
    const unitIds = new Set(unitsDataset.records.map((record) => record.id));
    const rulesSourceIds = new Set(
      rulesSourcesDataset.records.map((record) => record.id),
    );
    const unresolvedRecords: string[] = [];
    const duplicateIds = duplicateValues(
      unitWeaponsDataset.records.map((record) => record.id),
    );

    for (const record of unitWeaponsDataset.records) {
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

function loadBsDataUnitWeapons(): BsDataUnitWeapon[] {
  const result = spawnSync(
    "python3",
    [
      resolve(process.cwd(), "scripts/bsdata_expected_counts.py"),
      "--bsdata-root",
      BSDATA_ROOT,
      "--emit-unit-weapons",
    ],
    {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    },
  );

  expect(result.status, result.stderr || result.stdout).toBe(0);

  return JSON.parse(result.stdout) as BsDataUnitWeapon[];
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
