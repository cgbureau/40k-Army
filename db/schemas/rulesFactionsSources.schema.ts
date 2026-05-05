import { z } from "zod";

export const rulesFactionsSourcesSchema = z.object({
	id: z.ulid(),
	rules_faction_id: z.ulid(),
	rules_source_id: z.ulid(),
	source_relationship: z.enum([
		"primary",
		"supplement",
		"shared_base",
		"exclusive",
	]),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
