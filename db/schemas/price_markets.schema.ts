import { z } from "zod";

export const priceMarketSchema = z.object({
  id: z.ulid(),
  market_slug: z.string(),
  market_name: z.string(),
  currency: z.string().length(3),
  locale: z.string().max(10),
  gw_region_selector: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});

export const priceMarketCountrySchema = z.object({
  price_market_id: z.ulid(),
  country_cca2: z.string().length(2),
});
