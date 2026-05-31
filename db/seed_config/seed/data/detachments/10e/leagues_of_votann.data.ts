import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `leagues_of_votann`.
 */

export const BrandfastOathbandDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("brandfast_oathband_detachment"),
  detachment_name: "Brandfast Oathband Detachment",
  detachment_slug: "brandfast_oathband_detachment",
  rules_source_id: rulesSourceId("codex_leagues_of_votann_10e"),
};


export const DalveAssaultShiftDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("dalve_assault_shift_detachment"),
  detachment_name: "D\u00ealve Assault Shift Detachment",
  detachment_slug: "dalve_assault_shift_detachment",
  rules_source_id: rulesSourceId("codex_leagues_of_votann_10e"),
};


export const HearthbandDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("hearthband_detachment"),
  detachment_name: "Hearthband Detachment",
  detachment_slug: "hearthband_detachment",
  rules_source_id: rulesSourceId("codex_leagues_of_votann_10e"),
};


export const HearthfyreArsenalDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("hearthfyre_arsenal_detachment"),
  detachment_name: "Hearthfyre Arsenal Detachment",
  detachment_slug: "hearthfyre_arsenal_detachment",
  rules_source_id: rulesSourceId("codex_leagues_of_votann_10e"),
};


export const MercenaryOathbandDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("mercenary_oathband_detachment"),
  detachment_name: "Mercenary Oathband Detachment",
  detachment_slug: "mercenary_oathband_detachment",
  rules_source_id: rulesSourceId("codex_leagues_of_votann_10e"),
};


export const NeedgardOathbandDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("needgard_oathband_detachment"),
  detachment_name: "Needga\u00e2rd Oathband Detachment",
  detachment_slug: "needgard_oathband_detachment",
  rules_source_id: rulesSourceId("codex_leagues_of_votann_10e"),
};


export const PersecutionProspectDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("persecution_prospect_detachment"),
  detachment_name: "Persecution Prospect Detachment",
  detachment_slug: "persecution_prospect_detachment",
  rules_source_id: rulesSourceId("codex_leagues_of_votann_10e"),
};


export const leaguesOfVotannDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    BrandfastOathbandDetachmentDetachment,
    DalveAssaultShiftDetachmentDetachment,
    HearthbandDetachmentDetachment,
    HearthfyreArsenalDetachmentDetachment,
    MercenaryOathbandDetachmentDetachment,
    NeedgardOathbandDetachmentDetachment,
    PersecutionProspectDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
