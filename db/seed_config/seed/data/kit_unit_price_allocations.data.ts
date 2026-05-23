import type {
  KitUnitPriceAllocationConfig,
  SeedDataset,
} from "../../types/_index.types";
import { kitId, kitUnitPriceAllocationId, unitId } from "../ids";

/**
 * Curated kit-unit price allocation seed data.
 * Wahapedia does not provide kit prices, SKUs, product URLs, bundles, or allocations.
 *
 * Masters of the Maelstrom box (MSRP $95 USD) is a combined kit.  The price is
 * allocated between its two constituent units based on the standalone MSRP of
 * each unit sold separately:
 *   - Huron Blackheart standalone MSRP: $40 USD  → 40/95 ≈ 0.4211
 *   - Masters of the Maelstrom standalone MSRP: $55 USD → 55/95 ≈ 0.5789
 */
export const kitUnitPriceAllocationsDataset: SeedDataset<"kit_unit_price_allocations"> =
  {
    table: "kit_unit_price_allocations",
    records: [
      {
        id: kitUnitPriceAllocationId(
          "masters_of_the_maelstrom_box__huron_blackheart",
        ),
        kit_id: kitId("masters_of_the_maelstrom_box"),
        unit_id: unitId("huron_blackheart"),
        allocation_ratio: 0.4211,
        allocation_basis: "standalone_msrp",
        reference_price: 40,
        reference_currency: "USD",
        effective_date: null,
        superseded_date: null,
      },
      {
        id: kitUnitPriceAllocationId(
          "masters_of_the_maelstrom_box__masters_of_the_maelstrom",
        ),
        kit_id: kitId("masters_of_the_maelstrom_box"),
        unit_id: unitId("masters_of_the_maelstrom"),
        allocation_ratio: 0.5789,
        allocation_basis: "standalone_msrp",
        reference_price: 55,
        reference_currency: "USD",
        effective_date: null,
        superseded_date: null,
      },
    ] satisfies KitUnitPriceAllocationConfig[],
  };
