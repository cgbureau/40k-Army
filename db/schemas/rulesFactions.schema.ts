import { z } from "zod";

export const rulesFactionSchema = z.object({
	id: z.ulid(),
	super_faction_id: z.ulid(),
	rules_faction_slug: z.string(),
	rules_faction_name: z.string(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
