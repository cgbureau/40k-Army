import { z } from "zod";

export const playerSchema = z.object({
	id: z.ulid(),
	player_first_name: z.string(),
	player_last_name: z.string(),
	player_slug: z.string(),
	player_username: z.string(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
