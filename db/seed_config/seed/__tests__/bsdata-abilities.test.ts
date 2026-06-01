import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { BSDATA_ROOT } from "./helpers/bsdata-root";

import {
  abilitiesDataset,
  rulesSourcesDataset,
  unitAbilitiesDataset,
  unitsDataset,
} from "../data/_index.data";
import { abilityId, unitAbilityId, unitId } from "../ids";

type BsDataAbility = {
  ability_slug: string;
};

type BsDataUnitAbility = {
  unit_ability_slug: string;
};

describe("BSData abilities and unit_abilities coverage", () => {
  it("covers BSData ability rows", () => {
    const expectedIds = new Set(
      loadBsDataRecords<BsDataAbility>("--emit-abilities").map((record) =>
        abilityId(record.ability_slug as Parameters<typeof abilityId>[0]),
      ),
    );
    const actualIds = new Set(
      abilitiesDataset.records.map((record) => record.id),
    );

    expect([...expectedIds].filter((id) => !actualIds.has(id))).toEqual([]);
    expect([...actualIds].filter((id) => !expectedIds.has(id))).toEqual([]);
  });

  it("covers BSData unit ability memberships with global seed rows", () => {
    const expectedIds = new Set(
      loadBsDataRecords<BsDataUnitAbility>("--emit-unit-abilities").map(
        (record) => unitAbilityId(record.unit_ability_slug),
      ),
    );
    const actualIds = new Set(
      unitAbilitiesDataset.records.map((record) => record.id),
    );

    expect([...expectedIds].filter((id) => !actualIds.has(id))).toEqual([]);
    expect([...actualIds].filter((id) => !expectedIds.has(id))).toEqual([]);
  });

  it("keeps ability text on the unit ability row", () => {
    const unitAbilitiesById = new Map(
      unitAbilitiesDataset.records.map((record) => [record.id, record]),
    );

    expect(
      unitAbilitiesById.get(
        unitAbilityId(
          "aestred_thurga_and_agathae_dolan__auto_tapestry_of_the_emperors_judgement__10e__codex_adepta_sororitas_10e",
        ),
      ),
    ).toMatchObject({
      unit_id: unitId("aestred_thurga_and_agathae_dolan"),
      ability_id: abilityId("auto_tapestry_of_the_emperors_judgement"),
      rules_text:
        "While this unit is leading a unit and contains an Aestred Thurga model, weapons equipped by models in that unit have the [DEVASTATING WOUNDS] ability",
    });
  });

  it("resolves ability and unit ability references", () => {
    const abilityIds = new Set(abilitiesDataset.records.map((record) => record.id));
    const unitIds = new Set(unitsDataset.records.map((record) => record.id));
    const rulesSourceIds = new Set(
      rulesSourcesDataset.records.map((record) => record.id),
    );
    const unresolvedRecords: string[] = [];

    for (const record of unitAbilitiesDataset.records) {
      if (!unitIds.has(record.unit_id)) {
        unresolvedRecords.push(`${record.id}:unit_id`);
      }
      if (!abilityIds.has(record.ability_id)) {
        unresolvedRecords.push(`${record.id}:ability_id`);
      }
      if (!rulesSourceIds.has(record.rules_source_id)) {
        unresolvedRecords.push(`${record.id}:rules_source_id`);
      }
    }

    expect(unresolvedRecords).toEqual([]);
    expect(duplicateValues(abilitiesDataset.records.map((record) => record.id))).toEqual(
      [],
    );
    expect(
      duplicateValues(unitAbilitiesDataset.records.map((record) => record.id)),
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
      maxBuffer: 50 * 1024 * 1024,
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
