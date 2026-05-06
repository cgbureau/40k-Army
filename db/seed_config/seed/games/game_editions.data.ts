import type {
  GameEditionConfig,
  SeedDataset,
} from "@db/seed_config/types/seed-types";
import { gameEditionId } from "../ids";

export const firstEdition: GameEditionConfig = {
  id: gameEditionId("rt"),
  game_edition_name: "Rogue Trader",
  game_edition_alternate_name: null,
  game_edition_slug: "rt",
};

export const secondEdition: GameEditionConfig = {
  id: gameEditionId("2e"),
  game_edition_name: "2nd Edition",
  game_edition_alternate_name: null,
  game_edition_slug: "2e",
};

export const thirdEdition: GameEditionConfig = {
  id: gameEditionId("3e"),
  game_edition_name: "3rd Edition",
  game_edition_alternate_name: null,
  game_edition_slug: "3e",
};

export const fourthEdition: GameEditionConfig = {
  id: gameEditionId("4e"),
  game_edition_name: "4th Edition",
  game_edition_alternate_name: null,
  game_edition_slug: "4e",
};

export const fifthEdition: GameEditionConfig = {
  id: gameEditionId("5e"),
  game_edition_name: "5th Edition",
  game_edition_alternate_name: null,
  game_edition_slug: "5e",
};

export const sixthEdition: GameEditionConfig = {
  id: gameEditionId("6e"),
  game_edition_name: "6th Edition",
  game_edition_alternate_name: null,
  game_edition_slug: "6e",
};

export const seventhEdition: GameEditionConfig = {
  id: gameEditionId("7e"),
  game_edition_name: "7th Edition",
  game_edition_alternate_name: null,
  game_edition_slug: "7e",
};

export const eighthEdition: GameEditionConfig = {
  id: gameEditionId("8e"),
  game_edition_name: "8th Edition",
  game_edition_alternate_name: "Dark Imperium",
  game_edition_slug: "8e",
};

export const ninthEdition: GameEditionConfig = {
  id: gameEditionId("9e"),
  game_edition_name: "9th Edition",
  game_edition_alternate_name: "Indomitus",
  game_edition_slug: "9e",
};

export const tenthEdition: GameEditionConfig = {
  id: gameEditionId("10e"),
  game_edition_name: "10th Edition",
  game_edition_alternate_name: "Leviathan",
  game_edition_slug: "10e",
};

export const eleventhEdition: GameEditionConfig = {
  id: gameEditionId("11e"),
  game_edition_name: "11th Edition",
  game_edition_alternate_name: "Armageddon",
  game_edition_slug: "11e",
};

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
  ],
};
