import type {
  PriceMarketConfig,
  SeedDataset,
} from "../../types/_index.types";
import { priceMarketId } from "../ids";

/**
 * Typed seed dataset for the `price_markets` table.
 *
 * Markets match Games Workshop's regional pricing selectors as seen on
 * warhammer.com. Each market has a stable currency, locale, and optional
 * GW region selector key. Country-to-market membership lives in
 * `price_market_countries`.
 *
 * canada_fr shares currency (cad) with canada_en because GW Canada has one
 * price, but two locale variants (English and French). The country CA maps
 * to canada_en for pricing queries; canada_fr exists for locale-aware UI.
 */
export const priceMarketsDataset: SeedDataset<"price_markets"> = {
  table: "price_markets",
  records: [
    {
      id: priceMarketId("us_en"),
      market_slug: "us_en",
      market_name: "United States",
      currency: "usd",
      locale: "en-US",
      gw_region_selector: "us_en",
    },
    {
      id: priceMarketId("canada_en"),
      market_slug: "canada_en",
      market_name: "Canada (English)",
      currency: "cad",
      locale: "en-CA",
      gw_region_selector: "canada_en",
    },
    {
      id: priceMarketId("canada_fr"),
      market_slug: "canada_fr",
      market_name: "Canada (French)",
      currency: "cad",
      locale: "fr-CA",
      gw_region_selector: "canada_fr",
    },
    {
      id: priceMarketId("uk_en"),
      market_slug: "uk_en",
      market_name: "United Kingdom",
      currency: "gbp",
      locale: "en-GB",
      gw_region_selector: "uk_en",
    },
    {
      id: priceMarketId("australia_en"),
      market_slug: "australia_en",
      market_name: "Australia",
      currency: "aud",
      locale: "en-AU",
      gw_region_selector: "australia_en",
    },
    {
      id: priceMarketId("new_zealand_en"),
      market_slug: "new_zealand_en",
      market_name: "New Zealand",
      currency: "nzd",
      locale: "en-NZ",
      gw_region_selector: "new_zealand_en",
    },
    {
      id: priceMarketId("eu_en"),
      market_slug: "eu_en",
      market_name: "European Union",
      currency: "eur",
      locale: "en",
      gw_region_selector: "eu_en",
    },
    {
      id: priceMarketId("switzerland_en"),
      market_slug: "switzerland_en",
      market_name: "Switzerland",
      currency: "chf",
      locale: "de-CH",
      gw_region_selector: "switzerland_en",
    },
    {
      id: priceMarketId("poland_pl"),
      market_slug: "poland_pl",
      market_name: "Poland",
      currency: "pln",
      locale: "pl-PL",
      gw_region_selector: "poland_pl",
    },
    {
      id: priceMarketId("japan_en"),
      market_slug: "japan_en",
      market_name: "Japan",
      currency: "jpy",
      locale: "ja-JP",
      gw_region_selector: "japan_en",
    },
    {
      id: priceMarketId("rest_of_world_en"),
      market_slug: "rest_of_world_en",
      market_name: "Rest of World",
      currency: "usd",
      locale: "en",
      gw_region_selector: null,
    },
  ] satisfies PriceMarketConfig[],
};
