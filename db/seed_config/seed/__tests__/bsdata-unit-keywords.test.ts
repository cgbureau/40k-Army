import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { BSDATA_ROOT } from "./helpers/bsdata-root";

import {
  detachmentUnitKeywordsDataset,
  detachmentsDataset,
  gameEditionsDataset,
  keywordsDataset,
  modelsDataset,
  rulesSourcesDataset,
  unitKeywordsDataset,
  unitsDataset,
} from "../data/_index.data";
import {
  detachmentUnitKeywordId,
  keywordId,
  modelId,
  unitId,
  unitKeywordId,
} from "../ids";

type BsDataUnitKeyword = {
  unit_keyword_slug: string;
};

type BsDataDetachmentUnitKeyword = {
  detachment_unit_keyword_slug: string;
};

describe("BSData unit keyword coverage", () => {
  it("covers BSData unit keyword memberships with global seed rows", () => {
    const expectedIds = new Set(
      loadBsDataRecords<BsDataUnitKeyword>("--emit-unit-keywords").map(
        (record) => unitKeywordId(record.unit_keyword_slug),
      ),
    );
    const actualIds = new Set(
      unitKeywordsDataset.records.map((record) => record.id),
    );

    expect([...expectedIds].filter((id) => !actualIds.has(id))).toEqual([]);
    expect([...actualIds].filter((id) => !expectedIds.has(id))).toEqual([]);
  });

  it("covers conservative BSData detachment-granted keyword memberships", () => {
    const expectedIds = new Set(
      loadBsDataRecords<BsDataDetachmentUnitKeyword>(
        "--emit-detachment-unit-keywords",
      ).map((record) =>
        detachmentUnitKeywordId(record.detachment_unit_keyword_slug),
      ),
    );
    const actualIds = new Set(
      detachmentUnitKeywordsDataset.records.map((record) => record.id),
    );

    expect([...expectedIds].filter((id) => !actualIds.has(id))).toEqual([]);
    expect([...actualIds].filter((id) => !expectedIds.has(id))).toEqual([]);
  });

  it("keeps unit and model scoped keyword rows", () => {
    const unitKeywordsById = new Map(
      unitKeywordsDataset.records.map((record) => [record.id, record]),
    );

    expect(
      unitKeywordsById.get(
        unitKeywordId(
          "intercessor_squad__battleline__10e__codex_space_marines_10e",
        ),
      ),
    ).toMatchObject({
      unit_id: unitId("intercessor_squad"),
      keyword_id: keywordId("battleline"),
      model_id: null,
    });

    expect(
      unitKeywordsById.get(
        unitKeywordId(
          "wardens_of_ultramar__dainal_kornelius__psyker__10e__codex_space_marines_10e",
        ),
      ),
    ).toMatchObject({
      unit_id: unitId("wardens_of_ultramar"),
      keyword_id: keywordId("psyker"),
      model_id: modelId("dainal_kornelius"),
    });
  });

  it("keeps detachment-granted keyword rows", () => {
    const detachmentUnitKeywordsById = new Map(
      detachmentUnitKeywordsDataset.records.map((record) => [record.id, record]),
    );

    expect(
      detachmentUnitKeywordsById.get(
        detachmentUnitKeywordId("dread_mob_detachment__gretchin__battleline"),
      ),
    ).toMatchObject({
      unit_id: unitId("gretchin"),
      keyword_id: keywordId("battleline"),
    });
  });

  it("resolves all keyword references", () => {
    const unitIds = new Set(unitsDataset.records.map((record) => record.id));
    const keywordIds = new Set(keywordsDataset.records.map((record) => record.id));
    const modelIds = new Set(modelsDataset.records.map((record) => record.id));
    const gameEditionIds = new Set(
      gameEditionsDataset.records.map((record) => record.id),
    );
    const rulesSourceIds = new Set(
      rulesSourcesDataset.records.map((record) => record.id),
    );
    const detachmentIds = new Set(
      detachmentsDataset.records.map((record) => record.id),
    );
    const unresolvedRecords: string[] = [];

    for (const record of unitKeywordsDataset.records) {
      if (!unitIds.has(record.unit_id)) {
        unresolvedRecords.push(`${record.id}:unit_id`);
      }
      if (!keywordIds.has(record.keyword_id)) {
        unresolvedRecords.push(`${record.id}:keyword_id`);
      }
      if (record.model_id && !modelIds.has(record.model_id)) {
        unresolvedRecords.push(`${record.id}:model_id`);
      }
      if (!gameEditionIds.has(record.game_edition_id)) {
        unresolvedRecords.push(`${record.id}:game_edition_id`);
      }
      if (!rulesSourceIds.has(record.rules_source_id)) {
        unresolvedRecords.push(`${record.id}:rules_source_id`);
      }
    }

    for (const record of detachmentUnitKeywordsDataset.records) {
      if (!detachmentIds.has(record.detachment_id)) {
        unresolvedRecords.push(`${record.id}:detachment_id`);
      }
      if (!unitIds.has(record.unit_id)) {
        unresolvedRecords.push(`${record.id}:unit_id`);
      }
      if (!keywordIds.has(record.keyword_id)) {
        unresolvedRecords.push(`${record.id}:keyword_id`);
      }
    }

    expect(unresolvedRecords).toEqual([]);
    expect(duplicateValues(unitKeywordsDataset.records.map((record) => record.id))).toEqual(
      [],
    );
    expect(
      duplicateValues(
        detachmentUnitKeywordsDataset.records.map((record) => record.id),
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
