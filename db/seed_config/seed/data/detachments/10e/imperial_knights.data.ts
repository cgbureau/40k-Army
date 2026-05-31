import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `imperial_knights`.
 */

export const FreebladeCompanyDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("freeblade_company_detachment"),
  detachment_name: "Freeblade Company Detachment",
  detachment_slug: "freeblade_company_detachment",
  rules_source_id: rulesSourceId("codex_imperial_knights_10e"),
};


export const GateWardenLanceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("gate_warden_lance_detachment"),
  detachment_name: "Gate Warden Lance Detachment",
  detachment_slug: "gate_warden_lance_detachment",
  rules_source_id: rulesSourceId("codex_imperial_knights_10e"),
};


export const QuestorForgepactDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("questor_forgepact_detachment"),
  detachment_name: "Questor Forgepact Detachment",
  detachment_slug: "questor_forgepact_detachment",
  rules_source_id: rulesSourceId("codex_imperial_knights_10e"),
};


export const QuestorisCompanionsDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("questoris_companions_detachment"),
  detachment_name: "Questoris Companions Detachment",
  detachment_slug: "questoris_companions_detachment",
  rules_source_id: rulesSourceId("codex_imperial_knights_10e"),
};


export const SpearheadAtArmsDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("spearhead_at_arms_detachment"),
  detachment_name: "Spearhead-at-Arms Detachment",
  detachment_slug: "spearhead_at_arms_detachment",
  rules_source_id: rulesSourceId("codex_imperial_knights_10e"),
};


export const ValourstrikeLanceDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("valourstrike_lance_detachment"),
  detachment_name: "Valourstrike Lance Detachment",
  detachment_slug: "valourstrike_lance_detachment",
  rules_source_id: rulesSourceId("codex_imperial_knights_10e"),
};


export const imperialKnightsDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    FreebladeCompanyDetachmentDetachment,
    GateWardenLanceDetachmentDetachment,
    QuestorForgepactDetachmentDetachment,
    QuestorisCompanionsDetachmentDetachment,
    SpearheadAtArmsDetachmentDetachment,
    ValourstrikeLanceDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
