import { z } from "zod";

export const detachmentSchema = z.object({
	id: z.ulid(),
	detachment_name: z.string(),
	detachment_slug: z.string(),
	rules_source_id: z.ulid(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});

export const rulesFactionDetachmentSchema = z.object({
	id: z.ulid(),
	rules_faction_id: z.ulid(),
	detachment_id: z.ulid(),
	detachment_access_type: z
		.enum(["shared", "inherited", "exclusive"])
		.nullable(),
	effective_date: z.date().nullable(),
	superseded_date: z.date().nullable(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});

export const detachmentUnitKeywordSchema = z.object({
	id: z.ulid(),
	detachment_id: z.ulid(),
	unit_id: z.ulid(),
	keyword_id: z.ulid(),
	effective_date: z.date().nullable(),
	superseded_date: z.date().nullable(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
