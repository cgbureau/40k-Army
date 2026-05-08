import type {
  GameEditionConfig,
  SeedDataset,
} from "@db_index/";
import { gameEditionId } from "@db_index/";

/**
 * First edition game seed record.
 */
export const firstEdition: GameEditionConfig = {
  id: gameEditionId("rt"),
  game_edition_name: "Rogue Trader",
  game_edition_alternate_name: null,
  game_edition_slug: "rt",
};

/**
 * Second edition game seed record.
 */
export const secondEdition: GameEditionConfig = {
  id: gameEditionId("2e"),
  game_edition_name: "2nd Edition",
  game_edition_alternate_name: null,
  game_edition_slug: "2e",
};

/**
 * Third edition game seed record.
 */
export const thirdEdition: GameEditionConfig = {
  id: gameEditionId("3e"),
  game_edition_name: "3rd Edition",
  game_edition_alternate_name: null,
  game_edition_slug: "3e",
};

/**
 * Fourth edition game seed record.
 */
export const fourthEdition: GameEditionConfig = {
  id: gameEditionId("4e"),
  game_edition_name: "4th Edition",
  game_edition_alternate_name: null,
  game_edition_slug: "4e",
};

/**
 * Fifth edition game seed record.
 */
export const fifthEdition: GameEditionConfig = {
  id: gameEditionId("5e"),
  game_edition_name: "5th Edition",
  game_edition_alternate_name: null,
  game_edition_slug: "5e",
};

/**
 * Sixth edition game seed record.
 */
export const sixthEdition: GameEditionConfig = {
  id: gameEditionId("6e"),
  game_edition_name: "6th Edition",
  game_edition_alternate_name: null,
  game_edition_slug: "6e",
};

/**
 * Seventh edition game seed record.
 */
export const seventhEdition: GameEditionConfig = {
  id: gameEditionId("7e"),
  game_edition_name: "7th Edition",
  game_edition_alternate_name: null,
  game_edition_slug: "7e",
};

/**
 * Eighth edition game seed record.
 */
export const eighthEdition: GameEditionConfig = {
  id: gameEditionId("8e"),
  game_edition_name: "8th Edition",
  game_edition_alternate_name: "Dark Imperium",
  game_edition_slug: "8e",
};

/**
 * Ninth edition game seed record.
 */
export const ninthEdition: GameEditionConfig = {
  id: gameEditionId("9e"),
  game_edition_name: "9th Edition",
  game_edition_alternate_name: "Indomitus",
  game_edition_slug: "9e",
};

/**
 * Tenth edition game seed record.
 */
export const tenthEdition: GameEditionConfig = {
  id: gameEditionId("10e"),
  game_edition_name: "10th Edition",
  game_edition_alternate_name: "Leviathan",
  game_edition_slug: "10e",
};

/**
 * Eleventh edition game seed record.
 */
export const eleventhEdition: GameEditionConfig = {
  id: gameEditionId("11e"),
  game_edition_name: "11th Edition",
  game_edition_alternate_name: "Armageddon",
  game_edition_slug: "11e",
};

/**
 * Typed seed dataset for the `game_editions` table.
 *
 * The dataset uses stable IDs from `ids.ts` so later seed datasets can safely
 * reference edition IDs without depending on runtime-generated values.
 */
export const gameEditionsDataset: SeedDataset<"game_editions"> = {
  table: "game_editions",
  records: [
    firstEdition,
    secondEdition,
    thirdEdition,
    fourthEdition,
    fifthEdition,
    sixthEdition,
    seventhEdition,
    eighthEdition,
    ninthEdition,
    tenthEdition,
    eleventhEdition,
  ] satisfies GameEditionConfig[],
};
