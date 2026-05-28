import { z } from "zod";

export const keywordTypeSchema = z.enum(["unit", "faction", "model", "rules"]);

export const keywordSchema = z.object({
  id: z.ulid(),
  keyword_slug: z.string(),
  keyword_name: z.string(),
  keyword_type: keywordTypeSchema,
  created_at: z.date(),
  updated_at: z.date().nullable(),
});

export const unitKeywordSchema = z.object({
  id: z.ulid(),
  unit_id: z.ulid(),
  keyword_id: z.ulid(),
  model_id: z.ulid().nullable(),
  game_edition_id: z.ulid(),
  rules_source_id: z.ulid(),
  effective_date: z.date().nullable(),
  superseded_date: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});
