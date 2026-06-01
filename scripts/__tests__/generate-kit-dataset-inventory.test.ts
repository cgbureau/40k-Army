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
      kitTypes: 3,
      kits: 4,
      kitModels: 0,
      kitUnits: 4,
      kitUnitPriceAllocations: 2,
      kitPrices: 0,
    });
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
    expect(markdown).toContain("## Faction Legacy Coverage");
    expect(markdown).toContain("## Migration Recommendation");
    expect(markdown).toContain("| `kit_models` | 0 |");
  });
});
