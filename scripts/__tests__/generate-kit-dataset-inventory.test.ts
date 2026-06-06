import { describe, expect, it } from "vitest";

import {
  buildKitDatasetInventory,
  renderKitDatasetInventoryMarkdown,
} from "../generate-kit-dataset-inventory";

describe("kit dataset inventory generator", () => {
  it("summarizes legacy commerce data and current typed seed rows", () => {
    const inventory = buildKitDatasetInventory({ repoRoot: process.cwd() });

    expect(inventory.rows).toHaveLength(34);
    expect(inventory.legacyCatalog.files).toBe(35);
    expect(inventory.legacyCatalog.rawRows).toBe(1031);
    expect(inventory.legacyCatalog.priceObservations).toBe(7104);
    expect(inventory.legacyMappings.files).toBe(24);
    expect(inventory.legacyMappings.mappingEntries).toBe(941);
    expect(inventory.currentSeed).toEqual({
      kitTypes: 4,
      kits: 530,
      kitModels: 0,
      kitUnits: 4,
      kitUnitPriceAllocations: 0,
      kitPrices: 2005,
      kitPricesTcgcsv: 631,
      kitPricesLegacy: 328,
      kitPricesGw: 1046,
    });
    expect(inventory.activeUnitKitCoverage.rows).toHaveLength(34);
    expect(
      inventory.activeUnitKitCoverage.rows.reduce(
        (sum, row) => sum + row.activeUnitCount,
        0,
      ),
    ).toBe(2066);
    expect(
      inventory.activeUnitKitCoverage.rows.reduce(
        (sum, row) => sum + row.needsSourceReviewCount,
        0,
      ),
    ).toBe(482);
    expect(inventory.normalizedLegacy?.counts.normalized_products).toBe(853);
    expect(inventory.normalizedLegacy?.counts.price_observations).toBe(7104);
  });

  it("tracks Space Marine chapter catalog files separately from unit mappings", () => {
    const inventory = buildKitDatasetInventory({ repoRoot: process.cwd() });
    const darkAngels = inventory.rows.find(
      (row) => row.factionSlug === "dark_angels",
    );
    const whiteScars = inventory.rows.find(
      (row) => row.factionSlug === "white_scars",
    );

    expect(darkAngels?.catalogFilesPresent).toEqual([
      "data/kits/space-marines/dark-angels.json",
    ]);
    expect(darkAngels?.mappingFilesPresent).toEqual([]);
    expect(whiteScars?.catalogFilesPresent).toEqual([]);
  });

  it("renders the inventory policy sections", () => {
    const inventory = buildKitDatasetInventory({ repoRoot: process.cwd() });
    const markdown = renderKitDatasetInventoryMarkdown(inventory);

    expect(markdown).toContain("# Kit Dataset Inventory");
    expect(markdown).toContain("## Source Roles");
    expect(markdown).toContain("## Kit Content Evidence Gate");
    expect(markdown).toContain("## Normalized Legacy Staging");
    expect(markdown).toContain("## Faction Legacy Coverage");
    expect(markdown).toContain("## Active Unit Kit Coverage");
    expect(markdown).toContain("### Units Needing Source Review");
    expect(markdown).toContain("## Migration Recommendation");
    expect(markdown).toContain("| `kit_models` | 0 |");
    expect(markdown).toContain("| Normalized products | 853 |");
    expect(markdown).toContain("| `kits` | 530 |");
    expect(markdown).toContain("| `kit_prices` | 2005 |");
    expect(markdown).toContain("| `kit_units` | 4 |");
    expect(markdown).toContain("2005 `kit_prices` rows");
    expect(markdown).toContain("631 TCGCSV USD");
    expect(markdown).toContain("`source_kind`, `source_url`, `source_text`, and `review_status`");
  });
});
