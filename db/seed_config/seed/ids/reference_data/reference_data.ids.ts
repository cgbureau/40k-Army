/**
 * Canonical game-edition seed slugs used by seed data and relationship fixtures.
 *
 * These slugs are intentionally stable and should match the corresponding
 * `game_edition_slug` values in the game edition seed dataset.
 */
type GameEditionSeedSlug =
  | "rt"
  | "2e"
  | "3e"
  | "4e"
  | "5e"
  | "6e"
  | "7e"
  | "8e"
  | "9e"
  | "10e"
  | "11e";

/**
 * Fixed ULIDs for canonical game-edition seed records.
 *
 * The values were generated once and then checked in so repeated seed runs use
 * the same primary keys. Do not replace these with runtime `ulid()` calls.
 */
const gameEditionSeedIds: Record<GameEditionSeedSlug, string> = {
  rt: "01KQZTSBVHY3BV4T71G630NW0Q",
  "2e": "01KQZTSBVNGWT7Y8XAQTVFV02X",
  "3e": "01KQZTSBVN39YRT5GVB9QQ64HF",
  "4e": "01KQZTSBVNXHYKMJWFXV03MWM2",
  "5e": "01KQZTSBVNDHGMYGTZ3DW86K1V",
  "6e": "01KQZTSBVN1P7E8HZF381JHY33",
  "7e": "01KQZTSBVN754VS4CN5CVKHWR9",
  "8e": "01KQZTSBVNKZ5VBS5A1WQX475Q",
  "9e": "01KQZTSBVN0A66ZRZ7GBD3MK3S",
  "10e": "01KQZTSBVNDFJZ0NN5WCC2Z026",
  "11e": "01KQZTSBVNYZ7MZNQXQ7GTRGBM",
};

/**
 * Returns the stable database ID for a canonical game edition seed slug.
 *
 * @param slug - Canonical game edition slug such as `rt`, `10e`, or `11e`.
 * @returns The fixed ULID assigned to that game edition.
 */
export const gameEditionId = (slug: GameEditionSeedSlug): string => {
  return gameEditionSeedIds[slug];
};

/**
 * Canonical game size seed slugs used by seed data and relationship fixtures.
 *
 * These slugs are intentionally stable and should match the corresponding
 * `game_size_slug` values in the game size seed dataset.
 */

type GameSizeSeedSlug =
  | "combat_patrol"
  | "incursion"
  | "strike_force"
  | "onslaught";

const gameSizeSeedIds: Record<GameSizeSeedSlug, string> = {
  combat_patrol: "01KQZTSBVHY3BV4T71G630NW0Q",
  incursion: "01KQZTSBVNGWT7Y8XAQTVFV02X",
  strike_force: "01KQZTSBVN39YRT5GVB9QQ64HF",
  onslaught: "01KQZTSBVNXHYKMJWFXV03MWM2",
};

export const gameSizeId = (slug: GameSizeSeedSlug): string => {
  return gameSizeSeedIds[slug];
};
