import type { KitUnitConfig, SeedDataset } from "../../types/_index.types";
import { kitId, kitUnitId, unitId } from "../ids";

/**
 * Curated kit-to-unit mapping seed data.
 * Wahapedia does not provide reliable purchasable kit packaging data.
 *
 * Masters of the Maelstrom box is a combined kit containing two distinct units:
 * - Huron Blackheart (character)
 * - Masters of the Maelstrom (retinue unit)
 *
 * Intercessor Squad and Assault Intercessors are single-unit retail boxes.
 */
export const kitUnitsDataset: SeedDataset<"kit_units"> = {
  table: "kit_units",
  records: [
    {
      id: kitUnitId(
        "masters_of_the_maelstrom_box__huron_blackheart__complete_unit",
      ),
      kit_id: kitId("masters_of_the_maelstrom_box"),
      unit_id: unitId("huron_blackheart"),
      unit_count: 1,
      model_count: 1,
      component_type: "complete_unit",
      effective_date: null,
      superseded_date: null,
    },
    {
      id: kitUnitId(
        "masters_of_the_maelstrom_box__masters_of_the_maelstrom__complete_unit",
      ),
      kit_id: kitId("masters_of_the_maelstrom_box"),
      unit_id: unitId("masters_of_the_maelstrom"),
      unit_count: 1,
      model_count: 10,
      component_type: "complete_unit",
      effective_date: null,
      superseded_date: null,
    },
    {
      id: kitUnitId(
        "intercessor_squad_box__intercessor_squad__complete_unit",
      ),
      kit_id: kitId("intercessor_squad_box"),
      unit_id: unitId("intercessor_squad"),
      unit_count: 1,
      model_count: 10,
      component_type: "complete_unit",
      effective_date: null,
      superseded_date: null,
    },
    {
      id: kitUnitId(
        "assault_intercessor_squad_box__assault_intercessor_squad__complete_unit",
      ),
      kit_id: kitId("assault_intercessor_squad_box"),
      unit_id: unitId("assault_intercessor_squad"),
      unit_count: 1,
      model_count: 10,
      component_type: "complete_unit",
      effective_date: null,
      superseded_date: null,
    },
  ] satisfies KitUnitConfig[],
};
