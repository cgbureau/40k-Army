import type { DetachmentConfig, SeedDataset } from "../../../../types/_index.types";
import { detachmentId, rulesSourceId } from "../../../ids";

/**
 * 10th edition detachment rows owned by `astra_militarum`.
 */

export const ArmouredInfantryDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("armoured_infantry_detachment"),
  detachment_name: "Armoured Infantry Detachment",
  detachment_slug: "armoured_infantry_detachment",
  rules_source_id: rulesSourceId("codex_astra_militarum_10e"),
};


export const BridgeheadStrikeDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("bridgehead_strike_detachment"),
  detachment_name: "Bridgehead Strike Detachment",
  detachment_slug: "bridgehead_strike_detachment",
  rules_source_id: rulesSourceId("codex_astra_militarum_10e"),
};


export const CombinedArmsDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("combined_arms_detachment"),
  detachment_name: "Combined Arms Detachment",
  detachment_slug: "combined_arms_detachment",
  rules_source_id: rulesSourceId("codex_astra_militarum_10e"),
};


export const GrizzledCompanyDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("grizzled_company_detachment"),
  detachment_name: "Grizzled Company Detachment",
  detachment_slug: "grizzled_company_detachment",
  rules_source_id: rulesSourceId("codex_astra_militarum_10e"),
};


export const HammerOfTheEmperorDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("hammer_of_the_emperor_detachment"),
  detachment_name: "Hammer of the Emperor Detachment",
  detachment_slug: "hammer_of_the_emperor_detachment",
  rules_source_id: rulesSourceId("codex_astra_militarum_10e"),
};


export const MechanisedAssaultDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("mechanised_assault_detachment"),
  detachment_name: "Mechanised Assault Detachment",
  detachment_slug: "mechanised_assault_detachment",
  rules_source_id: rulesSourceId("codex_astra_militarum_10e"),
};


export const ReconElementDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("recon_element_detachment"),
  detachment_name: "Recon Element Detachment",
  detachment_slug: "recon_element_detachment",
  rules_source_id: rulesSourceId("codex_astra_militarum_10e"),
};


export const SiegeRegimentDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("siege_regiment_detachment"),
  detachment_name: "Siege Regiment Detachment",
  detachment_slug: "siege_regiment_detachment",
  rules_source_id: rulesSourceId("codex_astra_militarum_10e"),
};


export const SteelHammerDetachmentDetachment: DetachmentConfig = {
  id: detachmentId("steel_hammer_detachment"),
  detachment_name: "Steel Hammer Detachment",
  detachment_slug: "steel_hammer_detachment",
  rules_source_id: rulesSourceId("codex_astra_militarum_10e"),
};


export const astraMilitarumDetachments10e: SeedDataset<"detachments"> = {
  table: "detachments",
  records: [
    ArmouredInfantryDetachmentDetachment,
    BridgeheadStrikeDetachmentDetachment,
    CombinedArmsDetachmentDetachment,
    GrizzledCompanyDetachmentDetachment,
    HammerOfTheEmperorDetachmentDetachment,
    MechanisedAssaultDetachmentDetachment,
    ReconElementDetachmentDetachment,
    SiegeRegimentDetachmentDetachment,
    SteelHammerDetachmentDetachment,
  ] satisfies DetachmentConfig[],
};
