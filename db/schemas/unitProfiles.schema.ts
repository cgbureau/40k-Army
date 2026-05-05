import { z } from "zod";

export const unitProfileSchema = z.object({
	id: z.ulid(),
	unit_profile_slug: z.string(),
	unit_profile_name: z.string(),
	game_edition_id: z.ulid(),
	unit_id: z.ulid(),
	model_id: z.ulid().nullable(),
	rules_source_id: z.ulid(),
	effective_date: z.date().nullable(),
	superseded_date: z.date().nullable(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});

export const unitProfileStatSchema = z.object({
	id: z.ulid(),
	unit_profile_id: z.ulid(),
	stat_key: z.string(),
	stat_value: z.string(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
