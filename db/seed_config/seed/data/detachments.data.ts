import type {
  DetachmentConfig,
  SeedDataset,
} from "@db/seed_config/types/seed-types";

/**
 * Typed seed dataset for the `detachments` table.
 */
export const detachmentsDataset: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [] satisfies DetachmentConfig[],
};
