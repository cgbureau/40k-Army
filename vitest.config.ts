import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "@db_index/": path.resolve(__dirname, "db/_index.db.ts"),
    },
  },
});
