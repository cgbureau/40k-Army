import { z } from "zod";

export const unitSelectionLimitKindSchema = z.enum([
	"epic",
	"battleline",
	"other",
]);

export const unitSelectionLimitSchema = z.object({
	id: z.ulid(),
	game_edition_id: z.ulid(),
	game_size_id: z.ulid(),
	keyword_id: z.ulid().nullable(),
	limit_kind: unitSelectionLimitKindSchema,
	max_instances: z.number().int(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
