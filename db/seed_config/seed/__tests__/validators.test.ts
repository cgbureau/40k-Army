import { describe, it, expect } from "vitest";
import { validateSeedRecord } from "../validators";
import type { KitUnitConfig } from "../../types/seed-config-types";
import type { SeedDataCollection } from "../../types/seed-definition-types";

describe("validateSeedRecord", () => {
  // Valid ULID format for testing
  const VALID_ULID = "01JZZZZZZZZZZZZZZZZZZZZZZY";
  const collection: SeedDataCollection = "kits";

  // Helper to create a minimal valid KitUnit record
  const createValidKitUnit = (overrides: Partial<KitUnitConfig> = {}): KitUnitConfig => ({
    id: VALID_ULID,
    kit_id: VALID_ULID,
    unit_id: VALID_ULID,
    unit_count: 1,
    model_count: 5,
    component_type: "complete_unit",
    effective_date: null,
    superseded_date: null,
    ...overrides,
  });

  it("should return empty array for valid KitUnit record", () => {
    const record = createValidKitUnit();
    const result = validateSeedRecord(collection, "kit_units", record);
    expect(result).toEqual([]);
  });

  it("should return error for invalid KitUnit with zero unit_count", () => {
    const record = createValidKitUnit({ unit_count: 0 });
    const result = validateSeedRecord(collection, "kit_units", record);

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].table).toBe("kit_units");
    expect(result[0].message).toContain(">0");
  });

  it("should return error for invalid KitUnit with negative model_count", () => {
    const record = createValidKitUnit({ model_count: -1 });
    const result = validateSeedRecord(collection, "kit_units", record);

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].table).toBe("kit_units");
    expect(result[0].message).toContain(">0");
  });

  it("should return error for invalid KitUnit with unknown component_type", () => {
    const record = createValidKitUnit({ component_type: "unknown_type" as any });
    const result = validateSeedRecord(collection, "kit_units", record);

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].table).toBe("kit_units");
  });
});
