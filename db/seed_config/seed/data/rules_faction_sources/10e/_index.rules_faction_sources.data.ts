import type { RulesFactionSourceConfig } from "../../../../types/_index.types";
import { bloodAngels10eRulesFactionSources } from "./imperium/blood_angels.rules_faction_sources.data";

export const rulesFactionSources10e = [
  ...bloodAngels10eRulesFactionSources,
] satisfies RulesFactionSourceConfig[];
