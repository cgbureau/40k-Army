import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `death_guard`.
 */

export const ChampionsOfContagionDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("champions_of_contagion_detachment"),
  detachment_name: "Champions of Contagion Detachment",
  detachment_slug: "champions_of_contagion_detachment",
  rules_source_id: rulesSourceId("faction_pack_death_guard_10e_v1_1"),
};


export const DeathLordsChosenDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("death_lords_chosen_detachment"),
  detachment_name: "Death Lord's Chosen Detachment",
  detachment_slug: "death_lords_chosen_detachment",
  rules_source_id: rulesSourceId("faction_pack_death_guard_10e_v1_1"),
};


export const FlyblownHostDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("flyblown_host_detachment"),
  detachment_name: "Flyblown Host Detachment",
  detachment_slug: "flyblown_host_detachment",
  rules_source_id: rulesSourceId("faction_pack_death_guard_10e_v1_1"),
};


export const MortarionsHammerDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("mortarions_hammer_detachment"),
  detachment_name: "Mortarion's Hammer Detachment",
  detachment_slug: "mortarions_hammer_detachment",
  rules_source_id: rulesSourceId("faction_pack_death_guard_10e_v1_1"),
};


export const ShamblerotVectoriumDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("shamblerot_vectorium_detachment"),
  detachment_name: "Shamblerot Vectorium Detachment",
  detachment_slug: "shamblerot_vectorium_detachment",
  rules_source_id: rulesSourceId("faction_pack_death_guard_10e_v1_1"),
};


export const TallybandSummonersDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("tallyband_summoners_detachment"),
  detachment_name: "Tallyband Summoners Detachment",
  detachment_slug: "tallyband_summoners_detachment",
  rules_source_id: rulesSourceId("faction_pack_death_guard_10e_v1_1"),
};


export const VirulentVectoriumDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("virulent_vectorium_detachment"),
  detachment_name: "Virulent Vectorium Detachment",
  detachment_slug: "virulent_vectorium_detachment",
  rules_source_id: rulesSourceId("faction_pack_death_guard_10e_v1_1"),
};


export const deathGuardDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    ChampionsOfContagionDetachmentDetachment,
    DeathLordsChosenDetachmentDetachment,
    FlyblownHostDetachmentDetachment,
    MortarionsHammerDetachmentDetachment,
    ShamblerotVectoriumDetachmentDetachment,
    TallybandSummonersDetachmentDetachment,
    VirulentVectoriumDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
