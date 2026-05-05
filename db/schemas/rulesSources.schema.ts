import { z } from "zod";

export const rulesSourceSchema = z.object({
	id: z.ulid(),
	rules_source_slug: z.string(),
	rules_source_name: z.string(),
	rules_source_type: z
		.enum([
			"codex",
			"online",
			"expansion",
			"campaign_book",
			"other",
			"munitorum_field_manual",
			"codex_supplement",
		])
		.nullable(),
	release_date: z.date().nullable(),
	superseded_date: z.date().nullable(),
	game_edition_id: z.ulid(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
