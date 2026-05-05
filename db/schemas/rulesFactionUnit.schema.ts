import { z } from "zod";

export const rulesFactionUnitSchema = z.object({
	id: z.ulid(),
	rules_faction_unit_slug: z.string(),
	rules_faction_id: z.ulid(),
	unit_id: z.ulid(),
	unit_access_type: z.enum(["shared", "inherited", "exclusive"]).nullable(),
	rules_source_id: z.ulid(),
	effective_date: z.date().nullable(),
	superseded_date: z.date().nullable(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
