import { describe, expect, it } from "vitest";

import {
  DATASET_INVENTORY_COLUMNS,
  buildDatasetInventory,
  renderDatasetInventoryMarkdown,
} from "../generate-dataset-inventory";

const INVENTORY_TEST_TIMEOUT_MS = 30000;
const BSDATA_TEST_ROOT = "../wh40k-10e";

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
  }, INVENTORY_TEST_TIMEOUT_MS);

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
    expect(bloodAngels?.cells.rules_faction_detachments.actual).toBe(18);
    expect(bloodAngels?.cells.leader_eligibilities.actual).toBe(173);
    expect(bloodAngels?.cells.unit_models.actual).toBe(233);
    expect(bloodAngels?.cells.unit_models.expected).toBe("233");
    expect(bloodAngels?.cells.unit_point_costs.actual).toBe(200);
    expect(bloodAngels?.cells.unit_point_costs.expected).toBe("200");
    expect(bloodAngels?.cells.unit_weapons.actual).toBe(234);
    expect(bloodAngels?.cells.unit_weapons.expected).toBe("234");
    expect(bloodAngels?.cells.models.actual).toBe(223);
    expect(bloodAngels?.cells.models.expected).toBe("223");
  }, INVENTORY_TEST_TIMEOUT_MS);

  it("renders a Markdown inventory with actual-over-expected cells", () => {
    const inventory = buildDatasetInventory({ repoRoot: process.cwd() });
    const markdown = renderDatasetInventoryMarkdown(inventory);

    expect(markdown).toContain("# Dataset Inventory");
    expect(markdown).toContain("Cell format: `actual / expected`.");
    expect(markdown).toContain("## Expected Count Rules");
    expect(markdown).toContain("| Blood Angels | 1 / 1 |");
    expect(markdown).toContain("- Blood Angels (`blood_angels`)");
  }, INVENTORY_TEST_TIMEOUT_MS);

  it("fills second-pass expected counts from the local BSData checkout", () => {
    const inventory = buildDatasetInventory({
      repoRoot: process.cwd(),
      bsDataRoot: BSDATA_TEST_ROOT,
    });
    const spaceMarines = inventory.rows.find(
      (row) => row.factionSlug === "space_marines",
    );
    const bloodAngels = inventory.rows.find(
      (row) => row.factionSlug === "blood_angels",
    );

    expect(spaceMarines?.cells.rules_faction_units.expected).toBe("128");
    expect(inventory.columnTotals.rules_faction_sources.expected).toBe("212");
    expect(inventory.columnTotals.rules_faction_detachments.expected).toBe("343");
    expect(inventory.columnTotals.leader_eligibilities.expected).toBe("2499");
    expect(inventory.columnTotals.leader_eligibility_keywords.expected).toBe("82");
    expect(inventory.columnTotals.unit_models.actual).toBe(4681);
    expect(inventory.columnTotals.unit_models.expected).toBe("4681");
    expect(inventory.columnTotals.unit_point_costs.actual).toBe(3988);
    expect(inventory.columnTotals.unit_point_costs.expected).toBe("3988");
    expect(inventory.columnTotals.unit_profiles.actual).toBe(3984);
    expect(inventory.columnTotals.unit_profiles.expected).toBe("3984");
    expect(inventory.columnTotals.unit_profile_stats.actual).toBe(23904);
    expect(inventory.columnTotals.unit_profile_stats.expected).toBe("23904");
    expect(inventory.columnTotals.unit_weapons.actual).toBe(5854);
    expect(inventory.columnTotals.unit_weapons.expected).toBe("5854");
    expect(inventory.columnTotals.models.actual).toBe(4548);
    expect(inventory.columnTotals.models.expected).toBe("4548");
    expect(spaceMarines?.cells.rules_faction_detachments.expected).toBe("13");
    expect(spaceMarines?.cells.leader_eligibilities.expected).toBe("122");
    expect(spaceMarines?.cells.leader_eligibility_keywords.expected).toBe("2");
    expect(spaceMarines?.cells.unit_profiles.expected).toBe("199");
    expect(spaceMarines?.cells.unit_profile_stats.expected).toBe("1194");
    expect(bloodAngels?.cells.rules_faction_units.expected).toBe("155");
    expect(bloodAngels?.cells.rules_faction_detachments.expected).toBe("18");
    expect(bloodAngels?.cells.leader_eligibilities.expected).toBe("173");
    expect(bloodAngels?.cells.unit_models.expected).not.toBe("?");
  }, INVENTORY_TEST_TIMEOUT_MS);
});
