import { z } from "zod";

export const playerCollectionSchema = z.object({
	id: z.ulid(),
	player_id: z.ulid(),
	collection_slug: z.string(),
	collection_name: z.string(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});

export const playerCollectionModelSchema = z.object({
	id: z.ulid(),
	player_collection_id: z.ulid(),
	rules_faction_id: z.ulid().nullable(),
	model_id: z.ulid(),
	model_display_name: z.string(),
	model_count: z.number().int().nullable(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
