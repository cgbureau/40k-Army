import { z } from "zod";

export const weaponTypeSchema = z.enum(["ranged", "melee"]);

export const weaponSchema = z.object({
  id: z.ulid(),
  weapon_slug: z.string(),
  weapon_name: z.string(),
  weapon_type: weaponTypeSchema,
  created_at: z.date(),
  updated_at: z.date().nullable(),
});

export const weaponProfileSchema = z.object({
  id: z.ulid(),
  weapon_profile_slug: z.string(),
  weapon_id: z.ulid(),
  game_edition_id: z.ulid(),
  rules_source_id: z.ulid(),
  range: z.string(),
  attacks: z.string(),
  skill: z.string(),
  strength: z.string(),
  armor_penetration: z.number().int(),
  damage: z.string(),
  effective_date: z.date().nullable(),
  superseded_date: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});

export const weaponProfileKeywordSchema = z.object({
  id: z.ulid(),
  weapon_profile_id: z.ulid(),
  keyword_id: z.ulid(),
  keyword_parameter: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});

export const unitWeaponSchema = z.object({
  id: z.ulid(),
  unit_id: z.ulid(),
  model_id: z.ulid().nullable(),
  weapon_profile_id: z.ulid(),
  game_edition_id: z.ulid(),
  rules_source_id: z.ulid(),
  is_default: z.boolean(),
  effective_date: z.date().nullable(),
  superseded_date: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});
