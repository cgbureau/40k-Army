import { z } from "zod";

export const rulesSourceTypeSchema = z.enum([
  "codex",
  "online",
  "expansion",
  "campaign_book",
  "other",
  "munitorum_field_manual",
  "codex_supplement",
  "balance_dataslate",
  "combat_patrol",
  "faction_pack",
  "chapter_approved_tournament_companion",
]);

export const rulesSourceSchema = z.object({
  id: z.ulid(),
  rules_source_slug: z.string(),
  rules_source_name: z.string(),
  rules_source_type: rulesSourceTypeSchema.nullable(),
  rules_source_version: z.string().nullable(),
  rules_source_version_slug: z.string().nullable(),
  release_date: z.date().nullable(),
  superseded_date: z.date().nullable(),
  game_edition_id: z.ulid(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});
