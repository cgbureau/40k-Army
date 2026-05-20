import type { RulesSourceConfig } from "../../../../types/_index.types";
import { global10eRulesSources } from "./global.rules_sources.data";
import { bloodAngels10eRulesSources } from "./imperium/blood_angels.rules_sources.data";
import { spaceMarines10eRulesSources } from "./imperium/space_marines.rules_sources.data";

export const rulesSources10e = [
  ...global10eRulesSources,
  ...spaceMarines10eRulesSources,
  ...bloodAngels10eRulesSources,
] satisfies RulesSourceConfig[];
