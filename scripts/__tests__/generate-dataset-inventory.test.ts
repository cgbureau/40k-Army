import { describe, expect, it } from "vitest";

import {
  DATASET_INVENTORY_COLUMNS,
  buildDatasetInventory,
  renderDatasetInventoryMarkdown,
} from "../generate-dataset-inventory";

describe("dataset inventory generator", () => {
  it("builds the requested matrix columns for the 34 target factions", () => {
    const inventory = buildDatasetInventory({ repoRoot: process.cwd() });

    expect(inventory.rows).toHaveLength(34);
    expect(DATASET_INVENTORY_COLUMNS.map((column) => column.key)).toEqual([
      "rules_factions",
      "rules_faction_units",
      "rules_faction_sources",
      "rules_faction_detachments",
      "leader_eligibilities",
      "leader_eligibility_keywords",
      "unit_models",
      "unit_point_costs",
      "unit_profile_stats",
      "unit_profiles",
      "unit_weapons",
      "models",
    ]);
  });

  it("distinguishes current faction-scoped file inventory from target faction presence", () => {
    const inventory = buildDatasetInventory({ repoRoot: process.cwd() });
    const bloodAngels = inventory.rows.find(
      (row) => row.factionSlug === "blood_angels",
    );

    expect(bloodAngels).toBeDefined();
    expect(bloodAngels?.hasDatasheetFolder).toBe(false);
    expect(bloodAngels?.cells.rules_factions.actual).toBe(1);
    expect(bloodAngels?.cells.rules_factions.expected).toBe("1");
    expect(bloodAngels?.cells.rules_faction_sources.actual).toBe(3);
    expect(bloodAngels?.cells.rules_faction_sources.expected).toBe("3");
    expect(bloodAngels?.cells.unit_models.actual).toBe(0);
    expect(bloodAngels?.cells.unit_models.expected).toBe("234");
  });

  it("renders a Markdown inventory with actual-over-expected cells", () => {
    const inventory = buildDatasetInventory({ repoRoot: process.cwd() });
    const markdown = renderDatasetInventoryMarkdown(inventory);

    expect(markdown).toContain("# Dataset Inventory");
    expect(markdown).toContain("Cell format: `actual / expected`.");
    expect(markdown).toContain("## Expected Count Rules");
    expect(markdown).toContain("| Blood Angels | 1 / 1 |");
    expect(markdown).toContain("- Blood Angels (`blood_angels`)");
  });

  it("fills second-pass expected counts from the local BSData checkout", () => {
    const inventory = buildDatasetInventory({
      repoRoot: process.cwd(),
      bsDataRoot: "/Users/mikeearley/code/wh40k-10e",
    });
    const spaceMarines = inventory.rows.find(
      (row) => row.factionSlug === "space_marines",
    );
    const bloodAngels = inventory.rows.find(
      (row) => row.factionSlug === "blood_angels",
    );

    expect(spaceMarines?.cells.rules_faction_units.expected).toBe("129");
    expect(inventory.columnTotals.rules_faction_sources.expected).toBe("212");
    expect(spaceMarines?.cells.unit_profiles.expected).toBe("200");
    expect(spaceMarines?.cells.unit_profile_stats.expected).toBe("1200");
    expect(bloodAngels?.cells.rules_faction_units.expected).toBe("156");
    expect(bloodAngels?.cells.unit_models.expected).not.toBe("?");
  });
});
