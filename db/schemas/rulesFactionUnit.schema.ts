import { z } from "zod";
import { accessTypeSchema } from "./accessType.schema";

export const rulesFactionUnitSchema = z.object({
	id: z.ulid(),
	rules_faction_unit_slug: z.string(),
	rules_faction_id: z.ulid(),
	unit_id: z.ulid(),
	unit_access_type: accessTypeSchema.nullable(),
	rules_source_id: z.ulid(),
	effective_date: z.date().nullable(),
	superseded_date: z.date().nullable(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
