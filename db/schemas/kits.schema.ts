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
  "reseller_observation",
]);

export const kitTypeSchema = z.object({
  id: z.ulid(),
  kit_type_slug: z.string(),
  kit_type_name: z.string(),
  multi_unit: z.boolean(),
  number_of_factions: z.number().int(),
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
  model_count: z.number().int(),
  kit_type_id: z.ulid(),
  gw_product_url: z.string().nullable(),
  gw_image_url: z.string().nullable(),
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
  created_at: z.date(),
  updated_at: z.date().nullable(),
});

export const kitUnitSchema = z.object({
  id: z.ulid(),
  kit_id: z.ulid(),
  unit_id: z.ulid(),
  unit_count: z.number().int(),
  model_count: z.number().int(),
  component_type: kitUnitComponentTypeSchema,
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
  reference_currency: z.string().nullable(),
  allocation_basis: kitUnitPriceAllocationBasisSchema,
  effective_date: z.date().nullable(),
  superseded_date: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});

export const kitPriceSchema = z.object({
  id: z.ulid(),
  kit_id: z.ulid(),
  currency: z.string(),
  price: z.union([z.number(), z.string()]),
  price_source: z.string().nullable(),
  price_source_url: z.string().nullable(),
  observed_date: z.date().nullable(),
  superseded_date: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});
