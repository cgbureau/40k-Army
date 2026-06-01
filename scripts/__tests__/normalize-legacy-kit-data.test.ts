import { describe, expect, it } from "vitest";

import { buildNormalizedLegacyKitData } from "../normalize-legacy-kit-data";

describe("legacy kit data normalizer", () => {
  it("normalizes legacy catalog rows into reviewable product identities", () => {
    const data = buildNormalizedLegacyKitData({ repoRoot: process.cwd() });

    expect(data.summary.counts).toMatchObject({
      legacy_catalog_files: 35,
      legacy_catalog_rows: 1031,
      normalized_products: 853,
      products_with_duplicate_source_rows: 148,
      products_with_missing_model_count: 60,
      products_with_conflicting_model_counts: 15,
      price_observations: 7104,
    });
  });

  it("collapses case variants while preserving source entries", () => {
    const data = buildNormalizedLegacyKitData({ repoRoot: process.cwd() });
    const product = data.products.find(
      (item) => item.kit_slug === "aestred-thurga-relinquant-at-arms",
    );

    expect(product?.legacy_kit_slugs).toEqual([
      "aestred-thurga-relinquant-at-arms",
      "Aestred-Thurga-Relinquant-At-Arms",
    ]);
    expect(product?.source_files).toEqual([
      "data/kits/adepta-sororitas.json",
      "data/kits/adepta-sororitas.NEW.json",
    ]);
    expect(product?.quality_flags).toEqual(["duplicate_source_rows"]);
  });

  it("emits regional price observations separately from product facts", () => {
    const data = buildNormalizedLegacyKitData({ repoRoot: process.cwd() });
    const observations = data.priceObservations.filter(
      (item) => item.kit_slug === "aestred-thurga-relinquant-at-arms",
    );

    expect(observations).toHaveLength(14);
    expect(observations).toContainEqual(
      expect.objectContaining({
        currency: "usd",
        price: 43.5,
        price_source: "legacy_data_kits",
        price_source_file: "data/kits/adepta-sororitas.NEW.json",
      }),
    );
  });

  it("keeps unit mappings as candidates with resolution status", () => {
    const data = buildNormalizedLegacyKitData({ repoRoot: process.cwd() });
    const telemonCandidates = data.unitMappingCandidates.filter(
      (item) => item.unit_slug === "telemon_heavy_dreadnought",
    );
    const invalidSpaceMarineHeaders = data.unitMappingCandidates.filter(
      (item) => item.reference_status === "invalid",
    );

    expect(data.summary.counts).toMatchObject({
      legacy_mapping_files: 24,
      legacy_mapping_entries: 941,
      unit_mapping_candidates: 943,
      resolved_unit_mapping_candidates: 929,
      unresolved_unit_mapping_candidates: 5,
      invalid_unit_mapping_candidates: 9,
    });
    expect(telemonCandidates).toHaveLength(3);
    expect(telemonCandidates.map((item) => item.component_index)).toEqual([
      0,
      1,
      2,
    ]);
    expect(invalidSpaceMarineHeaders.map((item) => item.unit_slug)).toContain(
      "__BLOOD_ANGELS__",
    );
  });
});
