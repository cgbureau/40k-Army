import { z } from "zod";

export const kitUnitComponentTypeSchema = z.enum([
  "complete_unit",
  "partial_unit",
  "alternate_build",
  "upgrade_component",
]);

export const kitUnitPriceAllocationBasisSchema = z.enum([
  "standalone_msrp",
  "average_unit_price",
  "model_count",
  "manual",
  "market_observation",
]);

export const kitContentSourceKindSchema = z.enum([
  "games_workshop_product_page",
  "games_workshop_pdf",
  "warhammer_community_article",
  "miniset",
  "retailer_product_page",
  "manual",
  "legacy",
  "other",
]);

export const kitContentReviewStatusSchema = z.enum([
  "approved",
  "needs_review",
  "rejected",
]);

export const kitTypeSchema = z.object({
  id: z.ulid(),
  kit_type_slug: z.string(),
  kit_type_name: z.string(),
  multi_unit: z.boolean().nullable(),
  number_of_factions: z.number().int().nullable(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});

export const kitSchema = z.object({
  id: z.ulid(),
  kit_slug: z.string(),
  kit_name: z.string(),
  gw_slug: z.string().nullable(),
  display_name: z.string(),
  gw_short_slug: z.string().nullable(),
  gw_year: z.number().int().nullable(),
  model_count: z.number().int().nullable(),
  kit_type_id: z.ulid(),
  gw_product_url: z.string().nullable(),
  gw_image_url: z.string().nullable(),
  gw_product_code: z.string().nullable(),
  gw_short_code: z.string().nullable(),
  product_gtin: z.string().nullable(),
  tcgcsv_product_id: z.string().nullable(),
  tcgcsv_product_url: z.string().nullable(),
  release_date: z.date().nullable(),
  discontinued_date: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});

export const kitModelSchema = z.object({
  id: z.ulid(),
  kit_id: z.ulid(),
  model_id: z.ulid(),
  model_count: z.number().int(),
  source_kind: kitContentSourceKindSchema,
  source_url: z.string().nullable(),
  source_text: z.string(),
  review_status: kitContentReviewStatusSchema,
  created_at: z.date(),
  updated_at: z.date().nullable(),
});

export const kitUnitSchema = z.object({
  id: z.ulid(),
  kit_id: z.ulid(),
  unit_id: z.ulid(),
  unit_count: z.number().int().positive(),
  model_count: z.number().int().positive(),
  component_type: kitUnitComponentTypeSchema,
  source_kind: kitContentSourceKindSchema,
  source_url: z.string().nullable(),
  source_text: z.string(),
  review_status: kitContentReviewStatusSchema,
  effective_date: z.date().nullable(),
  superseded_date: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});

export const kitUnitPriceAllocationSchema = z.object({
  id: z.ulid(),
  kit_id: z.ulid(),
  unit_id: z.ulid(),
  allocation_ratio: z.number().gt(0).lte(1),
  reference_price: z.number().positive().nullable(),
  reference_currency: z.string().length(3).nullable(),
  allocation_basis: kitUnitPriceAllocationBasisSchema,
  effective_date: z.date().nullable(),
  superseded_date: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});

export const kitPriceSchema = z.object({
  id: z.ulid(),
  kit_id: z.ulid(),
  currency: z.string().length(3),
  price: z.union([z.number(), z.string()]),
  price_source: z.string().nullable(),
  price_source_url: z.string().nullable(),
  observed_date: z.date().nullable(),
  superseded_date: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});
