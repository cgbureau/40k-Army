import { z } from "zod";

/** Matches Prisma `SourceRelationship`. */
export const sourceRelationshipSchema = z.enum([
	"primary",
	"supplement",
	"shared_base",
	"exclusive",
]);

export const rulesFactionsSourcesSchema = z.object({
	id: z.ulid(),
	rules_faction_id: z.ulid(),
	rules_source_id: z.ulid(),
	source_relationship: sourceRelationshipSchema,
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
