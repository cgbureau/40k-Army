import { z } from "zod";

export const leaderEligibilitySchema = z.object({
	id: z.ulid(),
	leader_unit_id: z.ulid(),
	target_unit_id: z.ulid().nullable(),
	game_edition_id: z.ulid(),
	rules_source_id: z.ulid(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});

export const leaderEligibilityKeywordSchema = z.object({
	id: z.ulid(),
	leader_eligibility_id: z.ulid(),
	keyword_id: z.ulid(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
