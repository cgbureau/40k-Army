import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `space_wolves`.
 */

export const ChampionsOfFenrisDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("champions_of_fenris_detachment"),
  detachment_name: "Champions of Fenris Detachment",
  detachment_slug: "champions_of_fenris_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const SagaOfTheBeastslayerDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("saga_of_the_beastslayer_detachment"),
  detachment_name: "Saga of the Beastslayer Detachment",
  detachment_slug: "saga_of_the_beastslayer_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const SagaOfTheBoldDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("saga_of_the_bold_detachment"),
  detachment_name: "Saga of the Bold Detachment",
  detachment_slug: "saga_of_the_bold_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const SagaOfTheGreatWolfDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("saga_of_the_great_wolf_detachment"),
  detachment_name: "Saga of the Great Wolf Detachment",
  detachment_slug: "saga_of_the_great_wolf_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const SagaOfTheHunterDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("saga_of_the_hunter_detachment"),
  detachment_name: "Saga of the Hunter Detachment",
  detachment_slug: "saga_of_the_hunter_detachment",
  rules_source_id: rulesSourceId("codex_space_marines_10e"),
};


export const spaceWolvesDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    ChampionsOfFenrisDetachmentDetachment,
    SagaOfTheBeastslayerDetachmentDetachment,
    SagaOfTheBoldDetachmentDetachment,
    SagaOfTheGreatWolfDetachmentDetachment,
    SagaOfTheHunterDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
