import { z } from "zod";

export const modelSchema = z.object({
	id: z.ulid(),
	model_slug: z.string(),
	model_name: z.string(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});

export const unitModelSchema = z.object({
	id: z.ulid(),
	unit_id: z.ulid(),
	model_id: z.ulid(),
	minimum_model_count: z.number().int(),
	maximum_model_count: z.number().int(),
	effective_date: z.date().nullable(),
	superseded_date: z.date().nullable(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
