import { z } from "zod";

export const playerSchema = z.object({
	id: z.ulid(),
	player_name: z.string(),
	player_username: z.string(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
