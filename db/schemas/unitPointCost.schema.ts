import { z } from "zod";

export const unitPointCostSchema = z.object({
	id: z.ulid(),
	unit_point_cost_slug: z.string(),
	game_edition_id: z.ulid(),
	unit_id: z.ulid(),
	rules_source_id: z.ulid(),
	minimum_model_count: z.number().int(),
	maximum_model_count: z.number().int(),
	unit_points: z.number().int(),
	effective_date: z.date(),
	superseded_date: z.date().nullable(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
