import { z } from "zod";

export const abilityTypeSchema = z.enum([
	"core",
	"faction",
	"datasheet",
	"wargear",
	"other",
]);

export const abilitySchema = z.object({
	id: z.ulid(),
	ability_slug: z.string(),
	ability_name: z.string(),
	ability_type: abilityTypeSchema,
	created_at: z.date(),
	updated_at: z.date().nullable(),
});

export const unitAbilitySchema = z.object({
	id: z.ulid(),
	unit_id: z.ulid(),
	ability_id: z.ulid(),
	game_edition_id: z.ulid(),
	rules_source_id: z.ulid(),
	rules_text: z.string(),
	effective_date: z.date().nullable(),
	superseded_date: z.date().nullable(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
