import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const SHARDED_CORE_TABLES = [
  "detachments",
  "rules_faction_detachments",
  "rules_faction_units",
  "units",
] as const;

describe("core seed dataset sharding", () => {
  it("keeps BSData core tables behind root barrels and 10e shards", () => {
    for (const tableName of SHARDED_CORE_TABLES) {
      const rootPath = resolve(
        process.cwd(),
        "db/seed_config/seed/data",
        `${tableName}.data.ts`,
      );
      const shardIndexPath = resolve(
        process.cwd(),
        "db/seed_config/seed/data",
        tableName,
        "10e",
        `_index.${tableName}.data.ts`,
      );
      const rootSource = readFileSync(rootPath, "utf8");

      expect(existsSync(shardIndexPath), tableName).toBe(true);
      expect(rootSource).toContain(`./${tableName}/10e/_index.${tableName}.data`);
      expect(rootSource).not.toMatch(/export const \w+:\s+\w+Config = \{/);
    }
  });
});
