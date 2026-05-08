import type { DetachmentConfig, SeedDataset } from "@db_index/";

/**
 * Typed seed dataset for the `detachments` table.
 */
export const detachmentsDataset: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [] satisfies DetachmentConfig[],
};
