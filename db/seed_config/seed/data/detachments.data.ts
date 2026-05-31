import type { SeedDataset } from "../../types/_index.types";
import { detachments10e } from "./detachments/10e/_index.detachments.data";

/**
 * Typed seed dataset for the `detachments` table.
 */
export const detachmentsDataset: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [...detachments10e],
};
