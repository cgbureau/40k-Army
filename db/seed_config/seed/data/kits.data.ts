import type {
  KitConfig,
  SeedDataset,
} from "../../types/_index.types";
import { kitId, kitTypeId } from "../ids";
import { kitContentImportedKitsDataset } from "./kits/kit_content_imported.data";
import { tcgCsvImportedKitsDataset } from "./kits/tcgcsv/_index.data";

/**
 * Typed seed dataset for the `kits` table.
 *
 * Kit purchase data is curated manually from GW product information.
 * It is NOT sourced from Wahapedia.
 *
 * - masters_of_the_maelstrom_box: Combined Chaos Space Marines box containing
 *   Huron Blackheart and the Masters of the Maelstrom unit (MSRP $95 USD).
 * - combat_patrol_blood_angels: Combat Patrol box for Blood Angels.
 * - intercessor_squad_box: Standard Space Marines Intercessor Squad retail box.
 * - assault_intercessor_squad_box: Standard Space Marines Assault Intercessors box.
 */
export const kitsDataset: SeedDataset<"kits"> = {
  table: "kits",
  records: [
    {
      id: kitId("masters_of_the_maelstrom_box"),
      kit_slug: "masters-of-the-maelstrom-box",
      kit_name: "Masters of the Maelstrom",
      display_name: "Masters of the Maelstrom",
      gw_slug: "masters-of-the-maelstrom",
      gw_short_slug: null,
      gw_year: null,
      model_count: 11,
      kit_type_id: kitTypeId("single_faction_multi_unit"),
      gw_product_url: null,
      gw_image_url: null,
      gw_product_code: null,
      gw_short_code: null,
      product_gtin: null,
      tcgcsv_product_id: null,
      tcgcsv_product_url: null,
      release_date: null,
      discontinued_date: null,
    },
    {
      id: kitId("combat_patrol_blood_angels"),
      kit_slug: "combat-patrol-blood-angels",
      kit_name: "Combat Patrol: Blood Angels",
      display_name: "Combat Patrol: Blood Angels",
      gw_slug: "combat-patrol-blood-angels",
      gw_short_slug: null,
      gw_year: null,
      model_count: 15,
      kit_type_id: kitTypeId("combat_patrol"),
      gw_product_url: null,
      gw_image_url: null,
      gw_product_code: null,
      gw_short_code: null,
      product_gtin: null,
      tcgcsv_product_id: null,
      tcgcsv_product_url: null,
      release_date: null,
      discontinued_date: null,
    },
    {
      id: kitId("intercessor_squad_box"),
      kit_slug: "intercessor-squad",
      kit_name: "Intercessor Squad",
      display_name: "Intercessor Squad",
      gw_slug: "intercessor-squad",
      gw_short_slug: null,
      gw_year: null,
      model_count: 10,
      kit_type_id: kitTypeId("single_faction_single_unit"),
      gw_product_url: null,
      gw_image_url: null,
      gw_product_code: null,
      gw_short_code: null,
      product_gtin: null,
      tcgcsv_product_id: null,
      tcgcsv_product_url: null,
      release_date: null,
      discontinued_date: null,
    },
    {
      id: kitId("assault_intercessor_squad_box"),
      kit_slug: "assault-intercessors",
      kit_name: "Assault Intercessors",
      display_name: "Assault Intercessors",
      gw_slug: "assault-intercessors",
      gw_short_slug: null,
      gw_year: null,
      model_count: 10,
      kit_type_id: kitTypeId("single_faction_single_unit"),
      gw_product_url: null,
      gw_image_url: null,
      gw_product_code: null,
      gw_short_code: null,
      product_gtin: null,
      tcgcsv_product_id: null,
      tcgcsv_product_url: null,
      release_date: null,
      discontinued_date: null,
    },
    ...kitContentImportedKitsDataset.records,
    ...tcgCsvImportedKitsDataset.records,
  ] satisfies KitConfig[],
};
