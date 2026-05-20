import { global10eRulesSourceSeedIds } from "./global.rules_sources.ids";
import { bloodAngels10eRulesSourceSeedIds } from "./imperium/blood_angels.rules_sources.ids";
import { spaceMarines10eRulesSourceSeedIds } from "./imperium/space_marines.rules_sources.ids";

const rulesSourceSeedIds = {
  ...global10eRulesSourceSeedIds,
  ...spaceMarines10eRulesSourceSeedIds,
  ...bloodAngels10eRulesSourceSeedIds,
};

export type RulesSourceSeedSlug = keyof typeof rulesSourceSeedIds;

export const rulesSourceId = (slug: RulesSourceSeedSlug): string => {
  return rulesSourceSeedIds[slug];
};
