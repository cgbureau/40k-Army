import { z } from "zod";

/** Matches Prisma `SourceRelationship`. */
export const sourceRelationshipSchema = z.enum([
	"primary",
	"supplement",
	"errata_faq",
	"points",
	"base_sizes",
	"combat_patrol",
]);

/** Matches Prisma `SourceScope`. */
export const sourceScopeSchema = z.enum([
	"global",
	"shared_base",
	"exclusive",
]);

export const rulesFactionsSourcesSchema = z.object({
	id: z.ulid(),
	rules_faction_id: z.ulid(),
	rules_source_id: z.ulid(),
	source_relationship: sourceRelationshipSchema,
	source_scope: sourceScopeSchema,
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
