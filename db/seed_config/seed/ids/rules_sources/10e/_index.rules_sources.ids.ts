import { generated10eRulesSourceSeedIds } from "./generated.rules_sources.ids";

const rulesSourceSeedIds = {
  ...generated10eRulesSourceSeedIds,
};

export type RulesSourceSeedSlug = keyof typeof rulesSourceSeedIds;

export const rulesSourceId = (slug: RulesSourceSeedSlug): string => {
  return rulesSourceSeedIds[slug];
};
