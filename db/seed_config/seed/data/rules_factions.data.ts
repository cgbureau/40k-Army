import type {
  RulesFactionConfig,
  SeedDataset,
} from "../../types/_index.types";
import { rulesFactionId, superFactionId } from "../ids";

export const SpaceMarinesRulesFaction: RulesFactionConfig = {
  id: rulesFactionId("space_marines"),
  super_faction_id: superFactionId("imperium"),
  rules_faction_slug: "space_marines",
  rules_faction_name: "Space Marines",
};

export const BloodAngelsRulesFaction: RulesFactionConfig = {
  id: rulesFactionId("blood_angels"),
  super_faction_id: superFactionId("imperium"),
  rules_faction_slug: "blood_angels",
  rules_faction_name: "Blood Angels",
};

/**
 * Typed seed dataset for the `rules_factions` table.
 */
export const rulesFactionsDataset: SeedDataset<"rules_factions"> = {
  table: "rules_factions",
  records: [
    SpaceMarinesRulesFaction,
    BloodAngelsRulesFaction,
  ] satisfies RulesFactionConfig[],
};
