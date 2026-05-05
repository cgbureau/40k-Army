import { z } from "zod";

export const gameEditionSchema = z.object({
	id: z.ulid(),
	game_edition_name: z.string(),
	game_edition_alternate_name: z.string().nullable(),
	game_edition_slug: z.string(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});

export const gameSizeSchema = z.object({
	id: z.ulid(),
	game_size_name: z.string(),
	game_size_slug: z.string(),
	minimum_points: z.number().int().nullable(),
	maximum_points: z.number().int().nullable(),
	game_edition_id: z.ulid(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
