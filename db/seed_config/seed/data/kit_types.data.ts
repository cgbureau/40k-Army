import type {
  KitTypeConfig,
  SeedDataset,
} from "../../types/_index.types";
import { kitTypeId } from "../ids";

/**
 * Typed seed dataset for the `kit_types` table.
 *
 * Kit types describe the packaging category of a purchasable kit.
 * The `multi_unit` flag indicates whether a single box satisfies more than one
 * distinct unit in an army list. The `number_of_factions` field indicates how
 * many factions the box spans (almost always 1 for standard GW products). Both
 * fields are nullable for catalog-only product rows where contents have not
 * been source-confirmed yet.
 */
export const kitTypesDataset: SeedDataset<"kit_types"> = {
  table: "kit_types",
  records: [
    {
      id: kitTypeId("single_faction_single_unit"),
      kit_type_slug: "single_faction_single_unit",
      kit_type_name: "Single Faction – Single Unit",
      multi_unit: false,
      number_of_factions: 1,
    },
    {
      id: kitTypeId("single_faction_multi_unit"),
      kit_type_slug: "single_faction_multi_unit",
      kit_type_name: "Single Faction – Multi-Unit",
      multi_unit: true,
      number_of_factions: 1,
    },
    {
      id: kitTypeId("combat_patrol"),
      kit_type_slug: "combat_patrol",
      kit_type_name: "Combat Patrol",
      multi_unit: true,
      number_of_factions: 1,
    },
    {
      id: kitTypeId("catalog_product_unknown_contents"),
      kit_type_slug: "catalog_product_unknown_contents",
      kit_type_name: "Catalog Product - Unknown Contents",
      multi_unit: null,
      number_of_factions: null,
    },
  ] satisfies KitTypeConfig[],
};
