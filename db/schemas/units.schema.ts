import { z } from "zod";

export const unitSchema = z.object({
	id: z.ulid(),
	unit_name: z.string(),
	unit_slug: z.string(),
	is_legends: z.boolean().default(false),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
