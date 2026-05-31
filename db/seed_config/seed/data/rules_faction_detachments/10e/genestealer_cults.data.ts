import type {
  RulesFactionDetachmentConfig,
  SeedDataset,
} from "../../../../types/_index.types";
import { detachmentId, rulesFactionDetachmentId, rulesFactionId } from "../../../ids";

/**
 * 10th edition rules faction detachment rows for `genestealer_cults`.
 */

export const GenestealerCultsBiosancticBroodsurgeDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("genestealer_cults__biosanctic_broodsurge_detachment"),
  rules_faction_id: rulesFactionId("genestealer_cults"),
  detachment_id: detachmentId("biosanctic_broodsurge_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const GenestealerCultsBroodBrotherAuxiliaDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("genestealer_cults__brood_brother_auxilia_detachment"),
  rules_faction_id: rulesFactionId("genestealer_cults"),
  detachment_id: detachmentId("brood_brother_auxilia_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const GenestealerCultsFinalDayDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("genestealer_cults__final_day_detachment"),
  rules_faction_id: rulesFactionId("genestealer_cults"),
  detachment_id: detachmentId("final_day_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const GenestealerCultsHostOfAscensionDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("genestealer_cults__host_of_ascension_detachment"),
  rules_faction_id: rulesFactionId("genestealer_cults"),
  detachment_id: detachmentId("host_of_ascension_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const GenestealerCultsOutlanderClawDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("genestealer_cults__outlander_claw_detachment"),
  rules_faction_id: rulesFactionId("genestealer_cults"),
  detachment_id: detachmentId("outlander_claw_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const GenestealerCultsXenocreedCongregationDetachmentRulesFactionDetachment: RulesFactionDetachmentConfig = {
  id: rulesFactionDetachmentId("genestealer_cults__xenocreed_congregation_detachment"),
  rules_faction_id: rulesFactionId("genestealer_cults"),
  detachment_id: detachmentId("xenocreed_congregation_detachment"),
  detachment_access_type: "exclusive",
  effective_date: null,
  superseded_date: null,
};


export const genestealerCultsRulesFactionDetachments10e: SeedDataset<"rules_faction_detachments"> = {
  table: "rules_faction_detachments",
  records: [
    GenestealerCultsBiosancticBroodsurgeDetachmentRulesFactionDetachment,
    GenestealerCultsBroodBrotherAuxiliaDetachmentRulesFactionDetachment,
    GenestealerCultsFinalDayDetachmentRulesFactionDetachment,
    GenestealerCultsHostOfAscensionDetachmentRulesFactionDetachment,
    GenestealerCultsOutlanderClawDetachmentRulesFactionDetachment,
    GenestealerCultsXenocreedCongregationDetachmentRulesFactionDetachment,
  ] satisfies RulesFactionDetachmentConfig[],
};
