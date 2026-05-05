import { z } from "zod";

export const superFactionSchema = z.object({
	id: z.ulid(),
	super_faction_name: z.string(),
	super_faction_slug: z.string(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
