import { z } from "zod";

export const playerArmyListSchema = z.object({
	id: z.ulid(),
	player_army_list_slug: z.string(),
	player_id: z.ulid(),
	rules_faction_id: z.ulid(),
	detachment_id: z.ulid(),
	faction_display_name: z.string(),
	list_name: z.string(),
	game_size_id: z.ulid(),
	points_limit: z.number().int(),
	points_total: z.number().int(),
	game_edition_id: z.ulid(),
	rules_as_of_date: z.date().nullable(),
	points_as_of_date: z.date().nullable(),
	last_recalculation_date: z.date().nullable(),
	last_recalculation_points: z.number().int().nullable(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});

export const playerArmyListUnitSchema = z.object({
	id: z.ulid(),
	player_army_list_id: z.ulid(),
	unit_id: z.ulid(),
	selected_model_count: z.number().int(),
	unit_display_name: z.string(),
	unit_point_cost_id: z.ulid(),
	copied_points_cost: z.number().int(),
	points_source_id: z.ulid().nullable(),
	points_effective_date: z.date().nullable(),
	points_superseded_date: z.date().nullable(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
});
