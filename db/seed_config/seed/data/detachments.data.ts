import type { DetachmentConfig, SeedDataset } from "../../types/_index.types";

/**
 * Typed seed dataset for the `detachments` table.
 */
export const detachmentsDataset: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [] satisfies DetachmentConfig[],
};
